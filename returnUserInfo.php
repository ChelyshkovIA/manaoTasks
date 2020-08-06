<?php

    /* ******************************* */
    
    //errors list:
    //err1 - hashes doesn't match
    //err2 - user didn't authorized

    /* ******************************* */

    session_start();
    $login       = $_COOKIE['user'];
    $cookieHash  = $_COOKIE['hash'];
    $sessionHash = $_SESSION['hash'];

    $usersArr = simplexml_load_file('db.xml');

    foreach($usersArr as $user) {
        if(strtolower($user->login) == strtolower($login)) {
            $xmlHash = $user->hash;

            if($xmlHash != $cookieHash || $xmlHash != $sessionHash) {
                die('err1');
            }

            $jsonName = '{'.'"name":' . '"' . $user->name . '"' . '}';
            die($jsonName);
        }
    }
    die('err2');
?>