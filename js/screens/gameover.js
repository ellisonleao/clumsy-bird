game.GameOverScreen = me.ScreenObject.extend({
  init : function() {
		this.parent(true);
		this.font = null;
    this.title = 'Game Over';
    this.score = null;
    this.timer = null;
	},
	
  onResetEvent: function() {	
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);
    
    this.font = new me.Font('Verdana', 40, 'red', 'center');
    me.game.add(new BackgroundLayer('bg'));
    this.score = 'Final Score: ' + game.data.score;
    this.timer = 'Steps: ' + Math.round(game.data.timer);
	},

	update : function() {
		if (me.input.isKeyPressed('enter')) {
			me.state.change(me.state.MENU);
		}
		return false;
	},

  draw: function(context) {
		this.font.draw(context, this.title,  me.game.viewport.width/2,
        me.game.viewport.height/2 - 100);
		this.font.draw(context, this.score,  me.game.viewport.width/2,
        me.game.viewport.height/2);
		this.font.draw(context, this.timer,  me.game.viewport.width/2,
        me.game.viewport.height/2 + 40);
  },

	onDestroyEvent : function() {
		this.font = null;
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindMouse(me.input.mouse.LEFT);
	}

});
