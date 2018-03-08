// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var Jimp = require("jimp");

var last;

function output(data) {
  document.querySelector('#output').innerHTML = document.querySelector('#output').innerHTML + "<br>" + data;
}
function output2(data) {
  document.querySelector('#output').innerHTML = data;
}

function loadFile(){
  // get file
  if(!document.querySelector('#fileInput').files[0]) {
    output("Error: no file selected!\n");
    return;
  }
  var fileUrl = document.querySelector('#fileInput').files[0].path;

  Jimp.read(fileUrl).then(function (image) {
    output2(`File: "${fileUrl}" loaded\n`);
    if(last != null){
      last.killswitch = true;
    }
    last = new drawImage(document.querySelector('#canvas'), image)
    //drawImage(document.querySelector('#canvas'), image);
  }).catch(function(err){
    output(`Error loading ${fileUrl}\n`);
    output(err);
  });
}
document.querySelector('#loadFile').addEventListener('click', loadFile);


function drawImage(canvas, image){
  this.killswitch = false;

  this.canvas = canvas;
  this.cwidth = canvas.width;
  this.cheight = canvas.height;
  this.ctx = this.canvas.getContext("2d");

  this.image = image;
  this.iwidth = this.image.bitmap.width;
  this.iheight = this.image.bitmap.height;

  this.fps = 20;
  this.ledCount = 50;

  this.drawLoop = function (index, self) {
    setTimeout(function(index, self){
      if(self.killswitch){
        return;
      }
      self.drawFrame(index);
      index = (index + 1) % self.iheight;
      self.drawLoop(index, self);
    },1000/this.fps, index, self);
  };
  this.drawFrame = function (index, self) {
    diameter = this.cwidth/this.iwidth;
    radius = diameter/2;
    for(var x = 0; x < this.iwidth; x++){
      this.ctx.fillStyle = getPixelColor(x, index, this.image);
      //this.ctx.fillRect(x, 0, 1, 20);
      this.ctx.beginPath();
      //this.ctx.arc(x*diameter + radius, radius, radius, 0, 2*Math.PI);
      this.ctx.arc(this.cwidth/2, radius, radius, 0, 2*Math.PI);
      this.ctx.fill();
      // rotate
      ctx.translate(this.cwidth/2, this.cheight/2);
      ctx.rotate((360/this.iwidth)*Math.PI/180);
      ctx.translate(-this.cwidth/2, -this.cheight/2);
    }
  };
  output(`width = ${this.iwidth}, height = ${this.iheight}`);
  clear(canvas);
  this.drawLoop(0, this);
}

function clear(canvas){
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function getPixelColor(x, y, image) {
  return intToColorString(image.getPixelColor(x, y));
}
function intToColorString(int){
  rgba = Jimp.intToRGBA(int);
  //return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a/255})`;
  return `rgb(${rgba.r},${rgba.g},${rgba.b})`;
}
