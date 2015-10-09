var Engine = {
	timeThen: new Date().getTime(),
	timeNow: new Date().getTime(),
	ticks: 0,
	idleSpeed: 1000,
	idleTimer: function() {
		
		Engine.timeNow = new Date().getTime();

		var timeDifference = Engine.timeNow - Engine.timeThen - Engine.ticks;

		while (timeDifference >= Engine.idleSpeed) {
                        critRoll();
                        fight();
                        updateLabels();
			timeDifference -= Engine.idleSpeed;
			Engine.ticks += Engine.idleSpeed;
		}
		setTimeout(Engine.idleTimer, (Engine.idleSpeed - timeDifference));
	},
	init: function() {
		Engine.idleTimer();	
	}
};

window.onload = function() {
    //if(!window.localStorage.getItem("savechar"))
        //$('#myModal').modal("show");
    
        load();
	Engine.init();
        checkUnlockedWorld();
        checkUnlockedTabs();
        updateLabels();
};

window.onbeforeunload = function() {
    save();
};

function save() {
    var savechar = JSON.stringify(char);
    window.localStorage.setItem("savechar",savechar);
    var saveenemy = JSON.stringify(enemy);
    window.localStorage.setItem("saveenemy",saveenemy);
    var saveworld = JSON.stringify(world);
    window.localStorage.setItem("saveworld",saveworld);
    console.log("saved!");
};

function load() {
    if(window.localStorage.getItem("savechar")) {
        char = JSON.parse(window.localStorage.getItem("savechar"));
        enemy = JSON.parse(window.localStorage.getItem("saveenemy"));
        world = JSON.parse(window.localStorage.getItem("saveworld"));
    }
}

$(function() {
   $("#deleteSave").click(function() {
       if(window.localStorage.getItem("savechar")) {
           window.localStorage.removeItem("savechar");
           window.localStorage.removeItem("saveenemy");
           window.localStorage.removeItem("saveworld");
           console.log("deleted!");
           resetValues();
           //$('#myModal').modal("show");
       }
   });
});

function resetValues() {
  char.level = 1;
  char.currentXP = 0;
  char.neededXP = 500;
  char.damage = 10;
  char.critChance = 5;
  char.critDmg = 50;
  char.prestige = 0;
  char.currentMoney = 0;
  char.nextHitCrit = false;
  enemy.maxHP = 50;
  enemy.currentHP = 50;
  enemy.xp = 5;
  enemy.gold = 50;
  world.currentWorld = 1;
  world.maxWorld = 1;
  world.killsNeeded = 10;
  world.autoProgress = false;
  $("#prevWorld").prop('disabled', true);
  $("#nextWorld").prop('disabled', true);
  $("#tabDungeonHandler").hide();
};

function checkUnlockedTabs() {
    if(char.level > 10) {
        $("#tabDungeonHandler").show();
    }else
        $("#tabDungeonHandler").hide();
    /*if(dungeon.beaten >= 1) {
        $("#tabInventoryHandler").show();
    }*/
    
};

var char = {
    level: 1,
    currentXP: 0,
    neededXP: 500,
    damage: 10,
    critChance: 5,
    critDmg: 50,
    prestige: 0,
    currentMoney: 0,
    nextHitCrit: false
};

var enemy = {
    maxHP: 50,
    currentHP: 50,
    xp: 5,
    gold: 50
};

var world = {
    currentWorld: 1,
    maxWorld: 1,
    killsNeeded: 10,
    autoProgress: false
};

function critRoll() {
    var crit = Math.floor(Math.random()*100+1);
    if( crit <= char.critChance)
        char.nextHitCrit = true;
    else
        char.nextHitCrit = false;
};

function fight() {
    var critHitDmg = char.damage * (1 + (char.critDmg/100));
    if(enemy.currentHP === 0) {
        enemyKilled();
        enemy.currentHP = enemy.maxHP;
    }
    else if(enemy.currentHP < char.damage && char.nextHitCrit === false) {
        enemy.currentHP = 0;
    }
    else if(enemy.currentHP < critHitDmg && char.nextHitCrit === true)
        enemy.currentHP = 0;
    else {
        if(char.nextHitCrit === true)
            enemy.currentHP -= critHitDmg;
        else
            enemy.currentHP -= char.damage;
    }
};

function enemyKilled() {
    if(char.currentXP + enemy.xp >= char.neededXP) {
        levelUp();
    }
    else if(char.level < 50)
        char.currentXP += enemy.xp;
    
    char.currentMoney += enemy.gold;
    
    if((world.killsNeeded-1) > 0 && world.currentWorld === world.maxWorld)
        world.killsNeeded -= 1;
    else if(world.currentWorld === world.maxWorld){
        world.killsNeeded = 0;
        $("#nextWorld").prop('disabled', false);
        if(world.autoProgress === true)
            nextWorld();
    }
    
    if(world.autoProgress === true && world.currentWorld !== world.maxWorld)
        nextWorld();
};

function updateLabels() {
    if(world.autoProgress) {
        $("#autoProgress").addClass("active");
        $("#autoProgressLabel").html("Auto Progress: ON");
    }
        
    var percentageHP = Math.floor((enemy.currentHP/enemy.maxHP)*100);
    var percentageXP = Math.floor((char.currentXP/char.neededXP)*100);
    $("#fightbar").css("width",percentageHP+"%").attr("aria-valuenow",percentageHP+"%");
    $("#fightbar").html(enemy.currentHP);
    $("#xpbar").css("width",percentageXP+"%").attr("aria-valuenow",percentageXP+"%");
    $("#xpbar").html(percentageXP+"%");
    $("#badgeCurrentMoney").html(char.currentMoney);
    $("#badgeLevel").html(char.level);
    $("#badgeDmg").html(char.damage);
    $("#badgeCritChance").html(char.critChance+"%");
    $("#badgeCritDmg").html(char.critDmg+"%");
    $("#badgePrestige").html(char.prestige);
    if(char.level < 50)
        $("#badgeNeededXP").html(char.neededXP);
    else
        $("#badgeNeededXP").html("MAX");
    $("#badgeWorld").html(world.currentWorld);
    $("#badgeEnemyMaxHP").html(enemy.maxHP);
    $("#badgeEnemyXP").html(enemy.xp);
    $("#badgeEnemyGold").html(enemy.gold);
    $("#badgeKillsNeeded").html(world.killsNeeded);
    $("#prevWorldLabel").html("World "+(world.currentWorld-1));
    $("#nextWorldLabel").html("World "+(world.currentWorld+1));
    $("#nextWorldKills").html((world.maxWorld+1));
};

function levelUp() {
    console.log(char.level);
    if(char.level+1 === 50) {
        char.level += 1;
        char.currentXP = 100;
        char.neededXP = 100; 
    }else if(char.level < 50) {
    char.level += 1;
    char.damage += 10;
    char.currentXP = Math.floor((char.currentXP+enemy.xp)%char.neededXP);
    char.neededXP = Math.floor((Math.pow(char.level,1.7)*500));
    }
    
    char.critChance = Math.floor(Math.pow(char.level,0.78)+4);
    char.critDmg = Math.floor(Math.pow(char.level,1.283)+49);
    
};

function beautify(number) {
    return Math.floor(number*100) / 100;
};

$(function () {
    $("#nextWorld").click(function ()
    {
        nextWorld();
    }
    );
});

function nextWorld() {
    $("#prevWorld").prop('disabled', false);
        
        if(world.currentWorld === world.maxWorld) {
            world.maxWorld++;
            world.killsNeeded = 10;
        }
    
        world.currentWorld++;
        enemy.gold += 20;
        enemy.xp += 10;
        enemy.maxHP += 50;
        enemy.currentHP = enemy.maxHP;
        
        checkUnlockedWorld();
        updateLabels();
};

$(function () {
    $("#prevWorld").click(function ()
    {
        if(world.currentWorld-1 === 1) 
            $("#prevWorld").prop('disabled', true);
        
        world.currentWorld--;
        enemy.gold -= 20;
        enemy.xp -= 10;
        enemy.maxHP -= 50;
        enemy.currentHP = enemy.maxHP;
        world.autoProgress = false;
        checkUnlockedWorld();
        updateLabels();
    }
    );
});

function generateWorld() {
    
};

function checkUnlockedWorld() {
    if(world.currentWorld < world.maxWorld)
        $("#nextWorld").prop('disabled', false);
    else
        $("#nextWorld").prop('disabled', true);
    if(world.currentWorld === 1)
    {
        $("#prevWorld").prop('disabled', true);
    }
};

$(function () {
    $("#autoProgress").click(function ()
    {
        if(world.autoProgress === false) {
            world.autoProgress = true;
            $("#autoProgress").addClass("active");
            $("#autoProgressLabel").html("Auto Progress: ON");
        }
        else {
            world.autoProgress = false;
            $("#autoProgress").removeClass("active");
            $("#autoProgressLabel").html("Auto Progress: OFF");
        }
    }
    );
});