<?php

namespace App\Services;

use RuntimeException;

/**
 * Žetonas netinkamas: blogas parašas, pasibaigęs galiojimas, atšauktas ir pan.
 * Kontroleriai/middleware šią klaidą paverčia 401 Unauthorized atsakymu.
 */
class InvalidTokenException extends RuntimeException {}
