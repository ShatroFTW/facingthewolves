  (function(i,s,o,g,r,a,m){
      i['GoogleAnalyticsObject']=r;
      i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments);
  },
  i[r].l=1*new Date();
  a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];
  a.async=1;
  a.src=g;
  m.parentNode.insertBefore(a,m);
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-68773342-1', 'auto');
  ga('send', 'pageview');


var Engine = {
	timeThen: new Date().getTime(),
	timeNow: new Date().getTime(),
	ticks: 0,
	idleSpeed: 100,
        shopCooldown: 10800000,
	idleTimer: function() {
		
		Engine.timeNow = new Date().getTime();

		var timeDifference = Engine.timeNow - Engine.timeThen - Engine.ticks;

		while (timeDifference >= Engine.idleSpeed) {
                        critRoll();
                        fight();
                        updateLabels();
                        save();
			timeDifference -= Engine.idleSpeed;
			Engine.ticks += Engine.idleSpeed;
		}
		setTimeout(Engine.idleTimer, (Engine.idleSpeed - timeDifference));
	},
	init: function() {
                
                if(window.localStorage.getItem("savechar"))
                    load();
                else
                    $('#introduction').modal("show");
                checkUnlockedWorld();
                checkUnlockedTabs();
                updateLabels();
		Engine.idleTimer();
                save();
	}
};

window.onload = function() {
    
    
    $(function () {
        $('[data-toggle="popover"]').popover();
    });
    
    
    Engine.init();
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
           $('#introduction').modal("show");
       }
   });
});

function resetValues() {
  char.level = 1;
  char.totalXP = 0;
  char.currentXP = 0;
  char.neededXP = 500;
  char.damage = 100;
  char.critChance = 5;
  char.critDmg = 50;
  char.prestige = 0;
  char.currentMoney = 0;
  char.nextHitCrit = false;
  enemy.maxHP = 500;
  enemy.currentHP = 500;
  enemy.xp = 20;
  enemy.gold = 5;
  world.currentWorld = 1;
  world.maxWorld = 1;
  world.killsNeeded = 10;
  world.autoProgress = false;
  $("#prevWorld").prop('disabled', true);
  $("#nextWorld").prop('disabled', true);
  $("#autoProgress").removeClass("active");
  $("#autoProgressLabel").html("Auto Progress: OFF");
  $("#tabDungeonHandler").hide();
};

function checkUnlockedTabs() {
    if(char.level >= 10) {
        $("#tabDungeonHandler").show();
    }else {
        $("#tabDungeonHandler").hide();
    }
    /*if(dungeon.beaten >= 1) {
        $("#tabInventoryHandler").show();
    }*/
    
};

var char = {
    level: 1,
    totalXP: 0,
    currentXP: 0,
    neededXP: 500,
    damage: 100,
    critChance: 5,
    critDmg: 50,
    prestige: 0,
    currentMoney: 0,
    nextHitCrit: false
};

var enemy = {
    maxHP: 500,
    currentHP: 500,
    xp: 20,
    gold: 5

};

var world = {
    currentWorld: 1,
    maxWorld: 1,
    killsNeeded: 10,
    autoProgress: false
};

function Item(rarity, rarityName, itemType, bonusDmg, bonusCC, bonusCD, bonusXP) {
    this.rarity = rarity;
    this.rarityName = rarityName;
    this.itemType = itemType;
    this.itemName = rarityName + itemType;
    this.bonusDmg = bonusDmg;
    this.bonusCC = bonusCC;
    this.bonusCD = bonusCD;
    this.bonusXP = bonusXP;
};

function createItem() {
    
    /*itemName = "";
    itemType = "Weapon";
    rarity = 0;
    rarityName = "";
    bonusDamage = 0;
    
    
    /*var randomGen = (Math.random() * 100)+1;
    
    if(randomGen <= 3) {
        rarity = 4;
        rarityName = "Legendary ";
        bonusDamage = char.damage * (1 + (((Math.random() * 100) + 85)/100));
    }
    else if(randomGen <= 17 && randomGen > 3) {
        rarity = 3;
        rarityName = "Rare ";
        bonusDamage = char.damage * (1 + (((Math.random() * 80) + 50)/100));
    }
    else if(randomGen <= 35 && randomGen > 17) {
        rarity = 2;
        rarityName = "Magic ";
        bonusDamage = char.damage * (1 + (((Math.random() * 45) + 30)/100));

    }
    else {
        rarity = 1;
        rarityName = "Common ";
        bonusDamage = char.damage * (1 + (((Math.random() * 20) + 5)/100));
    }*/
    var tempItem = new Item(1, "Common ", "Helmet", 30, 0, 0, 0);
    return tempItem;
};

var equipment = [];

var shop = {
    
};

function critRoll() {
    var crit = beautify(Math.random()*100+1);
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
    save();
};

function enemyKilled() {
    if(char.currentXP + enemy.xp >= char.neededXP) {
        levelUp();
    }
    else if(char.level < 50) {
        char.totalXP += enemy.xp;
        char.currentXP += enemy.xp;
    }
        
    
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
    $("#fightbar").html(beautify(enemy.currentHP));
    $("#xpbar").css("width",percentageXP+"%").attr("aria-valuenow",percentageXP+"%");
    $("#xpbar").html(Math.floor(percentageXP)+"%");
    $("#badgeCurrentMoney").html(beautify(char.currentMoney));
    $("#badgeLevel").html(char.level);
    $("#badgeDmg").html(beautify(char.damage));
    $("#badgeCritChance").html(Math.floor(char.critChance)+"%");
    $("#badgeCritDmg").html(Math.floor(char.critDmg)+"%");
    $("#badgeTotalXP").html(beautify(char.totalXP));
    $("#badgePrestige").html(beautify(char.prestige));
    if(char.level < 50) {
        $("#badgeNeededXP").html(beautify(char.neededXP));
        $("#badgeCurrentXP").html(beautify(char.currentXP));
    }
    else {
        $("#badgeNeededXP").html("MAX");
        $("#badgeCurrentXP").html("MAX");
    }
    $("#badgeWorld").html(world.currentWorld);
    $("#badgeEnemyMaxHP").html(beautify(enemy.maxHP));
    $("#badgeEnemyXP").html(beautify(enemy.xp));
    $("#badgeEnemyGold").html(beautify(enemy.gold));
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
        char.totalXP += enemy.xp;
    }else if(char.level < 50) {
    char.level += 1;
    char.damage = (Math.pow(1.3,char.level-1)*100)+100;
    char.totalXP += enemy.xp;
    char.currentXP = Math.floor((char.currentXP+enemy.xp)%char.neededXP);
    char.neededXP = Math.floor((Math.pow(char.level,2)*100)+400);
    }
    
    char.critChance = Math.floor(Math.pow(char.level,0.78)+4);
    char.critDmg = Math.floor(Math.pow(char.level,1.283)+49);
    
};

function beautify(number) {
    var num = Math.floor((number*100) / 100);
    
    var suffixes = ["K"  ,"M"  ,"B"  ,"T"   ,"Qa"  ,"Qt"  ,"Sx"  ,"Sp"  ,"Oc"  ,"No","Dc",
                          "UDc","DDc","TDc","QaDc","QtDc","SxDc","SpDc","OcDc","NoDc","Vg",
                          "UVg","DVg","TVg","QaVg","QtDc","SxVg","SpVg","OcVg","NoVg","Tr",
                          "UTr","DTr","TTr","QaTr","QtTr","SxTr","SpTr","OcTr","NoTr","Qu",
                          "UQu","DQu","TQu","QaQu","QtQu","SxQu","SpQu","OcQu","NoQu","Qi",
                          "UQi","DQi","TQi","QaQi","QtQi","SxQi","SpQi","OcQi","NoQi"];
    
    for (var i = suffixes.length - 1;i >= 0;i--){
        if (num >= Math.pow(1000,i + 1)){
            return (num / Math.pow(1000,i + 1)).toFixed(2) + suffixes[i];
        }
    }
    
    return num;
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
        generateWorld();
};

$(function () {
    $("#prevWorld").click(function ()
    {
        if(world.currentWorld-1 === 1) 
            $("#prevWorld").prop('disabled', true);
        
        world.currentWorld--;
        world.autoProgress = false;
        generateWorld();
    }
    );
});

function generateWorld() {
    
    enemy.xp = Math.pow(1.1,(world.currentWorld-1))*20;
    enemy.maxHP = Math.pow(1.2,world.currentWorld-1)*500;
    enemy.currentHP = enemy.maxHP;
    enemy.gold = Math.pow(1.15,world.currentWorld-1) * 5;
    checkUnlockedWorld();
    updateLabels();
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





$(function () {
    $("#generateItem").click(function ()
    {
        console.log(JSON.stringify(createItem()));
    }
    );
});