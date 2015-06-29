var modelSpriteTemplate = {};

for(var template in SpriteTemplate)
{
	modelSpriteTemplate[template] = new SpriteTemplate[template]();
}