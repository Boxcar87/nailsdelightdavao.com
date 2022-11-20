'using strict'
const { 
    validateAppointmentParams,
    scheduleAppointment,
    loadAvailableTimes,
    getDateString 
} = require("./appointments")

var _selectedHour = null;

const appointmentSelection = async function(_event){
    const _target = _event.target;
    console.log(_target);
    if(_target.id.substring(0,8) == 'rightSVG'){
        var _epoch = document.getElementById('selected_date').getAttribute('data-date');
        nextDay(_epoch)
    }
    if(_target.id.substring(0,7) == 'leftSVG'){
        var _epoch = document.getElementById('selected_date').getAttribute('data-date');
        previousDay(_epoch)
    }
    if(_target.id.substring(0,5) == 'Hour_'){
        console.log(_selectedHour)
        if(_selectedHour)
            _selectedHour.classList.remove('selectedHour');
        _target.classList.add('selectedHour');
        _selectedHour = _target;
    }
    if(_target.id == 'apt_confirm'){
        if(!_selectedHour){
            console.log('no time selected')
            return;
        }

        var _date = _selectedHour.id.slice(5)
        _date = _date.substring(0, _date.indexOf('_'))
        var _time = _selectedHour.getAttribute('data-time');
        var _firstName = document.getElementById('apt_firstName').value;
        var _lastName = document.getElementById('apt_lastName').value;
        var _phone = document.getElementById('apt_phone').value;
        var _email = document.getElementById('apt_email').value;
        var _valResp = validateAppointmentParams(_firstName, _lastName, _email, _phone, _time, _date);
        appointmentPopup(_valResp);
    }
}

const appointmentPopupSelection = async function(_event){
    const _target = _event.target;
    console.log(_target)
    if(_target.id == 'appointmentPopupClose'){
        var _bg = document.getElementById('darkenedBG');
        var _popup = document.getElementById('appointmentPopup');
        _bg.classList.add('hidden');
        _popup.classList.add('hidden');        
    }

}

const appointmentPopup = async function(_data){
    var _popup = document.getElementById('appointmentPopup');
    var _popupText = document.getElementById('appointmentPopupText');
    var _popupImage = document.getElementById('appointmentPopupImage');
    var _bg = document.getElementById('darkenedBG');
    _popup.classList.remove('hidden');
    _bg.classList.remove('hidden');
    var _message = 'Scheduling appointment...';
    if(_data.date){
        _message = _data.date;
        _popupText.textContent = _message;
        _popupImage.src = _popupImage.getAttribute('data-error');
        return;
        //populate
    }
    if(_data.time){
        _message = _data.time;
        _popupText.textContent = _message;
        _popupImage.src = _popupImage.getAttribute('data-error');
        return;
        //populate
    }
    if(_data.nameFirst){
        _message = _data.nameFirst;
        _popupText.textContent = _message;
        _popupImage.src = _popupImage.getAttribute('data-error');
        return;
        //populate
    }
    if(_data.nameLast){
        _message = _data.nameLast;
        _popupText.textContent = _message;
        _popupImage.src = _popupImage.getAttribute('data-error');
        return;
        //populate
    }
    if(_data.contact){
        _message = _data.contact;
        _popupText.textContent = _message;
        _popupImage.src = _popupImage.getAttribute('data-error');
        return;
        //populate
    }
    // var _appointmentResp = await scheduleAppointment(_firstName, _lastName, _email, _phone, _date, _time);
}

const nextDay = function(_epoch){
    var _limitDate = new Date(Date.now()+2592000000);
    var _nextDate = new Date(parseInt(_epoch)+86400000);
    _limitDate.setHours(0,0,0,0);
    _nextDate.setHours(0,0,0,0);
    if(_limitDate < _nextDate){
        return
    }
    var [,_dateStr,] = getDateString(_nextDate);
    _limitDate.setHours(0,0,0,0);
    var _container = document.getElementById('apt_hours');
    var _booked = document.getElementById('apt_booked');
    _container.innerHTML = '';
    _container.classList.remove('hidden');
    _booked.classList.add('hidden');
    loadAvailableTimes(_nextDate.getTime());
}

const previousDay = function(_epoch){
    var _limitDate = new Date(Date.now());
    var _previousDate = new Date(parseInt(_epoch)-86400000);
    _previousDate.setHours(0,0,0,0);
    _limitDate.setHours(0,0,0,0);
    if(_limitDate > _previousDate){
        return
    }
    var [,_dateStr,] = getDateString(_previousDate);
    console.log(_dateStr)
    var _container = document.getElementById('apt_hours');
    var _booked = document.getElementById('apt_booked');
    _container.innerHTML = '';
    _container.classList.remove('hidden');
    _booked.classList.add('hidden');
    loadAvailableTimes(_previousDate.getTime());
}

// loadAvailableTimes();
module.exports = {
    loadAvailableTimes,
    appointmentSelection,
    appointmentPopupSelection
}