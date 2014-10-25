(function() {
  'use strict';
  var mmImg = angular.module('mmImg', []);

  mmImg.factory('mmImg', ['$q', function($q) {
    var img = {
      // read from file
      getFileExif: function(file) {
        var deferred = $q.defer(),
          reader = new FileReader();

        reader.onload = function (e) {
          EXIF.getData(new Blob([e.target.result]), function() {
            deferred.resolve(this.exifdata);
          });
        };
        reader.readAsArrayBuffer(file);

        return deferred.promise;
      },

      getLinkExif: function(link) {
        var deferred = $q.defer(),
          http = new XMLHttpRequest();

        http.open('GET', link, true);

        http.responseType = 'blob';

        http.onload = function(e) {
          if (this.status === 200) {
            EXIF.getData(http.response, function() {
              deferred.resolve(this.exifdata);
            });
          }
        };
        http.send();

        return deferred.promise;
      }
    };
    return img;
  }]);

})();
