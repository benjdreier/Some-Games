var gameCanvas = document.getElementById("game");
var mouseX = 0;
var mouseY = 0;
var malletImage = new Image();

// dimesnions of mole array w x h
let GRIDSIZE = [4, 3];
let MOLES = GRIDSIZE[0] * GRIDSIZE[1];
var moleProb = 0.001;

var score = 0;

malletImage.src = "mallet.png";

// 30 fps
let deltaTime = 1000/30;

let mallet = {
	x: 0,
	y: 0,
	theta: 0,
	scale: 0.2,
	length: 780,
	thwackage: 0,
	maxThwack: Math.PI / 2,
	goRight: true,
	speed: 0.05
}

function Mole(img, x, y) {
	this.x = x,
	this.y = y,
	this.img = img,
	this.peek = 0,
	this.up = false,
	this.poppage = 0,
	this.speed = 0.015,
	this.popUp = function(){
		if(this.poppage == 0){
			console.log("Pop!");
			this.poppage = 1;
			// Maybe play a sound?

			// And maybe change the image back
		}
	}
	this.kill = function(){
		score += 1;
		updateStats();
		// No longer up
		this.up = false;
		// Send it down
		this.poppage = -1;
		// Could change the image too

	}
}

var moles = [];

// TODO: Make responsive to window size changes???
gameCanvas.width = document.body.clientWidth;
gameCanvas.height = document.body.clientHeight;

var gctx = gameCanvas.getContext('2d');
clear(gctx);

function startGame(){
	console.log("starting");
	gctx.fillText("OK LETS BEGIN", 40, 40);
	addListeners();
	addMoles();

	window.requestAnimationFrame(draw);
}

function draw(){
	clear();

	drawHoles();

	drawMoles();
	moveMoles();

	drawMallet();
	moveMallet();

	drawInfo();

	randomlyPopMoles();

	window.setTimeout(window.requestAnimationFrame(draw), 1000*deltaTime);
}

function drawInfo(){
	gctx.font = "30px Arial";
	gctx.fillText("Score: " + score, 20, 40);
	gctx.font = "18px Arial";
	gctx.fillText("Speed: " + Math.round(mallet.speed*100), 20, 80);
	gctx.fillText("Moles/Second: " + Math.round(MOLES*moleProb*deltaTime*100)/100, 20, 100);
}

function updateStats(){
	moleProb *= 1.03;
	mallet.speed *= 1.01;
}

function drawMallet(){
	drawImageCenter(malletImage, mallet.x, mallet.y, 335, 1000, mallet.scale, mallet.theta);
}

function moveMallet(){
	if(mallet.thwackage != 0){
		mallet.theta += mallet.thwackage * mallet.speed;

		// Pound it
		if(Math.abs(mallet.theta) > mallet.maxThwack){
			mallet.thwackage = mallet.thwackage * -1;
			let poundX = mallet.x - (mallet.thwackage*mallet.length*mallet.scale);
			// magic number is the half-width of the mallet
			let poundY = mallet.y + 300*mallet.scale;
			// magic number is a test radius
			pound(poundX, poundY, 300*mallet.scale);
		}
		// Stop it
		else if(Math.abs(mallet.theta) < mallet.speed/2){
			mallet.thwackage = 0;
			mallet.theta = 0;
			mallet.goRight = !mallet.goRight;
		}
	}
}

function drawMoles(){
	for (var i = 0; i < moles.length; i++) {
		let m = moles[i];
		drawMolePeeking(m.img, m.x, m.y, m.peek);
	}
}

function moveMoles(){
	for (var i = 0; i < moles.length; i++) {
		let m = moles[i];
		// Popping up
		if(m.poppage == 1){
			if(m.peek<1){
				m.peek += m.speed;
			}
			else{
				// Fully popped up
				m.peek = 1;
				m.poppage = 0;
				m.up = true;
			}
		}
		// popping down
		else if(m.poppage == -1){
			if(m.peek>0){
				m.peek -= m.speed;
			}
			else{
				// Fully covered
				m.peek = 0;
				m.poppage = 0;
			}
		}
		
	}
}

function randomlyPopMoles(){
	for (var i = 0; i < moles.length; i++) {
		// At every frame, give each mole a small probability of
		// Popping up again
		if(!moles[i].up && Math.random() < moleProb){
			moles[i].popUp();
		}
	}
}

function drawImageCenter(image, x, y, cx, cy, scale, rotation){
    gctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
    gctx.rotate(rotation);
    gctx.drawImage(image, -cx, -cy);
    gctx.setTransform(1,0,0,1,0,0);
} 

// Draw a mole at the center of the image
// cut off the bottom of the image by a certain percent

function drawMolePeeking(image, x, y, peek){
	let drawH = image.height * peek;
	gctx.putImageData(image, x-(image.width/2), y-drawH+(2*image.height/3), 0, 0, image.width, drawH);
	//gctx.putImageData(image, x, y);
}

function thwack(){
	if(mallet.thwackage == 0){
		console.log("thwack");
		if(mallet.goRight){
			mallet.thwackage = 1;
		}
		else{
			mallet.thwackage = -1;
		}
	}
	
}

function pound(x, y, r){
	// Draw a lil circle i guess
	gctx.beginPath();
	gctx.arc(x, y, r, 0, 2*Math.PI);
	gctx.closePath();
	gctx.stroke();

	// Whack that mole
	for (var i = 0; i < moles.length; i++) {
		let m = moles[i];
		if(m.up){
			let sqdist = Math.pow(x-m.x, 2) + Math.pow(y-m.y, 2);
			// If we're within the radius
			if(sqdist < r*r){
				moles[i].kill();
			}
		}
	}
}

function addListeners(){
	// Mouse move events
	window.addEventListener("mousemove", function(e){
		mouseX = e.clientX;
		mouseY = e.clientY;
		mallet.x = mouseX;
		mallet.y = mouseY;
	})

	window.addEventListener("mousedown", function(e){
		thwack();
	})
}

function addMoles(){
	// Add the appropriate number of moles
	for (var i = 0; i < MOLES; i++) {
		moles[i] = new Mole(moleImg, 0, 0);
	}
	// And set their positions
	recalcMolePositions();
}

function recalcMolePositions(){
	// Divide the screen up 
	let mx = GRIDSIZE[0];
	let my = GRIDSIZE[1];
	let w = gameCanvas.width;
	let h = gameCanvas.height;

	let i = 0;
	for (var y = 1; y < my+1; y++) {
		for (var x = 1; x < mx+1; x++) {
			moles[i].x = (w/(mx+1))*x;
			moles[i].y = (h/(my+1))*y;
			i++;
		}
	}
}

function drawHoles(){
	for (var i = 0; i < moles.length; i++) {
		let m = moles[i];
		let w = m.img.width/2 + 50;
		let x = m.x;
		let y = m.y + (2*m.img.height/3);

		gctx.beginPath();
		gctx.ellipse(x, y, w, w/4, 0, 0, Math.PI*2);
		gctx.closePath();
		gctx.fill();
	}
}

window.addEventListener('resize', function(e){
	console.log("whee!!");
	gameCanvas.width = document.body.clientWidth;
	gameCanvas.height = document.body.clientHeight;

	clear();
	recalcMolePositions();
});


// TODO: Image background fill instead
function clear(){
	oldStyle = gctx.fillStyle;
	gctx.fillStyle = "lightblue"; //background color
	gctx.fillRect(0,0,gctx.canvas.width,gctx.canvas.height);
	gctx.fillStyle = oldStyle;
}