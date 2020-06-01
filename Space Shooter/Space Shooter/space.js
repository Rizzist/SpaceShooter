var play = false;
var x = 10;
var y = 0;
var dy = 0;
var dx = 0;

var div = document.querySelector("div");
var h1 = document.querySelector("h1");
var body = document.querySelector("body");
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var dir = false;
var enemies = [];
var bullets = [];
var level = 1;
var health = 5;
var pause = false;

function directionPhysics() {
	if (y < window.innerHeight-70) {
		if (y + dy < window.innerHeight-70) {
			y += dy;
		} else {
			dy = -dy*0.5;
		}
	}
	dy += 0.03;

	document.onkeydown = function (e) {
	    if(e.keyCode == 97 || e.keyCode == 65) {
	    	if (x>0) {
	    		if (dir) {
	    			dx = 0;
	    		}
	    		if (x-3 > 0) {
	    			dir = false;
	    			dx += 3;
	    		}
	    	}     
	    }
	    else if(e.keyCode == 100 || e.keyCode == 68) {
	        if (x<window.innerWidth-50) {
	        	if (dir === false) {
	    			dx = 0;
	    		}
	    		if (x+5 < window.innerWidth-50) {
	    			dir = true;
	    			dx += 3;
	    		}
	    	}
	    }
	    if (e.keyCode == 32) {
	    	bullet();
	    }
	    if (e.keyCode == 27) {
	    	pause = !pause;
	    }
	};
	if (dx > 0) {
		dx -= 0.05;
	}
	if (dx - 0.1 < 0) {
		dx = 0;
	}
	if (x < 0) {
		dir = true;
		dy = -3;
	}
	if (x > window.innerWidth-50) {
		dir = false;
		dy = -3;
	}
	if (dir) {
		x += dx;

	} else {
		x -= dx;
	}
	if (y < 0) {
		y = 0;
		dy = 5;
		dx = 0;
	}
	if (y > window.innerHeight - 70) {
		y = window.innerHeight - 70;
		dy -= 5;
	}
}

function playe() {
	if (pause == false) {
		h1.innerHTML = level;
		canvas.width = window.innerWidth - 5;
		canvas.height = window.innerHeight - 10;
		drawEnemies();
		drawBullets();
		ctx.fillStyle = "grey";
		ctx.fillRect(x, y, 50, 50);
		directionPhysics();
	} else {
		drawUpgrade();
	}
}

function drawUpgrade() {
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(200, 200);
	ctx.lineTo(400, 0);
    ctx.fillStyle = "orange";
    ctx.fill();
}

function enemy() {
	if (!pause && document.hasFocus()) {
		ex = Math.floor(Math.random() * window.innerWidth - 50);
		ey = Math.floor(Math.random() * window.innerHeight-10) - window.innerHeight;
		enemies.push([ex, ey, health]);
	} else {
		pause = true;
	}
}

function bullet() {
	bx = x+25;
	by = y;
	bullets.push([bx, by]);
}

function drawEnemies() {
	for (var i = 0; i < enemies.length; i++) {
		enemies[i][1] += 1;
		ctx.beginPath();
	    ctx.moveTo(enemies[i][0], enemies[i][1]);
	    ctx.lineTo(enemies[i][0]+25, enemies[i][1]-43);
	    ctx.lineTo(enemies[i][0]+50, enemies[i][1]);
	    ctx.fillStyle = "rgb( "+(1-enemies[i][2]/health) * 255+", " + enemies[i][2]/health * 255 + ", 0)";
	    ctx.fill();
	    if (enemies[i][1] > window.innerHeight) {
	    	enemies.splice(i, 1);
	    }
	}
}

function drawBullets() {
	for (var i = 0; i < bullets.length; i++) {
		bullets[i][1] -= 2.5;
		ctx.beginPath();
	    ctx.fillStyle = "white";
      	ctx.arc(bullets[i][0], bullets[i][1], 5, 0, 2 * Math.PI, false);
	    ctx.fill();
	    if (bullets[i][1] < 0) {
	    	bullets.splice(i, 1);
	    }
	    for (var j = 0; j < enemies.length; j++) {
			if ((bullets[i][0] > enemies[j][0]) && (bullets[i][0] < (enemies[j][0] + 50))) {
				if (bullets[i][1] < enemies[j][1]) {
					bullets.splice(i, 1);
					enemies[j][2] -= 1;
					if (enemies[j][2] < 0) {
						enemies.splice(j, 1);
						level += 1;
					}
					break;
				}
			}
		}
	}
}

function init() {
	div.addEventListener("click", function(){
		body.classList.toggle("colored");
		setTimeout(function(){
			body.classList.toggle("colored");
			div.parentNode.removeChild(div);
			h1.classList.toggle("level");
			h1.innerHTML = level;

			setInterval(playe, 5);
			setInterval(activateEnemy, 5000);
		}, 2000);
	});
}

function activateEnemy() {
	newEnemies = Math.floor(level/10 + 1);
	for (var i = 0; i < newEnemies; i++) {
		enemy();
	}
}


init();
