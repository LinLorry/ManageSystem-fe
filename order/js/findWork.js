var token = window.localStorage.token;
var userProfileURL = "/api/user/profile";
function disposeHint(message) {
    var hint = document.getElementById('hint');
    hint.textContent = message;
    hint.style.display = 'block';
}
function parseDate(time) {
    let re = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    let result = re.exec(time);

    return result[1] + '年'
        + result[2] + '月'
        + result[3] + '日'
        + result[4] + '点'
        + result[5] + '分';
}
window.onload=function f() {
    url="/api/work/find";
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
                    createTime.innerHTML=parseDate(element.createTime);
                    tr.appendChild(createTime);
                    var updateTime=document.createElement('td');
                    updateTime.innerHTML=parseDate(element.updateTime);
                    tr.appendChild(updateTime);
                    queryResult.appendChild(tr);
                })
            }
            else{
                disposeHint(json.message);
            }
        });
}
function query(){
    var id=queryBox.id.value;
    var name=queryBox.name.value;
    var comment=queryBox.comment.value;
    var pageNumber_1=queryBox.pageNumber.value;
    var pageNumber=pageNumber_1-1;
    console.log(id);
    console.log(name);
    console.log(comment);
    console.log(pageNumber);

    var counter=0;
    url="/api/work/find";
    var temp="";
    if(id!=='')
    {
        if(counter===0){
            temp+="id="+id;
            counter=1;
        }
    }
    if(name!=='') {
        if (counter !== 0) {
            temp += "&"
        } else counter = 1;
        temp += "name="+name;
    }

    
    if(comment!=='') {
        if(counter!==0){
            temp+="&"
        }else counter=1;
        temp+="comment="+comment;
    }
    if(pageNumber_1!==''){
        if(counter!==0){
            temp+="&"
        }else counter=1;
        temp+="pageNumber="+pageNumber;
    }
    if(counter===1){
        url+="?";
        url+=temp;
    }
   // url="/api/work/find?"+"id="+id+"&name="+name+"&comment="+comment+"&pageNumber="+pageNumber;
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
                    createTime.innerHTML=parseDate(element.createTime);
                    tr.appendChild(createTime);
                    var updateTime=document.createElement('td');
                    updateTime.innerHTML=parseDate(element.updateTime);
                    tr.appendChild(updateTime);
                    queryResult.appendChild(tr);
                })
            }
            else{
                disposeHint(json.message);
            }

        });
}
