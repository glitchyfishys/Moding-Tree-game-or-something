let modInfo = {
	name: "The Tree of something random ideas ans is probably bad",
	id: "GFChaos",
	author: "Glitchyfishys",
	pointsName: "void stones",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	offlineLimit: 24,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0",
	name: "Quite Literally nothing",
}

let changelog = `
				<h1>Changelog:</h1><br>
    				<h3>v1.0</h3><br>
				- made some kindof game.<br>
				<h3>v0.0</h3><br>
				- i Literally just forked this.<br>

	`

let winText = `Congratulations! You have reached the end and beaten this game, but for now... do some other stuff?`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints);
}

// Determines if it should show points/sec
function canGenPoints(){
	return hasAchievement("A", 11);
}

// Calculate points/sec!
function getPointGen() {
	game.ticks++;
	if(!canGenPoints()) return new Decimal(0);
	return PointGain();
}

function PointGain() {
	if(!canGenPoints()) return new Decimal(0);

	let gain = new Decimal(0.1);
	if(hasUpgrade("CZ", 11)) gain = gain.mul(upgradeEffect("CZ", 11));
	if(hasUpgrade("CZ", 12)) gain = gain.mul(upgradeEffect("CZ", 12));
	if(hasUpgrade("CZ", 14)) gain = gain.mul(upgradeEffect("CZ", 14));
	if(hasUpgrade("CZ", 31)) gain = gain.mul(upgradeEffect("CZ", 31));
	if(hasMilestone("DN", 0)) gain = gain.mul(prestigeEffect("DN"));
	if(challengeCompletions("CURSE", 11) > 0) gain = gain.mul(challengeEffect("CURSE", 11));

	if(hasMilestone("VX",0)) gain = gain.div(1e5);

	if(hasMilestone("INFINITY", 2)) gain = gain.mul(player.DN.total.max(1).pow(3));

	gain = gain.mul(buyableEffect("CZ", 11));

	gain = gain.mul(Decimal.pow(player.CZ.points.add(1), 5));

	if(challengeCompletions("CURSE", 14) > 0) gain = gain.mul(player.DMC.points.add(1).log10().pow(5).max(1));

	gain = powers(gain);
	return scap(gain);
}

function powers(gain = new Decimal(1)){

	if(hasUpgrade("CZ", 13)) gain = gain.pow(upgradeEffect("CZ", 13));
	if(hasUpgrade("DN", 11)) gain = gain.pow(upgradeEffect("DN", 11));

	if(hasMilestone("VX",2)) gain = gain.sqrt().pow(prestigeEffect("VX"));
	


	if(inChallenge("CURSE", 11)) gain = gain.pow(0.5);
	if(inChallenge("CURSE", 14)) gain = gain.pow(0.9);
	return gain;
}

function scap(gain = new Decimal()){
	Object.keys(SC).forEach(k => SC[k] = false);

	if(gain.gte(1e9) && challengeCompletions("CURSE", 11) == 0) {
		gain = gain.div(100);
		SC.has1 = true;
	}
	
	if(gain.gte(1e20) && !hasUpgrade("CZ", 21)) {
		gain = new Decimal(1e20);
		SC.has2 = true;
	}

	if(gain.gte(1e50)  && !hasMilestone("VX",11)) {
		const pow = hasMilestone("EMS", 0) ? 0.1 : (challengeCompletions("CURSE", 12) > 0 ? 0.45 : 0.65);
		SC.S3A = "gain before nerf " + format(gain) + ", nerfed by " + " /" + format(gain.div(1e50).pow(pow));
		gain = gain.div(gain.div(1e50).pow(pow));
		SC.has3 = true;
	}

	if(gain.gte(Decimal.dNumberMax) && !hasUpgrade("INFINITY", 11)) {
		gain = new Decimal(Decimal.dNumberMax);
		SC.has4 = true;
	}

	if(gain.gt(Decimal.dNumberMax)  && !hasMilestone("VX",11)) {
		const pow = hasMilestone("EMS", 0) ? 0.45 : 0.85;
		SC.S5A = "gain before nerf " + format(gain) + ", nerfed by " + " /" + format(gain.div(Decimal.dNumberMax).pow(pow));
		gain = gain.div(gain.div(Decimal.dNumberMax).pow(pow));
		SC.has5 = true;
	}

	if(gain.gte("1e1000") && !hasMilestone("VX",11)) {
		const pow = hasMilestone("EMS", 0) ? 0.6 : 0.9;
		SC.S6A = "gain before nerf " + format(gain) + ", nerfed by " + " ^" + formatSmall(decimalOne.div(gain.log10().div(1000).pow(pow)));
		gain = gain.pow(decimalOne.div(gain.log10().div(1000).pow(pow)));
		SC.has6 = true;
	}

	if(gain.gte("1e1e5") && !hasMilestone("VX",11)) {

		const pow = hasMilestone("VX",9) ? Decimal.pow(0.9999, player.VX.points.mul(hasMilestone("VX",10) ? 3 : 1)) : 0.9999;
		SC.S7A = "gain before nerf " + format(gain) + ", nerfed by " + " ^" + formatSmall(decimalOne.div(gain.log10().div(1e5).pow(pow)));
		gain = gain.pow(decimalOne.div(gain.log10().div(1e5).pow(pow)));
		SC.has7 = true;
	}

	return gain;
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	pointlessclicks: new Decimal(),
}}

const SC = {
	has1: false,
	has2: false,
	has3: false,
	has4: false,
	has5: false,
	has6: false,
	has7: false,
	S3A: "0",
	S5A: "0",
	S6A: "0",
	S7A: "0",
}

// Display extra things at the top of the page
var displayThings = [
	() => {return inChallenge("CURSE", 11) ? "CURSE-1 sqrt VS gain" : ""},
	() => {return inChallenge("CURSE", 12) ? "CURSE-2 ^0.2 DC gain" : ""},
	() => {return inChallenge("CURSE", 13) ? "CURSE-3 ^0.7 DN gain" : ""},
	() => {return inChallenge("CURSE", 14) ? "CURSE-4 ^0.9 VS, DC, DN gain" : ""},
	() => {return inChallenge("CURSE", 15) ? "CURSE-5 ^0.1 VS, DC, DN, OR gain" : ""},
	() => {return SC.has1 ? "SC1: VS /100 at 1e9" : ""},
	() => {return SC.has2 ? "SC2: VS gain capped at 1e20" : ""},
	() => {return SC.has3 ? `SC3: VS gain is lowered based on its gain at 1e50<br>${SC.S3A}` : ""},
	() => {return SC.has4 ? "SC4: VS gain capped at 1.79e308" : ""},
	() => {return SC.has5 ? `SC5: VS gain is lowered based on its gain at 1.79e308<br>${SC.S5A}` : ""},
	() => {return SC.has6 ? `SC6: VS gain is lower by a power based on its gain at 1e1000<br>${SC.S6A}` : ""},
	() => {return SC.has7 ? `SC7: VS gain is lower by a power based on its gain at 1e1e5<br>${SC.S7A}` : ""},
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("10^^300"));
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	console.log(oldVersion)
}

const game = {
	get progress(){
		if(player.VX.total.neq(0)) return 5;
		if(player.DMC.total.neq(0)) return 4;
		if(player.INFINITY.total.neq(0)) return 3;
		if(player.DN.total.neq(0)) return 2;
		if(player.CZ.total.neq(0)) return 1;
		return 0;
	},
	ticks: 0,
}

function challengesIN(){
	let i=0;
	if(inChallenge("CURSE", 11)) i++;
	if(inChallenge("CURSE", 12)) i++;
	if(inChallenge("CURSE", 13)) i++;
	if(inChallenge("CURSE", 14)) i++;
	if(inChallenge("CURSE", 15)) i++;
	return i;
}
