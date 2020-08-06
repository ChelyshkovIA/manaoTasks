<?php
    setcookie('user', $login, time() - 3600, '/');
    setcookie('hash', $hash, time() - 3600, '/');
    session_start();
    $_SESSION = array();
    session_destroy();
	header("Location: index.html");
?>