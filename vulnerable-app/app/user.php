<?php
$db = new PDO('sqlite:/var/www/html/users.db');

if (isset($_GET['user'])) {
    $user = $_GET['user'];
    $query = "SELECT * FROM users WHERE username = '$user'";
    $result = $db->query($query);

    echo "<h2>Query result:</h2>";
    foreach ($result as $row) {
        echo "Username: " . $row['username'] . "<br>";
        echo "Password: " . $row['password'] . "<br><hr>";
    }
}
?>
