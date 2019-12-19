var Popup = new Popup();

const header = {
    "id": "序号",
    "serial": "订单号",
    "createTime": "创建时间",
    "workName": "生成流程",
    "endTime": "出货时间"
    // "status": "状态"
};

function setFinish() {
    let url = '/api/product/finish?id=' + localStorage.getItem('order_id')
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
                Popup.toast('设置成功',2)
            } else {
                Popup.alert('提示','设置失败！')
            }
        })
}

function setEdit() {
    let url = '/api/product/update'
    let serial = document.getElementById('serial')
    let workId = document.getElementById('workId')
    let endTime = document.getElementById('endTime')
    let id = document.getElementById('id')
    let data = {
        serial: serial.value,
        workId: workId.value,
        endTime: endTime.value,
        id: id.value
    }
    fetch(url, {
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Authorization': 'manage ' + localStorage.getItem('token')
        },
        method: 'POST'
    })
        .then(res => res.json())
        .then(function(json) {
            if (json.status === 1) {
                Popup.toast('更新订单成功');
            } else {
                Popup.alert('更新订单失败',json.message);
            }
        })
}

function createTable(id,jsonData,header,check,edit,finish) {
    var tr,td,th

    tr = document.createElement("tr")
    for(i in header) {
        th = document.createElement("th")
        th.appendChild(document.createTextNode(header[i]))
        // 设置排序样式
        var span = document.createElement('span')
        span.className = 'caret-wrapper'
        var i1 = document.createElement('i')
        i1.className = 'sort-caret ascending'
        var i2 = document.createElement('i')
        i2.className = 'sort-caret descending'
        span.appendChild(i1)
        span.appendChild(i2)
        th.appendChild(span)
        tr.appendChild(th)
    }
    //创建查看按钮
    if (check === true) {
        th = document.createElement("th");
        th.appendChild(document.createTextNode("查看"));
        tr.appendChild(th);
    }
    //创建编辑按钮
    if (edit === true) {
        th = document.createElement("th");
        th.appendChild(document.createTextNode("编辑"));
        tr.appendChild(th);
    }
    //设置订单完成按钮
    if (finish === true) {
        th = document.createElement("th");
        th.appendChild(document.createTextNode("完成"));
        tr.appendChild(th);
    }

    document.getElementById(id).appendChild(tr)

    if(jsonData.length === 0) {
        tr = document.createElement("tr")
        td = document.createElement("td")
        td.appendChild(document.createTextNode('暂无数据'))
        td.colSpan = header.length + 2
        tr.appendChild(td)
        document.getElementById(id).appendChild(tr)
        return
    }

    for(j in jsonData) {
        const obj = jsonData[j]
        const order_id = jsonData[j].id
        const order_status = jsonData[j].status
        tr = document.createElement("tr")
        for(i in header) {
            td = document.createElement("td")
            if (i == 'createTime' || i == 'endTime') {
                td.appendChild(document.createTextNode(getTime(jsonData[j][i])))
            }
            else {
                td.appendChild(document.createTextNode(jsonData[j][i]))
            }
            tr.appendChild(td)
        }
        //创建查看按钮
        if (check === true) {
            td = document.createElement("td")
            var btnCheck = document.createElement("button")
            btnCheck.appendChild(document.createTextNode("查看"))
            btnCheck.addEventListener('click',function() {
                localStorage.setItem('order_id',order_id)
                let text = '<div class="check-order" style="text-align: left;margin-left:20px;"><div>序号:' + obj.id + '</div>'
                    +'<div>订单号:' + obj.serial + '</div>'
                    +'<div>生产流程Id:' + obj.workId + '</div>'
                    +'<div>生产流程名:' + obj.workName + '</div>'
                    +'<div>创建时间:' + getTime(obj.createTime) + '</div></div>'
                Popup.confirm('查看订单详情',text)
                // setFinish(id)
            })
            td.appendChild(btnCheck)
            tr.appendChild(td)
        }
        //创建编辑按钮
        if (edit === true) {
            td = document.createElement("td");
            var btnEdit = document.createElement("button");
            btnEdit.appendChild(document.createTextNode("编辑"));
            btnEdit.addEventListener('click',function() {
                localStorage.setItem('order_id',order_id)
                let text = '<label for="id">生产流程Id</label><input id="id" type="number" />'
                    +'<label for="serial">生产流程Id</label><input id="serial" type="number" />'
                    +'<label for="workId">生产流程Id</label><input id="workId" type="number" />'
                    +'<label for="endTime">生产流程Id</label><input id="endTime" type="datetime-local" />'
                Popup.confirm('修改订单信息',text,setEdit)
                // setFinish(id)
            })
            td.appendChild(btnEdit);
            tr.appendChild(td);
        }
        //创建设置订单完成按钮
        if (finish === true) {
            td = document.createElement("td");
            var btnFinish = document.createElement("button");
            if (order_status === 'finish') {
                btnFinish.appendChild(document.createTextNode("已完成"));
                btnFinish.className = 'tag tag-success'
            }
            else {
                var btnStatus = document.createElement("button");
                btnStatus.appendChild(document.createTextNode("进行中"));
                btnStatus.className = 'tag tag-warning'
                td.appendChild(btnStatus);
                btnFinish.appendChild(document.createTextNode("完成"));
                btnFinish.addEventListener('click',function() {
                    localStorage.setItem('order_id',order_id)
                    Popup.confirm('设置订单状态','确定将该订单状态设为完成吗',setFinish)
                    // setFinish(id)
                })
            }

            td.appendChild(btnFinish);
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
            createTable("table",test,header,true,true,true)
            var ex1 = new tableSort('table',1,2,999,'up','down','hov');
        } else {
            console.log(json.message)
        }
    })
}

function queryOrder(status='') {
    let url = new URL('/api/product/find','http://' + document.domain + ":8080");

    let id = document.getElementById('id').value
    let serial = document.getElementById('serial').value;

    console.log(id)
    console.log(serial)

    if (id !== '' && id !== undefined && id !== null) url.searchParams.append('id', id);
    if (serial !== '') url.searchParams.append('serial', serial);
    if (status !== '') url.searchParams.append('status', status);

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
            createTable("table",json.data.products,header,true,true,true)
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
            createTable("table",test,header,true,true,true)
            var ex1 = new tableSort('table',1,2,999,'up','down','hov');
        } else {
            console.log(json.message)
        }
    })
}

window.onload= function (ev) {
    loadOrder()
}