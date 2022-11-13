'use strict';
const WindowTypes = require('./windowTypes.js');
const Window = require('./window.js');

class WindowManager {
    constructor(_params) {
        try {
            this._windows = {};
            this._active = null;
            for (var i in _params.windows) {
                var _data = _params.windows[i];
                _data.params.windows = this;
                this._windows[_data.type] = this.generateWindow(_data.type, _data.params);
            }
            this.openWindow(_params.default);
        } catch (_err) {
        }
    }

    generateWindow(_type, _params=null) {
        switch (_type) {
            default:
                return new Window(_params);
        }
    }

    openWindow(_w, _onOpen=null) {
        if (this._active == _w) return;
        if (!this._windows[_w]) {
            console.log(`Invalid window type: ${_w}`);
            return;
        }
        this._windows[_w].open(_onOpen);
        this._active = _w;
    }

    closeWindow(_w, _onClose=null) {
        if (!this._windows[_w]) {
            console.log(`Invalid window type: ${_w}`);
            return;
        }
        this._windows[_w].close(_onClose);
    }

    swapWindow(_openW, _closeW=null) {
        if (!_closeW) {
            _closeW = this._active;
        }
        if (this._active == _openW) return this._active;
        if (!this._windows[_closeW] || !this._windows[_openW]) {
            console.log(`Invalid window type: ${_closeW} OR ${_openW}`);
            return _closeW;
        }
        this.closeWindow(_closeW, function(){
            this.openWindow(_openW);
        }.bind(this));
        return _openW;
    }

    get active() {
        return this._active;
    }
}

module.exports = WindowManager;