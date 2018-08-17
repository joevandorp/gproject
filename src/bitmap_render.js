function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


 
  var bitmap_render = function(id){
  		
  		var parent=this;
		this.canvas = document.createElement("canvas");
		this.canvas.id = id || "offscreencanvas" ; 
		this.canvas.style.display="none";
		document.body.appendChild(this.canvas);
		this.context 				=	this.canvas.getContext('2d');

		this.chunktime=true;
		
		setInterval(function(){
			parent.chunktime=true;
		},100);
			

		this.canvas.height		= 	50;
		this.canvas.width		= 	50;
		
		
		this.createDataURL = function(output_quality,quad_id){
		
				var xrect=2;
				var yrect=4;
				var xpos=1;
				var ypos=2;
		
				// output_quality=output_quality||'high';
		
				switch(output_quality){
					case 'medium':
						parent.canvas.height		= 	100;
						parent.canvas.width		= 	100;
						xrect=2;
						yrect=4;
						xpos=2;
						ypos=4;
						break;
						
					case 'low':
						parent.canvas.height		= 	50;
						parent.canvas.width		= 	50;
						xrect=1;
						yrect=2;
						xpos=1;
						ypos=2;
						break;
						
					case 'high':
						parent.canvas.height		= 	200;
						parent.canvas.width		= 	200;
						xrect=4;
						yrect=8;
						xpos=4;
						ypos=8;
						break;
						
					default:
						parent.canvas.height		= 	400;
						parent.canvas.width		= 	400;
						xrect=8;
						yrect=16;
						xpos=8;
						ypos=16;
				}
				
		  
				parent.context.fillStyle = keys.m_state=='keydown'?'yellow':'lightblue';
				parent.context.fillRect(0,0,parent.canvas.width,parent.canvas.height);
				
				
				
				if(board.quadrants[quad_id]!=undefined){
					for(var x=0;x<50;x++){
						for(var y=0;y<25;y++){
							
							if(board.quadrants[quad_id].assets[x+"|"+y]!=undefined){
								parent.context.fillStyle = '#333';
								parent.context.fillRect(x*xrect,y*yrect,xpos,ypos);
							}
						}
					}
				}
				return parent.canvas.toDataURL();
				
		}
			



				

	}


