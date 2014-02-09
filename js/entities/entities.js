var BirdEntity = me.ObjectEntity.extend({
  init: function(x, y){
    var settings = {};
    settings.image = me.loader.getImage('clumsy');
    settings.spritewidth = 85;
    settings.spriteheight= 60;

    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.gravity = 0.2;
    this.gravityForce = 0.01;
    this.maxAngleRotation = Number.prototype.degToRad(30);
    this.maxAngleRotationDown = Number.prototype.degToRad(90);
    this.renderable.addAnimation("flying", [0, 1, 2]);
    this.renderable.addAnimation("idle", [0]);
    this.renderable.setCurrentAnimation("flying");
    this.animationController = 0;
    this.updateColRect(10, 70, 2, 58);
  },

  update: function(x, y){
    // mechanics
    if (me.input.isKeyPressed('fly')){
      this.renderable.setCurrentAnimation("idle");
      this.gravityForce = 0.01;

      var currentPos = this.pos.y;
      tween = new me.Tween(this.pos).to({y: currentPos - 72}, 100);
      tween.easing(me.Tween.Easing.Cubic.In);
      tween.start();

      this.renderable.angle = Number.prototype.degToRad(40);
      if (this.renderable.angle > -this.maxAngleRotation)
        this.renderable.angle = -this.maxAngleRotation;
    }else{
      this.renderable.setCurrentAnimation("flying");
      this.gravityForce += 0.2;
      this.pos.add(new me.Vector2d(0, me.timer.tick * this.gravityForce));
      this.renderable.angle += Number.prototype.degToRad(2) * me.timer.tick; 
      if (this.renderable.angle > this.maxAngleRotationDown)
        this.renderable.angle = this.maxAngleRotationDown;
    }

    //manual animation
    var actual = this.renderable.getCurrentAnimationFrame();
    if (this.animationController++ % 2){
      actual++;
      this.renderable.setAnimationFrame(actual);
    }

    res = this.collide();
    if (res) {
      if (res.obj.type != 'hit'){
        me.state.change(me.state.GAME_OVER);
        return false;
      }
      me.game.remove(res.obj);
      game.data.timer++;
      return true;
    }else if (this.pos.y >= me.game.viewport.height - (96 + 60)){
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
    this.updateTime = false;
  },

  update: function(){
    // mechanics
    this.pos.add(new me.Vector2d(-this.gravity * me.timer.tick, 0));
    if (this.pos.x < -148) {
      me.game.remove(this);
    }
    return true;
  },

});

var HitEntity = me.ObjectEntity.extend({
  init: function(x, y){
    var settings = {};
    settings.image = me.loader.getImage('hit');
    settings.spritewidth = 148;
    settings.spriteheight= 60;

    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.gravity = 5;
    this.updateTime = false;
    this.type = 'hit';
    this.renderable.alpha = 0;
  },

  update: function(){
    // mechanics
    this.pos.add(new me.Vector2d(-this.gravity * me.timer.tick, 0));
    if (this.pos.x < -148) {
      me.game.remove(this);
    }
    return true;
  },

});