const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

const scl = 20;
const framerate = 10;

const snakeColor = "red";
const backgroundColor = "lightGreen";
const foodColor = "blue";

let snake, food, dir, bounds;
let thread;

class Vec {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equals(v) {
		return this.x === v.x && this.y === v.y;
	}
}

function setup() {
	bounds = new Vec(canvas.width / scl - 1, canvas.height / scl - 1);
	let center = new Vec(Math.floor(bounds.x / 2), Math.floor(bounds.y / 2));

	snake = [];
	for (let i = 0; i < 4; i++) {
		snake.push(new Vec(center.x - 3 - i, center.y));
	}

	dir = new Vec(0, 0);
	food = new Vec(center.x + 4, center.y);

	draw();
	thread = setInterval(update, 1000 / framerate);
}

function update() {
	let head = snake[0];

	let newX = head.x + dir.x;
	let newY = head.y + dir.y;
	let newPos = new Vec(newX, newY);

	if (canMove(newPos)) {
		if (head.equals(food)) {
			food = getCoords();
		} else {
			snake.splice(snake.length - 1, 1);
		}
		snake.unshift(newPos);
	} else if (dir.y !== 0 || dir.x !== 0) {
		//death
		clearInterval(thread);
		alert("Score: " + (snake.length - 4));
		setup();
	}

	draw();
}

function draw() {
	context.fillStyle = backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = foodColor;
	context.fillRect(food.x * scl + 1, food.y * scl + 1, scl - 2, scl - 2);

	context.fillStyle = snakeColor;
	context.fillRect(snake[0].x * scl, snake[0].y * scl, scl, scl);
	for (let i = 1; i < snake.length; i++) {
		context.fillRect(snake[i].x * scl + 1, snake[i].y * scl + 1, scl - 2, scl - 2);
	}
}

function canMove(pos) {
	if (pos.x < 0 || pos.y < 0 || pos.x > bounds.x || pos.y > bounds.y) {
		return false;
	}
	for (const seg of snake) {
		if (pos.equals(seg)) {
			return false;
		}
	}
	return true;
}

function getCoords() {
	let x = Math.floor(Math.random() * (bounds.x + 1));
	let y = Math.floor(Math.random() * (bounds.y + 1));

	while (!canMove(new Vec(x, y))) {
		x = Math.floor(Math.random() * (bounds.x + 1));
		y = Math.floor(Math.random() * (bounds.y + 1));
	}

	return new Vec(x, y);
}

document.onkeydown = function(e) {
	e = window.event || e;
	let key = e.keyCode;
	e.preventDefault();

	switch (key) {
		case 38: //up
			dir.y = -1;
			dir.x = 0;
			break;
		case 40: //down
			dir.y = 1;
			dir.x = 0;
			break;
		case 39: //right
			dir.y = 0;
			dir.x = 1;
			break;
		case 37: //left
			dir.y = 0;
			dir.x = -1;
			break;
	}
};

setup();
