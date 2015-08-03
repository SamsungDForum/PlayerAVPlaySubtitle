//Write your target video's url
var videoUrl = "";
//If you use remote url for subtitle. If you use internal subtitle. remain as ""
var subtitleUrl = "";
//If you use local subtitle file. If you use internal subtitle. remain as ""
var localSubtitleFileName = "";

var listener = {
	onsubtitlechange: function(duration, text, type, attriCount, attributes) {
	    document.getElementById("subtitleArea").innerHTML = text;
		console.log("subtitle duration:"+duration);
		console.log("subtitle:"+text);
		console.log("type:"+type);
		console.log("attriCount:"+attriCount);
		console.log("attributes:"+attributes);
	}
}

function play() {
	webapis.avplay.close();
	webapis.avplay.open(videoUrl);
	webapis.avplay.setListener(listener);
		
	if((subtitleUrl == "") && (localSubtitleFileName == "")){
		//You use internal subtitle
		webapis.avplay.setSilentSubtitle(true);
	}else{
		if(subtitleUrl != ""){
			//You use remote external subtitle from URL
			//You should download subtitle file to local before you use it.
			//Change downloaded subtitle file name. avplay API can't handle space in subtitle file URI.
			var subtitleFileName = "subtitle" + new Date().getTime() + subtitleUrl.substring(subtitleUrl.length - 4);;
			//Use 'wgt-private-tmp' for download folder. You don't need to deleted used subtitle files.
			var download = new tizen.DownloadRequest(subtitleUrl, "wgt-private-tmp", subtitleFileName);
			
			tizen.download.start(download, {
				oncompleted: function(downloadId, fullPath){
					tizen.filesystem.resolve("wgt-private-tmp", 
						function(e){
							var packageURI = e.toURI().substring(7); //ex: /opt/usr/apps/QQBWZxDuIM/res/wgt
							webapis.avplay.setExternalSubtitlePath(packageURI + "/" + subtitleFileName);
						},
						function(e){
							console.log(e);
						}, "r");
				}
			});
		}
		
		if(localSubtitleFileName != ""){
			//You use local packaged external subtitle
			//Copy subtitle file in project folder and write filename in localSubtitleFileName		
			tizen.filesystem.resolve("wgt-package", 
				function(e){
					var packageURI = e.toURI().substring(7); //ex: /opt/usr/apps/QQBWZxDuIM/res/wgt
					webapis.avplay.setExternalSubtitlePath(packageURI + "/" + localSubtitleFileName);
				},
				function(e){
					console.log(e);
				}, "r");
		}		
	}
	
	webapis.avplay.prepare();
	var avPlayerObj = document.getElementById("av-player");	
	webapis.avplay.setDisplayRect(avPlayerObj.offsetLeft, avPlayerObj.offsetTop, avPlayerObj.offsetWidth, avPlayerObj.offsetHeight);
	webapis.avplay.play();
}

function showSubtitle(){
	document.getElementById("subtitleArea").style.visibility = "visible";
}

function hideSubtitle(){
	document.getElementById("subtitleArea").style.visibility = "hidden";
}

function getTotalSubtitleTrack(){
	var tracks = webapis.avplay.getTotalTrackInfo();
	document.getElementById("status").innerHTML = "";
	
	for(var i = 0; i < tracks.length; i++){
		if(tracks[i].type == "TEXT"){
			console.log(tracks[i]);
			document.getElementById("status").innerHTML += "index: " + tracks[i].index + ", type: " + tracks[i].type + ", extra_info: " + tracks[i].extra_info + "<br/>"; 
		}
	}	
}

function getCurrentSubtitleTrack(){
	var tracks = webapis.avplay.getCurrentStreamInfo();
	document.getElementById("status").innerHTML = "";
	
	for(var i = 0; i < tracks.length; i++){
		if(tracks[i].type == "TEXT"){
			console.log(tracks[i]);
			document.getElementById("status").innerHTML += "index: " + tracks[i].index + ", type: " + tracks[i].type + ", extra_info: " + tracks[i].extra_info + "<br/>"; 
		}
	}	
}

function changeSubtitleTrack(){
	var totalTracks = webapis.avplay.getTotalTrackInfo();
	var currentTracks = webapis.avplay.getCurrentStreamInfo();
	var currentIndex;
	
	var firstFlag = false;
	var nextFlag = false
	var firstText;
	
	for(var i = 0; i < currentTracks.length; i++){
		if(currentTracks[i].type == "TEXT"){
			 currentIndex = currentTracks[i].index;
			 break;
		}
	}
	
	for(var i = 0; i < totalTracks.length; i++){
		if(totalTracks[i].type == "TEXT"){
			if(firstFlag == false){
				firstFlag = true;
				firstText = totalTracks[i].index;
			}
			
			if(nextFlag == true){
				webapis.avplay.setSelectTrack("TEXT", totalTracks[i].index);
				console.log("change to " + totalTracks[i].index);
				document.getElementById("status").innerHTML = "Change to " + totalTracks[i].index;
				break;
			}

			if(totalTracks[i].index == currentIndex){
				nextFlag = true;
			}
		}
	}
	
	if(nextFlag == false){
		webapis.avplay.setSelectTrack("TEXT", firstText);
		console.log("change to " + firstText);
		document.getElementById("status").innerHTML = "Change to " + firstText;
	}
}

function subtitleSync(sync){
	webapis.avplay.setSubtitlePosition(sync);
}