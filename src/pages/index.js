'use strict'
require('../css/index.css');
require('../css/general.css');
require('regenerator-runtime');

const {
    detectorStart,
    detectorEnd,
    mouseScroll
} = require('../js/components/scrollDetector.js');

const Page = async function() {
    // general script management can happen here
    document.addEventListener('wheel', (e)=> mouseScroll(e));
    document.addEventListener('touchstart', (e)=> detectorStart(e));
    document.addEventListener('touchend', (e)=> detectorEnd(e));
}
document.addEventListener('DOMContentLoaded', Page);
