'using strict'

var touchStartX;
var touchStartY;
var watching;

const detectorStart = function(_input){
    touchStartX = _input.touches[0].clientX;
    touchStartY = _input.touches[0].clientY;
}

const detectorEnd = function(_input){

    if(_input.changedTouches[0].clientX < touchStartX){
        //scroll Right
    }
    else{
        //scroll Left
    }
    if(_input.changedTouches[0].clientY < touchStartY){
        //scroll Down
    }
    else{
        //scroll Up 
    }
}

const mouseScroll = function(_input){
    // var _path = [];
    // var _currentElem = _input.target;
    // while (_currentElem) {
    //     _path.push(_currentElem);
    //     _currentElem = _currentElem.parentElement;
    // } 
    // if(_path[0].id == 'details' || _path[1].id == 'details'|| _path[2].id == 'details')
    //     return;
    // if(_input.deltaY > 0){
    //     //scroll Down
    //     // gearDetails('inactive');
    // }
    // else{
    //     //scroll Up
    //     // gearDetails('active');
    // }
}
module.exports = {
    detectorStart,
    detectorEnd,
    mouseScroll
}