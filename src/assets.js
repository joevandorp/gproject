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
		this.fill=fill||'image:wall';
		this.type='basic';
		this.usegrid=true;
		this.solid=true;
		this.shape=shape||'gamerect';
		this.rotation=rotation||0;
		this.width=width||null;
		this.height=height||null;
		this.oldFacing=facing||'down';
		this.facing=facing||'down';
		this.camerafollow=true;
		this.moving=false;
		this.walkAnimationOn = false;
		this.health = 5;





		//check health every 1 second and remove asset if health is 0
		this.assetInterval = setInterval(() => {
			if (this.health <= 0) {
				clearInterval(this.assetInterval);
				this.remove();
			}
			this.setWalkAnimation();
		}, 200);
		
			
		this.animate=function(){
			parent.lifetime = parent.lifetime+parent.refreshrate;
			setTimeout(function(){parent.animate();},parent.refreshrate);
		};

		this.methods={};

		this.methods.changeDirection = (direction) => {
			if (this.moving===false && (direction === 'up' || direction === 'down' || direction === 'left' || direction === 'right')) {
				this.oldFacing = this.facing;
				this.facing = direction;
				
			}
		}
		
		this.outofbounds=function(){
			// console.log("wall hit");
		};
		this.onCollide={};
		this.onOver={};
		this.onCollide.consolelog=function(collidelog){
			 console.log("collision! BANGer!");
			 console.log(collidelog);
		};
		this.onOver.consolelog=function(collidelog){
			// console.log("over! noBANGer!");
			// console.log(collidelog);
		};




  		
		this.methods.moveX = function(x){
			const nextMove = function(){
				// if up down left or right is pressed, move in that direction
				if (board.keyState.up || board.keyState.down || board.keyState.left || board.keyState.right) {
					parent.methods.move();
				}
			}

			// if x is negative make the animationMoveFloat negative, otherwise positive
			let animationMoveFloat = 0.02;
			animationMoveFloat = x < 0 ? -animationMoveFloat : animationMoveFloat;

			x < 0 ? parent.methods.changeDirection('left') : parent.methods.changeDirection('right');

			firstMovementInDirection = parent.oldFacing !== parent.facing;
			parent.oldFacing = parent.facing;
			if(firstMovementInDirection){
				// console.log("first movement in direction");
				parent.fill = `image:${parent.facing}facing`;
				parent.x = Math.round(parent.x);
				
				setTimeout(nextMove, 200);
			}else if (parent.moving === false && !parent.methods.checkCollision(x, 0)) {
				// console.log("derp derp");
				// if we are moving, set moving to true
				parent.moving = true;
				originalX = parent.x;
				// interval that adds the animationMoveFloat to the x value every 2 milliseconds until the distance is reached or greater than (parent.x) + (x) if x is positive or less than (parent.x) + (x) if x is negative
				const interval = setInterval(() => {
					// get sign of x


					const sign = Math.sign(x);

					// parent.moving = false;
					// clearInterval(interval)
					
					if (sign === -1 && parent.x > (originalX + x)) {
						parent.x += animationMoveFloat;
					} else if (sign === 1 && parent.x < (originalX + x)) {
						parent.x += animationMoveFloat;
					} else {
						clearInterval(interval);
						parent.x = Math.round(parent.x);
						parent.moving = false;
						nextMove();
					}
					parent.methods.centerCamera();
				}, 2);
				
			}
		};

		this.methods.moveY = function(y){
			const nextMove = function(){
				// if up down left or right is pressed, move in that direction
				if (board.keyState.up || board.keyState.down || board.keyState.left || board.keyState.right) {
					parent.methods.move();
				}
			}

			// if y is negative make the animationMoveFloat negative, otherwise positive
			let animationMoveFloat = 0.02;
			animationMoveFloat = y < 0 ? -animationMoveFloat : animationMoveFloat;

			y < 0 ? parent.methods.changeDirection('up') : parent.methods.changeDirection('down');
			
			firstMovementInDirection = parent.oldFacing !== parent.facing;
			parent.oldFacing = parent.facing;
			
			if(firstMovementInDirection){
				// console.log("first movement in direction");
				
				parent.y = Math.round(parent.y);
				parent.fill = `image:${parent.facing}facing`;
				setTimeout(nextMove, 200);
			}else if (parent.moving === false && !parent.methods.checkCollision(0, y)) {
				// console.log("derp derp");
				// if we are moving, set moving to true
				parent.moving = true;
				originalY = parent.y;
				// interval that adds the animationMoveFloat to the y value every 2 milliseconds until the distance is reached or greater than (parent.y) + (y) if y is positive or less than (parent.y) + (y) if y is negative
				const interval = setInterval(() => {
					// get sign of y
					const sign = Math.sign(y);

					// parent.moving = false;
					// clearInterval(interval)
					
					if (sign === -1 && parent.y > (originalY + y)) {
						parent.y += animationMoveFloat;
					} else if (sign === 1 && parent.y < (originalY + y)) {
						parent.y += animationMoveFloat;
					} else {
						clearInterval(interval);
						parent.y = Math.round(parent.y);
						parent.moving = false;
						nextMove();
					}
					parent.methods.centerCamera();
				}, 2);
				
			}
		};

		this.methods.move = function(){
			if (board.keyState.up || board.keyState.down || board.keyState.left || board.keyState.right) {
				
				
				if (board.keyState.up) parent.methods.moveY(-1);
				if (board.keyState.down) parent.methods.moveY(1);
				if (board.keyState.left) parent.methods.moveX(-1);
				if (board.keyState.right) parent.methods.moveX(1);
			} 
			
		};

		this.setWalkAnimation = function(){
			if (board.keyState.up || board.keyState.down || board.keyState.left || board.keyState.right) {
				this.walkAnimationOn = true;
			} else {
				this.walkAnimationOn = false;
			}
		}

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
  		this.methods.checkCollision = function(x,y,absolute,callback){
			// console.log("check collision x="+x+" y="+y);
  			x=x||0;
  			y=y||0;
  		
  			var collide = 0;
  			var ontop = 0;
  			var collidelog = [];
			if(absolute){
				var posX = x;
				var posY = y;
			}else{
				var posX = (parent.x)+(x);
				var posY = (parent.y)+(y);
			}
  			var squarewidth  = (board.square.width + board.square.margin);
  			var squareheight = (board.square.height + board.square.margin);
  			var pixelX = posX * squarewidth;
  			var pixelY = posY * squareheight;
  			var gamewidth = board.canvas.width+board.offsetX;
  			var gameheight = board.canvas.height+board.offsetY;
  			
  			if(pixelX>(board.canvas.width+board.offsetX*-1)-(board.canvas.width/15)){
  				// console.log("1st pixelX="+pixelX+" > canvwidth="+board.canvas.width+" ofX="+board.offsetX+" ofY="+board.offsetY);
  				board.offsetX-=squarewidth;
  			}
  			else if(pixelY>(board.canvas.height+board.offsetY*-1)-(board.canvas.width/15)){
  				// console.log("2nd pixelY="+pixelY+" > canvheight="+board.canvas.height+" ofX="+board.offsetX+" ofY="+board.offsetY);
  				board.offsetY-=squareheight;
  			}
  			else if(pixelY<(board.offsetY*-1)+(board.canvas.width/15)){
  				// console.log("3rd pixelY="+pixelY+" < board.offsetY="+board.offsetY+" ofX="+board.offsetX+" ofY="+board.offsetY);
  				board.offsetY+=squareheight;
  			}
  			else if(pixelX<(board.offsetX*-1)+(board.canvas.width/15)){
  				// console.log("4th pixelX="+pixelX+" < board.offsetX="+board.offsetX+" ofX="+board.offsetX+" ofY="+board.offsetY);
  				board.offsetX+=squarewidth;
  			}
  			
				for(var i in board.assets){
						if(posX===board.assets[i].x&&posY===board.assets[i].y){
							if(board.assets[i].solid==true && parent.solid==true){
								collide++;
								//if callback is defined and is a function, call it
								if(typeof callback === 'function'){
									callback(board.assets[i]);
								}
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
				// console.log("collide");
  				return true;
  			}else{
  				if(ontop>0){
  					for(var i in parent.onOver){
  						parent.onOver[i](collidelog);
  					}
  				}
				// console.log("no collide");
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

  		this.methods.fireGun = ()=>{
  			board.assets.push(new bullet({direction:this.facing,x:this.x,y:this.y}));
  		}
		this.fill='image:downfacing';	
		
		let walkCycleInterval = 0;
		
		this.walkCycle = setInterval(() => {
			if(this.walkAnimationOn && this.fill != `image:${this.facing}facingwalk1`) {
				this.fill = `image:${this.facing}facingwalk1`;
			}else if (this.walkAnimationOn) {
				this.fill = `image:${this.facing}facingwalk2`;
			}else{
				this.fill = `image:${this.facing}facing`;
			}
			//every 3 iterations, move the player (does another checkCollision)
			walkCycleInterval++;
			if(walkCycleInterval % 3 === 0){
				this.methods.move();
			}
		}, 200);

		//oncollide.playSound wallbump
		this.onCollide.playSound = function(){
			board.sounds.wallbump.play();
		}
				  
  		
  	} 
  	
	  var bullet = function({direction = 'up', distance = 10, x = 0, y = 0}={}) {
		asset.apply(this, arguments);
		this.x = x+0.5;
		this.y = y+0.5;
		this.solid = true;
		this.width = 5;
		this.height = 5;
		this.usegrid = false;
		this.shape = 'circle';
		this.distance = distance;
		this.direction = direction; 
		
		
		
		
		// Every 2 milliseconds, move bullet in the specified direction
		this.distanceMoved = 0;
		this.interval = setInterval(() => {  // Use arrow function to keep the correct `this` context
			switch(this.direction) {
				case 'up':
					this.y = this.y - 0.1;
					break;
				case 'down':
					this.y = this.y + 0.1;
					break;
				case 'left':
					this.x = this.x - 0.1;
					break;
				case 'right':
					this.x = this.x + 0.1;
					break;
			}
			//when the distance moved float val passes into the next whole number, check for collision
			if (this.distanceMoved > 1 && this.distanceMoved % 1 < 0.1){
				if(this.methods.checkCollision(Math.floor(this.x), Math.floor(this.y),true, (collidedAsset => {
					collidedAsset.health -= 1;
				}))){
					// console.log(this.x, this.y, "hit something");
					clearInterval(this.interval);
					this.remove();  // Ensure `remove` method is defined elsewhere in your code
				}
			}
			this.distanceMoved += 0.1;
			if(this.distanceMoved >= this.distance-1) {
				this.shape = 'none';
			}
			if(this.distanceMoved >= this.distance) {
				clearInterval(this.interval);
				this.remove();  // Ensure `remove` method is defined elsewhere in your code
			}
		}, 2);
	};

	var wall = function(x,y){
		asset.apply( this, arguments );
		this.fill='image:wall';
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
  