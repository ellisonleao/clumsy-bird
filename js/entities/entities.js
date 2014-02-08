var BirdEntity = me.ObjectEntity.extend({
  init: function(x, y){
    var settings = {};
    settings.image = me.loader.getImage('clumsy');
    settings.spritewidth = 85;
    settings.spriteheight= 60;

    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.gravity = 32;
    this.gravityForce = 5;
    this.maxAngleRotation = Number.prototype.degToRad(30);
    this.maxAngleRotationDown = Number.prototype.degToRad(90);
    this.renderable.addAnimation("flying", [0, 1, 2]);
    this.renderable.addAnimation("idle", [0]);
    this.renderable.setCurrentAnimation("flying");
    this.animationController = 0;
    this.animationVelocity = 80;
  },

  update: function(x, y){
    // mechanics
    if (me.input.isKeyPressed('fly')){
      this.renderable.setCurrentAnimation("idle");
      this.gravityForce = 5;

      var currentPos = this.pos.y;
      tween = new me.Tween(this.pos).to({y: currentPos - 60}, 150);
      tween.easing(me.Tween.Easing.Bounce.Out);
      tween.start();

      this.renderable.angle -= Number.prototype.degToRad(10) * me.timer.tick;
      if (this.renderable.angle > -this.maxAngleRotation)
        this.renderable.angle = -this.maxAngleRotation;
    }else{
      this.renderable.setCurrentAnimation("flying");
      this.gravityForce += 0.5;
      this.pos.add(new me.Vector2d(0, me.timer.tick * this.gravityForce));
      this.renderable.angle += Number.prototype.degToRad(6 * me.timer.tick);
      if (this.renderable.angle > this.maxAngleRotationDown)
        this.renderable.angle = this.maxAngleRotationDown;
    }

    //manual animation
    var actual = this.renderable.getCurrentAnimationFrame();
    if (this.animationController++ % this.animationVelocity){
      actual++;
      this.renderable.setAnimationFrame(actual);
    }

    res = this.collide();
    if (res || this.pos.y >= me.game.viewport.height - (96 + 60)){
      me.state.change(me.state.GAME_OVER);
      return false;
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
    settings.image = me.loader.getImage('pipe');
    settings.spritewidth = 148;
    settings.spriteheight= 1664;

    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.gravity = 5;
    this.visible = true;
  },

  update: function(){
    // mechanics
    this.pos.add(new me.Vector2d(-this.gravity * me.timer.tick * 2, 0));
    if (this.pos.x < -this.renderable.spritewidth) {
      me.game.remove(this);
    }
    return true;
  },


});