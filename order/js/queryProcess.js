var Popup = new Popup()
var findProcessId = 0

const workProcessField = [
    'processName','processComment'
]

window.onload = function () {
    find();
}

function find(){
    let url = new URL('/api/process/find','http://' + document.domain + ':8080');

    let id = document.getElementById('id').value;
    let name = document.getElementById('name').value;
    let comment = document.getElementById('comment').value;
    // let pageNumber = document.getElementById('pageNumber').value;

    let token = window.localStorage.token;
    let headers;

    if (token != null && token != '') {
        headers = {
            'Authorization': 'manage ' + localStorage.getItem('token'),
            'content-type': 'application/json;charset=UTF-8'
        };
    }

    if (id !== '') url.searchParams.append('id', id);
    if (name !== '') url.searchParams.append('name', name);
    if (comment !== '') url.searchParams.append('comment', comment);
    // if (pageNumber !== '') url.searchParams.append('pageNumber', pageNumber);

    let queryResult = document.getElementById('query-result');

    fetch(url, {
        headers: headers,
        method: 'GET'
    })
    .then(response => response.json())
    .then(function(json) {
        if (json.status == 1) {
            queryResult.innerHTML = '';
            json.data.processes.forEach(element => {
                let tr = document.createElement('tr');

                let id = document.createElement('td');
                id.innerHTML = 'process-' + element.id;
                tr.appendChild(id);

                let name = document.createElement('td');
                name.innerHTML = element.name;
                tr.appendChild(name);

                let comment = document.createElement('td');
                comment.innerHTML = element.comment;
                tr.appendChild(comment);

                let createTime = document.createElement('td');
                createTime.innerHTML = new Date(element.createTime).toLocaleDateString();
                tr.appendChild(createTime);

                let updateTime = document.createElement('td');
                updateTime.innerHTML = new Date(element.updateTime).toLocaleDateString();
                tr.appendChild(updateTime);

                let show = document.createElement('td');
                var showButton = document.createElement('button');
                showButton.innerHTML = "查看";
                showButton.addEventListener("click",function(){
                    // window.location.href = '/process.html?id=' + element.id;
                    showAction(element)
                }); 
                show.appendChild(showButton);
                tr.appendChild(show);

                let update = document.createElement('td');
                var updateButton = document.createElement('button');
                updateButton.innerHTML = "修改";
                updateButton.addEventListener("click",function(){
                    // window.location.href = '/updateProcess.html?id=' + element.id; 
                    updateAction(element)
                }); 
                update.appendChild(updateButton);
                tr.appendChild(update);

                let del = document.createElement('td');
                var deleteButton = document.createElement('button');
                deleteButton.innerHTML = "删除";
                deleteButton.addEventListener("click", function() {
                    deleteProcess(element.id)
                });
                del.appendChild(deleteButton);
                tr.appendChild(del);

                queryResult.appendChild(tr);
            })
        }
        // else{
        //     queryResult.innerHTML = '';

        //     let tr = document.createElement('tr');

        //     let td = document.createElement('td');
        //     td.innerHTML = "暂无数据";
        //     tr.appendChild(td);

        //     queryResult.appendChild(tr);
        // }
    })
}

//弹窗式创建工序
function createAction(){
    const title = '创建工序'
    const text = '<div class="confirm-box">' +
        '<label>工序名称：</label>'+
        '<div class="show-box">' +
        '<input type="text" id="processName">' +
        '</div><br>' +
        '<label>工序内容：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processComment">' +
        // '<textarea type="text" id="processComment"></textarea>'
        '</div><br>' +
        // '<input type="button" value="创建" onclick="create()"></input>'
        '</div>'

    Popup.confirm(title, text, function () {
        createProcess()
    } );
}

function createProcess() {
    let url = "/api/process/create";
    let headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    let name = document.getElementById('processName').value;
    let comment = document.getElementById('processComment').value;

    if (name.length === 0) {
        disposeHint('工序名不能为空！');
        return;
    } else if (comment.length === 0) {
        disposeHint('工序内容不能为空！');
        return;
    }

    let data = JSON.stringify({
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
    })
}

//查看工序
function showAction(data){
    const title = '查看工序'
    const text = '<div class="confirm-box">' +
        '<label>工序名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processName" disabled="true" value="' + data.name +'">' +
        '</div><br>' +
        '<label>工序内容：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processComment" disabled="true" value="' + data.comment +'">' +
        '</div><br>' +
        '</div>'

    Popup.confirm(title, text);
}

//弹窗式修改工序
function updateAction(data){
    const title = '修改工序'
    const text = '<div class="confirm-box">' +
        '<label>工序名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processName" value="' + data.name +'">' +
        '</div><br>' +
        '<label>工序内容：</label>' +
        '<div class="show-box">' +
        '<input type="text" id="processComment" value="' + data.comment +'">' +
        '</div><br>' +
        // '<input type="button" value="修改" onclick="updateProcess()"></input>' +
        '</div>'

    Popup.confirm(title, text, function () {
        updateProcess(data.id)
    });
}

function updateProcess(ProcessId) {
    let url = "/api/process/update";
    let headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    let name = document.getElementById('processName').value;
    let comment = document.getElementById('processComment').value;

    if (name.length === 0) {
        disposeHint('工序名不能为空！');
        return;
    } else if (comment.length === 0) {
        disposeHint('工序内容不能为空！');
        return;
    }
    console.log(ProcessId);

    let data = JSON.stringify({
        "id": ProcessId,
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

function deleteProcess(id){
    let url = "/api/process/delete";
    let headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }
    let data = JSON.stringify({
        "id": id
    });

    fetch(url, {
        body: data,
        headers: headers,
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(function(json) {
        if(json.status === 1){
            disposeHint(json.message);
            find();
        }else{
            disposeHint(json.message);
        }
    })
}

function disposeHint(message){
    alert(message);
}