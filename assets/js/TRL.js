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
		this.alpha=0.5;
		this.explovsexploit=1;
		this.final_expsilon=0.0001;
		this.initial_espilon=0.01;
		this.Q_Matrix=[[0,0,-10],[0,0,-10],[0,0,0]];
		this.total_reward=[];
		this.status=[];
		this.previousAction=undefined;
		this.model=tf.sequential();
		this.model.add(tf.layers.dense({units:16, inputShape:[4]}));
		this.model.add(tf.layers.dense({units:8}));
		this.model.add(tf.layers.dense({units:3, activation:'sigmoid'}));
		this.model.compile({loss:'meanSquaredError',optimizer:'adam'});
		this.trained=false;
	}

	start(){
		this.game.plug(this);
		this.jump();
	}

	update(dino,obs,score, speed){
		if(this.getStatus(dino.status)==2){
			if(this.game_nb>=this.learningMin && this.game_nb%this.learningMin==0){
				this.train();
			}
			else{
				this.game.restart();
			}
			this.game_nb++;
			
		}
		if(this.real_frame%2!=0){
			this.explovsexploit-=0.01;
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
				xpos:600,
				ypos:600,
				width:0,
				height:0
			}

		}
		

		this.speed=speed;
		this.distance=this.getDistance();
		this.actions[this.frame]=[speed, this.distance[0],this.distance[1], this.status[this.frame]];
		//console.log(this.getDistance());
		console.log(this.Q_Matrix);
		var reward=this.frame>0 ? this.getReward(this.previousAction, this.status[this.frame-1]): this.getReward(0,0);
		this.previousAction=this.update_Q(this.status[this.frame],reward);
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

	update_Q(s,r,done){
		if(!this.trained){
			this.Q_Matrix[0][0]*=((this.distance[0])/600);	
			this.Q_Matrix[0][1]*=(1-((this.distance[0])/600));
			var run_next=this.Q_Matrix[this.nextState(0,s)][0]+(this.explovsexploit*Math.random());
			var jump_next=this.Q_Matrix[this.nextState(1,s)][1]+(this.explovsexploit*Math.random());
			var max_q_next=Math.max(run_next,jump_next);
		}
		else{
			var pred=this.model.predict(tf.tensor2d([this.actions[this.frame]]));
			var run_next=pred.get(0,0);
			var jump_next=pred.get(0,1);
			var max_q_next=Math.max(run_next,jump_next);
		}
		
		var max_action=1;
		var min_action=0;
		if(run_next==max_q_next){
			max_action=0;
			min_action=1;
		}
		this.Q_Matrix[s][max_action]=this.alpha*(r+this.gamma*max_q_next-this.Q_Matrix[s][max_action]);
		//this.Q_Matrix[s][1]=this.alpha*(r+this.gamma*max_q_next-this.Q_Matrix[s][1]);
		this.decision[this.frame]=this.Q_Matrix[s];
		if(run_next== max_q_next){
			return 0;
		}
		else{
			return 1;
		}
	}

	getReward(done,state){
		return this.Q_Matrix[state][done];
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
		var nearestPoint =[this.obstacle.xpos,this.obstacle.ypos];
		var farestPoit=[this.obstacle.xpos+this.obstacle.width,this.obstacle.ypos];
		var tRexPoint=[this.trex.x+this.trex.width,this.trex.y];
		
		var distance=[Math.abs(nearestPoint[0]-tRexPoint[0]),nearestPoint[1]-tRexPoint[1]];

		return distance;
	}

	takedecision(){

	}

	normalize(){


	}

	train(){
		var tensorX=tf.tensor2d(this.actions);
		var tensorY=tf.tensor2d(this.decision);
		this.model.fit(tensorX,tensorY,{epochs:10}).then(()=>{
					this.trained=true;
					this.game.restart();
		});
				
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
