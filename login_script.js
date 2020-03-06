var loginObj={
	empty:false
}
window.onload=function(){
	document.getElementById("opt").onclick=displayLink;
	document.getElementById("acc").onchange=accSelect;
	var about=document.getElementById("about");
	var contact=document.getElementById("contact");
	about.onclick=displayAboutPage;
	contact.onclick=displayContactPage;
	var forgotb=document.getElementById("b_forgot");
	var forgotd=document.getElementById("d_forgot");
	forgotb.addEventListener("click",emailPrompt,false);
	forgotd.addEventListener("click",emailPrompt,false);
}
function emailPrompt(e){
	var elInfo=obj(e);
	var elId=elInfo.id;
	var char_array=elId.split("_");
	var userType=char_array[0];
	modalMaker("Please Enter Your Email",userType);
}
function sendUserData(){
	var gError=document.getElementById("guestError");
	var gEmail=document.getElementById("guestEmail");
	var gMessage=document.getElementById("guestMessage");
	var gBtn=document.getElementById("guestBtn");
	
	var userEmail=gEmail.value;
	var userMsg=gMessage.value;
	if(userEmail=="" || userMsg==""){
		gError.innerHTML="Fill all fields";
		return;
				}
	if(!userEmail.match(/^[a-zA-z\.]+[@][a-zA-z]+[\.][a-zA-Z]+/)){
		gError.innerHTML="Email is invalid";
		return;
	}
	var data="email="+escape(userEmail)+"&msg="+escape(userMsg);
	sendEmail(data);
}
function sendEmail(details){
	var gError=document.getElementById("guestError");
	var gBtn=document.getElementById("guestBtn");
	var request=req();
	gError.innerHTML="Please Wait...";
	gBtn.disabled=true;
	request.open('POST','saveEmail.php',true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.onreadystatechange=function(){
	if(request.readyState==4 && request.status==200){
		
		if(request.responseText=="ok"){
			gError.innerHTML="Message Sent";
			gBtn.disabled=false;
		}
		else{
			gError.innerHTML=request.responseText;
			gBtn.disabled=false;
		}
		}
	}
	request.send(details);
}
function displayContactPage(){
	var request=req();
	request.open("GET","contact.php?contact=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			var gError=document.getElementById("guestError");
			var gEmail=document.getElementById("guestEmail");
			var gMessage=document.getElementById("guestMessage");
			var gBtn=document.getElementById("guestBtn");
			if(gError!=null && gEmail!=null && gMessage!=null && gBtn!=null){
				gBtn.onclick=sendUserData;
			}
			else{
				return;
			}
		}
		
	}
	request.send(null);
	
}
function displayAboutPage(){
	var request=req();
	request.open("GET","about.php?about=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			
		}
		
	}
	request.send(null);
}
function displayLink(){
	document.getElementById("linkHolder").classList.toggle('toggle');
}
function accSelect(e){
	var tb=document.getElementById("tb");
	var tb1=document.getElementById("tb1");
	var selectValue=e.target.value;
	if(selectValue=="buyer"){
		tb.style.display="none";
		tb1.style.display="block";
		var bEmail=document.getElementById("b_email");
		var bPass=document.getElementById("b_pass");
		var bBtn=document.getElementById("b_btn");
		handler(bEmail,"blur",checkEmpty);
		handler(bPass,"keyup",checkEmpty);
		bBtn.onclick=loginBuyer;
		//RESET ALL FIELDS AND BUTTONS
		bEmail.value="";
		bPass.value="";
		bBtn.disabled=true;
	}
	else if(selectValue=="dealer"){
		tb.style.display="block";
		tb1.style.display="none";
		var dEmail=document.getElementById("d_email");
		var dPass=document.getElementById("d_pass");
		var dBtn=document.getElementById("d_btn");
		handler(dEmail,"blur",checkEmpty);
		handler(dPass,"keyup",checkEmpty);
		dBtn.onclick=loginDealer;
		dEmail.value="";
		dPass.value="";
		dBtn.disabled=true;
	}
}

function checkEmpty(e){
	var elObj=obj(e);
	var elValue=elObj.value;
	var arr=elObj.id.split("_");
	var identifier=arr[0];
	if(identifier=="b"){
		if(elValue==""){
			document.getElementById("bError").innerHTML=elObj.name+" is empty";
			loginObj.empty=false;
			elObj.focus();
		}
		else{
			document.getElementById("bError").innerHTML="";
			loginObj.empty=true;
		}
		monitor(identifier);
	}
	else{
		if(elValue==""){
		document.getElementById("dError").innerHTML=elObj.name+" is empty";
		loginObj.empty=false;
		elObj.focus();
		}
		else{
			document.getElementById("dError").innerHTML="";
			loginObj.empty=true;
		}
		monitor(identifier);
	}
}

function monitor(detector){
	for (var x in loginObj){
		if(detector=="b"){
			if(!loginObj[x]){
				document.getElementById("b_btn").disabled=true;
				return;
			}
		}
		else{
			if(!loginObj[x]){
				document.getElementById("d_btn").disabled=true;
				return;
			}
		}
	}
	if(detector=="b"){
		document.getElementById("b_btn").disabled=false;
	}
	else{
		document.getElementById("d_btn").disabled=false;
	}
}
function loginBuyer(){
	
	var bEmail=document.getElementById("b_email").value;
	var bPass=document.getElementById("b_pass").value;
	var token=document.getElementById("b_token").value;
	if(!bEmail.match(/^[a-zA-Z\d\.]+[@][a-zA-Z]+[.][A-Za-z\.]+/)){
		document.getElementById("bError").innerHTML="invalid email";
		return;
	}
	else{
		document.getElementById("bError").innerHTML="";
		document.getElementById("b_btn").value="please wait..";
		document.getElementById("b_btn").disabled=true;
	}
	var request=req();
	if(request!=null){
		var data="bEmail="+escape(bEmail)+"&bPass="+bPass+"&bToken="+token;
		request.open("POST","process_credentials.php",true);
		request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				document.getElementById("b_btn").value="Login";
				if(request.responseText=="ok"){
					
					document.getElementById("bError").innerHTML="Redirecting....";
					setTimeout(function(){
						window.location.href="index";
					},2000);
				}
				else{
					document.getElementById("b_btn").disabled=false;
					document.getElementById("bError").innerHTML=request.responseText;
				}
			}
		}
		request.send(data);
	}
	else{
		alert("Your browser does not asynchronous request!!");
	}
}

function loginDealer(){
	var dEmail=document.getElementById("d_email").value;
	var dPass=document.getElementById("d_pass").value;
	var token=document.getElementById("d_token").value;
	if(!dEmail.match(/^[a-zA-Z\d\.]+[@][a-zA-Z]+[.][A-Za-z\.]+/)){
		document.getElementById("dError").innerHTML="invalid email";
		return;
	}
	else{
		document.getElementById("dError").innerHTML="";
		document.getElementById("d_btn").value="please wait..";
		document.getElementById("d_btn").disabled=true;
	}
	var request=req();
	if(request!=null){
		var data="dEmail="+escape(dEmail)+"&dPass="+dPass+"&dToken="+token;
		request.open("POST","process_credentials.php",true);
		request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				document.getElementById("d_btn").value="Login";
				if(request.responseText=="ok"){
					
					document.getElementById("dError").innerHTML="Redirecting....";
					setTimeout(function(){
						window.location.href="dealer";
					},2000);
				}
				else{
					document.getElementById("d_btn").disabled=false;
					document.getElementById("dError").innerHTML=request.responseText;
				}
			}
		}
		request.send(data);
	}
	else{
		alert("Your browser does not asynchronous request!!");
	}
}
function modalMaker(msg,type){
	
	var modalContainer=document.createElement("div");
	modalContainer.setAttribute('id','modalCont');
	var header=document.getElementById("siteHeader");
	header.appendChild(modalContainer);
	/*modalContainer.onclick=function(){
		modalContainer.parentNode.removeChild(modalContainer);
	}*/
	var notifContainer=document.createElement("div");
	notifContainer.setAttribute('id','notifCont');
	var notifP=document.createElement("p");
	notifP.setAttribute('id','userMsg');
	var notifText=document.createTextNode(msg);
	notifContainer.appendChild(notifP);
	notifP.appendChild(notifText);
	
	var emailInput=document.createElement("input");
	emailInput.setAttribute('type','email');
	emailInput.setAttribute('id','recoverEmail');
	var userType=document.createElement("input");
	userType.setAttribute('type','hidden');
	userType.setAttribute('id','usertype');
	userType.setAttribute('value',type);
	var btnInput=document.createElement("input");
	btnInput.setAttribute('type','button');
	btnInput.setAttribute('id','recoverBtn');
	btnInput.setAttribute('value','Send');
	btnInput.onclick=sendRecoverToken;
	var cancelP=document.createElement("p");
	cancelP.setAttribute('id','cancelP');
	var cancelText=document.createTextNode("Cancel");
	cancelP.appendChild(cancelText);
	cancelP.onclick=disposeModalMaker;
	notifContainer.appendChild(emailInput);
	notifContainer.appendChild(btnInput);
	notifContainer.appendChild(userType);
	notifContainer.appendChild(cancelP);
	modalContainer.appendChild(notifContainer);
}
function sendRecoverToken(){
	var main=document.getElementById("main");
	var cancelP=document.getElementById("cancelP");
	var email=document.getElementById("recoverEmail").value;
	var userType=document.getElementById("usertype").value;
	if(userType=="b"){
		var formToken=document.getElementById("b_token").value;
	}
	else if(userType=="d"){
		var formToken=document.getElementById("d_token").value;
	}
	cancelP.click();
	var dangerChars=['`','~','!','#','$','%','^','&','*','(',')','-','_','+','=','[',']','{','}','<','>','?',',','\'','"'];
	if(email!=""){
		for(var x=0;x<email.length;x++){
			var curChar=email[x];
			if(dangerChars.indexOf(curChar)>=0){
				popUpError("Invalid Input");
				return
			}
		}
		var request=req();
				if(request!=null){
					request.open("POST","recover.php");
					var data="email="+escape(email)+"&type="+userType+"&token="+formToken;
					request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
					var distract=document.createElement("div");
					distract.setAttribute('id','distract');
					var header=document.getElementById("siteHeader");
					var img=document.createElement("img");
					img.setAttribute('src','pics/wait4.gif');
					header.appendChild(distract);
					distract.appendChild(img);
					request.onreadystatechange=function(){
						if(request.readyState==4 && request.status==200){
							var cover=document.getElementById("distract");
							cover.parentNode.removeChild(cover);
							if(request.responseText=="done"){
								popUpError("A link has been sent to your email, open your email.");
							}
							else if(request.responseText=="no email"){
								popUpError("The email you provided does not exist, double check the email.");
							}
							else if(request.responseText=="email error"){
								popUpError("Sorry something went wrong. Try later.");
							}
						}
					}
					request.send(data);
				}
				else{
					return;
				}
	}
	else{
		//pop out an error
				popUpError("Please Fill Out The Field");
				return
	}
	
	
}
function popUpError(msg){
	var main=document.getElementById("main");
	var error=document.createElement("p");
	error.setAttribute("id","recoverError");
	error.innerHTML=msg;
	main.appendChild(error);
	setTimeout(function(){
		var recoverP=document.getElementById("recoverError");
		recoverP.parentNode.removeChild(recoverP);
	},3000);
}
function disposeModalMaker(){
	var parentModal=document.getElementById("modalCont");
	parentModal.parentNode.removeChild(parentModal);
}