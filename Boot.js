/* Created by Nam - Game Dolphin - http://gamedolph.in
	2014 - August - 16, Saturday. 

	Code is completely open - copy, distribute, modify yada yada yada. Go crazy with it. :)
*/

BasicSim = function(game){

};

BasicSim.prototype.setUpControls = function(){

	this.colorSet = [0xFCE94F,0xFCAF3E,0xE9B96E,0x8AE234,0x729FCF,0xAD7FA8,0xEF2929];
	this.totalCircles = 100;
	this.radiusRange = { min : 8, max : 16 };
	this.attractionStrength = 20;
	this.repulsionStrength = 20;

	this.attractionPoint = {x : this.world.centerX, y:this.world.centerY};
};


BasicSim.prototype.create = function(){

	this.setUpScreen();
	this.setUpControls();

	this.setUpCircles();
	this.setUpForces();

	this.setUpInput();
};

BasicSim.prototype.update = function(){

	this.inputObject.x = this.input.x;
	this.inputObject.y = this.input.y;
	this.putToSleep();
	this.circleGroup.forEachAlive(this.forceControl.applyForces,this.forceControl);
	
};

BasicSim.prototype.putToSleep = function(){
	if(this.sleeping==false){
		this.sleepCounter += 1;
		if(this.sleepCounter>this.sleepTime){
			this.physics.p2.enableBodySleeping=true;
			this.sleepCounter = 0;
			this.sleeping = true;
		}
	}
};

BasicSim.prototype.setUpInput = function(){
	this.sleepCounter = 0;
	this.sleepTime = 240;
	this.sleeping = true;
	this.input.addMoveCallback(function(){
		this.sleepCounter = 0;
		if(this.sleeping){
			this.sleeping = false;
			this.physics.p2.enableBodySleeping = false;
			this.circleGroup.setAll('body.data.sleepState',0);
		}
	},this);
};


BasicSim.prototype.setUpForces = function(){

	this.forceControl = new FORCES();

	var k = this.forceControl.attract('center',{x : this.world.centerX, y : this.world.centerY},this.attractionStrength*100,-1);
	this.forceControl.addForce(k);
	this.inputObject = { x : this.input.x, y:this.input.y};
	k = this.forceControl.distanceAttract('mouse',this.inputObject, -this.repulsionStrength*20000,-1);
	this.forceControl.addForce(k);
};


BasicSim.prototype.setUpCircles = function(){
	this.circleGroup = this.add.group();
	var data = {  	lineStyle : {	width : 2, color : 0x2E3436, alpha : 0.8},
					fillStyle : {	color : 0xFFFFFF, alpha : 1 },
					radius : 10,
					x : 10,
					y : 10
				};
	for(var i=0;i<this.totalCircles;i++){

		data.fillStyle.color = this.colorSet[this.rnd.integerInRange(0,this.colorSet.length-1)];
		data.radius = 2*this.rnd.integerInRange(this.radiusRange.min/2,this.radiusRange.max/2);
		data.x = this.rnd.integerInRange(data.radius+4,this.world.width-data.radius-4);
		data.y = this.rnd.integerInRange(data.radius+4,this.world.height-data.radius-4);

		this.circleGroup.add(this.createCircle(data));
	}
};

BasicSim.prototype.createCircle = function(data){
	var lineStyle = data.lineStyle;
	var fillStyle = data.fillStyle;
	var k = this.game.make.graphics(0,0);
	k.lineStyle(lineStyle.width,lineStyle.color,lineStyle.alpha);
	k.beginFill(fillStyle.color, fillStyle.alpha);
	k.drawCircle(0,0, data.radius);

	var sprite = this.game.add.sprite(data.x,data.y,k.generateTexture());
	this.physics.p2.enable(sprite);
	sprite.body.setCircle(data.radius+2);
	sprite.body.collideWorldBounds = true;
	sprite.body.damping = 0.9;
	sprite.body.allowSleep = true;
	sprite.body.sleepSpeedLimit = 2;
	sprite.body.sleepTimeLimit = 0.5;
	return sprite;
};


BasicSim.prototype.setUpScreen = function(){
	this.stage.backgroundColor = 'EEEEEC';
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.restitution = 0;
    this.game.physics.p2.friction = 30;
    this.game.physics.p2.applyDamping = true;
    this.game.physics.p2.enableBodySleeping = true;

};