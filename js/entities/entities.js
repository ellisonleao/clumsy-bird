var BirdEntity = me.ObjectEntity.extend({
  init: function(x, y){
    var settings = {};
    settings.image = me.loader.getImage('clumsy');
    settings.spritewidth = 40;
    settings.spriteheight= 40;

    this.parent(x, y, settings);
    this.setVelocity(1, 1);    
    this.direction = 'down';
    this.maxVel = new me.Vector2d(0, 100);
    this.alwaysUpdate = true;
    this.dead = false;
    this.accel = new me.Vector2d(0, -this.gravity);
  },

  update: function(x, y){
    // mechanics
    if (me.input.isKeyPressed('fly')){
      this.vel.add(new me.Vector2d(0, 5 * me.timer.tick));
      console.log('pressed');
      console.log(this.vel);
    }else{
      this.vel.add(new me.Vector2d(0, -10) * me.timer.tick);   
    }

    //this.accel.clamp(0, 100);

    //console.log(this.accel)
    //this.updateMovement();

    var updated = (this.vel.x != 0 || this.vel.y != 0);
    return updated;
  },

});