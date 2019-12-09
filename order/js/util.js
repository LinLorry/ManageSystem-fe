function setErrorFor(input, message) {
    const formItem = input.parentElement;
    const small = formItem.querySelector('small');
    small.innerText = message;
}

function getProfile() {
    let url = '/api/user/profile'
    let headers = {
        'Authorization': 'manage ' + localStorage.getItem('token')
    }

    fetch(url, {
        method: 'GET',
        headers: headers
    }).then(res => res.json())
    .then(function(json) {
        if (json.status === 1) {
            window.localStorage.setItem('profile',JSON.stringify(json.data))
        }
    })
}