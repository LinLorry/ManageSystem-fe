var Popup = new Popup();

var header = {
    "id": "序号",
    "serial": "订单号",
    "createTime": "创建时间",
    "workName": "生成流程",
    "endTime": "出货时间",
    "status": "状态"
}

function createTable(id,jsonData,header,check,edit) {
    var tr,td,th

    tr = document.createElement("tr")
    for(i in header) {
        th = document.createElement("th")
        th.appendChild(document.createTextNode(header[i]))
        tr.appendChild(th)
    }
    if (check === true) {                                                 //创建查看按钮
        th = document.createElement("th");
        th.appendChild(document.createTextNode("查看"));
        tr.appendChild(th);
    }
    if (edit === true) {                                              //创建编辑按钮
        th = document.createElement("th");
        th.appendChild(document.createTextNode("编辑"));
        tr.appendChild(th);
    }

    document.getElementById(id).appendChild(tr)


    for(j in jsonData) {
        tr = document.createElement("tr")
        for(i in header) {
            td = document.createElement("td")
            td.appendChild(document.createTextNode(jsonData[j][i]))
            tr.appendChild(td)
        }

        if (check === true) {                                          //创建查看按钮
            td = document.createElement("td")
            var btnCheck = document.createElement("button")
            btnCheck.appendChild(document.createTextNode("查看"))
            td.appendChild(btnCheck)
            tr.appendChild(td)
        }
        if (edit === true) {                            //创建编辑按钮
            td = document.createElement("td");
            var btnEdit = document.createElement("button");
            btnEdit.appendChild(document.createTextNode("编辑"));
            td.appendChild(btnEdit);
            tr.appendChild(td);
        }
        document.getElementById(id).appendChild(tr)
    }
}

function loadOrder() {
    let url = '/api/product/find'

    fetch(url, {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Authorization': 'manage ' + localStorage.getItem('token')
        },
        method: 'GET'
    })
        .then(res => res.json())
.then(function(json) {
        if (json.status === 1) {
            localStorage.setItem('products',JSON.stringify(json.data.products))
            var test = JSON.parse(localStorage.getItem('products'))
            console.log(test)
            document.getElementById('table').innerHTML="";
            createTable("table",test,header,true,true)
            var ex1 = new tableSort('table',1,2,999,'up','down','hov');
        } else {
            console.log(json.message)
        }
    })
}

function queryOrder() {
    let url = new URL('/api/product/find','http://' + document.domain + ":8080");

    let id = document.getElementById('id').value
    let serial = document.getElementById('serial').value;
    let createTime = document.getElementById('createTime').value;
    let endTime = document.getElementById('endTime').value;

    console.log(id)
    console.log(serial)
    console.log(createTime)
    console.log(endTime)

    if (id !== '' && id !== undefined && id !== null) url.searchParams.append('id', id);
    if (serial !== '') url.searchParams.append('serial', serial);
    if (createTime !== '') url.searchParams.append('createTime', createTime);
    if (endTime !== '') url.searchParams.append('endTime', endTime);

    fetch(url, {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Authorization': 'manage ' + localStorage.getItem('token')
        },
        method: 'GET'
    })
        .then(res => res.json())
.then(function(json) {
        if (json.status === 1) {
            console.log(json.data.products)
            document.getElementById('table').innerHTML="";
            createTable("table",json.data.products,header,true,true)
            var ex1 = new tableSort('table',1,2,999,'up','down','hov')
        } else {
            console.log(json.message)
        }
    })
}

function finishOrder() {
    let url = '/api/product/finish?id=1'
    fetch(url, {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Authorization': 'manage ' + localStorage.getItem('token')
        },
        method: 'POST'
    })
        .then(res => res.json())
.then(function(json) {
        if (json.status === 1) {
            document.getElementById('table').innerHTML="";
            localStorage.setItem('products',JSON.stringify(json.data.products))
            var test = JSON.parse(localStorage.getItem('products'))
            console.log(test)
            createTable("table",test,header,true,true)
            var ex1 = new tableSort('table',1,2,999,'up','down','hov')
        } else {
            console.log(json.message)
        }
    })

}

function sortOrder(sort) {
    let url = '/api/product/' + sort

    fetch(url, {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Authorization': 'manage ' + localStorage.getItem('token')
        },
        method: 'GET'
    })
        .then(res => res.json())
.then(function(json) {
        if (json.status === 1) {
            document.getElementById('table').innerHTML="";
            localStorage.setItem('products',JSON.stringify(json.data.products))
            var test = JSON.parse(localStorage.getItem('products'))
            console.log(test)
            createTable("table",test,header,true,true)
            var ex1 = new tableSort('table',1,2,999,'up','down','hov');
        } else {
            console.log(json.message)
        }
    })
}

window.onload= function (ev) {
    loadOrder()
}