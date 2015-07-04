SLVDEngine.setupMainPromise = function() {
	SLVDEngine.mainPromise = new SLVD.promise();
	return SLVDEngine.mainPromise;
};

SLVDEngine.delay = function(seconds) {
	SLVDEngine.process = "delay";
	SLVDEngine.countdown = Math.round(seconds*50);
	
	SLVDEngine.mainPromise = new SLVD.promise();
	return SLVDEngine.mainPromise;
}

SLVDEngine.waitForKeyPress = function() {
	SLVDEngine.mainPromise = new SLVD.promise();
	
	SLVDEngine.countdown = 0;
	SLVDEngine.process = "wait";
	
	return SLVDEngine.mainPromise;
};

SLVDEngine.waitForEnterOrSpace = function() {
	SLVDEngine.mainPromise = new SLVD.promise();
	
	SLVDEngine.countdown = 0;
	SLVDEngine.process = "waitForEnterOrSpace";
	
	return SLVDEngine.mainPromise;
};