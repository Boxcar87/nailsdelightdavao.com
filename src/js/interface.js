'using strict'

const { getAppointments } = require("./appointments")

const appointmentSelection = async function(_event){
    const _target = _event.target;
    const _path = _event.path; //use for SVG interaction
    console.log(_target);
}

const loadAppointments = async function(){
    var _appointments = getAppointments();

    //Dom appointment date and hours here. 
    //Store 7 days at a time, pull new days accordingly
}

module.exports = {
    loadAppointments,
    appointmentSelection
}