'use strict';

var admiral = angular.module('admiral', ['ui.bootstrap', 'cgNotify',
  'angularMoment', 'ngSanitize', 'ngCookies', 'ui.router', 'NgSwitchery'
]);

admiral.config(['$stateProvider', '$locationProvider', '$httpProvider',
  '$urlRouterProvider', 'SRC_PATH', '$urlMatcherFactoryProvider',
  function ($stateProvider, $locationProvider, $httpProvider,
    $urlRouterProvider, SRC_PATH, $urlMatcherFactoryProvider) {

    $urlRouterProvider.rule(
      function ($injector, $location) {
        var path = $location.url();
        // check to see if the path has a trailing slash
        if (path[path.length - 1] === '/')
          return path.replace(/\/$/, '');
        if (path.indexOf('/?') > 0)
          return path.replace('/?', '?');

        return false;
      }
    );

    $stateProvider.state('dashboardNew', {
      url: '/',
      templateUrl: SRC_PATH + 'dashboard/dashboardNew.html',
      controller: 'dashboardNewCtrl'
    });

    $urlRouterProvider.otherwise('/');

    $urlMatcherFactoryProvider.strictMode(false);
    $locationProvider.html5Mode(true).hashPrefix('#');
  }
]);

admiral.filter('contains', function() {
  return function (array, needle) {
    return array.indexOf(needle) >= 0;
  };
});

(function () {
  admiral.run(['$rootScope', '$timeout', '$q', '$cookies',
    startApp
  ]);

  function startApp($rootScope, $timeout, $q, $cookies) {
    $('#overlay').fadeOut(800);
    // All root variables to be stored in _r
    $rootScope._r = {};
    $rootScope._r.openEULA = function() {
      $rootScope.$broadcast('showEULAModal');
    };

    async.series([
        reset
      ],
      function (err) {
        if (err) {
          $rootScope._r.appDefer.reject(err);
          return console.log(err);
        }
        $rootScope._r.appDefer.resolve();
      }
    );

    function reset(next) {
      $rootScope._r.appLoaded = $rootScope._r.appLoaded || false;
      $rootScope._r.loadingMessage = '';
      $rootScope._r.title = 'Shippable | Admiral';
      $rootScope._r.appDefer = $q.defer();
      $rootScope._r.appPromise = $rootScope._r.appDefer.promise;

      $rootScope._r.appPromise.then(
        function () {
          $rootScope._r.appLoaded = true;
        }
      );

      $rootScope._r.loginToken = $cookies.loginToken;

      $timeout(
        function () {
          $rootScope._r.loadingMessage = 'Loading app...';
        }, 3000
      );
      $timeout(
        function () {
          $rootScope._r.loadingMessage = 'Still loading app...';
        }, 30000
      );
      $timeout(
        function () {
          $rootScope._r.loadingMessage =
            'There is an issue loading the app, please check the logs';
        }, 120000
      );
      return next();
    }
  }
})();

admiral.constant('ADMIRAL_URL', $.cookie('admiralUrl'));
admiral.constant('SRC_PATH', '/scripts/');

$(document).ready(
  function () {
    $(window).scroll(
      function () {
        if ($(window).scrollTop() > 50)
          $('#horn').addClass('ss-fixed');
        if ($(window).scrollTop() < 51)
          $('#horn').removeClass('ss-fixed');
      }
    );
  }
);
