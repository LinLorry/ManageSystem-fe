var token = window.localStorage.token;
var userProfileURL = "/api/user/profile";
function disposeHint(message) {
    var hint = document.getElementById('hint');
    hint.textContent = message;
    hint.style.display = 'block';
}
/*if (token != ""  && token != null) {
    fetch(userProfileURL, {
        headers: {
            "Authorization": "Order" + token,
            'content-type': 'application/json'

        },
        method: "GET"
    })
}*/
/*
if (token != null && token != '') {
    headers = {
        'Authorization': 'manage ' + token,
        'content-type': 'application/json'
    };
}*/
function create() {
    var name=createWork.name.value;
    var comment=document.getElementById("comment").value;
    console.log(name);
    console.log(comment);
    if (name.length === 0) {
        disposeHint('生产流程名字不能为空！');
        return;
    }
    //如果为空也可以创建？？？
    var data={
        "name": name,
        "comment": comment
    };
    url="/api/work/create";
    fetch(url,{
        body: JSON.stringify(data),
        headers: {
            'Authorization': 'manage ' + token,
            'content-type': 'application/json;charset=UTF-8'
        },
        method: "POST"
    })
        .then(response => response.json())
        .then(function(data) {
            if (data.status == 1) {
               // window.localStorage.token = data.token;
                window.location.href = "/findWork.html";
            } else {
                var hint = document.getElementById("hint");
                hint.style.display = "block";
                hint.innerHTML = data.message;
            }
        });
}
