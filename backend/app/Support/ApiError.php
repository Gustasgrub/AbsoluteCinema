<?php

namespace App\Support;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Vieninga klaidų forma visam API (RFC 9457 "Problem Details"):
 *
 *   { "type": "about:blank", "title": "Not Found", "status": 404,
 *     "detail": "Studio #99 was not found.", "errors": { ... } }
 *
 * Klaidos → statuso kodai sujungiami bootstrap/app.php (withExceptions).
 */
class ApiError
{
    public static function response(int $status, string $detail, array $errors = [], array $headers = []): JsonResponse
    {
        $body = [
            'type' => 'about:blank',
            'title' => Response::$statusTexts[$status] ?? 'Error',
            'status' => $status,
            'detail' => $detail,
        ];

        if ($errors !== []) {
            $body['errors'] = $errors;
        }

        return response()->json($body, $status, ['Content-Type' => 'application/problem+json'] + $headers);
    }

    // Bet kokią išimtį paverčia tinkamu HTTP atsakymu. Tikslas – niekada negrąžinti 500.
    public static function fromException(Throwable $e, Request $request): JsonResponse|Response
    {
        return match (true) {
            $e instanceof HttpResponseException => $e->getResponse(),

            // 400 (blogi query parametrai) arba 422 (blogi duomenys body'je)
            $e instanceof ValidationException => self::response(
                $e->status,
                $e->status === 400 ? 'Some query parameters are invalid.' : 'The given data was invalid.',
                $e->errors(),
            ),

            // 401 – nėra žetono arba jis netinkamas
            $e instanceof AuthenticationException => self::response(
                401, $e->getMessage() ?: 'Unauthenticated.', [], ['WWW-Authenticate' => 'Bearer']
            ),

            // 409 – toks įrašas jau yra (apsauga, jei kontroleris to nepagavo)
            $e instanceof UniqueConstraintViolationException => self::response(409, 'This resource already exists.'),

            // 403, 404, 405, 409, 415, 429 ir kt. – Symfony HTTP išimtys
            $e instanceof HttpExceptionInterface => self::response(
                $e->getStatusCode(), self::detailFor($e, $request), [], $e->getHeaders()
            ),

            default => self::response(500, config('app.debug') ? $e->getMessage() : 'Unexpected server error.'),
        };
    }

    private static function detailFor(HttpExceptionInterface $e, Request $request): string
    {
        $previous = $e->getPrevious();

        // Route model binding nerado įrašo, pvz. GET /studios/999
        if ($previous instanceof ModelNotFoundException) {
            return class_basename($previous->getModel()).' #'.implode(', ', $previous->getIds()).' was not found.';
        }

        if ($e->getStatusCode() === 404) {
            return "The endpoint {$request->method()} /{$request->path()} does not exist.";
        }

        if ($e->getStatusCode() === 405) {
            return "The {$request->method()} method is not supported for this endpoint.";
        }

        return $e->getMessage() ?: (Response::$statusTexts[$e->getStatusCode()] ?? 'Error');
    }
}
