SLVDEngine.images = {};
SLVDEngine.images.preloaded = {};
SLVDEngine.images.other = {};
SLVDEngine.images.blank = document.createElement("canvas");
SLVDEngine.images.blank.complete = true; //for loaded check

SLVDEngine.storeImage = function(relativePath, alias) {
	if(relativePath in SLVDEngine.images.preloaded || alias in SLVDEngine.images.preloaded)
	{
		console.log("You've already preloaded this image!!!");
		return;
	}
	
	SLVDEngine.images.preloaded[alias] = new Image();
	SLVDEngine.images.preloaded[alias].src = "files/images/" + relativePath;
};

SLVDEngine.getImage = function(relativePath) {
	if(!relativePath)
	{
		return SLVDEngine.images.blank;
	}

	if(relativePath in SLVDEngine.images.preloaded)
	{
		return SLVDEngine.images.preloaded[relativePath];
	}

	if(!(relativePath in SLVDEngine.images.other))
	{
		SLVDEngine.images.other[relativePath] = new Image();
		SLVDEngine.images.other[relativePath].src = "files/images/" + relativePath;
	}

	return SLVDEngine.images.other[relativePath];
};