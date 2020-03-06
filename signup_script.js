var buyerObj={
	empty:false,
	valid:false,
	password:false,
	same:false,
	email:false
}

window.onload=function(){
	var bars=document.getElementById("opt");
	var about=document.getElementById("about");
	var contact=document.getElementById("contact");
	about.onclick=displayAboutPage;
	contact.onclick=displayContactPage;
	bars.onclick=displayLink;
	var selectOpt=document.getElementById("acc");
	selectOpt.onchange=accSelect;
	
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
function accSelect(e){
	var selectValue=e.target.value;
	var div=document.getElementById("tb1");
	var div2=document.getElementById("tb");
	if(selectValue=="buyer"){
		div.style.display="block";
		div2.style.display="none";
		var bName=document.getElementById("b_name");
		var bSname=document.getElementById("b_sname");
		var bEmail=document.getElementById("b_email");
		var bPass=document.getElementById("b_pass");
		var bPass2=document.getElementById("b_pass2");
		var bBtn=document.getElementById("b_btn");
		//reset all fields and buttons
		bName.value="";
		bSname.value="";
		bEmail.value="";
		bPass.value="";
		bPass2.value="";
		bBtn.disabled=true;
		handler(bName,"blur",checkEmpty);
		handler(bName,"blur",checkValidity);
		handler(bSname,"blur",checkEmpty);
		handler(bEmail,"blur",checkEmpty);
		handler(bEmail,"blur",checkEmail);
		handler(bSname,"blur",checkValidity);
		
		handler(bPass,"blur",checkEmpty);
		handler(bPass,"blur",checkLength);
		handler(bPass2,"keyup",isSame);
		bBtn.onclick=registerBuyer;
	}
	else if(selectValue=="dealer"){
		div.style.display="none";
		div2.style.display="block";
		var dName=document.getElementById("d_name");
		var dEmail=document.getElementById("d_email");
		var dCity=document.getElementById("d_city");
		var dAddress=document.getElementById("d_address");
		var dPhone=document.getElementById("d_phone");
		var dPass=document.getElementById("d_pass");
		var dPass2=document.getElementById("d_pass2");
		var dBtn=document.getElementById("d_btn");
		//reset all fields and buttons
		dName.value="";
		dEmail.value="";
		dPass.value="";
		dPass2.value="";
		dCity.value="";
		dPhone.value="";
		dAddress.value="";
		dBtn.disabled=true;
		handler(dName,"blur",checkEmpty);
		handler(dName,"blur",checkValidity);
		handler(dEmail,"blur",checkEmpty);
		handler(dEmail,"blur",checkEmail);
		handler(dCity,"blur",checkEmpty);
		handler(dCity,"blur",checkValidity);
		handler(dAddress,"blur",checkEmpty);
		handler(dAddress,"blur",checkAddress);
		handler(dPhone,"blur",checkEmpty);
		handler(dPhone,"blur",checkPhone);
		handler(dPass,"blur",checkEmpty);
		handler(dPass,"blur",checkLength);
		handler(dPass2,"keyup",isSame);
		dBtn.onclick=registerDealer;
	}
	else{
		return;
	}
}

function checkAddress(e){
	var elInfo=obj(e);
	var elId=elInfo.id;
	var idArray=elId.split("_");
	var targElement=idArray[0];
	var dealerBtn=document.getElementById("d_btn");
	var address=elInfo.value;
	if(address.match(/^[a-zA-Z\d\s]+/)){
		document.getElementById("dError").innerHTML="";
		buyerObj.valid=true;
	}
	else{
		document.getElementById("dError").innerHTML=elInfo.name+" is not valid";
		buyerObj.valid=false;
		elInfo.focus();
	}
	buyerBtnEnable(targElement);
}
function checkPhone(e){
	var elInfo=obj(e);
	var elId=elInfo.id;
	var idArray=elId.split("_");
	var targElement=idArray[0];
	var dealerBtn=document.getElementById("d_btn");
	var phone=elInfo.value;
	if(phone.match(/^[\+][\d]+/)){
		document.getElementById("dError").innerHTML="";
		buyerObj.valid=true;
	}
	else{
		document.getElementById("dError").innerHTML=elInfo.name+" is not valid";
		buyerObj.valid=false;
		elInfo.focus();
	}
	buyerBtnEnable(targElement);
}
function registerBuyer(){
	
	var bName=document.getElementById("b_name").value;
	var bSname=document.getElementById("b_sname").value;
	var bEmail=document.getElementById("b_email").value;
	var bPass2=document.getElementById("b_pass2").value;
	var token=document.getElementById("b_token").value;
	var src="pics/load2.gif";
	var gifContainer=document.getElementById("b_gif");
	while(gifContainer.firstChild){
		gifContainer.removeChild(gifContainer.firstChild);
	}
	var img=document.createElement("img");
	img.setAttribute("src",src);
	img.setAttribute("height","30");
	img.setAttribute("width","30");
	gifContainer.appendChild(img);
	var sReq=req();
	if(sReq!=null){
		var formdata="bName="+escape(bName)+"&bSname="+escape(bSname)+"&bEmail="+escape(bEmail)+"&bPass2="+bPass2+"&bToken="+token;
		/*formdata.append('bName',escape(bName));
		formdata.append('bSname',escape(bSname));
		formdata.append('bEmail',escape(bEmail));
		formdata.append('bPass2',bPass2);*/
		document.getElementById("b_btn").disabled=true;
		document.getElementById("b_btn").value="please wait";
		sReq.open("POST","register_buyer.php",true);
		sReq.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		sReq.onreadystatechange=function(){
			if(sReq.readyState==4 && sReq.status==200){
				document.getElementById("b_btn").value="Register";
				while(gifContainer.firstChild){
					gifContainer.removeChild(gifContainer.firstChild);
				}
				document.getElementById("b_btn").disabled=false;
				if(sReq.responseText=="ok"){
					document.getElementById("bError").innerHTML="Redirecting.........";
					document.getElementById("b_btn").disabled=true;
					setTimeout(function(){
						window.location.href="index.php";
					},2000);
				}
				else{
					document.getElementById("bError").innerHTML=sReq.responseText;
				}
			}
		}
		sReq.send(formdata);
	}
	else{
		alert("Your browser does not support asynchronous requests!!");
	}
		
}
function registerDealer(){
	
	var dName=document.getElementById("d_name").value;
	var dEmail=document.getElementById("d_email").value;
	var dPass=document.getElementById("d_pass").value;
	var dBtn=document.getElementById("d_btn");
	var gifContainer=document.getElementById("d_gif");
	var dCity=document.getElementById("d_city").value;
	var dAddress=document.getElementById("d_address").value;
	var dPhone=document.getElementById("d_phone").value;
	var token=document.getElementById("d_token").value;
	while(gifContainer.firstChild){
		gifContainer.removeChild(gifContainer.firstChild);
	}
	var src="pics/load2.gif";
	var img=document.createElement("img");
	img.setAttribute("src",src);
	img.setAttribute("height","30");
	img.setAttribute("width","30");
	gifContainer.appendChild(img);
	var sReq=req();
	if(sReq!=null){
		dBtn.disabled=true;
		dBtn.value="please wait";
		var data="dname="+escape(dName)+"&email="+escape(dEmail)+"&dpass="+dPass+"&dcity="+escape(dCity)+"&daddress="+escape(dAddress)+"&dphone="+escape(dPhone)+
		"&dToken="+token;
		sReq.open("POST","register_buyer.php",true);
		sReq.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		sReq.onreadystatechange=function(){
			if(sReq.readyState==4 && sReq.status==200){
				dBtn.disabled=false;
				dBtn.value="Register";
				while(gifContainer.firstChild){
					gifContainer.removeChild(gifContainer.firstChild);
				}
				if(sReq.responseText=="ok"){
					document.getElementById("dError").innerHTML="Redirecting.....";
					dBtn.disabled=true;
					setTimeout(function(){
						window.location.href="dealer.php";
					},2000);
				}
				else{
					document.getElementById("dError").innerHTML=sReq.responseText;
				}
				
			}
		}
		sReq.send(data);
	}
}
function checkEmail(e){
	var elInfo=obj(e);
	var email=elInfo.value;
	var targElement=elInfo.id.split("_");
	if(targElement[0]=="b"){
		if(!email.match(/[a-zA-z\.\d]+[@][a-zA-z]+[\.]\w{3,5}/)){
			
			document.getElementById("bError").innerHTML="invalid email";
			buyerObj.email=false;
			elInfo.focus();
		}
		else{
			document.getElementById("bError").innerHTML="";
			buyerObj.email=true;
		}
		buyerBtnEnable(targElement[0]);
	}
	else{
		if(!email.match(/[a-zA-z]+[@][a-zA-z\d]+[\.][a-zA-z\.]+/)){
			document.getElementById("dError").innerHTML="invalid email";
			buyerObj.email=false;
			elInfo.focus();
		}
		else{
			document.getElementById("dError").innerHTML="";
			buyerObj.email=true;
		}
		buyerBtnEnable(targElement[0]);
	}
}
function isSame(e){
	var elInfo=obj(e);
	var pass2=elInfo.value;
	var targElement=elInfo.id.split("_");
	if(targElement[0]=="b"){
			var bPass=document.getElementById("b_pass").value;
			if(pass2!=bPass){
				document.getElementById("bError").innerHTML="password mismatch";
				buyerObj.same=false;
				
				}
				else{
					document.getElementById("bError").innerHTML="";
					buyerObj.same=true;
					}
			buyerBtnEnable(targElement[0]);
			
		}
		else{
			var dPass=document.getElementById("d_pass").value;
			if(pass2!=dPass){
				document.getElementById("dError").innerHTML="password mismatch";
				buyerObj.same=false;
				
			}
			else{
				document.getElementById("dError").innerHTML="";
				buyerObj.same=true;
			}
			buyerBtnEnable(targElement[0]);
		}
	
}
function checkLength(e){
	var elInfo=obj(e);
	var elementValue=elInfo.value;
	var targElement=elInfo.id.split("_");
	if(targElement[0]=="b"){
		if(elementValue.length<6){
			document.getElementById("bError").innerHTML=elInfo.name+" is too short";
			buyerObj.password=false;
			e.target.focus();
			e.target.select();
					}
		else if(!elementValue.match(/([a-zA-z\d@!$#^&*%~]+)/)){
			document.getElementById("bError").innerHTML=elInfo.name+" is not valid";
			buyerObj.password=false;
			e.target.focus();
			e.target.select();
	}
	else{
		document.getElementById("bError").innerHTML="";
		buyerObj.password=true;
	}
	buyerBtnEnable(targElement[0]);
	}
	else{
		if(elementValue.length<6){
		document.getElementById("dError").innerHTML=elInfo.name+" is too short";
		buyerObj.password=false;
		e.target.focus();
		e.target.select();
		}
		else if(!elementValue.match(/([a-zA-z\d@!$#^&*%~]+)/)){
		document.getElementById("dError").innerHTML=elInfo.name+" is not valid";
		buyerObj.password=false;
		e.target.focus();
		e.target.select();
	}
	else{
		document.getElementById("dError").innerHTML="";
		buyerObj.password=true;
	}
	buyerBtnEnable(targElement[0]);
	}
}
function checkValidity(e){
	var unwantedStrings=[">","<","'","?","\\","(",")","{","}","[","]","%","#","\""];
	var elInfo=obj(e);
	var targElement=elInfo.id.split("_");
	var elementValue=elInfo.value;
	for(var valIndex=0;valIndex<elementValue.length;valIndex++){
		var returnValue=unwantedStrings.indexOf(elementValue[valIndex]);
		if(returnValue>=0){
			if(targElement[0]=="b"){
				document.getElementById("bError").innerHTML=elInfo.name+" is not valid";
				e.target.focus();
				e.target.select();
			}
			else{
				document.getElementById("dError").innerHTML=elInfo.name+" is not valid";
				e.target.focus();
				e.target.select();
			}
			buyerObj.valid=false;
		}
		else{
			if(targElement[0]=="b"){
			document.getElementById("bError").innerHTML="";
		}
		else{
			document.getElementById("dError").innerHTML="";
		}
		}
	}
	
	if(!elementValue.match(/[a-zA-Z\s]+/)){
		if(targElement[0]=="b"){
			document.getElementById("bError").innerHTML=elInfo.name+" is not valid";
			e.target.focus();
			e.target.select();
		}
		else{
			document.getElementById("dError").innerHTML=elInfo.name+" is not valid";
			e.target.focus();
			e.target.select();
		}
		
		buyerObj.valid=false;
	}
	else if(elementValue.length<3){
		if(targElement[0]=="b"){
			document.getElementById("bError").innerHTML=elInfo.name+" is too short";
			e.target.focus();
			e.target.select();
		}
		else{
			document.getElementById("dError").innerHTML=elInfo.name+" is too short";
			e.target.focus();
			e.target.select();
		}
		
		buyerObj.valid=false;
	}
	else{
		buyerObj.valid=true;
		if(targElement[0]=="b"){
			document.getElementById("bError").innerHTML="";
		}
		else{
			document.getElementById("dError").innerHTML="";
		}
		
	}
	buyerBtnEnable(targElement[0]);
}
function checkEmpty(e){
	var elInfo=obj(e);
	var elementValue=elInfo.value;
	var targElement=elInfo.id.split("_");
	if(elementValue==""){
		if(targElement[0]=="b"){
			document.getElementById("bError").innerHTML=elInfo.name+" is empty";
			e.target.focus();
			e.target.select();
		}
		else{
			document.getElementById("dError").innerHTML=elInfo.name+" is empty";
			e.target.focus();
			e.target.select();
		}
		buyerObj.empty=false;
	}
	else{
		if(targElement[0]=="b"){
			document.getElementById("bError").innerHTML="";
		}
		else{
			document.getElementById("dError").innerHTML="";
		}
		buyerObj.empty=true;
	}
	buyerBtnEnable(targElement[0]);
}

function buyerBtnEnable(btn){
	for(var x in buyerObj){
		if(!buyerObj[x]){
			if(btn=="b"){
				var bBtn=document.getElementById("b_btn");
				bBtn.disabled=true;
	}
	else{
		var dBtn=document.getElementById("d_btn");
		dBtn.disabled=true;
	}
	return;
		}
	}
	if(btn=="b"){
		//alert("i got b");
		var bBtn=document.getElementById("b_btn");
		bBtn.disabled=false;
	}
	else{
		//alert("i got d");
		var dBtn=document.getElementById("d_btn");
		dBtn.disabled=false;
	}
}
function displayLink(){
	var ul=document.getElementById("linkHolder");
	ul.classList.toggle('toggle');
}