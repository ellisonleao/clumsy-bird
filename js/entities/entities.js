var BirdEntity = me.ObjectEntity.extend({
  init: function(x, y) {
    var settings = {};
    settings.image = me.loader.getImage('clumsy');
    settings.width = 85;
    settings.height = 60;
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
    // manually add a rectangular collision shape
    this.addShape(new me.Rect(new me.Vector2d(5, 5), 70, 50));

    // a tween object for the flying physic effect
    this.flyTween = new me.Tween(this.pos);
    this.flyTween.easing(me.Tween.Easing.Exponential.InOut);
  },

  update: function(dt) {
    // mechanics
    if (game.data.start) {
      if (me.input.isKeyPressed('fly')) {
        this.gravityForce = 0.01;

        var currentPos = this.pos.y;
        // stop the previous one
        this.flyTween.stop()
        this.flyTween.to({y: currentPos - 72}, 100);
        this.flyTween.start();

        this.renderable.angle = -this.maxAngleRotation;
      } else {
        this.gravityForce += 0.2;
        this.pos.y += me.timer.tick * this.gravityForce;
        this.renderable.angle += Number.prototype.degToRad(3) * me.timer.tick;
        if (this.renderable.angle > this.maxAngleRotationDown)
          this.renderable.angle = this.maxAngleRotationDown;
      }
    }

    var res = me.game.collide(this);

    if (res) {
      if (res.obj.type != 'hit') {
        me.device.vibrate(500);
        me.state.change(me.state.GAME_OVER);
        return false;
      }      
      // remove the hit box
      me.game.world.removeChildNow(res.obj);
      // the give dt parameter to the update function
      // give the time in ms since last frame
      // use it instead ?
      game.data.steps++;
      me.audio.play('hit');

    } else {
      var hitGround = me.game.viewport.height - (96 + 60);
      var hitSky = -80; // bird height + 20px
      if (this.pos.y >= hitGround || this.pos.y <= hitSky) {
        me.state.change(me.state.GAME_OVER);
        return false;
      }
    }

    return this.parent(dt);

  },

});


var PipeEntity = me.ObjectEntity.extend({
  init: function(x, y) {
    var settings = {};
    settings.image = me.loader.getImage('pipe');
    settings.width = 148;
    settings.height= 1664;
    settings.spritewidth = 148;
    settings.spriteheight= 1664;


    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.gravity = 5;
    this.updateTime = false;
  },

  update: function(dt) {
    // mechanics
    this.pos.add(new me.Vector2d(-this.gravity * me.timer.tick, 0));
    if (this.pos.x < -148) {
      me.game.world.removeChild(this);
    }
    return true;
  },

});

var PipeGenerator = me.Renderable.extend({
  init: function() {
    this.parent(new me.Vector2d(), me.game.viewport.width, me.game.viewport.height);
    this.alwaysUpdate = true;
    this.generate = 0;
    this.pipeFrequency = 92;
    this.pipeHoleSize = 1240;
    this.posX = me.game.viewport.width;
  },

  update: function(dt) {
    if (this.generate++ % this.pipeFrequency == 0) {
      var posY = Number.prototype.random(
          me.video.getHeight() - 100,
          200
      );
      var posY2 = posY - me.video.getHeight() - this.pipeHoleSize;
      var pipe1 = new me.pool.pull("pipe", this.posX, posY);
      var pipe2 = new me.pool.pull("pipe", this.posX, posY2);
      var hitPos = posY - 100;
      var hit = new me.pool.pull("hit", this.posX, hitPos);
      pipe1.renderable.flipY();
      me.game.world.addChild(pipe1, 10);
      me.game.world.addChild(pipe2, 10);
      me.game.world.addChild(hit, 11);
    }
    return true;
  },

});

var HitEntity = me.ObjectEntity.extend({
  init: function(x, y) {
    var settings = {};
    settings.image = me.loader.getImage('hit');
    settings.width = 148;
    settings.height= 60;
    settings.spritewidth = 148;
    settings.spriteheight= 60;

    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.gravity = 5;
    this.updateTime = false;
    this.type = 'hit';
    this.renderable.alpha = 0;
    this.ac = new me.Vector2d(-this.gravity, 0);
  },

  update: function() {
    // mechanics
    this.pos.add(this.ac);
    if (this.pos.x < -148) {
      me.game.world.removeChild(this);
    }
    return true;
  },

});

var Ground = me.ObjectEntity.extend({
  init: function(x, y) {
    var settings = {};
    settings.image = me.loader.getImage('ground');
    settings.width = 900;
    settings.height= 96;

    this.parent(x, y, settings);
    this.alwaysUpdate = true;
    this.gravity = 0;
    this.updateTime = false;
    this.accel = new me.Vector2d(-4, 0);
  },

  update: function() {
    // mechanics
    this.pos.add(this.accel);
    if (this.pos.x < -this.renderable.width) {
      this.pos.x = me.video.getWidth() - 10;
    }
    return true;
  },

});

var TheGround = Object.extend({
  init: function() {
    this.ground1 = new Ground(0, me.video.getHeight() - 96);
    this.ground2 = new Ground(me.video.getWidth(), me.video.getHeight() - 96);
    me.game.world.addChild(this.ground1, 11);
    me.game.world.addChild(this.ground2, 11);
  },

  update: function () { return true; }
})
