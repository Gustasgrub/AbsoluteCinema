<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    // [vardas, el. paštas]. Visų narių slaptažodis: Member123!
    private const MEMBERS = [
        ['Demo Member', 'member@absolutecinema.test'],
        ['Rasa Kairytė', 'rasa@absolutecinema.test'],
        ['Tomas Jankus', 'tomas@absolutecinema.test'],
        ['Ieva Mockutė', 'ieva@absolutecinema.test'],
        ['Lukas Bernotas', 'lukas@absolutecinema.test'],
        ['Greta Vaitkutė', 'greta@absolutecinema.test'],
        ['Mantas Žukauskas', 'mantas@absolutecinema.test'],
        ['Emilija Stankutė', 'emilija@absolutecinema.test'],
        ['Dovydas Petrulis', 'dovydas@absolutecinema.test'],
    ];

    public function run(): void
    {
        $admin = User::create([
            'name' => 'Cinema Admin',
            'email' => 'admin@absolutecinema.test',
            'password' => 'Admin123!',
        ]);
        $admin->role = User::ROLE_ADMIN;   // rolė nėra $fillable – nustatoma atskirai
        $admin->save();

        $memberPassword = Hash::make('Member123!');   // vienas hash'as visiems – greitesnis seed'inimas

        foreach (self::MEMBERS as [$name, $email]) {
            User::create(['name' => $name, 'email' => $email, 'password' => $memberPassword]);
        }
    }
}
