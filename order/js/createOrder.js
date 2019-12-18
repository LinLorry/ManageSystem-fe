var Popup = new Popup();
function createOrder() {
    let url = '/api/product/create'
    let serial = document.getElementById('serial');
    let workId = document.getElementById('workId');
    let endTime = document.getElementById('endTime');
    let comment = document.getElementById('comment');
    console.log(serial.value)
    console.log(workId.value)
    console.log(endTime.value)
    console.log(comment.value)

    if (serial.value.length === 0) {
        setErrorFor(serial,'订单号不能为空！')
    } else {
        setSuccessFor(serial)
    }
    
    if (workId.value.length === 0) {
        setErrorFor(workId,'订单的生成流程ID不能为空！')
    } else {
        setSuccessFor(workId)
    }
    
    if (endTime.value.length === 0) {
        setErrorFor(endTime,'日期不能为空！')
    } else {
        setSuccessFor(endTime)
    }
    
    let data = {
        serial: serial.value,
        workId: workId.value,
        endTime: workId.value,
        comment: comment.value
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
            // window.location.href = './login.html'
            console.log(json.data)
            Popup.toast('创建订单成功');
        } else {
            Popup.alert('创建订单失败',json.message);
        }
    })
    
}

function setErrorFor(input, message) {
    const formItem = input.parentElement;
    const small = formItem.querySelector('small');
    formItem.className = 'form-item error';
    small.innerText = message;
}

function setSuccessFor(input) {
    const formItem = input.parentElement;
    formItem.className = 'form-item success';
}