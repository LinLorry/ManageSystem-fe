var Popup = new Popup();
var totalNumber = 1;
var nowPage = 1;

const workProcessField = [
    'workId', 'workName',
    'processId', 'processName',
    'sequenceNumber'
]

window.onload = function () {
    // this.create()
    this.loadWorkProcess(1)
}

function loadWorkProcess(pageNumber) {
    const url = '/api/workProcess/find'
    const data = {
        'pageNumber': pageNumber - 1
    }
    const headers = {
        'Authorization': 'manage ' + localStorage.getItem('token'),
        'content-type': 'application/json;charset=UTF-8'
    }

    nowPage = pageNumber

    fetch(url, {
            body: JSON.stringify(data),
            headers: headers,
            method: 'POST'
        })
        .then(response => response.json())
        .then(function (json) {
            Popup.toast(json.message)
            if (json.status === 1) {
                let data = json.data
                totalNumber = data.total
                dealWithPageSelect()
                data.workProcesses.forEach(element => {
                    let tr = document.createElement('tr')
                    workPorcessTbody.appendChild(tr)

                    for (key of workProcessField) {
                        let td = document.createElement('td')
                        tr.appendChild(td)
                        td.textContent = element[key]
                    }

                    let td = document.createElement('td')
                    tr.appendChild(td)
                    td.textContent = new Date(element.updateTime).toLocaleDateString()

                    td = document.createElement('td')
                    tr.appendChild(td)
                    td.textContent = new Date(element.createTime).toLocaleDateString()
                });
            }
        })
}

function dealWithPageSelect() {
    let pageSelectBox = document.getElementsByClassName('pageSelectBox')[0]
    pageSelectBox.innerHTML = ''

    if (totalNumber == 1) {
        return;
    } else if (totalNumber < 6) {
        for (var i = 1; i <= totalNumber; ++i) {
            let b = document.createElement('button')
            b.textContent = i
            b.onclick = function () {
                loadWorkProcess(i)
            }
            pageSelectBox.appendChild(b);
        }
    } else {
        if (nowPage != 1) {
            let previous = document.createElement('button')
            pageSelectBox.appendChild(previous)

            previous.textContent = '上一页'
            previous.onclick = function () {
                loadWorkProcess(nowPage - 1)
            }
        }

        let inputNumber = document.createElement('input')
        pageSelectBox.appendChild(inputNumber)
        inputNumber.type = 'number'
        inputNumber.style = '-webkit-appearance: none; -moz-appearance:textfield; width: 1em'


        let totalLabel = document.createElement('label')
        pageSelectBox.appendChild(totalLabel)
        totalLabel.textContent = ' / ' + totalNumber

        if (nowPage != totalNumber) {
            let next = document.createElement('button')
            pageSelectBox.appendChild(next)

            next.textContent = '下一页'
            next.onclick = function () {
                loadWorkProcess(nowPage + 1)
            }
        }
    }
}

function create() {
    const title = '创建会议'
    const text = '<div class="create-box">' +
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
        '<label for="processId">工序Id：</label>' +
        '<div class="show-box">' +
        '<input type="number" name="processId" id="processId" onchange="javascript:loadProcessName()">' +
        '</div><br>' +
        '<label for="workName">工序名称：</label>' +
        '<div class="show-box">' +
        '<input type="text" name="processName" id="processName" disabled="true">' +
        '<img id="process-img-load" src="images/load.png" title="加载中" style="display: none;">' +
        '<img id="process-img-tick" src="images/tick.png" title="id正确" style="display: none;">' +
        '<img id="process-img-cross" src="images/cross.png" title="id错误" style="display: none;">' +
        '</div><br>' +
        '<label for="sequenceNumber">流程工序顺序：</label>' +
        '<div class="show-box">' +
        '<input type="number" name="sequenceNumber" id="sequenceNumber">' +
        '</div><br>' +
        '</div>'

    let createFunction = function () {
        console.log("???")
    }
    Popup.confirm(title, text, createFunction);

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

function loadProcessName() {
    let load = document.getElementById('process-img-load')
    let tick = document.getElementById('process-img-tick')
    let cross = document.getElementById('process-img-cross')
    processName.value = ''
    load.style.display = 'none'
    tick.style.display = 'none'
    cross.style.display = 'none'

    if (workId.value.length === 0) return
    const url = '/api/process/find?id=' + processId.value
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
            if (json.status === 1 && json.data.processes.length !== 0) {
                processName.value = json.data.processes[0].name;
                tick.style.display = 'inline'
            } else {
                cross.style.display = 'inline'
            }
        })
        .catch(e => {
            cross.style.display = 'inline'
        })
}