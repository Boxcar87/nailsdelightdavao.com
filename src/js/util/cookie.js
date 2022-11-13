const Cookies = require('js-cookie');

class Cookie {
    constructor(_cookie) {
        this._cookie = _cookie;
    }

    get() {
        return Cookies.get(this._cookie);
    }

    set(_val) {
        Cookies.set(this._cookie, _val);
    }
}

module.exports = Cookie;