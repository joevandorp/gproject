window.onresize = function(event) {
		board.canvas.height = window.innerHeight;
		board.canvas.width	= window.innerWidth;
		board.refresh();
};