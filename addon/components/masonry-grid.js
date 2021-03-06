/* global imagesLoaded */
import Ember from 'ember';

var getOptions = function(keys) {
  var properties = this.getProperties(keys);

  Object.keys(properties).forEach(function(key) {
    if (properties[key] === 'null') {
      properties[key] = null;
    }
    if (properties[key] === undefined) {
      delete properties[key];
    }
  });

  return properties;
};

export default Ember.Component.extend({
  classNames: ['masonry-grid'],

  options: null,
  items: null,

  masonryInitialized: false,

  initializeMasonry: Ember.on('didInsertElement', function() {
    this.set('options', getOptions.call(this, [
      'containerStyle',
      'columnWidth',
      'gutter',
      'hiddenStyle',
      'isFitWidth',
      'isInitLayout',
      'isOriginLeft',
      'isOriginTop',
      'isResizeBound',
      'itemSelector',
      'percentPosition',
      'stamp',
      'transitionDuration',
      'visibleStyle'
    ]));

    this.resetMasonry();
  }),

  resetMasonry: Ember.observer('items', function() {
    var _this = this;

    if (this.items && this.items.then) {
      this.items.then(fulfill, reject);
    } else {
      fulfill();
    }

    function fulfill() {
      imagesLoaded(_this.$(), function() {
        if (_this.get('masonryInitialized') && _this.$()) {
          _this.$().masonry('destroy');
        }

        if (_this.$()) {
          _this.$().masonry(_this.get('options'));
        }

        if (!(_this.get('isDestroyed') || _this.get('isDestroying'))) {
          _this.set('masonryInitialized', true);
        }
      });
    }

    function reject(reason) {
      console.log(reason);
    }
  }),

  reloadMasonry: Ember.observer('items.[]', function() {
    var _this = this;

    imagesLoaded(this.$(), function() {
      _this.$().masonry('reloadItems');
      _this.$().masonry();
    });
  }),
});
