game.TitleScreen = me.ScreenObject.extend({
	
	onResetEvent: function() {	
        me.audio.play('intro', true);
        me.game.world.addChild(new BackgroundLayer('bg', 1));
        
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.SPACE, "enter", true);
		me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);
        
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			if (action === "enter") {
				me.state.change(me.state.PLAY);
			}
		});

        //logo
        var logo = new me.SpriteObject (
          me.game.viewport.width/2 - 170, 
          me.game.viewport.height/2 - 170, 
          me.loader.getImage("logo")
        );

        //start button
        var button = new Start('start', me.state.PLAY, me.video.getHeight()/2);
        me.game.world.addChild(button, 10);
        me.game.world.addChild(logo, 10);
   
	},
	

	onDestroyEvent : function() {
        me.audio.stop('intro');
    	// unregister the event
		me.event.unsubscribe(this.handler);
		me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
		me.input.unbindMouse(me.input.mouse.LEFT);
	}

});