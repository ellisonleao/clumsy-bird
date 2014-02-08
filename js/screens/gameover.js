game.GameOverScreen = me.ScreenObject.extend({
  init : function() {
		this.parent(true);
		this.font = null;
    this.score = null;
    this.timer = null;
	},

  onResetEvent: function() {
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);

    this.font = new me.Font('Arial Black', 50, 'black', 'center');
    this.score = 'Final Score: ' + game.data.score;
    this.timer = 'Steps: ' + Math.round(game.data.timer);

    me.game.add(new BackgroundLayer('bg', 1));

    var gImage =  me.loader.getImage('gameover');
    me.game.add(new me.SpriteObject(
      me.video.getWidth()/2 - gImage.width/2,
      me.video.getHeight()/2 - gImage.height/2 - 100,
      gImage
    ), 10);

    var gImageBoard = me.loader.getImage('gameoverbg');
    me.game.add(new me.SpriteObject(
      me.video.getWidth()/2 - gImageBoard.width/2,
      me.video.getHeight()/2 - gImageBoard.height/2,
      gImageBoard
    ), 10);

	},

	update : function() {
		if (me.input.isKeyPressed('enter')) {
			me.state.change(me.state.MENU);
		}
		return false;
	},

  draw: function(context) {
		this.font.draw(context, this.score,  me.game.viewport.width/2,
        me.game.viewport.height/2);
		this.font.draw(context, this.timer,  me.game.viewport.width/2,
        me.game.viewport.height/2 + 60);
  },

	onDestroyEvent : function() {
		this.font = null;
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindMouse(me.input.mouse.LEFT);
	}

});
