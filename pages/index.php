<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Разрешаем OPTIONS-запросы для CORS preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$ikkoApiUrl = 'https://api-ru.iiko.services/api/1';
$apiLogin = '733cd7cc-516a-4215-b4ca-2cec37bbded1';
$orgID = 'a1daa1d8-3bf9-474a-b42e-19479580baa3';

// Получаем действие из запроса
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getToken':
        $url = $ikkoApiUrl . '/access_token';
        $requestData = json_encode(['apiLogin' => $apiLogin]);
        break;

    case 'getCoupons':
        $url = $ikkoApiUrl . '/loyalty/iiko/coupons/by_series';
        $requestData = file_get_contents('php://input');
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        exit;
}

// Инициализируем cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$headers = ['Content-Type: application/json'];
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $requestData);

// Логирование заголовков запроса
$allHeaders = getallheaders();
error_log("getallheaders(): " . print_r($allHeaders, true));

$apacheHeaders = apache_request_headers();
error_log("apache_request_headers(): " . print_r($apacheHeaders, true));

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
error_log("HTTP_AUTHORIZATION: " . $authHeader);

// Если запрашиваются купоны, добавляем заголовок авторизации
if ($action == 'getCoupons') {
    if (!empty($authHeader)) {
        $headers[] = 'Authorization: ' . $authHeader;
        error_log("Authorization header found in HTTP_AUTHORIZATION: " . $authHeader);
    } elseif (isset($allHeaders['Authorization'])) {
        $headers[] = 'Authorization: ' . $allHeaders['Authorization'];
        error_log("Authorization header found in getallheaders(): " . $allHeaders['Authorization']);
    } elseif (isset($apacheHeaders['Authorization'])) {
        $headers[] = 'Authorization: ' . $apacheHeaders['Authorization'];
        error_log("Authorization header found in apache_request_headers(): " . $apacheHeaders['Authorization']);
    } else {
        error_log("Authorization header not found");
    }
}

// Устанавливаем заголовки для cURL
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Выполняем запрос и получаем ответ
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

// Устанавливаем соответствующие заголовки ответа
header("Content-Type: $contentType");
http_response_code($httpCode);

echo $response;
?>
