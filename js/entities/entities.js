var BirdEntity = me.ObjectEntity.extend({
  init: function(x, y){
    var settings = {};
    settings.image = me.loader.getImage('clumsy');
    settings.spritewidth = 40;
    settings.spriteheight= 40;

    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.gravity = 32;
    this.pushForce = 1.7;
    this.gravityForce = 2.5;
  },

  update: function(x, y){
    // mechanics
    if (me.input.isKeyPressed('fly')){
      this.pos.add(new me.Vector2d(0, -this.gravity * me.timer.tick * this.pushForce));
    }else{
      this.pos.add(new me.Vector2d(0, me.timer.tick * this.gravityForce));
    }

    if (this.pos.y > me.game.viewport.height + 40){
		  me.state.change(me.state.GAME_OVER);
    }
    var updated = (this.vel.x != 0 || this.vel.y != 0);
    return updated;
  },

});

var PipeEntity = me.ObjectEntity.extend({
  init: function(x, y){
    var settings = {};
    settings.image = me.loader.getImage('pipes');
    settings.spritewidth = 88;
    settings.spriteheight= 521;

    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.gravity = 5;
    this.visible = true;
  },

  update: function(){
    // mechanics
    this.pos.add(new me.Vector2d(-this.gravity * me.timer.tick, 0));
    if (this.pos.x < -88) {
      me.game.remove(this);
    }
    return true;
  },


});