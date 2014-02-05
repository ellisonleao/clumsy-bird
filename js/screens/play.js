game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
    this.pipes = [
      new PipeEntity(400, -40),
      new PipeEntity(600, -10),
      new PipeEntity(800, -100),
      new PipeEntity(1000, 0),
    ]
		me.game.world.addChild(this.HUD);

    this.bird = new BirdEntity(30, me.game.viewport.height/2);

    me.game.add(new BackgroundLayer("bg"));
    me.game.add(this.bird, 10);
    for (var i = 0; i < this.pipes.length; i++){
      me.game.add(this.pipes[i], 10);
    }
	},

	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
		me.game.world.removeChild(this.bird);
	}

});