game.TitleScreen = me.ScreenObject.extend({
	init : function() {
		this.parent(true);
		this.font = null;
    this.title = 'Clumsy Bird';
		this.instructions = (me.sys.touch ? 'Tap' : 'Click') + ' to start';
	},
	
	onResetEvent: function() {	
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		// map the left button click on the ENTER key
		me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);
		// init a font object
    this.titleFont = new me.Font('Verdana', 40, 'red', 'center');
		this.font = new me.Font('Arial', 20, 'black', 'center');

    me.game.add(new BackgroundLayer('bg'));
	},
	
	update : function() {
		// enter pressed ?
		if (me.input.isKeyPressed('enter')) {
			me.state.change(me.state.PLAY);
		}
		return false;
	},

  draw: function(context) {
    this.titleFont.draw(context, this.title,  me.game.viewport.width/2,
        me.game.viewport.height/2 - 80);
		this.font.draw(context, this.instructions,  me.game.viewport.width/2,
        me.game.viewport.height/2 + 80);
  },

	onDestroyEvent : function() {
		// free the font object
		this.font = null;
    this.titleFont = null;
		// unregister the event
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindMouse(me.input.mouse.LEFT);
	}

});