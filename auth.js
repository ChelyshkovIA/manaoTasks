//данная функция используется дважды: 
//1 - при прохождении авторизации через форму
//2 - перед загрузкой сайта, если пользоваьтель уже авторизован

//функция делает запрос на сервер, получает json, скрывает формы и отображает имя пользователя с кнопкой выхода
function authorization(block) {
    let req = new XMLHttpRequest();
    let url = 'returnUserInfo.php';
    req.open('POST', url);
    req.send();

    req.addEventListener('load', function() {
        let resp = JSON.parse(this.response);
        let header = block.querySelector('.form-header--auth');
        if(resp.status == 'err1') {
            header.classList.add('err');
            header.innerText = 'Authorization error!';
            setTimeout(() => {
                header.innerText = 'Authorization';
                header.classList.remove('err');        
            }, 3000);
            return;
        }else if(resp.status == 'err2') {
            return;
        }else if(resp.status == 'ok') {
            let regForm  = block.querySelector('.form--reg');
            let authForm = block.querySelector('.form--auth');
        
            regForm.remove();
            authForm.remove();
        
            let greeting = document.createElement('h1');
            greeting.className = 'greeting';
            greeting.append('Hello, ' + resp.body);
    
            let logoutAnchor = document.createElement('a');
            logoutAnchor.className = 'logoutAnchor';
            logoutAnchor.href = 'logout.php';
            logoutAnchor.append('Log out');
    
            block.append(greeting);
            block.append(logoutAnchor);
        }else {
            console.log('strange error: ' + this.response);
        }
    });
}

export {
    authorization
}