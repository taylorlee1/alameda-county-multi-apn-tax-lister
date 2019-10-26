<?php

sleep(rand(4,8));
$xurl = $_SERVER['HTTP_X_PROXY_URL'];

$pieces = explode("?", $xurl);

$xurl = "https://www.acgov.org/ptax_pub_app/RealSearch.do?" . $pieces[1];

echo "xurl: $xurl\n";

$ch = curl_init();

curl_setopt($ch, CURLOPT_FAILONERROR, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

curl_setopt($ch, CURLOPT_URL, $xurl);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_POST, 1);

$output = curl_exec($ch);

curl_close($ch);

echo "$output"

?>
