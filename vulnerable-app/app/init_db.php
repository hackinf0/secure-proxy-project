<?php
$db = new PDO('sqlite:/var/www/html/users.db');
$db->exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
$db->exec("INSERT INTO users (username, password) VALUES ('admin', 'JesuisAdmin'), ('guest', 'guestpass')");
echo "Database initialized.";
?>
