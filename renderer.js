// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var idleTime = require('@paulcbetts/system-idle-time');
const {dialog} = require('electron').remote;
var timer, timeStarted, timeSince, idleInterval, hasExceededIdleTime = 0, idleTimeRecorded, excludedIdleTime = 0;

startTimerBtn.addEventListener('click', startTimer);
stopTimerBtn.addEventListener('click', stopTimer);

function checkIdleTime(maxIdleTime) {
  idleInterval = setInterval(function(){
    idleTimeRecorded = idleTime.getIdleTime();
    //console.log(idleTimeRecorded, hasExceededIdleTime, maxIdleTime, idleTimeRecorded > maxIdleTime)
    //console.log(hasExceededIdleTime, !!hasExceededIdleTime, idleTimeRecorded, !!hasExceededIdleTime && idleTimeRecorded < 1000)
    if (!!hasExceededIdleTime && idleTimeRecorded < 1000) {
      stopTimer();
      dialog.showMessageBox({type: 'question', title: 'Idle time detected', message: "You have an idle time of "+ Math.floor(hasExceededIdleTime/1000) +" secs. Do you want to add this to your timer?", buttons: ['exclude', 'Include Idle Time']}, idelTimeCallback);
    }
    if (idleTimeRecorded > maxIdleTime) {
      hasExceededIdleTime = idleTimeRecorded;
    }
  }, 1000)
}

function idelTimeCallback(includeIdleTime) {
  if (!includeIdleTime) {
    time.innerHTML = Math.floor(((new Date().getTime() - hasExceededIdleTime) - timeStarted) / 1000) + 'sec';
  }
  hasExceededIdleTime = 0;
}

function startTimer() {
  timeStarted = new Date().getTime();
  timer = setInterval(()=>{
    time.innerHTML = (Math.floor((new Date().getTime() - timeStarted) / 1000)) + 'sec';
  }, 1000);
  checkIdleTime(parseInt(idleTimeInput.value)*1000);
  startTimerBtn.style.display = 'none';
  stopTimerBtn.style.display = 'inline-block';
}

function stopTimer() {
  //timeSince = (timeSince || 0) + Math.floor((new Date().getTime() - timeStarted) / 1000);
  clearInterval(timer);
  clearInterval(idleInterval);
  startTimerBtn.style.display = 'inline-block';
  stopTimerBtn.style.display = 'none';
}
