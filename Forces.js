FORCES = function(){
	this.forceList = [];
	this.tempForceX = 0;
	this.tempForceY = 0;
	this.tempForce = null;
};


FORCES.prototype.constructor = FORCES;

FORCES.prototype.attract = function(id,attractor,strength,radius){
	//pre-defined force object to be stored in the forceList array.
	return {
		id : id,
		attractor : attractor,
		strength : strength,
		radius : radius,
		fX : 0,
		fY : 0,
		angle : 0,
		dist : 1,
		tempX : 0,
		tempY : 0,
		returnObject : { x : 0, y : 0},
		applyForce : function(a){
			this.fX=0;
			this.fY=0;
			this.tempX = this.attractor.x - a.x;
			this.tempY = this.attractor.y - a.y;
			this.angle = Math.atan2(this.tempY, this.tempX);
			if(this.radius>0){
				if(Math.sqrt(this.tempX*this.tempX+this.tempY*this.tempY<this.radius)){
					this.fX += this.strength*Math.cos(this.angle);
					this.fY += this.strength*Math.sin(this.angle);
				}
			}
			else{
				this.fX += this.strength*Math.cos(this.angle);
				this.fY += this.strength*Math.sin(this.angle);
			}
			this.returnObject.x = this.fX; this.returnObject.y = this.fY;
			return this.returnObject;
		}
	}
};

FORCES.prototype.distanceAttract = function(id,attractor,strength,radius){
	//pre-defined faux gravity force
	return {
		id : id,
		attractor : attractor,
		strength : strength,
		radius : radius,
		fX : 0,
		fY : 0,
		angle : 0,
		dist : 1,
		tempX : 0,
		tempY : 0,
		returnObject : { x : 0, y : 0},
		applyForce : function(a){
			this.fX=0;
			this.fY=0;
			this.tempX = this.attractor.x - a.x;
			this.tempY = this.attractor.y - a.y;
			this.angle = Math.atan2(this.tempY, this.tempX);
			this.dist = Math.sqrt(this.tempX*this.tempX+this.tempY*this.tempY);
			if(this.dist<40)	//ensure no divide by zeroes :P
				this.dist = 40;
			if(this.radius>0){
				if(this.dist<this.radius)
					this.fX += this.strength*Math.cos(this.angle)/this.dist; 	// :O only dist and not dist^2?!?
					this.fY += this.strength*Math.sin(this.angle)/this.dist;	// yeah, looks fine to me
			}
			else{					
				this.fX += this.strength*Math.cos(this.angle)/this.dist;
				this.fY += this.strength*Math.sin(this.angle)/this.dist;
			}
			this.returnObject.x = this.fX; this.returnObject.y = this.fY;
			return this.returnObject;
		}
	}
};

FORCES.prototype.addForce = function(f){
	this.forceList.push(f);
};

FORCES.prototype.applyForces = function(a){
	this.tempForceX = 0; this.tempForceY = 0;
	for(var i=0;i<this.forceList.length;i++){
		this.tempForce = this.forceList[i].applyForce(a);
		this.tempForceX += this.tempForce.x;
		this.tempForceY += this.tempForce.y;
	}
	a.body.force.x = this.tempForceX;
	a.body.force.y = this.tempForceY;
};

FORCES.prototype.removeForce = function(id){
	for(var i=0;i<this.forceList.length;i++){
		if(this.forceList[i].id===id){
			this.forceList.splice(flag,1);
			i--;
		}
	}
		
};