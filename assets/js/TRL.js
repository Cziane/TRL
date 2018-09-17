/*General config*/

var state=['jumping','running','dead'];
var action['jump','do_nothing'];
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
		this.obstacles=[];

		for (var i = 0; i <.obs.length; i++) {
			this.obstacles[i]={
				x : obs[i].xPos,
				y : obs[i].yPos,
				width : obs[i].size*obs[i].typeConfig.width,
				height : obs[i].typeConfig.height
			}
		}
	}


	initEnvironment(){
		this.environment=[];

	}

	jump(){
		var pressthiskey = " "/* <--- :) !? q for example */; var e = new Event("keydown"); e.key=pressthiskey; e.keyCode=e.key.charCodeAt(0); e.which=e.keyCode; e.altKey=false; e.ctrlKey=true; e.shiftKey=false; e.metaKey=false; e.bubbles=true; document.dispatchEvent(e);
		return true;
	}

	run(){
		return true;
	}
}

class Game{

	constructor(){
		this.frame=0;
		this.actions=[];
		this.trex=[];
		this.obstacles[];
	}

	update(dino,obs,action){
		this.actions[this.frame]=action;
		this.trex[this.frame]=dino;
		this.obstacles[this.frame]=obstacles
	}

}