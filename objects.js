// ball
function Ball(c, radius, x, y){
  this.x = x || c.canvas.width / 2;
  this.y = y || c.canvas.height / 2;
  this.radius = radius || c.canvas.height / 40;
  this.angle = 0;
  this.speed = 120;
  this.x_speed = 0;
  this.y_speed = 0;
}

Ball.prototype.draw = function(c){
  c.save();
  c.fillStyle = 'white';
  c.strokeStyle = 'white';
  c.translate(this.x, this.y);
  c.beginPath();
  c.arc(0, 0, this.radius, 0, 2 * Math.PI);
  c.fill();
  c.stroke();
  c.restore();
}

Ball.prototype.push = function(){
  this.angle = Math.random() * 2 * Math.PI;
  this.x_speed = this.speed * Math.cos(this.angle);
  this.y_speed = this.speed * Math.sin(this.angle);
}

Ball.prototype.update = function(c, elapsed){
  this.x += this.x_speed * elapsed;
  this.y += this.y_speed * elapsed;

  if (this.y > c.canvas.height - this.radius){
    this.y = c.canvas.height - this.radius;
    this.y_speed *= -1;
  } else if (this.y < this.radius) {
    this.y = this.radius;
    this.y_speed *= -1;
  }
}

function Paddle(c, x, y, width, height, speed){
  this.x = x;
  this.width = width || 10;
  this.height = height || c.canvas.height / 5;
  this.y = y || c.canvas.height / 2 - this.height / 2;
  this.speed = speed || 10;
  this.move = 0;
  this.score = 0;
}

Paddle.prototype.draw = function(c){
  c.save();
  c.fillStyle = 'white';
  c.strokeStyle = 'white';
  c.translate(this.x, this.y);
  c.beginPath();
  c.fillRect(0, 0, this.width, this.height);
  c.restore();
}

Paddle.prototype.update = function(c, elapsed){
  let limit_inf = c.canvas.height - this.height;
  if(this.y < 0){
    this.y = 0;
    return;
  }
  if(this.y > limit_inf){
    this.y = limit_inf;
    return;
  }
  this.y += this.move * this.speed;
}

function Text(x, y, options) {
  options = options || {};
  this.x = x;
  this.y = y;
  this.main_pt = options.main_pt || 28;
  this.sub_pt = options.sub_pt || 18;
  this.fill = options.fill || "white";
  this.textAlign = options.align || 'center';
}

Text.prototype.draw = function(c, main, sub) {
  c.save();
  c.fillStyle = this.fill;
  c.textAlign = this.textAlign;
  c.font = this.main_pt + "pt Arial";
  c.fillText(main, this.x, this.y);
  if(sub){
    c.font = this.sub_pt + "pt Arial";
    c.fillText(sub, this.x, this.y + this.main_pt);
  }
  c.restore();
}
