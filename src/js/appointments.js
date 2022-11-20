'using strict'

const Rest = require('./util/rest.js');
const url = 'https://0043hn7q1b.execute-api.ap-southeast-1.amazonaws.com/dev'
var _appointments = {"2022-11-20":["1500","1530","1700"],"2022-11-21":["1100","1130","1130","1200","1200","1230","1300","1300","1400","1400","1700","1700"],"2022-12-1":["1100","1230","1700","1700"]}

const listedAppointments = function(){
    var _clone = JSON.parse(JSON.stringify(_appointments))
    return _clone;
}

const getDateString = function(_epoch=null){    
    _dateStr = new Date(Date.now()).toLocaleString("en-US", {timeZone: "Asia/Manila"})
    if(_epoch != null)
        _dateStr = new Date(_epoch).toLocaleString("en-US", {timeZone: "Asia/Manila"})
    var _month = _dateStr.substring(0, _dateStr.indexOf('/'));
    _dateStr = _dateStr.substring(_dateStr.indexOf('/')+1, _dateStr.length);
    var _day = _dateStr.substring(0, _dateStr.indexOf('/'));
    _dateStr = _dateStr.substring(_dateStr.indexOf('/')+1, _dateStr.length);
    var _year = _dateStr.slice(0, _dateStr.indexOf(','));
    _dateStr = _dateStr.substring(_dateStr.indexOf('/')+1, _dateStr.length);
    _dateStr = _dateStr.substring(_dateStr.indexOf(',')+2, _dateStr.length);
    const _time = _dateStr.substring(0, _dateStr.length-6)+_dateStr.substring(_dateStr.length-3, _dateStr.length);
    const _string = `${_year}-${_month}-${_day}`;
    const _date = new Date(_year, _month-1, _day);
    return [_string, _date, _time];
}
const getAppointment = async function(_firstName, _lastName, _email, _phone, _date, _store){
    const _customerData = await Rest.get(`${url}/getCustomerId?nameFirst=${_firstName}&nameLast=${_lastName}&email=${_email}$phone=${_phone}`);
    const _customerId = _customerData.message;
    const _resp = await Rest.get(`${url}/getAppointments?date=${_date}&customer=${_customerId}&store=${_store}`);
    const _appointment = _resp.message[0];
    return _appointment;
}
const getAppointments = async function(_epoch=null, _store='1'){
    var [_startDate, _date,] = getDateString();
    var _tempDate = new Date(_date);
    var _endEpoch = _tempDate.getTime() + 2592000000;
    var [_endDate,,] = getDateString(_endEpoch)
    const _resp = await Rest.get(`${url}/getAppointments?startDate=${_startDate}&endDate=${_endDate}&store=${_store}`);

    for(var i=0;i<_resp.message.length; i++){
        if(_appointments[_resp.message[i].date] == null)
            _appointments[_resp.message[i].date] = [];
        _appointments[_resp.message[i].date].push(_resp.message[i].time);
    }
    // console.log(_appointments)
    return _appointments
}

const scheduleAppointment = async function(_firstName, _lastName, _email, _phone, _date, _time, _store='1'){
    var _data = {
        customer: {
            nameFirst: _firstName,
            nameLast: _lastName,
            email: _email,
            phone: _phone,
            birthday: ''
        },
        appointment: {
            store: _store,
            date: _date,
            time: _time,
            source: 'website'
        }
    }
    const _resp = await Rest.postData(`${url}/setAppointment`, _data);
    return _resp
}

const rescheduleAppointment = async function(_firstName, _lastName, _email, _phone, _oldDate, _newDate, _time, _services, _store='1'){
    const _appointment = await getAppointment(_firstName, _lastName, _email, _phone, _oldDate, _store);
    const _appointmentId = _appointment._id;
    const _data = {
        appointmentId: _appointmentId,
        new:{
            date: _newDate,
            time: _time
        }
    }
    const _resp = await Rest.postData(`${url}/editAppointment`, _data);
    return _resp
}

const loadAvailableTimes = async function(_epoch){
    var [_str, _newDate,] = getDateString(_epoch);
    var _day = _newDate.getDay();
    var _defaultSlots = ['1000','1000','1030','1030','1100','1100','1130','1130','1200','1200','1230','1230','1300','1300','1330','1330','1400','1400','1430','1430','1500','1500','1530','1530','1600','1600','1630','1630','1700','1700','1730','1730','1800','1800','1830','1830']
    let _appointments = listedAppointments();
    var _shownTimes = {};
    for(var i=0; i<_defaultSlots.length; i++){
        if(_appointments[_str]){
            var _index = _appointments[_str].findIndex((_el)=> _el == _defaultSlots[i]);
            if(_index != -1){
                _appointments[_str][_index] = '';
                continue;
            }
        }
        if(_shownTimes[_str] == null)
            _shownTimes[_str] = [];
        var _translatedTime = timeToReadable(_defaultSlots[i])
        _shownTimes[_str].push(_translatedTime);
    }
    // console.log(_shownTimes);
    loadSelectedDay(_day, _str, _shownTimes[_str], _newDate);
}

const timeToReadable = function(_time){
    var _denom = parseInt(_time) >= 1200 ? 'PM' : 'AM';
    if(parseInt(_time) >= 1300){
        _time = parseInt(_time)-1200;
    }
    var _readable = _time.toString();
    var _middle = _readable.length == 4 ? 2 : 1;
    _readable = _readable.slice(0,_middle)+':'+_readable.slice(_middle)+' '+_denom;
    return _readable;
}

const loadSelectedDay = function(_day, _date, _times, _selectedDate){
    _times = [...new Set(_times)];
    var _readableDate = getReadableDate(_day, _date);
    var [,_currentDate,_currentTime] = getDateString();
    var _denom = _currentTime.substring(_currentTime.length-2, _currentTime.length);
    _currentTime = _currentTime.replaceAll(':', '');
    _currentTime = _currentTime.substring(0, _currentTime.length-3);
    if(_denom == 'PM' && _currentTime.length < 4)
        _currentTime = parseInt(_currentTime) + 1200;
    
    var _container = document.getElementById('apt_hours');
    var _booked = document.getElementById('apt_booked');
    for(var i=0; i<_times.length; i++){
        var _measureTime = parseInt(_times[i].slice(0,_times[i].indexOf(':'))+_times[i].slice(_times[i].indexOf(':')+1, _times[i].indexOf(' ')))
        if(_times[i].slice(_times[i].length-2, _times[i].length) == 'PM' && _measureTime.toString().length < 4){
            _measureTime += 1200
        }
        if(_currentDate.getTime() >= _selectedDate.getTime() && _measureTime < _currentTime + 200){
            continue;
        }
        var _el = document.createElement('div');
        _el.classList.add('aptHour');
        _el.id = 'Hour_'+_date+'_'+_times[i].replaceAll(' ', '-');
        _el.innerHTML = _times[i];
        _el.setAttribute('data-time', _measureTime);
        _container.appendChild(_el);
    }
    if(_container.children.length == 0){
        _container.classList.add('hidden');
        _booked.classList.remove('hidden');
    }
    var _selected = document.getElementById('selected_date');
    _selected.innerHTML = _readableDate;
    _selected.setAttribute('data-date', _selectedDate.getTime());
}

const getReadableDate = function(_day, _date){
    var _trimmed = _date.slice(5);
    var _days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${_days[_day]} ${_months[parseInt(_trimmed.substring(0,_trimmed.indexOf('-')))-1]} ${_trimmed.slice(_trimmed.indexOf('-')+1,_trimmed.length)}`;
}

const validateAppointmentParams = function(_firstName, _lastName, _email, _phone, _date, _time){
    var _data = {valid: true};
    var _mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var _emailResult = _email.match(_mailFormat) ? _email.match(_mailFormat) : [];
    if(!_firstName){
        _data.nameFirst = 'Please enter your first name'
        _valid = false;
    }
    if(!_lastName){
        _data.nameLast = 'Please enter your last name'
        _data.valid = false;
    }
    if(_emailResult.length == 0 && _phone.length < 10){
        if(_phone.length > 0)
            _data.contact = 'Please enter a valid phone number';
        else if(_email.length > 0)
            _data.contact = 'Please enter a valid email address';
        else
            _data.contact = 'Please enter either a phone # or an email address';
        _data.valid = false;
    }
    if(!_date){
        _data.date = 'Error: Issue processing date. Please call the store to schedule appointment.'
        _data.valid = false;
    }
    if(!_time){
        _data.time = 'Error: Issue processing selected time. Please call the store to schedule appointment.'
        _data.valid = false;
    }
    return _data
}

const test = async function(){
    // var _resp = await scheduleAppointment('Beatrice','Voss','evil@email.com','2000000','2022-11-29','1700',['manicure', 'pedicure'])
    // console.log(_resp)
    // var _resp2 = await getAppointments();
    // var _resp2 = await getAppointment('Linda','Wright','email@email.com','0000000','2022-11-29')
    // console.log(_resp2)
}
// test();

module.exports = {
    getAppointments,
    scheduleAppointment,
    rescheduleAppointment,
    loadAvailableTimes,
    validateAppointmentParams,
    getDateString
}