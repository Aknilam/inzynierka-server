angular.module('templates', []).run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/addMaterialModal.html',
    "<div class=modal-content><div class=modal-header><button type=button class=close ng-click=cancel()>&times;</button><h4 class=modal-title>Add a new material</h4></div><div class=modal-body><div ng-include=\"'templates/materialForm.html'\" ng-init=\"submit = ok; selected = $root.MATERIALS.data.selected; setSelectedFile = $root.MATERIALS.setSelectedFile; loadImage = $root.MATERIALS.loadImage;\"></div><div class=modal-footer><button type=submit ng-click=ok() class=\"btn btn-success\">Add material</button> <button type=button class=\"btn btn-default\" ng-click=cancel()>Cancel</button></div></div></div>"
  );


  $templateCache.put('templates/alerts.html',
    "<div id=alerts><alert ng-repeat=\"alert in alerts.list\" type={{alert.type}} close=alerts.close(alert)>{{alert.text}} <span class=timer ng-show=\"alert.counter > 0\">{{alert.counter}} {{alert.counter === 1 ? 'second' : 'seconds'}} remaining</span></alert></div>"
  );


  $templateCache.put('templates/confirm.html',
    "<div class=modal-content><div class=modal-header><button type=button class=close ng-click=cancel()>&times;</button><h4 class=modal-title>{{text}}</h4></div><div class=modal-body>{{content}}</div><div class=modal-footer><button type=button class=\"btn btn-success\" ng-click=ok()>{{answer.accept}}</button> <button type=button class=\"btn btn-default\" ng-click=cancel()>{{answer.reject}}</button></div></div>"
  );


  $templateCache.put('templates/editMaterialModal.html',
    "<div class=modal-content><div class=modal-header><button type=button class=close ng-click=cancel()>&times;</button><h4 class=modal-title>Edit material</h4></div><div class=modal-body><div ng-include=\"'templates/materialForm.html'\" ng-init=\"submit = ok; selected = material; setSelectedFile = onFileSelect; loadImage = loadMaterialImage;\"></div></div><div class=modal-footer><button type=submit ng-click=ok() class=\"btn btn-success\">Save</button> <button type=button class=\"btn btn-default\" ng-click=cancel()>Cancel</button></div></div>"
  );


  $templateCache.put('templates/materialForm.html',
    "<form role=form ng-submit=submit()><div class=form-group><label>Name</label><input type=text ng-model=selected.name placeholder=Name class=form-control focus=true></div><div class=form-group><label>Description</label><textarea type=text ng-model=selected.description placeholder=Description class=form-control>\r" +
    "\n" +
    "    </textarea></div><div class=form-group><label>Position</label><div>({{selected.lat}}, {{selected.lng}})</div></div><div class=form-group><label>Angle</label><div>{{selected.iconAngle}}</div><div style=\"width: 100%\" mm-angle=selected.iconAngle></div><canvas width=60 height=60 id=canvas mm-compass=selected.iconAngle></canvas></div><div class=form-group><label>Photo</label><input type=file class=\"btn btn-default\" ng-file-select=\"setSelectedFile($files, '#toShowImage')\" accept=image/*><img id=toShowImage ng-init=\"loadImage('#toShowImage')\" style=\"max-height: 200px; max-width: 100%\"></div></form>"
  );


  $templateCache.put('templates/materialShow.html',
    "<dl><dt>Name</dt><dd>{{material.focused.name}}</dd><dt>Description</dt><dd>{{material.focused.description}}</dd><dt>Coordinates</dt><dd>({{material.focused.lat}}, {{material.focused.lng}})</dd><dt ng-show=material.focused.angle>Angle</dt><dd ng-show=material.focused.angle><canvas width=60 height=60 id=canvas mm-compass=material.focused.iconAngle disallow-change=true></canvas>{{material.focused.iconAngle}}</dd><dt ng-show=material.focused.fileName>Image</dt><dd ng-show=material.focused.fileName><img ng-if=material.focused.fileName style=\"max-width: 100%; max-height: 50%\" ng-src=materials/{{$root.PROJECT.actual.folderName}}/{{material.focused.fileName}}></dd><dt>Tags</dt><dd><tags-input ng-model=material.focused.pluginTags display-property=name on-tag-added=\"$root.MATERIALS.addPossibleTag(material.focused, $tag)\" on-tag-removed=\"$root.MATERIALS.removeTag(material.focused, $tag)\"><auto-complete source=$root.TAGS.getDataFor($query)></auto-complete></tags-input><select class=form-control ng-model=selectedTag ng-init=\"selectedTag = $root.TAGS.getFirstProperty($root.TAGS.data)\" ng-options=\"tag.name for (name, tag) in $root.TAGS.data\"></select><button type=submit class=\"btn btn-default\" ng-click=\"$root.MATERIALS.addTag(material.focused, selectedTag)\">Add tag</button></dd></dl>"
  );

}]);
