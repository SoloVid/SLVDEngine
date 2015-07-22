SLVDEngine.SpriteTemplate["arrow"] = function() {
	this.giveAction(new SLVDEngine.Action["propelProjectile"](2));
};

t = SLVDEngine.SpriteTemplate["arrow"];
t.prototype = new SLVDEngine.Sprite();
t.prototype.constructor = t;

t.prototype.img = "arrow.png";
t.prototype.omniDir = true;
t.prototype.strg = 3;
t.prototype.spd = 16;
t.prototype.xres = 31;
t.prototype.yres = 6;
t.prototype.baseLength = 8;
t.prototype.baseOffX = 10;
t.prototype.baseOffY = 1;
t.prototype.offY = -28;

t.prototype.atk = 3;