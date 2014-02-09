game.PlayScreen = me.ScreenObject.extend({
  init: function(){
      this.parent(true);      
      this.generate = 0;
      this.pipeHoleSize = 1240;
      this.ground = null;
      this.helped = false;
      this.pipeFrequency = 92;
      this.tap = null;
      this.getReady = null;
      this.start = false;
  },

  getRandomInt: function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

	onResetEvent: function() {
    //this.start = false;
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
    me.entityPool.add("hit", HitEntity, true);

    this.bird = me.entityPool.newInstanceOf("clumsy", 60,
      me.game.viewport.height/2 - 100);
    me.game.add(this.bird, 10);
    this.posX = me.game.viewport.width;
    
    //inputs
    me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE);
		me.state.transition("fade", "#fff", 100);
    
    this.getReady = new me.SpriteObject(
      me.video.getWidth()/2 - 200,
      me.video.getHeight()/2 - 100,
      me.loader.getImage('getready') 
    );
    me.game.add(this.getReady, 11);
    var popOut = new me.Tween(this.getReady.pos).to({y: -132}, 2000)
      .easing(me.Tween.Easing.Linear.None)
      .onComplete(this.setStartTrue.bind(this)).start();
	},

  setStartTrue: function(){
    this.start = true;              
  },

  update: function(){
    if (!this.start) return false;
    if (this.generate++ % this.pipeFrequency == 0){
      var posY = this.getRandomInt(
          me.video.getHeight() - 100,
          200
      );
      var posY2 = posY - me.video.getHeight() - this.pipeHoleSize;
      var pipe1 = new me.entityPool.newInstanceOf("pipe", this.posX, posY);
      var pipe2 = new me.entityPool.newInstanceOf("pipe", this.posX, posY2);
      var hitPos = posY - 100;
      var hit = new me.entityPool.newInstanceOf("hit", this.posX, hitPos);
      pipe1.renderable.flipY();
      me.game.add(pipe1, 10);
      me.game.add(pipe2, 10);
      me.game.add(hit, 11);
    }
    return true; 
  },

	onDestroyEvent: function() {
		me.game.world.removeChild(this.HUD);
    me.game.remove(this.bird);
	}

});