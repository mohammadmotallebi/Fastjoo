<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */
    //disable cors for local development all together
    'paths' => ['api/*','api/**/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET, POST, PUT, DELETE, OPTIONS'],

    'allowed_origins' => ['http://10.0.0.94:5173/','http://localhost:3000/'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,


];