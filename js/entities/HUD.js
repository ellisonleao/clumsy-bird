

/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.ObjectContainer.extend({

	init: function() {
		// call the constructor
		this.parent();
		
		// persistent across level change
		this.isPersistent = true;
		
		// non collidable
		this.collidable = false;
		
		// make sure our object is always draw first
		this.z = Infinity;

		// give a name
		this.name = "HUD";
		
		// add our child score object at the top left corner
		this.addChild(new game.HUD.ScoreItem(5, 5));
	}
});


/** 
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({	
	/** 
	 * constructor
	 */
	init: function(x, y) {
		
		// call the parent constructor 
		// (size does not matter here)
		this.parent(new me.Vector2d(x, y), 10, 10); 
		
		// local copy of the global score
		this.score = -1;

    this.timer = 0;
    this.timerFont = new me.Font('Artial', 40, '#ff9900', 'center');

		// make sure we use screen coordinates
		this.floating = true;
	},

	/**
	 * update function
	 */
	update : function () {
		// we don't do anything fancy here, so just
		// return true if the score has been updated
    this.timer += me.timer.tick / 60 * 0.5;
    me.game.score += 1 * me.timer.tick % 100;
    return true;
	},

	/**
	 * draw the score
	 */
	draw : function (context) {
    this.timerFont.draw(context, Math.round(this.timer),
                        me.game.viewport.width / 2, 10); 
	}

});

var BackgroundLayer = me.ImageLayer.extend({
  init: function(image, speed){
    name = image;
    width = 480;
    height = 320;
    z = 1;
    ratio = 1;
    // call parent constructor
    this.parent(name, width, height, image, z, ratio);
  },

  update: function() {
    return true;
  }
});
