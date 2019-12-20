function getProfile() {
    let url = '/api/user/profile'
    let headers = {
        'content-type': 'application/json;charset=UTF-8',
        'Authorization': 'manage ' + localStorage.getItem('token')
    }

    fetch(url, {
            method: 'GET',
            headers: headers
        }).then(res => res.json())
        .then(function (json) {
            if (json.status === 1) {
                window.localStorage.setItem('profile', JSON.stringify(json.data))
            }
        })
}

function getTime(time) {
    var date = new Date(time)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var seconds = date.getSeconds()

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds
}
// var token = window.localStorage.getItem('token')
// console.log('token')
// console.log(token)