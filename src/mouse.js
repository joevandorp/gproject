var mouse={};

mouse.timestamp  = null;
mouse.lastMouseX = null;
mouse.lastMouseY = null;
mouse.boardX = function(){return (mouse.lastMouseX-board.offsetX)/(board.square.width+board.square.margin);};
mouse.boardY = function(){return (mouse.lastMouseY-board.offsetY)/(board.square.height+board.square.margin);};
mouse.gridX  = function(){return Math.floor(mouse.boardX());};
mouse.gridY  = function(){return Math.floor(mouse.boardY());};
mouse.speedX = 0 ; 
mouse.speedY = 0 ; 
mouse.wheelstate=0;

mouse.checkSpeed=function(e){
		if (mouse.timestamp === null) {
			mouse.timestamp = Date.now();
			mouse.lastMouseX = e.pageX;
			mouse.lastMouseY = e.pageY;
			return;
		}

		var now = Date.now();
		var dt =  now - mouse.timestamp;
		var dx = e.pageX - mouse.lastMouseX;
		var dy = e.pageY - mouse.lastMouseY;
		mouse.speedX = Math.round(dx / dt * 100);
		mouse.speedY = Math.round(dy / dt * 100);

		mouse.timestamp = now;
		mouse.lastMouseX = e.pageX;
		mouse.lastMouseY = e.pageY;
		clearTimeout(mouse.timer);
		mouse.timer=setTimeout(function(){
			mouse.speedX=0;
			mouse.speedY=0;
		},100);
}

window.addEventListener('load', function (){
	
	
	
		document.body.addEventListener("mousemove", function(e) {
			mouse.checkSpeed(e);
		});
			
		// IE9, Chrome, Safari, Opera
		document.body.addEventListener("mousewheel", MouseWheelHandler, false);
		// Firefox
		document.body.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	

});

function MouseWheelHandler(e) {
	
	var e = window.event || e; 
	
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		
	mouse.wheelstate=delta;
		
	board.zoom.wheel(mouse.wheelstate);
	
	return false;

}