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
   Clayio = me.plugin.Base.extend({
    // minimum melonJS version expected
    version : "1.0.0",
    gameKey: null,
    _leaderboard: null,

    init : function(gameKey, options) {
      // call the parent constructor
      this.parent();
      this.gameKey = gameKey;

      Clay = {};
      Clay.gameKey = this.gameKey;
      Clay.readyFunctions = [];
      Clay.ready = function( fn ) {
        Clay.readyFunctions.push( fn );
      };

      if (options === undefined) {
          options = {
            debug: false,
            hideUI: false
          }
      }

      Clay.options = {
        debug: options.debug === undefined ? false: options.debug,
        hideUI: options.hideUI === undefined ? false: options.hideUI,
        fail: options.fail
      }

      window.onload = function() {
        var clay = document.createElement("script");
        clay.async = true;
        clay.src = ( "https:" == document.location.protocol ? "https://" : "http://" ) + "cdn.clay.io/api.js";
        var tag = document.getElementsByTagName("script")[0];
        tag.parentNode.insertBefore(clay, tag);
      }
    },

    leaderboard: function(id, score, callback) {
      if (!id) {
        throw "You must pass a leaderboard id";
      }
      // we can get the score directly from game.data.score
      if (!score){
        score = game.data.score;
      }
      var leaderboard = new Clay.Leaderboard({id: id});
      this._leaderboard = leaderboard;
      if (!callback) {
        this._leaderboard.post({score: score}, callback);
      }else{
        this._leaderboard.post({score: score});
      }
    },

    showLeaderBoard: function(id, options, callback) {
      if (!options){
          options = {};
      }
      if (options.limit === undefined){
          options.limit = 10;
      }

      if (!this._leaderboard) {
        if (id === undefined) {
          throw "The leaderboard was not defined before. You must pass a leaderboard id";
        }
        var leaderboard = new Clay.Leaderboard({id: id});
        this._leaderboard = leaderboard;
      }
      this._leaderboard.show(options, callback);
    }

  });
})(window);
