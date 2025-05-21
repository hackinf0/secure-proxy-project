<!DOCTYPE html>
<html>
  <body>
    <h2>XSS Demo</h2>
    <form method="GET" action="">
      Your name: <input type="text" name="name">
      <input type="submit">
    </form>
    <?php
      if (isset($_GET['name'])) {
        echo "<p>Hello, " . $_GET['name'] . "!</p>";
      }
    ?>
  </body>
</html>
