var token = window.localStorage.token;
var Popup =new Popup();
function create(){
    function createWork() {
        var name=document.getElementById("name").value;
        var comment=document.getElementById("comment").value;
        if (name.length === 0) {
            disposeHint('生产流程名字不能为空！');
            return;
        }
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
                    Popup.toast('新建生产流程成功');
                    // window.localStorage.token = data.token;
                    window.location.href = "/findWork.html";
                } else {
                    Popup.toast('新建生产流程失败');
                   /* var hint = document.getElementById("hint");
                    hint.style.display = "block";
                    hint.innerHTML = data.message;*/
                }
            });
    }
    var title = '新建生产流程管理',
        text = '<div class="confirm-box"><form id="updateForm">' +
            '<label>生产流程名称</label><input type="text" id="name"><br>' +
            '<label>生产流程备注</label><input type="text" id="comment"></form></div>';
    Popup.confirm(title,text,createWork);
}
function updateWork(work_id) {
    function editWork(){
        url="/api/work/update";
        var name=updateForm.name.value;
        var comment=updateForm.comment.value;
        var data={
            "id":work_id,
            "name": name,
            "comment": comment
        };
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
                    Popup.toast('更新生产流程成功');
                    // window.localStorage.token = data.token;
                    window.location.href = "/findWork.html";
                } else {
                    Popup.toast('更新生产流程失败');
                    /*var hint = document.getElementById("hint");
                    hint.style.display = "block";
                    hint.innerHTML = data.message;*/
                }
            });
    }

    var title = '编辑生产流程管理',
        text = '<div class="confirm-box"><form id="updateForm">' +
            '<label>生产流程名称</label><input type="text" id="name"><br>' +
            '<label>生产流程备注</label><input type="text" id="comment"></form></div>';
    Popup.confirm(title,text,editWork);

}
function deleteWork(work_id){
    var data={
        "id": work_id

    };
    url="/api/work/delete?id="+work_id;
    var headers;
    if (token != null && token != '') {
        headers = {
            'Authorization': 'manage ' + token,
            'content-type': 'application/json'
        };
    }
    fetch(url,{
        body: JSON.stringify(data),
        headers: headers,
        method: "DELETE"
    })
        .then(response => response.json())
        .then(function(json) {
            if(json.status ==1){
                Popup.toast('删除生产流程成功');
                window.location.href = "/findWork.html";
            }else {
                Popup.toast('删除生产流程失败');
                var hint = document.getElementById("hint");
                hint.style.display = "block";
                hint.innerHTML = data.message;
            }

        });
}

window.onload=function(){
    query()
}

function query(){
    var id=queryBox.id.value;
    var name=queryBox.name.value;
    var comment=queryBox.comment.value;
    console.log(id);
    console.log(name);
    console.log(comment);
    var counter=0;
    // url="/api/work/find";
    let url = new URL('/api/work/find', 'http://' + document.domain + ':8080');
    if (id !== '') url.searchParams.append('id', id);
    if (name !== '') url.searchParams.append('name', name);
    if (comment !== '') url.searchParams.append('comment', comment);

    var headers;
    if (token != null && token != '') {
        headers = {
            'Authorization': 'manage ' + token,
            'content-type': 'application/json'
        };
    }
    var queryResult = document.getElementById('query-result');
    console.log(url);
    fetch(url,{
        headers: headers,
        method: "GET"
    })
        .then(response => response.json())
        .then(function(json) {
            if (json.status == 1) {
                //Popup.toast(json.message)
                queryResult.innerHTML = '';
                json.data.works.forEach(element => {
                    var tr = document.createElement('tr');
                    tr.id = 'work-' + element.id;
                    var id = document.createElement('td');
                    id.innerHTML=element.id;
                    tr.appendChild(id);
                    var name = document.createElement('td');
                    name.innerHTML=element.name;
                    tr.appendChild(name);
                    var comment=document.createElement('td');
                    comment.innerHTML=element.comment;
                    tr.appendChild(comment);
                    var createTime=document.createElement('td');
                    createTime.innerHTML=new Date(element.createTime).toLocaleDateString();
                    tr.appendChild(createTime);
                    var updateTime=document.createElement('td');
                    updateTime.innerHTML=new Date(element.updateTime).toLocaleDateString();
                    tr.appendChild(updateTime);
                    var update=document.createElement('td');
                    var button=document.createElement('button');
                    button.innerHTML='编辑';
                    button.onclick=function(){updateWork(element.id)};
                    update.appendChild(button);
                    tr.appendChild(update);
                    var deleteButton=document.createElement('td');
                    var button=document.createElement('button');
                    button.innerHTML='删除';
                    button.onclick=function () {deleteWork(element.id)};
                    deleteButton.appendChild(button);
                    tr.appendChild(deleteButton);
                    queryResult.appendChild(tr);

                })
                var ex1 = new tableSort('table', 1, 2, 999, 'up', 'down', 'hov')
            }
            else{
                Popup.toast(json.message)
            }

        });
}
