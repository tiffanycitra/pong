// this lists all of the constants we are going to use
var panelWidth = 750;
var panelHeight = 500;
var paddleWidth = 20;
var paddleHeight = 125;
var paddleSpeed = 40;
var maxPaddleSpeed = 60;
var ballRadius = 10;
var ballXVel = 8;
var ballYVel = 8;
var maxVel = 15;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

function MainPanel() {
	this.width = panelWidth;
	this.height = panelHeight;
	this.context = context;
	this.draw = function() {
		this.context.fillStyle = "#277553";
		this.context.lineWidth = 4;
		this.context.fillRect(0, 0, panelWidth, panelHeight);
		this.context.strokeStyle= "white";
		this.context.strokeRect(10, 10, panelWidth-20, panelHeight-20);
		this.context.beginPath();
		this.context.moveTo(8,panelHeight/2);
		this.context.lineTo(panelWidth-8,panelHeight/2);
		this.context.stroke();
		this.context.lineWidth = 2;
		this.context.beginPath();
		this.context.moveTo(panelWidth/2,0);
		this.context.lineTo(panelWidth/2,panelHeight);
		this.context.stroke();
	}
	this.gameOver = function() {
		this.context.fillStyle = "rgba(240, 240, 240, 0.8)";
		this.context.fillRect(0, 0, panelWidth, panelHeight);
		this.context.fillStyle = "black";
		this.context.font="70px Ubuntu";
		this.context.textAlign="center";
		if (userScore.score == 10) {
			this.context.fillText("YOU WIN!", panelWidth/2, panelHeight/2+10);
		} 
		else if (compScore.score == 10) {
			this.context.fillText("YOU LOSE", panelWidth/2, panelHeight/2+10);
		}
	}
}

function Ball() {
	this.xVel = -ballXVel;
	this.yVel = ballYVel;
	this.ballX = panelWidth/2;
	this.ballY = panelHeight/2;
	this.ballRadius = ballRadius;
	this.draw = function(color) {
		panel.context.beginPath();
		panel.context.arc(this.ballX+0.5*ballRadius, this.ballY+0.5*ballRadius, this.ballRadius, 0*Math.PI, 2*Math.PI);
		panel.context.fillStyle = color;
		panel.context.fill();
	}
};

function Paddle(xPos, yPos) {
	this.xVel = 5;
	this.yVel = 5;
	this.xPos = xPos;
	this.yPos = yPos;
	this.width = paddleWidth;
	this.height = paddleHeight;
	this.speed = paddleSpeed;
	this.draw = function() {
		panel.context.fillStyle = "#2563C7";
		panel.context.fillRect(this.xPos, this.yPos, this.width, this.height);
	}
	this.checkCollision = function(input) {
		if (balls[input].ballX <= this.xPos + paddleWidth) {
			return (balls[input].ballX >= this.xPos) &&
				(balls[input].ballY + 2*ballRadius >= this.yPos) &&
				(balls[input].ballY - 2*ballRadius <= this.yPos + paddleHeight);
		}
		else {
			return (balls[input].ballX <= this.xPos + paddleWidth) && 
			(balls[input].ballY + 2*ballRadius >= this.yPos) && 
			(balls[input].ballY - 2*ballRadius <= this.yPos + paddleHeight);
		}
	}
}

function Score(input) {
	this.score = 0;	
	dispScore = this.score.toString();
	dispScore.fontsize(30); dispScore.bold();
	document.getElementById(input).innerHTML = "0";
	document.getElementById(input).style.font="bold 30px Ubuntu";
	this.updateScore = function() {
		this.score++;
		document.getElementById(input).innerHTML = this.score.toString();
	}
}

var panel = new MainPanel();

var ball = new Ball();
var balls = [ball];

var compPaddle = new Paddle(panelWidth-paddleWidth-2, (panelHeight-paddleHeight)/2);
var userPaddle = new Paddle(2, (panelHeight-paddleHeight)/2);
var paddles = [compPaddle, userPaddle];

var userScore = new Score("userScore");
var compScore = new Score("compScore");


// the following function controls the AI
function moveComputer() {
	if (compPaddle.speed > maxPaddleSpeed) {
		compPaddle.speed = paddleSpeed;
	}
	compPaddle.speed += 10;

	var prevMin = 1000;
	var min = 0;
	for (i=0; i<balls.length; i++) {
		var currMin = Math.sqrt(Math.pow(balls[i].ballY-(compPaddle.yPos+paddleHeight/2),2)+Math.pow(balls[i].ballX-compPaddle.xPos,2));
		if (currMin < prevMin) {
			prevMin = currMin;
			min = i;
		}
	}

	if (balls[min].ballY < compPaddle.yPos-(paddleHeight/3) && compPaddle.yPos > 0) {
		compPaddle.yPos -= compPaddle.speed;
	} 
	
	else if (balls[min].ballY > compPaddle.yPos+(paddleHeight/3) && (compPaddle.yPos+paddleHeight+compPaddle.speed) < panelHeight) {
		compPaddle.yPos += compPaddle.speed;
	}
}

// the following function creates new instances of Ball and add them to the ball list
function ballFrenzy() {
	maxPaddleSpeed = 80;
	maxVel = 15;
	for (i=0; i<3; i++) {
		balls.push(new Ball());
		if (i % 2 == 0) {
			balls[i+1].xVel = Math.floor((Math.random() * 1) + 4+i);
			balls[i+1].yVel = Math.floor((Math.random() * 1) + 4+i);
		}
		else {
			balls[i+1].xVel = -Math.floor((Math.random() * 1) + 4+i);
			balls[i+1].yVel = -Math.floor((Math.random() * 1) + 4+i);
		}
	}
}

// the following function creates new instances of Paddle and add them to the paddle list
function paddleFrenzy() {
	one = new Paddle(225,panelHeight-paddleHeight);
	two = new Paddle(515,0);
	paddles.push(one);
	paddles.push(new Paddle((panelWidth-paddleWidth)/2,300));
	paddles.push(new Paddle((panelWidth-paddleWidth)/2,100));
	paddles.push(two);
}

// the following function determines the movement of extra paddles during the Paddle Frenzy++ mode
var dir = 1;

function movePaddle() {
	if (one.yPos <= 10) {
			dir = 2;
	}

	if (one.yPos >= (panelHeight-paddleHeight)) {
		dir = 1;
	}

	if (one.yPos > 5 && two.yPos < (panelHeight - paddleHeight) && dir == 1) {
		one.yPos -= 5;			
		two.yPos += 5;
	}

	else if (dir == 2) {
		one.yPos += 5;
		two.yPos -= 5;
	}
}

// the following function draws all of the components in the game
function drawAll() {
	panel.draw();
	compPaddle.draw();
	userPaddle.draw();

	for (i=0; i<paddles.length; i++) {
		paddles[i].draw();
	}

	 for (i=0; i<balls.length; i++) {
		balls[i].draw("#FFCC00");
	 }
}

// the following function enables keyboard interaction 
document.addEventListener('keydown', function(event) {
	if (event.keyCode == 40 && (userPaddle.yPos + paddleHeight) < panelHeight) {
		userPaddle.yPos += 20;
	}

	if (event.keyCode == 38 && userPaddle.yPos > 0) {
		userPaddle.yPos -= 20;
	}
});

var countFrenzy = 0;
var countPaddle = 0;
var myTimer = window.setInterval(function () {myTimerListener()}, 60);

// the following function calls the necessary functions executed per time interval
function myTimerListener() {
	// check game over
	if (userScore.score == 10 || compScore.score == 10) {
		panel.gameOver();
		window.clearInterval(myTimer);
		window.setTimeout(function(){panel.gameOver()}, 60);
	}

	// call ballFrenzy() function when the Ball Frenzy is checked
	if (document.getElementById("frenzy").checked == true && countFrenzy == 0) {
		ballFrenzy();
		countFrenzy++;
		document.getElementById("frenzy").disabled = true;
	}


	// call paddleFrenzy() function when the Paddle Frenzy is checked
	if (document.getElementById("rock").checked == true && countPaddle == 0) {
		paddleFrenzy();
		countPaddle++;
		document.getElementById("rock").disabled = true;
		document.getElementById("paddle").disabled = false;
	}

	// call movePaddle() function when the Paddle Frenzy++ is checked
	if (document.getElementById("paddle").checked == true) {
		movePaddle();
		document.getElementById("paddle").disabled = true;
	}

	// change the velocity of the ball when it bounces on the panel edges
	for (i=0; i<balls.length; i++) {
		for (j=0; j<paddles.length; j++) {
			if (paddles[j].checkCollision(i)) {
				if (balls[i].xVel < maxVel) {
					balls[i].xVel = -1.05*balls[i].xVel;
				}
				else {
					balls[i].xVel = -balls[i].xVel;
				}
			}
		}

		if (balls[i].ballY + 10 >= panelHeight || balls[i].ballY - 10 <= 0) {
			if (balls[i].yVel < maxVel) {
					balls[i].yVel = -1.05*balls[i].yVel;
				}
				else {
					balls[i].yVel = -balls[i].yVel;
				}
		}

		else if (balls[i].ballX + 10 >= panelWidth) {
			userScore.updateScore(); 
			balls[i].ballX = panelWidth/2;
			balls[i].ballY = panelHeight/2;
			balls[i].xVel = Math.floor((Math.random() * 1) + 6 + i);
			balls[i].yVel = Math.floor((Math.random() * 1) + 6 + i);
		}

		else if (balls[i].ballX - 10 <= 0) {
			compScore.updateScore();
			balls[i].ballX = panelWidth/2;
			balls[i].ballY = panelHeight/2;
			balls[i].xVel = -Math.floor((Math.random() * 1) + 6 + i);
			balls[i].yVel = -Math.floor((Math.random() * 1) + 6 + i);
		}

		balls[i].ballX += balls[i].xVel;
		balls[i].ballY += balls[i].yVel;
	}
	
	moveComputer();
	drawAll();
}
