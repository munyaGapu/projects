window.onload=init;
function init(){
	var the_btn=document.getElementById("take_note");
	the_btn.onclick=makeit;
	var the_text=document.getElementById("the_note");
	the_text.onkeypress=the_press;
	var new_arr=the_arr();
	for(var i=0;i<new_arr.length;i++){
		var key=new_arr[i];
		var val=JSON.parse(localStorage[key]);
		addit(key,val);
		
			}
}

function rem_el(e){
	var rcvd_key=e.target.id;
	if(e.target.tagName.toLowerCase()=="span"){
		rcvd_key=e.target.parentNode.id;
	}
	var to_del=document.getElementById(rcvd_key);
	to_del.parentNode.removeChild(to_del);
	del(rcvd_key);
}

function del(key){
	localStorage.removeItem(key);
	var rcvd_arr=the_arr();
	if(rcvd_arr){
	for(var i=0;i<rcvd_arr.length;i++){
		if(key==rcvd_arr[i]){
			rcvd_arr.splice(i,1);
		}
	}
	localStorage.setItem("my_array",JSON.stringify(rcvd_arr));
	}
}
function the_arr(){
	var arr=localStorage.getItem("my_array");
	if(!arr){
		arr=[];
		localStorage.setItem("my_array",arr);
	}
	else{
		arr=JSON.parse(arr);
	}
	return arr;
	
}
function the_press(e){
	var the_btn=document.getElementById("take_note");
	if(e.keyCode==13){
		the_btn.click();
		return false;
	}
}
function makeit(){
	var the_opt=document.getElementById("color");
	var ind=the_opt.selectedIndex;
	var the_col=the_opt[ind].value;
	var txt=document.getElementById("the_note").value;
	var c_date=new Date();
	var the_key="sticky_"+c_date.getTime();
	var user_obj={
		"value":txt,
		"color":the_col
	}
	localStorage.setItem(the_key,JSON.stringify(user_obj));
	var arr1=the_arr();
	arr1.push(the_key);
	localStorage.setItem("my_array",JSON.stringify(arr1));
	addit(the_key,user_obj);
	document.getElementById("the_note").value="";
	
}
function addit(key,obj){
	var the_ul=document.getElementById("stickies");
	var the_li=document.createElement("li");
	var the_span=document.createElement("span");
	the_li.setAttribute("id",key);
	the_li.style.backgroundColor=obj.color;
	the_span.innerHTML=obj.value;
	the_li.appendChild(the_span);
	the_ul.appendChild(the_li);
	the_li.onclick=rem_el;
}