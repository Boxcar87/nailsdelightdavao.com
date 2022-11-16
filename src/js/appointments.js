'using strict'

const Rest = require('./util/rest.js');
const url = 'https://0043hn7q1b.execute-api.ap-southeast-1.amazonaws.com/dev'
var _appointments = {}

const listedAppointments = function(){
    return _appointments;
}

const getDateString = function(_date){
    const _year = _date.getFullYear();
    const _month =  _date.getMonth()+1;
    const _day = _date.getDate();
    const _final = `${_year}-${_month}-${_day}`;
    return _final;
}
const getAppointment = async function(_firstName, _lastName, _email, _phone, _date, _store){
    const _customerData = await Rest.get(`${url}/getCustomerId?nameFirst=${_firstName}&nameLast=${_lastName}&email=${_email}$phone=${_phone}`);
    const _customerId = _customerData.message;
    const _resp = await Rest.get(`${url}/getAppointments?date=${_date}&customer=${_customerId}&store=${_store}`);
    const _appointment = _resp.message[0];
    return _appointment;
}
const getAppointments = async function(_epoch, _store='1'){
    const _start = new Date(_epoch);
    const _end = new Date(_epoch+691200000);
    const _startDate = getDateString(_start);
    const _endDate =  getDateString(_end);
    const _resp = await Rest.get(`${url}/getAppointments?startDate=${_startDate}&endDate=${_endDate}&store=${_store}`);

    for(var i=0;i<_resp.message.length; i++){
        if(_appointments[_resp.message[i].date] == null)
            _appointments[_resp.message[i].date] = [];
        _appointments[_resp.message[i].date].push(_resp.message[i].time);
    }
    // console.log(_appointments)
    return _appointments
}

const scheduleAppointment = async function(_firstName, _lastName, _email, _phone, _date, _time, _services, _store='1'){
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
            services: _services
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

const test = async function(){
    var _resp = await scheduleAppointment('Beatrice','Voss','evil@email.com','2000000','2022-11-29','1700',['manicure', 'pedicure'])
    console.log(_resp)
    // var _resp2 = await getAppointments(1669263156000);
    // var _resp2 = await getAppointment('Linda','Wright','email@email.com','0000000','2022-11-29')
    // console.log(_resp2)
}
// test();

module.exports = {
    getAppointments,
    scheduleAppointment,
    rescheduleAppointment,
    listedAppointments
}