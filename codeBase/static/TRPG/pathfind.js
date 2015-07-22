SLVDEngine.PF = {};

SLVDEngine.pathToEnemy = function(finder)
{
	//alert("start pf");
	SLVDEngine.PF.finder = finder;
	SLVDEngine.PF.opTeam = opTeam;
	SLVDEngine.PF.point = [];
	SLVDEngine.PF.binHeap = [];
	SLVDEngine.PF.pointC = {};
	SLVDEngine.PF.counter = 0;
	//Start with finder's point
	//Convert to tile coordinates
	SLVDEngine.PF.pointC.x = xPixToTile(SLVDEngine.PF.finder.x);
	SLVDEngine.PF.pointC.y = yPixToTile(SLVDEngine.PF.finder.y);
	//Get index (based on SLVDEngine.level's function map data) of the point
	SLVDEngine.PF.pointC.index = pixCoordToIndex(SLVDEngine.PF.pointC.x, SLVDEngine.PF.pointC.y, SLVDEngine.currentLevel.layerFuncData[SLVDEngine.PF.finder.layer]);
	//No parent
	SLVDEngine.PF.pointC.parent = -1;
	//Initial point costs nothing
	SLVDEngine.PF.pointC.GCost = 0;
	//Set this point in a more concrete variable
	SLVDEngine.PF.point[SLVDEngine.PF.pointC.index] = SLVDEngine.PF.pointC;
	//Add point to the "closed list" (location -1)
	SLVDEngine.PF.pointC.location = -1;
	var cont = 1;
	while(cont == 1)
	{
		//if(SLVDEngine.PF.counter > 1000) alert("way too many while loopings");
		//alert(SLVDEngine.PF.pointC.x + ", " + SLVDEngine.PF.pointC.y);
		//Cycle through opposing team positions
		for(var index = 0; index < SLVDEngine.boardAgent.length; index++)
		{
			var currentAgent = SLVDEngine.boardAgent[index];
			if(!currentAgent.getTeam().isAllied(SLVDEngine.PF.finder.getTeam()))
			{
				//if(index > 100) alert("something is wrong");
				//If reached one opponent's position, set path to troop
				if(SLVDEngine.PF.pointC.x == xPixToTile(currentAgent.x) && SLVDEngine.PF.pointC.y == yPixToTile(currentAgent.y))
				{
					//alert("found target");
					//Check if spot next to target is already occupied by team member
	/*				for(var second = 0; second < SLVDEngine.PF.opTeam[0].oppTeam.length; second++)
					{
						//If found a team member, but it is the finder
						if(SLVDEngine.PF.opTeam[0].oppTeam[second] == SLVDEngine.PF.finder) { }
						else if(SLVDEngine.PF.pointC.parent.x == xPixToTile(SLVDEngine.PF.opTeam[0].oppTeam[second].x) && SLVDEngine.PF.pointC.parent.y == yPixToTile(SLVDEngine.PF.opTeam[0].oppTeam[second].y))
						{
							//Pretend the target's point has not been touched
							//SLVDEngine.PF.removeOb(SLVDEngine.PF.pointC.location); //Point is already out of the heap since it was grabbed.
							delete SLVDEngine.PF.point[SLVDEngine.PF.pointC.index];
							//Skip everything else to grab a new point
							SLVDEngine.PF.skip = 1;
							second = SLVDEngine.PF.opTeam[0].oppTeam.length;
						}
					}*/
	//				if(SLVDEngine.PF.skip != 1)
		//			{
						//Go backward from target troop's point to finder's point, setting the path along the way
						while(SLVDEngine.PF.pointC.parent != -1)
						{
							for(var second = SLVDEngine.PF.finder.path.x.length; second > 0; second--)
							{
								SLVDEngine.PF.finder.path.x[second] = SLVDEngine.PF.finder.path.x[second - 1];
								SLVDEngine.PF.finder.path.y[second] = SLVDEngine.PF.finder.path.y[second - 1];
							}
							SLVDEngine.PF.finder.path.x[0] = xTileToPix(SLVDEngine.PF.pointC.x);
							SLVDEngine.PF.finder.path.y[0] = yTileToPix(SLVDEngine.PF.pointC.y);
							SLVDEngine.PF.pointC = SLVDEngine.PF.pointC.parent;
						}
						//Because the last child point is the point of the target, we delete it off to keep from going there
						SLVDEngine.PF.finder.path.x.length--;
						SLVDEngine.PF.finder.path.y.length--;
						//If the path is longer than the finder's speed, shorten it to the speed/* + 1 (account for the fact that the first point is its current point)*/
						if(SLVDEngine.PF.finder.path.x.length > SLVDEngine.PF.finder.spd)
						{
							SLVDEngine.PF.finder.path.x.length = SLVDEngine.PF.finder.spd;
							SLVDEngine.PF.finder.path.y.length = SLVDEngine.PF.finder.spd;
						}
						//index = SLVDEngine.PF.opTeam.length;
						cont = null;
						delete SLVDEngine.PF.point;
						delete SLVDEngine.PF.pointC;
						delete SLVDEngine.PF.binHeap;
						delete SLVDEngine.PF.skip;
						return SLVDEngine.PF.opTeam[index];
	//				}
	/*				else
					{
						index = SLVDEngine.PF.opTeam.length;
					}*/
				}
			}
		}
		//alert("through for for opponents");
		if(SLVDEngine.PF.skip != 1)
		{
			SLVDEngine.PF.evaluatePoint(SLVDEngine.PF.pointC.x, SLVDEngine.PF.pointC.y - 1); //North of current point
			SLVDEngine.PF.evaluatePoint(SLVDEngine.PF.pointC.x, SLVDEngine.PF.pointC.y + 1); //South
			SLVDEngine.PF.evaluatePoint(SLVDEngine.PF.pointC.x + 1, SLVDEngine.PF.pointC.y); //East
			SLVDEngine.PF.evaluatePoint(SLVDEngine.PF.pointC.x - 1, SLVDEngine.PF.pointC.y); //West
		}
		else
		{
			//alert("skipped");
		}
		if(SLVDEngine.PF.binHeap[1] == null)
		{
			//alert("no path");
			//No path
			cont = null;
		}
		else if(SLVDEngine.PF.binHeap[1].GCost > (5*SLVDEngine.PF.finder.spd + 1)) //Too far
		{
			//alert("out of range");
			cont = null;
		}
		else
		{
		//alert("to grab");
			SLVDEngine.PF.pointC = SLVDEngine.PF.grabOb(); //grab from binary heap SLVDEngine.PF.binHeap
			//alert("from grab");
			SLVDEngine.PF.pointC.location = -1; //Add to "closed list"
		}
		delete SLVDEngine.PF.skip;
	}
	delete SLVDEngine.PF.point;
	delete SLVDEngine.PF.pointC;
	delete SLVDEngine.PF.binHeap;
	return -1;
//alert("through pf");
	//select lowest G cost
	//add to closed list, use as reference point
	//add surroundings to open list (if not already) (and if not blocked)
	//if surrounding already added, check for if lower G cost
};

SLVDEngine.pathToTeam = function(finder, opTeam)
{
	//alert("start pf");
	SLVDEngine.PF.finder = finder;
	SLVDEngine.PF.opTeam = opTeam;
	SLVDEngine.PF.point = [];
	SLVDEngine.PF.binHeap = [];
	SLVDEngine.PF.pointC = {};
	SLVDEngine.PF.counter = 0;
	//Start with finder's point
	//Convert to tile coordinates
	SLVDEngine.PF.pointC.x = xPixToTile(SLVDEngine.PF.finder.x);
	SLVDEngine.PF.pointC.y = yPixToTile(SLVDEngine.PF.finder.y);
	//Get index (based on SLVDEngine.level's function map data) of the point
	SLVDEngine.PF.pointC.index = pixCoordToIndex(SLVDEngine.PF.pointC.x, SLVDEngine.PF.pointC.y, SLVDEngine.currentLevel.layerFuncData[SLVDEngine.PF.finder.layer]);
	//No parent
	SLVDEngine.PF.pointC.parent = -1;
	//Initial point costs nothing
	SLVDEngine.PF.pointC.GCost = 0;
	//Set this point in a more concrete variable
	SLVDEngine.PF.point[SLVDEngine.PF.pointC.index] = SLVDEngine.PF.pointC;
	//Add point to the "closed list" (location -1)
	SLVDEngine.PF.pointC.location = -1;
	var cont = 1;
	while(cont == 1)
	{
		//if(SLVDEngine.PF.counter > 1000) alert("way too many while loopings");
		//alert(SLVDEngine.PF.pointC.x + ", " + SLVDEngine.PF.pointC.y);
		//Cycle through opposing team positions
		for(var index = 0; index < SLVDEngine.PF.opTeam.length; index++)
		{
			//if(index > 100) alert("something is wrong");
			//If reached one opponent's position, set path to troop
			if(SLVDEngine.PF.pointC.x == xPixToTile(SLVDEngine.PF.opTeam[index].x) && SLVDEngine.PF.pointC.y == yPixToTile(SLVDEngine.PF.opTeam[index].y))
			{
				//alert("found target");
				//Check if spot next to target is already occupied by team member
/*				for(var second = 0; second < SLVDEngine.PF.opTeam[0].oppTeam.length; second++)
				{
					//If found a team member, but it is the finder
					if(SLVDEngine.PF.opTeam[0].oppTeam[second] == SLVDEngine.PF.finder) { }
					else if(SLVDEngine.PF.pointC.parent.x == xPixToTile(SLVDEngine.PF.opTeam[0].oppTeam[second].x) && SLVDEngine.PF.pointC.parent.y == yPixToTile(SLVDEngine.PF.opTeam[0].oppTeam[second].y))
					{
						//Pretend the target's point has not been touched
						//SLVDEngine.PF.removeOb(SLVDEngine.PF.pointC.location); //Point is already out of the heap since it was grabbed.
						delete SLVDEngine.PF.point[SLVDEngine.PF.pointC.index];
						//Skip everything else to grab a new point
						SLVDEngine.PF.skip = 1;
						second = SLVDEngine.PF.opTeam[0].oppTeam.length;
					}
				}*/
//				if(SLVDEngine.PF.skip != 1)
	//			{
					//Go backward from target troop's point to finder's point, setting the path along the way
					while(SLVDEngine.PF.pointC.parent != -1)
					{
						for(var second = SLVDEngine.PF.finder.path.x.length; second > 0; second--)
						{
							SLVDEngine.PF.finder.path.x[second] = SLVDEngine.PF.finder.path.x[second - 1];
							SLVDEngine.PF.finder.path.y[second] = SLVDEngine.PF.finder.path.y[second - 1];
						}
						SLVDEngine.PF.finder.path.x[0] = xTileToPix(SLVDEngine.PF.pointC.x);
						SLVDEngine.PF.finder.path.y[0] = yTileToPix(SLVDEngine.PF.pointC.y);
						SLVDEngine.PF.pointC = SLVDEngine.PF.pointC.parent;
					}
					//Because the last child point is the point of the target, we delete it off to keep from going there
					SLVDEngine.PF.finder.path.x.length--;
					SLVDEngine.PF.finder.path.y.length--;
					//If the path is longer than the finder's speed, shorten it to the speed/* + 1 (account for the fact that the first point is its current point)*/
					if(SLVDEngine.PF.finder.path.x.length > SLVDEngine.PF.finder.spd)
					{
						SLVDEngine.PF.finder.path.x.length = SLVDEngine.PF.finder.spd;
						SLVDEngine.PF.finder.path.y.length = SLVDEngine.PF.finder.spd;
					}
					//index = SLVDEngine.PF.opTeam.length;
					cont = null;
					delete SLVDEngine.PF.point;
					delete SLVDEngine.PF.pointC;
					delete SLVDEngine.PF.binHeap;
					delete SLVDEngine.PF.skip;
					return SLVDEngine.PF.opTeam[index];
//				}
/*				else
				{
					index = SLVDEngine.PF.opTeam.length;
				}*/
			}
		}
		//alert("through for for opponents");
		if(SLVDEngine.PF.skip != 1)
		{
			SLVDEngine.PF.evaluatePoint(SLVDEngine.PF.pointC.x, SLVDEngine.PF.pointC.y - 1); //North of current point
			SLVDEngine.PF.evaluatePoint(SLVDEngine.PF.pointC.x, SLVDEngine.PF.pointC.y + 1); //South
			SLVDEngine.PF.evaluatePoint(SLVDEngine.PF.pointC.x + 1, SLVDEngine.PF.pointC.y); //East
			SLVDEngine.PF.evaluatePoint(SLVDEngine.PF.pointC.x - 1, SLVDEngine.PF.pointC.y); //West
		}
		else
		{
			//alert("skipped");
		}
		if(SLVDEngine.PF.binHeap[1] == null)
		{
			//alert("no path");
			//No path
			cont = null;
		}
		else if(SLVDEngine.PF.binHeap[1].GCost > (5*SLVDEngine.PF.finder.spd + 1)) //Too far
		{
			//alert("out of range");
			cont = null;
		}
		else
		{
		//alert("to grab");
			SLVDEngine.PF.pointC = SLVDEngine.PF.grabOb(); //grab from binary heap SLVDEngine.PF.binHeap
			//alert("from grab");
			SLVDEngine.PF.pointC.location = -1; //Add to "closed list"
		}
		delete SLVDEngine.PF.skip;
	}
	delete SLVDEngine.PF.point;
	delete SLVDEngine.PF.pointC;
	delete SLVDEngine.PF.binHeap;
	return -1;
//alert("through pf");
	//select lowest G cost
	//add to closed list, use as reference point
	//add surroundings to open list (if not already) (and if not blocked)
	//if surrounding already added, check for if lower G cost
};

SLVDEngine.PF.evaluatePoint = function(x, y)
{
	//alert("evaluating" + x + ", " + y);
	//Get point's index
	var i = pixCoordToIndex(x, y, SLVDEngine.currentLevel.layerFuncData[SLVDEngine.PF.finder.layer]);
	//If the point has not yet been analyzed and spot on SLVDEngine.map = function is not blocked
	if(SLVDEngine.PF.point[i] == null && SLVDEngine.currentLevel.layerFuncData[SLVDEngine.PF.finder.layer].data[i] != 255 && x >= 0 && y >= 0 && x < SLVDEngine.currentLevel.layerFunc[SLVDEngine.PF.finder.layer].width && y < SLVDEngine.currentLevel.layerFunc[SLVDEngine.PF.finder.layer].height)
	{
		//alert("initializing point " + i);
	//alert("setup point");
		//Set up point (as with first point)
		SLVDEngine.PF.point[i] = new Object;
		SLVDEngine.PF.point[i].x = x;
		SLVDEngine.PF.point[i].y = y;
		SLVDEngine.PF.point[i].index = i;
		SLVDEngine.PF.point[i].parent = SLVDEngine.PF.pointC;
		//GCost is one more than parent
		SLVDEngine.PF.point[i].GCost = SLVDEngine.PF.pointC.GCost + 1;
	//alert("have set properties");
		//add SLVDEngine.PF.point[i] to binHeap based on .GCost and set .location to place in binHeap
		//alert("adding");
		SLVDEngine.PF.addOb(SLVDEngine.PF.point[i]);
		//alert("add out");
		//alert("point to heap done");
	}
	else if(SLVDEngine.currentLevel.layerFuncData[SLVDEngine.PF.finder.layer].data[i] == 255 || x < 0 || y < 0 || x >= SLVDEngine.currentLevel.layerFunc[SLVDEngine.PF.finder.layer].width || y >= SLVDEngine.currentLevel.layerFunc[SLVDEngine.PF.finder.layer].height) //If point is on closed list or is blocked by terrain
	{ 
	//alert("blocked");
	} 
	else if(SLVDEngine.PF.point[i].location == -1) 
	{ 
	//	alert("closed");
	}
	else
	{
	//alert("already on open list");
		//Compare point's current GCost to its would-be GCost if parent were pointC
		if(SLVDEngine.PF.point[i].GCost > SLVDEngine.PF.pointC.GCost + 1)
		{
			//Switch point's parent to pointC
			SLVDEngine.PF.point[i].parent = SLVDEngine.PF.pointC;
			//Update point's GCost
			SLVDEngine.PF.point[i].GCost = SLVDEngine.PF.pointC.GCost + 1;
			//reposition SLVDEngine.PF.point[i] in binHeap based on .GCost
			//alert("relocating");
			SLVDEngine.PF.relocateOb(i);
			//alert("done relocating");
		}
	}
};

//Place a point in the binHeap
SLVDEngine.PF.addOb = function(ob)
{
	//Set point as cChild at end of heap
	//cChild is an index of the point
	var cChild = SLVDEngine.PF.binHeap.length;
	if(cChild == 0) cChild = 1;
	SLVDEngine.PF.binHeap[cChild] = ob;
	var cont2 = 1;
	while(cont2 == 1)
	{
		//alert("in addOb while");
		//Determine parent index
		var parent = (cChild - cChild%2)/2;
		//If the parent has a higher GCost than the child
		if(SLVDEngine.PF.binHeap[parent] == null) 
		{
			cont2 = null;
		}
		else if(SLVDEngine.PF.binHeap[parent].GCost > SLVDEngine.PF.binHeap[cChild].GCost)
		{
			//Switch the two
			SLVDEngine.PF.binHeap[cChild] = SLVDEngine.PF.binHeap[parent];
			//Update the was-parent, now-child location so it may be found easily
			SLVDEngine.PF.binHeap[cChild].location = cChild;
			//Make point the parent
			SLVDEngine.PF.binHeap[parent] = ob;
			//If at top of heap, stop
			if(parent == 1)
			{
				cont2 = null;
			}
			//cChild is now where parent had been
			cChild = parent;
		}
		else { cont2 = null; }; //If heap is valid, stop
	}
	//Save last two points' locations for easy access
	if(SLVDEngine.PF.binHeap[parent] != null)
	{
		SLVDEngine.PF.binHeap[parent].location = parent;
	}
	SLVDEngine.PF.binHeap[cChild].location = cChild;
}

//Grab the top object (lowest GCost) off of SLVDEngine.PF.binHeap
SLVDEngine.PF.grabOb = function()
{
	//Grab top object off of heap for return
	var ret = SLVDEngine.PF.binHeap[1];
	//Bring last object to top of heap
	SLVDEngine.PF.binHeap[1] = SLVDEngine.PF.binHeap[SLVDEngine.PF.binHeap.length - 1];
	//Obliterate last object (since it has been moved)
	SLVDEngine.PF.binHeap.length--;
	//Set first parent for comparison
	var parent = 1;
	//Initiate while loop
	var cont2 = 1;
	while(cont2 == 1)
	{
		//Determine first child of parent
		cChild = parent*2;
		if(SLVDEngine.PF.binHeap[cChild] != null)
		{
			//If second child has lower GCost than first child, make second child the one in consideration; but first make sure there is a second child
			if(SLVDEngine.PF.binHeap[cChild + 1] != null)
			{
				if(SLVDEngine.PF.binHeap[cChild].GCost > SLVDEngine.PF.binHeap[cChild + 1].GCost)
				{
					cChild++;
				}
			}
			//If the parent's GCost is greater than the child's GCost, reverse relationship
			if(SLVDEngine.PF.binHeap[parent].GCost > SLVDEngine.PF.binHeap[cChild].GCost)
			{	
				var temp = SLVDEngine.PF.binHeap[parent];
				SLVDEngine.PF.binHeap[parent] = SLVDEngine.PF.binHeap[cChild];
				SLVDEngine.PF.binHeap[cChild] = temp;
				//Save location in object (so it may be accessed elsewhere)
				SLVDEngine.PF.binHeap[parent].location = parent;
				//If at end of heap (cChild has no children), stop loop
				if((cChild*2) >= SLVDEngine.PF.binHeap.length)
				{
					cont2 = null;
				}
/*				else
				{*/
					//Move down heap
					parent = cChild;
//				}
			}
			else //Heap is valid
			{
				//Save location
				SLVDEngine.PF.binHeap[parent].location = parent;
				//End loop
				cont2 = null; 
			}
		}
		else
		{
			cont2 = null;
		}
	}
	//Save location for backwards finding
	SLVDEngine.PF.binHeap[parent].location = parent;
	//SLVDEngine.PF.binHeap[cChild].location = cChild;
	//Return grabbed top object
	return ret;
}

//Occasionally, an object must be removed from the heap (right now just when a path is found to the target but the spot next to the target already has a teammate).
SLVDEngine.PF.removeOb = function(index)
{
	//If object is last object, simply shorten the heap
	if(index == SLVDEngine.PF.binHeap.length - 1)
	{
		SLVDEngine.PF.binHeap.length--;
		return 1;
	}
	//Bring last object to place of removed object
	SLVDEngine.PF.binHeap[index] = SLVDEngine.PF.binHeap[SLVDEngine.PF.binHeap.length - 1];
	//Obliterate last object (since it has been moved)
	SLVDEngine.PF.binHeap.length--;
	//Set first parent for comparison
	var parent = index;
	//Initiate while loop
	var cont2 = 1;
	var times = 0;
	while(cont2 == 1)
	{
		//alert(times);
		//Determine first child of parent
		cChild = parent*2;
		//If child exists
		if(SLVDEngine.PF.binHeap[cChild] != null)
		{
			//If second child has lower GCost than first child, make second child the one in consideration; but first make sure there is a second child
			if(SLVDEngine.PF.binHeap[cChild + 1] != null)
			{
				if(SLVDEngine.PF.binHeap[cChild].GCost > SLVDEngine.PF.binHeap[cChild + 1].GCost)
				{
					cChild++;
				}
			}
			//If the parent's GCost is greater than the child's GCost, reverse relationship
			if(SLVDEngine.PF.binHeap[parent].GCost > SLVDEngine.PF.binHeap[cChild].GCost)
			{	
				var temp = SLVDEngine.PF.binHeap[parent];
				SLVDEngine.PF.binHeap[parent] = SLVDEngine.PF.binHeap[cChild];
				SLVDEngine.PF.binHeap[cChild] = temp;
				//Save location in object (so it may be accessed elsewhere)
				SLVDEngine.PF.binHeap[parent].location = parent;
				//If at end of heap (cChild has no children), stop loop
				if((cChild*2) >= SLVDEngine.PF.binHeap.length)
				{
					cont2 = null;
				}
/*				else
				{*/
					//Move down heap
					parent = cChild;
//				}
			}
			else //Heap is valid
			{
				//Save location
				SLVDEngine.PF.binHeap[parent].location = parent;
				//End loop
				cont2 = null; 
			}
		}
		else
		{
			cont2 = null;
		}
		times++;
	}
	//Save location for backwards finding
	SLVDEngine.PF.binHeap[parent].location = parent;
	//SLVDEngine.PF.binHeap[cChild].location = cChild;
	//alert(SLVDEngine.PF.binHeap[parent].location);
}

//Because of a changed GCost of a point, check and correct the heap's validity starting at that point's known location
SLVDEngine.PF.relocateOb = function(index)
{
	//If point is already at the top of the heap, end
	if(index == 1)
	{
		return 1;
	}
	//GCost of a point is only ever going to be decreased; thus we only need to check it going upward in the heap. Hence, the point is our first child
	var cChild = index;
	var cont2 = 1;
	while(cont2 == 1)
	{
		//Determine parent
		var parent = (cChild - cChild%2)/2;
		//If parent has greater GCost than child, switch them
		if(SLVDEngine.PF.binHeap[parent].GCost > SLVDEngine.PF.binHeap[cChild].GCost)
		{
			var temp = SLVDEngine.PF.binHeap[parent];
			SLVDEngine.PF.binHeap[parent] = SLVDEngine.PF.binHeap[cChild];
			SLVDEngine.PF.binHeap[cChild] = temp;
			//Since we are moving up the heap, the lower member is left behind and needs its location saved here
			SLVDEngine.PF.binHeap[cChild].location = cChild;
			//If at top of heap, stop
			if(parent == 1)
			{
				cont2 = null;
			}
			else
			{
				//Move up heap
				cChild = parent;
			}
		}
		else
		{
			//Final child stays (and so does final parent)
			SLVDEngine.PF.binHeap[cChild].location = cChild;
			cont2 = null;
		}
	}
}


//Get squares SLVDEngine.player can move to
SLVDEngine.PF.getSquares = function(person)
{
	//Make person accessible across functions
	SLVDEngine.PF.person = person;
	//Since person.squares is deleted every turn, re-setup the first square
	person.squares[0] = new Object;
	person.squares[0].x = xPixToTile(person.ix);
	person.squares[0].y = yPixToTile(person.iy);
	person.squares[0].GCost = 0;
	//Loop as long as there is another square to look at
	for(var index = 0; index < person.squares.length; index++)
	{
		//Square in question is...
		SLVDEngine.PF.cSquare = person.squares[index]
		SLVDEngine.PF.evaluateSquare(person.squares[index].x, person.squares[index].y - 1); //N
		SLVDEngine.PF.evaluateSquare(person.squares[index].x, person.squares[index].y + 1); //S
		SLVDEngine.PF.evaluateSquare(person.squares[index].x + 1, person.squares[index].y); //E
		SLVDEngine.PF.evaluateSquare(person.squares[index].x - 1, person.squares[index].y); //W
	}
	//Remove marked (teammate on) squares
/*	for(var index = 0; index < SLVDEngine.PF.person.squares.length; index++)
	{
		while(SLVDEngine.PF.person.squares[index].remove == 1)
		{
			for(var second = index; second < SLVDEngine.PF.person.squares.length; second++)
			{
				SLVDEngine.PF.person.squares[second] = SLVDEngine.PF.person.squares[second + 1];
			}
			SLVDEngine.PF.person.squares.length--;
		}
	}*/
}

SLVDEngine.PF.evaluateSquare = function(x, y)
{
	//Set some variables used in this function
	var done = 0;
	var blocked = 0;
	var forRemoval = 0;
	//Determine if square has already been analyzed.
	for(var second = 0; second < SLVDEngine.PF.person.squares.length; second++)
	{
		if(x == SLVDEngine.PF.person.squares[second].x && y == SLVDEngine.PF.person.squares[second].y)
		{
			done = 1;
			second = SLVDEngine.PF.person.squares.length;
		}
	}
	//If not analyzed
	if(done != 1)
	{
		//Determine if opponent is on the square.
		for(var second = 0; second < SLVDEngine.PF.person.oppTeam.length; second++)
		{
			if(xPixToTile(SLVDEngine.PF.person.oppTeam[second].x) == x && yPixToTile(SLVDEngine.PF.person.oppTeam[second].y) == y)
			{
				blocked = 1;
			}
		}
		//Determine if a teammate is on the square.
		for(var second = 0; second < SLVDEngine.PF.person.oppTeam[0].oppTeam.length; second++)
		{
			if(SLVDEngine.PF.person.oppTeam[0].oppTeam[second] == SLVDEngine.PF.person) { } //Exception: teammate is self.
			else if(xPixToTile(SLVDEngine.PF.person.oppTeam[0].oppTeam[second].x) == x && yPixToTile(SLVDEngine.PF.person.oppTeam[0].oppTeam[second].y) == y)
			{
				//This square is still a parent square but will be removed in the end.
				forRemoval = 1;
			}
		}
		if(SLVDEngine.currentLevel.layerFuncData[SLVDEngine.PF.person.layer].data[pixCoordToIndex(x, y, SLVDEngine.currentLevel.layerFuncData[SLVDEngine.PF.person.layer])] != 255 && blocked != 1)
		{
			if(SLVDEngine.PF.cSquare.GCost + 1 <= SLVDEngine.PF.person.spd)
			{
				var ref = SLVDEngine.PF.person.squares.length;
				SLVDEngine.PF.person.squares[ref] = new Object;
				SLVDEngine.PF.person.squares[ref].x = x;
				SLVDEngine.PF.person.squares[ref].y = y;
				SLVDEngine.PF.person.squares[ref].GCost = SLVDEngine.PF.cSquare.GCost + 1;
				if(forRemoval == 1)
				{
					SLVDEngine.PF.person.squares[ref].remove = 1;
				}
			}
		}
	}
}

SLVDEngine.PF.onSquare = function(person)
{
	for(var index = 0; index < person.squares.length; index++)
	{
		if(person.squares[index].x == xPixToTile(person.x) && person.squares[index].y == yPixToTile(person.y))
		{
			return 1;
		}
	}
	return 0;
}
 //Check if a coordinate is a square
SLVDEngine.PF.isSquare = function(x, y, person)
{
	for(var index = 0; index < person.squares.length; index++)
	{
		if(person.squares[index].x == xPixToTile(x) && person.squares[index].y == yPixToTile(y))
		{
			return 1;
		}
	}
	return 0;
}

SLVDEngine.PF.reformUnitsOnSquareWithout = function(x, y, team, exMember)
{
	var unit = new Array;
	unit.length = 0;
	for(var index = 0; index < team.length; index++)
	{
		if(xPixToTile(team[index].x) == x && yPixToTile(team[index].y) == y && team[index] != exMember) unit[unit.length] = team[index];
	}
	if(unit.length == 1)
	{
		unit[0].x = xTileToPix(x);
		unit[0].y = yTileToPix(y);
	}
	else
	{
		try
		{
			unit[0].x = xTileToPix(x) - 8;
			unit[0].y = yTileToPix(y) + 8;
			unit[1].x = xTileToPix(x) + 8;
			unit[1].y = yTileToPix(y) - 8;
			unit[2].x = xTileToPix(x) - 8;
			unit[2].y = yTileToPix(y) - 8;
			unit[3].x = xTileToPix(x) + 8;
			unit[3].y = yTileToPix(y) + 8;
			unit[4].x = xTileToPix(x) - 0;
			unit[4].y = yTileToPix(y) + 0;
		}
		catch(e)
		{
			return 0;
		}
	}
}