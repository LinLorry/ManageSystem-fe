var Popup = new Popup();

const header = {
    "id": "序号",
    "serial": "订单号",
    "workName": "生成流程",
    "createTime": "创建时间",
    "endTime": "出货时间"
    // "status": "状态"
};

const orderField = [
    "id", "serial","workName", "createTime", "endTime"
]

function setFinish(id) {
    let url = '/api/product/finish?id=' + id
    fetch(url, {
            headers: {
                'content-type': 'application/json;charset=UTF-8',
                'Authorization': 'manage ' + localStorage.getItem('token')
            },
            method: 'POST'
        })
        .then(res => res.json())
        .then(function (json) {
            if (json.status === 1) {
                Popup.toast('设置成功', 2)
                loadOrder()
            } else {
                Popup.alert('提示', '设置失败！')
            }
        })
}

function setEdit() {
    let title = '编辑'
    console.log(title)
    const text = '<div class="confirm-box">' +
        '<label for="serial">订单号*</label>' +
        '<div class="show-box">' +
        '<input id="serial" type="text" />' +
        '</div><br>' +
        '<label for="workId">生产流程Id：</label>' +
        '<div class="show-box">' +
        '<input type="number" name="workId" id="workId" onchange="javascript:loadWorkName()">' +
        '</div><br>' +
        '<label for="workName">生产流程名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" name="workName" id="workName" disabled="true">' +
        '<img id="work-img-load" src="images/load.png" title="加载中" style="display: none;">' +
        '<img id="work-img-tick" src="images/tick.png" title="id正确" style="display: none;">' +
        '<img id="work-img-cross" src="images/cross.png" title="id错误" style="display: none;">' +
        '</div><br>' +
        '<label for="endTime">需求时间*</label>' +
        '<div class="show-box">' +
        '<input id="endTime" type="date" />' +
        '</div><br>' +
        '</div>';

    Popup.confirm('编辑', text, editAction);
}

function editAction() {
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
        .then(function (json) {
            if (json.status === 1) {
                loadOrder()
                Popup.toast('更新订单成功');
            } else {
                Popup.alert('更新订单失败', json.message);
            }
        })
}

function setCheck (obj) {
    console.log(obj)
    let text = '<div class="check-order" style="text-align: left;margin-left:20px;">' +
        '<div>序号:' + obj.id + '</div>' +
        '<div>订单号:' + obj.serial + '</div>' +
        '<div>生产流程Id:' + obj.workId + '</div>' +
        '<div>生产流程名:' + obj.workName + '</div>' +
        '<div>创建时间:' + getTime(obj.createTime) + '</div></div>'
    Popup.confirm('查看订单详情', text)
}

function setDelete(id) {
    let url = '/api/product/delete?id=' + id
    fetch(url, {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Authorization': 'manage ' + localStorage.getItem('token')
        },
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(function(json) {
            if (json.status === 1) {
                loadOrder()
                Popup.toast('删除成功',2)
            } else {
                Popup.alert('删除失败',json.message)
            }
        })
}

function createTable_(data) {
    let tbody = document.getElementById('orderTbody')

    if (data.length === 0) {
        tr = document.createElement("tr")
        td = document.createElement("td")
        td.appendChild(document.createTextNode('暂无数据'))
        tr.appendChild(td)
        tbody.appendChild(tr)
        return
    }

    data.forEach(elem => {
        let tr = document.createElement('tr')
        tbody.appendChild(tr)

        orderField.forEach(field => {
            let td = document.createElement('td')

            if (field === 'createTime' || field === 'endTime') {
                td.appendChild(document.createTextNode(getTime(elem[field])))
            } else {
                td.appendChild(document.createTextNode(elem[field]))
            }
            switch (field) {
                case "id": td.style.width = "8%"
                    break
                case "serial": td.style.width = "10%"
                    break
                case "workName": td.style.width = "12%"
                    break
                case "createTime": td.style.width = "12%"
                    break
                case "endTime": td.style.width = "12%"
                    break
            }
            tr.appendChild(td)
        })

        let td = document.createElement('td')
        td.style.width = "10%"

        let btnCheck = document.createElement("button");
        td.appendChild(btnCheck);

        btnCheck.appendChild(document.createTextNode("查看"));
        btnCheck.addEventListener('click', function () {
            setCheck(elem)
        });
        tr.appendChild(td)

        td = document.createElement('td')
        td.style.width = "10%"
        let btnEdit = document.createElement("button");
        td.appendChild(btnEdit);

        btnEdit.appendChild(document.createTextNode("编辑"));
        btnEdit.addEventListener('click', function () {
            setEdit()
        })
        tr.appendChild(td)

        td = document.createElement("td")

        let btnFinish = document.createElement("button");
        td.appendChild(btnFinish);

        if (elem.status === 'finish') {
            btnFinish.appendChild(document.createTextNode("已完成"));
            btnFinish.className = 'tag tag-success'
        } else {
            var btnStatus = document.createElement("button");
            btnStatus.appendChild(document.createTextNode("进行中"));
            btnStatus.className = 'tag tag-warning'
            td.appendChild(btnStatus);
            btnFinish.appendChild(document.createTextNode("完成"));
            btnFinish.addEventListener('click', function () {
                setFinish(elem.id)
            })
        }
        tr.appendChild(td);

        td = document.createElement("td")
        td.style.width = "10%"
        let btnDelete = document.createElement("button");
        btnDelete.appendChild(document.createTextNode("删除"));
        btnDelete.addEventListener('click',function () {
            setDelete(elem.id)
            setDelete(elem.id)
        })
        td.appendChild(btnDelete);
        tr.appendChild(td);
    })

}

function createTable(id, jsonData, header, check, edit, finish) {
    var tr, td, th

    tr = document.createElement("tr")

    if (jsonData.length === 0) {
        tr = document.createElement("tr")
        td = document.createElement("td")
        td.appendChild(document.createTextNode('暂无数据'))
        td.colSpan = header.length + 2
        tr.appendChild(td)
        document.getElementById(id).appendChild(tr)
        return
    }

    for (j in jsonData) {
        const obj = jsonData[j]
        const order_id = jsonData[j].id
        const order_status = jsonData[j].status
        tr = document.createElement("tr")
        for (i in header) {
            td = document.createElement("td")
            if (i == 'createTime' || i == 'endTime') {
                td.appendChild(document.createTextNode(getTime(jsonData[j][i])))
            } else {
                td.appendChild(document.createTextNode(jsonData[j][i]))
            }
            tr.appendChild(td)
        }
        //创建查看按钮
        if (check === true) {
            td = document.createElement("td")
            var btnCheck = document.createElement("button")
            btnCheck.appendChild(document.createTextNode("查看"))
            btnCheck.addEventListener('click', function () {
                localStorage.setItem('order_id', order_id)
                let text = '<div class="check-order" style="text-align: left;margin-left:20px;"><div>序号:' + obj.id + '</div>' +
                    '<div>订单号:' + obj.serial + '</div>' +
                    '<div>生产流程Id:' + obj.workId + '</div>' +
                    '<div>生产流程名:' + obj.workName + '</div>' +
                    '<div>创建时间:' + getTime(obj.createTime) + '</div></div>'
                Popup.confirm('查看订单详情', text)
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
            btnEdit.addEventListener('click', function () {
                localStorage.setItem('order_id', order_id)
                let text = '<label for="id">生产流程Id</label><input id="id" type="number" />' +
                    '<label for="serial">生产流程Id</label><input id="serial" type="number" />' +
                    '<label for="workId">生产流程Id</label><input id="workId" type="number" />' +
                    '<label for="endTime">生产流程Id</label><input id="endTime" type="datetime-local" />'
                Popup.confirm('修改订单信息', text, setEdit)
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
            } else {
                var btnStatus = document.createElement("button");
                btnStatus.appendChild(document.createTextNode("进行中"));
                btnStatus.className = 'tag tag-warning'
                td.appendChild(btnStatus);
                btnFinish.appendChild(document.createTextNode("完成"));
                btnFinish.addEventListener('click', function () {
                    localStorage.setItem('order_id', order_id)
                    Popup.confirm('设置订单状态', '确定将该订单状态设为完成吗', setFinish)
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
        .then(function (json) {
            if (json.status === 1) {
                document.getElementById('orderTbody').innerHTML = "";
                createTable_(json.data.products)
                // createTable("orderTbody", test, header, true, true, true)
                var ex1 = new tableSort('table', 1, 2, 999, 'up', 'down', 'hov');
            } else {
                console.log(json.message)
            }
        })
}

function queryOrder(status = '') {
    let url = new URL('/api/product/find', 'http://' + document.domain + ":8080");

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
        .then(function (json) {
            if (json.status === 1) {
                console.log(json.data.products)
                document.getElementById('orderTbody').innerHTML = "";
                createTable_(json.data.products)
                // createTable("table", json.data.products, header, true, true, true)
                var ex1 = new tableSort('table', 1, 2, 999, 'up', 'down', 'hov')
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
        .then(function (json) {
            if (json.status === 1) {
                document.getElementById('orderTbody').innerHTML = "";
                // localStorage.setItem('products', JSON.stringify(json.data.products))
                // var test = JSON.parse(localStorage.getItem('products'))
                // console.log(test)
                document.getElementById('orderTbody').innerHTML = "";
                createTable_(json.data.products)
                // createTable("table", test, header, true, true, true)
                var ex1 = new tableSort('table', 1, 2, 999, 'up', 'down', 'hov');
            } else {
                console.log(json.message)
            }
        })
}

function createAction() {
    let title = '创建订单'
    const text = '<div class="confirm-box">' +
        '<label for="serial2">订单号*</label>' +
        '<div class="show-box">' +
        '<input id="serial2" type="text" />' +
        '</div><br>' +
        '<label for="workId">生产流程Id：</label>' +
        '<div class="show-box">' +
        '<input type="number" name="workId" id="workId" onchange="javascript:loadWorkName()">' +
        '</div><br>' +
        '<label for="workName">生产流程名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" name="workName" id="workName" disabled="true">' +
        '<img id="work-img-load" src="images/load.png" title="加载中" style="display: none;">' +
        '<img id="work-img-tick" src="images/tick.png" title="id正确" style="display: none;">' +
        '<img id="work-img-cross" src="images/cross.png" title="id错误" style="display: none;">' +
        '</div><br>' +
        '<label for="endTime">需求时间*</label>' +
        '<div class="show-box">' +
        '<input id="endTime" type="date" />' +
        '</div><br>' +
        '<label for="comment">备注</label>' +
        '<div class="show-box">' +
        '<input id="comment" type="text" />' +
        '</div><br>' +
        '</div>'
    console.log(title)
    Popup.confirm('创建订单', text, createOrder);
}

function createOrder() {
    let serial = document.getElementById('serial2');
    let workId = document.getElementById('workId');
    let endTime = document.getElementById('endTime');
    let comment = document.getElementById('comment');

    console.log(serial.value)

    if (serial.length === 0) {
        Popup.alert('订单创建', '订单号生产流程Id不能为空')
        return
    } else if (workId.length === 0) {
        Popup.alert('订单创建', '生产流程Id不能为空')
        return
    } else if (endTime.length === 0) {
        Popup.alert('订单创建', '需求时间不能为空')
        return
    }

    let url = '/api/product/create'

    let data = {
        serial: serial.value,
        workId: workId.value,
        endTime: endTime.value,
        comment: comment.value
    }

    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(function (json) {
            if (json.status === 1) {
                // window.location.href = './login.html'
                console.log(json.data)
                Popup.toast('创建订单成功');
            } else {
                Popup.alert('创建订单失败',json.message);
            }
        })
}

window.onload = function (ev) {
    loadOrder()
}

function loadWorkName() {
    let load = document.getElementById('work-img-load')
    let tick = document.getElementById('work-img-tick')
    let cross = document.getElementById('work-img-cross')
    workName.value = ''
    load.style.display = 'none'
    tick.style.display = 'none'
    cross.style.display = 'none'

    if (workId.value.length === 0) return
    const url = '/api/work/find?id=' + workId.value
    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token')
    }

    load.style.display = 'inline'
    fetch(url, {
        method: 'GET',
        headers: headers
    })
        .then(response => {
            load.style.display = 'none'
            return response.json()
        })
        .then(function (json) {
            if (json.status === 1 && json.data.works.length !== 0) {
                workName.value = json.data.works[0].name;
                tick.style.display = 'inline'
            } else {
                cross.style.display = 'inline'
            }
        })
        .catch(() => {
            cross.style.display = 'inline'
        })
}
