	var asset = function(x,y,fill,shape,rotation,width,height,solid,facing){
		var parent=this;
		this.set_removal=false;
		this.remove=function(){
			parent.set_removal=true;
			board.garbageCollection();	
		};
		this.x=x||0;
		this.y=y||0;
  		this.pixelX = function(){return typeof board != 'undefined'?(parent.x * (board.square.width + board.square.margin)):0;};
  		this.pixelY = function(){return typeof board != 'undefined'?(parent.y * (board.square.height + board.square.margin)):0;};
  		this.quadrant={};
  		this.quadrant.id=function(){return {x:Math.floor(parent.x/50),y:Math.floor(parent.y/25)}};
  		this.quadrant.position=function(){
  			var xx=Math.abs(parent.x);
  			var yy=Math.abs(parent.y);
  			if(Math.sign(parent.y)===-1){
  				yy=yy%25;
  				yy=25-yy;
  			}
  			if(Math.sign(parent.x)===-1){
  				xx=xx%50;
  				xx=50-xx;
  			}
  			return {x:xx%50,y:yy%25}
  		
  		};
		this.innerx=0;
		this.innery=0;
		this.created=Date.now();
		this.lifetime=function(){return Date.now()-parent.created;};
		this.refreshrate=300;
		this.fill=fill||'#000';
		this.type='basic';
		this.usegrid=true;
		this.solid=true;
		this.shape=shape||'gamerect';
		this.rotation=rotation||0;
		this.width=width||null;
		this.height=height||null;
		this.facing=facing||'down';
		this.camerafollow=true;
		
			
		this.animate=function(){
			parent.lifetime = parent.lifetime+parent.refreshrate;
			setTimeout(function(){parent.animate();},parent.refreshrate);
		};
		this.methods={};
		
		this.outofbounds=function(){
			console.log("wall hit");
		};
		this.onCollide={};
		this.onOver={};
		this.onCollide.consolelog=function(collidelog){
			console.log("collision! BANGer!");
			console.log(collidelog);
		};
		this.onOver.consolelog=function(collidelog){
			console.log("over! noBANGer!");
			console.log(collidelog);
		};
  		this.methods.moveX = function(x){
				if(!parent.methods.checkCollision(x,0)){
					parent.facing=x<0?'left':'right';
					parent.x=(parent.x)+(x);
					var thequad=parent.quadrant.id();
					console.log("quad "+thequad["x"]+"/"+thequad["y"]);
					var qpos=parent.quadrant.position();
					console.log("qpos "+qpos["x"]+"/"+qpos["y"]);
				}
  		};
  		this.methods.moveY = function(y){
  				if(!parent.methods.checkCollision(0,y)){
  					parent.facing=y<0?'up':'down';
					parent.y=(parent.y)+(y);
					var thequad=parent.quadrant.id();
					console.log("quad "+thequad["x"]+"/"+thequad["y"]);
					var qpos=parent.quadrant.position();
					console.log("qpos "+qpos["x"]+"/"+qpos["y"]);
				}
  		};
  		this.methods.centerCamera = function(position,offsetX,offsetY){
				position=position||'center';
				offsetX=offsetX||0;
				offsetY=offsetY||0;
				var posX=0;
				var posY=0;
			
			if(typeof board != 'undefined'){
				
				switch(position){
					case 'center':
						posX=(board.canvas.width+board.square.width+board.square.margin)/2;
						posY=(board.canvas.height+board.square.height+board.square.margin)/2;
						break;
					case 'topleft':
						posX=0;
						posY=0;
						break;
					case 'topright':
						posX=board.canvas.width-board.square.width-board.square.margin;
						posY=0;
						break;
					case 'bottomleft':
						posX=0;
						posY=board.canvas.height-board.square.height-board.square.margin;
						break;
					case 'bottomright':
						posX=board.canvas.width-board.square.width-board.square.margin;
						posY=board.canvas.height-board.square.height-board.square.margin;
						break;
					case 'top':
						posX=(board.canvas.width+board.square.width+board.square.margin)/2;
						posY=0;
						break;
					case 'bottom':
						posX=(board.canvas.width+board.square.width+board.square.margin)/2;
						posY=posY=board.canvas.height-board.square.height-board.square.margin;
						break;
					case 'left':
						posX=0;
						posY=(board.canvas.height+board.square.height+board.square.margin)/2;
						break;
					case 'right':
						posX=board.canvas.width-board.square.width-board.square.margin;
						posY=(board.canvas.height+board.square.height+board.square.margin)/2;
						break;
						
				}
				board.offsetX=parent.pixelX()*-1+posX+offsetX;
				board.offsetY=parent.pixelY()*-1+posY+offsetY;
				board.refresh();
				return true;
			}
				return false;
  		};
  		this.methods.checkCollision = function(x,y){
  		
  			x=x||0;
  			y=y||0;
  		
  			var collide = 0;
  			var ontop = 0;
  			var collidelog = [];
  			var posX = (parent.x)+(x);
  			var posY = (parent.y)+(y);
  			var squarewidth  = (board.square.width + board.square.margin);
  			var squareheight = (board.square.height + board.square.margin);
  			var pixelX = posX * squarewidth;
  			var pixelY = posY * squareheight;
  			var gamewidth = board.canvas.width+board.offsetX;
  			var gameheight = board.canvas.height+board.offsetY;
  			
  			if(pixelX>(board.canvas.width+board.offsetX*-1)-(board.canvas.width/15)){
  				console.log("1st pixelX="+pixelX+" > canvwidth="+board.canvas.width+" ofX="+board.offsetX+" ofY="+board.offsetY);
  				board.offsetX-=squarewidth;
  			}
  			else if(pixelY>(board.canvas.height+board.offsetY*-1)-(board.canvas.width/15)){
  				console.log("2nd pixelY="+pixelY+" > canvheight="+board.canvas.height+" ofX="+board.offsetX+" ofY="+board.offsetY);
  				board.offsetY-=squareheight;
  			}
  			else if(pixelY<(board.offsetY*-1)+(board.canvas.width/15)){
  				console.log("3rd pixelY="+pixelY+" < board.offsetY="+board.offsetY+" ofX="+board.offsetX+" ofY="+board.offsetY);
  				board.offsetY+=squareheight;
  			}
  			else if(pixelX<(board.offsetX*-1)+(board.canvas.width/15)){
  				console.log("4th pixelX="+pixelX+" < board.offsetX="+board.offsetX+" ofX="+board.offsetX+" ofY="+board.offsetY);
  				board.offsetX+=squarewidth;
  			}
  			
				for(var i in board.assets){
						if(posX===board.assets[i].x&&posY===board.assets[i].y){
							if(board.assets[i].solid==true && parent.solid==true){
								collide++;
							}else{
								ontop++;
							}
								collidelog.push(i);
						}
				}
  			
  			
  			
  			
  			if(collide>0){
  				for(var i in parent.onCollide){
  					parent.onCollide[i](collidelog);
  				}
  				return true;
  			}else{
  				if(ontop>0){
  					for(var i in parent.onOver){
  						parent.onOver[i](collidelog);
  					}
  				}
  				return false;
  				
  			}
  			
  		}
  		
  		// parent.animate();
  		
	}
			
  	var player = function(){
  		asset.apply( this, arguments );
  		this.fill='yellow';
  		this.type='player';
  		this.solid=true;
  		this.methods.fireGun = function(){
  			alert("gun fored");
  		}
  		
  	} 
  	
  	var bullet = function(){
  		asset.apply( this, arguments );
  		this.width = 5;
  		this.height = 5;
  		this.usegrid = false;
  		this.shape = 'circle';
  	}

  	var hud_text = function(value,x,y){
  		asset.apply( this, arguments );
  		this.x = x||5;
  		this.y = y||15;
  		this.fill='#000';
  		this.solid=false;
  		this.usegrid = false;
  		this.type='hud';
  		this.font=hud.fontsize+'px "'+hud.fontfamily+'"';
  		this.shape = 'hud_text';
  		this.value = function(){return value()||'unset value';};
  	}

	var teleporter = function(){
  		asset.apply( this, arguments );
  		this.fill='lightgreen';
  		this.type='wall';
  		this.solid=false;
  	} 
  