<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AbsoluteCinema API · OpenAPI</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css">
    <style>
        body { margin: 0; background: #f3ece1; }
        .topbar { display: none; }
        .banner { background: #16130f; color: #f3ece1; padding: 18px 24px; font: 600 18px/1.2 system-ui, sans-serif; letter-spacing: .04em; }
        .banner span { color: #f0a830; }
    </style>
</head>
<body>
    <div class="banner">ABSOLUTE<span>CINEMA</span> · REST API v1</div>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
    <script>
        window.ui = SwaggerUIBundle({
            url: '/openapi.yaml',
            dom_id: '#swagger-ui',
            deepLinking: true,
            persistAuthorization: true,
        });
    </script>
</body>
</html>
