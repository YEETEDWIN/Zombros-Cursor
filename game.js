
function reboot() {
	undead = false;
	if(first) {
		$("#world").show();
		first = false;
	}
	setTimeout("finishReboot();",(1000/maxFPS)*4); // Avoid multiple game loops
}

function finishReboot() {
	gameNumber++;

	maxX = parseInt($("#board")[0].offsetWidth,10)-16;
	maxY = parseInt($("#board")[0].offsetHeight,10)-18;
	
	counter = 1;
	score = 0;
	updateScore();
	for(var c=0; c<zombies.length; c++) {
		$(zombies[c]).remove();
	}
	zombies.length = 0;
	$("#overlayText")[0].innerHTML = "";
	$("#overlayShare").hide();

	curSpawn = newSpawn;
	eaten = false;
	rotateTip();	
	if(inGame == true) {
		inGame = false;
		gameOn();
	}
	showAlert("READY...GO!");
	gtag('event', 'game_start', {
		'event_label': session + "-" + gameNumber.toString()
	});
}


function gameOn() {
	if(!inGame) {
		undead = true;
		inGame = true;
		gameLoop();
	}
}

function gameOff(e) {
	if(!e) { e = event; }
	inGame = false;
	if(!eaten) {
		eatBrains(2);
	}
}

function gameLoop() {
	if(undead) {
		for(var c=0; c<gameRules.length; c++) {
			var rule = gameRules[c];
			var run = false;
			if(rule.time > 0) {
				if(isTime(rule.time)) {
					run = true;
				}
			} else {
				run = true;
			}
			if(run) { rule.action(); }
		}
		setTimeout("gameLoop();",1000/maxFPS);
		counter++;
	}
}

function stagger() {
	for(var c=0; c<things.length; c++) {
		if(things[c].think) { things[c].think(); }
	}
	for(var c=0; c<zombies.length; c++) {
		zombies[c].think();
	}
}


function eatBrains(deathType) {
	if(!eaten) {
		var deathMessage;
		switch(deathType) {
		case 2:
			deathMessage = "YOU RAN INTO A WALL.. AND THEN GOT EATEN.";
			break;
		default:
			deathMessage = "YOU HAVE BEEN EATEN.";
			break;
		}
		if(score > maxScore) {
			maxScore = score;
		}
		
		$("#overlayText")[0].innerHTML = deathMessage + "<br>GAME OVER!<br>YOUR FINAL SCORE WAS " + score.toString() + "<br><span style=\"font-size: 0.6em\">Click to restart</span>";
		$("#overlayShare").show();
		clearAlert();
		eaten = true;
		gtag('event', 'game_over', {
			'event_label': session + "-" + gameNumber.toString(),
			'value': score
		});
	}
}


function updateScore() {
	$("#scoreValue")[0].innerHTML = score.toString() + ", High: " + maxScore.toString();
}

function rotateTip() {
	$("#tips")[0].innerHTML = "Tip: " + tips[curTip];
	curTip++;
	if(curTip >= tips.length) {
		curTip = 0;
	}
}

var alertFlashes;
function showAlert(text) {
	$("#alert")[0].innerHTML = text;
	$("#alert").show();
	alertFlashes = 0;	
}

function flashAlert() {
	alertFlashes++;
	if(alertFlashes < maxAlert) {
		$("#alert").toggle();
	} else {
		$("#alert").hide();
	}
	setTimeout("flashAlert();", timeAlert);
}

function clearAlert() {
	$("#alert")[0].innerHTML = "";	
}

function mouseClick(e) {
	if(eaten) {
		reboot();
		gameOn();
	}
}

function mouseMove(e) {
	if(!e) { e = event; }

	var rect = e.currentTarget.getBoundingClientRect();
	mouseX = e.clientX - rect.left - 8;
	mouseY = e.clientY - rect.top - 9;
}

function cancelEvent(e) {
	if(!e) { e = event; }
	e.stopPropagation();
}

function startup() {
	$("#world").css({width:px(boardWidth)});
	$("#board").css({width:px(boardWidth), height:px(boardHeight)});
	$("#overlay").css({width:px(boardWidth), height:px(boardHeight), lineHeight:px(boardHeight/4)});
	$("#alert").css({width:px(boardWidth), height:px(boardHeight), lineHeight:px(boardHeight)});

	$("#overlay").bind("mouseover",gameOn);
	$("#overlay").bind("mouseout",gameOff);
	$("#overlay").bind("mousemove",mouseMove);
	$("#overlay").bind("click",mouseClick);

	$("#overlayShare").bind("click",cancelEvent);
	$("#overlayShare").bind("mouseout",cancelEvent);
	$("#overlayText").bind("mouseout",cancelEvent);

	reboot();
	flashAlert();
}

$(document).ready(function() {
	startup();
	session = UUIDjs.create().toString();
});
