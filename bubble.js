const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const gameWidth = canvas.width;
const gameHeight = canvas.height - 50;

const arena = createMatrix(17, 15);
const colors = ['cyan', 'blue', 'green', 'yellow', 'red', 'purple'];
let currColor = 0;
let isMoving = false;
let currX = 8;
let currY = 15.25;
let vx = 0;
let vy = 0;

context.fillStyle = '#000';
context.fillRect(0, 0, gameWidth, gameHeight);
context.fillStyle = 'grey';
context.fillRect(0, gameHeight, gameWidth, gameHeight);
context.scale(30, 30);

init();

function drawBall(color, x, y) {
	context.fillStyle = colors[color];
	context.beginPath();
	context.arc(x + 0.5, y + 0.5, 0.5, 0, 2 * Math.PI);
	context.fill();
}

function resetBall() {
	currColor = parseInt(colors.length * Math.random());
	drawBall(currColor, 8, 15 + 0.25); //Line the center ball up at the 8th position, since it is the center. And move it 15.25 down so it fits in the gray area.
	currX = 8;
	currY = 15.25;
}

function createBall(x, y) {
	const rand = parseInt(colors.length * Math.random());
	if (x < 17 && x >= 0 && y < 15 && y >= 0) {
		arena[y][x] = rand;
	}
}

function init() {
	for (let i = 0; i < 9; i++) {
		addLine();
	}
	resetBall();
}

function createMatrix(w, h) {
	const matrix = [];
	while (h--) {
		matrix.push(new Array(w).fill(-1));
	}
	return matrix;
}

function addLine() {
	for (let i = arena.length - 1; i > 0; i--) {
		[arena[i], arena[i - 1]] = [arena[i - 1], arena[i]];
	}
	arena[0].forEach((value, x) => {
		createBall(x, 0);
	});
	update();
}

function fire(event) {
	let angle = calcAngle(8 * 30 + 15, event.offsetX, -458 - 15, -event.offsetY);
	if (isMoving === false && canvas.height - event.offsetY > 75) {
		isMoving = true;
		moveBall(angle);
	}
}



function moveBall(t) {
	update();
	t = wallCollide() * t;
	vx = Math.cos(t) / 3;
	vy = Math.sin(t) / 3;
	if (t >= 0) {
		currX += vx;
		currY -= vy;
	} else {
		currX -= vx;
		currY += vy;
	}
	drawBall(currColor, currX, currY);
	setTimeout(function() {
		requestAnimationFrame(function() {
			if (hit()) {
				isMoving = false;
				resetBall();
			} else {
				moveBall(t);
			}
		});
	}, 15);
}

function hit() { //TODO use square hit detection instead
	for (let row = 0; row < arena.length; row++) {
		for (let col = 0; col < arena[row].length; col++) {
			let dx = currX - col;
			let dy = currY - row;
			let distance = Math.sqrt(dx * dx + dy * dy);
			if (arena[row][col] != -1 && distance < 0.5 + 0.5) {
				snap(row, col, calcAngle(currX, col, currY, row));
				return true;
			}
		}
	}
	return false;
}

function snap(row, col, angle) {
	let degree = angle * 180 / 3.1415;
	if (degree >= 0 && degree <= 15) { //right
		arena[row][col + 1] = currColor;
		console.log("right");
	} else if (degree > 15 && degree <= 90) { //right bottom
		if (row % 2 == 0) {
			arena[row + 1][col] = currColor;
		} else {
			arena[row + 1][col + 1] = currColor;
		}
		console.log("right bottom");
	} else if (degree >= -90 && degree <= -15) { //left bottom
		if (row % 2 == 0) {
			arena[row + 1][col - 1] = currColor;
		} else {
			arena[row + 1][col] = currColor;
		}
		console.log("left bottom");
	} else if (degree > -15 && degree <= 0) { //left
		arena[row][col - 1] = currColor;
		console.log("left");
	}
	update();
}

function wallCollide() {
	if (currX + 1 >= canvas.width / 30 || currX <= 0) {
		return -1;
	}
	return 1;
}

function update() {
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width / 30, canvas.height / 30);
	context.fillStyle = 'grey';
	context.fillRect(0, 15, canvas.width / 30, canvas.height / 30);
	arena.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value != -1) {
				if (y % 2 !== 0) {
					drawBall(value, x + 0.5, y);
				} else {
					drawBall(value, x, y);
				}
			}
		});
	});
}

function calcAngle(x1, x2, y1, y2) {
	let dx = x2 - x1;
	let dy = y2 - y1;
	let h = Math.sqrt(dx * dx + dy * dy);
	let angle = Math.atan((dy / h) / (dx / h));
	console.log("dx: " + dx + " dy: " + dy + " angle: " + angle * 180 / Math.PI);
	return angle;
}
