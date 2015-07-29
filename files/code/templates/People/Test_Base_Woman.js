SLVDEngine.SpriteTemplate["Test_Base_Woman"] = function() {
	this.giveAction(new SLVDEngine.Motion["random"]());
};

t = SLVDEngine.SpriteTemplate["Test_Base_Woman"];

t.prototype = new SLVDEngine.Sprite();
t.prototype.constructor = t;

t.prototype.name = "Woman";
t.prototype.img = "Woman_Sprite_Sheet.png";
t.prototype.xres = 32;
t.prototype.yres = 64;
t.prototype.team = "neutral";
t.prototype.hp = 70;
t.prototype.strg = 70;
t.prototype.spd = 2;
t.prototype.dmnr = 2;
t.prototype.mvmt = 1;