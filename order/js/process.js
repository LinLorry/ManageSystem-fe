var id = getId();

window.onload = function() {
    if (id === this.undefined) return;
    // qrcode.src = '/api/meeting/QRCode?id=' + id;

    // profileJson = this.localStorage.profile;
    // let profile = null;

    // if (profileJson !== null && profileJson !== this.undefined && profileJson.length !== 0) {
    //     profile = this.JSON.parse(this.localStorage.profile);
    // }
    
    // let actionBox = this.document.getElementById('action-box');
    let getProcessUrl = new URL('/api/process/find', 'http://' + document.domain + ':8080');
    getProcessUrl.searchParams.append('id', id);

    let headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    };

    this.fetch(getProcessUrl, { 
        headers: headers,
        method: 'GET' 
    })
    .then(response => response.json())
    .then(function(json) {
        if (json.status == 1) {
            let id = document.getElementById('id');
            let name = document.getElementById('name');
            let comment = document.getElementById('comment');
            let pageNumber = document.getElementById('pageNumber');

            console.log(json);

            id.innerHTML = json.data.processes[0].id;
            name.innerHTML = json.data.processes[0].name;
            comment.innerHTML = json.data.processes[0].comment;
            pageNumber.innerHTML = json.data.processes[0].pageNumber;
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