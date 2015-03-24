$('document').ready(function(){
	
	// check for Detected Result Exists
	var detectedArray = [];
	var detectedResult = localStorage.getItem("detectedMaterials");
	if(detectedResult !== null) {
		// localstorage exists
		detectedArray = JSON.parse(detectedResult);
	}
	if(detectedArray.length){
		$('#lastDetectedResult').attr('disabled', false);
	}
});

function rateUs(){
	//Android.showToast("Hi Hallo");
	Android.rateUs();
}


function likeUs(){
	// About.html
	Android.likeUs();
}

function exitApp(){
	// not Used right now
	Android.exitApp();
}