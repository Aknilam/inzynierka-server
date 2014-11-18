describe("mmLogin module", function() {
  beforeEach(module(function($provide) {
    $provide.value('$modal', {});
    $provide.value('$upload', {});
  }));

  beforeEach(module('mmLogin'));

  describe("mmLoginCtrl controller", function() {
    var scope,
      loginMock = {
        login: function() {},
        register: function() {}
      };

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller('mmLoginCtrl', {
        '$scope': scope,
        'mmLogin': loginMock
      });

      spyOn(loginMock, 'login');
      spyOn(loginMock, 'register');
    }));

    it("initial state", function() {
      expect(scope.LOGIN).toEqual(jasmine.any(Object));
      expect(scope.login).toEqual(jasmine.any(Function));
      expect(scope.register).toEqual(jasmine.any(Function));
    });

    it("login", function() {
      var username = 'username',
        password = 'password';
      scope.login(username, password);
      expect(loginMock.login).toHaveBeenCalledWith(username, password, jasmine.any(Function));
    });

    it("register", function() {
      var username = 'username',
        password = 'password',
        password2 = 'password2';
      scope.register(username, password, password2);
      expect(loginMock.register).toHaveBeenCalledWith(username, password, password2, jasmine.any(Function));
    });
  });

  describe("mmLogin factory", function() {
    var mmLogin,
      httpMock = {
        post: function() {},
        get: function() {}
      };

    beforeEach(module(function($provide) {
      $provide.value('mmHttp', httpMock);

      spyOn(httpMock, 'post');
      spyOn(httpMock, 'get');
    }));

    beforeEach(inject(function (_mmLogin_) {
      mmLogin = _mmLogin_;
    }));

    it("init", function() {
      expect(mmLogin).toBeDefined();
      expect(mmLogin.state).toEqual(mmLogin.states.unauthorized);
      expect(mmLogin.states).toEqual(jasmine.any(Object));
      expect(mmLogin.me).toEqual(jasmine.any(Object));
      expect(mmLogin.login).toBeDefined();
      expect(mmLogin.logout).toBeDefined();
      expect(mmLogin.changePassword).toBeDefined();
      expect(mmLogin.register).toBeDefined();
    });

    it("login", function() {
      var username = 'username',
        password = 'password';

      mmLogin.state = mmLogin.states.unauthorized;
      mmLogin.login(username, password);

      expect(httpMock.post).toHaveBeenCalledWith('login', {username: username, password: CryptoJS.MD5(password).toString()}, jasmine.any(Function), jasmine.any(Function));
    });

    it("logout", function() {
      mmLogin.state = mmLogin.states.authorized;
      mmLogin.logout();

      expect(httpMock.get).toHaveBeenCalledWith('logout', jasmine.any(Function), jasmine.any(Function));
    });

    it("changePassword", function() {
      var password = 'password';

      mmLogin.state = mmLogin.states.authorized;
      mmLogin.changePassword(password, password);

      expect(httpMock.post).toHaveBeenCalledWith('changePassword', {password: CryptoJS.MD5(password).toString()}, jasmine.any(Function), jasmine.any(Function));
    });

    it("register", function() {
      var username = 'username',
        password = 'password';

      mmLogin.state = mmLogin.states.unauthorized;
      mmLogin.register(username, password, password);

      expect(httpMock.post).toHaveBeenCalledWith('register', {username: username, password: CryptoJS.MD5(password).toString()}, jasmine.any(Function), jasmine.any(Function));
    });
  });
});
