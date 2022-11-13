'use strict';
const {swapClass} = require('../globals.js');

const WindowState = {
    CLOSED:0x000,
    CLOSING:0x001,
    OPENED:0x010,
    OPENING:0x011
}
class Window {
    constructor(_params) {
        this._el = document.getElementById(_params.id);
        this._state = WindowState.CLOSED;
        this.__on_open__ = this.__on_open__.bind(this);
        this.__on_close__ = this.__on_close__.bind(this);
    }

    __on_open__() {} //override for initialization
    __on_close__() {} //override for disposal

    close(_onClose=null) {
        if (this._state != WindowState.OPENED) return;
        this._state = WindowState.CLOSING;
        swapClass(this._el, 'hidden fadeIn', 'swipeLeftOut');
        // setTimeout(function(){
        //     this._state = WindowState.CLOSED;
        //     this.__on_close__();
        //     this._el.classList.add('hidden');
        //     if (_onClose) {
        //         _onClose();
        //     }
        // }.bind(this), 550);
        this._state = WindowState.CLOSED;
        this.__on_close__();
        this._el.classList.add('hidden');
        if (_onClose) {
            _onClose();
        }
    }

    open(_onOpen=null) {
        if (this._state != WindowState.CLOSED) return;
        this._state = WindowState.OPENING;
        swapClass(this._el, 'hidden swipeLeftOut', 'fadeIn');
        this.__on_open__();
        // setTimeout(function(){
        //     this._state = WindowState.OPENED;
        //     if (_onOpen) {
        //         _onOpen();
        //     }
        // }.bind(this), 550);
        this._state = WindowState.OPENED;
        if (_onOpen) {
            _onOpen();
        }
    }

    get el() {
        return this._el;
    }

    set el(_val) {
        this._el = _val;
    }
}

module.exports = Window;