import {authorization} from './auth.js';

//проверка, авторизован ли пользователь
let req = new XMLHttpRequest();
let url = 'returnUserInfo.php';
req.open('POST', url, false);
req.send();
let resp = JSON.parse(req.response);
if(resp.status == 'ok') {
    //если да - отрисовка личного кабинета
    authorization(document.querySelector('.main'));
}else {
    //если нет - описываем дальнейшую логику

    let regForm        = document.querySelector('.form--reg');
    let authForm       = document.querySelector('.form--auth');
    
    let regFormLength  = regForm.elements.length;
    let authFormLength = authForm.elements.length;
    
    let regHeader = document.querySelector('.form-header--reg');
    let authHeader = document.querySelector('.form-header--auth');
    
    //осуществляем подсветку пустых инпутов и несовпадающих паролей на стадии ввода
    for(let i = 0; i < regFormLength; i++) {
        regForm.elements[i].addEventListener('input', function() {
            if(this.value !== '') {
                this.classList.remove('input--err');
            }else if (this.value == '') {
                this.classList.add('input--err');
            }
            
            if(this.name == 'password' || this.name == 'confirm-password') {
                let pw1 = regForm.elements['password'];
                let pw2 = regForm.elements['confirm-password'];
                if(pw1.value != pw2.value) {
                    pw1.classList.add('input--err');
                    pw2.classList.add('input--err');
                }else if(pw1.value == pw2.value && pw1.value != '') {
                    pw1.classList.remove('input--err');
                    pw2.classList.remove('input--err');
                }
            }
        });
    }
    
    regForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
    
        let data = new FormData();
        
        //осуществляем подсветку пустых инпутов на стадии отправки формы
        for(let i = 0; i < regFormLength; i++) {
            if(this[i].value === '') {
                regHeader.innerText = 'Fill in all the fields!';
                regHeader.classList.add('err');
                this[i].classList.add('input--err');
                isValid = false;
            }else {
                data.append(this[i].name, this[i].value);
            }
        }
        
        //осуществляем подсветку несовпадающих паролей на стадии отправки формы
        if(this.elements['password'].value != this.elements['confirm-password'].value) {
            regForm.elements['password'].classList.add('input--err');
            regForm.elements['confirm-password'].classList.add('input--err');
            regHeader.innerText = 'Password mismatch!';
            regHeader.classList.add('err');
            isValid = false;
        }
        
        //если хоть одно из предыдущего верно - не выполняем отправку
        if(!isValid)
            return;
    
        let req = new XMLHttpRequest();
        let url = 'reg.php';
        req.open('POST', url);
        req.send(data);
        
        //ждем загрузки запроса и выводим сообщения в зависимости от ответа сервера
        //коды ошибок можно посмотреть в соотв. php-скриптах
        req.addEventListener('load', function() {
            let resp = JSON.parse(this.response);
            switch(resp.status) {
                case 'err1':
                    regHeader.innerText = 'Fill in all the fields!';
                    regHeader.classList.add('err');
                    break;
                case 'err2':
                    regForm.elements['password'].classList.add('input--err');
                    regForm.elements['confirm-password'].classList.add('input--err');
                    regHeader.innerText = 'Password mismatch!';
                    regHeader.classList.add('err'); 
                    break;
                case 'err3':
                    regForm.elements['login'].classList.add('input--err');
                    regHeader.classList.add('err');
                    regHeader.innerText = 'Login already exist!';
                    break;     
                case 'err4':
                    regForm.elements['email'].classList.add('input--err');
                    regHeader.classList.add('err');
                    regHeader.innerText = 'E-mail already exist!';
                    break;
                case 'err5':
                    regHeader.classList.add('err');
                    regHeader.innerText = '505 eror. Tell the developer!';
                    break;    
                case 'ok': {
                    regHeader.innerText = 'You have been registered';
                    regHeader.classList.remove('err');
                    regHeader.classList.add('success');
    
                    for(let i = 0; i < regFormLength - 1; i++) {
                        regForm.elements[i].value = '';
                    }
    
                    setTimeout(() => {
                        regHeader.innerText = 'Registration';
                        regHeader.classList.remove('success');
                    }, 3000);
                    break;
                }    
                default:
                    console.log(this.response);
                    return;    
            }
        });
    });
    
    //осуществляем подсветку пустых инпутов на стадии ввода
    for(let i = 0; i < authFormLength; i++) {
        authForm.elements[i].addEventListener('input', function() {
            if(this.value != '') {
                this.classList.remove('input--err');
            }else{
                this.classList.add('input--err');
            }
        });
    }
    
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
    
        let login = this.elements['login'];
        let password = this.elements['password'];
        let isValid = true;

        //осуществляем подсветку пустых инпутов на стадии отправки формы
        if(
            login.value == '' 
        ) {
            isValid = false;
            login.classList.add('input--err');
            authHeader.innerText = 'Fill in all the fields!';
            authHeader.classList.add('err');
        }
    
        if(
            password.value == '' 
        ) {
            isValid = false;
            password.classList.add('input--err');
            authHeader.innerText = 'Fill in all the fields!';
            authHeader.classList.add('err');
        }
        
        //если хоть одно из предыдущего верно - не выполняем отправку
        if(!isValid)
            return;
    
        let data = new FormData();
        data.append(login.name, login.value);
        data.append(password.name, password.value);
    
        let req = new XMLHttpRequest();
        let url = 'auth.php';
        req.open('POST', url);
        req.send(data);
        
        //ждем загрузки запроса и выводим сообщения в зависимости от ответоа сервера
        //коды ошибок можно посмотреть в соотв. php-скриптах
        //если ошибок нет (код ok) - скрываем формы и отображаем личный кабинет пользователя
        req.addEventListener('load', function() {
            let resp = JSON.parse(this.response);
            switch(resp.status) {
                case 'ok':
                    authorization(document.querySelector('.main'));
                    break;
    
                case 'err1':
                    authHeader.innerText = 'Fill in all the fields!';
                    authHeader.classList.add('err');
                    break;
                case 'err2':
                    authHeader.innerText = 'Not valid password or login';
                    authHeader.classList.add('err');
                    break;         
                default:
                    console.log(this.response);
                    return;    
            }
        });
    });
}