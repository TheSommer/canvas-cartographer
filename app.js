var guides = [];

// Counter is used to target the endpoint more aggressively over time
var counter = 0;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var minMaxAngle = 75;
var stepTolerance = 200;

function draw() {
  ctx.fillStyle = "lightgrey";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGuides();

  for(k = 0; k < guides.length; k++){
    console.log("Drawing Guide Group: " + guides[k]);
    for(i = 0; i < guides[k].length; i++){
      if(i < guides[k].length - 1){
        drawPath(guides[k][i].x, guides[k][i].y, guides[k][i+1].x, guides[k][i+1].y);
      }
      else{
        drawPath(guides[k][i].x, guides[k][i].y, guides[k][0].x, guides[k][0].y);
      }
    }
  }
}

function drawGuides(){
  for(k = 0; k < guides.length; k++){
    console.log("Drawing Guide Group: " + guides[k].length);
    for(i = 0; i < guides[k].length; i++){
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(guides[k][i].x, guides[k][i].y);
      if(i < guides[k].length - 1){
        ctx.lineTo(guides[k][i+1].x, guides[k][i+1].y);
      }
      else{
        ctx.lineTo(guides[k][0].x, guides[k][0].y);
      }
      ctx.stroke();
    }
  }
}

function drawPath(startX, startY, endX, endY){
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  addToPath(startX, startY, endX, endY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

function addToPath(startX, startY, endX, endY, complete = false){
  startRadian = Math.atan2(endY - startY, endX - startX);

  // Angle limitation depending on depth
  angle = getRandomInt(-minMaxAngle * (1 - (counter / stepTolerance)), minMaxAngle * (1 - (counter / stepTolerance)));

  newX = startX + 15 * Math.cos(startRadian + degreeToRadian(angle));
  newY = startY + 15 * Math.sin(startRadian + degreeToRadian(angle));

  ctx.lineTo(newX, newY);

  counter = counter + 1;

  if(complete == false && getDistance(newX, newY, endX, endY) > 15){
    addToPath(newX, newY, endX, endY);
  }
  else{
    console.log(counter);
    counter = 0;
  }
}

function importGuide(){
  alert($('#guideImport').val());
  guides = JSON.parse($('#guideImport').val());
  $('#guideExport').val(JSON.stringify(guides));
  drawGuides();
  draw();
}

function radianToDegree(a){
  return a * 57.295779513082;
}

function degreeToRadian(a){
  return a * 0.017453292519;
}

function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDistance(startX, startY, endX, endY){
  a = startX - endX;
  b = startY - endY;
  return Math.sqrt( a*a + b*b );
}

var toolPan = $('#toolPan');
var toolAddGuide = $('#toolAddGuide');
var toolBrush = $('#toolBrush');

var toolSelected = null;

toolPan.click(function(){
  toolSelected = toolPan;
  console.log("Selected Pan-Tool");

  toolPan.addClass("active");

  toolAddGuide.removeClass("active");
  toolBrush.removeClass("active");
});

toolAddGuide.click(function(){
  toolSelected = toolAddGuide;
  console.log("Selected Add Guide-Tool");

  toolAddGuide.addClass("active");

  toolPan.removeClass("active");
  toolBrush.removeClass("active");
});

toolBrush.click(function(){
  toolSelected = toolBrush;
  console.log("Selected Brush-Tool");

  toolBrush.addClass("active");

  toolPan.removeClass("active");
  toolAddGuide.removeClass("active");
});

var tempGuide = [];

$("#canvas").click(event, function(event){
  mouseX = Math.round(event.offsetX * canvas.width / canvas.clientWidth);
  mouseY = Math.round(event.offsetY * canvas.height / canvas.clientHeight);
  console.log("Canvas clicked at: " + mouseX + ", " + mouseY);

  if(toolSelected == toolAddGuide){
    if(tempGuide.length < 1){
      ctx.strokeStyle = 'blue';
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
    }
    else{
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }

    point = {x: mouseX, y: mouseY};
    tempGuide.push(point);
  }
});

$(document).keydown(function(event){
  code = event.keyCode || event.which;
  if(code == 13){
    if(tempGuide.length > 2){
      guides.push(tempGuide);
      ctx.closePath();
      ctx.stroke();
      tempGuide = [];
      document.getElementById('guideExport').value = JSON.stringify(guides);
    }
    else{
      alert("Add atleast 3 points or press Escape to cancel.")
    }
  }
});
