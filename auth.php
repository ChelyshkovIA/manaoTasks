<?php

    /* ******************************* */

    //errors list:
    //err1 - empty value
    //err2 - not valid data
    //err3 - file writing error

    /* ******************************* */
    
    require_once('salt.php');

    function generateCode($length = 6) {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHI JKLMNOPRQSTUVWXYZ0123456789';
        $code = '';
        $clen = strlen($chars) - 1;
        while (strlen($code) < $length) {
                $code .= $chars[mt_rand(0,$clen)];
        }
        return $code;
    }

    $login    = htmlentities(strtolower($_POST['login']));
    $password = htmlentities($_POST['password']);
    
    $resp = ['status' => ''];

    if($login == '' || $password == '') {
        $resp['status'] = 'err1';
        die(json_encode($resp));
    }

    $hashPw = md5($password . $_salt);

    $users = simplexml_load_file('db.xml');
    foreach($users as $user) {
        if($login == $user->login) {
            if($hashPw == $user->password) {
                $hash = md5(generateCode(10));
                $user->hash = $hash;
                $str = $users->asXML();

                $file = fopen('db.xml', 'w');
                if(fwrite($file, $str)){
                    fclose($file);
                }
                else {
                    $resp['status'] = 'err3';
                    die(json_encode($resp));
                }
                
                setcookie('user', $login, time() + 3600, '/');
                setcookie('hash', $hash, time() + 3600, '/');
                
                session_start();
                $_SESSION['hash'] = $hash;
                $resp['status'] = 'ok';
                die(json_encode($resp));    
            }
        }
    }

    $resp['status'] = 'err2';
    die(json_encode($resp));
?>