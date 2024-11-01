
addLayer("CZ", {
    name: "crystallization", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CZ", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["DN"],
    passiveGeneration() {return hasMilestone("INFINITY", 3) ? 10 : 0},
    autoUpgrade() {return hasMilestone("INFINITY", 0) && player[this.layer].autoUG},
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    doReset(type){
        if(hasMilestone("INFINITY", 3) || hasMilestone("VX", 3)) return;
        if(type == "CZ"){
            if(!hasUpgrade(this.layer, 23)){
                const ugr = [11,12,13,14];
                
                for (let x = 0; x < player[this.layer].upgrades.length; x++) if(ugr.includes(player[this.layer].upgrades[x])) {player[this.layer].upgrades.splice(x,1);x--;}
            }
            if(!hasUpgrade(this.layer, 24)) setBuyableAmount(this.layer, 11 , decimalZero);
            
        }
        else if(type == "DN"){
            let ugr = [11,12,13,14,21,22,23,24];
            for (let x = 0; x < player[this.layer].upgrades.length; x++) if(ugr.includes(player[this.layer].upgrades[x])) {player[this.layer].upgrades.splice(x,1);x--;}
            setBuyableAmount(this.layer, 11 , decimalZero);
            player[this.layer].points = decimalZero;
            player[this.layer].total = decimalZero;
        }
        else if (type == "INFINITY"){
            setBuyableAmount(this.layer, 11 , decimalZero);
            player[this.layer].upgrades = [];
            player[this.layer].points = decimalZero;
            player[this.layer].total = decimalZero;
        }
        else if(type == "DMC"){
            player[this.layer].points = decimalZero;
            player[this.layer].total = decimalZero;
            player[this.layer].upgrades = [];
            setBuyableAmount(this.layer, 11 , decimalZero)
        }
        else if(type == "VX"){
            player[this.layer].points = decimalZero;
            player[this.layer].total = decimalZero;
            player[this.layer].upgrades = [];
            setBuyableAmount(this.layer, 11 , decimalZero)
        }
    },
    effect(){ return Decimal.pow(player[this.layer].points.add(1), 5).max(1);},
    effectDescription(){
        return format(this.effect()) + " Void Stone gain";
    },
    automate(){
        if(hasMilestone("DN", 0) && (hasMilestone("INFINITY", 0) ? game.ticks % 15 < 3 : game.ticks % 180 < 3) && player.CZ.autoRB) {this.buyables[11].buyMax();}
    },
    color: "#4BDC13",
    glowColor: "#4BDC13",
    requires: new Decimal(1e20), // Can be a function that takes requirement increases into account
    resource: "Dynamic crystals", // Name of prestige currency
    baseResource: "Void Stones", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.05, // Prestige currency exponent
    softcap() {return new Decimal(1e10)},
    softcapPower() {return 1e-2},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        gain = decimalOne;
	    if(hasUpgrade("CZ", 22)) gain = gain.mul(upgradeEffect("CZ", 22));
        gain = gain.mul(prestigeEffect("DN").min("1e1000"));
        if(challengeCompletions("CURSE", 12) > 0) gain = gain.mul(challengeEffect("CURSE", 12));
        gain = gain.mul(prestigeEffect("DMC").min("1e100"));

	    if(inChallenge("CURSE", 12)) gain = gain.pow(0.2);
	    if(inChallenge("CURSE", 14)) gain = gain.pow(0.9);
        if(inChallenge("CURSE", 15)) gain = gain.pow(0.1);

        return gain;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        gain = decimalOne;
	    if(hasUpgrade("CZ", 32)) gain = gain.mul(upgradeEffect("CZ", 32));

        return gain;
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "c: Reset for Dynamic Crystals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            canAfford: () =>{
                return player.points.gt(1);
            },
            pay: () => {player.points = player.points.sub(1)},
            fullDisplay: () => `<h3>Dynamical</h3><br> Void Stone gain based on its value<br>Effect: x${ format(upgradeEffect("CZ", 11))} VS gain <br>cost: 1 void stone`,
            effect: () => player.points.add(1).mul(15).log(6).max(1),
            tooltip: "LOG<sub>6</sub>(VS * 15)",
        },
        12: {
            canAfford: () =>{
                return player.points.gt(10);
            },
            pay: () => {player.points = player.points.sub(10)},
            fullDisplay: () => `<h3>Furic</h3><br> Void Stone gain based on its value<br>Effect: x${ format(upgradeEffect("CZ", 12).toFixed(2))} VS gain <br>cost: 10 void stones`,
            effect: () => player.points.add(1).mul(150).log(1.1).max(1),
            tooltip: "LOG<sub>1.1</sub>(VS * 150)",
        },
        13: {
            canAfford: () =>{
                return player.points.gt(1e4);
            },
            pay: () => {player.points = player.points.sub(1e4)},
            fullDisplay: () => `<h3>Overide</h3><br> a static power <br>Effect: ^1.5 VS gain <br>cost: 1e4 void stones`,
            effect: new Decimal(1.5),
            tooltip: "a Static 1.5 power",
        },
        14: {
            canAfford: () =>{
                return player.points.gt(1e10);
            },
            pay: () => {player.points = player.points.sub(1e10)},
            fullDisplay: () => `<h3>Overdrive</h3><br> a static multiplyer <br>Effect: x25 VS gain <br>cost: 1e10 void stones`,
            effect: new Decimal(25),
            tooltip: "a Static x25 muliplyer",
        },
        21: {
            title: "duolight",
            cost: new Decimal(1),
            description: "just removes SC2 (have more than 1 DC before you buy)",
            tooltip: "no more SC2",
            unlocked(){return game.progress > 0},
        },
        22: {
            title: "norix arteri",
            cost: new Decimal(100),
            description: "muliply DC gain by its amount",
            effect() {return player[this.layer].points.pow(0.8).max(1).min("1e10000")},
            effectDisplay(){return format(this.effect())},
            tooltip: "DC ^0.8",
            unlocked(){return game.progress > 0},
        },
        23: {
            title: "how lazy are you?",
            cost: new Decimal(1000),
            description: "the first 4 upgrades dont reset",
            effect() {return new Decimal(1)},
            effectDisplay(){return "unlocked"},
            tooltip: "",
            unlocked(){return game.progress > 0},
        },
        24: {
            title: "you must be if you buy this? or buymax isn't working",
            cost: new Decimal(1e10),
            description: "the rebuyable does not reset",
            effect() {return new Decimal(1)},
            effectDisplay(){return "unlocked"},
            tooltip: "",
            unlocked(){return game.progress > 0},
        },
        31: {
            canAfford: () =>{
                return player.points.gt(1e130);
            },
            pay: () => {player.points = player.points.sub(1e130)},
            fullDisplay: () => `<h3>Cryonical</h3><br> Void Stone gain based on its value<br>Effect: x${ format(upgradeEffect("CZ", 31))} VS gain <br>cost: 1e130 void stones`,
            effect: () => player.points.add(1).pow(0.1).max(1),
            tooltip: "VS ^ 0.1",
            unlocked(){return hasMilestone("DN", 3)},
        },
        32: {
            canAfford: () =>{
                return player.points.gt(1e150);
            },
            pay: () => {player.points = player.points.sub(1e150)},
            fullDisplay: () => `<h3>Meta Relay</h3><br> lower Dynamic crystals cost based on Void Stones <br>Effect: x${ format(upgradeEffect("CZ", 32))} DC gain <br>cost: 1e150 void stones`,
            effect: () => player.points.add(1).log10().pow(0.5).max(1),
            tooltip: "LOG<sub>10</sub>(VS) ^ 0.5",
            unlocked(){return hasMilestone("DN", 3)},
        },
    },
    buyables: {
        11: {
            title() {return (hasMilestone("DN", 2) ? ((challengeCompletions("CURSE", 15) > 0) ? "4.4x": "2.2x") : "double") + " Void Stones gain"},
            cost(amount) { return Decimal.pow(3,amount).mul(1e3) },
            display() { return `cost: ${format(this.cost())} Void Stones <br> x${format(buyableEffect("CZ", 11))} VS gain` },
            canAfford() { return player.points.gte(this.cost()) && getBuyableAmount(this.layer, this.id).lt(this.limit()); },
            buy() {
                if(this.canAfford()){
                    player.points = player.points.sub(this.cost());
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1).min(this.limit()));
                }
            },
            buyMax(){
                if(this.buymaxamount <= 0) return;
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(this.buymaxamount).min(this.limit()));
                player.points = player.points.sub(this.cost(getBuyableAmount(this.layer, this.id)-1));
            },
            get buymaxamount() {return player.points.div(1e3).log(3).sub( getBuyableAmount(this.layer, this.id)).add(1).floor()},
            effect(amount){return Decimal.pow((hasMilestone("DN", 2) ? 2.2 : 2) * ((challengeCompletions("CURSE", 15) > 0) ? 2 : 1) ,amount)},
            unlocked(){return player.points.gt(100) || getBuyableAmount(this.layer, this.id).neq(0) || game.progress > 0},
            limit() {return challengeCompletions("CURSE", 14) > 0 ? 4194304 : 2048},
            tooltip() {return (this.buymaxamount > 0 ? `you can buy ${this.buymaxamount}<br>` : "") + `you have ${getBuyableAmount(this.layer, this.id)}/${this.limit()}`},
        },
    }
});



addLayer("DN", {
    name: "Dynamic Numerals", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DN", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["INFINITY", "DMC"],
    passiveGeneration() {return hasMilestone("DMC", 4) ? 10 : 0},
    autoUpgrade() {return hasMilestone("INFINITY", 5) && player[this.layer].autoUG},
    startData() { return {
        unlocked: false,
		points: decimalZero,
        total: decimalZero,
    }},
    doReset(type){
        if(hasMilestone("VX", 4)) return;
        if(type == "INFINITY"){
            if(!hasMilestone("INFINITY", 1)) player[this.layer].milestones = [];
            player[this.layer].upgrades = [];
            player[this.layer].points = decimalZero;
            if(!hasUpgrade("INFINITY", 11)) player[this.layer].total = decimalZero;
        }
        else if(type == "DMC"){
            player[this.layer].points = decimalZero;
            player[this.layer].total = decimalZero;
            if(!hasMilestone("DMC", 0)) player[this.layer].milestones = [];
            player[this.layer].upgrades = [];
        }
        else if(type == "VX"){
            player[this.layer].points = decimalZero;
            player[this.layer].total = decimalZero;
            player[this.layer].milestones = [];
            player[this.layer].upgrades = [];
        }
    },
    effect(){
        return Decimal.pow(player[this.layer].points.add(1), 2).max(1);
    },
    effectDescription(){
        return `${format(this.effect())} Dynamic Crytal ${hasMilestone("DN", 1) ? " and VS" : ""} gain`;
    },
    color: "#dB0013",
    glowColor: "#dB0013",
    requires: new Decimal(1e100), // Can be a function that takes requirement increases into account
    resource: "Dynamic Numerals", // Name of prestige currency
    baseResource: "void stones", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.02, // Prestige currency exponent
    softcap() {return new Decimal(100)},
    softcapPower() {return new Decimal(0.1)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        gain = new Decimal(1);
        if(challengeCompletions("CURSE", 13) > 0) gain = gain.mul(challengeEffect("CURSE", 13));

        gain = gain.mul(prestigeEffect("DMC")).min(hasMilestone("EMS", 0) ? 1e5 : 1e15);
	    if(inChallenge("CURSE", 13)) gain = gain.pow(0.7);
	    if(inChallenge("CURSE", 14)) gain = gain.pow(0.9);
        if(inChallenge("CURSE", 15)) gain = gain.pow(0.1);

        if(gain.gt(1e10)) gain = gain.div(gain.div(1e10).pow(0.9));
        return gain;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let gain = decimalOne;
        if(hasMilestone("INFINITY", 4)) gain = gain.mul(player.INFINITY.points.pow(0.3).max(1));
        if(gain.gt(6.7)) gain = hasMilestone("EMS", 2) ? gain.div(gain.div(6.7).pow(0.95)).min(100) : gain.div(gain.div(6.7).pow(0.99)).min(100);

        return gain;
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "n", description: "n: Reset for Dynamic Numerals", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.points.gt(1e90) || game.progress > 1},
    upgrades: {
        11: {
            title: "<sub>small</sub>",
            cost: new Decimal(5),
            description: "VS gains a small power based on total DN",
            effect() {return player[this.layer].total.pow(0.05).min(15)},
            effectDisplay(){return `VS ^${format(this.effect())}`},
            tooltip: "",
        },

    },
    milestones: {
        0: {
            requirementDescription: "1 total DN",
            effectDescription: "autobuy CZ rebuyable and it works slowly",
            done() { return player[this.layer].total.gte(1) },
            toggles: [["CZ", "autoRB"]],
        },
        1: {
            requirementDescription: "2 total DN",
            effectDescription: "DN also effect VS gain",
            done() { return player[this.layer].total.gte(2) },
        },
        2: {
            requirementDescription: "5 total DN",
            effectDescription: "CZ rebuyable effect 2 => 2.2 perpurchase",
            done() { return player[this.layer].total.gte(5) },
        },
        3: {
            requirementDescription: "25 total DN",
            effectDescription: "umm 2 new upgrades?",
            done() { return player[this.layer].total.gte(25) },
        },
        4: {
            requirementDescription: "100 total DN",
            effectDescription: "Curses",
            done() { return player[this.layer].total.gte(100) },
        },
    }
});



addLayer("INFINITY", {
    name: "omaga", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "INF", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches: ["DMC"],
    startData() { return {
        unlocked: false,
		points: decimalZero,
	    total: decimalZero,
    }},
    doReset(type){
        if(hasMilestone("VX",5)) return;
        if(type == "DMC"){
            player[this.layer].points = decimalZero;
            player[this.layer].total = decimalZero;
            if(!hasMilestone("DMC", 1)) player[this.layer].upgrades = [];
            if(!hasMilestone("DMC", 0)) player[this.layer].milestones = [];
        }
        else if(type == "VX"){
            player[this.layer].points = decimalZero;
            player[this.layer].total = decimalZero;
            player[this.layer].milestones = [];
            player[this.layer].upgrades = [];
        }
    },
    passiveGeneration() {return hasMilestone("VX", 8) ? 10 : 0},
    effect(){
        return Decimal.pow(player[this.layer].points, 0.3).add(1).max(1);
    },
    effectDescription(){
        return `${hasMilestone("INFINITY", 4) ? `/${format(this.effect())} DN cost` : ""}`;
    },
    color: "orange",
    glowColor: "orange",
    requires: new Decimal(Number.MAX_VALUE), // Can be a function that takes requirement increases into account
    resource: "Omaga Relics", // Name of prestige currency
    baseResource: "void stones", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 2e-3, // Prestige currency exponent
    softcap() {return new Decimal(1e50)},
    softcapPower() {return new Decimal(1e-10)},
    gainMult() { // Calculate the multiplier for main currency from bonuses
        gain = decimalOne;
        if(hasUpgrade("INFINITY", 12)) gain = gain.mul(upgradeEffect("INFINITY", 12));
	    if(challengeCompletions("CURSE", 14) > 0) gain = gain.mul(challengeEffect("CURSE", 14));

        if(inChallenge("CURSE", 15)) gain = gain.pow(0.1);

        return gain;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let gain = decimalOne;
        if(hasMilestone("EMS", 0)) gain = gain.mul(1.5);
        if(hasMilestone("VX", 8)) gain = gain.mul(1e9);
        return gain;
    },
    row: 2, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "i", description: "i: Reset for Omaga Relics", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.points.gt(1e200) || game.progress > 2},
    upgrades: {
        11: {
            title: "<i>i am speed</i>",
            cost: new Decimal(3),
            description: "keep total DN made and remove SC4",
            effect() {return player[this.layer].total.pow(0.05)},
            effectDisplay(){return `annihilated SC4`},
            tooltip: "",
        },
        12: {
            title: "<i>i am not speed</i>",
            cost: new Decimal(50),
            description: "multiples OR gain by 5 for every Cursed challenge you are in",
            effect() {return Decimal.pow(5,challengesIN())},
            effectDisplay(){return `x${format(this.effect())} OR gain`},
            tooltip: "",
        },

    },
    milestones: {
        0: {
            requirementDescription: "1 total OR",
            effectDescription: "autobuy CZ upgrades and DN MS1 is faster",
            done() { return player[this.layer].total.gte(1) },
            toggles: [["CZ", "autoUG"]],
        },
        1: {
            requirementDescription: "2 total OR",
            effectDescription: "keep DN Milestones",
            done() { return player[this.layer].total.gte(2) },
        },
        2: {
            requirementDescription: "3 total OR",
            effectDescription() {return `total DN multiples VS gain<br>Effect: ${format(player.DN.total.pow(3))}`},
            done() { return player[this.layer].total.gte(3) },
        },
        3: {
            requirementDescription: "7 total OR",
            effectDescription() {return `DC is automaticly gained and does not reset on INF`},
            done() { return player[this.layer].total.gte(7) },
        },
        4: {
            requirementDescription: "100 total OR",
            effectDescription() {return `OR effects DN gain`},
            done() { return player[this.layer].total.gte(100) },
        },
        5: {
            requirementDescription: "1000 total OR",
            effectDescription: "autobuy DN upgrades",
            done() { return player[this.layer].total.gte(1000) },
            toggles: [["DN", "autoUG"]],
        },
    }
});



addLayer("DMC", {
    name: "DMC", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "DMC", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: decimalZero,
        total: decimalZero,
    }},
    doReset(type){
        if(type == "VX" && !hasMilestone("VX",7)){
            player[this.layer].points = decimalZero;
            player[this.layer].total = decimalZero;
            player[this.layer].milestones = [];
            player[this.layer].upgrades = [];
        }
    },
    passiveGeneration() {return hasMilestone("VX", 8) ? 10 : 0},
    effect(){
        return (hasMilestone("DMC", 2) ? Decimal.pow(player[this.layer].points.add(1), 3.6).max(1) : decimalOne).pow(hasMilestone("DMC", 3) ? 2 : 1);
    },
    effectDescription(){
        return hasMilestone("DMC", 2) ? format(this.effect()) + "x DC and DN gain" : "";
    },
    color: "blue",
    glowColor: "blue",
    componentStyles: {
        "prestige-button"() { return {'color': '#ffffff'} }
    },
    resource: "Dynamic Magnetic Corins", // Name of prestige currency
    baseResource: "fish", // Name of resource prestige is based on
    baseAmount() {return decimalZero}, // Get the current amount of baseResource
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.2, // Prestige currency exponent
    tooltipLocked() {return `${format(player.CZ.points)}/ 1e60 DC and ${format(player.DN.points)}/1e20 DN`},
    softcap() {return new Decimal(1e10)},
    softcapPower() {return new Decimal(1e-5)},
    prestigeNotify() {return player[this.layer].points.div(10).lt(this.getResetGain()) && this.canReset() && player[this.layer].points.layer < 2},
    canReset() {return player.CZ.points.gte("1e60") && player.DN.points.gte("1e20")},
    getResetGain(){
        let gain = player.CZ.points.div(1e60).pow(0.05).mul(player.DN.points.div(1e20).pow(0.15));
        if(challengeCompletions("CURSE", 15) > 0) gain = gain.mul(challengeEffect("CURSE", 15));

        if(hasMilestone("VX", 8)) gain = gain.pow(100);

        if(gain.gt(1e10) && gain.lt("eee5")) gain = gain.div(gain.div(1e10).pow(0.9));
        if(gain.gt(1e100) && gain.lt("eee5")) gain = gain.div(gain.div(1e100).pow(0.999));

        if(!hasMilestone("VX",11)) gain = gain.min(1e200);

        return gain;
    },
    getNextAt(){
        return "never";
    },
    prestigeButtonText() {return `reset for ${formatWhole(this.getResetGain())} Dynamic Magnetic Corins`},
    gainMult() {
        gain = decimalOne;
	    if(challengeCompletions("CURSE", 15) > 0) gain = gain.mul(challengeEffect("CURSE", 15));

        return gain;
    },
    gainExp() {
        let gain = decimalOne;
        return gain;
    },
    row: 2,
    hotkeys: [
        {key: "m", description: "m: Reset for Dynamic Magnetic Corins", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.CZ.points.gt(1e30) || player.DN.points.gt(1e15) || game.progress > 3},
    upgrades: {
        11: {
            title: "forever",
            cost: new Decimal(50),
            description: "unlock everlasting Milestones",
            effect() {return player[this.layer].total.pow(0.5)},
            effectDisplay(){return `unlocked`},
            tooltip: "",
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 total DMC",
            effectDescription: "keep INF Milestones",
            done() { return player[this.layer].total.gte(1) },
        },
        1: {
            requirementDescription: "2 total DMC",
            effectDescription: "keep INF upgrades",
            done() { return player[this.layer].total.gte(2) },
        },
        2: {
            requirementDescription: "3 total DMC",
            effectDescription: "DC and DN gain based on DMC",
            done() { return player[this.layer].total.gte(3) },
        },
        3: {
            requirementDescription: "10 total DMC",
            effectDescription: "DMC effect is sqared",
            done() { return player[this.layer].total.gte(10) },
        },
        4: {
            requirementDescription: "100,000 total DMC",
            effectDescription: "auto gain DN",
            done() { return player[this.layer].total.gte(1e5) },
        },
    },
});



addLayer("VX", {
    name: "VX", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "VX", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: decimalZero,
    }},
    effect(){
        return (hasMilestone("VX", 2) ? Decimal.pow(player[this.layer].points, hasMilestone("EMS", 5) ? (hasMilestone("VX",9) ? 4 : 2) : 0.605).max(1) : decimalOne).mul(hasMilestone("VX",6) ? 2 : 1);
    },
    effectDescription(){
        return hasMilestone("VX", 2) ? "^" + format(this.effect()) + " DC gain" : "";
    },
    color: "gray",
    glowColor: "gray",
    resource: "Chaos Cores", // Name of prestige currency
    baseResource: "Void Stones", // Name of resource prestige is based on
    exponent: 1e-4,
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    base: () => new Decimal("1e1000").pow(player.VX.points),
    softcap() {return new Decimal(1e10)},
    softcapPower() {return new Decimal(1e-5)},
    requires: new Decimal("1e15000"), // Can be a function that takes requirement increases into account
    baseAmount() {return player.points}, // Get the current amount of baseResource
    gainMult() {
        gain = decimalOne;
        return gain;
    },
    gainExp() {
        let gain = decimalOne;
        if(hasMilestone("EMS", 3)) gain = gain.mul(1.175);
        if(hasMilestone("EMS", 4)) gain = gain.mul(1.25);
        if(hasMilestone("EMS", 5)) gain = gain.mul(2);
        if(hasMilestone("VX",9)) gain = gain.mul(2);
        return gain;
    },
    directMult(){
        let gain = decimalOne;
        if(hasMilestone("VX",12)) gain = gain.mul(player[this.layer].points.pow("14^^" + (player.VX.points.layer+1)));
        if(player[this.layer].points.layer > 1000) gain = gain.mul(player[this.layer].points.pow("50^^" + Math.floor(player.VX.points.layer * 2)));
        return gain;
    },
    autoPrestige(){return hasMilestone("VX",9)},
    resetsNothing(){return hasMilestone("VX",9)},
    canBuyMax(){return hasMilestone("VX",10)},
    row: 2,
    hotkeys: [
        {key: "v", description: "v: Reset for Chaos Cores", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.points.gt("1e10000") || game.progress > 4},
    infoboxes: {
        help: {
            body: "you will unlock a challenge after reset, this is the end",
        },
    },
    milestones: {
        0: {
            requirementDescription: "1 Chaos Core",
            effectDescription: "/ point gain by 1e5",
            done() { return player[this.layer].points.gte(1) },
        },
        1: {
            requirementDescription: "2 Chaos Cores",
            effectDescription: "more everlasting milestones",
            done() { return player[this.layer].points.gte(2)},
        },
        2: {
            requirementDescription: "3 Chaos Cores",
            effectDescription: "Chaos Cores give a power to VS gain but it is square rooted first",
            done() { return player[this.layer].points.gte(3)},
        },
        3: {
            requirementDescription: "4 Chaos Cores",
            effectDescription: "DC does not reset",
            done() { return player[this.layer].points.gte(4)},
        },
        4: {
            requirementDescription: "7 Chaos Cores",
            effectDescription: "DN does not reset",
            done() { return player[this.layer].points.gte(7)},
        },
        5: {
            requirementDescription: "10 Chaos Cores",
            effectDescription: "INF does not reset",
            done() { return player[this.layer].points.gte(10)},
        },
        6: {
            requirementDescription: "20 Chaos Cores",
            effectDescription: "double VX effect",
            done() { return player[this.layer].points.gte(20)},
        },
        7: {
            requirementDescription: "70 Chaos Cores",
            effectDescription: "DMC does not reset",
            done() { return player[this.layer].points.gte(70)},
        },
        8: {
            requirementDescription: "100 Chaos Cores",
            effectDescription: "gain more OR and DMC, it is auto gained too",
            done() { return player[this.layer].points.gte(100)},
        },
        9: {
            requirementDescription: "250 Chaos Cores",
            effectDescription: "lower SC8 by Chaos Cores, gain more CC and double effect again, does not reset anything and is auto gained ",
            done() { return player[this.layer].points.gte(250)},
        },
        10: {
            requirementDescription: "10000 Chaos Cores",
            effectDescription: "triple the soft cap rate, also buys max",
            done() { return player[this.layer].points.gte(10000)},
        },
        11: {
            requirementDescription: "1e20 Chaos Cores",
            effectDescription: "remove <i>all</i> softcaps and uncap DMC gain",
            done() { return player[this.layer].points.gte(1e20)},
        },
        12: {
            requirementDescription: "10^^3 Chaos Cores",
            effectDescription: "CC lower its own cost",
            done() { return player[this.layer].points.gte("10^^3")},
        },
    },
});





addLayer("CURSE", {
    name: "Curses", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "CUR", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ffffff",
    resource: "Curses",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasMilestone("DN", 4) || game.progress > 2},
    infoboxes: {
        help: {
            body: "each Cursed challenge includes all the previous ones<br> all Curses do not get reset",
        },
    },
    challenges: {
        11: {
            name: "make the game harder",
            challengeDescription: "sqrt VS gain<br> does a DN reset",
            goalDescription: "reach 1e20 VS",
            rewardDisplay() {return `1e5 VS gain and remove SC1`},
            canComplete() {return player.points.gte(1e20)},
            rewardEffect() {return new Decimal(1e5)},
            onEnter() {
                doReset("DN", true);
            },
            style:{backgroundColor: "#dB0013", color: "white"},
        },
        12: {
            name: "make the game EVEN harder",
            challengeDescription: "^.2 DC gain<br> does a INF reset",
            goalDescription: "reach 1e50 VS",
            unlocked() {return game.progress > 2},
            rewardDisplay() {return `1e5 DC gain and lower SC3`},
            canComplete() {return player.points.gte(1e50)},
            rewardEffect() {return new Decimal(1e5)},
            onEnter() {
                doReset("INFINITY", true);
            },
            style:{backgroundColor: "orange", color: "white"},
            countsAs: [11],
        },
        13: {
            name: "make the game EVENER harder",
            challengeDescription: "^0.7 DN gain<br> does a INF reset",
            goalDescription: "reach 1.79e308 VS",
            unlocked() {return game.progress > 2},
            rewardDisplay() {return `1e5 DN gain`},
            canComplete() {return player.points.gte(Decimal.dNumberMax)},
            rewardEffect() {return new Decimal(1e5)},
            onEnter() {
                doReset("INFINITY", true);
            },
            style:{backgroundColor: "orange", color: "white"},
            countsAs: [11,12],
        },
        14: {
            name: "make the game EVEN harderest",
            challengeDescription: "^0.9 VS, DC,DN gain<br> does a INF reset",
            goalDescription: "reach 1e1000 VS",
            unlocked() {return game.progress > 2},
            rewardDisplay() {return `multiply OR gain by its amount and square DZ rebuyable cap Effect: x${format(this.rewardEffect())}, DMC also slightly effects VS gain x${format(player.DMC.points.add(1).log10().pow(5).max(1))}`},
            canComplete() {return player.points.gte("1e1000")},
            rewardEffect() {return player.INFINITY.points.pow(0.2).max(1)},
            onEnter() {
                doReset("INFINITY", true);
                player.CZ.points = decimalZero;
                player.CZ.buyables[11] = decimalZero;
            },
            style:{backgroundColor: "orange", color: "white"},
            countsAs: [11,12,13],
        },
        15: {
            name: "make the game EVENEREST hardererest",
            challengeDescription: "^0.1 DC,DN gain<br> does a DMC reset",
            goalDescription: "reach 1e1000 VS",
            unlocked() {return game.progress > 4},
            rewardDisplay() {return `DMC gain by OR amount and double DZ rebuyable effect perpurchase Effect: x${format(this.rewardEffect())}`},
            canComplete() {return player.points.gte("1e1000")},
            rewardEffect() {return player.INFINITY.points.pow(0.4).max(1)},
            onEnter() {
                doReset("DMC", true);
                player.CZ.points = decimalZero;
                player.CZ.buyables[11] = decimalZero;
            },
            style:{backgroundColor: "gray", color: "white"},
            countsAs: [11,12,13,14],
        },
    },
});

addLayer("EMS", {
    name: "everlasting milestones", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "EMS", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#00ccff",
    resource: "miles of stones",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasUpgrade("DMC", 11) || game.progress > 4},
    infoboxes: {
        help: {
            body: "milestones are permenant",
        },
    },
    milestones: {
        0: {
            requirementDescription: "reach 1e1111 Void Stones",
            effectDescription: "/1.5 OR cost exponent and lower SC6, nut lower DN gain from DMC",
            done() { return player.points.gte("1e1111") },
        },
        1: {
            requirementDescription: "reach 1e900 Void Stones without Omaga Relics",
            effectDescription: "lower SC3 and SC5",
            done() { return player.points.gte("1e900") && player.INFINITY.points.eq(0)},
        },
        2: {
            requirementDescription: "reach 1e16000 Void Stones",
            effectDescription: "lower DN cost soft cap",
            done() { return player.points.gte("1e16000") },
            unlocked() {return hasMilestone("VX", 1)},
        },
        3: {
            requirementDescription: "reach 1e26800 Void Stones",
            effectDescription: "gain more Chaos Core",
            done() { return player.points.gte("1e26800") },
            unlocked() {return hasMilestone("VX", 1)},
        },
        4: {
            requirementDescription: "reach 1e75000 Void Stones",
            effectDescription: "gain even more Chaos Core",
            done() { return player.points.gte("1e75000") },
            unlocked() {return hasMilestone("VX", 1)},
        },
        5: {
            requirementDescription: "reach 1e100000 Void Stones",
            effectDescription: "gain way more Chaos Core and imporve its effect",
            done() { return player.points.gte("1e100000") },
            unlocked() {return hasMilestone("VX", 1)},
        },
    },
});

addLayer("A", {
    name: "Achevments", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "A", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ffff00",
    resource: "Achevments",
    row: "side", // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    achievements: {
        11: {
            name: "click the button up there 10 times",
            done() {return player.pointlessclicks.gte(10)},
            tooltip: "you can gain points",
        },
        12: {
            name: "how big is 100?",
            done() {return player.points.gte(100)},
            tooltip: "",
        },
        13: {
            name: "why did you leave",
            done() {return player.offTime?.remain > 10},
            tooltip: ":(",
        },
        14: {
            name: () => `${ hasAchievement("A", 14) ? "reach 1e20 Void Stones, get soft capped lol " : "reach 1e20 Void Stones"}`,
            done() {return player.points.gte(1e20)},
            tooltip: "oh should have known",
        },
        15: {
            name: () => `${ hasAchievement("A", 14) ? "reach 1e100 Void Stones, ah yes a new layer" : "reach 1e100 Void Stones"}`,
            done() {return player.points.gte(1e100)},
            tooltip: "oh at 1e100",
        },
        21: {
            name: () => `i can get automation`,
            done() {return player.DN.total.gte(1)},
            tooltip: "1 number?",
        },
        22: {
            name: () => `big number`,
            done() {return player.INFINITY.total.gte(1)},
            tooltip: "INFINITY",
        },
        23: {
            name: () => `im CURSED`,
            done() {return challengeCompletions("CURSE", 12)},
            tooltip: "YOU ARE NOW CURSED",
        },
        24: {
            name: () => `magnetic`,
            done() {return player.DMC.total.gte(1)},
            tooltip: "I am the storm that is approaching",
        },
        25: {
            name: () => `good luck`,
            done() {return player.VX.total.gte(1)},
            tooltip: "CHAOS CHAOS",
        },
    },
    clickables: {
        11: {
            display() {return `pointless clicks ${player.pointlessclicks.neq(0) ? player.pointlessclicks.gt(1) ? `and yet you have clicked it ${player.pointlessclicks.toFixed(0)} times` : "and yet you have clicked it" : ""}`},
            canClick() {return true},
            onClick() {player.pointlessclicks = player.pointlessclicks.add(1)},
        }
    },
    shouldNotify() {return player.pointlessclicks.lt(10)},
});

