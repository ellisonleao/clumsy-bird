
/* Game namespace */
var game = {

	// an object where to store game information
	data : {
		// score
		score : 0
	},
	
	// Run on page load.
	"onload" : function () {
    // Initialize the video.
    if (!me.video.init("screen", 480, 320, true, 'auto')) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === "#debug") {
      window.onReady(function () {
        me.plugin.register.defer(debugPanel, "debug");
      });
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
  },

	// Run on game resources loaded.
	"loaded" : function () {
    me.sys.fps = 30;
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

		// add some fadeIn/fadeOut effect for transition 
		me.state.transition("fade", "#000", 100);
		
    // add a fn callback that displays pause on pause :)
		me.state.onPause = function () {
			var _font = new me.Font('Arial', 20, 'black', 'center');
			_font.bold();
			_font.draw(me.video.getSystemContext(), 'Paused !', me.game.viewport.width/2, me.game.viewport.height/2 + 110);
			me.video.blitSurface();
		};

    me.input.bindKey(me.input.KEY.SPACE, "fly", true);
    me.input.bindTouch(me.input.KEY.SPACE); 

	
		// Start the game.
		me.state.change(me.state.MENU);
	}
};