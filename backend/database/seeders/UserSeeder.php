<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    // [vardas, el. paštas, aprašymas]. Visų narių slaptažodis: Member123!
    private const MEMBERS = [
        ['Demo Member', 'member@absolutecinema.test', 'Demo account for trying out the member features.'],
        ['Rasa Kairytė', 'rasa@absolutecinema.test', 'Animation devotee. Will cry at any montage with a sad violin.'],
        ['Tomas Jankus', 'tomas@absolutecinema.test', "Watches horror after midnight so you don't have to."],
        ['Ieva Mockutė', 'ieva@absolutecinema.test', 'Slow cinema, long takes, subtitles always on.'],
        ['Lukas Bernotas', 'lukas@absolutecinema.test', "If it isn't on the biggest screen in town, I'm waiting."],
        ['Greta Vaitkutė', 'greta@absolutecinema.test', 'Series binger. Reviews one season at a time.'],
        ['Mantas Žukauskas', 'mantas@absolutecinema.test', 'Crime, heists and anything with a great score.'],
        ['Emilija Stankutė', 'emilija@absolutecinema.test', 'Romance and coming-of-age stories. Soft heart, harsh ratings.'],
        ['Dovydas Petrulis', 'dovydas@absolutecinema.test', 'Sci-fi nerd. Will happily explain the ending to you.'],
    ];

    public function run(): void
    {
        $admin = User::create([
            'name' => 'Cinema Admin',
            'email' => 'admin@absolutecinema.test',
            'password' => 'Admin123!',
            'bio' => 'Keeps the projectors running and the catalogue tidy.',
        ]);
        $admin->role = User::ROLE_ADMIN;   // rolė nėra $fillable – nustatoma atskirai
        $admin->save();

        $memberPassword = Hash::make('Member123!');   // vienas hash'as visiems – greitesnis seed'inimas

        foreach (self::MEMBERS as [$name, $email, $bio]) {
            User::create(['name' => $name, 'email' => $email, 'password' => $memberPassword, 'bio' => $bio]);
        }
    }
}
