let id = getId();

window.onload = function() {
    if (id === this.undefined) return;

    let getProcessUrl = new this.URL('/api/process/find', 'http://' + document.domain);
    getProcessUrl.searchParams.append('id', id);

    this.fetch(getProcessUrl, { method: 'GET' })
    .then(response => response.json())
    .then(function(json) {
        if (json.status == 1) {
            let name = document.getElementById('name');
            let comment = document.getElementById('comment');

            name.textContent = json.data.name;
            comment.textContent = json.data.comment;
        } else {
            let commonBox = document.getElementById('comment-box');
            let message = document.createElement('p');

            message.textContent = json.message;
            message.style.fontSize = '1.4em';
            commonBox.innerHTML = ''
            commonBox.appendChild(message);
        }
    })
}

function update() {
    let url = "/api/process/update";
    let headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    let name = document.getElementById('name').value;
    let comment = document.getElementById('comment').value;

    if (name.length === 0) {
        disposeHint('工序名不能为空！');
        return;
    } else if (comment.length === 0) {
        disposeHint('工序内容不能为空！');
        return;
    }

    let data = JSON.stringify({
        "id": id,
        "name": name,
        "comment": comment
    });

    fetch(url, {
        body: data,
        headers: headers,
        method: "POST"
    })
    .then(response => response.json())
    .then(function(json) {
        if(json.status === 1){
            disposeHint(json.message);
            window.location.href = "/queryProcess.html";
        }else{
            disposeHint(json.message);
        }
    });
}

function getId() {
    let search = this.location.search;

    if (search.indexOf('?') == -1) {
        this.location.href = '/queryProcess.html';
        return undefined;
    }
    
    search = search.substr(1);
    let result = search.split('=')
    
    if (result[0] != 'id') {
        this.location.href = '/queryProcess.html';
        return undefined;
    }

    return result[1];
}