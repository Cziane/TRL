/*General config*/

var state=['jumping','running','dead'];

var action=['jump','do_nothing'];

class TRL{

	constructor(gme){
		//reference to game
		this.game=gme;

		this.details=[];


		this.trex={};
		//matrice state;
		
		//action matrix
		this.actions=["jump","run"];

		//Q-learning parameters
		this.gamma=0.99;
		this.final_expsilon=0.0001;
		this.initial_espilon=0.01;

		this.reward=0;
	}

	update(dino,obs,score, speed ,state){
		this.trex.x=dino.xPos;
		this.trex.y=dino.yPos;
		this.trex.width=dino.config.WIDTH;
		this.trex.height=dino.config.HEIGHT;
		this.trex.status=dino.status;
		this.obstacle={
			xpos:0,
			ypos:0,
			width:0,
			height:0
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
