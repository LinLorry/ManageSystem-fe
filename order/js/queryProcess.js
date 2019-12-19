window.onload = function () {
    find();
}

function find(){
    let url = new URL('/api/process/find','http://' + document.domain + ':8080');

    let id = document.getElementById('id').value;
    let name = document.getElementById('name').value;
    let comment = document.getElementById('comment').value;
    let pageNumber = document.getElementById('pageNumber').value;

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
                    window.location.href = '/process.html?id=' + element.id; 
                }); 
                show.appendChild(showButton);
                tr.appendChild(show);

                let update = document.createElement('td');
                var updateButton = document.createElement('button');
                updateButton.innerHTML = "修改";
                updateButton.addEventListener("click",function(){
                    window.location.href = '/updateProcess.html?id=' + element.id; 
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
    })
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