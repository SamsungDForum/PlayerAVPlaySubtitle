function handleKeydown(event) {
	console.log('[TestApp] handleKeydown : ' + event.keyCode);

	switch(event.keyCode) {
		case 10009:
			console.log('[TestApp] return');
			tizen.application.getCurrentApplication().exit();

		break;
        default:

            break;
	}
}

var result = '';
var text = '';

var videoURL = 'http://developer.samsung.com/onlinedocs/tv/Preview/1.mp4';
var subtitleURL = 'http://developer.samsung.com/onlinedocs/tv/Preview/subtitle.smi';

var listener = {
	onsubtitlechange: function(duration, text, type, attriCount, attributes) {
	    document.getElementById('subtitle').innerHTML = text;
	}
}

function test0() {
	try {
		webapis.avplay.close();
		webapis.avplay.open(videoURL);
		webapis.avplay.setListener(listener);

		if(subtitleURL == ''){
			webapis.avplay.setSilentSubtitle(true);
		} else {
			var subtitleFileName = 'subtitle' + new Date().getTime();
			var download = new tizen.DownloadRequest(subtitleURL, 'wgt-private-tmp', subtitleFileName);

			tizen.download.start(download, {
				oncompleted: function(downloadId, fullPath){
					tizen.filesystem.resolve('wgt-private-tmp',
						function(e){
							var packageURI = e.toURI().substring(7);
							webapis.avplay.setExternalSubtitlePath(packageURI + '/' + subtitleFileName + '.smi');
						},
						function(e){
							console.log(e);
						}, 'r');
				}
			});

			webapis.avplay.prepare();
			var AVPlayer = document.getElementById('av-player');
			webapis.avplay.setDisplayRect(AVPlayer.offsetLeft, AVPlayer.offsetTop, AVPlayer.offsetWidth, AVPlayer.offsetHeight);
			webapis.avplay.play();
		}
	}
	catch(e) {
		console.log('test0 throw exception : ' + JSON.stringify(e));
	}
}

function test1() {
	document.getElementById('subtitle').style.visibility = 'visible';
}

function test2() {
	document.getElementById('subtitle').style.visibility = 'hidden';
}

function test3() {
	try {
		var tracks = webapis.avplay.getTotalTrackInfo();

		for (var i = 0; i < tracks.length; i++) {
			if (tracks[i].type == 'TEXT') {
				text = 'index: ' + tracks[i].index + ', type: ' + tracks[i].type + ', extra_info: ' + tracks[i].extra_info;
				log(text);
			}
		}
	}
	catch(e) {
		console.log('test3 throw exception : ' + JSON.stringify(e));
	}
}

function test4() {
	try {
		var tracks = webapis.avplay.getCurrentStreamInfo();

		for (var i = 0; i < tracks.length; i++) {
			if (tracks[i].type == 'TEXT') {
				text = 'index: ' + tracks[i].index + ', type: ' + tracks[i].type + ', extra_info: ' + tracks[i].extra_info;
				log(text);
				break;
			}
		}
	}
	catch(e) {
		console.log('test4 throw exception : ' + JSON.stringify(e));
	}
}

function test5() {
	try {
		var totalTracks = webapis.avplay.getTotalTrackInfo();
		var currentTracks = webapis.avplay.getCurrentStreamInfo();
		var currentIndex;

		for (var i = 0; i < currentTracks.length; i++) {
			if(currentTracks[i].type == 'TEXT'){
				 currentIndex = currentTracks[i].index;

				 break;
			}
		}

		for (var i = 0; i < totalTracks.length; i++) {
			if(totalTracks[i].type == 'TEXT') {
				if(totalTracks[i].index != currentIndex) {
					webapis.avplay.setSelectTrack('TEXT', totalTracks[i].index);

					text = 'Change to index: ' + totalTracks[i].index;
					log(text);

					break;
				}
			}
		}
	}
	catch(e) {
		console.log('test5 throw exception : ' + JSON.stringify(e));
	}
}

function test6(sync) {
	try {
		webapis.avplay.setSubtitlePosition(sync);
	}
	catch(e) {
		console.log('test6 throw exception : ' + JSON.stringify(e));
	}
}

function main() {
	console.log('[TestApp] onload');
}

function log(string) {
	result = result + '<br>' + string;
	document.getElementById('result').innerHTML = result;
}

function logClear() {
	result = '';
	document.getElementById('result').innerHTML = '';
}
