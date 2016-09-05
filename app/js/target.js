

var mouse = require('mouse-event')
var mX = 0;
var mY = 0;

const moment = require('moment');

const secondsToTime = (s) => {
  let momentTime = moment.duration(s, 'seconds');
  let sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds();
  let min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes();
  return `${min}:${sec}`
};

const canvas      = document.getElementById('range');
const ctx         = canvas.getContext('2d')

ctx.canvas.width  = window.innerWidth * 0.80;
ctx.canvas.height = window.innerHeight * 0.96;

var shrinkFactor  = 100; // lower is harder to shoot.
var score         = 0;

ctx.fillStyle     = "dimGray"
ctx.fillRect( 0,0,ctx.canvas.width,ctx.canvas.height);

document.getElementById('start').addEventListener('click', function(){
    let game = setInterval(function(){
        drawTarget(Math.floor(Math.random()*ctx.canvas.width), Math.floor(Math.random()*ctx.canvas.height), Math.floor(Math.random()*80+20));
    }, 1000);
    score = 0;
    document.getElementById("time").innerHTML = "Start Game.";
    document.getElementById('score').innerHTML = "Score: " + score;
    displayTime(30, game)
});

function displayTime( time, game ) {
  let timer = setInterval( function(){
    time -= 1
    if( time < 1 ){
        clearInterval(game);
    }
    document.getElementById("time").innerHTML = secondsToTime(time);
  }, 1000);
  setTimeout(function(){
    clearInterval(timer);
    document.getElementById("time").innerHTML = "Time's up.";
    document.getElementById('score').innerHTML = "Final: " + score;
  }, time*1000);
}

function drawTarget(x, y, radius) {
  let timeRad = radius
  let origRad = radius + 2; // just for good measure.
  var target = setInterval(function(){
    ctx.beginPath();
    ctx.arc(x,y,origRad,0,2*Math.PI);
    ctx.fillStyle = "dimGray";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x,y,radius,0,2*Math.PI);
    ctx.fillStyle = "lime";
    ctx.fill();
    if (radius > 0) {
      radius -= 1;
      origRad -= 1;
    }
  }, shrinkFactor);

  // Player never got it.
  setTimeout(function(){
    clearInterval(target)
  }, shrinkFactor * timeRad + 500);


  // Player shot it
  // canvas.addEventListener("click", targetLogic(mX, mY, x, y, radius, target, origRad, ctx));
  canvas.addEventListener("click", function(){
      if ( shotMade( mX, mY, x, y, radius)) {
          clearInterval(target);
          ctx.beginPath();
          ctx.arc(x,y,origRad,0,2*Math.PI);
          ctx.fillStyle = "dimGray";
          ctx.fill();
          radius = 0;           // don't allow double targeting.
          x = 0;
          y = 0;
      }  
  });
}

function targetLogic(mX, mY, x, y, radius, target, origRad, ctx) {
    if ( shotMade( mX, mY, x, y, radius)) {
        clearInterval(target)
        ctx.beginPath();
        ctx.arc(x,y,origRad,0,2*Math.PI);
        ctx.fillStyle = "dimGray";
        ctx.fill();
    }
}

window.addEventListener('mousemove', function(ev) {
  mX = mouse.x(ev);
  mY = mouse.y(ev);
});

function shotMade(x,y, cx, cy, radius) {
  let wide = (x - cx) ** 2;
  let high = (y - cy) ** 2;
  if( Math.sqrt(wide+high) < radius){
    score++;
    document.getElementById("score").innerHTML = "Score: " + score;
    return true;
  } else {
    return false;
  }
}