<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\UnsupportedMediaTypeHttpException;

/**
 * Patikrina užklausos turinį (body) dar prieš validaciją:
 *  - 415 Unsupported Media Type – turinys siunčiamas ne JSON formatu;
 *  - 400 Bad Request            – JSON sintaksės klaida (pvz. trūksta kabutės) arba tai ne JSON objektas.
 * Jei JSON geras, bet duomenys neteisingi (pvz. rating = 99) – tai jau 422 (žr. Form Request klases).
 */
class ValidateJsonBody
{
    public function handle(Request $request, Closure $next): Response
    {
        $body = trim($request->getContent());

        if ($body === '' || ! in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            return $next($request);
        }

        if (! $request->isJson()) {
            throw new UnsupportedMediaTypeHttpException('The request body must be JSON (Content-Type: application/json).');
        }

        $data = json_decode($body);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new BadRequestHttpException('Malformed JSON: '.json_last_error_msg().'.');
        }

        // Tuščias masyvas [] laikomas "be turinio" (kai kurie klientai jį siunčia su DELETE)
        if (! is_object($data) && $data !== []) {
            throw new BadRequestHttpException('The JSON body must be an object, e.g. {"name": "..."}.');
        }

        return $next($request);
    }
}
