game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);

    me.game.add(new BackgroundLayer("bg"));
    me.game.add(
      new BirdEntity(30, me.game.viewport.height/2),
      10
    ); 
	},

  update: function(){
    return true;          
  },

	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	}
});