'use strict';

const createElement = function(_type, _id=null, _class=null, _parent=null, _text=null, _onClick=null) {
    const _el = document.createElement(_type);
    if (_id) _el.id = _id;
    if (_class) {
        const _classes = _class.split(' ');
        for (var i in _classes) {
            _el.classList.add(_classes[i]);
        }
    }
    if (_text) {
        _el.textContent = _text;
    }
    if (_parent) {
        _parent.appendChild(_el);
    }
    if (_onClick) {
        _el.addEventListener('click', _onClick);
    }
    return _el;
}

const swapClass = function(_el, _c1, _c2) {
    const _arr = _c1.split(' ');
    for (var i in _arr) {
        _el.classList.remove(_arr[i]);
    }
    _el.classList.add(_c2);
}

const lerp = function(_from, _to, _n) {
    _n = _n < 0 ? 0 : _n > 1 ? 1 : _n;
    return _from + (_to-_from) * _n;
}

/**
 * Return a human readable date from a Unix Timestamp
 * EX: Aug 1st, 2021
 */
const convertUnixTimestamp = function ( _timestamp ) {
    var a = new Date(_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
}

/**
 * Generate an svg using the symbol of a token
 * Useful if an icon or logo is not available.
 * @param _symbol
 * @returns {string}
 */
const symbolSvgGenerator = function ( _symbol ) {
    return '<div class="token_icon_container">' +
        '<svg height="100" width="100">' +
        '<circle cx="50" cy="50" r="40" fill="#97c5b9" />' +
        '<text x="50" y="50" text-anchor="middle" fill="#27282a" dy=".3em">' + _symbol + '</text>' +
        '</svg>' +
        '</div>';
}

/**
 * Effectively reduces the length of an address by inserting ellipsis between
 * _startLength and _endLength
 * @param _string
 * @param _desired_length
 * @param _startLength
 * @param _endLength
 * @returns {string|*}
 */
const truncateAddress = function ( _string, _desired_length, _startLength, _endLength) {
    return _string.length > _desired_length
        ? _string.substr(0, _startLength) + "..." + _string.substr(_string.length - _endLength, _string.length)
        : _string;
}

module.exports = {
    createElement,
    swapClass,
    lerp,
    convertUnixTimestamp,
    symbolSvgGenerator,
    truncateAddress
}