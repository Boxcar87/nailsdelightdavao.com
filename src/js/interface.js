'using strict'

const { 
    listedAppointments,
    getDateString 
} = require("./appointments")

const appointmentSelection = async function(_event){
    const _target = _event.target;
    const _path = _event.path; //use for SVG interaction
    console.log(_target);
}

const loadAvailableTimes = async function(){
    var _defaultSlots = ['1000','1000','1030','1030','1100','1100','1130','1130','1200','1200','1230','1230','1300','1300','1330','1330','1400','1400','1430','1430','1500','1500','1530','1530','1600','1600','1630','1630','1700','1700','1730','1730','1800','1800','1830','1830']
    var _appointments = listedAppointments();
    var _shownTimes = {};
    for(var a in _appointments){
        for(var i=0; i<_defaultSlots.length; i++){
            var _index = _appointments[a].findIndex((_el)=> _el == _defaultSlots[i]);
            if(_index != -1){
                _appointments[a][_index] = '';
                continue;
            }
            if(_shownTimes[a] == null)
                _shownTimes[a] = [];
            var _translatedTime = timeToReadable(_defaultSlots[i])
            _shownTimes[a].push(_translatedTime);
        }
    }
    // console.log(_shownTimes);
    var _date = new Date(Date.now())
    var _str = getDateString(_date);
    var _day = _date.getDay();
    // loadSelectedDay(_day, _str, _shownTimes[_str]);
    loadSelectedDay(_day, '2022-12-1', _shownTimes['2022-12-1']);
    //Store 7 days at a time, pull new days accordingly
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

const loadSelectedDay = function(_day, _date, _times){
    _times = [...new Set(_times)];
    var _trimmed = _date.slice(5);
    console.log(_trimmed)
    var _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var _days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var _readableDate = `${_days[_day]} ${_months[parseInt(_trimmed.substring(0,_trimmed.indexOf('-')))-1]} ${_trimmed.slice(_trimmed.indexOf('-')+1,_trimmed.length)}`;
    var _testTime = new Date(Date.now());
    var _currentTime = _testTime.getHours().toString()+_testTime.getMinutes().toString()
    
    var _container = document.getElementById('apt_hours');
    var _booked = document.getElementById('apt_booked');
    for(var i=0; i<_times.length; i++){
        var _measureTime = parseInt(_times[i].slice(0,_times[i].indexOf(':'))+_times[i].slice(_times[i].indexOf(':')+1, _times[i].indexOf(' ')))
        if(_times[i].slice(_times[i].length-2, _times[i].length) == 'PM' && _measureTime.toString().length < 4){
            _measureTime += 1200
        }
        if(_measureTime < parseInt(_currentTime)+200)
            continue;
        var _el = document.createElement('div');
        _el.classList.add('aptHour');
        _el.innerHTML = _times[i];
        _container.appendChild(_el);
    }
    // check for no appointments available and show message
    if(_container.children.length == 0){
        _container.classList.add('hidden');
        _booked.classList.remove('hidden');
    }
    document.getElementById('selected_date').innerHTML = _readableDate;

}

loadAvailableTimes();
module.exports = {
    loadAvailableTimes,
    appointmentSelection
}