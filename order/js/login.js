window.localStorage.clear()

function login() {
    let url = '/api/user/token'
    let username = document.getElementById('username');
    let password = document.getElementById('password');

    if (username.value.length === 0) {
        setErrorFor(username,'用户名不能为空！')
    }
    if (password.value.length === 0) {
        setErrorFor(password,'密码不能为空！')
        return
    }

    var data = {
        username: username.value,
        password: password.value
    };

    fetch(url, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json;charset=UTF-8'
        },
        method: 'POST'
    })
        .then(res => res.json())
    .then(function(json) {
        if (json.status === 1) {
            window.location.href = './home.html'
            window.localStorage.setItem('token',json.token)
        } else {
            console.log(json)
        }
    })
}