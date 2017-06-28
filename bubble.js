const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const gameWidth = canvas.width;
const gameHeight = canvas.height - 50;

const arena = createMatrix(17, 15);
const colors = ['cyan', 'blue', 'green', 'yellow', 'red', 'purple'];
let currColor = 0;
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
	currColor = colors.length * Math.random();
	drawBall(currColor, 8, 15 + 0.25); //Line the center ball up at the 8th position, since it is the center. And move it 15.25 down so it fits in the gray area.
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
	let dx = event.offsetX - 8 * 30 - 15;
	let dy = event.offsetY - 458 - 15;
	let angle = Math.tan(-dy / dx);
	console.log("dx: " + dx + " dy: " + -dy + " angle: " + angle * 180 / Math.PI);
	//moveBall(angle);
}

function moveBall(x, y) {
	update();

	setTimeout(function() {
		requestAnimationFrame(moveBall);
	}, 500);
}

function update() {
	context.fillStyle = '#000';
	context.fillRect(0, 0, 17, 15);
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
