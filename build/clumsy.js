var game = {
  data : {
    score : 0,
    steps: 0,
    start: false,
    newHiScore: false
  },

  "onload" : function () {
    if (!me.video.init("screen", 900, 600, true, 'auto')) {
      alert("Your browser does not support HTML5 canvas.");
      return;
    }

    me.audio.init("mp3,ogg");
    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(game.resources);
    me.state.change(me.state.LOADING);
  },

  "loaded" : function () {
    me.state.set(me.state.MENU, new game.TitleScreen());
    me.state.set(me.state.PLAY, new game.PlayScreen());
    me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

    me.input.bindKey(me.input.KEY.SPACE, "fly", true);
    me.input.bindTouch(me.input.KEY.SPACE);

    me.pool.register("clumsy", BirdEntity);
    me.pool.register("pipe", PipeEntity, true);
    me.pool.register("hit", HitEntity, true);

    // in melonJS 1.0.0, viewport size is set to Infinity by default
    me.game.viewport.setBounds(0,0, 900, 600);
    me.state.change(me.state.MENU);
	}
};
game.resources = [

	 {name: "bg", type:"image", src: "data/img/bg.png"},
	 {name: "clumsy", type:"image", src: "data/img/clumsy.png"},
	 {name: "pipe", type:"image", src: "data/img/pipe.png"},
	 {name: "logo", type:"image", src: "data/img/logo.png"},
	 {name: "ground", type:"image", src: "data/img/ground.png"},
	 {name: "gameover", type:"image", src: "data/img/gameover.png"},
	 {name: "gameoverbg", type:"image", src: "data/img/gameoverbg.png"},
	 {name: "hit", type:"image", src: "data/img/hit.png"},
	 {name: "getready", type:"image", src: "data/img/getready.png"},
	 {name: "new", type:"image", src: "data/img/new.png"},
	 {name: "share", type:"image", src: "data/img/share.png"},
	 {name: "tweet", type:"image", src: "data/img/tweet.png"},

	
	 {name: "theme", type: "audio", src: "data/bgm/"},
	 {name: "hit", type: "audio", src: "data/sfx/"},
	 {name: "lose", type: "audio", src: "data/sfx/"},
];
var BirdEntity = me.ObjectEntity.extend({
  init: function(x, y){
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

  update: function(dt){
    // mechanics
    if (game.data.start) {
      if (me.input.isKeyPressed('fly')){
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
      if (res.obj.type != 'hit'){
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
      if (this.pos.y >= hitGround || this.pos.y <= hitSky){
        me.state.change(me.state.GAME_OVER);
        return false;
      }
    }

    return this.parent(dt);

  },

});


var PipeEntity = me.ObjectEntity.extend({
  init: function(x, y){
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

  update: function(dt){
    // mechanics
    this.pos.add(new me.Vector2d(-this.gravity * me.timer.tick, 0));
    if (this.pos.x < -148) {
      me.game.world.removeChild(this);
    }
    return true;
  },

});

var PipeGenerator = me.Renderable.extend({
  init: function(){
    this.parent(new me.Vector2d(), me.game.viewport.width, me.game.viewport.height);
    this.alwaysUpdate = true;
    this.generate = 0;
    this.pipeFrequency = 92;
    this.pipeHoleSize = 1240;
    this.posX = me.game.viewport.width;
  },

  update: function(dt){
    if (this.generate++ % this.pipeFrequency == 0){
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
  init: function(x, y){
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

  update: function(){
    // mechanics
    this.pos.add(this.ac);
    if (this.pos.x < -148) {
      me.game.world.removeChild(this);
    }
    return true;
  },

});

var Ground = me.ObjectEntity.extend({
  init: function(x, y){
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

  update: function(){
    // mechanics
    this.pos.add(this.accel);
    if (this.pos.x < -this.renderable.width) {
      this.pos.x = me.video.getWidth() - 10;
    }
    return true;
  },

});

var TheGround = Object.extend({
  init: function(){
    this.ground1 = new Ground(0, me.video.getHeight() - 96);
    this.ground2 = new Ground(me.video.getWidth(), me.video.getHeight() - 96);
    me.game.world.addChild(this.ground1, 11);
    me.game.world.addChild(this.ground2, 11);
  },

  update: function (){ return true; }
})


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
    this.stepsFont = new me.Font('Helvetica', 60, '#000', 'center');

		// make sure we use screen coordinates
		this.floating = true;
	},

	update : function () {
    return true;
	},

	draw : function (context) {
    if (game.data.start && me.state.isCurrent(me.state.PLAY))
      this.stepsFont.draw(context, game.data.steps, 50, 10);
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

var Share = me.GUI_Object.extend({
  init: function(){
    var settings = {};
    var x = me.video.getWidth()/2 - 170;
    var y = me.video.getHeight()/2 + 200;
    settings.image = "share";
    settings.spritewidth = 150;
    settings.spriteheight = 75;
    this.parent(x, y, settings);
  },

  onClick: function(event){
    var shareText = 'Just made ' + game.data.steps + ' steps on Clumsy Bird! Can you beat me? Try online here!';
    var url = 'http://ellisonleao.github.io/clumsy-bird/';
    FB.ui(
      {
       method: 'feed',
       name: 'My Clumsy Bird Score!',
       caption: "Share to your friends",
       description: (
          shareText
       ),
       link: url,
       picture: 'http://ellisonleao.github.io/clumsy-bird/data/img/clumsy.png'
      }
    );
    return false;
  }

});

var Tweet = me.GUI_Object.extend({
  init: function(){
    var settings = {};
    var x = me.video.getWidth()/2 + 10;
    var y = me.video.getHeight()/2 + 200;
    settings.image = "tweet";
    settings.spritewidth = 152;
    settings.spriteheight = 75;
    this.parent(x, y, settings);
  },

  onClick: function(event){
    var shareText = 'Just made ' + game.data.steps + ' steps on Clumsy Bird! Can you beat me? Try online here!';
    var url = 'http://ellisonleao.github.io/clumsy-bird/';
    var hashtags = 'clumsybird,melonjs'
    window.open('https://twitter.com/intent/tweet?text=' + shareText + '&hashtags=' + hashtags + '&count=' + url + '&url=' + url, 'Tweet!', 'height=300,width=400')
    return false;
  }

});

game.TitleScreen = me.ScreenObject.extend({
	onResetEvent: function() {
    me.audio.stop("theme");
    game.data.newHiScore = false;
    me.game.world.addChild(new BackgroundLayer('bg', 1));

		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        me.input.bindKey(me.input.KEY.SPACE, "enter", true);
		me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);

    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			if (action === "enter") {
			  me.state.change(me.state.PLAY);
			}
		});

    //logo
    var logoImg = me.loader.getImage('logo');
    var logo = new me.SpriteObject (
      me.game.viewport.width/2 - 170,
      -logoImg,
      logoImg
    );
    me.game.world.addChild(logo, 10);

    var logoTween = new me.Tween(logo.pos).to({y: me.game.viewport.height/2 - 100},
        1000).easing(me.Tween.Easing.Exponential.InOut).start();

    this.ground = new TheGround();
    me.game.world.addChild(this.ground, 11);

    me.game.world.addChild(new (me.Renderable.extend ({
        // constructor
        init : function() {
            // size does not matter, it's just to avoid having a zero size 
            // renderable
            this.parent(new me.Vector2d(), 100, 100);
            this.font = new me.Font('Arial Black', 20, 'black', 'left');
            this.text = me.device.touch ? 'Tap to start' : 'PRESS SPACE OR CLICK LEFT MOUSE BUTTON TO START';
        },
        update : function () {
            return true;
        },
        draw : function (context) {
            var measure = this.font.measureText(context, this.text);
            this.font.draw(context, this.text,  me.game.viewport.width/2 - measure.width/2,  me.game.viewport.height/2 + 50);
        }
    })), 12);


	},

	onDestroyEvent : function() {
    	// unregister the event
		me.event.unsubscribe(this.handler);
		me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
		me.input.unbindMouse(me.input.mouse.LEFT);
    me.game.world.removeChild(this.ground);
	}

});
game.PlayScreen = me.ScreenObject.extend({
  init: function(){
    me.audio.play("theme", true);
    // lower audio volume on firefox browser
    var vol = me.device.ua.contains("Firefox") ? 0.3 : 0.5;
    me.audio.setVolume(vol);
    this.parent(this);
  },

	onResetEvent: function() {
    me.audio.stop("theme");
    me.audio.play("theme", true);

    me.input.bindKey(me.input.KEY.SPACE, "fly", true);
    game.data.score = 0;
    game.data.steps = 0;
    game.data.start = false;
    game.data.newHiscore = false;

    me.game.world.addChild(new BackgroundLayer('bg', 1));

    this.ground = new TheGround();
    me.game.world.addChild(this.ground, 11);

    this.HUD = new game.HUD.Container();
    me.game.world.addChild(this.HUD);

    this.bird = me.pool.pull("clumsy", 60, me.game.viewport.height/2 - 100);
    me.game.world.addChild(this.bird, 10);

    //inputs
    me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.SPACE);

    this.getReady = new me.SpriteObject(
      me.video.getWidth()/2 - 200,
      me.video.getHeight()/2 - 100,
      me.loader.getImage('getready')
    );
    me.game.world.addChild(this.getReady, 11);

    var fadeOut = new me.Tween(this.getReady).to({alpha: 0}, 2000)
      .easing(me.Tween.Easing.Linear.None)
      .onComplete(function(){
            game.data.start = true;
            me.game.world.addChild(new PipeGenerator(), 0);
       }).start();
  },

	onDestroyEvent: function() {
    me.audio.stopTrack('theme');
    // free the stored instance
    this.HUD = null;
    this.bird = null;
    me.input.unbindKey(me.input.KEY.SPACE);
	}

});
game.GameOverScreen = me.ScreenObject.extend({

  init: function(){
    this.savedData = null;
    this.handler = null;
  },

  onResetEvent: function() {
    me.audio.play("lose");
    //save section
    this.savedData = {
      score: game.data.score,
      steps: game.data.steps
    };
    me.save.add(this.savedData);
    if (!me.save.topSteps) me.save.add({topSteps: game.data.steps});
    if (game.data.steps > me.save.topSteps){
      me.save.topSteps = game.data.steps;
      game.data.newHiScore = true;
    }
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    me.input.bindKey(me.input.KEY.SPACE, "enter", false)
    me.input.bindMouse(me.input.mouse.LEFT, me.input.KEY.ENTER);

    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
        if (action === "enter") {
            me.state.change(me.state.MENU);
        }
    });


    var gImage =  me.loader.getImage('gameover');
    me.game.world.addChild(new me.SpriteObject(
        me.video.getWidth()/2 - gImage.width/2,
        me.video.getHeight()/2 - gImage.height/2 - 100,
        gImage
    ), 12);

    var gImageBoard = me.loader.getImage('gameoverbg');
    me.game.world.addChild(new me.SpriteObject(
      me.video.getWidth()/2 - gImageBoard.width/2,
      me.video.getHeight()/2 - gImageBoard.height/2,
      gImageBoard
    ), 10);

    me.game.world.addChild(new BackgroundLayer('bg', 1));
    this.ground = new TheGround();
    me.game.world.addChild(this.ground, 11);

    // share button
    this.share = new Share();
    me.game.world.addChild(this.share, 12);

    //tweet button
    this.tweet = new Tweet();
    me.game.world.addChild(this.tweet, 12);

    // add the dialog witht he game information
    if (game.data.newHiScore){
      var newRect = new me.SpriteObject(
          235,
          355,
          me.loader.getImage('new')
      );
      me.game.world.addChild(newRect, 12);
    }

    this.dialog = new (me.Renderable.extend({
      // constructor
      init : function() {
          // size does not matter, it's just to avoid having a zero size
          // renderable
          this.parent(new me.Vector2d(), 100, 100);
          this.font = new me.Font('Arial Black', 40, 'black', 'left');
          this.steps = 'Steps: ' + game.data.steps.toString();
          this.topSteps= 'Higher Step: ' + me.save.topSteps.toString();
      },

      update : function () {
        return true;
      },

      draw : function (context) {
        var stepsText = this.font.measureText(context, this.steps);
        var topStepsText = this.font.measureText(context, this.topSteps);

        var scoreText = this.font.measureText(context, this.score);
        //steps
        this.font.draw(
            context,
            this.steps,
            me.game.viewport.width/2 - stepsText.width/2,
            me.game.viewport.height/2
        );
        //top score
        this.font.draw(
            context,
            this.topSteps,
            me.game.viewport.width/2 - topStepsText.width/2,
            me.game.viewport.height/2 + 50
        );

      }
    }));
    me.game.world.addChild(this.dialog, 12);
  },

	onDestroyEvent : function() {
		// unregister the event
		me.event.unsubscribe(this.handler);
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindKey(me.input.KEY.SPACE);
		me.input.unbindMouse(me.input.mouse.LEFT);
    me.game.world.removeChild(this.ground);
    this.font = null;
    me.audio.stop("theme");
	}

});
