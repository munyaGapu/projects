var opts={empty:false,chars:false,valid:false};
var loginClicked=true ;
var registerClicked=true;
var scrolledUp=true;
var msgInterval;
var clickedCmId;
var loadComments=false;
window.onload=init;

function init(){
	initial();
	if(msgInterval==undefined || msgInterval==null){
		msgInterval=setInterval(getMsg,2000);
	}
	else{
		clearInterval(msgInterval);
		msgInterval=setInterval(getMsg,2000);
	}
	
	setTimeout(function(){
		var msgCont=document.getElementById("msgCont");
		if(msgCont!=null){
			msgCont.scrollTop=msgCont.scrollHeight;
			
		}
		
	},3000);
	
	var lgt_link=document.getElementById("lgtLink");
		if(lgt_link==null){
			var lgInFlag=localStorage.getItem('in');
			var lgOtFlag=localStorage.getItem('out');
			var ul=document.getElementById("linkCont");
			var li=document.createElement("li");
			li.setAttribute('id','lgtLink');
			//li.onclick=disposeLink;
			ul.appendChild(li);
			var a=document.createElement("a");
			if(!lgInFlag && lgOtFlag){
				
				a.setAttribute('href','#');
				a.onclick=logUser;
				a.innerHTML="Login";
			}
			if(lgInFlag && !lgOtFlag){
				
				a.setAttribute('href','#');
				a.onclick=logUserOut;
				a.innerHTML="LogOut";
			}
			if(!lgInFlag && !lgOtFlag){
				
				a.setAttribute('href','#');
				a.onclick=logUser;
				a.innerHTML="Login";
			}
			
			li.appendChild(a);
		}
	
	
}

function cmTeaser(){
	var cmsAct=document.getElementsByClassName("commentsAct");
	var cms=document.getElementsByClassName("comments");
	
	if(cms!=null || cms!=undefined){
		for(var x=0;x<cms.length;x++){
			var curCms=cms[x];
			curCms.onclick=logUser;
		}
		
	}
	if(cmsAct!=null){
		for(var x=0;x<cmsAct.length;x++){
			var curCms=cmsAct[x];
			curCms.onclick=displayComments;
		}
		
		
	}
	
}

function displayComments(e){
	loadComments=true;

	var elInfo=obj(e);
	var elId=elInfo.id;
	clickedCmId=elId;
	var new_req=req();
	var fd=new FormData();
	fd.append('text_id',elId);
	new_req.open('POST','loadBlog.php',true);
	new_req.onreadystatechange=function(){
		if(new_req.readyState==4 && new_req.status==200){
			var mainCont=document.getElementById("blogCont");
			mainCont.innerHTML=new_req.responseText;
			var mainThread=document.getElementsByClassName("msgTextAct")[0];
			var mainThread1=document.getElementsByClassName("msgText")[0];
			if(mainThread==null && mainThread1!=null){
				mainThread1.onclick=backToBlog;
			}
			if(mainThread!=null && mainThread1==null){
				mainThread.onclick=backToBlog;
			}
			var cmBtn=document.getElementById("cmBtn");
			if(cmBtn!=null){
				cmBtn.onclick=commentIt;
				var cm=document.getElementById("realCm").value;
				cm.onkeypress=enterCm;
			}
			document.getElementById("allCms").innerHTML="<p>Loading....</p>";
			setInterval(getComments,3000);
		}
	}
	new_req.send(fd);
}

function getComments(){
	if(loadComments){
		
		var new_req=req();
		var new_fd=new FormData();
		new_fd.append('cm_parent_id',clickedCmId);
		new_req.open('POST','loadBlog.php',true);
		new_req.onreadystatechange=function(){
			if(new_req.readyState==4 && new_req.status==200){
				var mainCont=document.getElementById("allCms");
				mainCont.innerHTML=new_req.responseText;
				
			}
		}
		new_req.send(new_fd);
	}
}
function initial(){

	var mainCont=document.getElementById("blogCont");
	var new_req=req();
	new_req.open("GET","loadBlog.php?initial=1",true);
	new_req.onreadystatechange=function(){
		if(new_req.readyState==4 && new_req.status==200){
			mainCont.innerHTML=new_req.responseText;
			
			var loginLink=document.getElementById("login");
			var registerLink=document.getElementById("register");
			var sBtn=document.getElementById("blogBtn");
			if(loginLink!=null || registerLink!=null){
				loginLink.onclick=logUser;
				registerLink.onclick=regUser;
			}
			if(sBtn!=null){
				sBtn.onclick=shareIt;
				var msgBox=document.getElementById("msg");
				msgBox.onkeypress=enterPressed;
			}
			var msgCont=document.getElementById("msgCont");
			msgCont.innerHTML="<p>Loading....</p>";
			
			}
			
		
	}
	new_req.send(null);
	
}

function enterPressed(e){
	var keyCode=e.keyCode;
	if(keyCode==13){
		var cmBtn=document.getElementById("cmBtn");
		var sBtn=document.getElementById("blogBtn");
		var msgBox=document.getElementById("msg");
		msgBox.value="";
		sBtn.click();
	}
}

function enterCm(e){
	var keyCode=e.keyCode;
	if(keyCode==13){
		var cmBtn=document.getElementById("cmBtn");
		cmBtn.click();
		var cm=document.getElementById("realCm");
		cm.value="";
	}
}
function commentIt(){
	var cm=document.getElementById("realCm").value;
	var chars=['~','`','!','@','#','$','%','^','&','*','(',')','-','+','{','}','[',']','<','>','?'];
	for(var i=0;i<cm.length;i++){
		var curChar=cm[i];
		if(chars.indexOf(curChar)>=0){
			alert("wrong");
			return;
			
		}
	}
	if(cm==""){
		alert("thing");
		return;
	}
	
	var fd=new FormData();
	fd.append('the_cm',cm);
	var new_req=req();
	new_req.open("POST","addBlog.php",true);
	new_req.send(fd);
	setTimeout(function(){
		var mainCont=document.getElementById("mainThreadCont");
		mainCont.scrollTop=mainCont.scrollHeight;
	},1500);
	document.getElementById("realCm").value="";
}
function shareIt(){
	var msgBox=document.getElementById("msg");
	var val=msgBox.value;
	var chars=['~','`','!','@','#','$','%','^','&','*','(',')','-','+','{','}','[',']','<','>','?'];
	for(var i=0;i<val.length;i++){
		var curChar=val[i];
		if(chars.indexOf(curChar)>=0){
			msgBox.classList.add('redBorder');
			alert("wrong");
			return;
			
		}
	}
	if(val==""){
		msgBox.classList.add('redBorder');
		alert("thing");
		return;
	}
	msgBox.classList.remove('redBorder');
	
	var fd=new FormData();
	fd.append('msg',val);
	var new_req=req();
	new_req.open("POST","addBlog.php",true);
	new_req.send(fd);
	msgBox.value="";
}

function getMsg(){
	
	if(loginClicked && registerClicked){
	var new_req=req();
	var msgCont=document.getElementById("msgCont");
	if(msgCont!=null){
	new_req.open("GET","loadBlog.php?all_msg=1",true);
	new_req.onreadystatechange=function(){
		if(new_req.readyState==4 && new_req.status==200){
			var topVal=parseInt(msgCont.scrollTop);
			var htVal= parseInt(msgCont.scrollHeight);
			var elHt= msgCont.offsetHeight;
			var sum=topVal+elHt;
			
			msgCont.innerHTML=new_req.responseText;
			cmTeaser();
			var canScroll=msgCont.scrollTop+msgCont.offsetHeight>=msgCont.scrollHeight;
			var tt=document.getElementById("msg");
			//tt.value=scrolledUp;
			if(Math.round(sum)>=htVal){
				msgCont.scrollTop=msgCont.scrollHeight;
			}
		}
		
	}
	new_req.send(null);
	}
	}
	
}
function logUser(){
	loginClicked=false;
	var new_req=req();
	var mainCont=document.getElementById("blogCont");
	new_req.open("GET","loadBlog.php?login=1",true);
	new_req.onreadystatechange=function(){
		if(new_req.readyState==4 && new_req.status==200){
			mainCont.innerHTML=new_req.responseText;
			var logBtn=document.getElementById("logBtn");
			var bBtn=document.getElementById("backBtn");
			if(bBtn!=null){
				bBtn.onclick=backToBlog;
			}
			if(logBtn!=null){
				logBtn.onclick=userLogin;
			}
			}
		
	}
	new_req.send(null);
	
	
 }

function backToBlog(){
	loginClicked=true;
	registerClicked=true;
	loadComments=false;
	init();
}
function userLogin(){
	
	var email=document.getElementById("email").value;
	var pass=document.getElementById("pass").value;
	var p=document.getElementById("error");
	if(!email.match(/^[a-zA-Z]+[@][a-zA-Z]+[\.][A-Za-z]+/)){
		p.innerHTML="Invalid email";
		p.className="errMsg";
		return;
	}
	else if(email==""){
		p.innerHTML="enter your email";
		p.className="errMsg";
		return;
	}
	else if(pass==""){
		p.innerHTML="enter your password";
		p.className="errMsg";
		return;
	}
	p.innerHTML="";
	var fd=new FormData();
	fd.append('logEmail',email);
	fd.append('logPass',pass);
	var new_req=req();
	new_req.open("POST","addBlog.php",true);
	new_req.onreadystatechange=function(){
		if(new_req.readyState==4 && new_req.status==200){
			if(new_req.responseText=="ok"){
				var lgt_link=document.getElementById("lgtLink");
				if(lgt_link==null){
		
					var ul=document.getElementById("linkCont");
					var li=document.createElement("li");
					li.setAttribute('id','lgtLink');
					//li.onclick=disposeLink;
					ul.appendChild(li);
					var a=document.createElement("a");
					a.setAttribute('href','#');
					a.onclick=logUserOut;
					a.innerHTML="Logout";
					li.appendChild(a);
					var outFlag=localStorage.getItem('out');
					if(outFlag){
						localStorage.removeItem('out');
					}
					localStorage.setItem('in',JSON.stringify(1));
				}
				else{
					var lgOutLink=document.getElementById('lgtLink').getElementsByTagName("a")[0];
					lgOutLink.innerHTML="Logout";
					var outFlag=localStorage.getItem('out');
					if(outFlag){
						localStorage.removeItem('out');
					}
					localStorage.setItem('in',JSON.stringify(1));
					lgOutLink.onclick=logUserOut;
				}
				
				p.innerHTML="Good to go!!!";
				p.className="sucMsg";
				setTimeout(function(){
					initial();
					loginClicked=true;
				},2000);
			}
			else{
				p.innerHTML=new_req.responseText;
			}
		}
	}
	new_req.send(fd);
}

function logUserOut(){
	localStorage.removeItem('in');
	localStorage.setItem('out',JSON.stringify(1));
	window.location.href="user_logout.php";
}

function regUser(){
	var new_req=req();
	registerClicked=false;
	var mainCont=document.getElementById("blogCont");
	new_req.open("GET","loadBlog.php?register=1",true);
	new_req.onreadystatechange=function(){
		if(new_req.readyState==4 && new_req.status==200){
			mainCont.innerHTML=new_req.responseText;
			var logBtn=document.getElementById("logBtn");
			if(logBtn!=null){
				logBtn.onclick=userLogin;
			}
			var emailInput=document.getElementById("email");
			var fname=document.getElementById("fname");
			var passInput=document.getElementById("pass");
			var pass2=document.getElementById("pass2");
			var regBtn=document.getElementById("regBtn");
			if(emailInput!=null){
				emailInput.addEventListener("blur",checkEmail,false);
				emailInput.addEventListener("blur",checkField,false);
				fname.addEventListener("blur",checkField,false);
				fname.addEventListener("blur",checkChars,false);
				passInput.addEventListener("blur",checkField,false);
				passInput.addEventListener("blur",checkPass,false);
				pass2.addEventListener("keyup",isSame,false);
				regBtn.onclick=register;
			}
			var bBtn=document.getElementById("backBtn");
			if(bBtn!=null){
				bBtn.onclick=backToBlog;
			}
			
			}
		
	}
	new_req.send(null);
	
	
}
function register(){
	var p=document.getElementById("error");
	var btn=document.getElementById("regBtn");
	btn.disabled=true;
	var email=document.getElementById("email").value;
	var fname=document.getElementById("fname").value;
	var pass=document.getElementById("pass").value;
	var fd=new FormData();
	var new_req=req();
	fd.append('email',email);
	fd.append('fname',fname);
	fd.append('pass',pass);
	new_req.open("POST","addBlog.php",true);
	new_req.onreadystatechange=function(){
		if(new_req.readyState==4 && new_req.status==200){
			if(new_req.responseText=="ok"){
				var lgt_link=document.getElementById("lgtLink");
				if(lgt_link==null){
		
					var ul=document.getElementById("linkCont");
					var li=document.createElement("li");
					li.setAttribute('id','lgtLink');
					ul.appendChild(li);
					var a=document.createElement("a");
					a.setAttribute('href','#');
					a.innerHTML="Logout";
					a.onclick=logUserOut;
					li.appendChild(a);
					var outFlag=localStorage.getItem('out');
					if(outFlag){
						localStorage.removeItem('out');
					}
					localStorage.setItem('in',JSON.stringify(1));
				}
				else{
					var lgOutLink=document.getElementById('lgtLink').getElementsByTagName("a")[0];
					lgOutLink.innerHTML="Logout";
					var outFlag=localStorage.getItem('out');
					if(outFlag){
						localStorage.removeItem('out');
					}
					localStorage.setItem('in',JSON.stringify(1));
					lgOutLink.onclick=logUserOut;
				}
				
				p.innerHTML="Good to go!!!";
				p.className="sucMsg";
				setTimeout(function(){
					initial();
					registerClicked=true;
				},2000);
			}
			else{
				p.innerHTML=new_req.responseText;
				btn.disabled=false;
			}
		}
	}
	new_req.send(fd);
}

function isSame(e){
	var p=document.getElementById("error");
	var p1=document.getElementById("pass").value;
	var elInfo=obj(e);
	var val=elInfo.value;
	if(val!=p1){
		p.className="errMsg";
		opts.valid=false;
		p.innerHTML="password mismatch";
		elInfo.focus();
		
	}
	else{
	opts.valid=true;
	p.className="";
	p.innerHTML="";
	}
	monitor();
}

function checkPass(e){
	var p=document.getElementById("error");
	var elInfo=obj(e);
	var val=elInfo.value;
	if(val.length<6){
		opts.valid=false;
		p.innerHTML="password too short";
		p.className="errMsg";
		elInfo.focus();
		
	}
	else{
	opts.valid=true;
	p.className="";
	p.innerHTML="";
	}
	monitor();
}

function checkField(e){
	var p=document.getElementById("error");
	var elInfo=obj(e);
	if(elInfo.value==""){
		opts.empty=false;
		p.innerHTML="fill all fields";
		p.className="errMsg";
		elInfo.focus();
		
	}
	else{
	opts.empty=true;
	p.className="";
	p.innerHTML="";
	}
	monitor();
}

function checkChars(e){
	var p=document.getElementById("error");
	var elInfo=obj(e);
	var val=elInfo.value;
	var chars=['~','`','!','@','#','$','%','^','&','*','(',')','-','+','{','}','[',']','<','>','?'];
	for(var i=0;i<val.length;i++){
		var curChar=val[i];
		if(chars.indexOf(curChar)>=0){
			opts.chars=false;
			p.innerHTML="invalid input";
			p.className="errMsg";
			elInfo.focus();
			
		}
	
		else{
		opts.chars=true;
		p.className="";
		p.innerHTML="";
		}
	}
	monitor();
}
function checkEmail(e){
	var p=document.getElementById("error");
	var elInfo=obj(e);
	var val=elInfo.value;
	if(!val.match(/^[a-zA-Z]+[@][a-zA-Z]+[\.][A-Za-z]+/)){
		opts.valid=false;
		p.innerHTML="invalid email";
		p.className="errMsg";
		elInfo.focus();
	}
	else{
		opts.valid=true;
		p.className="";
		p.innerHTML="";
	}
	monitor();
}

function monitor(){
	var btn=document.getElementById("regBtn");
	for(var x in opts){
		if(!opts[x]){
			btn.disabled=true;
			return;
		}
	}
	btn.disabled=false;
}

function removeModal(e){
	var elInfo=obj(e);
	var elId=elInfo.parentNode.id;
	var elRef=document.getElementById(elId);
	elRef.parentNode.removeChild(elRef);
}