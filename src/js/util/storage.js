'use strict';

const encode = function(_val) {
    return Buffer.from(_val).toString('base64');
}

const decode = function(_val) {
    return Buffer.from(_val, 'base64').toString();
}

const saveStorage = function(_key, _val) {
    _key = encode(_key);
    _val = encode(_val);
    localStorage.setItem(_key, _val);
    return decode(localStorage.getItem(_key));
}

const getStorage = function(_key) {
    _key = encode(_key);
    const _data = localStorage.getItem(_key);
    if (!_data) {
        return null;
    }
    return decode(localStorage.getItem(_key));
}

module.exports = {
    saveStorage,
    getStorage
}