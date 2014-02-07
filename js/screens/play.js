game.PlayScreen = me.ScreenObject.extend({
  init: function(){
      this.parent(true);      
      this.generate = 0;
      this.pipeHoleSize = 150;
  },

  getRandomInt: function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
    me.game.add(new BackgroundLayer("bg"));

    me.entityPool.add("clumsy", BirdEntity);
    me.entityPool.add("pipe", PipeEntity, true);

    this.bird = me.entityPool.newInstanceOf("clumsy", 30, me.game.viewport.height/2);
    me.game.add(this.bird, 10);
    this.posX = me.game.viewport.width;

	},

  update: function(){
    if (this.generate++ % 63  == 0){
      var posY = this.getRandomInt(-206, 0);
      var posY2 = posY + this.pipeHoleSize + 206;
      var pipe1 = new me.entityPool.newInstanceOf("pipe", this.posX, posY);
      var pipe2 = new me.entityPool.newInstanceOf("pipe", this.posX, posY2);
      pipe1.renderable.flipY();
      me.game.add(pipe1, 10);
      me.game.add(pipe2, 10);
    }
    return true; 
  },

	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
    me.game.remove(this.bird);
	}

});