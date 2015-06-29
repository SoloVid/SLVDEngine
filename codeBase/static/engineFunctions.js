

SLVD.waitForKeyPress = function() {
	SLVDEngine.mainPromise = new SLVD.promise();
	
	countdown = 0;
	process = "wait";
	
	return SLVDEngine.mainPromise;
}