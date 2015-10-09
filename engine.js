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
	Engine.init();
        updateLabels();
};

var char = {
    level: 1,
    currentXP: 0,
    neededXP: 100,
    damage: 10,
    critChance: 5,
    critDmg: 50,
    prestige: 0,
    currentMoney: 0,
    cost: 50,
    nextHitCrit: false
};

var enemy = {
    currentWorld: 1,
    maxWorld: 1,
    level: 1,
    maxHP: 50,
    currentHP: 50,
    xp: 5,
    gold: 50,
    killsNeeded: 10
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
    else
        char.currentXP += enemy.xp;
    
    char.currentMoney += enemy.gold;
    
    if((enemy.killsNeeded-1) > 0 && enemy.currentWorld === enemy.maxWorld)
        enemy.killsNeeded -= 1;
    else if(enemy.currentWorld === enemy.maxWorld){
        enemy.killsNeeded = 0;
        $("#nextWorld").prop('disabled', false);
    }
};

function updateLabels() {
    
    if(char.currentMoney < char.cost) {
        $(".levelUpButton").prop('disabled', true); }
    else {
        $(".levelUpButton").prop('disabled', false); }
    
    if(char.critChance === 100)
        $("#addCritChance").prop('disabled', true);
    
    var percentageHP = Math.floor((enemy.currentHP/enemy.maxHP)*100);
    $("#fightbar").css("width",percentageHP+"%").attr("aria-valuenow",percentageHP+"%");
    $("#fightbar").html(enemy.currentHP);
    $("#xpbar").css("width",char.currentXP+"%").attr("aria-valuenow",char.currentXP+"%");
    $("#xpbar").html(char.currentXP+"%");
    $("#badgeCurrentMoney").html(char.currentMoney);
    $("#badgeCost").html(char.cost);
    $("#badgeLevel").html(char.level);
    $("#badgeDmg").html(char.damage);
    $("#badgeCritChance").html(char.critChance+"%");
    $("#badgeCritDmg").html(char.critDmg+"%");
    $("#badgePrestige").html(char.prestige);
    $("#badgeNeededXP").html(char.neededXP);
    $("#badgeWorld").html(enemy.currentWorld);
    $("#badgeEnemyLevel").html(enemy.level);
    $("#badgeEnemyMaxHP").html(enemy.maxHP);
    $("#badgeEnemyXP").html(enemy.xp);
    $("#badgeKillsNeeded").html(enemy.killsNeeded);
    $("#prevWorldLabel").html("World "+(enemy.currentWorld-1));
    $("#nextWorldLabel").html("World "+(enemy.currentWorld+1));
};

function levelUp() {
    char.level += 1;
    char.currentXP = (char.currentXP+enemy.xp)%100;
};

/*$(function () {
    $("#addDamage").click(function ()
    {
        char.damage += 1;
        char.currentMoney -= char.cost;
        char.cost += 10;
        updateLabels();
    }
    );
});

$(function () {
    $("#addCritChance").click(function ()
    {
        if(char.critChance<100) {
            char.critChance += 1;
            char.currentMoney -= char.cost;
            char.cost += 10;
        }
        
        updateLabels();
    }
    );
});

$(function () {
    $("#addCritDmg").click(function ()
    {
        char.critDmg += 5;
        char.currentMoney -= char.cost;
        char.cost += 10;
        updateLabels();
    }
    );
});*/

$(function () {
    $("#nextWorld").click(function ()
    {
        $("#prevWorld").prop('disabled', false);
        
        if(enemy.currentWorld === enemy.maxWorld) {
            enemy.maxWorld++;
            enemy.killsNeeded = 10;
        }
    
        enemy.currentWorld++;
        enemy.level += 2;
        enemy.gold += 20;
        enemy.xp += 10;
        enemy.maxHP += 50;
        enemy.currentHP = enemy.maxHP;
        
        checkUnlockedWorld();
        updateLabels();
    }
    );
});

$(function () {
    $("#prevWorld").click(function ()
    {
        if(enemy.currentWorld-1 === 1) 
            $("#prevWorld").prop('disabled', true);
        
        enemy.currentWorld--;
        enemy.level -= 2;
        enemy.gold -= 20;
        enemy.xp -= 10;
        enemy.maxHP -= 50;
        enemy.currentHP = enemy.maxHP;
        checkUnlockedWorld();
        updateLabels();
    }
    );
});

function checkUnlockedWorld() {
    if(enemy.currentWorld < enemy.maxWorld)
        $("#nextWorld").prop('disabled', false);
    else
        $("#nextWorld").prop('disabled', true);
};