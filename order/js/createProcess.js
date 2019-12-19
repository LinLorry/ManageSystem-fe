function create() {
    let url = "/api/process/create";
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