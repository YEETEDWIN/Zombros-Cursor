function randInt(n) {
	return Math.round(Math.random() * n);
}


function pyInt(x,y) {
	return Math.round(Math.sqrt((x*x) + (y*y)));
}

function isTime(sec) {
	if( (counter % (sec*maxFPS)) == 0) {
		return true;
	}
	return false;
}

function chance(n) {
	if(randInt(100) < n) {
		return true;
	} else {
		return false;
	}
}

function px(n) {
	return n.toString() + "px";
}
