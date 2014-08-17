FORCES = function(){
	this.forceList = [];
};


FORCES.prototype.constructor = FORCES;

FORCES.prototype.attract = function(id,attractor,strength,radius){
	return {
		id : id,
		attractor : attractor,
		strength : strength,
		radius : radius,
		applyForce : function(a){
			var fX=0, fY=0;
			var angle = Math.atan2(attractor.y - a.y, attractor.x - a.x);
			if(this.radius>0){
				if(Math.sqrt((attractor.x-a.x)*(attractor.x-a.x)+(attractor.y-a.y)*(attractor.y-a.y)<this.radius)){
					fX += this.strength*Math.cos(angle);
					fY += this.strength*Math.sin(angle);
				}
			}
			else{
				fX += this.strength*Math.cos(angle);
				fY += this.strength*Math.sin(angle);
			}
			return { x : fX, y: fY };
		}
	}
};

FORCES.prototype.distanceAttract = function(id,attractor,strength,radius){
	return {
		id : id,
		attractor : attractor,
		strength : strength,
		radius : radius,
		fX : 0,
		fY : 0,
		applyForce : function(a){
			this.fX=0;
			this.fY=0;
			var angle = Math.atan2(attractor.y - a.y, attractor.x - a.x);
			var dist = Math.sqrt((attractor.x-a.x)*(attractor.x-a.x)+(attractor.y-a.y)*(attractor.y-a.y))
			if(dist<40)
				dist = 40;
			if(this.radius>0){
				if(dist<this.radius)
					fX += this.strength*Math.cos(angle)/dist;
					fY += this.strength*Math.sin(angle)/dist;
			}
			else{					
				fX += this.strength*Math.cos(angle)/dist;
				fY += this.strength*Math.sin(angle)/dist;
			}
			return { x : fX, y: fY };
		}
	}
};

FORCES.prototype.addForce = function(f){
	this.forceList.push(f);
};

FORCES.prototype.applyForces = function(a){
	var f, fX=0, fY=0;
	for(var i=0;i<this.forceList.length;i++){
		f = this.forceList[i].applyForce(a);
		fX += f.x;
		fY += f.y;
	}
	a.body.force.x = fX;
	a.body.force.y = fY;
};

FORCES.prototype.removeForce = function(id){
	for(var i=0;i<this.forceList.length;i++){
		if(this.forceList[i].id===id){
			this.forceList.splice(flag,1);
			i--;
		}
	}
		
};