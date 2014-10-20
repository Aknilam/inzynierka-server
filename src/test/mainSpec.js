describe("mmApp module", function() {
  beforeEach(module('mmApp'));

  describe("mmCtrl controller", function() {
    var scope;

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller('mmCtrl', {
        '$scope': scope
      });
    }));

    it("initial state", function() {
      expect(scope.$root.LOGIN).toBeDefined();
    });
  });
});
