window.onload=function(){
	var siteLogo=document.getElementById("logo");
	siteLogo.onclick=displayCarsToBuy;
	var filterLink=document.getElementById("filter");
	filterLink.onclick= displayFilters;
	var userStatus=req();
	goToPayNow=false;
	userStatus.open("GET","processcart.php?loginStatus=1",true);
	userStatus.onreadystatechange=function(){
		if(userStatus.readyState==4 && userStatus.status==200){
			if(userStatus.responseText=='ok'){
				var completePurchase=localStorage.getItem("resumeBuy");
				if(completePurchase){
					goToPayNow=true;
				}
			}
		}
		}
		userStatus.send(null);
		setTimeout(function(){
			if(goToPayNow){
			//alert("i can redirect");
			passKey();
			checkOutCars();
		}
		},1000);
		
		displayCarsToBuy();
	var about=document.getElementById("about");
	var contact=document.getElementById("contact");
	if(about!=null || contact!=null){
		
		about.onclick=displayAboutPage;
	    contact.onclick=displayContactPage;
	}
	var homeLink=document.getElementById("home");
	if(homeLink!=null){
		homeLink.onclick=displayCarsToBuy;
	}
	var bars=document.getElementById("opt");
	var bTransaction=document.getElementById("buyerTransaction");
	var bwishlist=document.getElementById("wishlist");
	if(bTransaction!=null && bwishlist!=null){
		bwishlist.onclick=displayWishlist;
		bTransaction.onclick=displayTransactionHistory;
	}
	bars.onclick=displayLink;
	var searchBar=document.getElementById("searchCar");
	searchBar.onkeypress=displayResult;
	cartAmount=0;
	
}
function displayTransactionHistory(e){
	//clearInterval(stopCartCheck);
	e.preventDefault();
	var request=req();
	request.open("GET","buyerTransHistory.php?history=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			var searchTransaction=document.getElementById("transHeader");
			var reviewModal=document.getElementsByClassName("histDealerName");
			if(reviewModal!=null || reviewModal!=undefined){
				for(var i=0;i<reviewModal.length;i++){
					var curP=reviewModal[i];
					curP.onclick=displayReviewModal;
				}
			}
			if(searchTransaction!=null){
				searchTransaction.onclick=displayPeriod;
			}
		}
		
	}
	request.send(null);
}
function displayReviewModal(e){
	var elInfo=obj(e);
	var elId=elInfo.id;

	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	document.getElementById("siteHeader").appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	var h3=document.createElement("h3");
	h3.innerHTML="Review The Dealer's Service To You";
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
	
	var txtarea=document.createElement("textarea");
	txtarea.setAttribute("id","reviewCont");
	txtarea.setAttribute("placeholder","Your feedback is important");
	txtarea.setAttribute("maxlength",199);
	handler(txtarea,"keyup",scanReview);
	subCover.appendChild(txtarea);
	
	var dealerId=document.createElement("input");
	dealerId.setAttribute("type","hidden");
	dealerId.setAttribute("id","dealerId");
	dealerId.setAttribute("value",elId);
	subCover.appendChild(dealerId);
	
	var searchBtn=document.createElement("input");
	searchBtn.setAttribute("type","button");
	searchBtn.setAttribute("id","sendReview");
	searchBtn.setAttribute("value","Submit");
	handler(searchBtn,"click",saveReview);
	subCover.appendChild(searchBtn);
}
function scanReview(e){
	var elInfo=obj(e);
	var elValue=elInfo.value;
	var invalidChars=['<','>','?',',','\\','{','}','[',']','(',')','!','`','~','@','#','$','\''];
	var invalidWords=['mboro','mhata','beche','dako','garo','jende','mheche','fuck','shit','Mboro','Mhata','Beche','Dako','Garo','Jende','Mheche','Fuck','Shit',
	'MBORO','MHATA','BECHE','DAKO','GARO','JENDE','MHECHE','FUCK','SHIT'];
		for(var x=0;x<elValue.length;x++){
			var currentChar=elValue[x];
			if(invalidChars.indexOf(currentChar)>=0){
				elInfo.focus();
				document.getElementById("sendReview").disabled=true;
				return;
			}
		}
		for(var y=0;y<invalidWords.length;y++){
			if(elValue.search(invalidWords[y])>=0){
				elInfo.focus();
				document.getElementById("sendReview").disabled=true;
				return;
			}
		}
		document.getElementById("sendReview").disabled=false;
	
}
function saveReview(){
	var reviewInput=document.getElementById("reviewCont").value;
	var dealerId=document.getElementById("dealerId").value;
	var errorP=document.getElementById("error");
	var request=req();
	if(request!=null){
		errorP.innerHTML="Please Wait...";
		document.getElementById("sendReview").disabled=true;
		var data="review="+escape(reviewInput)+"&dealerId="+dealerId;
		request.open("POST","saveReview.php",true);
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				document.getElementById("sendReview").disabled=false;
				if(request.responseText=="done"){
					errorP.innerHTML="Your Review Was Saved";
				}
				else{
					errorP.innerHTML=request.responseText;
				}
			}
		}
		request.send(data);
	}
	else{
		return;
	}

}
function displayPeriod(){
	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	document.getElementById("siteHeader").appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	var h3=document.createElement("h3");
	h3.innerHTML="Enter Period";
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
	handler(searchBtn,"click",TransHistorySearch);
	subCover.appendChild(searchBtn);
}
function TransHistorySearch(){
	var dt1=document.getElementById("date1").value;
	var dt2=document.getElementById("date2").value;
	var errorP=document.getElementById("error");
	var request=req();
	if(request!=null){
		var data="date1="+dt1+"&date2="+dt2;
		request.open("POST","buyerTransHistory.php",true);
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				document.getElementById("main").innerHTML=request.responseText;
			}
		}
		request.send(data);
	}
	else{
		//alert();
		return;
	}
}
function removeMainCover(e){
	var elInfo=obj(e);
	var elId=elInfo.parentNode.id;
	var parent=document.getElementById(elId);
	parent.parentNode.removeChild(parent);
}
function displayFilters(e){
	e.preventDefault();
	document.getElementById("secondLevelUl").className='hideLinkHolder';
	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	document.getElementById("siteHeader").appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	var img=document.createElement("img");
	img.setAttribute('src','pics/change2.jpg');
	mainCover.appendChild(img);
	img.onclick=removeMainImg;
	var request=req();
	request.open("GET","carCategory.php?category=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			subCover.innerHTML=request.responseText;
			var searchBtn=document.getElementById("searchFilterDiv");
			searchBtn.onclick=displaySearchedCars;
		}
	}
	request.send(null);
	
	
}

function displaySearchedCars(){
	var category=document.getElementsByName("rbtn");
	var capacity=document.getElementById("eCap");
	var prange1=document.getElementById("pRange1");
	var prange2=document.getElementById("pRange2");
	var state=document.getElementById("state");
	var transM=document.getElementById("transM");
	var city=document.getElementById("city");
	var data;
	//the buyer may choose category only
	var categoryVal="";
	for(var i=0;i<category.length;i++){
		var curRadio=category[i];
		if(curRadio.checked){
			categoryVal=curRadio.value;
		}
	}
	var capacityVal=capacity.value;
	var pRangeVal=prange1.value;
	var pRangeVal2=prange2.value;
	var stateVal=state.value;
	var transVal=transM.value;
	var cityVal=city.value;
	
	//REMOVE THE MODAL//
	var cancelImg=document.getElementById("mainCover").getElementsByTagName("img")[0];
	cancelImg.click();
	
	///////////////START OF SINGLE VALUED SEARCH FILTERS/////////////////////
	
	if(categoryVal!="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal=="" && cityVal==""){
		data="category="+categoryVal;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal=="" && cityVal==""){
		data="capacity="+capacityVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal=="" && cityVal==""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal=="" && cityVal==""){
		data="carState="+stateVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal!="" && cityVal==""){
		data="transM="+transVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal=="" && cityVal!=""){
		/*if(!dangerChars(city)){
			
		}*/
		data="city="+cityVal;
	}
	
	////////// END OF SINGLE VALUED FILTERS//////////////////////////////
	
	///////// START OF TWO VALUED FILTERS///////////////////////////////
	
	else if(categoryVal!="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal=="" && cityVal==""){
		data="category="+categoryVal+"&capacity="+capacityVal;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal=="" && cityVal==""){
		data="category="+categoryVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal=="" && cityVal==""){
		data="category="+categoryVal+"&state="+stateVal;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal!="" && cityVal==""){
		data="category="+categoryVal+"&transM="+transVal;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal=="" && cityVal!=""){
		data="category="+categoryVal+"&city="+cityVal;
	}
	
	else if(categoryVal=="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal=="" && cityVal==""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2+"&capacity="+capacityVal;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal=="" && cityVal==""){
		data="capacity="+capacityVal+"&state="+stateVal;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal!="" && cityVal==""){
		data="capacity="+capacityVal+"&transM="+transVal;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal=="" && cityVal!=""){
		data="capacity="+capacityVal+"&city="+cityVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal=="" && cityVal==""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2+"&state="+stateVal;
	}
	
	else if(categoryVal=="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal!="" && cityVal==""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2+"&transM="+transVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal=="" && cityVal!=""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2+"&city="+cityVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal!="" && cityVal==""){
		data="state="+stateVal+"&transM="+transVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal=="" && cityVal!=""){
		data="state="+stateVal+"&city="+cityVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal!="" && cityVal!=""){
		data="transM="+transVal+"&city="+cityVal;
	}
	
	//////// END OF TWO VALUED FILTERS/////////////////////////////////
	
	//////// START OF THREE VALUED FILTERS/////////////////////////////////
	
	else if(categoryVal!="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal=="" && cityVal!=""){
		data="category="+categoryVal+"&city="+cityVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2;
	}
	else if(categoryVal!="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal!="" && cityVal==""){
		data="category="+categoryVal+"&capacity="+capacityVal+"&transM="+transVal;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal=="" && cityVal!=""){
		data="category="+categoryVal+"&city="+cityVal+"&state="+stateVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal=="" && cityVal!=""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2+"&state="+stateVal+"&city="+cityVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal!="" && cityVal!=""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2+"&transM="+transVal+"&city="+cityVal;
	}
	
	else if(categoryVal=="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal=="" && cityVal!=""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2+"&capacity="+capacityVal+"&city="+cityVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal!="" && cityVal!=""){
		data="state="+stateVal+"&transM="+transVal+"&city="+cityVal;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal=="" && cityVal!=""){
		data="capacity="+capacityVal+"&state="+stateVal+"&city="+cityVal;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal=="" && cityVal==""){
		data="capacity="+capacityVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2+"&state="+stateVal;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal!="" && cityVal==""){
		data="capacity="+capacityVal+"&transM="+transVal+"&state="+stateVal;
	}
	
	else if(categoryVal!="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal=="" && cityVal==""){
		data="category="+categoryVal+"&capacity="+capacityVal+"&state="+stateVal;
	}
	else if(categoryVal!="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal=="" && cityVal!=""){
		data="category="+categoryVal+"&capacity="+capacityVal+"&city="+cityVal;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal!="" && cityVal==""){
		data="category="+categoryVal+"&state="+stateVal+"&transM="+transVal;
	}
	else if(categoryVal=="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal!="" && cityVal==""){
		data="transM="+transVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2+"&state="+stateVal;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal=="" && transVal!="" && cityVal!=""){
		data="category="+categoryVal+"&city="+cityVal+"&transM="+transVal;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal!="" && cityVal==""){
		data="transM="+transVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2+"&category="+categoryVal;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal=="" && cityVal!=""){
		data="category="+categoryVal+"&city="+cityVal+"&state="+stateVal;
	}
	
	//////// END OF THREE VALUED FILTERS/////////////////////////////////
	
	//////// START OF FOUR VALUED FILTERS/////////////////////////////////
	
	else if(categoryVal!="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal=="" && cityVal!=""){
		data="category="+categoryVal+"&city="+cityVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2+"&capacity="+capacityVal;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal!="" && cityVal!=""){
		data="category="+categoryVal+"&state="+stateVal+"&transM="+transVal+"&city="+cityVal;
	}
	else if(categoryVal!="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal=="" && cityVal!=""){
		data="category="+categoryVal+"&city="+cityVal+"&capacity="+capacityVal+"&state="+stateVal;
	}
	else if(categoryVal!="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal=="" && cityVal!=""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2+"&state="+stateVal+"&city="+cityVal+"&category="+categoryVal;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal!="" && cityVal==""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2+"&transM="+transVal+"&state="+stateVal+"&capacity="+capacityVal;
	}
	
	else if(categoryVal=="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal!="" && cityVal!=""){
		data="state="+stateVal+"&transM="+transVal+"&capacity="+capacityVal+"&city="+cityVal;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal!="" && cityVal!=""){
		data="capacity="+capacityVal+"&transM="+transVal+"&city="+cityVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal=="" && cityVal!=""){
		data="capacity="+capacityVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2+"&state="+stateVal+"&city="+cityVal;
	}
	
	
	//////// END OF FOUR VALUED FILTERS/////////////////////////////////
	
	
	//////// START OF FIVE VALUED FILTERS/////////////////////////////////
	
	else if(categoryVal!="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal=="" && transVal!="" && cityVal!=""){
		data="category="+categoryVal+"&city="+cityVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2+"&capacity="+capacityVal+"&transM="+transVal;
	}
	else if(categoryVal!="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal=="" && cityVal!=""){
		data="category="+categoryVal+"&state="+stateVal+"&city="+cityVal+"&capacity="+capacityVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2;
	}
	else if(categoryVal=="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal!="" && cityVal!=""){
		data="transM="+transVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2+"&city="+cityVal+"&capacity="+capacityVal+"&state="+stateVal;
	}
	else if(categoryVal!="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal!="" && cityVal==""){
		data="prange1="+pRangeVal+"&prange2="+pRangeVal2+"&state="+stateVal+"&transM="+transVal+"&category="+categoryVal+"&capacity="+capacityVal;
	}
	else if(categoryVal!="" && capacityVal!="" && pRangeVal=="" && pRangeVal2=="" && stateVal!="" && transVal!="" && cityVal!=""){
		data="category="+categoryVal+"&city="+cityVal+"&transM="+transVal+"&state="+stateVal+"&capacity="+capacityVal;
	}
	
	else if(categoryVal!="" && capacityVal=="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal!="" && cityVal!=""){
		data="state="+stateVal+"&transM="+transVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2+"&city="+cityVal+"&category="+categoryVal;
	}
	
	//////// END OF FIVE VALUED FILTERS/////////////////////////////////
	
	//////// START OF SIX VALUED FILTERS/////////////////////////////////
	
	else if(categoryVal!="" && capacityVal!="" && pRangeVal!="" && pRangeVal2!="" && stateVal!="" && transVal!="" && cityVal!=""){
		data="capacity="+capacityVal+"&transM="+transVal+"&city="+cityVal+"&prange1="+pRangeVal+"&prange2="+pRangeVal2+"&state="+stateVal+"&category="+categoryVal;
	}
	
	//////// END OF SIX VALUED FILTERS/////////////////////////////////
	
	else {
		//REPORT ERROR MESSAGE HERE 
		searchResultMsg("Fill at least one field");
		return 
	}
	
	var request=req();
	if(request!=null){
		request.open("POST","search.php",true);
		request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		request.onreadystatechange=function(){
			if(request.responseText!="no result"){
				document.getElementById("main").innerHTML=request.responseText;
				var carContainers=document.getElementsByClassName("cars");
				if(carContainers!=null || carContainers!=undefined){
					for(var x=0;x<carContainers.length;x++){
						carContainers[x].onclick=passDetails;
					}
				}
				var ourCart=document.getElementById("thecart");
				ourCart.onclick=displayCartItems;
			}
			else{
				searchResultMsg("No cars found");
			}
		}
		request.send(data);
	}
	else{
		searchResultMsg("Something went wrong");
	}
	
}
function paintP(e){
	
}
function dangerChars(e){
	var elInfo=obj(e);
	var elValue=elInfo.value;
	var invalidChars=['<','>','?',',','\\','{','}','[',']','(',')','!','`','~','@','#','$','\''];
		for(var x=0;x<elValue.length;x++){
			var currentChar=elValue[x];
			if(invalidChars.indexOf(currentChar)>=0){
				elInfo.focus();
				return false;
			}
		}
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
function displayContactPage(e){
	e.preventDefault();
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
function displayAboutPage(e){
	e.preventDefault();
	var request=req();
	request.open("GET","about.php?about=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			
		}
		
	}
	request.send(null);
}

function displayCarsToBuy(){
	var request=req();
	request.open("GET","displayDealerCars.php?display=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			var carContainers=document.getElementsByClassName("cars");
			if(carContainers!=null || carContainers!=undefined){
				for(var x=0;x<carContainers.length;x++){
				carContainers[x].onclick=passDetails;
			}
			}
			var ourCart=document.getElementById("thecart");
			if(ourCart!=null){
				ourCart.onclick=displayCartItems;
				setInterval(checkCart,1000);
			}
			
		}
		
	}
	request.send(null);
	
	
}
function displayWishlist(e){
	e.preventDefault();
	var request=req();
	request.open("GET","displayWishlist.php?wishes=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			document.getElementById("main").innerHTML=request.responseText;
			var carContainers=document.getElementsByClassName("cars");
			if(carContainers!=null || carContainers!=undefined){
				for(var x=0;x<carContainers.length;x++){
				carContainers[x].onclick=passDetails;
			}
			}
			var ourCart=document.getElementById("thecart");
			if(ourCart!=null){
				ourCart.onclick=displayCartItems;
				setInterval(checkCart,1000);
			}
			
		}
		
	}
	request.send(null);
}
function searchResultMsg(msg){
	
	var result=document.createElement("div");
	result.setAttribute('id','searchMsg');
	document.getElementById("siteHeader").appendChild(result);
	var txt=document.createTextNode(msg);
	result.appendChild(txt);
	setTimeout(function(){
		result.parentNode.removeChild(result);
	},2000);
	
}
function displayResult(e){
	var elInfo=obj(e);
	var code=e.keyCode;
	if(code==13){
		var elValue=elInfo.value;
		var invalidChars=['<','>','?',',','\\','{','}','[',']','(',')','!','`','~','@','#','$'];
		for(var x=0;x<elValue.length;x++){
			var currentChar=elValue[x];
			if(invalidChars.indexOf(currentChar)>=0){
				return;
			}
		}
		if(elValue!=""){
			if(elValue.match(/^[a-zA-Z0-9\s]+/)){
			var data=escape(elValue);
			var request=req();
			if(request!=null){
				request.open("GET","search.php?search="+data,true);
				request.onreadystatechange=function(){
					if(request.readyState==4 && request.status==200){
					if(request.responseText=="no result"){
						
						//CALL THE FUNCTION TO DISPLAY SEARCH MESSAGE HERE//
						searchResultMsg("Car Not Found");
						
						
					}
					else{
						document.getElementById("main").innerHTML=request.responseText;
						var carContainers=document.getElementsByClassName("cars");
						for(var x=0;x<carContainers.length;x++){
							carContainers[x].onclick=passDetails;
						}
						var ourCart=document.getElementById("thecart");
						ourCart.onclick=displayCartItems;
					}
					}
				}
				request.send(null);
			}
			else{
				alert("Your browser does not support asynchronous request");
			}
			}else{
				return;
			}
		}
		else{
			return;
		}
		
	}
}
function displayCartItems(){
	//var request=req();
	/*request.open("GET","checkmember.php?probe=1",true);
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			var displayProceedBtn;
			if(request.responseText=="logged in"){
				displayProceedBtn=true;
				alert("the user is logged in");
			}
			else{
				displayProceedBtn=false;
				alert("the user is not logged in");
			}*/
			var cover=document.createElement("div");
			cover.setAttribute("id","cover");
			var topDiv=document.getElementById("siteHeader");
			topDiv.appendChild(cover);
			var deleteImg=document.createElement("img");
			deleteImg.setAttribute('src','pics/change2.jpg');
			deleteImg.setAttribute('id','imgCover');
			cover.appendChild(deleteImg);
			deleteImg.onclick=removeCover;
			var itemDiv=document.createElement("div");
			itemDiv.setAttribute('id','itemDiv');
			cover.appendChild(itemDiv);
			var userItems= getArray();
			if(userItems.length>0){
		
			var totalP=document.createElement("input");
			totalP.setAttribute('id','totalP');
			totalP.setAttribute('type','number');
			totalP.setAttribute('disabled',true);
			itemDiv.appendChild(totalP);
			cartAmount=totalP.value;
	
			var proceed=document.createElement("div");
			proceed.setAttribute('id','proceedDiv');
			proceed.onclick=getTotalAmt;
			var proceedText=document.createTextNode("Proceed");
			proceed.appendChild(proceedText);
			itemDiv.appendChild(proceed);
			passKey();
			for(var i=0;i<userItems.length;i++){
				var keyObj=userItems[i];
				var curObj=JSON.parse(localStorage.getItem(keyObj));
				objVal(curObj,keyObj);
				}
		
	}
	else{
		var p=document.createElement("p");
		p.setAttribute('id','emptyCart');
		itemDiv.appendChild(p);
		var pText=document.createTextNode("The Cart is empty");
		p.appendChild(pText);
	}

}
function getTotalAmt(){
	var autoRemove=document.getElementById("imgCover");
	autoRemove.click();
	var userStatus=req();
	userStatus.open("GET","processcart.php?loginStatus=1",true);
	userStatus.onreadystatechange=function(){
		if(userStatus.readyState==4 && userStatus.status==200){
			if(userStatus.responseText!='ok'){
				localStorage.setItem("resumeBuy","purchase onhold");
				modalMaker("You are not Logged in");
			}
			else{
				checkOutCars();
			}
		}
	}
	userStatus.send(null);
	//var fd=new FormData();
	
	
	
}
function checkOutCars(){
	var qtyArr=getQtyArr();
	var productArr=getArray();
	qtyArr=JSON.stringify(qtyArr);
	productArr=JSON.stringify(productArr);
	var fd="total="+cartAmount+"&quantity="+qtyArr+"&product="+productArr;
	var request=req();
	request.open("POST","processpurchase.php",true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
		if(request.responseText!="error"){
			var redirectIt=request.responseText;
			localStorage.clear();
			window.location.href=redirectIt;
				/*localStorage.removeItem("quantityArray");
				var productArr=getArray();
				for(var p=0;p<productArr.length;p++){
					localStorage.removeItem(productArr[p]);
					
				}
				localStorage.removeItem("productArray");
				var autoRemove=document.getElementById("imgCover");
				autoRemove.click();*/
				
			}
			else{
				var autoRemove=document.getElementById("imgCover");
				autoRemove.click();
				notifMaker(request.responseText);
			}
			
		}
		
	}
	request.send(fd);
}
function passKey(){
	costArray=[];
	var finalAmt=0;
	var userItems= getArray();
	for(var c=0;c<userItems.length;c++){
		updateStorage(userItems[c]);
	}
	for(var amt=0;amt<costArray.length;amt++){
		finalAmt+=costArray[amt];
	}
	//var text="Total: $";
	var totalPriceDisplay=document.getElementById("totalP");
	if(totalPriceDisplay!=null){
		totalPriceDisplay.value=finalAmt;
	}
	
	cartAmount=finalAmt;
	//getGoogleTransactionInfo();
}
function updateStorage(key){
	//var total=0;
	var extrObj=JSON.parse(localStorage.getItem(key));
	var total=extrObj.price*extrObj.quantity;
	costArray.push(total);
	
}
function objVal(theObj,key){
	var savedCars=document.createElement("div");
	savedCars.setAttribute('class','savedCars');
	savedCars.setAttribute('id',key);
	//savedCars;
	itemDiv.appendChild(savedCars);
	
	var p2=document.createElement("p");
	p2.setAttribute('id','instruction');
	p2.onclick=removeCar;
	savedCars.appendChild(p2);
	var pText2=document.createTextNode("delete");
	p2.appendChild(pText2);
	for(var x in theObj){
	/*	
		if(x=="price"){
			var currentPrice=theObj[x];
		}
		if(x=="quantity"){
			var currentQty=theObj[x];
		}*/
		var p=document.createElement("p");
		savedCars.appendChild(p);
		var pText=document.createTextNode(x+": "+theObj[x]);
		p.appendChild(pText);
		
	}
		/*total=total+(theObj.price*theObj.quantity);
	var totalP=document.createElement("p");
	totalP.setAttribute('id','fullAmt');
	itemDiv.appendChild(totalP);
	var totalText=document.createTextNode("Total Amount: $"+total);
	totalP.appendChild(totalText);*/
}
function removeCar(e){
	var elInfo=obj(e);
	var elId=elInfo.id;
	
	if(elInfo.tagName.toLowerCase()=="p"){
		elId=elInfo.parentNode.id;
	}
	//alert(elId);
	//var exId=9;
	var divToRemove=document.getElementById(elId);
	divToRemove.parentNode.removeChild(divToRemove);
	var keyArr=getArray();
	var qtyArr=getQtyArr();
	for(var d=0;d<keyArr.length;d++){
		if(elId==keyArr[d]){
			keyArr.splice(d,1);
			qtyArr.splice(d,1);
		}
		
	}
	//console.log(keyArr);
	localStorage.setItem("productArray",JSON.stringify(keyArr));
	localStorage.setItem("quantityArray",JSON.stringify(qtyArr));
	localStorage.removeItem(elId);
	passKey();
}
function checkCart(){
	var cartArr=localStorage.getItem("productArray");
	var trolley=document.getElementById("items");
	if(trolley!=null){
	if(cartArr){
		var items;
		var itemsArray=JSON.parse(cartArr);
		items=itemsArray.length;
		if(items>99){
			items=99+"+"
		}
		
		
		trolley.innerHTML=items;
		
	}
	else{
		trolley.innerHTML="";
	}
	}
	else{
		return;
	}
}
function passDetails(e){
	var bars=document.getElementById("opt");
	bars.onclick="";
	picCount=0;
	var elInfo=obj(e);
	if(elInfo.tagName.toLowerCase()!='img'){
		return;
	}
	var eid=elInfo.id;
	var request=req();
	if(request!=null){
		var data="carId="+eid;
		request.open("POST","cardata.php",true);
		request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		request.onreadystatechange=function(){
			var carState; 
			var type; 
			var model; 
			if(request.readyState==4 && request.status==200){
				dataObj=JSON.parse(request.responseText);
				if(dataObj.state==1){
					carState="New";
				}
				else{
					carState="Second Hand";
				}
				var main=document.getElementById("main");
				while(main.firstChild){
					main.removeChild(main.firstChild);
				}
				//<div id="thecart"><img src="pics/cart.png"><span id="items"></span></div>
				var theCartDiv=document.createElement("div");
				theCartDiv.setAttribute('id','thecart');
				main.appendChild(theCartDiv);
				
				var cartImg=document.createElement("img");
				cartImg.setAttribute('src','pics/cart.png');
				theCartDiv.appendChild(cartImg);
				
				var cartSpan=document.createElement("span");
				cartSpan.setAttribute('id','items');
				theCartDiv.appendChild(cartSpan);
				theCartDiv.onclick=displayCartItems;
				
				var carDetailsDiv=document.createElement("div");
				carDetailsDiv.setAttribute("id","carHolder");
				main.appendChild(carDetailsDiv);
				
				var relatedCarsDiv=document.createElement("div");
				relatedCarsDiv.setAttribute("id","relatedCars");
				main.appendChild(relatedCarsDiv);
				populateRelated(dataObj.type,eid);	
				
				var img=document.createElement("img");
				img.setAttribute('id','imageHolder');
				img.setAttribute('src','dealers/'+dataObj.dealerName+'/'+dataObj.poster);
				carDetailsDiv.appendChild(img);
				
				var img2=document.createElement("img");
				img2.setAttribute('id','next');
				img2.setAttribute('src','pics/next.jpg');
				img2.onclick=function(){
					var picArray=dataObj.pics;
					var path="dealers/"+dataObj.dealerName;
					if(picCount>picArray.length-1){
						picCount=0;
					}
					img.setAttribute('src',path+"/"+picArray[picCount]);
					picCount++;
				}
				carDetailsDiv.appendChild(img2);
				
				var p=document.createElement("p");
				p.onclick=displayDescription;
				p.setAttribute('class','carName');
				p.setAttribute('id','fullName');
				type=dataObj.type.substr(0,4);
				model=dataObj.model.substr(0,5);
				
				var pText=document.createTextNode(type+" "+model);
				p.appendChild(pText);
				carDetailsDiv.appendChild(p);
				
				var p2=document.createElement("p");
				p2.setAttribute('class','carName');
				p2.setAttribute('id','state');
				var pText2=document.createTextNode(carState);
				p2.appendChild(pText2);
				carDetailsDiv.appendChild(p2);
				
				var p3=document.createElement("p");
				p3.setAttribute('class','carName');
				p3.setAttribute('id','price');
				var pText3=document.createTextNode("$"+dataObj.price);
				p3.appendChild(pText3);
				carDetailsDiv.appendChild(p3);
				
				var p6=document.createElement("p");
				p6.setAttribute('class','carName');
				p6.setAttribute('id','dName');
				var pText6=document.createTextNode("Dealer: "+dataObj.dealerName);
				p6.appendChild(pText6);
				p6.onclick=displayDealerInfo;
				carDetailsDiv.appendChild(p6);
				
				var qty=document.createElement("input");
				qty.setAttribute('type','number');
				qty.setAttribute('id','quantity');
				qty.setAttribute('value',1);
				carDetailsDiv.appendChild(qty);
				
				var buyDiv=document.createElement("div");
				buyDiv.setAttribute("id","buy_"+dataObj.carId);
				buyDiv.setAttribute("title",dataObj.carId);
				buyDiv.setAttribute("class","action");
				buyDiv.classList.add('buyControl');
				var pText4=document.createTextNode("Cart");
				var buyP=document.createElement("p");
				buyP.setAttribute("title",dataObj.carId);
				buyDiv.appendChild(buyP);
				var img6=document.createElement("img");
				img6.setAttribute('id','buyIcon');
				img6.setAttribute('src','pics/add.jpg');
				buyP.appendChild(img6);
				
				buyP.appendChild(pText4);
				//buyDiv.classList.add('uniqueBuy');
				carDetailsDiv.appendChild(buyDiv);
				buyDiv.onclick=addCart;
				
				var wishDiv=document.createElement("div");
				wishDiv.setAttribute("id","wish_"+dataObj.carId);
				wishDiv.setAttribute("title",dataObj.carId);
				wishDiv.setAttribute("class",'action');
				wishDiv.classList.add('wishControl');
				wishDiv.onclick=addWish;
				var pText5=document.createTextNode("Wishlist");
				
				var img4=document.createElement("img");
				img4.setAttribute('id','add');
				img4.setAttribute('src','pics/add.jpg');
				var wishP=document.createElement("p");
				wishP.setAttribute("title",dataObj.carId);
				wishP.appendChild(img4);
				wishP.appendChild(pText5);
				wishDiv.appendChild(wishP);
				carDetailsDiv.appendChild(wishDiv);
				
				var backDiv=document.createElement("div");
				backDiv.setAttribute("class","action");
				backDiv.classList.add('backControl');
				backDiv.setAttribute("title","Back");
				backDiv.classList.add('spaceIncrease');
				var backP=document.createElement("p");
				backDiv.appendChild(backP);
				
				var backText=document.createTextNode("Go Back");
				backP.appendChild(backText);
				carDetailsDiv.appendChild(backDiv);
				backDiv.onclick=function(){
					displayCarsToBuy();
				}
			}
		}
		request.send(data);
	}
	else{
		alert("Your browser does not support asynchronous requests!!!");
	}
}
function displayDealerInfo(){
	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	document.getElementById("siteHeader").appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	var img=document.createElement("img");
	img.setAttribute('src','pics/change2.jpg');
	mainCover.appendChild(img);
	img.onclick=removeMainImg;
	var heading1=document.createElement("h3");
	heading1.innerHTML="Dealer Details";
	subCover.appendChild(heading1);
	var fullName=document.createElement("p");
	fullName.innerHTML="Name: "+dataObj.dealerName;
	subCover.appendChild(fullName);
	var email=document.createElement("p");
	email.innerHTML="Email: "+dataObj.dealerEmail;
	subCover.appendChild(email);
	var phone=document.createElement("p");
	phone.innerHTML="Phone: "+dataObj.dealerPhone;
	subCover.appendChild(phone);
	var location=document.createElement("p");
	location.innerHTML="Location: "+dataObj.dealerAddress+", "+dataObj.dealerCity;
	subCover.appendChild(location);
	var verified=dataObj.dealerStatus;
	var dealerStatus=document.createElement("p");
	if(verified==1){
		dealerStatus.className="notConfirmed";
		var status="Verified";
	}
	else{
		dealerStatus.className="Confirmed";
		var status="Not Verified";
	}
	
	dealerStatus.innerHTML="Status: "+status;
	subCover.appendChild(dealerStatus);
	var reviewH3=document.createElement("h3");
	reviewH3.setAttribute('id','reviewHeading');
	reviewH3.innerHTML="Reviews";
	subCover.appendChild(reviewH3);
	var dealer_id=dataObj.dealerId;
	var request=req();
	if(request!=null){
		var loading=document.createElement("img");
		loading.setAttribute('id','loaderGif');
		loading.setAttribute('src','pics/wait4.gif');
		subCover.appendChild(loading);
		var data="dealerId="+dealer_id;
		request.open("POST","cardata.php",true);
		request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		request.onreadystatechange=function(){
			if(request.readyState==4 && request.status==200){
				//remove the loading gif
				var gif=document.getElementById("loaderGif");
				gif.parentNode.removeChild(gif);
				var reviewObj=JSON.parse(request.responseText);
				for(var x=0;x<reviewObj.length;x++){
					var curObj=reviewObj[x];
					if(curObj.hasOwnProperty('missing')){
						var div=document.createElement("div");
						div.setAttribute('class','reviewCont');
						div.innerHTML=curObj.missing;
						subCover.appendChild(div);
					}
					else{
						var div=document.createElement("div");
						div.setAttribute('class','reviewCont');
						var name=document.createElement("p");
						name.setAttribute('class','reviewerName');
						name.innerHTML=curObj.name+" "+curObj.sname;
						div.appendChild(name);
						
						var msg=document.createElement("p");
						msg.setAttribute('class','reviewMsg');
						msg.innerHTML=curObj.msg;
						div.appendChild(msg);
						
						subCover.appendChild(div);
					}
				}
			}
		}
		request.send(data);
	}
	else{
		return;
	}
	
}
function displayDescription(){
	var mainCover=document.createElement("div");
	mainCover.setAttribute('id','mainCover');
	document.getElementById("siteHeader").appendChild(mainCover);
	var subCover=document.createElement("div");
	subCover.setAttribute('id','subCover');
	mainCover.appendChild(subCover);
	var img=document.createElement("img");
	img.setAttribute('src','pics/change2.jpg');
	mainCover.appendChild(img);
	img.onclick=removeMainImg;
	var fullName=document.createElement("p");
	fullName.innerHTML=dataObj.type+" "+dataObj.model;
	subCover.appendChild(fullName);
	var carDescription=document.createElement("h3");
	carDescription.innerHTML="Car Description";
	subCover.appendChild(carDescription);
	var desc=document.createElement("p");
	desc.innerHTML=dataObj.desc;
	subCover.appendChild(desc);
	var colors=dataObj.color;
	var heading=document.createElement("h3");
	heading.innerHTML="Available Colors";
	subCover.appendChild(heading);
	var splitted=colors.split(" ");
	for(var x=0;x<splitted.length;x++){
		var p=document.createElement("p");
		p.innerHTML=splitted[x];
		subCover.appendChild(p);
	}
	//var carId=dataObj.carId;
	
}
function removeMainImg(e){
	var elInfo=obj(e);
	var elId=elInfo.parentNode.id;
	var toRemove=document.getElementById(elId);
	toRemove.parentNode.removeChild(toRemove);
}
function populateRelated(vehicleType,id){
	var request=req();
	var data="relatedId="+id+"&type="+vehicleType;
	var divToPopulate=document.getElementById("relatedCars");
	request.open("POST","cardata.php",true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			if(request.responseText!="No Related Cars At The Moment"){
				divToPopulate.innerHTML=request.responseText;
				var clickable=document.getElementsByClassName("otherCars");
				if(clickable!=null || clickable!=undefined){
					for(var carCount=0;carCount<clickable.length;carCount++){
						clickable[carCount].onclick=passDetails;
					}
				}
			}
			else{
				divToPopulate.innerHTML=request.responseText;
			}
			
		}
	}
	request.send(data);	
}
function addWish(e){
	var elInfo=obj(e);
	var elId=elInfo.title;
	if(elInfo.tagName.toLowerCase()=='img'){
		elId=elInfo.parentNode.title;
	}
	var request=req();
	var data="productId="+elId;
	request.open("POST","processwish.php",true);
	request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	request.onreadystatechange=function(){
		if(request.readyState==4 && request.status==200){
			if(request.responseText=="ok"){
				notifMaker("Added To Wishlist");
			}
			else if(request.responseText=="exists"){
				notifMaker("Already Added");
			}
			else if(request.responseText=="guest"){
				modalMaker("You are not Logged In");
			}
			else{
				alert(request.responseText);
				//modalMaker("You are not Logged in");
			}
		}
	}
	request.send(data);
	//alert(elId);
}

function modalMaker(msg){
	
	var modalContainer=document.createElement("div");
	modalContainer.setAttribute('id','modalCont');
	var header=document.getElementById("siteHeader");
	header.appendChild(modalContainer);
	modalContainer.onclick=function(){
		modalContainer.parentNode.removeChild(modalContainer);
	}
	var notifContainer=document.createElement("div");
	notifContainer.setAttribute('id','notifCont');
	var notifP=document.createElement("p");
	notifP.setAttribute('id','userMsg');
	var notifText=document.createTextNode(msg);
	notifContainer.appendChild(notifP);
	notifP.appendChild(notifText);
	
	var notifP2=document.createElement("div");
	notifP2.setAttribute('class','authenticate');
	var notifText2=document.createTextNode("Login");
	notifContainer.appendChild(notifP2);
	notifP2.appendChild(notifText2);
	notifP2.onclick=function(){
		window.location.href="login.php";
	}
	
	var notifP3=document.createElement("div");
	notifP3.setAttribute('class','authenticate');
	var notifText3=document.createTextNode("Sign Up");
	notifContainer.appendChild(notifP3);
	notifP3.appendChild(notifText3);
	notifP3.onclick=function(){
		window.location.href="signup.php";
	}
	
	modalContainer.appendChild(notifContainer);
}

function addCart(e){
	var elInfo=obj(e);
	var productId=elInfo.title;
	if(elInfo.tagName.toLowerCase()=='img'){
		productId=elInfo.parentNode.title;
	}
	var productQty=document.getElementById("quantity").value;
	var availableCars=parseInt(dataObj.qty);
	//alert(dataObj.qty);
	if(productQty > availableCars){
		notifMaker("Your Order Exceeds Available Cars");
		return;
	}
	var arrayOfKeys=getArray();
	var arrayOfQty=getQtyArr();

	if(arrayOfKeys.indexOf(productId)<0){
		
		arrayOfKeys.push(productId);
		arrayOfQty.push(productQty);
		localStorage.setItem("productArray",JSON.stringify(arrayOfKeys));
		localStorage.setItem("quantityArray",JSON.stringify(arrayOfQty));
		var productObj={type:dataObj.type,model:dataObj.model,price:dataObj.price,quantity:productQty};
		localStorage.setItem(productId,JSON.stringify(productObj));
		notifMaker("Saved To Cart");
						
						//alert("saved to cart");
					}
					else{
						notifMaker("Already Saved");
						//alert("Already Saved");
					}
					
}
function notifMaker(msg){
	var checkCarHolder=document.getElementById("carHolder");
	var checkMainDiv=document.getElementById("main");
	var alertDiv=document.createElement("div");
	alertDiv.setAttribute('id','alertDiv');
	if(checkCarHolder!=null){
		checkCarHolder.appendChild(alertDiv);
	}
	else{
		checkMainDiv.appendChild(alertDiv);
	}
	
	var alertP=document.createElement("p");
	alertDiv.appendChild(alertP);
	var alertPText=document.createTextNode(msg);
	alertP.appendChild(alertPText);
	setTimeout(function(){
		alertDiv.parentNode.removeChild(alertDiv);
		
	},2000);
}

function removeCover(e){
	var elInfo=obj(e);
	var elId=elInfo.parentNode.id;
	var parentToRemove=document.getElementById(elId);
	parentToRemove.parentNode.removeChild(parentToRemove);
}
function displayLink(){
	var ul=document.getElementById("linkHolder");
	ul.classList.toggle('toggle');
}
function getArray(){
	var storedArr=localStorage.getItem("productArray");
	if(!storedArr){
		storedArr=[];
		localStorage.setItem("productArray",storedArr);
	}
	else{
		storedArr=JSON.parse(storedArr);
	}
	return storedArr;
}
function getQtyArr(){
	var qtyArr;
	qtyArr=localStorage.getItem("quantityArray");
	if(!qtyArr){
		qtyArr=[];
		localStorage.setItem("quantityArray",qtyArr);
	}
	else{
		qtyArr=JSON.parse(qtyArr);
	}
	return qtyArr;
}


