(function() {
  'use strict';
  var mmAnswer = angular.module('mmCompass', []);

  mmAnswer.directive('mmCompass', [function() {
    return {
      restrict: 'EA',
      scope: {
        mmCompass: '=',
        disallowChange: '='
      },
      link: function(scope, element) {
        var ctx = element[0].getContext('2d');

        var drawing = false;

        var radians = Math.radians(scope.mmCompass),
          lastRadians = 0,
          width = element[0].width,
          height = element[0].height,
          centerX = width / 2,
          centerY = height / 2;

        element.bind('mousedown', function(event) {
          if (!scope.disallowChange) {
            var last = {};
            if (event.offsetX !== undefined){
              last.x = event.offsetX;
              last.y = event.offsetY;
            } else {
              last.x = event.layerX - event.currentTarget.offsetLeft;
              last.y = event.layerY - event.currentTarget.offsetTop;
            }
            lastRadians = Math.atan2(last.y - centerY, last.x - centerX);

            drawing = true;
          }
        });

        element.bind('mousemove', function(event) {
          if (!scope.disallowChange) {
            if (drawing) {
              event.preventDefault();
              event.stopPropagation();
              var current = {};
              var currentRadians;

              if(event.offsetX !== undefined) {
                current.x = event.offsetX;
                current.y = event.offsetY;
              } else {
                current.x = event.layerX - event.currentTarget.offsetLeft;
                current.y = event.layerY - event.currentTarget.offsetTop;
              }

              currentRadians = Math.atan2(current.y - centerY, current.x - centerX);
              radians += currentRadians - lastRadians;

              if (radians >= Math.PI) {
                radians -= 2 * Math.PI;
              } else if (radians <= -Math.PI) {
                radians += 2 * Math.PI;
              }
              arrow_draw(radians);

              lastRadians = currentRadians;
              last = current;
            }
          }
        });

        element.bind('mouseup', function(event) {
          if (!scope.disallowChange) {
            drawing = false;
          }
        });

        var img = document.createElement('img');
        img.src = 'images/arrow.png';
        img.onload = function() {
          radians = Math.radians(scope.mmCompass);
          arrow_draw(radians);
        };

        var arrow_draw = function(radians) {
          ctx.strokeRect(0, 0, width, height);
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          // Draw off canvas
          ctx.save();
          //Translate canvas to center
          ctx.translate(centerX, centerY);
          ctx.rotate(radians);
          ctx.drawImage(img, -60 / 2, -60 / 2, 60, 60 * img.height / img.width);
          ctx.stroke();
          ctx.restore();
          if (drawing) {
            scope.$apply(function() {
              scope.mmCompass = Math.degrees(radians);
            });
          }
        };

        var removeWatch = scope.$watch('mmCompass', function(angle) {
          if (!drawing) {
            radians = Math.radians(angle);
            arrow_draw(radians);
          }
        });

        scope.$on('$destroy', function() {
          removeWatch();
        });
      }
    };
  }]);

Math.degrees = function(radians) {
  var value = radians * 180 / Math.PI;
  if (value < 0) {
    value += 360.0;
  }
  return Math.round(value);
};

Math.radians = function(degrees) {
  if (degrees > 180) {
    degrees -= 360.0;
  }
  return degrees * Math.PI / 180.0;
};

})();
