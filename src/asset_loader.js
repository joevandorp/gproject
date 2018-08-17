var loadAssets = function(callback){	
		
			if(board.assets.length>0){
				
				for(var i=0; i<board.assets.length; i++){
					var quadrantid = board.assets[i].quadrant.id();
					var quadrantposition = board.assets[i].quadrant.position();
					console.log ("board.quadrants["+quadrantid.x+"|"+quadrantid.y+"].assets["+quadrantposition.x+"|"+quadrantposition.y+"]=board.assets[i]]");
					if(board.quadrants[quadrantid.x+"|"+quadrantid.y].assets[quadrantposition.x+"|"+quadrantposition.y]==undefined){
						board.quadrants[quadrantid.x+"|"+quadrantid.y].assets[quadrantposition.x+"|"+quadrantposition.y]=[];
					}
					board.quadrants[quadrantid.x+"|"+quadrantid.y].assets[quadrantposition.x+"|"+quadrantposition.y].push(board.assets[i]);
				}
				
			}
		
		//callback();
		
}