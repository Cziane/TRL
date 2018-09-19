/*General config*/

var state=['jumping','running','dead'];

var actions=['jump','do_nothing'];

class TRL{

	constructor(gme,learningMin=500){
		//reference to game
		this.game=gme;
		this.learningMin=learningMin;
		this.trex={};
		this.real_frame=0;
		//matrice state;
		this.frame=0;
		//action matrix
		this.actions=[];
		//Q-learning parameters
		this.gamma=0.99;
		this.final_expsilon=0.0001;
		this.initial_espilon=0.01;

		this.reward=0;

		this.previousAction=undefined;

		this.model=tf.sequential();
	}

	start(){
		this.game.plug(this);
		this.jump();
	}

	update(dino,obs,score, speed){
		if(dino.status=="CRASHED"){
			this.game.restart();
		}
		if(this.real_frame%4 !=0){
			this.real_frame++;
			return 0;
		}
		this.real_frame++;

		this.trex.x=dino.xPos;
		this.trex.y=dino.yPos;
		this.trex.width=dino.config.WIDTH;
		this.trex.height=dino.config.HEIGHT;
		this.trex.status=this.getStatus(dino.status);
		if(obs !=undefined){
			this.obstacle={
				xpos:obs.xPos,
				ypos:obs.yPos,
				width:obs.width,
				height:obs.typeConfig.height
			}
		}
		else{
			this.obstacle={
				xpos:-1,
				ypos:-1,
				width:0,
				height:0
			}

		}
		

		this.speed=speed;
		this.actions[this.frame]=[speed, this.getDistance(), this.trex.status];
		if(this.previousAction !=undefined){
			this.actions[this.frame-1][3]=this.previousAction;
		}
		console.log(this.getDistance());
		this.frame++;
		this.previousAction=this.takedecision();
		switch(this.previousAction){
			case 0 :
				this.jump();
				break;
			case 1 :
				this.run();
				break;
		}
	}

	getStatus(status){
		if(status == "JUMPING"){
			return 1;
		}
		else if(status == "CRASHED"){
			return 2;
		}
		return 0;
	}

	getDistance(){
		var nearestPoint =[this.obstacle.xpos,this.obstacle.ypos];
		var farestPoit=[this.obstacle.xpos+this.obstacle.width,this.obstacle.ypos];
		var tRexPoint=[this.trex.x+this.trex.width,this.trex.y];
		
		var distance=[Math.abs(nearestPoint[0]-tRexPoint[0]),Math.abs(nearestPoint[1]-tRexPoint[1])];

		return distance;
	}

	takedecision(){
		if(this.frame < this.learningMin){
			var decision= Math.floor(Math.random() * Math.floor(1000));
			if(decision<600){
				return 1;
			}
			else{
				return 0;
			}
		}
	}


	


	initEnvironment(){
		this.environment=[];

	}

	jump(){
		var pressthiskey = " "/* <--- :) !? q for example */;
		var e = new Event("keydown");
		e.key=pressthiskey;
		e.keyCode=e.key.charCodeAt(0);
		e.which=e.keyCode;
		e.altKey=false;
		e.ctrlKey=true;
		e.shiftKey=false;
		e.metaKey=false;
		document.dispatchEvent(e);
		return true;
	}

	run(){
		return true;
	}
}
