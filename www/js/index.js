var allData = new Object();
var data = {};

//document.addEventListener("DOMContentLoaded", onDeviceReady, false);
document.addEventListener("deviceready", onDeviceReady, false);

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
		data.contactInfor.push({ 'id': matches[i].id, 'name': matches[i].displayName, 'homeNum': matches[i].phoneNumbers[0].value, 'mobileNum': matches[i].phoneNumbers[1].value, 'lat': null, 'lng': null });
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
	var p4 = document.createElement("p");
	var p5 = document.createElement("p");
	var num = e.target.getAttribute("data-ref");
	
	p1.innerHTML = "Name: "+ allData.contactInfor[num].name;
	p2.innerHTML = "Home: "+ allData.contactInfor[num].homeNum;
	p3.innerHTML = "Mobile: "+ allData.contactInfor[num].mobileNum;
	p4.innerHTML = "Latitude: "+ allData.contactInfor[num].lat;
	p5.innerHTML = "Longitude: "+ allData.contactInfor[num].lng;
	x.appendChild(p1);
	x.appendChild(p2);
	x.appendChild(p3);
	x.appendChild(p4);
	x.appendChild(p5);
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
	//if a location is already saved with the contact
	if(allData.contactInfor[num].lat !=null && allData.contactInfor[num].lng !=null){
		var myLatlng = new google.maps.LatLng(allData.contactInfor[num].lat,allData.contactInfor[num].lng);
		var mapOptions ={
			  center: myLatlng,
			  zoom:14,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			};
		var map =new google.maps.Map(document.getElementById("box"), mapOptions);
		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			title: allData.contactInfor[num].name
		});
		var infowindow = new google.maps.InfoWindow({
			map: map,
			position: myLatlng,
			content: '<p style="color:black">'+allData.contactInfor[num].name+'<p>'
      	});
	}
	//if no locatin saved, display a dynamic google map centered at Algonquin college
	else{
		var mapOptions ={
			  center:new google.maps.LatLng(45.348247,-75.756086),
			  zoom:14,
			  mapTypeId: google.maps.MapTypeId.ROADMAP
			};
		var map =new google.maps.Map(document.getElementById("box"), mapOptions);
		//click on the map to set a marker
		alert("Tap on the map to set a location for the contact");
		google.maps.event.addListener(map, 'click', function(ev) 
		{
			placeMarker(ev.latLng, map);
			function placeMarker(position, map) 
			{
				var marker = new google.maps.Marker({
					position: ev.latLng,
					map: map
				});
				map.panTo(position);
				//click the marker to save it
				alert("Tap on the marker to save the location for the contact");
				google.maps.event.addListener(marker, "click", function (event) 
				{
					data.contactInfor[num].lat = event.latLng.lat();
					data.contactInfor[num].lng = event.latLng.lng();
					localStorage.setItem('data', JSON.stringify(data));
					allData = JSON.parse(localStorage.getItem('data'));
					alert("the location has been saved for the contact");
				});
			}
		});	
	}
}



