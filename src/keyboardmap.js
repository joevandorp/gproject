var keys={};

keys.list = {48:'0',49:'1',50:'2',51:'3',52:'4',53:'5',54:'6',55:'7',56:'8',57:'9',8:'backspace',9:'tab',13:'enter',16:'shift',17:'ctrl',18:'alt',19:'pause',20:'caps',27:'esc',33:'pgup',34:'pgdn',35:'end',36:'home',37:'left',38:'up',39:'right',40:'down',45:'ins',46:'del',65:'a',66:'b',67:'c',68:'d',69:'e',70:'f',71:'g',72:'h',73:'i',74:'j',75:'k',76:'l',77:'m',78:'n',79:'o',80:'p',81:'q',82:'r',83:'s',84:'t',85:'u',86:'v',87:'w',88:'x',89:'y',90:'z',91:'lcmd',92:'rwin',93:'rcmd',96:'n0',97:'n1',98:'n2',99:'n3',100:'n4',101:'n5',102:'n6',103:'n7',104:'n8',105:'n9',106:'multiply',107:'add',109:'subtract',110:'decimal',111:'divide',112:'f1',113:'f2',114:'f3',115:'f4',116:'f5',117:'f6',118:'f7',119:'f8',120:'f9',121:'f10',122:'f11',123:'f12',144:'numlock',145:'scrolllock',186:'semicolon',187:'equal',188:'comma',189:'dash',190:'period',191:'slash',192:'accent',219:'lbracket',220:'backslash',221:'rbracket',222:'quote',32:'space'};

(function(){
	for (var i in keys.list){
		keys[keys.list[i]+'_state']='keyup';
	}
}());

window.onkeydown = function(e){
var code = e.keyCode||e.which;
//document.getElementById("key").innerHTML="("+code+") "+keys.list[code];
  if(typeof keys[keys.list[code]+'_keydown'] == 'function'){
    keys[keys.list[code]+'_keydown']();
  }
  
  	keys[keys.list[code]+'_state']='keydown';
  
	console.log("ptoken = "+board.playertoken+" "+board.assets.length);
    
    board.refresh();
    
    console.log("xpos:"+board.assets[board.playertoken].x+" ypos:"+board.assets[board.playertoken].y+" "+board.assets[board.playertoken].facing);
}

window.onkeyup = function(e){
var code = e.keyCode||e.which;
//document.getElementById("key").innerHTML="("+code+") "+keys.list[code];
  if(typeof keys[keys.list[code]+'_keyup'] == 'function'){
    keys[keys.list[code]+'_keyup']();
  }
  
  keys[keys.list[code]+'_state']='keyup';
		
    board.refresh();
    	
}

keys.l_keydown = function(){
	loadAssets();
	
}

keys.n_keydown = function(){
	board.redraw_quadrants=true;
}

keys.k_keydown = function(){
	board.assets=board.assets.slice(0,30);
	
}


keys.shift_keydown = keys.e_keydown = function(){
	console.log("shifty");
	board.cameraToAsset(board.playertoken,'center');
}

keys.shift_keyup = keys.e_keyup = function(){
	
}

keys.t_keydown = function(){
	board.onscreen_quadrants();
}

keys.t_keyup = function(){
	if(runtest === false){
		runtest = true;
		perf_test();
	}else{
		runtest = false;
	}
}

keys.space_keydown = function(){
	console.log("spacey!!!!");
	board.assets.push(new asset(board.assets[board.assets.length-1].x,board.assets[board.assets.length-1].y));
	board.playertoken = board.playertoken<board.assets.length-1?board.playertoken+1:0;
}

keys.r_keydown = function(){
	if (board.mouse.action=='dragboard'){
		board.mouse.action='addassets';
	}else{
		board.mouse.action='dragboard';
	}
}

keys.up_keydown = keys.w_keydown = function(){
	console.log("UP");
	board.assets[board.playertoken].methods.moveY(-1);
}

keys.down_keydown = keys.s_keydown = function(){
	console.log("DOWN");
	board.assets[board.playertoken].methods.moveY(1);
}

keys.left_keydown = keys.a_keydown = function(){
	console.log("LEFT");
	board.assets[board.playertoken].methods.moveX(-1);
}

keys.right_keydown = keys.d_keydown = function(){
	console.log("RIGHT");
	board.assets[board.playertoken].methods.moveX(1);
}

keys.slash_keydown = function(){
	console.log("FIIRE GUN");
	if(typeof board.assets[board.playertoken].methods.fireGun == 'function'){
		board.assets[board.playertoken].methods.fireGun();
	}
}