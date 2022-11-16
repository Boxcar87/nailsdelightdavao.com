'use strict'
require('../css/index.css');
require('../css/general.css');
require('regenerator-runtime');

const {
    detectorStart,
    detectorEnd,
    mouseScroll
} = require('../js/components/scrollDetector.js');

const {
    appointmentSelection,
    loadAppointments
} = require('../js/interface.js');

const Page = async function() {
    // general script management can happen here
    const _appointmentModal = document.getElementById('appointment_container');
    document.addEventListener('wheel', (e)=> mouseScroll(e));
    document.addEventListener('touchstart', (e)=> detectorStart(e));
    document.addEventListener('touchend', (e)=> detectorEnd(e));
    _appointmentModal.addEventListener('click', (e)=>  appointmentSelection(e))
}
document.addEventListener('DOMContentLoaded', Page);
