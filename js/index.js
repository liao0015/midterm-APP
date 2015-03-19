// JavaScript Document
var pages = [];
var links = [];
var numLinks = 0;
var numPages = 0;

//document.addEventListener("DOMContentLoaded", onDeviceReady, false);
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
		pages = document.querySelectorAll('[data-role="page"]');
		numPages = pages.length;
		links = document.querySelectorAll('[data-role="pagelink"]');
		numLinks = links.length;
		for(var i = 0; i < numLinks; i++){
			if(detectTouchSupport()){
				links[i].addEventListener("touchend", handleTouch, false);
			}
			links[i].addEventListener("click", handleLinkClick, false);
			links[i].addEventListener("click", addContact, false);
		};
		
		window.addEventListener("popstate", browserBackButton, false);
		document.addEventListener("scroll", handleScrolling, false);
		loadPage(null);
}

ShowStaticMap();

function handleTouch(ev){
	ev.preventDefault();
	ev.stopImmediatePropagation();
	var touch = ev.changedTouches[0];
	var newEvt = document.createEvent("MouseEvent");
	newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
	ev.currentTarget.dispatchEvent(newEvt);
}

function handleLinkClick(ev){
	ev.preventDefault();
	var href = ev.target.href;
	var parts = href.split("#");
	loadPage(parts[1]);
	return false;
}

function loadPage(url){
	if(url == null){
		pages[0].style.display = "block";
		history.replaceState(null, null, "#home");
	}
	else{
		for (var i =0; i < numPages; i++){
			if (pages[i].id == url){
				pages[i].style.display = "block";
				history.pushState(null, null, "#" + url);
			}
			else{
				pages[i].style.display = "none";
			}
		}
		for (var x = 0; x < numLinks; x++){
			links[x].className = "";
			svgs[x].classList.remove("svgShow");
			if (links[x].href == location.href){
				links[x].className = "show";
				svgs[x].classList.add("svgShow");
			}
		}
	}
}

//Using browser's back button
function browserBackButton(ev){
	url = location.hash;
	for(var i = 0; i < numPages; i++){
		if(("#" + pages[i].id) == url){
			pages[i].style.display = "block";
		}
		else {
			pages[i].style.display = "none";
		}
	}
	for(var x = 0; x < numLinks; x++){
		links[x].className = "";
		svgs[x].classList.remove("svgShow");
		if(links[x].href == location.href){
			links[x].className = "show";
			svgs[x].classList.add("svgShow");
		}
	}
}

//sticky footer when scrolled down
function handleScrolling(ev){
	var height = window.innerHeight;
	var offset = window.pageYOffset;
	var footHeight = 60;
	var footer = document.querySelector("#sticky");
	footer.style.position = "absolute";
	var total = height + offset - footHeight;
	footer.style.top = total + "px";
}

//test for browers support of touch events
function detectTouchSupport(){
	msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
	var touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
	return touchSupport;
}

//geolocation showing goodle static map of current location
function ShowStaticMap(){
	//check if geolocation is supported
	if( navigator.geolocation ){ 
	
		var params = {enableHighAccuracy: true, timeout:360000, maximumAge:0};
		navigator.geolocation.getCurrentPosition( watchPosition, gpsError, params ); 
		
		function watchPosition( position ){ 
			//create canvas element and append into div
			var x = document.getElementById("box");
			var canvas = document.createElement("canvas");
			canvas.width = "310";
			canvas.height = "310";
			canvas.style.border = "2px dashed teal";
			var context = canvas.getContext("2d");
			x.appendChild(canvas);
			
			//get location parameters and display map img in canvas
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			var img = document.createElement("img");
			img.src = "https://maps.googleapis.com/maps/api/staticmap?&size=400x400&markers=color:red%7C" + lat + "," + lon;
			img.onload = function() {
    			context.drawImage(img, 0, 0);
  			};
		}
		
		function gpsError( error ){   
  			var errors = {
			1: 'Permission denied',
			2: 'Position unavailable',
			3: 'Request timeout'
  			};
  			alert("Error: " + errors[error.code]);
		}
	}
	else{
		alert("Your browser doesn't support geolocation function.");
	}
}