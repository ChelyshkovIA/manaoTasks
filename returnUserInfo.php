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

    $resp = [
        'status' => '', 
        'body' => ''
    ];

    $usersArr = simplexml_load_file('db.xml');

    foreach($usersArr as $user) {
        if(strtolower($user->login) == strtolower($login)) {
            $xmlHash = $user->hash;

            if($xmlHash != $cookieHash || $xmlHash != $sessionHash) {
                $resp['status'] = 'err1';
                die(json_encode($resp));
            }

            $resp['status'] = 'ok';
            $resp['body'] = (string)$user->name;
            die(json_encode($resp));
        }
    }
    $resp['status'] = 'err2';
    die(json_encode($resp));
?>