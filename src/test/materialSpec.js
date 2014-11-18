describe("mmMaterial module", function() {
  beforeEach(module('mmMaterial'));

  describe("mmMaterialCtrl controller", function() {
    var scope;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller('mmMaterialCtrl', {
        '$scope': scope,
        'mmMaterial': 'abc'
      });
    }));

    it("initial state", function() {
      expect(scope.material).toEqual('abc');
    });
  });

  describe("mmMaterial factory", function() {
    var mmMaterial;

    beforeEach(inject(function (_mmMaterial_) {
      mmMaterial = _mmMaterial_;
    }));

    it("init", function() {
      expect(mmMaterial).toBeDefined();
      expect(mmMaterial.focused).toBeUndefined();
      expect(mmMaterial.isSet).toEqual(false);
      expect(mmMaterial.set).toBeDefined();
      expect(mmMaterial.unset).toBeDefined();
    });

    describe("set", function() {
      var material = {name: 'name'};

      beforeEach(function () {
        mmMaterial.set(material);
      });

      it("run", function() {
        expect(mmMaterial.focused).toEqual(material);
        expect(mmMaterial.isSet).toEqual(true);
      });

      it("unset", function() {
        mmMaterial.unset();

        expect(mmMaterial.focused).toBeUndefined();
        expect(mmMaterial.isSet).toEqual(false);
      });
    });
  });
});
