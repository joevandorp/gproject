  var gameboard = function(id){ 
  		var parent=this;
		this.canvas = document.createElement("canvas");
		this.canvas.id = id || "mycanvas" ; 
		document.body.appendChild(this.canvas);
		this.context 			=	this.canvas.getContext('2d');
		this.square				=	{height:4,width:4,margin:0};
		this.zoom={value:1,height:parent.square.height,width:parent.square.width,margin:parent.square.margin};
		this.mousehighlightx=0;
		this.mousehighlighty=0;
		this.displayMouseHighlight=true;
		this.zoom.to=function(multiplier,offset){
			var n = Math.abs(multiplier);
			var prevmouseX=mouse.boardX();
			var prevmouseY=mouse.boardY();
    		if(n === multiplier && n > 0.5 && n <= 10 ){
    			parent.zoom.value=n;
    			parent.square.height=parent.zoom.height*n;
    			parent.square.width=parent.zoom.width*n;
    			parent.square.margin=parent.zoom.margin*n;
				if(offset!==false){
    				parent.offsetX=parent.offsetX-((prevmouseX-mouse.boardX())*(board.square.width+board.square.margin));
    				parent.offsetY=parent.offsetY-((prevmouseY-mouse.boardY())*(board.square.height+board.square.margin));
				}
    			parent.refresh();
    		}
		};

		this.checkPlayerSprites = function(playerStyle) {
			const baseUrl = `src/sprites/player/${playerStyle}/`;
			const directions = ['down', 'up', 'left', 'right'];
			const results = {};

			const checkImage = (url) => {
				return new Promise((resolve) => {
					const img = new Image();
					img.onload = () => resolve(true);
					img.onerror = () => {
						// Silently handle the error without logging
						resolve(false);
					};
					img.src = url;
				});
			};

			const checkWalkAnimations = async (direction) => {
				let walkCount = 0;
				while (await checkImage(`${baseUrl}${direction}facingwalk${walkCount + 1}.png`)) {
					walkCount++;
				}
				return walkCount;
			};

			const checkAllDirections = async () => {
				if (await checkImage(`${baseUrl}downfacing.png`)) {
					const downWalkCount = await checkWalkAnimations('down');
					
					for (const direction of directions) {
						results[direction] = {
							facing: `${baseUrl}${direction}facing.png`,
							walk: []
						};
						
						for (let i = 1; i <= downWalkCount; i++) {
							results[direction].walk.push(`${baseUrl}${direction}facingwalk${i}.png`);
						}
					}

					return results;
				} else {
					// Silently handle the case when no sprites are found
					return null;
				}
			};

			return checkAllDirections();
		};

		this.loadPlayerSprites = async function(playerStyle) {
			const spriteData = await this.checkPlayerSprites(playerStyle);
			
			if (spriteData) {
				this.images = this.images || {};
				
				for (const [direction, sprites] of Object.entries(spriteData)) {
					this.images[`${direction}facing`] = new Image();
					this.images[`${direction}facing`].src = sprites.facing;

					sprites.walk.forEach((walkSprite, index) => {
						this.images[`${direction}facingwalk${index + 1}`] = new Image();
						this.images[`${direction}facingwalk${index + 1}`].src = walkSprite;
					});
				}

				// Silently handle successful sprite loading
			}
		};

		// Usage example
		this.loadPlayerSprites('default');

		//standard graphics
		this.images = this.images || {};
		this.images.wall = new Image();
		this.images.wall.src = 'src/sprites/environment/wall/wall.png';

		//load in src/backgrounds/canvas/darkstar.png
		this.images.background = new Image();
		this.images.background.src = 'src/backgrounds/canvas/darkstar.png';

		//load sounds/default/wallbump.mp3
		this.sounds = this.sounds || {};
		this.sounds.wallbump = new Audio();
		this.sounds.wallbump.src = 'src/sounds/default/wallbump.mp3';

		//toggle hud display
		this.display_hud=false;

			
		this.zoom.wheel=function(wheeldelta){
			var zoomto = parent.zoom.value+(wheeldelta/3);
			if( zoomto > 0 && zoomto <= 10 ){
				parent.zoom.to(zoomto);
			}
		};
			
		this.grid					=	{height:30,width:50};
		this.canvas.height		= 	window.innerHeight;//(this.square.height*this.grid.height)+(this.grid.height*this.square.margin);
		this.canvas.width			= 	window.innerWidth;//(this.square.width*this.grid.width)+(this.grid.width*this.square.margin);
		//this.canvas.style.border 	= 	"1px solid black";
		//this.context.scale(2,2);
		this.assets=[new player(), new asset(3,6), new asset(6,8), new teleporter(3,8), new asset(3,8), new asset(3,8)];
		this.hud_elements=[];
		this.offsetX = 0;
		this.offsetY = 0;
		this.playertoken=0;
		this.created=Date.now();
		this.lifetime=function(){ return Date.now() - parent.created; };
		this.mouse={};
		this.background='lightblue';
		this.mouse.down=false;
		this.mouse.startX=0;
		this.mouse.startY=0;
		this.mouse.action='dragboard';
		this.inertia={};
		this.inertia.active=false;	
		this.inertia.X=0;
		this.inertia.Y=0;	
		this.keyState={
			up: false,
			down: false,
			left: false,
			right: false
		};
			
			
		this.garbageCollection=function(){
			var removal_found=true;
			while(removal_found===true){
				removal_found=false;
				for(var i in parent.assets){
					if (parent.assets[i].set_removal===true){
						parent.assets.splice(i,1);
						removal_found=true;
						break;
					}
				}
			}
		};
		
		this.inertia.run = function() {
			const maxSpeed = 100;
			const deceleration = 1.2;
			const framesPerSecond = 60;

			// Clamp and sanitize speed values
			mouse.speedX = Math.min(Math.max(isFinite(mouse.speedX) ? mouse.speedX : 0, -maxSpeed), maxSpeed);
			mouse.speedY = Math.min(Math.max(isFinite(mouse.speedY) ? mouse.speedY : 0, -maxSpeed), maxSpeed);

// 			console.log(`Scrolling inertially X=${mouse.speedX} Y=${mouse.speedY}`);

			let currentSpeedX = mouse.speedX / 5;
			let currentSpeedY = mouse.speedY / 5;

			clearInterval(parent.inertia.interval);

			parent.inertia.interval = setInterval(function() {
				if (Math.abs(currentSpeedX) < 0.1 && Math.abs(currentSpeedY) < 0.1) {
					clearInterval(parent.inertia.interval);
					//console.log("Inertial scrolling finished");
					return;
				}

				parent.offsetX += currentSpeedX;
				parent.offsetY += currentSpeedY;

				currentSpeedX /= deceleration;
				currentSpeedY /= deceleration;
			}, 1000 / framesPerSecond);
		}
		
		this.onscreen_quadrants=function(){
			
			var xval = (Math.ceil(parent.offsetX/(100*board.zoom.value))*-1);
			var yval = (Math.ceil(parent.offsetY/(100*board.zoom.value))*-1);
			
			var nthright = Math.ceil(board.canvas.width/(100*board.zoom.value));
			var nthdown = Math.ceil(board.canvas.height/(100*board.zoom.value));
			
			var returnarray = [];
			
			for ( var x = -10 ; x <= nthright+10 ; x++ ) {
			
				for ( var y = -10 ; y <= nthdown+10 ; y++ ) {
				
					returnarray.push ( {x:xval + x,y:yval + y} ) ;
					
				}
				
			}
			
			return returnarray;
			
		}
		
		this.offsetTo=function(coords){
			
			parent.offsetX=coords[0]||parent.offsetX;
			parent.offsetY=coords[1]||parent.offsetY;
			
		}
		this.canvas.onmousedown = function(e) {
			parent.mouse.down = true;
			parent.mouse.startX= e.pageX - parent.canvas.offsetLeft - parent.offsetX;
			parent.mouse.startY= e.pageY - parent.canvas.offsetTop - parent.offsetY;
		};
		this.canvas.onmouseup = function(e) {
			parent.mouse.down = false;
			parent.mouse.startX=0;
			parent.mouse.startY=0;
		};
		this.canvas.onmousemove = function(e){
			var x = e.pageX - parent.canvas.offsetLeft;
			var y = e.pageY - parent.canvas.offsetTop;
			
			if(parent.mouse.action=='dragboard'){
				
				if(!parent.mouse.down){
					if(parent.inertia.active==true){
						parent.inertia.run();
					}
					parent.inertia.active=false;
					return;
				}
				//  console.log("x="+x+" y="+y);
				parent.offsetX=x - parent.mouse.startX;
				parent.offsetY=y - parent.mouse.startY;
				parent.refresh();
				parent.inertia.active=true;
			}else if(parent.mouse.action=='addassets'){
				if(!parent.mouse.down){
					return;
				}
				const gridX = mouse.gridX();
				const gridY = mouse.gridY();
				const existingAsset = parent.assets.find(asset => asset.x === gridX && asset.y === gridY);
				if (!existingAsset) {
					parent.assets.push(new asset(gridX, gridY));
				}
				//  console.log("x="+x+" y="+y);
			}
		}
		
		
			
		//this moves the camera to the asset with the asset method "centerCamera()" center camera accepts 4 params
		// asset = the id of the asset -- postion options are 'center' 'topleft' 'topright' 'bottomleft' 'bottomright'
		// offset X and Y are how much the camera will be offset from where you move it to in pixels
		this.cameraToAsset = function(asset,position,offsetX,offsetY){
			position=position||'center';
			offsetX=offsetX||0;
			offsetY=offsetY||0;
			if(asset % 1 === 0 && asset < parent.assets.length){
				parent.assets[asset].methods.centerCamera(position,offsetX,offsetY);
				return true;
			}
		}
			
		// sets asset as player this allows keyboard controls to affect it if center is true the camera will center on the asset
		this.setPlayer = function(token,center){
			if(center!==false||center!==0){
				center = true;
			}
			if(token % 1 === 0 && token < parent.assets.length){
				parent.playertoken=token;
				if(center){
					parent.cameraToAsset(token);
				}
				return true;
			}
		}
		//array of asset layer types background gets drawn first etc... last drawn has visible priority and thus has higher "z-index"
		//player almost always has highest layer priority and thus is normally last in the layerpriority array
		this.layerpriority=['background','wall','basic','player','hud'];

		//var parent = this;

		this.refresh_toggle=true;
		this.refresh_background=true;

		this.refresh = function(){
		this.refresh_toggle=true;
		}

		this.clocktime=0;
		
		this.framenumber=0;

		this.clockincrement=10;

		this.clock_toggle=true;
		
		this.done=false;

		this.startClock = this.unpause = function(){
		this.clock_toggle=true;
		this.doRefresh();
		}

		this.stopClock = this.pause = function(){
		this.clock_toggle=false;
		}
		
		this.quadrants=[];
		
		this.redraw_quadrants=false;
		
		
		this.refreshBackground = function(){
			
			// img.src = 'file:///Users/joe/Documents/gameproject/pngs/mushroom.png';
			
			var pngs=parent.onscreen_quadrants();
				
							var quality='superhq';
							if(board.zoom.value <= 1){
								quality = 'low' ;
							}else if(board.zoom.value < 3){
								quality = 'medium' ;
								//console.log('medium');	
							}else if(board.zoom.value <= 5.5){
								quality = 'high' ;
								//console.log('medium');	
							}
							
				if(parent.redraw_quadrants==true){
					for(var i=0;i<pngs.length;i++){
						parent.quadrants[pngs[i].x+"|"+pngs[i].y][quality]=undefined;
					}
					parent.redraw_quadrants=false;
				}
			
				for(var i=0;i<pngs.length;i++){
					ypos=pngs[i].y;
					xpos=pngs[i].x;
							

							
					if(false||quadrant.chunktime==true){
					if(parent.quadrants[pngs[i].x+"|"+pngs[i].y]===undefined||parent.quadrants[pngs[i].x+"|"+pngs[i].y][quality]===undefined){
						setTimeout(function(){
							var img = new Image;
							
							img.src = quadrant.createDataURL(quality,pngs[i].x+"|"+pngs[i].y);
							if(parent.quadrants[pngs[i].x+"|"+pngs[i].y]===undefined){
								parent.quadrants[pngs[i].x+"|"+pngs[i].y] = {low:undefined,medium:undefined,high:undefined,superhq:undefined,assets:{}};
							} 
							parent.quadrants[pngs[i].x+"|"+pngs[i].y][quality]=img;
						}(pngs),1);
					} }
					
					var draw_image_ok=true;
					if(parent.quadrants[pngs[i].x+"|"+pngs[i].y]!==undefined){
						if(parent.quadrants[pngs[i].x+"|"+pngs[i].y][quality]===undefined){
							if(parent.quadrants[pngs[i].x+"|"+pngs[i].y]['low']!==undefined){
								quality='low';
							}else if(parent.quadrants[pngs[i].x+"|"+pngs[i].y]['medium']!==undefined){
								quality='medium';
							}else if(parent.quadrants[pngs[i].x+"|"+pngs[i].y]['high']!==undefined){
								quality='high';
							}else if(parent.quadrants[pngs[i].x+"|"+pngs[i].y]['superhq']!==undefined){
								quality='superhq';
							}else{
								draw_image_ok=false;
							}
						}
						if(draw_image_ok){
							var img=parent.quadrants[pngs[i].x+"|"+pngs[i].y][quality];
							this.context.drawImage(img, board.offsetX+xpos*100*board.zoom.value, board.offsetY+ypos*100*board.zoom.value,(100*board.zoom.value),(100*board.zoom.value));
							this.context.font=6*board.zoom.value+'px Arial';
							this.context.fillStyle='black';
							this.context.fillText(""+pngs[i].x+" "+pngs[i].y+"",board.offsetX+xpos*100*board.zoom.value+5*board.zoom.value,board.offsetY+ypos*100*board.zoom.value+10*board.zoom.value);
						}
					}
					
					
					
				}
				
				quadrant.chunktime=false;
			
		}

		this.doRefresh = function(){
			if(document.hasFocus()){
				this.refresh_toggle=true;
				//this.refresh_background=true;
			}
			
			//if(this.refresh_background){
				
			//}
			
		  if(this.refresh_toggle){
				this.context.fillStyle = keys.shift_state=='keydown'?'yellow':this.background;
				//this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
				//fill the canvas with the image this.images.background repeating in x and y
				const bgImage = this.images.background;
				if (bgImage && bgImage.complete) {
					const zoomedImageWidth = bgImage.width/10 * this.zoom.value;
					const zoomedImageHeight = bgImage.height/10 * this.zoom.value;
					
					const startX = ((this.offsetX % zoomedImageWidth) + zoomedImageWidth) % zoomedImageWidth;
					const startY = ((this.offsetY % zoomedImageHeight) + zoomedImageHeight) % zoomedImageHeight;
					
					for (let x = -zoomedImageWidth + startX; x < this.canvas.width; x += zoomedImageWidth) {
						for (let y = -zoomedImageHeight + startY; y < this.canvas.height; y += zoomedImageHeight) {
							this.context.drawImage(
								bgImage,
								x,
								y,
								zoomedImageWidth,
								zoomedImageHeight
							);
						}
					}
				} else {
					this.context.fillStyle = this.background;
					this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
				}

				//draw a semi transparent black rect over the whole canvas to mute the background
				this.context.fillStyle = 'rgba(0,0,0,0.8)';
				this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
				
				//this.refreshBackground();
					for(var l in this.layerpriority){
						for(var i in this.assets){
							if(this.assets[i].type==this.layerpriority[l]){
									let imagefill = false;
									// this creates the egg effect for mouse over
									// if(mouse.gridX()==this.assets[i].x&&mouse.gridY()==this.assets[i].y){
									// 	this.context.fillStyle = 'lightgreen';
									// }else if(	mouse.gridX()<=this.assets[i].x+1 && 
									// 			mouse.gridY()<=this.assets[i].y+1 &&
									// 			mouse.gridX()>=this.assets[i].x-1 && 
									// 			mouse.gridY()>=this.assets[i].y-1 
									// ){
									//	this.context.fillStyle = 'white';
									// }else{
										//if the fill is a string that begins with "image:" and the rest of the string is a valid image object key aka board.images[restofstring] then set this.imagefill to the image object else set it to false and set the fill to the asset fill
										//if there is no asset fill then set the fill to black
										if(this.assets[i].fill!==undefined){
											if(this.assets[i].fill.substring(0,6)=='image:'){
												//use the rest of the string as the key to the image object
												let imagekey = this.assets[i].fill.substring(6);
												if(imagekey in this.images){
													imagefill = this.images[imagekey];
												}
											}
										}
									 	this.context.fillStyle = this.assets[i].fill||'black';
									// }
									var xpos = this.assets[i].x * (this.square.width+this.square.margin) + this.assets[i].innerx + board.offsetX;
									var ypos = this.assets[i].y * (this.square.height+this.square.margin) + this.assets[i].innery + board.offsetY;
							
								if(this.assets[i].shape=='gamerect'){

									//if the imagefill is set  and is an image object then draw the image else draw a rectangle
									if(imagefill!==false && typeof imagefill === 'object'){
										this.context.drawImage(imagefill, xpos, ypos,this.square.width*1.01,this.square.height*1.01);
									}else{
										this.context.fillRect(xpos, ypos, this.square.width*1.01, this.square.height*1.01);
									}
									
							
								}else if(this.assets[i].shape=='circle'){
						
									this.context.beginPath();
									this.context.arc(xpos, ypos, this.assets[i].width/2*(this.zoom.value/10), 0, 2 * Math.PI, false);
									this.context.fill();
									this.context.lineWidth = 1;
									this.context.strokeStyle = '#003300';
									this.context.stroke();
							
								}

							}
						}
				  }
				  //place highlight rectangle where mouse is
				if(this.displayMouseHighlight){
					this.context.strokeStyle = 'yellow'; // Set the outline color to red
					this.context.lineWidth = 3; // Set the thickness of the outline
					if(!contextMenuIsOpen){
						mousehighlightx = mouse.gridX() * (this.square.width+this.square.margin) + this.assets[i].innerx + board.offsetX;
						mousehighlighty = mouse.gridY() * (this.square.height+this.square.margin) + this.assets[i].innery + board.offsetY;
					}
					this.context.strokeRect(mousehighlightx,mousehighlighty,this.square.width*1.01,this.square.height*1.01);
				}
				  

				  if(this.display_hud){
					for(var i in this.hud_elements){
									this.context.fillStyle = 'black';
									this.context.font=this.hud_elements[i].font||'24px Arial';
									this.context.fillText(this.hud_elements[i].value(),this.hud_elements[i].x,this.hud_elements[i].y);
					}
				  }
				  //if(this.framenumber%40){
				  	//this.garbageCollection();
				  //}
				  this.framenumber++;
			}
			
			

			
			
			this.refresh_toggle=false;
	
			this.clocktime=this.clocktime+this.clockincrement;
				
			if(this.clock_toggle===true){
				setTimeout(function(){board.doRefresh();},this.clockincrement);
			}

			return true;

		}

	}


