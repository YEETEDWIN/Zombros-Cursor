function thingThink() {

}


function spawnThing() {
	if(chance(mayThing) && things.length < maxThings) {
		var thing = document.createElement("DIV");	

		thing.type = randInt(thingRules.length-1);
		thing.rule = thingRules[thing.type];
		thing.think = thing.rule.action;

		$(thing)[0].innerHTML = thing.rule.face;
		$(thing).addClass("thing");

		var xNew = randInt(maxX);
		var yNew = randInt(maxY);

		$(thing).css({position:"absolute", left:px(xNew), top:px(yNew)});
		thing.xStart = xNew;
		thing.yStart = yNew;
		
		things[things.length] = thing;
		$("#board").append(thing);
		
	}
}


function chuckAction() {
	if(this.xUp) {
		this.xStart++;
	} else {
		this.xStart--;
	}
	if(this.xStart <= 0) {
		this.xUp = true;
		this.xStart = 0;
	}
	if(this.xStart >= maxX) {
		this.xUp = false;
		this.xStart = maxX;
	}

	if(this.yUp) {
		this.yStart++;
	} else {
		this.yStart--;
	}
	if(this.yStart <= 0) {
		this.yUp = true;
		this.yStart = 0;
	}
	if(this.yStart >= maxY) {
		this.yUp = false;
		this.yStart = maxY;
	}

	$(this).css({left:px(this.xStart), top:px(this.yStart)});
}

function freezeAction() {
	var xDelta = this.xStart - mouseX;
	var yDelta = this.yStart - mouseY;

	var stench = pyInt(xDelta,yDelta);
	if(stench < 10 && inGame && !this.alerted) {
		showAlert("FREEZE!");
		this.alerted = true;
	}
}
