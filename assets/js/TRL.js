/*General config*/



class TRL{

	constructor(gme){
		//reference to game
		this.game=gme;

		this.trex={};
		//matrice state;
		this.state=['jumping','running','crashed'];
		
		//action matrix
		this.actions=["jump","run"];

		//Q-learning parameters
		this.gamma=0.99;
		this.final_expsilon=0.0001;
		this.initial_espilon=0.01;

		this.reward=0;


	}

	update(trex,obstacles,score ,state){
		this.trex.x=;
		this.trex.y=;
		this.obstacles=[];

		for (var i = 0; i <this.obstacles.length; i++) {
			this.obstacles[i]={
				x : 0,
				y : 0,
				width : 0,
				height : 0
			}
		}
	}

	updateEnvironement(){

	}

	learn(){

	}

	runModele(){

	}

	sendOrder(order){

	}
}