/* Created by Nam - Game Dolphin - http://gamedolph.in
	2014 - August - 16, Saturday. 

	Code is completely open - copy, distribute, modify yada yada yada. Go crazy with it. :)
*/

BasicSim = function(game){

};

BasicSim.prototype.setUpControls = function(){

	this.colorSet = [0xFCE94F,0xFCAF3E,0xE9B96E,0x8AE234,0x729FCF,0xAD7FA8,0xEF2929]; //Tango palette
	this.totalCircles = 100;
	this.radiusRange = { min : 8, max : 16 };
	this.attractionStrength = 2000;
	this.repulsionStrength = 400000;

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
	this.putToSleep();	//puts P2 bodies to sleep if nothing happens for around 3 seconds.
	this.circleGroup.forEachAlive(this.forceControl.applyForces,this.forceControl); //apply forces to the circles.
	
};

BasicSim.prototype.putToSleep = function(){
	if(this.sleeping==false){ 							//if not sleeping, 
		this.sleepCounter += 1; 						//update counter to count time
		if(this.sleepCounter>this.sleepTime){ 			//if counter exceeds time limit
			this.physics.p2.enableBodySleeping=true;	//set sleeping enabled
			this.sleepCounter = 0;						//reset counter
			this.sleeping = true;						//control for when you require everyone to wake up
		}
	}
};

BasicSim.prototype.setUpInput = function(){
	this.sleepCounter = 0;								//the counter to manage sleep
	this.sleepTime = 240;								//no.of frames before checking for sleeping conditions
	this.sleeping = true;								//is sleeping allowed?

	this.input.addMoveCallback(function(){				//When mouse moves,
		this.sleepCounter = 0;							//reset the sleep counter
		if(this.sleeping){								//if sleeping is allowed, 
			this.sleeping = false;						//get yo fat'ass off the couch, no more sleeping, the mouse's moving!
			this.physics.p2.enableBodySleeping = false; //no more sleeping allowed
			this.circleGroup.setAll('body.data.sleepState',0); //wake everyone up!
		}
	},this);
};


BasicSim.prototype.setUpForces = function(){

	this.forceControl = new FORCES();					//FORCE object has details of the forces.

	var k = this.forceControl.attract('center',this.attractionPoint,this.attractionStrength,-1);
	this.forceControl.addForce(k);						//add the central attraction force.
	this.inputObject = { x : this.input.x, y:this.input.y}; //mouse object to follow
	k = this.forceControl.distanceAttract('mouse',this.inputObject, -this.repulsionStrength,-1);
	this.forceControl.addForce(k);						//add mouse repulsion force.
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
		//create random circles with limits on random properties.
		data.fillStyle.color = this.colorSet[this.rnd.integerInRange(0,this.colorSet.length-1)];
		data.radius = 2*this.rnd.integerInRange(this.radiusRange.min/2,this.radiusRange.max/2);
		data.x = this.rnd.integerInRange(data.radius+4,this.world.width-data.radius-4);
		data.y = this.rnd.integerInRange(data.radius+4,this.world.height-data.radius-4);

		this.circleGroup.add(this.createCircle(data));
	}
};

BasicSim.prototype.createCircle = function(data){
	//create the graphic
	var lineStyle = data.lineStyle;
	var fillStyle = data.fillStyle;
	var k = this.game.make.graphics(0,0);
	k.lineStyle(lineStyle.width,lineStyle.color,lineStyle.alpha);
	k.beginFill(fillStyle.color, fillStyle.alpha);
	k.drawCircle(0,0, data.radius);

	//create the sprite
	var sprite = this.game.add.sprite(data.x,data.y,k.generateTexture());

	//create the physics P2JS body to go with it
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

    //start the Physics system as well. 
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.restitution = 0; 	//nope
    this.game.physics.p2.friction = 30; 	//yep
    this.game.physics.p2.applyDamping = true; 	//to make them come to rest quickly - too much jiggling hurts the eyes.
    this.game.physics.p2.enableBodySleeping = true;	//allow sleeping
};