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

		this.total_reward=0;

		this.previousAction=undefined;

		this.model=tf.sequential();
	}

	start(){
		this.game.plug(this);
		this.jump();
	}

	update(dino,obs,score, speed){
		this.status=this.getStatus(dino.status);
		if(this.previousAction !=undefined){
			this.actions[this.frame-1][3]=this.previousAction;
			this.reward=this.getReward();
			this.actions[this.frame-1][4]=this.reward;
			this.total_reward+=this.reward;
			console.log(this.reward);
		}
		if(this.status==2){
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
		this.actions[this.frame]=[speed, this.getDistance(), this.status];
		//console.log(this.getDistance());
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

	getReward(){
		//jump
		if(this.previousAction==0){
			if(this.status==2){
				return -150;
			}
			else if(this.status==1){
				return -1;
			}
			else if(this.actions[this.frame-1][1][0]-(this.actions[this.frame-1][0]*2)>=1){
				return -5;
			}
			else{
				return 5;
			}
		}
		//run
		else if(this.previousAction==1){
			if(this.status==2){
				return -150;
			}
			else{
				if(this.actions[this.frame-1][1][0]!=0){
					return 1-(1/this.actions[this.frame-1][1][0]);
				}
				return 1;
			}
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
