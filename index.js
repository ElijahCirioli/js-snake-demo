const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

const scl = 20;
const framerate = 10;

const snakeColor = "#d63838";
const backgroundColor = "#b7e065";
const foodColor = "#364cd9";

let snake, food, dir, bounds;
let thread;

//2D vector with X and Y properties
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
	//define bottom right bounds of play area and approximate center
	bounds = new Vec(canvas.width / scl - 1, canvas.height / scl - 1);
	let center = new Vec(Math.floor(bounds.x / 2), Math.floor(bounds.y / 2));

	//initialize snake
	snake = [];
	for (let i = 0; i < 4; i++) {
		snake.push(new Vec(center.x - 2 - i, center.y));
	}

	//ensure snake isn't moving
	dir = new Vec(0, 0);
	//spawn food in front of snake
	food = new Vec(center.x + 4, center.y);

	draw();
	thread = setInterval(update, 1000 / framerate);
}

function update() {
	//if player has started moving
	if (dir.y !== 0 || dir.x !== 0) {
		let head = snake[0];

		//define new position for snake's head
		let newX = head.x + dir.x;
		let newY = head.y + dir.y;
		let newPos = new Vec(newX, newY);

		if (canMove(newPos)) {
			//move forward
			if (head.equals(food)) {
				food = getCoords();
			} else {
				snake.splice(snake.length - 1, 1);
			}
			snake.unshift(newPos);
		} else {
			//death
			clearInterval(thread);
			alert("Score: " + (snake.length - 4));
			setup();
		}

		draw();
	}
}

function draw() {
	//draw background
	context.fillStyle = backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);

	//draw food
	context.fillStyle = foodColor;
	context.fillRect(food.x * scl + 1, food.y * scl + 1, scl - 2, scl - 2);

	//draw snake with large head
	context.fillStyle = snakeColor;
	context.fillRect(snake[0].x * scl, snake[0].y * scl, scl, scl);
	for (let i = 1; i < snake.length; i++) {
		context.fillRect(snake[i].x * scl + 1, snake[i].y * scl + 1, scl - 2, scl - 2);
	}
}

function canMove(pos) {
	//if new position exceeds bounds
	if (pos.x < 0 || pos.y < 0 || pos.x > bounds.x || pos.y > bounds.y) {
		return false;
	}
	//if new position collides with snake body
	for (let i = 0; i < snake.length - 1; i++) {
		if (pos.equals(snake[i])) {
			return false;
		}
	}
	return true;
}

function getCoords() {
	//define random coordinates within game bounds
	let x = Math.floor(Math.random() * (bounds.x + 1));
	let y = Math.floor(Math.random() * (bounds.y + 1));

	//ensure that coordinates don't intersect snake
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

window.onload = setup();
