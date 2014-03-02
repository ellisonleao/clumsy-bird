game.TitleScreen = me.ScreenObject.extend({
  init: function(){
    this.font = null;    
  },

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
        init: function() {
            // size does not matter, it's just to avoid having a zero size 
            // renderable
            this.parent(new me.Vector2d(), 100, 100);
            //this.font = new me.Font('Arial Black', 20, 'black', 'left');
            this.text = me.device.touch ? 'Tap to start' : 'PRESS SPACE OR CLICK LEFT MOUSE BUTTON TO START';
            this.font = new me.Font('gamefont', 20, '#000');
        },
        update: function () {
            return true;
        },
        draw: function (context) {
            var measure = this.font.measureText(context, this.text);
            this.font.draw(context, this.text, me.game.viewport.width/2 - measure.width/2, me.game.viewport.height/2 + 50);
        }
    })), 12);
  },

  onDestroyEvent: function() {
      // unregister the event
    me.event.unsubscribe(this.handler);
    me.input.unbindKey(me.input.KEY.ENTER);
        me.input.unbindKey(me.input.KEY.SPACE);
    me.input.unbindMouse(me.input.mouse.LEFT);
    me.game.world.removeChild(this.ground);
  }
});
