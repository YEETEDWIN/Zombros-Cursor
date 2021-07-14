var first = true;
var undead = false;
var eaten = false;
var inGame = false;

var session;
var gameNumber = 0;

var counter;
var score = 0;
var maxScore = 0;
var zombies = [];
var zombieFace = "Z";
var zombieSleepFace = "N";

var things = [];

var boardWidth = 800;
var boardHeight = 550;

var mouseX = 0;
var mouseY = 0;

var maxZombies = 40;
var maxThings = 4;
var maxX;
var maxY;

var maxFPS = 50;
var maxStep = 8;
var maxStepX = maxStep;
var maxStepY = maxStep;
var maxNostrilStrength = 300;
var maxSpawn = 5;
var maxSleep = maxFPS*2;

var minSpawn = 40;

var newStep = 3;
var newStepX = newStep;
var newStepY = newStep;
var newNostrilStrength = 100;
var newSpawn = 1;
var newStamina = maxFPS*3;

var curSpawn;
var curTip = 0;

var modStepX = 1.5;
var modStepY = 1;
var modNostrilStrength = 20;
var modSpawn = 1;

var mayWake = 50;
var mayThing = 30;

var doTip;

var tips = [
	"You are the mouse cursor",
	"AVOID THE ZOMBIES!",
	"Don't run into the walls",
	"Point inside the box to play",
	"Click to restart"
];


var gameRules = [
	{ time: 4, action: function() { if(curSpawn < maxSpawn) { curSpawn += modSpawn; } } },
//	{ time: 1, action: function() { spawnThing(); } }, // Disabled for the time being...
	{ time: 1, action: function() { spawnZombie(); } },
	{ time: 1, action: function() { if(!eaten) { score++; updateScore(); } } },
//	{ time: 0.5, action: function() { $("debug").innerHTML = "Mouse X: " +mouseX + ", Mouse Y: " + mouseY + ", Zombies: " + zombies.length.toString() + ",curSpawn: " + curSpawn.toString() + ", curStepX: " + (zombies[0]?zombies[0].curStepX.toString():"NaN") + ", curStepY: " + (zombies[0]?zombies[0].curStepY.toString():"NaN") + ", curNostrilStrength: " + (zombies[0]?zombies[0].curNostrilStrength.toString():"NaN"); } },
	{ time: 0, action: function() { stagger(); } },
	{ time: 5, action: function() { rotateTip(); } }
];

var zombieRules = [
	{ time: 4, action: function(zombie) { if(zombie.curStepX < maxStepX) { zombie.curStepX += modStepX; } } },
	{ time: 4, action: function(zombie) { if(zombie.curStepY < maxStepY) { zombie.curStepY += modStepY; } } },
	{ time: 2, action: function(zombie) { if(zombie.curNostrilStrength < maxNostrilStrength) { zombie.curNostrilStrength += modNostrilStrength; } } }
];

var thingRules = [
	{ face: "S" },
	{ face: "C", alert: "Cluck Boris", action: chuckAction },
	{ face: "F", alert: "Freeeze", action: freezeAction }
//{ face: "", alert: "", action: Action }
];
	
var chuckStepX = 2;
var chuckStepY = 2;


var stateNormal = 0;
var stateSleep = 1;

var maxAlert = 5;
var timeAlert = 400;
