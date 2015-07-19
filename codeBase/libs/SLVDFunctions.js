var SLVD = {};

//Promises for SLVDEngine
SLVD.promise = function() {
//	console.log(this);
};
SLVD.promise.prototype.then = function(callBack) {
	if("data" in this) {
		return callBack(this.data);
	}
	else {
		this.callBack = callBack;
		
		this.babyPromise = new SLVD.promise();
		
		return this.babyPromise;
	}
};
SLVD.promise.prototype.resolve = function(data) {
	if(this.callBack) {
		var tPromise = this.callBack(data);
		
		if(this.babyPromise) {
			if(!(tPromise instanceof SLVD.promise)) {
				this.babyPromise.resolve(tPromise);
			}
			else if("data" in tPromise) {
				this.babyPromise.resolve(tPromise.data);
			}
			else {
				tPromise.callBack = this.babyPromise.callBack;
				if(this.babyPromise.babyPromise) {
				tPromise.babyPromise = this.babyPromise.babyPromise;
				}
			}
		}
	}
	else {
		this.data = data;
	}
};
SLVD.promise.as = function(data) {
	var prom = new SLVD.promise();
	prom.resolve(data);
	return prom;
};

SLVD.speedCheck = function(name, comparison) {
	this.date = new Date();
	this.name = name;
	this.prior = comparison;
};
SLVD.speedCheck.prototype.getTime = function() {
	return this.date.getMilliseconds() - this.prior.getMilliseconds();
};
SLVD.speedCheck.prototype.logUnusual = function(allow) {
	if(!allow)
	{
		allow = 1;
	}
	if(this.getTime() > allow) {
		//console.log(this.name + " took " + this.getTime() + " milliseconds");
	}
};