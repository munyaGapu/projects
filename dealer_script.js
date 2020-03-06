window.onload=function(){
	var addLink=document.getElementById("add");
	var editLink=document.getElementById("edit");
	var removeLink=document.getElementById("remove");
	var bars=document.getElementById("opt");
	var transaction=document.getElementById("transaction");
	var completedTrans=document.getElementById("completedTransaction");
	var homeLink=document.getElementById("home");
	var notCompleted=document.getElementById("notCompletedTransaction");
	homeLink.onclick=dealerAnalytics;
	bars.onclick=displayLink;
	addLink.onclick=addCars;
	editLink.onclick=editCars;
	removeLink.onclick=removeCars;
	transaction.onclick=viewTransaction;
	completedTrans.onclick=viewCompletedTransaction;
	notCompleted.onclick=viewNotCompletedTransaction;
	dealerAnalytics();
	verify();
	
}
function viewNotCompletedTransaction(){
	var request=req();
	request.open("GET","view_transaction.php?notComplete=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			assignSearchElements()
					}
	}
	request.send(null);
}
function viewCompletedTransaction(){
	var request=req();
	request.open("GET","view_transaction.php?complete=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			assignSearchElements()
					}
	}
	request.send(null);
	
}
function viewTransaction(){
	var request=req();
	request.open("GET","view_transaction.php?trans=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			assignSearchElements()
					}
	}
	request.send(null);
	
}
function assignSearchElements(){
	var dateEl1=document.getElementById("dt1");
	var dateEl2=document.getElementById("dt2");
	var nameEl=document.getElementById("name");
	var searchBtn=document.getElementById("searchBtn");
	if(dateEl1!=null && dateEl2!=null && nameEl!=null && searchBtn!=null){
		searchBtn.onclick=searchTransactions;
	}
}
function searchTransactions(){
	var dateEl1=document.getElementById("dt1").value;
	var dateEl2=document.getElementById("dt2").value;
	var nameEl=document.getElementById("name").value;
	var status=document.getElementById("transStatus");
	var searchBtn=document.getElementById("searchBtn");
	if(dateEl1!="" &&  dateEl2!="" && nameEl!=""){
		if(status!=null){
			var transStatus=status.value;
			var data="dt1="+dateEl1+"&dt2="+dateEl2+"&buyername="+escape(nameEl)+"&transStatus="+transStatus;	
		}
		else{
			var data="dt1="+dateEl1+"&dt2="+dateEl2+"&buyername="+escape(nameEl);
		}
		
		var request=req();
		document.getElementById("error").innerHTML="please wait....";
		searchBtn.disabled=true;
		request.open("POST","view_transaction.php",true);
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				document.getElementById("main").innerHTML=request.responseText;
				assignSearchElements()
				document.getElementById("error").innerHTML="";
				searchBtn.disabled=false;
			}
				
			
		}
		request.send(data);
	}
	else if(dateEl1=="" &&  dateEl2=="" && nameEl!=""){
		document.getElementById("error").innerHTML="please wait....";
		searchBtn.disabled=true;
		if(status!=null){
			var transStatus=status.value;
			var data="buyername="+escape(nameEl)+"&transStatus="+transStatus;	
		}
		else{
			var data="buyername="+escape(nameEl);
		}
		var request=req();
		request.open("POST","view_transaction.php",true);
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				document.getElementById("main").innerHTML=request.responseText;
				assignSearchElements()
				document.getElementById("error").innerHTML="";
				searchBtn.disabled=false;
				
			}
				
			
		}
		request.send(data);
	}
	else if(dateEl1!="" &&  dateEl2!="" && nameEl==""){
		document.getElementById("error").innerHTML="please wait....";
		searchBtn.disabled=true;
		if(status!=null){
			var transStatus=status.value;
			var data="dt1="+dateEl1+"&dt2="+dateEl2+"&transStatus="+transStatus;	
		}
		else{
			var data="dt1="+dateEl1+"&dt2="+dateEl2;
		}
		var request=req();
		request.open("POST","view_transaction.php",true);
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				document.getElementById("main").innerHTML=request.responseText;
				assignSearchElements();
				document.getElementById("error").innerHTML="";
				searchBtn.disabled=false;
				
			}
				
			
		}
		request.send(data);
	}
	else{
		document.getElementById("error").innerHTML="fill the fields correctly";
	}
	
}
function verify(){
	var request=req();
	request.open("GET","verify.php?verify=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			var verifyDivHolder=document.getElementById("mainNav");
			var checkDiv=verifyDivHolder.getElementsByTagName("div");
			for(var y=0;y<checkDiv.length;y++){
				var currentItem=checkDiv[y];
				if(currentItem.id=="verifyDiv"){
					var elId=currentItem.id;
					var elRef=document.getElementById(elId);
					elRef.parentNode.removeChild(elRef);
				}
			}
			//alert(request.responseText);
			var reply=JSON.parse(request.responseText);
			var verifyDiv=document.createElement("div");
			verifyDiv.setAttribute('id','verifyDiv');
			
			document.getElementById("mainNav").appendChild(verifyDiv);
			
			if(reply.hasOwnProperty('error')){
				
				verifyDiv.innerHTML=reply.error;
				verifyDiv.classList.add('notVerified');
			}
			else if(reply.hasOwnProperty('missing')){
				verifyDiv.innerHTML=reply.missing;
				verifyDiv.onclick=displayVerificationPage;
				verifyDiv.classList.add('notVerified');
			}
			else{
				var status=parseInt(reply.stat);
				if(status==0){
					verifyDiv.innerHTML="Verification In Progress";
					verifyDiv.classList.add('verifyProgress');
				}
				else if(status==1){
					verifyDiv.innerHTML="Verified";
					verifyDiv.classList.add('verified');
				}
				else{
					verifyDiv.innerHTML="Rejected, Try again";
					verifyDiv.classList.add('notVerified');
					verifyDiv.onclick=displayVerificationPage;
				}
			}
		}
	}
	request.send(null);
}
function displayVerificationPage(){
	var request=req();
	request.open("GET","verify_upload.php?upload=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			var infoP=document.getElementById("info");
			infoP.onclick=displayVerifyInfo;
			var btn=document.getElementById("saveVerify");
			btn.onclick=saveVerifyDetails;
		}
	}
	request.send(null);
}
function saveVerifyDetails(){
	
	var kyc=document.getElementById("kyc").files[0];
	var dPic=document.getElementById("dealerPic").files[0];
	var dDoc=document.getElementById("dealerDoc").files[0];
	var btn=document.getElementById("saveVerify");
	var personal=[dPic,dDoc];
	var kycArray=['pdf','docx'];
	var picArray=['jpeg','jpg'];
	var objArray=[kyc,dPic,dDoc];
	for(var x=0;x<objArray.length;x++){
		if(objArray[x]==undefined || objArray[x]==null){
			document.getElementById("verifyError").innerHTML="All fields are compulsory";
			return;
		}
	}
	var kycNameArray=kyc.name.split(".");
	var kycSize=kyc.size;
	var kycExt=kycNameArray[1];
	if(kycArray.indexOf(kycExt)<0){
		document.getElementById("verifyError").innerHTML="Kyc document must be a pdf document";
			return;
	}
	else{
		document.getElementById("verifyError").innerHTML="";
	}
	if(kycSize>5000000){
		document.getElementById("verifyError").innerHTML="Make sure all files are less than 5mb";
			return;
	}
	else{
		document.getElementById("verifyError").innerHTML="";
	}
	for(var i=0;i<personal.length;i++){
		var personalArray=personal[i].name.split(".");
		var personalExt=personalArray[1];
		var personalSize=personal[i].size;
		if(picArray.indexOf(personalExt)<0){
			document.getElementById("verifyError").innerHTML="Second and third fields accept jpg or jpeg files";
			return;
		}
		if(personalSize>5000000){
			document.getElementById("verifyError").innerHTML="Make sure all files are less than 5mb";
			return;
		}
	}
	document.getElementById("verifyError").innerHTML="";
	var request=req();
	var fd=new FormData();
	fd.append('kyc',kyc);
	fd.append('dPic',dPic);
	fd.append('dDoc',dDoc);
	request.open("POST","verifyDealer.php",true);
	btn.disabled=true;
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			if(request.responseText=="ok"){
				btn.disabled=true;
				document.getElementById("verifyError").innerHTML="Your documents are being reviewed";
				setTimeout(dealerAnalytics(),10000);
				verify();
			}
			else{
				btn.disabled=false;
				document.getElementById("verifyError").innerHTML=request.responseText;
			}
		}
	}
	request.send(fd);
}
function displayVerifyInfo(){
	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	document.getElementById("mainHeader").appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	var h3=document.createElement("h3");
	h3.innerHTML="What To Do: ";
	//var h3Text=document.createTextNode("Update Stock");
	subCover.appendChild(h3);
	var p1=document.createElement("p");
	subCover.appendChild(p1);
	p1.innerHTML="To be successfully verified you need to scan your kyc documents into one scanned document and upload it on the first field. Secondly take a photo of yourself holding the kyc document and upload it on the second field. Thirdly take a photo of your passport or id, make sure that your face is clearly visible and also your id number, name, surname. Make sure the edges of the id/passport are visible. Thanks For Your Patience.";
	
	var img=document.createElement("img");
	img.setAttribute('id','closeMain');
	img.setAttribute('src','pics/change2.jpg');
	img.onclick=removeMainCover;
	mainCover.appendChild(img);
}
function displayTransaction(){
	var transId="transId="+this.id;
	var request=req();
	request.open("POST","transactionDetail.php",true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			var backTd=document.getElementById("backHome");
			backTd.onclick=dealerAnalytics;
		}
	}
	request.send(transId);
}
function dealerAnalytics(){
	var request=req();
	request.open("GET","dealerAnalytics.php?analytics=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			var purchasesP=document.getElementById("purchases").getElementsByTagName("p");
			if(purchasesP!=null || purchasesP!=undefined){
				for(var x=0;x<purchasesP.length;x++){
					purchasesP[x].onclick=displayTransaction;
					
					}
					var periodicSales=document.getElementById("dateDisplay");
					if(periodicSales!=null){
						periodicSales.onclick=displayPeriod;
					}
						}
						var stockP=document.getElementById("stock").getElementsByTagName("p");
						if(stockP!=null || stockP!=undefined){
							for(var i=0;i<stockP.length;i++){
								stockP[i].onclick=editQuantity;
							}
						}
						
					}
	            }
	request.send(null);
	
}
function displayPeriod(){
	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	document.getElementById("mainHeader").appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	var h3=document.createElement("h3");
	h3.innerHTML="Enter Sales Period";
	//var h3Text=document.createTextNode("Update Stock");
	subCover.appendChild(h3);
	var pError=document.createElement("p");
	pError.setAttribute('id','error');
	subCover.appendChild(pError);
	
	var img=document.createElement("img");
	img.setAttribute('id','closeMain');
	img.setAttribute('src','pics/change2.jpg');
	img.onclick=removeMainCover;
	mainCover.appendChild(img);
	var labeldate1=document.createElement("label");
	var labeldate1Text=document.createTextNode("From");
	labeldate1.appendChild(labeldate1Text);
	
	var date1=document.createElement("input");
	date1.setAttribute("type","date");
	date1.setAttribute("id","date1");
	subCover.appendChild(labeldate1);
	subCover.appendChild(date1);
	
	var labeldate2=document.createElement("label");
	var labeldate2Text=document.createTextNode("To");
	labeldate2.appendChild(labeldate2Text);
	
	var date2=document.createElement("input");
	date2.setAttribute("type","date");
	date2.setAttribute("id","date2");
	subCover.appendChild(labeldate2);
	subCover.appendChild(date2);
	
	var searchBtn=document.createElement("input");
	searchBtn.setAttribute("type","button");
	searchBtn.setAttribute("id","salesPeriod");
	searchBtn.setAttribute("value","Search");
	handler(searchBtn,"click",displayPeriodicSales);
	subCover.appendChild(searchBtn);
}

function displayPeriodicSales(){
	var dt1=document.getElementById("date1").value;
	var dt2=document.getElementById("date2").value;
	var errorP=document.getElementById("error");
	if(dt1=="" || dt2==""){
		errorP.innerHTML="Fill all fields";
		return;
	}
	var data="date1="+dt1+"&date2="+dt2;
	var request=req();
	request.open("POST","salesSearch.php",true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("purchases").innerHTML=request.responseText;
			//removeMainCover();
			var mainCover=document.getElementById("mainCover");
			mainCover.parentNode.removeChild(mainCover);
			var salesView=document.getElementById("dateDisplay");
			var backOverview=document.getElementById("backOverview");
			if(salesView!=null){
				salesView.onclick=displayPeriod;
			}
			backOverview.onclick=dealerAnalytics;
		}
	}
	request.send(data);
}
function editQuantity(){
	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	document.getElementById("mainHeader").appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	var h3=document.createElement("h3");
	h3.innerHTML="Update Stock";
	//var h3Text=document.createTextNode("Update Stock");
	subCover.appendChild(h3);
	var pError=document.createElement("p");
	pError.setAttribute('id','error');
	subCover.appendChild(pError);
	
	var img=document.createElement("img");
	img.setAttribute('id','closeMain');
	img.setAttribute('src','pics/change2.jpg');
	img.onclick=removeMainCover;
	mainCover.appendChild(img);
	var cId="id="+this.id;
	var carId=this.id;
	var request=req();
	request.open("POST","getQuantity.php",true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			var quantityObj=JSON.parse(request.responseText);
			if(quantityObj.hasOwnProperty('error')){
				var pErrorText=document.createTextNode(quantityObj.error);
				pError.appendChild(pErrorText);
			}
			else{
				var hiddenId=document.createElement("input");
				hiddenId.setAttribute('type','hidden');
				hiddenId.setAttribute('value',carId);
				hiddenId.setAttribute('id','toUpdate');
				var inputQty=document.createElement("input");
				inputQty.setAttribute('type','number');
				inputQty.setAttribute('id','quantity');
				inputQty.setAttribute('min',0);
				inputQty.setAttribute('value',quantityObj.quantity);
				var btn=document.createElement("input");
				btn.setAttribute('type','button');
				btn.setAttribute('id','Update');
				btn.setAttribute('value','Save');
				btn.onclick=saveQuantity;
				var form=document.createElement("form");
				form.appendChild(hiddenId);
				form.appendChild(inputQty);
				form.appendChild(btn);
				subCover.appendChild(form);
			}
		}
	}
	request.send(cId);
	
	
}
function saveQuantity(){
	var carId=document.getElementById("toUpdate").value;
	var qty=document.getElementById("quantity").value;
	var request=req();
	var data="carId="+carId+"&qty="+qty;
	request.open("POST","saveQuantity.php",true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			if(request.responseText=="ok"){
				document.getElementById("error").innerHTML="Updated!";
				setTimeout(function(){
					var img=document.getElementById("closeMain");
					img.click();
					dealerAnalytics();
				},1000);
			}
			
		}
		
	}
	request.send(data);
	//alert(carId);
}
function displayLink(){
	var ul=document.getElementById("linkHolder");
	ul.classList.toggle('toggle');
}
function removeCars(){
	var id=this.id;
	var filename=id+"car.php?remove=1";
	var request=req();
	//alert(filename);
	if(request!=null){
		request.open("GET",filename,true);
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				document.getElementById("main").innerHTML=request.responseText;
				var imgArray=document.getElementById("main").getElementsByClassName("cars");
				if(imgArray!=null || imgArray!=undefined){
					for(var x=0;x<imgArray.length;x++){
						imgArray[x].onclick=displayCarToDelete;
					}
				}
			}
		}
		request.send(null);
	}
	else{
		alert("Your browser does not support asynchronous requests");
	}
}
function displayCarToDelete(e){
	var elInfo=obj(e);
	if(elInfo.tagName.toLowerCase()=="img"){
		var carId=elInfo.id;
		var request=req();
		var data="carId="+carId;
		request.open("POST","carDetails.php",true);
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				var carDetailsObj=JSON.parse(request.responseText);
				var mainCover=document.createElement("div");
				mainCover.setAttribute('id','mainCover');
				document.getElementById("mainHeader").appendChild(mainCover);
				var subCover=document.createElement("div");
				subCover.setAttribute('id','subCover');
				mainCover.appendChild(subCover);
				var img=document.createElement("img");
				img.setAttribute('src','pics/change2.jpg');
				img.setAttribute('id','deleteCarImg');
				img.onclick=removeMainCover;
				mainCover.appendChild(img);
				var p=document.createElement("p");
				subCover.appendChild(p);
				if(carDetailsObj.hasOwnProperty("error")){
					var pText=document.createTextNode(carDetailsObj.error);
					p.appendChild(pText);
					return;
				}
				var pText=document.createTextNode("Are you sure you want to delete "+carDetailsObj.type.toUpperCase()+" "+carDetailsObj.model.toUpperCase());
				p.appendChild(pText);
				p.setAttribute('id','carDeleteNotif');
				var hiddenId=document.createElement("input");
				hiddenId.setAttribute('type','hidden');
				hiddenId.setAttribute('value',carId);
				hiddenId.setAttribute('id','deleteId');
				subCover.appendChild(hiddenId);
				var btn=document.createElement("input");
				btn.setAttribute('type','button');
				btn.setAttribute('value','Delete');
				btn.setAttribute('id','deleteCarBtn');
				btn.onclick=sendDeleteRequest;
				subCover.appendChild(btn);
				
			}
			
		}
		request.send(data);
		
	}
		else{
		return;
	}
}
function sendDeleteRequest(){
	var carId=document.getElementById("deleteId").value;
	var request=req();
	var data="carId="+carId;
	var deleteP=document.getElementById("carDeleteNotif");
	deleteP.innerHTML="Please Wait...";
	document.getElementById("deleteCarBtn").disabled=true;
	request.open("POST","deleteCar.php",true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("deleteCarBtn").disabled=false;
			if(request.responseText=="ok"){
				var img=document.getElementById("deleteCarImg");
				img.click();
				var removeLink=document.getElementById("remove");
				removeLink.click();
			}
			else{
				deleteP.innerHTML=request.responseText;
			}
		}
	}
	request.send(data);
}
function editCars(){
	var id=this.id;
	var filename=id+"car.php?edit=1";
	var request=req();
	//alert(filename);
	if(request!=null){
		request.open("GET",filename,true);
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				document.getElementById("main").innerHTML=request.responseText;
				var imgArray=document.getElementById("main").getElementsByClassName("cars");
				if(imgArray!=null || imgArray!=undefined){
					for(var x=0;x<imgArray.length;x++){
						imgArray[x].onclick=displayCar;
					}
				}
			}
		}
		request.send(null);
	}
	else{
		alert("Your browser does not support asynchronous requests");
	}
}
function displayCar(e){
	var elInfo=obj(e);
	if(elInfo.tagName.toLowerCase()=="img"){
		var carId=elInfo.id;
		var request=req();
		var data="carId="+carId;
		request.open("POST","displayeditcar.php",true);
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				if(request.responseText!='not set'){
					editObj=JSON.parse(request.responseText);
					var state;
					if(editObj.state==1){
						state="New";
					}
					else{
						state="Second Hand";
					}
					var main=document.getElementById("main");
					while(main.firstChild){
						main.removeChild(main.firstChild);
					}
					var table=document.createElement("div");
					table.setAttribute('id','tb1');
					var rowPoster=document.createElement("div");
					rowPoster.setAttribute('class','tb_r1');
					var pPoster=document.createElement("p");
					var pPoster2=document.createElement("p");
					var pPosterText=document.createTextNode("Poster:");
					var imgPoster=document.createElement("img");
					imgPoster.setAttribute('src','dealers/'+editObj.dealer+'/'+editObj.poster);
					imgPoster.setAttribute('id','poster');
					pPoster.appendChild(pPosterText);
					pPoster2.appendChild(imgPoster);
					pPoster2.setAttribute('class','imageEdit');
					main.appendChild(table);
					table.appendChild(rowPoster);
					rowPoster.appendChild(pPoster);
					rowPoster.appendChild(pPoster2);
					
					var rowFront=document.createElement("div");
					rowFront.setAttribute('class','tb_r1');
					var pFront=document.createElement("p");
					var pFront2=document.createElement("p");
					var pFrontText=document.createTextNode("Front View:");
					var imgFront=document.createElement("img");
					imgFront.setAttribute('src','dealers/'+editObj.dealer+'/'+editObj.front);
					imgFront.setAttribute('id','front');
					pFront.appendChild(pFrontText);
					pFront2.appendChild(imgFront);
					pFront2.setAttribute('class','imageEdit');
					rowFront.appendChild(pFront);
					rowFront.appendChild(pFront2);
					table.appendChild(rowFront);
					
					var rowSide=document.createElement("div");
					rowSide.setAttribute('class','tb_r1');
					var pSide=document.createElement("p");
					var pSide2=document.createElement("p");
					var pSideText=document.createTextNode("Side View:");
					var imgSide=document.createElement("img");
					imgSide.setAttribute('src','dealers/'+editObj.dealer+'/'+editObj.side);
					imgSide.setAttribute('id','side');
					pSide.appendChild(pSideText);
					pSide2.appendChild(imgSide);
					pSide2.setAttribute('class','imageEdit');
					rowSide.appendChild(pSide);
					rowSide.appendChild(pSide2);
					table.appendChild(rowSide);
					
					var rowBack=document.createElement("div");
					rowBack.setAttribute('class','tb_r1');
					var pBack=document.createElement("p");
					var pBack2=document.createElement("p");
					var pBackText=document.createTextNode("Back View:");
					var imgBack=document.createElement("img");
					imgBack.setAttribute('src','dealers/'+editObj.dealer+'/'+editObj.backview);
					imgBack.setAttribute('id','back');
					pBack.appendChild(pBackText);
					pBack2.appendChild(imgBack);
					pBack2.setAttribute('class','imageEdit');
					rowBack.appendChild(pBack);
					rowBack.appendChild(pBack2);
					table.appendChild(rowBack);
					
					var rowIn=document.createElement("div");
					rowIn.setAttribute('class','tb_r1');
					var pIn=document.createElement("p");
					var pIn2=document.createElement("p");
					var pInText=document.createTextNode("Inside View:");
					var imgIn=document.createElement("img");
					imgIn.setAttribute('src','dealers/'+editObj.dealer+'/'+editObj.inside);
					imgIn.setAttribute('id','inside');
					pIn.appendChild(pInText);
					pIn2.appendChild(imgIn);
					pIn2.setAttribute('class','imageEdit');
					rowIn.appendChild(pIn);
					rowIn.appendChild(pIn2);
					table.appendChild(rowIn);
					
					var rowDetails=document.createElement("div");
					rowDetails.setAttribute('class','tb_r1');
					var pDetails=document.createElement("p");
					var pDetails2=document.createElement("p");
					var pDetailsText=document.createTextNode("Type: "+editObj.type);
					var pDetailsText2=document.createTextNode("Model: "+editObj.model);
					pDetails.appendChild(pDetailsText);
					pDetails2.appendChild(pDetailsText2);
					rowDetails.appendChild(pDetails);
					rowDetails.appendChild(pDetails2);
					/*var pDetails3=document.createElement("p");
					var pDetails4=document.createElement("p");
					var pDetailsText3=document.createTextNode("State: "+state);
					var pDetailsText4=document.createTextNode("Price: $"+editObj.price);
					var pDetails5=document.createElement("p");*/
					//var pDetailsText5=document.createTextNode("Description: "+editObj.desc.substr(0,7));
					var pDetails6=document.createElement("p");
					var pDetailsText6=document.createTextNode("MORE");
					pDetails6.setAttribute('id','details');
					pDetails6.onclick=displayProductModal;
					pDetails6.appendChild(pDetailsText6);
					rowDetails.appendChild(pDetails6);
					table.appendChild(rowDetails);
					addClickToImg();
					
					
				}
				else{
					return;
				}
				
			}
		}
		request.send(data);
		//alert(carId);
	}
	else{
		return;
	}
	
	
	
}
function addClickToImg(){
	var arrayImg=document.getElementById("tb1").getElementsByTagName("img");
	if(arrayImg!=null || arrayImg!=undefined){
		for(var y=0;y<arrayImg.length;y++){
			arrayImg[y].onclick=displayProductModal;
		}
	}
}
function displayProductModal(){
	var id=this.id;
	createModal(id);
}
function createModal(id){
	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	document.getElementById("mainHeader").appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	
	var img=document.createElement("img");
	img.setAttribute('id','closeMain');
	img.setAttribute('src','pics/change2.jpg');
	img.onclick=removeMainCover;
	mainCover.appendChild(img);
	if(id=="details"){
		guideUser={valid:false,empty:false};
		var pError=document.createElement("p");
		pError.setAttribute('id','error');
		subCover.appendChild(pError);
		
		var hiddenId=document.createElement("input");
		hiddenId.setAttribute('type','hidden');
		hiddenId.setAttribute('value',id);
		hiddenId.setAttribute('id','toUpdate');
		
		var hiddenToken=document.createElement("input");
		hiddenToken.setAttribute('type','hidden');
		hiddenToken.setAttribute('value',editObj.token);
		hiddenToken.setAttribute('id','token');
		
		var hiddenCarId=document.createElement("input");
		hiddenCarId.setAttribute('type','hidden');
		hiddenCarId.setAttribute('value',editObj.id);
		hiddenCarId.setAttribute('id','carId');
		
		var inputType=document.createElement("input");
		inputType.setAttribute('type','text');
		inputType.setAttribute('id','type');
		inputType.setAttribute('value',editObj.type);
		handler(inputType,"blur",emptyDetails);
		handler(inputType,"blur",validDetails);
		handler(inputType,"mouseover",displayToolTip);
		
		var inputModel=document.createElement("input");
		inputModel.setAttribute('type','text');
		inputModel.setAttribute('id','model');
		inputModel.setAttribute('value',editObj.model);
		handler(inputModel,"blur",emptyDetails);
		handler(inputModel,"blur",validDetails);
		handler(inputModel,"mouseover",displayToolTip);
		
		var inputPrice=document.createElement("input");
		inputPrice.setAttribute('type','number');
		inputPrice.setAttribute('id','price');
		inputPrice.setAttribute('value',editObj.price);
		handler(inputPrice,"blur",emptyDetails);
		handler(inputPrice,"mouseover",displayToolTip);
		
		var inputQty=document.createElement("input");
		inputQty.setAttribute('type','number');
		inputQty.setAttribute('id','quantity');
		inputQty.setAttribute('value',editObj.quantity);
		handler(inputQty,"blur",emptyDetails);
		handler(inputQty,"mouseover",displayToolTip);
		
		var trans=editObj.transmission;
		var carTransmission;
		if(trans=="a"){
			carTransmission="Auto";
		}
		else{
			carTransmission="Manual";
		}
		
		var inputTrans=document.createElement("input");
		inputTrans.setAttribute('type','text');
		inputTrans.setAttribute('id','transmission');
		inputTrans.setAttribute('value',carTransmission);
		handler(inputTrans,"blur",emptyDetails);
		handler(inputTrans,"blur",validDetails);
		handler(inputTrans,"mouseover",displayToolTip);
		
		var inputCap=document.createElement("input");
		inputCap.setAttribute('type','number');
		inputCap.setAttribute('id','capacity');
		inputCap.setAttribute('value',editObj.capacity);
		handler(inputCap,"blur",emptyDetails);
		handler(inputCap,"mouseover",displayToolTip);
		
		var inputM=document.createElement("input");
		inputM.setAttribute('type','number');
		inputM.setAttribute('id','mileage');
		inputM.setAttribute('value',editObj.mileage);
		handler(inputM,"blur",emptyDetails);
		handler(inputM,"mouseover",displayToolTip);
		
		var inputDesc=document.createElement("textarea");
		inputDesc.setAttribute('id','description');
		inputDesc.value=editObj.desc;
		handler(inputDesc,"keyup",emptyDetails);
		handler(inputDesc,"keyup",validDetails);
		handler(inputDesc,"mouseover",displayToolTip);
		
		var btn=document.createElement("input");
		btn.setAttribute('type','button');
		btn.setAttribute('id','sendDetails');
		btn.setAttribute('value','Save');
		btn.setAttribute('disabled','disabled');
		btn.onclick=saveDetails;
		
		var form=document.createElement("form");
		form.appendChild(hiddenId);
		form.appendChild(hiddenCarId);
		form.appendChild(hiddenToken);
		form.appendChild(inputType);
		form.appendChild(inputModel);
		form.appendChild(inputTrans);
		form.appendChild(inputCap);
		form.appendChild(inputM);
		form.appendChild(inputPrice);
		form.appendChild(inputQty);
		form.appendChild(inputDesc);
		form.appendChild(btn);
		subCover.appendChild(form);
	}
	else{
		var pError=document.createElement("p");
		pError.setAttribute('id','error');
		subCover.appendChild(pError);
		
		var hiddenId=document.createElement("input");
		hiddenId.setAttribute('type','hidden');
		hiddenId.setAttribute('value',id);
		hiddenId.setAttribute('id','toUpdate');
		
		var hiddenCarId=document.createElement("input");
		hiddenCarId.setAttribute('type','hidden');
		hiddenCarId.setAttribute('value',editObj.id);
		hiddenCarId.setAttribute('id','carId');
		
		var inputFile=document.createElement("input");
		inputFile.setAttribute('type','file');
		inputFile.setAttribute('id','pic');
		
		var btn=document.createElement("input");
		btn.setAttribute('type','button');
		btn.setAttribute('id','sendPic');
		btn.setAttribute('value','Upload');
		btn.onclick=savePicture;
		
		var form=document.createElement("form");
		form.setAttribute('enctype','multipart/form-data');
		form.appendChild(hiddenId);
		form.appendChild(hiddenCarId);
		form.appendChild(inputFile);
		form.appendChild(btn);
		subCover.appendChild(form);
	}
	
}
function displayToolTip(e){
	var elInfo=obj(e);
	var elId=elInfo.id;
	var fieldName=document.getElementById("inputIdentifier");
	if(fieldName==null){
		var inputIdentifier=document.createElement("div");
		inputIdentifier.setAttribute('id','inputIdentifier');
		inputIdentifier.innerHTML=elId+" field";
		document.getElementById("mainCover").appendChild(inputIdentifier);
		setTimeout(function(){
			var elToRemove=document.getElementById("inputIdentifier");
			if(elToRemove!=null){
				elToRemove.parentNode.removeChild(elToRemove);
			}
		},2000);
	}
	else{
		fieldName.innerHTML=elId+" field";
		setTimeout(function(){
			var elToRemove=document.getElementById("inputIdentifier");
			if(elToRemove!=null){
				elToRemove.parentNode.removeChild(elToRemove);
			}
		},2000);
	}
}
function emptyDetails(e){
	var elInfo=obj(e);
	var elValue=elInfo.value;
	var theP=document.getElementById("error");
	if(elValue==""){
		guideUser.empty=false;
		theP.innerHTML=elInfo.id+" is empty";
		elInfo.focus();
	}
	else{
		theP.innerHTML="";
		guideUser.empty=true;
	}
	monitorDetails();
}
function validDetails(e){
	var theP=document.getElementById("error");
	var elInfo=obj(e);
	var elValue=elInfo.value;
	var invalidChars=['~','`','!','@','#','$','%','^','&','*','(',')',',','<','>','"','\\','|','{','}','[',']',':',';','/','-','='];
	for(var x=0;x<elValue.length;x++){
		if(invalidChars.indexOf(elValue[x])>=0){
			guideUser.valid=false;
			theP.innerHTML=elInfo.id+" is invalid";
			elInfo.focus();
			return;
		}
	}
	if(elValue.match(/^[a-zA-Z\s\d]+/)){
		theP.innerHTML="";
		guideUser.valid=true;
	}
	else{
		guideUser.valid=false;
		theP.innerHTML=elInfo.id+" is empty";
		elInfo.focus();
	}
	monitorDetails();
}
function monitorDetails(){
	var theBtn=document.getElementById("sendDetails");
	for(var x in guideUser){
		if(!guideUser[x]){
			theBtn.disabled=true;
			return;
		}
	}
	theBtn.disabled=false;
}
function saveDetails(){
	var toUpdate=document.getElementById("toUpdate").value;
	var type=document.getElementById("type").value;
	var model=document.getElementById("model").value;
	var price=document.getElementById("price").value;
	var qty=document.getElementById("quantity").value;
	var desc=document.getElementById("description").value;
	var carId=document.getElementById("carId").value;
	var theP=document.getElementById("error");
	var token=document.getElementById("token").value;
	var data="toUpdate="+toUpdate+"&type="+escape(type)+"&model="+escape(model)+"&price="+price+"&quantity="+qty+"&desc="+escape(desc)+"&carId="+carId+"&token="+token;
	var request=req();
	theP.innerHTML="Please Wait....";
	request.open("POST","updateCarDetails.php",true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			theP.innerHTML=request.responseText;
		}
	}
	request.send(data);
}
function savePicture(){
	var theP=document.getElementById("error");
	var toUpdate=document.getElementById("toUpdate").value;
	var carId=document.getElementById("carId").value;
	var pics=document.getElementById("pic").files[0];
	var fd=new FormData();
	var extArray=['jpg','jpeg','png','gif'];
	if(pics!=undefined){
		var size=pics.size;
		var picArray=pics.name.split(".");
		var picExt=picArray[1];
	if(extArray.indexOf(picExt)>=0){
		if(size<=10000000){
		var request=req();
		theP.innerHTML="Please Wait....";
		fd.append('picType',toUpdate);
		fd.append('file',pics);
		fd.append('picCarId',carId);
		request.open("POST","updateCars.php",true);
		request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			var serverObj=JSON.parse(request.responseText);
			if(typeof(serverObj.error==undefined)){
				var dealerName=serverObj.dealer;
				var picName=serverObj.pic;
				var picType=serverObj.picType;
				var path="dealers/"+dealerName+"/"+picName;
				var imgToChange=document.getElementById(picType);
				imgToChange.src=path;
				theP.innerHTML=serverObj.result;
			}
			else{
				theP.innerHTML=serverObj.error;
			}
			
		}
	}
	request.send(fd);
		}
		else{
			theP.innerHTML="File Is Too Big, should be 10mb or less";
			return;
		}
	}
	else{
		theP.innerHTML="File Type Is Not Allowed";
		return;
	}
	}
	else{
		theP.innerHTML="Choose a File";
		return;
	}
	
}
function removeMainCover(e){
	var elInfo=obj(e);
	var elId=elInfo.parentNode.id;
	var parent=document.getElementById(elId);
	parent.parentNode.removeChild(parent);
}
function addCars(){
	vault={valid:false,empty:false};
	var id =this.id;
	var filename=id+"car.php?add=1";
	var request=req();
	if(request!=null){
		//alert("am here "+filename);
		request.open("GET",filename,true);
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				document.getElementById("main").innerHTML=request.responseText;
				var error=document.getElementById("error");
				var model=document.getElementById("carmodel");
				var type=document.getElementById("cartype");
				var desc=document.getElementById("cardesc");
				var price=document.getElementById("carprice");
				var state=document.getElementById("carstate");
				var quantity=document.getElementById("carquantity");
				var carColors=document.getElementById("carColors");
				var mileage=document.getElementById("mileage");
				var transmission=document.getElementById("trans");
				var capacity=document.getElementById("capacity");
				var poster=document.getElementById("carposter");
				var front=document.getElementById("carfront");
				var carback=document.getElementById("carback");
				var side=document.getElementById("carside");
				var inside=document.getElementById("carinside");
				var addbtn=document.getElementById("addit");
				handler(model,"blur",checkEmpty);
				handler(model,"blur",checkValid);
				handler(type,"blur",checkEmpty);
				handler(type,"blur",checkValid);
				handler(desc,"blur",checkEmpty);
				handler(desc,"blur",checkValid);
				handler(price,"blur",checkEmpty);
				handler(quantity,"blur",checkEmpty);
				handler(quantity,"keyup",scrollDown);
				handler(carColors,"blur",checkColor);
				handler(mileage,"blur",checkEmpty);
				handler(transmission,"blur",checkEmpty);
				handler(capacity,"blur",checkEmpty);
				handler(carColors,"keyup",checkEmpty);
				handler(state,"blur",checkEmpty);
				addbtn.onclick=addData;
			}
		}
		request.send(null);
	}
	else{
		alert("Your browser does not support asynchronous request");
	}
}
function scrollDown(){
	var main=document.getElementById("main");
	main.scrollTop=main.scrollHeight;
}
function checkValid(e){
	var elInfo=obj(e);
	var elValue=elInfo.value;
	var invalidChars=['`','~','!','@','#','$','%','^','&','*','(',')','{','}','[',']','?','/','\\','|','<','>','"',':'];
	for(var x=0;x<elValue.length;x++){
		var currentChar=elValue[x];
		if(invalidChars.indexOf(currentChar)>=0){
			vault.valid=false;
			error.innerHTML=elInfo.name+" field is not valid";
			elInfo.focus();
			return;
		}
	}
	if(!elValue.match(/^[a-zA-z\s\d]+/)){
		vault.valid=false;
		error.innerHTML=elInfo.name+" field is not valid";
		elInfo.focus();
	}
	else{
		vault.valid=true;
		error.innerHTML="";
	}
	monitor();
}
function checkColor(e){
	var elInfo=obj(e);
	var elValue=elInfo.value;
	if(!elValue.match(/^[a-zA-z\s]+/)){
		vault.valid=false;
		error.innerHTML=elInfo.name+" field is not valid";
		main.scrollTop=0;
		elInfo.focus();
	}
	else{
		vault.valid=true;
		error.innerHTML="";
	}
	monitor();
	
}
function checkEmpty(e){
	var elInfo=obj(e);
	var elValue=elInfo.value;
	if(elValue==""){
		vault.empty=false;
		error.innerHTML=elInfo.name+" field is empty";
		elInfo.focus();
	}
	else{
		vault.empty=true;
		error.innerHTML="";
	}
	monitor();
}
function monitor(){
	var addbtn=document.getElementById("addit");
	for(var items in vault){
		if(!vault[items]){
			addbtn.disabled=true;
			return;
		}
	}
	addbtn.disabled=false;
}
function addData(e){
	//alert("ok");
	var main=document.getElementById("main");
	var error=document.getElementById("error");
	var model=document.getElementById("carmodel").value;
	var type=document.getElementById("cartype").value;
	var desc=document.getElementById("cardesc").value;
	var price=document.getElementById("carprice").value;
	var state=document.getElementById("carstate").value;
	var mileage=document.getElementById("mileage").value;
	var transmission=document.getElementById("trans").value;
	var capacity=document.getElementById("capacity").value;
	var quantity=document.getElementById("carquantity").value;
	var colors=document.getElementById("carColors").value;
	var token=document.getElementById("token").value;
	var poster=document.getElementById("carposter").files[0];
	var front=document.getElementById("carfront").files[0];
	var carback=document.getElementById("carback").files[0];
	var side=document.getElementById("carside").files[0];
	var inside=document.getElementById("carinside").files[0];
	var addbtn=document.getElementById("addit");
	if(model=="" || type=="" || desc=="" || price=="" || state=="" || mileage=="" || transmission=="" || capacity=="" || quantity==""){
		
		main.scrollTop=0;
		error.innerHTML="Fill out all fields";
		return;
	}
	var xhr=req();
	var fd=new FormData();
	var extensions=['png','jpg','jpeg']; 
	var picArray=[poster,front,carback,side,inside];
	for(var x=0;x<picArray.length;x++){
		var currentItem=picArray[x];
		if(currentItem!=undefined){
		var name=currentItem.name;
		var size=currentItem.size;
		var ext=name.split(".");
		var fileExt=ext[1];
		if(extensions.indexOf(fileExt)>=0){
			if(size<10000000){
				
				
			}
			else{
				main.scrollTop=0;
				error.innerHTML="File is too big";
				return;
		}
		}
		else{
			main.scrollTop=0;
			error.innerHTML="File type error";
			return;
		}
		}
		else{
			main.scrollTop=0;
			error.innerHTML="All pictures are needed!!";
			return;
		}
	}
	//console.log(model+" "+type+" "+desc+" "+price+" "+state+" "+quantity+" "+poster+" "+carback+" "+side+" "+inside);
	fd.append('model',model);
	fd.append('type',type);
	fd.append('desc',desc);
	fd.append('price',price);
	fd.append('state',state);
	fd.append('quantity',quantity);
	fd.append('colors',colors);
	fd.append('mileage',mileage);
	fd.append('transmission',transmission);
	fd.append('capacity',capacity);
	fd.append('token',token);
	fd.append('poster',poster);
	fd.append('front',front);
	fd.append('back',carback);
	fd.append('side',side);
	fd.append('inside',inside);
	addbtn.disabled=true;
	xhr.open("POST","processadd.php",true);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4 && xhr.status==200){
			if(xhr.responseText=="ok"){
				document.getElementById("main").scrollTop=0;
				error.innerHTML="Car(s) saved!";
				document.getElementById("carmodel").value="";
				document.getElementById("cartype").value="";
				document.getElementById("cardesc").value="";
				document.getElementById("carprice").value="";
				document.getElementById("carstate").value="";
				document.getElementById("carquantity").value="";
				document.getElementById("carColors").value="";
				
			}
			else{
				document.getElementById("main").scrollTop=0;
				error.innerHTML=xhr.responseText;
				addbtn.disabled=true;
			}
		}
	}
	xhr.send(fd);
}