angular.module('templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/addMaterialModal.html',
    "<div class=modal-content><div class=modal-header><button type=button class=close ng-click=cancel()>&times;</button><h4 class=modal-title>Add a new material</h4></div><div class=modal-body><div ng-include=\"'templates/materialForm.html'\" ng-init=\"submit = ok; action='Add'\"></div><div class=modal-footer><button type=button class=\"btn btn-default\" ng-click=cancel()>Cancel</button></div></div></div>"
  );


  $templateCache.put('templates/alerts.html',
    "<div id=alerts><alert ng-repeat=\"alert in alerts.list\" type={{alert.type}} close=alerts.close(alert)>{{alert.text}} <span class=timer ng-show=\"alert.counter > 0\">{{alert.counter}} {{alert.counter === 1 ? 'second' : 'seconds'}} remaining</span></alert></div>"
  );


  $templateCache.put('templates/confirm.html',
    "<div class=modal-content><div class=modal-header><button type=button class=close ng-click=cancel()>&times;</button><h4 class=modal-title>{{text}}</h4></div><div class=modal-body>{{content}}</div><div class=modal-footer><button type=button class=\"btn btn-success\" ng-click=ok()>{{answer.accept}}</button> <button type=button class=\"btn btn-default\" ng-click=cancel()>{{answer.reject}}</button></div></div>"
  );


  $templateCache.put('templates/materialForm.html',
    "<form role=form ng-submit=submit()><div class=form-group><label>Name</label><input type=text ng-model=$root.MATERIALS.data.selected.name placeholder=Name class=form-control focus=true></div><div class=form-group><label>Description</label></div>position: ({{$root.MATERIALS.data.selected.lat}}, {{$root.MATERIALS.data.selected.lng}}) angle: {{$root.MATERIALS.data.selected.iconAngle}}<div style=\"width: 50%\" mm-angle=$root.MATERIALS.data.selected.iconAngle></div><canvas width=60 height=60 id=canvas mm-compass=$root.MATERIALS.data.selected.iconAngle></canvas><input type=file class=\"btn btn-default\" ng-file-select=\"$root.MATERIALS.setSelectedFile($files, '#toShowImage')\" accept=image/*><img id=toShowImage ng-init=\"$root.MATERIALS.loadImage('#toShowImage')\" style=\"max-height: 200px; max-width: 100%\"> <button type=submit class=\"btn btn-success\">{{action}} material</button></form>"
  );

}]);
