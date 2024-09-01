// ************ Themes ************
var themes = ["default", "aqua", "crimson", "coruption", "glitch"]

var colors = {
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
	aqua: {
		1: "#bfdfff",
		2: "#8fa7bf",
		3: "#5f6f7f",
		color: "#bfdfff",
		points: "#dfefff",
		locked: "#c4a7b3",
		background: "#001f3f",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
	},
	crimson: {
		1: "#ed143d",
		2: "#c51027",
		3: "#940514",
		color: "crimson",
		points: "#e35f30",
		locked: "#a43713",
		background: "#250a04",
		background_tooltip: "rgba(35, 5, 21, 0.75)",
	},
	coruption: {
		1: "#ef00ff",
		2: "#af00cf",
		3: "#2f006f",
		color: "#bf00ff",
		points: "#b33fd5",
		locked: "#a43713",
		background: "#230044",
		background_tooltip: "rgba(5, 5, 41, 0.75)",
	},
	glitch: {
		1: "#00ff00",
		2: "#00aa00",
		3: "#005500",
		color: "#00bb00",
		points: "#00ff00",
		locked: "#005500",
		background: "#002200",
		background_tooltip: "rgba(0, 50, 0, 0.75)",
	},
}
function changeTheme() {

	colors_theme = colors[options.theme || "default"];
	document.body.style.setProperty('--background', colors_theme["background"]);
	document.body.style.setProperty('--background_tooltip', colors_theme["background_tooltip"]);
	document.body.style.setProperty('--color', colors_theme["color"]);
	document.body.style.setProperty('--points', colors_theme["points"]);
	document.body.style.setProperty("--locked", colors_theme["locked"]);
}
function getThemeName() {
	return options.theme? options.theme : "default";
}

function switchTheme() {
	let index = themes.indexOf(options.theme);
	if (options.theme === null || index >= themes.length-1 || index < 0) {
		options.theme = themes[0];
	}
	else {
		index ++;
		options.theme = themes[index];
	}
	console.log(index)
	changeTheme();
	resizeCanvas();
}
