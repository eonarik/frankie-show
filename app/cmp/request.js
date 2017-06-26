import { CONNECTOR_URL, HOST } from 'const';

let showMessage = require('cmp/showMessage')

module.exports = function (action, params, callback, error) {
    var formData;
    if (params instanceof FormData) {
        formData = params;
    } else {
        formData = new FormData();
        for (var key in params) {
            formData.append(key, params[key]);
        }
    }

    var url = action.indexOf('?') < 0 ? HOST + CONNECTOR_URL + '?pub_action=' + action : action;

    fetch(url, {
        method: 'post',
        credentials: 'same-origin',
        body: formData,
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.success) {
                if (typeof callback === 'function') {
                    callback.call(this, data);
                }
                if (data.message) {
                    showMessage(data.message)
                }
            } else {
                if (typeof error === 'function') {
                    error.call(this, data);
                }
                console.log('Request Error', data);
                if (data.message) {
                    showMessage(data.message)
                }
            }
        })
        .catch(function (error) {
            console.log(error)
            showMessage('Невозможно отобразить страницу');
        });
}
