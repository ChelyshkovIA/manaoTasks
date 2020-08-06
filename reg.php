<?php

    /* ******************************* */

    //errors list:
    //err1 - empty value
    //err2 - 1_password != 2_password
    //err3 - existing email
    //err4 - existing login
    //err5 - file writing error

    /* ******************************* */
    
    require_once('salt.php');

    $login            = htmlentities(strtolower($_POST['login']));
    $password         = htmlentities($_POST['password']);
    $confirmPassword  = htmlentities($_POST['confirm-password']);
    $email            = htmlentities(strtolower($_POST['email']));
    $name             = htmlentities($_POST['name']);

    if(
        !isset($login) ||
        !isset($password) ||
        !isset($confirmPassword) ||
        !isset($email) ||
        !isset($name)
    ) {
        die('err1');
    }

    if($password !== $confirmPassword) {
        die('err2');
    }

    $users = simplexml_load_file("db.xml");
    foreach($users as $user) {
        if(strtolower($user->login) == $login)
            die('err3');
        else if(strtolower($user->email) == $email)
            die("err4");    
    }

    $hashPw = md5($password . $_salt);

    $newUser = $users->addChild('user');
    $newUser->addChild('login', $login);
    $newUser->addChild('password', $hashPw);
    $newUser->addChild('email', $email);
    $newUser->addChild('name', $name);
    $newUser->addChild('hash', '');
    $str = $users->asXML();

    $file = fopen('db.xml', 'w');
    if(fwrite($file, $str)) {
        fclose($file);
        die('ok');
    }else {
        fclose($file);
        die('err5');
    }
?>