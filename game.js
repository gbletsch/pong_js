function PongGame(id){
  this.canvas = document.getElementById(id);
  this.context = this.canvas.getContext('2d');
  this.canvas.focus();

  this.guide = false;
  this.ball_radius = 10;
  this.paddle_height = this.canvas.height / 4;
  this.paddle_width = 5;
  this.paddle_speed = 7;
  this.paddle_offset = 5;

  // instantiate objects

  this.message = new Text(this.canvas.width / 2, this.canvas.height / 3);
  this.message.draw(this.context, 'Press <Space> to start');

  this.ball = new Ball(this.context, this.ball_radius);

  this.player = new Paddle(
    this.context,
    this.canvas.width - this.paddle_width - this.paddle_offset,
    this.canvas.height / 2 - this.paddle_height / 2,
    this.paddle_width, this.paddle_height,
    this.paddle_speed
  );

  this.npc = new Paddle(
    this.context,
    this.paddle_offset,
    this.canvas.height / 2 - this.paddle_height / 2,
    this.paddle_width, this.paddle_height,
    1,
  );

  this.player_score = new Text(this.canvas.width - 50, 50);
  this.npc_score = new Text(50, 50);

  this.canvas.addEventListener(
    'keydown', this.keyDown.bind(this)
  );
  this.canvas.addEventListener(
    'keyup', this.keyUp.bind(this)
  );

  // first call to frame
  window.requestAnimationFrame(this.frame.bind(this));

  this.game_over = false;
}

PongGame.prototype.draw = function(c){
  if(this.guide){
    draw_grid(this.context);
  }
  this.ball.draw(this.context);
  this.player.draw(this.context);
  this.player_score.draw(this.context, this.player.score);
  this.npc.draw(this.context);
  this.npc_score.draw(this.context, this.npc.score);
  if(!this.ball.x_speed && !this.ball.y_speed){
    this.message.draw(this.context, 'Press <Space> to start');
  }
}

PongGame.prototype.update = function(elapsed){
  this.player.update(this.context, elapsed);
  this.ball.update(this.context, elapsed);
  this.npc_update();
  this.ball = verify_collision(this.context, this.ball, this.player, this.npc);
}

PongGame.prototype.npc_update = function(){
  // this.npc.y = this.ball.y - this.npc.height / 2;
  if((this.npc.y + (this.npc.height / 2)) > this.ball.y){
    this.npc.y -= this.npc.speed;
  }
  if((this.npc.y + (this.npc.height / 2)) < this.ball.y){
    this.npc.y += this.npc.speed;
  }
}

PongGame.prototype.frame = function(timestamp){
  if (!this.previous) this.previous = timestamp;
  var elapsed = timestamp - this.previous;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.fps = 1000 / elapsed;
  this.update(elapsed / 1000);
  this.draw();
  this.previous = timestamp;
  window.requestAnimationFrame(this.frame.bind(this));
}

PongGame.prototype.keyUp = function(){
  this.player.move = 0;
}

PongGame.prototype.keyDown = function(e){
  switch(e.key || e.keyCode) {
    case "ArrowUp":
    case 38: // up arrow
      this.player.move = -1;
      break;
    case "ArrowDown":
    case 40:
      this.player.move = 1;
      break;
    case " ":
    case 32: //spacebar
      if(this.game_over){
        this.reset_game();
      } else if (!this.ball.x_speed && !this.ball.y_speed) {
        this.ball.push();
      }
      break;
    case "g":
    case 71: // g for guide
      this.guide = !this.guide;
      break;
    default:
      this.player.move = 0;
  }
}

function verify_collision(c, ball, player, npc){
  if(ball.x + ball.radius > player.x){
    if(ball.y <= player.y + player.height && ball.y >= player.y){
      ball.x = player.x - ball.radius;
      ball.x_speed *= -1.1;
      ball.y_speed += (ball.y - (player.y + player.height / 2)) / (player.height / 2);
    } else {
      npc.score += 1;
      ball.x = c.canvas.width / 2;
      ball.y = c.canvas.height / 2;
      ball.x_speed = 0;
      ball.y_speed = 0;
    }
  }
  if(ball.x - ball.radius < npc.x + npc.width){
    if(ball.y <= npc.y + npc.height && ball.y >= npc.y){
      ball.x = npc.x + npc.width + ball.radius;
      ball.x_speed *= -1.1;
      ball.y_speed += (ball.y - (npc.y + npc.height / 2)) / (npc.height / 2);
    } else {
      player.score += 1;
      ball.x = c.canvas.width / 2;
      ball.y = c.canvas.height / 2;
      ball.x_speed = 0;
      ball.y_speed = 0;
    }
  }
  return ball;
}
