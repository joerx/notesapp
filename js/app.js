/**
 * Copyright (c) 2014 Joerg Henning. All rights reserved.
 * Licensed under 3-clause BSD License.
 */

/**
 * This script constitutes a simple note-taking application. It is (so far) running only in the 
 * Browser using local storate. The purpose of this application is to illustrate some key concepts
 * of the Backbone framework.
 */
(function($) {


  /**
   * View representing the 'home page', should be a scrollable list of notes taken so far.
   */
  var HomeView = Backbone.View.extend({

    events: {
      'click button': 'sayHello'
    },

    // We cannot construct this at declaration time as the DOM is not ready yet. See #initialize()
    template: null,

    initialize: function() {
      this.template = _.template($('#homeview-tpl').html());
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    sayHello: function() {
      console.log('Hello World!');
    }
  });

  /**
   * View repesenting the settings page. Could be used to handle Google identity or user 
   * preferences.
   */
  var SettingsView = Backbone.View.extend({

    template: null,

    initialize: function() {
      this.template = _.template($('#settingsview-tpl').html());
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  /**
   * View representing a static page showing information about the app (Author, version, etc.)
   */
  var AboutView = Backbone.View.extend({

    template: null,

    initialize: function() {
      this.template = _.template($('#aboutview-tpl').html());
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    }
  });

  /**
   * Main note taking application, basically a glorified backbone router
   */
  var NotesApp = Backbone.Router.extend({

    routes: {
      '': 'home', 
      'settings': 'settings',
      'about': 'about'
    },

    view: null,

    viewCache: {},

    /**
     * Render the home page
     */
    home: function() {
      this.toggleView('Home', HomeView);
    },

    /**
     * Render the setting page
     */
    settings: function() {
      this.toggleView('Settings', SettingsView);
    },

    /**
     * Render the about page
     */
    about: function() {
      this.toggleView('About', AboutView);
    },

    /**
     * Create a new instance of the given view constructor and render it. There is another view 
     * currently active, it will be removed from the DOM.
     *
     * View instance are cached, so calling this twice with the same instance will render the same
     * object.
     */
    toggleView: function(name, ctor) {
      // Find existing view with the same name or create a new instance. Pass parent element as 
      // `el` property into the view, so it can attach itself to it
      var instance;
      if (!(instance = this.viewCache[name])) {
        var el = $('#notes-app');
        instance = this.viewCache[name] = new ctor({el: el});
      };

      // If a view is currently active, disable all event listeners attached to it
      if (this.view) {
        this.view.undelegateEvents();
      }

      // Render the current instance and (re-)attach events
      this.view = instance.render();
      this.view.delegateEvents();
    }

  });

  // When DOM is ready, create a new instance of the App and start Backbone history
  
  $(function() {
    new NotesApp();
    Backbone.history.start();
  });

})(jQuery);