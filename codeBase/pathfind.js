var PF = new Object();

function pathToTeam(finder, opTeam)
{
	//alert("start pf");
	PF.finder = finder;
	PF.opTeam = opTeam;
	PF.point = new Array();
	PF.binHeap = new Array();
	PF.pointC = new Object;
	PF.counter = 0;
	//Start with finder's point
	//Convert to tile coordinates
	PF.pointC.x = xPixToTile(PF.finder.x);
	PF.pointC.y = yPixToTile(PF.finder.y);
	//Get index (based on level's function map data) of the point
	PF.pointC.index = pixCoordToIndex(PF.pointC.x, PF.pointC.y, currentLevel.layerFuncData[PF.finder.layer]);
	//No parent
	PF.pointC.parent = -1;
	//Initial point costs nothing
	PF.pointC.GCost = 0;
	//Set this point in a more concrete variable
	PF.point[PF.pointC.index] = PF.pointC;
	//Add point to the "closed list" (location -1)
	PF.pointC.location = -1;
	var cont = 1;
	while(cont == 1)
	{
		//if(PF.counter > 1000) alert("way too many while loopings");
		//alert(PF.pointC.x + ", " + PF.pointC.y);
		//Cycle through opposing team positions
		for(var index = 0; index < PF.opTeam.length; index++)
		{
			//if(index > 100) alert("something is wrong");
			//If reached one opponent's position, set path to troop
			if(PF.pointC.x == xPixToTile(PF.opTeam[index].x) && PF.pointC.y == yPixToTile(PF.opTeam[index].y))
			{
				//alert("found target");
				//Check if spot next to target is already occupied by team member
/*				for(var second = 0; second < PF.opTeam[0].oppTeam.length; second++)
				{
					//If found a team member, but it is the finder
					if(PF.opTeam[0].oppTeam[second] == PF.finder) { }
					else if(PF.pointC.parent.x == xPixToTile(PF.opTeam[0].oppTeam[second].x) && PF.pointC.parent.y == yPixToTile(PF.opTeam[0].oppTeam[second].y))
					{
						//Pretend the target's point has not been touched
						//PF.removeOb(PF.pointC.location); //Point is already out of the heap since it was grabbed.
						delete PF.point[PF.pointC.index];
						//Skip everything else to grab a new point
						PF.skip = 1;
						second = PF.opTeam[0].oppTeam.length;
					}
				}*/
//				if(PF.skip != 1)
	//			{
					//Go backward from target troop's point to finder's point, setting the path along the way
					while(PF.pointC.parent != -1)
					{
						for(var second = PF.finder.path.x.length; second > 0; second--)
						{
							PF.finder.path.x[second] = PF.finder.path.x[second - 1];
							PF.finder.path.y[second] = PF.finder.path.y[second - 1];
						}
						PF.finder.path.x[0] = xTileToPix(PF.pointC.x);
						PF.finder.path.y[0] = yTileToPix(PF.pointC.y);
						PF.pointC = PF.pointC.parent;
					}
					//Because the last child point is the point of the target, we delete it off to keep from going there
					PF.finder.path.x.length--;
					PF.finder.path.y.length--;
					//If the path is longer than the finder's speed, shorten it to the speed/* + 1 (account for the fact that the first point is its current point)*/
					if(PF.finder.path.x.length > PF.finder.spd)
					{
						PF.finder.path.x.length = PF.finder.spd;
						PF.finder.path.y.length = PF.finder.spd;
					}
					//index = PF.opTeam.length;
					cont = null;
					delete PF.point;
					delete PF.pointC;
					delete PF.binHeap;
					delete PF.skip;
					return PF.opTeam[index];
//				}
/*				else
				{
					index = PF.opTeam.length;
				}*/
			}
		}
		//alert("through for for opponents");
		if(PF.skip != 1)
		{
			PF.evaluatePoint(PF.pointC.x, PF.pointC.y - 1); //North of current point
			PF.evaluatePoint(PF.pointC.x, PF.pointC.y + 1); //South
			PF.evaluatePoint(PF.pointC.x + 1, PF.pointC.y); //East
			PF.evaluatePoint(PF.pointC.x - 1, PF.pointC.y); //West
		}
		else
		{
			//alert("skipped");
		}
		if(PF.binHeap[1] == null)
		{
			//alert("no path");
			//No path
			cont = null;
		}
		else if(PF.binHeap[1].GCost > (5*PF.finder.spd + 1)) //Too far
		{
			//alert("out of range");
			cont = null;
		}
		else
		{
		//alert("to grab");
			PF.pointC = PF.grabOb(); //grab from binary heap PF.binHeap
			//alert("from grab");
			PF.pointC.location = -1; //Add to "closed list"
		}
		delete PF.skip;
	}
	delete PF.point;
	delete PF.pointC;
	delete PF.binHeap;
	return -1;
//alert("through pf");
	//select lowest G cost
	//add to closed list, use as reference point
	//add surroundings to open list (if not already) (and if not blocked)
	//if surrounding already added, check for if lower G cost
}

PF.evaluatePoint = function(x, y)
{
	//alert("evaluating" + x + ", " + y);
	//Get point's index
	var i = pixCoordToIndex(x, y, currentLevel.layerFuncData[PF.finder.layer]);
	//If the point has not yet been analyzed and spot on function map is not blocked
	if(PF.point[i] == null && currentLevel.layerFuncData[PF.finder.layer].data[i] != 255 && x >= 0 && y >= 0 && x < currentLevel.layerFunc[PF.finder.layer].width && y < currentLevel.layerFunc[PF.finder.layer].height)
	{
		//alert("initializing point " + i);
	//alert("setup point");
		//Set up point (as with first point)
		PF.point[i] = new Object;
		PF.point[i].x = x;
		PF.point[i].y = y;
		PF.point[i].index = i;
		PF.point[i].parent = PF.pointC;
		//GCost is one more than parent
		PF.point[i].GCost = PF.pointC.GCost + 1;
	//alert("have set properties");
		//add PF.point[i] to binHeap based on .GCost and set .location to place in binHeap
		//alert("adding");
		PF.addOb(PF.point[i]);
		//alert("add out");
		//alert("point to heap done");
	}
	else if(currentLevel.layerFuncData[PF.finder.layer].data[i] == 255 || x < 0 || y < 0 || x >= currentLevel.layerFunc[PF.finder.layer].width || y >= currentLevel.layerFunc[PF.finder.layer].height) //If point is on closed list or is blocked by terrain
	{ 
	//alert("blocked");
	} 
	else if(PF.point[i].location == -1) 
	{ 
	//	alert("closed");
	}
	else
	{
	//alert("already on open list");
		//Compare point's current GCost to its would-be GCost if parent were pointC
		if(PF.point[i].GCost > PF.pointC.GCost + 1)
		{
			//Switch point's parent to pointC
			PF.point[i].parent = PF.pointC;
			//Update point's GCost
			PF.point[i].GCost = PF.pointC.GCost + 1;
			//reposition PF.point[i] in binHeap based on .GCost
			//alert("relocating");
			PF.relocateOb(i);
			//alert("done relocating");
		}
	}
}

//Place a point in the binHeap
PF.addOb = function(ob)
{
	//Set point as cChild at end of heap
	//cChild is an index of the point
	var cChild = PF.binHeap.length;
	if(cChild == 0) cChild = 1;
	PF.binHeap[cChild] = ob;
	var cont2 = 1;
	while(cont2 == 1)
	{
		//alert("in addOb while");
		//Determine parent index
		var parent = (cChild - cChild%2)/2;
		//If the parent has a higher GCost than the child
		if(PF.binHeap[parent] == null) 
		{
			cont2 = null;
		}
		else if(PF.binHeap[parent].GCost > PF.binHeap[cChild].GCost)
		{
			//Switch the two
			PF.binHeap[cChild] = PF.binHeap[parent];
			//Update the was-parent, now-child location so it may be found easily
			PF.binHeap[cChild].location = cChild;
			//Make point the parent
			PF.binHeap[parent] = ob;
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
	if(PF.binHeap[parent] != null)
	{
		PF.binHeap[parent].location = parent;
	}
	PF.binHeap[cChild].location = cChild;
}

//Grab the top object (lowest GCost) off of PF.binHeap
PF.grabOb = function()
{
	//Grab top object off of heap for return
	var ret = PF.binHeap[1];
	//Bring last object to top of heap
	PF.binHeap[1] = PF.binHeap[PF.binHeap.length - 1];
	//Obliterate last object (since it has been moved)
	PF.binHeap.length--;
	//Set first parent for comparison
	var parent = 1;
	//Initiate while loop
	var cont2 = 1;
	while(cont2 == 1)
	{
		//Determine first child of parent
		cChild = parent*2;
		if(PF.binHeap[cChild] != null)
		{
			//If second child has lower GCost than first child, make second child the one in consideration; but first make sure there is a second child
			if(PF.binHeap[cChild + 1] != null)
			{
				if(PF.binHeap[cChild].GCost > PF.binHeap[cChild + 1].GCost)
				{
					cChild++;
				}
			}
			//If the parent's GCost is greater than the child's GCost, reverse relationship
			if(PF.binHeap[parent].GCost > PF.binHeap[cChild].GCost)
			{	
				var temp = PF.binHeap[parent];
				PF.binHeap[parent] = PF.binHeap[cChild];
				PF.binHeap[cChild] = temp;
				//Save location in object (so it may be accessed elsewhere)
				PF.binHeap[parent].location = parent;
				//If at end of heap (cChild has no children), stop loop
				if((cChild*2) >= PF.binHeap.length)
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
				PF.binHeap[parent].location = parent;
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
	PF.binHeap[parent].location = parent;
	//PF.binHeap[cChild].location = cChild;
	//Return grabbed top object
	return ret;
}

//Occasionally, an object must be removed from the heap (right now just when a path is found to the target but the spot next to the target already has a teammate).
PF.removeOb = function(index)
{
	//If object is last object, simply shorten the heap
	if(index == PF.binHeap.length - 1)
	{
		PF.binHeap.length--;
		return 1;
	}
	//Bring last object to place of removed object
	PF.binHeap[index] = PF.binHeap[PF.binHeap.length - 1];
	//Obliterate last object (since it has been moved)
	PF.binHeap.length--;
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
		if(PF.binHeap[cChild] != null)
		{
			//If second child has lower GCost than first child, make second child the one in consideration; but first make sure there is a second child
			if(PF.binHeap[cChild + 1] != null)
			{
				if(PF.binHeap[cChild].GCost > PF.binHeap[cChild + 1].GCost)
				{
					cChild++;
				}
			}
			//If the parent's GCost is greater than the child's GCost, reverse relationship
			if(PF.binHeap[parent].GCost > PF.binHeap[cChild].GCost)
			{	
				var temp = PF.binHeap[parent];
				PF.binHeap[parent] = PF.binHeap[cChild];
				PF.binHeap[cChild] = temp;
				//Save location in object (so it may be accessed elsewhere)
				PF.binHeap[parent].location = parent;
				//If at end of heap (cChild has no children), stop loop
				if((cChild*2) >= PF.binHeap.length)
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
				PF.binHeap[parent].location = parent;
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
	PF.binHeap[parent].location = parent;
	//PF.binHeap[cChild].location = cChild;
	//alert(PF.binHeap[parent].location);
}

//Because of a changed GCost of a point, check and correct the heap's validity starting at that point's known location
PF.relocateOb = function(index)
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
		if(PF.binHeap[parent].GCost > PF.binHeap[cChild].GCost)
		{
			var temp = PF.binHeap[parent];
			PF.binHeap[parent] = PF.binHeap[cChild];
			PF.binHeap[cChild] = temp;
			//Since we are moving up the heap, the lower member is left behind and needs its location saved here
			PF.binHeap[cChild].location = cChild;
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
			PF.binHeap[cChild].location = cChild;
			cont2 = null;
		}
	}
}


//Get squares player can move to
PF.getSquares = function(person)
{
	//Make person accessible across functions
	PF.person = person;
	//Since person.squares is deleted every turn, re-setup the first square
	person.squares[0] = new Object;
	person.squares[0].x = xPixToTile(person.ix);
	person.squares[0].y = yPixToTile(person.iy);
	person.squares[0].GCost = 0;
	//Loop as long as there is another square to look at
	for(var index = 0; index < person.squares.length; index++)
	{
		//Square in question is...
		PF.cSquare = person.squares[index]
		PF.evaluateSquare(person.squares[index].x, person.squares[index].y - 1); //N
		PF.evaluateSquare(person.squares[index].x, person.squares[index].y + 1); //S
		PF.evaluateSquare(person.squares[index].x + 1, person.squares[index].y); //E
		PF.evaluateSquare(person.squares[index].x - 1, person.squares[index].y); //W
	}
	//Remove marked (teammate on) squares
/*	for(var index = 0; index < PF.person.squares.length; index++)
	{
		while(PF.person.squares[index].remove == 1)
		{
			for(var second = index; second < PF.person.squares.length; second++)
			{
				PF.person.squares[second] = PF.person.squares[second + 1];
			}
			PF.person.squares.length--;
		}
	}*/
}

PF.evaluateSquare = function(x, y)
{
	//Set some variables used in this function
	var done = 0;
	var blocked = 0;
	var forRemoval = 0;
	//Determine if square has already been analyzed.
	for(var second = 0; second < PF.person.squares.length; second++)
	{
		if(x == PF.person.squares[second].x && y == PF.person.squares[second].y)
		{
			done = 1;
			second = PF.person.squares.length;
		}
	}
	//If not analyzed
	if(done != 1)
	{
		//Determine if opponent is on the square.
		for(var second = 0; second < PF.person.oppTeam.length; second++)
		{
			if(xPixToTile(PF.person.oppTeam[second].x) == x && yPixToTile(PF.person.oppTeam[second].y) == y)
			{
				blocked = 1;
			}
		}
		//Determine if a teammate is on the square.
		for(var second = 0; second < PF.person.oppTeam[0].oppTeam.length; second++)
		{
			if(PF.person.oppTeam[0].oppTeam[second] == PF.person) { } //Exception: teammate is self.
			else if(xPixToTile(PF.person.oppTeam[0].oppTeam[second].x) == x && yPixToTile(PF.person.oppTeam[0].oppTeam[second].y) == y)
			{
				//This square is still a parent square but will be removed in the end.
				forRemoval = 1;
			}
		}
		if(currentLevel.layerFuncData[PF.person.layer].data[pixCoordToIndex(x, y, currentLevel.layerFuncData[PF.person.layer])] != 255 && blocked != 1)
		{
			if(PF.cSquare.GCost + 1 <= PF.person.spd)
			{
				var ref = PF.person.squares.length;
				PF.person.squares[ref] = new Object;
				PF.person.squares[ref].x = x;
				PF.person.squares[ref].y = y;
				PF.person.squares[ref].GCost = PF.cSquare.GCost + 1;
				if(forRemoval == 1)
				{
					PF.person.squares[ref].remove = 1;
				}
			}
		}
	}
}

PF.onSquare = function(person)
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
PF.isSquare = function(x, y, person)
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

PF.reformUnitsOnSquareWithout = function(x, y, team, exMember)
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