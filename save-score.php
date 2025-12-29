<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);
if (!$data) {
  echo json_encode(["ok"=>false, "error"=>"Invalid JSON"]);
  exit;
}

$type = $data["type"] ?? "";

if ($type === "name") {
  $_SESSION["name"] = trim($data["name"] ?? "");
  echo json_encode(["ok"=>true, "message"=>"Nama tersimpan di session."]);
  exit;
}

if ($type !== "score") {
  echo json_encode(["ok"=>false, "error"=>"Unknown type"]);
  exit;
}

$name   = trim($data["name"] ?? "Siswa");
$points = intval($data["points"] ?? 0);
$badges = $data["badges"] ?? [];
$streak = intval($data["streak"] ?? 0);
$at     = $data["at"] ?? date("c");

$file = __DIR__ . "/scores.json";
if (!file_exists($file)) file_put_contents($file, "[]");

$all = json_decode(file_get_contents($file), true);
if (!is_array($all)) $all = [];

$entry = [
  "name" => $name,
  "points" => $points,
  "streak" => $streak,
  "badges" => $badges,
  "at" => $at
];

$all[] = $entry;

// batasi biar tidak membengkak
if (count($all) > 80) {
  $all = array_slice($all, -80);
}

file_put_contents($file, json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

$latest = array_slice(array_reverse($all), 0, 6);
$rows = "";
foreach ($latest as $e) {
  $bn = is_array($e["badges"]) ? implode(", ", $e["badges"]) : "";
  $rows .= "<div style='margin:8px 0;padding:10px;border:1px solid rgba(255,255,255,.14);border-radius:12px;background:rgba(0,0,0,.10)'>
    <b>".htmlspecialchars($e["name"])."</b> • Poin: <b>".intval($e["points"])."</b> • Streak: ".intval($e["streak"])."<br/>
    <span style='opacity:.85'>Lencana: ".htmlspecialchars($bn ?: "—")."</span><br/>
    <span style='opacity:.7;font-size:12px'>".$e["at"]."</span>
  </div>";
}

echo json_encode([
  "ok"=>true,
  "message"=>"Skor masuk ke scores.json",
  "preview_html"=>$rows
]);
