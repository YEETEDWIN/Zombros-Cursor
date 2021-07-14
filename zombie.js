function zombieThink() {
	for(var c=0; c<zombieRules.length; c++) {
		var rule = zombieRules[c];
		var run = false;
		if(rule.time > 0) {
			if(isTime(rule.time)) {
				run = true;
			}
		} else {
			run = true;
		}
		if(run) { rule.action(this); }
	}

	
	var xDelta = this.xStart - mouseX;
	var yDelta = this.yStart - mouseY;

	var stench = pyInt(xDelta,yDelta);
	if(stench < 10 && inGame) {
		eatBrains();
		$(this).addClass("bite");
	} else {
		$(this).removeClass("bite");
	}
	if(this.state == stateNormal) {
		if(stench > this.curNostrilStrength || !inGame) { 
			var xStep = randInt(this.curStepX * 2) - this.curStepX;
			var yStep = randInt(this.curStepY * 2) - this.curStepY;
		} else {
			var xStep = randInt(this.curStepX);
			var yStep = randInt(this.curStepY);
			if(xDelta > 0) { xStep = -xStep; }
			if(yDelta > 0) { yStep = -yStep; }
			this.stamina--;
			if(this.stamina == 0) { this.fallAsleep(); }
		}
		this.walk(xStep,yStep);
	}
	if(this.state == stateSleep) {
		this.sleep();
	}	
}

function zombieFallAsleep() {
	//$(this)[0].innerHTML = zombieSleepFace;
	$(this).addClass("zombie-sleep");
	this.state = stateSleep;
}

function zombieSleep() {
	this.sleepCount++;
	if(this.sleepCount > maxSleep && chance(mayWake)) {
		this.stamina = newStamina;
		this.sleepCount = 0;
		//$(this)[0].innerHTML = zombieFace;
		$(this).removeClass("zombie-sleep");
		this.state = stateNormal;
	}
}

function zombieWalk(xStep,yStep) {
	$(this).removeClass("zombie-walk-" + this.animate.toString());
	this.animate++;
	if(this.animate > 3) {
		this.animate = 1;
	}
	$(this).addClass("zombie-walk-" + this.animate.toString());
//	return;
	var xFinal = this.xStart + xStep;
	var yFinal = this.yStart + yStep;

	if(xFinal < 0) { xFinal = 0; }
	if(yFinal < 0) { yFinal = 0; }
	if(xFinal > maxX) { xFinal = maxX; }
	if(yFinal > maxY) { yFinal = maxY; }

	$(this).css({left:px(xFinal), top:px(yFinal)});
	this.xStart = xFinal;
	this.yStart = yFinal;
}

function spawnZombie() {
	if(zombies.length < maxZombies) {
		for(var c=0; c<curSpawn; c++) {
			var zombie = document.createElement("DIV");
			//zombie.innerHTML = zombieFace;
			$(zombie).bind("mouseover",cancelEvent);
			//Event.observe(zombie, "mouseover", function(event) { Event.stop(event); });
			var fair = false;
			var fcount = 0;
			while(!fair && fcount < 100) { // if it can't be found in 100 tries, you deserve to be eaten...
				var xNew = randInt(maxX);
				var yNew = randInt(maxY);
				var xDelta = xNew - mouseX;
				var yDelta = yNew - mouseY;
				var dist = pyInt(xDelta,yDelta);
				if(dist > minSpawn) { fair = true; }
				fcount++;
			}

			$(zombie).addClass("zombie");
			$(zombie).addClass("zombie-walk-1");
			$(zombie).css({position:"absolute", left:px(xNew), top:px(yNew)});
			zombie.xStart = xNew;
			zombie.yStart = yNew;
			zombie.curStepX = newStepX;
			zombie.curStepY = newStepY;
			zombie.curNostrilStrength = newNostrilStrength;
			zombie.state = stateNormal;
			zombie.stamina = newStamina;
			zombie.sleepCount = 0;
			zombie.think = zombieThink;
			zombie.sleep = zombieSleep;
			zombie.fallAsleep = zombieFallAsleep;
			zombie.walk = zombieWalk;
			zombie.animate = 1;

			zombies[zombies.length] = zombie;
			$("#board").append(zombie);
		}
	}
}
