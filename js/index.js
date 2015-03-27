var allData = new Object();
var data = {};

document.addEventListener("DOMContentLoaded", onDeviceReady, false);
//document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	addHammerEventListener();
	
	document.getElementById("btnClose").addEventListener("click", closeModalContact);
	document.getElementById("btnCloseMap").addEventListener("click", closeModalMap);
	
	addContact();

	document.addEventListener("scroll", handleScrolling, false);
}


function addHammerEventListener(ev){
	var tar = document.querySelector("[data-role=listview]");
	var mc = new Hammer(tar, {});
	
	var singleTap = new Hammer.Tap({event: 'tap'});
	var doubleTap = new Hammer.Tap({event:'doubletap', taps:2, threshold:10, posThreshold:25});
	mc.add([doubleTap, singleTap]);
	
	doubleTap.requireFailure(singleTap);
	
	mc.on("tap", function(ev){
		document.querySelector("[data-role=modal]").style.display = "block";
		document.querySelector("[data-role=overlay]").style.display = "block";
		showInfor(ev);
	});
	mc.on("doubletap", function(ev){
		document.querySelector("[data-role=map]").style.display = "block";
		document.querySelector("[data-role=overlay]").style.display = "block";
		getGeolocation(ev);
	});
}

//fetch in contacts, convert into JSON object and save in localstorage with the name "data"  
function addContact(){
	var options = new ContactFindOptions( );
	options.filter = ""; 
	options.multiple = true;
	var fields = [navigator.contacts.fieldType.displayName];
	navigator.contacts.find(fields, successFunc, errFunc, options);
}

function successFunc( matches ){
	data = {
	  'contactInfor': [],
	  'state': true
	};
	//read each contact from the contact list and convert each contact from the list into JSON as an object; the complete JSON will be converted into a string and stored in localstorage
	for (var i = 0; i < matches.length; i++){
		data.contactInfor.push({ 'id': matches[i].id, 'name': matches[i].displayName, 'homeNum': matches[i].phoneNumbers[0].value, 'mobileNum': matches[i].phoneNumbers[1].value, 'lat': "", 'lng': "" });
		localStorage.setItem('data', JSON.stringify(data));
	}
	//conver the sotred strings in localstorage back into JSON object 
	allData = JSON.parse(localStorage.getItem('data'));
	//display 12 contacts on the home screen
	var ul = document.querySelector("[data-role=listview]");
	for (var i = 0; i < 13; i++){
		var li = document.createElement("li");
		li.setAttribute("data-ref", i);
		li.innerHTML = "Name: " + allData.contactInfor[i].name;
		ul.appendChild(li);
	}
}
//display error message if contacts can not be found
function errFunc(matches){
	if (matches == null){
		alert("No contacts!");
	}
}

//once single tapped/clicked, show full name and phone numbers of the contact
function showInfor(e){
	var x = document.getElementById("bottle");
	x.innerHTML = "";
	
	var p1 = document.createElement("p");
	var p2 = document.createElement("p");
	var p3 = document.createElement("p");
	var num = e.target.getAttribute("data-ref");
	
	p1.innerHTML = "Name: "+ allData.contactInfor[num].name;
	p2.innerHTML = "Home: "+ allData.contactInfor[num].homeNum;
	p3.innerHTML = "Mobile: "+ allData.contactInfor[num].mobileNum;
	x.appendChild(p1);
	x.appendChild(p2);
	x.appendChild(p3);
}

//close the contact modal
function closeModalContact(){
	document.querySelector("[data-role=modal]").style.display="none";
	document.querySelector("[data-role=overlay]").style.display="none";
}

//close the map modal
function closeModalMap(){
	document.querySelector("[data-role=map]").style.display="none";
	document.querySelector("[data-role=overlay]").style.display="none";
}

function getGeolocation(e){
	//display the current contact name
	var y = document.getElementById("bottleMap");
	y.innerHTML = "";
	
	var p = document.createElement("p");
	var num = e.target.getAttribute("data-ref");
	p.innerHTML = "Name: "+ allData.contactInfor[num].name;
	y.appendChild(p);
	
	//display dynamic google map centered at Algonquin college
	var mapOptions ={
		  center:new google.maps.LatLng(45.348247,-75.756086),
		  zoom:14,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	var map =new google.maps.Map(document.getElementById("box"), mapOptions);
	var latitude;
	var longitude;
	google.maps.event.addListener(map, 'click', function(ev) 
	{
		placeMarker(ev.latLng, map);
		//alert('latitude:'+ev.latLng.lat+'; longitude:'+ev.latLng.lng+';');
		//console.log(ev.latLng.lat);
		function placeMarker(position, map) 
		{
			var marker = new google.maps.Marker({
				position: ev.latLng,
				map: map
			});
			map.panTo(position);
		
			google.maps.event.addListener(marker, "click", function (event) 
			{
				latitude = event.latLng.lat();
				longitude = event.latLng.lng();
				alert( latitude + ', ' + longitude );
			});
		}
	});	
	data.contactInfor[num]({ 'lat': latitude, 'lng': longitude});
	localStorage.setItem('data', JSON.stringify(data));
	allData = JSON.parse(localStorage.getItem('data'));
}

//sticky footer when scrolled down
function handleScrolling(ev){
	var height = window.innerHeight;
	var offset = window.pageYOffset;
	var footHeight = 60;
	var footer = document.querySelector('[data-role="footer"]');
	footer.style.position = "absolute";
	var total = height + offset - footHeight;
	footer.style.top = total + "px";
}

//the back button
/*function goBack(){
	console.log("back button function needed");
	if(url == null){
		pages[0].style.display = "block";
		hitory.replaceState(null, null, "#home");
	}else{
		for(var i =0; i < numPages; i++){
			if(pages[i].id ==url){
				pages[i].style.display = "block";
				history.pushState(null,null,"#", + url);
			}else{
				pages[i].style.display = "none";
			}
		}
	}
}*/
