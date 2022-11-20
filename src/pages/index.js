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
    appointmentPopupSelection,
    appointmentSelection
} = require('../js/interface.js');

const {
    loadAvailableTimes
} = require('../js/appointments');

const Page = async function() {
    // general script management can happen here
    loadAvailableTimes(Date.now());
    const _appointmentModal = document.getElementById('appointment_container');
    const _appointmentPopup = document.getElementById('appointmentPopup');
    document.addEventListener('wheel', (e)=> mouseScroll(e));
    document.addEventListener('touchstart', (e)=> detectorStart(e));
    document.addEventListener('touchend', (e)=> detectorEnd(e));
    _appointmentModal.addEventListener('click', (e)=>  appointmentSelection(e))
    _appointmentPopup.addEventListener('click', (e)=>  appointmentPopupSelection(e))
}
document.addEventListener('DOMContentLoaded', Page);
