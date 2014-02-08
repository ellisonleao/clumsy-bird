game.TitleScreen = me.ScreenObject.extend({
	init : function() {
		this.parent(true);
    this.logo = null;
    this.button = null;
	},
	
	onResetEvent: function() {	
    me.game.add(new BackgroundLayer('bg', 1));
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);

    //logo
    this.logo = new me.SpriteObject (
      me.game.viewport.width/2 - 170, 
      me.game.viewport.height/2 - 170, 
      me.loader.getImage("logo")
    );

    //start button
    this.button = new Start('start', me.state.PLAY, me.video.getHeight()/2);
    me.game.add(this.button, 10);
    me.game.add(this.logo, 10);
   
	},
	
	update : function() {
    if (me.input.isKeyPressed('enter')){
      me.state.change(me.state.PLAY);
    }
		return false;
	},

  draw: function(context){
    this.parent(context);
    this.button.draw(context);
  },

	onDestroyEvent : function() {
		me.input.unbindKey(me.input.KEY.ENTER);
		me.input.unbindMouse(me.input.mouse.LEFT);
	}

});