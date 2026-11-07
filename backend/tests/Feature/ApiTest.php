<?php

namespace Tests\Feature;

use App\Models\Movie;
use App\Models\Review;
use App\Models\Studio;
use App\Models\User;
use App\Services\JwtService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Pagrindinių API taisyklių testai: php artisan test
 */
class ApiTest extends TestCase
{
    use RefreshDatabase;

    private function studio(array $overrides = []): Studio
    {
        return Studio::create([
            'name' => 'Studio '.uniqid(),
            'description' => 'A test studio with a long enough description.',
            'country' => 'Lithuania',
            'founded_year' => 1990,
            ...$overrides,
        ]);
    }

    private function movie(Studio $studio): Movie
    {
        return $studio->movies()->create([
            'title' => 'Test Movie',
            'type' => 'movie',
            'genre' => 'drama',
            'synopsis' => 'A test synopsis that is long enough.',
            'director' => 'Test Director',
            'release_date' => '2020-01-01',
            'runtime_minutes' => 100,
            'age_rating' => '13+',
        ]);
    }

    private function review(Movie $movie, User $author): Review
    {
        $review = new Review(['rating' => 8, 'title' => 'Good one', 'body' => 'A review body that is long enough.']);
        $review->user_id = $author->id;
        $movie->reviews()->save($review);

        return $review;
    }

    private function bearer(User $user): array
    {
        return ['Authorization' => 'Bearer '.app(JwtService::class)->createAccessToken($user)];
    }

    public function test_studios_list_is_paginated_and_has_hypermedia_links(): void
    {
        foreach (range(1, 3) as $i) {
            $this->studio();
        }

        $this->getJson('/api/v1/studios?per_page=2')
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonStructure(['_links' => ['self', 'first', 'next', 'last'], 'data' => [['_links' => ['self', 'movies']]]]);
    }

    public function test_missing_resource_returns_404_problem_details(): void
    {
        $this->getJson('/api/v1/studios/999')
            ->assertNotFound()
            ->assertHeader('Content-Type', 'application/problem+json')
            ->assertJsonPath('detail', 'Studio #999 was not found.');
    }

    public function test_movie_of_another_studio_is_not_found(): void
    {
        $movie = $this->movie($this->studio());
        $otherStudio = $this->studio();

        $this->getJson("/api/v1/studios/{$otherStudio->id}/movies/{$movie->id}")->assertNotFound();
        $this->getJson("/api/v1/studios/{$movie->studio_id}/movies/{$movie->id}")->assertOk();
    }

    public function test_invalid_query_parameters_return_400(): void
    {
        $this->getJson('/api/v1/movies?page=abc&genre=opera')
            ->assertStatus(400)
            ->assertJsonStructure(['errors' => ['page', 'genre']]);
    }

    public function test_malformed_json_returns_400_and_invalid_data_returns_422(): void
    {
        $admin = User::factory()->admin()->create();

        $this->call('POST', '/api/v1/studios', [], [], [], [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_AUTHORIZATION' => $this->bearer($admin)['Authorization'],
        ], '{"name": ')->assertStatus(400);

        $this->postJson('/api/v1/studios', ['name' => ''], $this->bearer($admin))
            ->assertUnprocessable()
            ->assertJsonStructure(['errors' => ['name', 'description', 'country', 'founded_year']]);
    }

    public function test_only_admin_can_create_studios(): void
    {
        $data = ['name' => 'New Studio', 'description' => 'A brand new studio for testing.', 'country' => 'Lithuania', 'founded_year' => 2000];

        $this->postJson('/api/v1/studios', $data)->assertUnauthorized();
        $this->postJson('/api/v1/studios', $data, $this->bearer(User::factory()->create()))->assertForbidden();

        $this->postJson('/api/v1/studios', $data, $this->bearer(User::factory()->admin()->create()))
            ->assertCreated()
            ->assertHeader('Location')
            ->assertJsonPath('data.name', 'New Studio');
    }

    public function test_admin_can_update_and_delete_a_studio(): void
    {
        $admin = User::factory()->admin()->create();
        $studio = $this->studio();

        $this->patchJson("/api/v1/studios/{$studio->id}", ['country' => 'Japan'], $this->bearer($admin))
            ->assertOk()
            ->assertJsonPath('data.country', 'Japan');

        $this->deleteJson("/api/v1/studios/{$studio->id}", [], $this->bearer($admin))->assertNoContent();
        $this->getJson("/api/v1/studios/{$studio->id}")->assertNotFound();
    }

    public function test_member_can_review_a_movie_only_once(): void
    {
        $member = User::factory()->create();
        $movie = $this->movie($this->studio());
        $url = "/api/v1/studios/{$movie->studio_id}/movies/{$movie->id}/reviews";
        $data = ['rating' => 9, 'title' => 'Loved it', 'body' => 'Beautiful and moving from start to end.'];

        $this->postJson($url, $data, $this->bearer($member))
            ->assertCreated()
            ->assertJsonPath('data.author.id', $member->id);

        $this->postJson($url, $data, $this->bearer($member))->assertStatus(409);
    }

    public function test_only_the_author_can_edit_a_review_and_admin_can_delete_it(): void
    {
        $author = User::factory()->create();
        $movie = $this->movie($this->studio());
        $review = $this->review($movie, $author);
        $url = "/api/v1/studios/{$movie->studio_id}/movies/{$movie->id}/reviews/{$review->id}";

        $this->patchJson($url, ['rating' => 1], $this->bearer(User::factory()->create()))->assertForbidden();
        $this->patchJson($url, ['rating' => 1], $this->bearer(User::factory()->admin()->create()))->assertForbidden();
        $this->patchJson($url, ['rating' => 10], $this->bearer($author))->assertOk()->assertJsonPath('data.rating', 10);
        $this->deleteJson($url, [], $this->bearer(User::factory()->admin()->create()))->assertNoContent();
    }

    public function test_access_token_contains_user_id_and_role(): void
    {
        $user = User::factory()->create(['email' => 'rasa@example.com', 'password' => 'Secret123']);

        $token = $this->postJson('/api/v1/auth/login', ['email' => 'rasa@example.com', 'password' => 'Secret123'])
            ->assertOk()
            ->json('access_token');

        $claims = app(JwtService::class)->decode($token);
        $this->assertSame((string) $user->id, $claims->sub);
        $this->assertSame('member', $claims->role);
    }

    public function test_refresh_token_rotation_and_logout(): void
    {
        User::factory()->create(['email' => 'rasa@example.com', 'password' => 'Secret123']);
        $cookieName = config('jwt.cookie.name');

        $login = $this->postJson('/api/v1/auth/login', ['email' => 'rasa@example.com', 'password' => 'Secret123']);
        $firstRefresh = $login->getCookie($cookieName, false)->getValue();

        $refresh = $this->withCredentials()->withUnencryptedCookie($cookieName, $firstRefresh)->postJson('/api/v1/auth/refresh')->assertOk();
        $secondRefresh = $refresh->getCookie($cookieName, false)->getValue();
        $this->assertNotSame($firstRefresh, $secondRefresh);

        $accessToken = $refresh->json('access_token');
        $this->withCredentials()->withUnencryptedCookie($cookieName, $secondRefresh)
            ->postJson('/api/v1/auth/logout', [], ['Authorization' => "Bearer {$accessToken}"])
            ->assertNoContent();

        // Po atsijungimo neveikia nei access, nei refresh žetonas
        $this->getJson('/api/v1/auth/me', ['Authorization' => "Bearer {$accessToken}"])->assertUnauthorized();
        $this->withCredentials()->withUnencryptedCookie($cookieName, $secondRefresh)->postJson('/api/v1/auth/refresh')->assertUnauthorized();
    }

    public function test_registration_cannot_grant_admin_role(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Sneaky',
            'email' => 'sneaky@example.com',
            'password' => 'Secret123',
            'password_confirmation' => 'Secret123',
            'role' => 'admin',
        ])->assertCreated()->assertJsonPath('user.role', 'member');
    }
}
