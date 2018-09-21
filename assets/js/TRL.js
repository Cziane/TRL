/*General config*/

class TRL{

	constructor(gme,learningMin=500){
		//reference to game
		this.game=gme;
		this.learningMin=learningMin;
		this.trex={};
		this.real_frame=0;
		this.random=true;
		this.game_nb=0;
		//matrice state;
		this.frame=0;
		//action matrix
		this.actions=[];
		this.decision=[];
		//Q-learning parameters
		this.gamma=1;
		this.alpha=0.9;
		this.explovsexploit=0.2;

		this.R_Matrix=[
		[1,0],
		[1,-10],
		[-150,-150]
		];


		//init
		this.Q_Matrix=[
		/*0*/	[0,0],
		/*1*/	[0,0],
		/*2*/	[0,0],
				[0,0],
		/*3*/	[-150,0],
		/*4*/	[0,-150],

		];	

		this.status=[];
		this.previousAction=undefined;
	}

	start(){
		this.game.plug(this);
		this.jump();
	}

	update(dino,obs,score, speed){
		if(this.getStatus(dino.status)==2){
			this.explovsexploit-=0.01;
			var reward=this.getReward(this.previousAction, this.getStatus(dino.status));
			this.distance=this.getDistance();
			var state_d=this.getDistanceState(this.distance);
			this.update_Q(state_d,this.getDistanceState([this.distance[0]+this.speed*2,this.distance[1]]),reward,this.previousAction);
			this.game_nb++;
			this.game.restart();
			return 0;			
		}
		if(this.real_frame%4!=0){
			this.real_frame++;
			return 0;
		}
		this.status[this.frame]=this.getStatus(dino.status);
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
				xpos:700,
				ypos:0,
				width:0,
				height:0
			}

		}
		
		this.speed=speed;
		this.distance=this.getDistance();
		this.actions[this.frame]=[speed, this.distance[0],this.distance[1], this.status[this.frame]];
		//console.log(this.getDistance());
		var state_d=this.getDistanceState(this.distance);
		this.previousAction=this.takedecision(state_d);
		var reward=this.getReward(this.previousAction, this.status[this.frame]);
		this.update_Q(state_d,this.getDistanceState([this.distance[0]+this.speed*2,this.distance[1]]),reward,this.previousAction);
		//this.previousAction=this.takedecision();
		switch(this.previousAction){
			case 0 :
				this.run();
				break;
			case 1 :
				this.jump();
				break;
		}
		this.real_frame++;
		this.frame++;
	}

	update_Q(s,s_next,r,a){
		var max_q_next=Math.max(this.Q_Matrix[s_next][0],this.Q_Matrix[s_next][1]);
		this.Q_Matrix[s][a]=this.alpha*(r+this.gamma*max_q_next-this.Q_Matrix[s][a]);
	}

	getReward(done,state){
		return this.R_Matrix[state][done];
	}

	nextState(action,state){
		//Run
		var distance=this.getDistance();
		if(action==0 && state==0){
			if(distance[0]-2*this.speed>0){
				return 0;
			}
			else{
				return 2;
			}
		}
		else if (action==0 && state==1){
			return 1;
		}
		//Jump
		else{
			if(distance[0]-this.speed>0){
				return 1;
			}
			else{
				return 2;
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
		var nearestPoint =[this.obstacle.xpos,this.obstacle.ypos+this.obstacle.heigh];
		var farestPoit=[this.obstacle.xpos+this.obstacle.width,this.obstacle.ypos+this.obstacle.height];
		var tRexPoint=[this.trex.x+this.trex.width,this.trex.y];
		
		var distance=[Math.abs(nearestPoint[0]-tRexPoint[0]),nearestPoint[1]-tRexPoint[1]];
		return distance;
	}

	getDistanceState(distance){
			if(distance[1]<5){
				return 5;
			}
			if(distance[0]< this.speed*5){
				return 4;
			}
			else if(distance[0]<this.speed*10){
				return 3;
			}
			else if(distance[0]<this.speed*15){
				return 2;
			}
			else if(distance[0]<this.speed*20){
				return 1;
			}
			else{
				return 0;
			}
	}

	takedecision(state){
		var random=Math.random();
		if(random<this.explovsexploit){
			return Math.floor(Math.random()*2);
		}

		var action = this.Q_Matrix[state][0] > this.Q_Matrix[state][1] ? 0 : 1;
		return action;
	}



	train(){	
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
