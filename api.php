<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Headers: x-requested-with');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

$ch = curl_init();
$url = 'http://apis.data.go.kr/6280000/busArrivalService/getAllRouteBusArrivalList'; /*URL*/
$queryParams = '?' . urlencode('ServiceKey') . '=dU7dvWQUG8tftP9%2FNQlBADY5gjT5ZpS6xWVIZ%2Fwxr26jXjuJZlrLgExQvtyIaCfiioEJWez5DJ%2FcdIWAAFrctQ%3D%3D'; /*Service Key*/
$queryParams .= '&' . urlencode('pageNo') . '=' . urlencode('1'); /**/
$queryParams .= '&' . urlencode('numOfRows') . '=' . urlencode('100'); /**/
$queryParams .= '&' . urlencode('bstopId') . '=' . urlencode('168001043'); /**/

curl_setopt($ch, CURLOPT_URL, $url . $queryParams);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_HEADER, FALSE);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
$response = curl_exec($ch);
curl_close($ch);

var_dump($response);
?>
