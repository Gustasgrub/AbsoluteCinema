<?php

namespace App\Support;

/**
 * Hypermedia (HATEOAS) nuorodų pagalbininkas.
 * Kiekvienas resursas turi "_links" – kur jį rasti ir kokius veiksmus su juo galima atlikti, pvz.:
 *   "_links": { "self": { "href": "http://localhost:8000/api/v1/studios/1", "method": "GET" } }
 */
class Link
{
    public static function to(string $path, string $method = 'GET'): array
    {
        return ['href' => self::url($path), 'method' => $method];
    }

    public static function url(string $path): string
    {
        return url('api/v1/'.ltrim($path, '/'));
    }
}
