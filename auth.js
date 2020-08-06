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
        if(this.response == 'err1') {
            let header = block.querySelector('.form-header--auth');
            header.classList.add('err');
            header.innerText = 'Authorization error!';
            setTimeout(() => {
                header.innerText = 'Authorization';
                header.classList.remove('err');        
            }, 3000);
            return;
        }
        let resp = JSON.parse(this.response);
        
        let regForm  = block.querySelector('.form--reg');
        let authForm = block.querySelector('.form--auth');
    
        regForm.remove();
        authForm.remove();
    
        let greeting = document.createElement('h1');
        greeting.className = 'greeting';
        greeting.append('Hello, ' + resp.name);

        let logoutAnchor = document.createElement('a');
        logoutAnchor.className = 'logoutAnchor';
        logoutAnchor.href = 'logout.php';
        logoutAnchor.append('Log out');

        block.append(greeting);
        block.append(logoutAnchor);
    });
}

export {
    authorization
}