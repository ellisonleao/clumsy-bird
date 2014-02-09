var game = {
  data : {
    score : 0,
    timer: 0
  },

  "onload" : function () {
    if (!me.video.init("screen", 900, 600, true, 'auto')) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    if (document.location.hash === "#debug") {
      window.onReady(function () {
        me.plugin.register.defer(debugPanel, "debug");
      });
    }

    me.audio.init("mp3,ogg");
    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(game.resources);
    me.state.change(me.state.LOADING);
  },

  "loaded" : function () {
	  me.state.set(me.state.MENU, new game.TitleScreen());
	  me.state.set(me.state.PLAY, new game.PlayScreen());
	  me.state.set(me.state.GAME_OVER, new game.GameOverScreen());
		me.state.transition("fade", "#000", 100);
    me.input.bindKey(me.input.KEY.SPACE, "fly", true);
    me.input.bindTouch(me.input.KEY.SPACE); 
		me.state.change(me.state.MENU);
	}
};