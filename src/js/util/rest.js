const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

class RestClient 
{
    async get(_url)
    {
        return new Promise((_resolve, _reject) => {
            var _xhr = new XMLHttpRequest();
            _xhr.open('GET', _url);
            // _xhr.setRequestHeader('Content-Type', 'application/json');
            _xhr.onload = () => {
                if (_xhr.readyState == 4 && _xhr.status == 200)
                {
                    _resolve(JSON.parse(_xhr.response));
                    // _resolve(_xhr)

                }
                else if (_xhr.status > 300)
                {
                    // _resolve(JSON.parse(_xhr.response));
                    _reject({
                        status: _xhr.status,
                        statusText: _xhr.statusText
                    });
                }
            }
            _xhr.onerror = () => {
                _reject({
                    status: _xhr.status,
                    statusText: _xhr.statusText
                });
            }
            _xhr.send();
        });
    }

    async postData(_url, _data)
    {
        return new Promise((_resolve, _reject) => {
            var _xhr = new XMLHttpRequest();
            _xhr.open('POST', _url);
            _xhr.setRequestHeader('Content-Type', 'application/json');
            _xhr.onload = () => {
                if (_xhr.readyState == 4 && _xhr.status == 200)
                {
                    _resolve(JSON.parse(_xhr.response));
                }
                else if (_xhr.status > 300)
                {
                    _reject({
                        status: _xhr.status,
                        statusText: _xhr.statusText
                    });
                }
            }
            _xhr.onerror = () => {
                _reject({
                    status: _xhr.status,
                    statusText: _xhr.statusText
                });
            }
            const _send = JSON.stringify(_data);
            _xhr.send(_send);
        });
    }
}

module.exports = new RestClient();