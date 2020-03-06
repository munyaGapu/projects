var opts={empty:false,chars:false,valid:false};
window.onload=init;
var viewedPic;
function init(){
	var all_article_link=document.getElementById("all");
	var new_article_link=document.getElementById("new");
	var analyse_link=document.getElementById("analyse");
	
	all_article_link.onclick=articleLoad;
	new_article_link.onclick=newArticleLoad;
	analyse_link.onclick=loadAnalytics;
	articleLoad();
	var lgIn=localStorage.getItem('in');
	var lgOut=localStorage.getItem('out');
	var ul=document.getElementById("lgtLinkCont");
	var lgtLink=document.getElementById("lgtLink");
	if(lgtLink==null){
	var li=document.createElement("li");
	li.setAttribute('id','lgtLink');
	//li.onclick=disposeLink;
	ul.appendChild(li);
	var a=document.createElement("a");
	if(!lgIn && lgOut){
		
		a.setAttribute('href','#');
		a.innerHTML="Login";
	}
	if(lgIn && !lgOut){
		
		a.setAttribute('href','#');
		a.onclick=logUserOut;
		a.innerHTML="Logout";
	}
	if(!lgIn && !lgOut){
		
		a.setAttribute('href','#');
		a.innerHTML="Login";
	}
	
	li.appendChild(a);
	}
}

function logUser(){
	
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
	new_req.open("POST","loadArticle.php",true);
	new_req.onreadystatechange=function(){
		if(new_req.readyState==4 && new_req.status==200){
			if(new_req.responseText=="ok"){
				var lgt_link=document.getElementById("lgtLink");
				if(lgt_link==null){
		
					var ul=document.getElementById("lgtLinkCont");
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
					articleLoad();
				},2000);
			}
			else{
				p.innerHTML=new_req.responseText;
			}
		}
	}
	new_req.send(fd);
}

function register(){
	alert("taura");
	var p=document.getElementById("error");
	var btn=document.getElementById("regBtn");
	btn.disabled=true;
	var email=document.getElementById("rEmail").value;
	var fname=document.getElementById("rFname").value;
	var pass=document.getElementById("rPass").value;
	var fd=new FormData();
	var new_req=req();
	fd.append('rEmail',email);
	fd.append('rFname',fname);
	fd.append('rPass',pass);
	new_req.open("POST","loadArticle.php",true);
	new_req.onreadystatechange=function(){
		alert("taura again");
		if(new_req.readyState==4 && new_req.status==200){
			alert("ndapedxza");
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
					articleLoad();
				},2000);
			}
			else{
				alert("oops");
				alert(new_req.responseText);
				p.innerHTML=new_req.responseText
				btn.disabled=false;
			}
		}
	}
	new_req.send(fd);
}

function logUserOut(){
	localStorage.setItem('out',JSON.stringify(1));
	localStorage.removeItem('in');
	window.location.href="admin_logout.php";
}

function articleLoad(){
	
	var request=req();
	request.open("GET","loadArticle.php?all=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			var response=request.responseText;
			var mainSect=document.getElementById("newsCont");
			mainSect.innerHTML=response;
			var headings=document.getElementsByClassName("articleHeader");
			if(headings!=null || headings!=undefined){
				for(var x=0;x<headings.length;x++){
					var curH=headings[x];
					curH.onclick=displayFullArticle;
				}
			}
			var relatedPics=document.getElementsByClassName("relatedPics");
			if(relatedPics!=null || relatedPics!=undefined){
				for(var y=0;y<relatedPics.length;y++){
					var curPic=relatedPics[y];
					curPic.onclick=displayFullPic;
				}
			}
			//check for log in and register fields////
			var formCont=document.getElementById("formCont");
			if(formCont!=null){
				//check whether they are login fields loaded////
				var lgEmail=document.getElementById("email");
				var lgPass=document.getElementById("pass");
				var lgBtn=document.getElementById("logBtn");
				if(lgEmail!=null && lgPass!=null && lgBtn!=null){
					lgBtn.onclick=logUser;
				}
				
				//check whether they are registration fields loaded/////
				var rEmail=document.getElementById("rEmail");
				var rFname=document.getElementById("rFname");
				var rPass=document.getElementById("rPass");
				var rPass2=document.getElementById("rPass2");
				var regBtn=document.getElementById("regBtn");
				if(rEmail!=null && rFname!=null && rPass!=null && rPass2!=null && regBtn!=null){
					rEmail.addEventListener("blur",checkEmail,false);
					rEmail.addEventListener("blur",checkField,false);
					rFname.addEventListener("blur",checkField,false);
					rFname.addEventListener("blur",checkChars,false);
					rPass.addEventListener("blur",checkField,false);
					rPass.addEventListener("blur",checkPass,false);
					rPass2.addEventListener("keyup",isSame,false);
					regBtn.onclick=register;
				}
				
			}
		}
		
		
	}
	request.send(null);
}

function isSame(e){
	var p=document.getElementById("error");
	var p1=document.getElementById("rPass").value;
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
function displayFullPic(e){
	var elInfo=obj(e);
	var src=elInfo.src;
	picId=elInfo.id;
	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	var mainHeader=document.getElementById("siteHeader");
	mainHeader.appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	var img=document.createElement("img");
	img.setAttribute('src','img/change2.jpg');
	img.setAttribute('id','cancelImg');
	mainCover.appendChild(img);
	img.onclick=removeModal;
	var sub_img=document.createElement("img");
	sub_img.setAttribute('src',src);
	subCover.appendChild(sub_img);
	
	//create delete and replace button
	var deleteBtn=document.createElement("input");
	deleteBtn.setAttribute('type','button');
	deleteBtn.setAttribute('id','delete');
	deleteBtn.setAttribute('value','Delete');
	subCover.appendChild(deleteBtn);
	deleteBtn.onclick=deletePic;
	
	var applyBtn=document.createElement("input");
	applyBtn.setAttribute('type','button');
	applyBtn.setAttribute('id','apply');
	applyBtn.setAttribute('value','Apply');
	subCover.appendChild(applyBtn);
	applyBtn.onclick=replacePic;
	
	var replaceBtn=document.createElement("input");
	replaceBtn.setAttribute('type','file');
	replaceBtn.setAttribute('id','rep');
	subCover.appendChild(replaceBtn);
	
}

function replacePic(e){
	var elInfo=obj(e);
	elInfo.value="please wait..";
	elInfo.onclick="";
	var id=picId;
	var elRef=document.getElementById(id);
	var chosenPic=document.getElementById("rep").files[0];
	if(chosenPic==null || chosenPic==undefined){
		return;
	}
	var allowed=['jpg','png','jpeg'];
	var typeArr=chosenPic.type.split("/");
	var ext=typeArr[1];
	if(allowed.indexOf(ext)<0){
		return;
	}
	if(chosenPic.size>2000000){
		return;
	}
	var request=req();
	var fd=new FormData();
	fd.append('toReplace',id);
	fd.append('pic',chosenPic);
	request.open("POST","loadArticle.php",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			elInfo.value="Done!"
			/*if(request.responseText=="ok"){
				elInfo.value="Success!";
				*/
			setTimeout(function(){
				elRef.src=request.responseText;
				elInfo.onclick=replacePic;	
				document.getElementById("cancelImg").click();	
				},2000);
		}
	}
	request.send(fd);
}

function deletePic(e){
	var elInfo=obj(e);
	elInfo.value="Wait...";
	elInfo.onclick="";
	var id=picId;
	var request=req();
	var fd=new FormData();
	fd.append('toDelete',id);
	request.open("POST","loadArticle.php",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			if(request.responseText=="ok"){
				elInfo.value="Done!"
				setTimeout(function(){
				elInfo.value="Delete"
				elInfo.onclick=deletePic;
				all_article_link=document.getElementById("all").click();
				document.getElementById("cancelImg").click();		
				},2000);
			}
			
		}
	}
	request.send(fd);
}
function displayFullArticle(e){
	var elInfo=obj(e);
	var elId=elInfo.id;
	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	var mainHeader=document.getElementById("siteHeader");
	mainHeader.appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	var img=document.createElement("img");
	img.setAttribute('src','img/change2.jpg');
	img.setAttribute('id','cancelImg');
	mainCover.appendChild(img);
	img.onclick=removeModal;
	subCover.innerHTML="Loading data....";
	var new_req=req();
	new_req.open("POST","loadArticle.php",true);
	new_req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var data="article_id="+elId;
	new_req.onreadystatechange=function(){
		if(new_req.readyState==4 && new_req.status==200){
			subCover.innerHTML=new_req.responseText;
		}
	}
	new_req.send(data);
}

function removeModal(e){
	var elInfo=obj(e);
	var elId=elInfo.parentNode.id;
	var elRef=document.getElementById(elId);
	elRef.parentNode.removeChild(elRef);
}
function newArticleLoad(e){
	//e.preventDefault();
	var request=req();
	request.open("GET","loadArticle.php?new=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			var response=request.responseText;
			var mainSect=document.getElementById("newsCont");
			mainSect.innerHTML=response;
			var atHeader=document.getElementById("articleHeader");
			var atBody=document.getElementById("articleBody");
			var atPics=document.getElementById("articlePics");
			var atBtn=document.getElementById("articleSave");
			var mainPic=document.getElementById("articleMainPic");
			var atDrtn=document.getElementById("articleDuration");
			atHeader.addEventListener("blur",checkInput,false);
			atBody.addEventListener("blur",checkInput,false);
			atDrtn.addEventListener("blur",checkInput,false);
			atDrtn.addEventListener("blur",scrollDown,false);
			atBtn.disabled=true;
			atBtn.onclick=saveArticle;
		}
		
		
	}
	request.send(null);
}

function saveArticle(){
	
	var atHeader=document.getElementById("articleHeader").value;
	var atBody=document.getElementById("articleBody").value;
	var mainPic=document.getElementById("articleMainPic").files[0];
	var atPics=document.getElementById("articlePics").files;
	var atBtn=document.getElementById("articleSave");
	var atDrtn=document.getElementById("articleDuration").value;
	var errorP=document.getElementById("atError");
	var allowed=['jpg','png','jpeg'];
	if(mainPic==undefined || mainPic==null){
		scrollUp();
		errorP.innerHTML="Front picture is missing";
		return
	}
	if(atPics.length<1){
		scrollUp();
		errorP.innerHTML="Pictures are missing";
		return
	}
	
	if(atPics.length>3){
		scrollUp();
		errorP.innerHTML="Max number of pictures is 3";
		return
	}
	
	var fd=new FormData();
	fd.append('atHeader',atHeader);
	fd.append('atBody',atBody);
	fd.append('atDrtn',atDrtn);
	console.log(atPics);
	for(var i=0;i<atPics.length;i++){
		var curPic=atPics[i];
		console.log(curPic);
		if(curPic.size<=2000000){
			var type=curPic.type.split("/");
			var ext=type[1];
			if(allowed.indexOf(ext)>=0){
				fd.append('otherPics[]',curPic);
			}
			else{
				scrollUp();
				errorP.innerHTML="File type not allowed";
				return
			}
		}
		else{
			scrollUp();
			errorP.innerHTML="Pictures size limit exceeded";
			return
		}
	}
	if(mainPic.size<=2000000){
		var type=mainPic.type.split("/");
		var ext=type[1];
		if(allowed.indexOf(ext)>=0){
			fd.append('mainPic',mainPic);
		}
		else{
			scrollUp();
			errorP.innerHTML="File type not allowed";
			return
		}
	}
	else{
		scrollUp();
		errorP.innerHTML="Pictures size limit exceeded";
		return
		
	}
	
	atBtn.disabled=true;
	scrollUp();
	errorP.innerHTML="Please Wait....";
	console.log(fd);
	var saveArt=req();
	saveArt.open("POST","loadArticle.php",true);
	saveArt.onreadystatechange=function(){
		if(saveArt.readyState==4 && saveArt.status==200){
			var response=saveArt.responseText;
			
			if(response=="ok"){
				atBtn.disabled=true;
				atHeader.value="";
				atBody.value="";
				atDrtn.value="";
				errorP.innerHTML="Article Published!";
			}
			else{
				errorP.innerHTML=response;
				atBtn.disabled=false;
			}
		}
		
		
	}
	saveArt.send(fd);
	
}

function scrollUp(){
	var mainSect=document.getElementById("newsCont");
	mainSect.scrollTop=0;
}

function scrollDown(){
	var mainSect=document.getElementById("newsCont");
	mainSect.scrollTop=mainSect.scrollHeight;
}
function checkInput(e){
	var elInfo=obj(e);
	var val=elInfo.value;
	var atBtn=document.getElementById("articleSave");
	var errorP=document.getElementById("atError");
	var chars=['`','~','!','@','#','$','%','^','&','*','(',')','-','_','=','+','<','>','{','}','[',']'];
	if(val==""){
		errorP.innerHTML="Invalid input";
		var atBtn=document.getElementById("articleSave");
		atBtn.disabled=true;
		scrollUp();
		return;
	}
	for(var x=0;x<val.length;x++){
		var curChar=val[x];
		if(chars.indexOf(curChar)>=0){
			
			errorP.innerHTML="Invalid input";
			scrollUp();
			atBtn.disabled=true;
			return;
		}
	}
	atBtn.disabled=false;
}
function loadAnalytics(){
	
	
}