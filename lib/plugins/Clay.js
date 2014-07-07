/*
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2013, Olivier Biot, Jason Oster
 * http://www.melonjs.org
 *
 * Clay.io API plugin
 *
 */

(function($) {

  /**
   * @class
   * @public
   * @extends me.plugin.Base
   * @memberOf me
   * @constructor
   */
	Clay = me.plugin.Base.extend({
		// minimum melonJS version expected
		version : "1.0.0",
    gameKey: null,
    apiObject: null,
    debug: false,
    hideUI: false,

		init : function(gameKey) {
      // call the parent constructor
      this.parent();
      this.gameKey = gameKey;
      me.game.Clay = null;

      Clay = this.apiObject || {};
      Clay.gameKey = this.gameKey;
      Clay.readyFunctions = [];
      Clay.ready = function( fn ) {
        Clay.readyFunctions.push( fn );
      };

      Clay.options = {
        debug: true,
        hideUI: false,
        fail: function(error){
          console.log('Error: ' + error);
        }
      }

      window.onload = function() {
        var clay = document.createElement("script");
        //clay.async = true;
        clay.src = ( "https:" == document.location.protocol ? "https://" : "http://" ) + "clay.io/api/api.js";
        var tag = document.getElementsByTagName("script")[0];
        tag.parentNode.insertBefore(clay, tag);
      }
      this.apiObject = Clay;
		},

    leaderboard: function(id, score, callback) {
      if (id == undefined || id == '') {
        throw "You must pass a leaderboard id";
      }
      // we can get the score directly from game.data.score
      if (!score){
        score = game.data.score;
      }
      this.apiObject.ready(function() {
        var leaderboard = new this.apiObject.Leaderboard({id: id});
        if (!callback) {
          leaderboard.post({score: score}, callback);
        }else{
          leaderboard.post({score: score});
        }
      });
    },

	});
})(window);
