var jsonp = require('jsonp');
var extend = require('extend');

module.exports = GMap;

function GMap(opts) {
  if (!(this instanceof GMap)) {
    return new GMap(opts);
  }

  // TODO Cleanup type validation
  if (!opts || opts && typeof(opts) !== 'object') {
    throw new Error('Invalid/No Options passed');
  }

  if (!opts.sel || typeof(opts.sel) !== 'object') {
    throw new Error('Missing/invalid binding element');
  }

  var defaults = {
    // component specific
    sensor: false,
    beta: false,

    // map
    map: {
      zoom: 4,
      center: {
        lat: -25.363882,
        lng: 131.044922
      },
      mapTypeId: 'roadmap',
      panControl: false,
      tilt: 45
    },

    // street
    street: {
      visible: true,
      zoom: 1,
      pov: {
        heading: 0,
        pitch: 0,
        zoom: 1
      }
    }
  };

  this.settings = extend(true, defaults, opts);
  this.map = {};

  this._init();
}

GMap.prototype._init = function() {
  var self = this;

  this._loadApi(function(err, google) {
    self.maps = google.maps;

    var center = self.settings.map.center;
    var newCenter = new google.maps.LatLng(center.lat, center.lng);

    self.settings.map.center = newCenter;
    self.map = new google.maps.Map(self.settings.sel, self.settings.map);

    /* Initialize streetview */
    self.street = self.map.getStreetView();
    self.street.setPosition(newCenter);
    self.street.setVisible(self.settings.street.visible);
    self.street.setZoom(self.settings.street.zoom);
    self.street.setPov(self.settings.street.pov);
  });
};

GMap.prototype._loadApi = function(cb) {
  var url = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor='+
            this.settings.sensor;

  jsonp(url, function(err) {
    if (err) {
      return cb('Could not load the Google Maps API');
    }

    cb(null, google);
  });
};

GMap.prototype.toggleStreetView = function(opt) {
  if (opt !== undefined) {
    this.street.setVisible(opt);

  } else if (this.street.getVisible()) {
    this.street.setVisible(false);

  } else {
    this.street.setVisible(true);
  }
};
