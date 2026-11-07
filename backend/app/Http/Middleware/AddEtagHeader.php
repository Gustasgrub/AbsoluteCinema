<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * REST principas "Cacheable": GET atsakymams pridedama ETag antraštė (turinio "pirštų atspaudas").
 * Klientas kitą kartą atsiunčia "If-None-Match: <etag>" ir, jei duomenys nepasikeitė,
 * gauna 304 Not Modified be turinio – taip taupomas srautas.
 */
class AddEtagHeader
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        if (! $request->isMethod('GET') || $response->getStatusCode() !== 200) {
            return $response;
        }

        $response->setEtag(md5($response->getContent()));
        // private – atsakymas priklauso nuo naudotojo; no-cache – prieš naudojant reikia pasitikrinti (ETag)
        $response->headers->set('Cache-Control', 'private, no-cache');
        $response->setVary('Authorization', false);

        // Jei If-None-Match sutampa su ETag – statusas pakeičiamas į 304, turinys išmetamas
        $response->isNotModified($request);

        return $response;
    }
}
