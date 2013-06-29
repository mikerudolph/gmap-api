var jsonp = require('jsonp');

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

  this.settings = {
    sel: opts.sel,
    sensor: opts.sensor || false
  };

  /* Setup mapOpts */
  this.mapOpts = {
    zoom: opts.zoom || 4,
    center: {
      lat: (opts.center && opts.center.lat) || -25.363882,
      lng: (opts.center && opts.center.lng) || 131.044922
    },
    mapTypeId: opts.mapTypeId || 'roadmap'
  };

  this.map = {};

  this._init();
}

GMap.prototype._init = function() {

  var self = this;
  this._loadApi(function(err, google) {
    self.maps = google.maps;

    var center = self.mapOpts.center;
    var newCenter = new google.maps.LatLng(center.lat, center.lng);

    self.mapOpts.center = newCenter;
    self.map = new google.maps.Map(self.settings.sel, self.mapOpts);
  });
};

GMap.prototype._loadApi = function(cb) {
  var url = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor='+
            this.settings.sensor + '&libraries=places';

  jsonp(url, function(err) {
    if (err) {
      return cb('Could not load the Google Maps API');
    }

    cb(null, google);
  });
};
