var BirdEntity = me.ObjectEntity.extend({
  init: function(x, y){
    var settings = {};
    settings.image = me.loader.getImage('clumsy');
    settings.spritewidth = 40;
    settings.spriteheight= 40;

    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.dead = false;
    this.gravity = 35;
  },

  update: function(x, y){
    // mechanics
    if (me.input.isKeyPressed('fly')){
      this.pos.add(new me.Vector2d(0, -this.gravity * me.timer.tick));
    }else{
      this.pos.y += me.timer.tick * 1.7;
    }

    if (this.pos.y > me.game.viewport.height - 20){
      this.dead = true;
    }

    var updated = (this.vel.x != 0 || this.vel.y != 0);
    return updated;
  },

});