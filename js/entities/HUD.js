

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
    this.timerFont = new me.Font('Helvetica', 60, '#000', 'center');

		// make sure we use screen coordinates
		this.floating = true;
	},

	update : function () {
    game.data.score += me.timer.tick % 100 * 5;
    return true;
	},

	draw : function (context) {
    this.timerFont.draw(context, Math.round(game.data.timer),
                        50, 10);
	}

});

var BackgroundLayer = me.ImageLayer.extend({
  init: function(image, z, speed){
    name = image;
    width = 900;
    height = 600;
    ratio = 1;
    this.fixed = speed > 0 ? false : true;
    // call parent constructor
    this.parent(name, width, height, image, z, ratio);
  },

  update: function() {
    if (!this.fixed){
      if (this.pos.x >= this.imagewidth - 1)
        this.pos.x = 0;
      this.pos.x += this.speed;
    }
    return true;
  }
});

var Start = me.Rect.extend({
  init: function(image, action, y){
    this.image = me.loader.getImage(image);
    this.image_hover = me.loader.getImage(image + '_hover');
    this.action = action;
    this.pos = new me.Vector2d(
      me.video.getWidth()/ 2 - this.image.width/2,
      y
    );
    this.parent(this.pos, this.image.width, this.image.height);
    me.input.registerPointerEvent("mousedown", this, this.clicked.bind(this));
  },

  clicked: function(){
    me.state.change(this.action);
  },

  draw: function(context){
    if (this.containsPointV(me.input.mouse.pos)){
      context.drawImage(this.image_hover, this.pos.x, this.pos.y);
    }else{
      context.drawImage(this.image, this.pos.x, this.pos.y);
    }

  },

  update: function(){
    return true;
  },

  onDestroyEvent: function(){
      me.input.releasePointerEvent("mousedown", this);
  }

});
