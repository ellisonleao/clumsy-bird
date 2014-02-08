game.PlayScreen = me.ScreenObject.extend({
  init: function(){
      this.parent(true);      
      this.generate = 0;
      this.pipeHoleSize = 1240;
      this.ground = null;
  },

  getRandomInt: function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

	onResetEvent: function() {
		game.data.score = 0;
    game.data.timer = 0;

    me.game.add(new BackgroundLayer('bg', 1));        

    var groundImage = me.loader.getImage('ground');

    this.ground = new me.SpriteObject(
      0,
      me.video.getHeight() - groundImage.height,
      groundImage
    );
    me.game.add(this.ground, 11);

		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);

    me.entityPool.add("clumsy", BirdEntity);
    me.entityPool.add("pipe", PipeEntity, true);

    this.bird = me.entityPool.newInstanceOf("clumsy", 60,
      me.game.viewport.height/2);
    me.game.add(this.bird, 10);
    this.posX = me.game.viewport.width;
    
    //inputs
    me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE);
	},

  update: function(){
    if (this.generate++ % 80  == 0){
      var posY = this.getRandomInt(
          me.video.getHeight() - 100,
          200
      );
      var posY2 = posY - me.video.getHeight() - this.pipeHoleSize;
      var pipe1 = new me.entityPool.newInstanceOf("pipe", this.posX, posY);
      var pipe2 = new me.entityPool.newInstanceOf("pipe", this.posX, posY2);
      pipe1.renderable.flipY();
      me.game.add(pipe1, 10);
      me.game.add(pipe2, 10);
    }
    return true; 
  },

	onDestroyEvent: function() {
		me.game.world.removeChild(this.HUD);
    me.game.remove(this.bird);
	}

});