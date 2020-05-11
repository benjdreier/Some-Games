var uploadedImg = new Image();
var moleImg;

window.addEventListener('load', function() {
	document.querySelector('input[type="file"]').addEventListener('change', function(){
		if(this.files && this.files[0]){
			uploadedImg.src = URL.createObjectURL(this.files[0]);
			uploadedImg.onload = function() {
				imageLoaded(uploadedImg);
			}
			
		}
	})
});

function imageLoaded(img){
	var previewCanvas = document.getElementById('imagePreview');
	console.log("Uploaded");
	// Show the canvas
	previewCanvas.style.display = "inline";
	// And render the image preview
	// TODO: Clear before rendering a new upload
	previewCtx = previewCanvas.getContext('2d');
	let canvw = previewCanvas.width;
	let canvh = previewCanvas.height;
	// TODO: Instead of stretching to square, allow cropping
	previewCtx.drawImage(img, 0, 0, canvw, canvh);

	// TODO: Incorporate this cropping.
	moleImg = previewCtx.getImageData(0, 0, canvw, canvh);
}

var startButton = document.getElementById("startGame");

startButton.addEventListener("click", function(){
	// Check if there is an image
	// MAYBE: Default image instead?
	if(!moleImg){
		alert("you have to upload an image pls");
		return;
	}

	var setupPane = document.getElementById("setupPane");
	var gamePane = document.getElementById("gamePane");
	// Hide the setup pane and start the game
	setupPane.style.display = "none";
	//var gamePane = document.getElementById("gamePane");

	startGame();
})

