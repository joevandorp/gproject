console.read=[];
console.line=0;

if (typeof console  != "undefined"){
  if (typeof console.log != 'undefined'){
   	 	console.olog = console.log;
    }
}else{
  console.olog = function() {};
}

console.log = function(message) {
  console.olog(message);
  console.read.unshift(console.line+' '+message);
  if(console.read.length>50){
  	console.read = console.read.slice(0,50);
  }
  console.line++;
};

console.error = console.debug = console.info = console.log;