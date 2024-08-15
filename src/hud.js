var hud	= 	{
				fontsize:16,
				fontfamily:'Nunito',
				line1offset:5,
				leading:5,
				line:function(ln){
					ln=ln||1;
					var leading = ln!==1?this.leading*ln:0;
					return this.line1offset+this.fontsize*ln+leading;
				},
				toggle_hud:function(){
					if(board.display_hud){
						board.display_hud=false;
					}else{
						board.display_hud=true;
					}	
				}
			};



window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return "xpos:"+board.assets[board.playertoken].x+" ypos:"+board.assets[board.playertoken].y+" "+board.assets[board.playertoken].facing;
	},5,hud.line(1)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'framecount = ' + board.framenumber;
	},5,hud.line(2)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'shiftstate = ' + keys.shift_state;
	},5,hud.line(3)));
	
});


window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'playertoken = ' + board.playertoken;
	},5,hud.line(4)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'asset count = ' + board.hud_elements.length;
	},5,hud.line(5)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'player lifetime = ' + board.assets[board.playertoken].lifetime();
	},5,hud.line(6)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'newasset lifetime = ' + board.assets[board.hud_elements.length-1].lifetime();
	},5,hud.line(7)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'console = ' + console.read[4];
	},5,hud.line(8)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'console = ' + console.read[3];
	},5,hud.line(9)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'console = ' + console.read[2];
	},5,hud.line(10)));
	
});


window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'console = ' + console.read[1];
	},5,hud.line(11)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'console = ' + console.read[0];
	},5,hud.line(12)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'speedX = ' + mouse.speedX;
	},5,hud.line(13)));
	
});

//SPEED
window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'speedY = ' + mouse.speedY;
	},5,hud.line(14)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'speedX = ' + mouse.speedX;
	},5,hud.line(15)));
	
});

//Board VELOCITY
window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'mousedown = ' + board.mouse.down;
	},5,hud.line(16)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'wheel = ' + mouse.wheelstate;
	},5,hud.line(17)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'OfX = ' + board.offsetX + 'OfY = ' + board.offsetY;
	},5,hud.line(18)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'mouseX = ' + mouse.lastMouseX + ' mouseY = ' + mouse.lastMouseY;
	},5,hud.line(19)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'a1X = ' + mouse.boardX() + ' a1Y = ' + mouse.boardY();
	},5,hud.line(20)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'zoom = ' + board.zoom.value;
	},5,hud.line(21)));
	
});

window.addEventListener('load', function (){
	
	board.hud_elements.push(new hud_text(function(){
		return 'mouseaction = ' + board.mouse.action;
	},5,hud.line(22)));
	
}); 