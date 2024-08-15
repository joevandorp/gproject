for(let x=0;x<10;x++){
	for(let y=0;y<10;y++){
		if((x%2&&y%2)||y==79||x==249){
			board.assets.push(new asset(x,y));
		}
	}
}
var runtest=false;
perf_test=function(){};
(function(){
	var i = 0;
	var x = 200;
	var y = 100;
	var plusOrMinus = function(){
		var number = Math.random();
		if(number<0.333){
		return -1;
	  }else if(number>0.666){
		return 1;
	  }else{
		return 0;
	  }
	}
	perf_test = function(){
			
			var old_y=y;
			var old_x=x;
			//console.log('here1 '+i);

			
			//var spotfilled = true;
			while_i=0;
			while (1==1){
				y=old_y+plusOrMinus();
				x=old_x+plusOrMinus();
				var fillfound=false;
				for (var a in board.assets){
					if( x===board.assets[a].x && y===board.assets[a].y ){
						fillfound=true;
						break;
					}
				}
				
					old_y=old_y + (Math.round(Math.random())* 2 - 1);
					old_x=old_x + (Math.round(Math.random())* 2 - 1);
				
				if(!fillfound){
					board.assets.push(new asset(x,y));
					//board.cameraToAsset(board.assets.length-1,'center');
					break;
				}
				
					
				
				
				while_i++;
			}
					
			i++;
			if(runtest==true){
				setTimeout(function(){perf_test();},1);
			}
			
	}
	perf_test();
	setTimeout(function(){runtest=false;},4000);
}());



let zoomTestInterval;
let startZoomTest = function(){};

(function(){
let zoomLevel = 1;
let zoomIn = true;
let intervalDuration = 20 * 10 / 18; // 20 seconds divided by 18 steps (9 steps in and 9 out)

startZoomTest = function(){

zoomTestInterval = setInterval(function() {
    if (zoomIn) {
        zoomLevel += 0.2;
        if (zoomLevel >= 10) {
            zoomIn = false;
			clearInterval(zoomTestInterval);
			zoomTestInterval=undefined;
        }
    } else {
        zoomLevel -= 0.2;
        if (zoomLevel <= 1) {
            zoomIn = true;
			clearInterval(zoomTestInterval);
			zoomTestInterval=undefined;
        }
    }
    board.zoom.to(zoomLevel);
	console.log(zoomLevel + ' zoom level' );
}, intervalDuration);
}
})();