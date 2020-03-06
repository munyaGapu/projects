var obj={
	v_count:0,vowel:["a","e","i","o","u"],
	process:function(name){
		for(var tmp=0;tmp<name.length;tmp++){
			if(this.vowel.indexOf(name[tmp])>=0){
				this.v_count++;
			}
		}
		return this.v_count;
	}
	
}
function take(){
	var inp=document.getElementById("name");
	inp.onkeypress=handlepress;
	var btn=document.getElementById("go_name");
	btn.onclick=handleclick
}

function handleclick(){
	var inp=document.getElementById("name");
	var thename=inp.value;
	var num=obj.process(thename);
	var thediv=document.getElementById("disp");
	thediv.innerHTML="Ma vowels ari muzita mako anosvika "+num;
}

function handlepress(e){
	var btn=document.getElementById("go_name");
	if(e.keyCode===13){
		btn.click();
		return false;
	}
}
window.onload=take;