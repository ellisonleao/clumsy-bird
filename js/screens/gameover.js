game.GameOverScreen = me.ScreenObject.extend({
  onResetEvent: function() {
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    me.input.bindKey(me.input.KEY.SPACE, "enter", false)
    me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);

    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
        if (action === "enter") {
            me.state.change(me.state.MENU);
        }
    });

    me.game.world.addChild(new BackgroundLayer('bg', 1));

    var gImage =  me.loader.getImage('gameover');
    me.game.world.addChild(new me.SpriteObject(
        me.video.getWidth()/2 - gImage.width/2,
        me.video.getHeight()/2 - gImage.height/2 - 100,
        gImage
    ), 10);

    var gImageBoard = me.loader.getImage('gameoverbg');
    me.game.world.addChild(new me.SpriteObject(
      me.video.getWidth()/2 - gImageBoard.width/2,
      me.video.getHeight()/2 - gImageBoard.height/2,
      gImageBoard
    ), 10);

    // add the dialog witht he game information
    me.game.world.addChild(new (me.Renderable.extend ({
        // constructor
        init : function() {
            // size does not matter, it's just to avoid having a zero size renderable
            this.parent(new me.Vector2d(), 100, 100);
            this.font = new me.Font('Arial Black', 50, 'black', 'center');
            this.score = 'Final Score: ' + game.data.score;
            this.timer = 'Steps: ' + Math.round(game.data.timer);
        },
        update : function () {
            return true;
        },
        draw : function (context) {
            this.font.draw(context, this.score,  me.game.viewport.width/2,  me.game.viewport.height/2);
            this.font.draw(context, this.timer,  me.game.viewport.width/2,  me.game.viewport.height/2 + 60);
        }
    })), 12);

  },

	onDestroyEvent : function() {
		// unregister the event
		me.event.unsubscribe(this.handler);
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindKey(me.input.KEY.SPACE);
		me.input.unbindMouse(me.input.mouse.LEFT);
	}

});
