var BirdEntity = me.ObjectEntity.extend({
  init: function(x, y){
    var settings = {};
    settings.image = me.loader.getImage('clumsy');
    settings.spritewidth = 38;
    settings.spriteheight= 28;

    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.gravity = 32;
    this.pushForce = 1.4;
    this.gravityForce = 5;
    this.maxAngleRotation = Number.prototype.degToRad(45);
    this.renderable.addAnimation("flying", [0, 1, 2]);
    this.renderable.addAnimation("idle", [0]);
    this.renderable.setCurrentAnimation("flying");
    this.animationController = 0;
  },

  update: function(x, y){
    // mechanics
    if (me.input.isKeyPressed('fly')){
      this.pos.add(new me.Vector2d(0, -this.gravity * me.timer.tick * this.pushForce));
      this.gravityForce = 5;
      this.renderable.angle -= Number.prototype.degToRad(10) * me.timer.tick;
      if (this.renderable.angle > -this.maxAngleRotation)
        this.renderable.angle = -this.maxAngleRotation;
    }else{
      this.gravityForce += 0.2;
      this.pos.add(new me.Vector2d(0, me.timer.tick * this.gravityForce));
      this.renderable.angle += Number.prototype.degToRad(5) * me.timer.tick;
      if (this.renderable.angle > this.maxAngleRotation)
        this.renderable.angle = this.maxAngleRotation;
    }

    //manual animation
    var actual = this.renderable.getCurrentAnimationFrame();
    if (this.animationController++ % 100){
      actual++;
      this.renderable.setAnimationFrame(actual);
    }

    res = this.collide();
    if (res || this.pos.y > me.game.viewport.height + 40){
		  me.state.change(me.state.GAME_OVER);
    }

    var updated = (this.vel.x != 0 || this.vel.y != 0);
    if (updated){
      this.parent();
      return true;
    }
    return false;
  },

});

var PipeEntity = me.ObjectEntity.extend({
  init: function(x, y){
    var settings = {};
    settings.image = me.loader.getImage('pipesfinal');
    settings.spritewidth = 88;
    settings.spriteheight= 247;

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