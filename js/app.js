var app = angular.module('CARUSER', ['ui.router','firebase',
   'ionic',
   'btford.socket-io',
   'ngAnimate',
   'ngStorage',
   'ngMessages',
   'ngCordova',
   'CARUSER.controllers.Account',
   'CARUSER.controllers.Main',
   'CARUSER.controllers.Profile',
   'CARUSER.controllers.Team',
   'CARUSER.controllers.chat',
   'CARUSER.controllers.menu',
   'CARUSER.controllers.Notification',
   'CARUSER.services',
   'CARUSER.controllers.Paypal',
   'angularMoment', 'jett.ionic.filter.bar'
])

.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.backButton.text('Back').icon('ion-chevron-left');
    $stateProvider
    .state('app', { cache: false, url: "/app", abstract: true, templateUrl: "templates/menu.html", controller: 'AccountController' })
    .state('tab', { cache: false, url: '/tab', abstract: true, templateUrl: 'templates/tabs.html' })
     .state('login', { cache: false, url: '/login', templateUrl: 'templates/CarUser/LoginHtml.html', controller: 'AccountController' })
    .state('signin', { cache: false, url: '/signin', templateUrl: 'templates/login.html', controller: 'AccountController' })
    .state('app.home', { cache: false, url: '/home', views: { 'menuContent': { templateUrl: 'templates/CarUser/Home.html', controller: 'AccountController' } } })
    .state('app.purchase', { cache: false, url: '/purchase', views: { 'menuContent': { templateUrl: 'templates/CarUser/PurchaseHtml.html', reloadOnSearch: false, controller: 'AccountController' } } })
    .state('app.sale', { cache: false, url: '/sale', views: { 'menuContent': { templateUrl: 'templates/CarUser/SaleHtml.html', reloadOnSearch: false, controller: 'AccountController' } } })
    .state('app.exchange', { cache: false, url: '/exchange', views: { 'menuContent': { templateUrl: 'templates/CarUser/ExchangeHtml.html', reloadOnSearch: false, controller: 'AccountController' } } })
    .state('app.listsale', { cache: false, url: '/listsale', views: { 'menuContent': { templateUrl: 'templates/CarUser/ListHtml.html', reloadOnSearch: false, controller: 'AccountController' } } })
    .state('app.listpurchase', { cache: false, url: '/listpurchase', views: { 'menuContent': { templateUrl: 'templates/CarUser/ListPHtml.html', reloadOnSearch: false, controller: 'AccountController' } } })



        .state('register', { cache: false, url: '/register', templateUrl: 'templates/register.html', reloadOnSearch: false, controller: 'AccountController' })

    //.state('app.home', { cache: false, url: '/home', views: { 'menuContent': { templateUrl: 'templates/home.html', controller: 'AccountController' } } })
    .state('app.team', { cache: false, url: '/team', views: { 'menuContent': { templateUrl: 'templates/team.html', controller: 'TeamController' } } })
    .state('app.add-team', { cache: false, url: '/add-team', views: { 'menuContent': { templateUrl: 'templates/add-team.html', controller: 'TeamController' } } })
    .state('app.invite-member', { cache: false, url: '/invite-member', views: { 'menuContent': { templateUrl: 'templates/invite-member.html', reloadOnSearch: false, controller: 'TeamController' } } })
    .state('app.profile1', { cache: false, url: "/profile1", views: { 'menuContent': { templateUrl: "templates/profile1.html", controller: 'ProfileController' } } })
    .state('app.profile2', { cache: false, url: "/profile2", views: { 'menuContent': { templateUrl: "templates/profile2.html", controller: 'ProfileController' } } })
    .state('app.profile3', { cache: false, url: "/profile3", views: { 'menuContent': { templateUrl: "templates/profile3.html", controller: 'ProfileController' } } })
    .state('app.profile4', { cache: false, url: "/profile4", views: { 'menuContent': { templateUrl: "templates/profile4.html", controller: 'ProfileController' } } })
    .state('app.profile', { cache: false, url: '/profile', views: { 'menuContent': { templateUrl: "templates/profile.html", controller: 'ProfileController' } } })
    .state('app.forgetpass', { cache: false, url: '/forgetpass', views: { 'menuContent': { templateUrl: "templates/forgetpass.html", controller: 'AccountController' } } })
	.state('app.forgetuser', { cache: false, url: '/forgetuser', views: { 'menuContent': { templateUrl: "templates/forgetuser.html", controller: 'AccountController' } } })
    .state('app.payment', { cache: false, url: "/payment", views: { 'menuContent': { templateUrl: 'templates/payment.html', controller: 'PaypalController' } } })
    .state('app.notification', { cache: false, url: "/notification", views: { 'menuContent': { templateUrl: 'templates/notification.html', controller: 'NotificationController' } } })
    .state('app.chats', { cache: false, url: '/chats', views: { 'menuContent': { templateUrl: "templates/tab-chats.html", controller: 'TeamController' } } })
    .state('app.teamEdit', { cache: false, url: '/team/:teamid', views: { 'menuContent': { templateUrl: "templates/edit-team.html", controller: 'TeamController' } } })
    .state('app.teamView', { cache: false, url: '/viewteam/:teamid', views: { 'menuContent': { templateUrl: "templates/view-team.html", controller: 'TeamController' } } })
    .state('app.teamMember', { cache: false, url: '/team-member/:teamid', views: { 'menuContent': { templateUrl: "templates/team-member.html", controller: 'TeamController' } } })
    .state('app.chatlogin', { cache: false, url: '/chatlogin', views: { 'menuContent': { templateUrl: 'templates/chatlogin.html' } } })
    .state('app.room', { cache: false, url: '/room/:roomid', views: { 'menuContent': { templateUrl: 'templates/newroom.html' } } })
    .state('app.privateroom', { cache: false, url: '/privatechat/:user/:username', views: { 'menuContent': { templateUrl: 'templates/privatechat.html' } } })
    $urlRouterProvider.otherwise('/login');
});


app.factory('CONNECT', function () {

    var config = {
        apiKey: "AIzaSyCzpuKsdsx3kEdI-7ui1qqNaxa97lb3ORc",
        authDomain: "projecttyre.firebaseapp.com",
        databaseURL: "https://projecttyre.firebaseio.com",
        storageBucket: "projecttyre.appspot.com",
        messagingSenderId: "338735199577"

        //apiKey: "AIzaSyDnl6sToiX33SpdApNef_XKgPghrtDtCQM",
        //authDomain: "CARUSER-19723.firebaseapp.com",
        //databaseURL: "https://CARUSER-19723.firebaseio.com",
        //storageBucket: "CARUSER-19723.appspot.com",
        //messagingSenderId: "208577643695"
    };
    firebase.initializeApp(config);
    return firebase;
});

//app.run(function($state) {
//    var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
//    var authData = ref.getAuth();

//    if (authData) {
//        $state.go('app.home');
//    } else {
//        $state.go('login');
//    }
//})




app.factory('deviceReady', function () {
    return function (done) {
        if (typeof window.cordova === 'object') {
            document.addEventListener('deviceready', function () {
                done();
            }, false);
        } else {
            done();
        }
    };
});


/// PAYPAL CODE
app.factory('PaypalService', ['deviceReady', '$q', 'shopSettings', '$filter', '$timeout', function (deviceReady, $q, shopSettings, $filter, $timeout) {
    var init_defer;
    /**
     * Service object
     * @type object
     */
    var service = {
        initPaymentUI: initPaymentUI,
        createPayment: createPayment,
        configuration: configuration,
        onPayPalMobileInit: onPayPalMobileInit,
        makePayment: makePayment
    };


    /**
     * @ngdoc method
     * @name initPaymentUI
     * @methodOf app.PaypalService
     * @description
     * Inits the payapl ui with certain envs. 
     *
     * 
     * @returns {object} Promise paypal ui init done
     */
    function initPaymentUI() {
        alert("init payemtn ui");
        init_defer = $q.defer();

        deviceReady(function () {

            //  angular.element(document).ready(function () {   });

            var clientIDs = {
                "PayPalEnvironmentProduction": shopSettings.payPalProductionId,
                "PayPalEnvironmentSandbox": shopSettings.payPalSandboxId
            };
            PayPalMobile.init(clientIDs, onPayPalMobileInit);
        });

        return init_defer.promise;

    }


    /**
     * @ngdoc method
     * @name createPayment
     * @methodOf app.PaypalService
     * @param {string|number} total total sum. Pattern 12.23
     * @param {string} name name of the item in paypal
     * @description
     * Creates a paypal payment object 
     *
     * 
     * @returns {object} PayPalPaymentObject
     */
    function createPayment(total, name) {

        // "Sale  == >  immediate payment
        // "Auth" for payment authorization only, to be captured separately at a later time.
        // "Order" for taking an order, with authorization and capture to be done separately at a later time.
        var payment = new PayPalPayment("" + total, "USD", "" + name, "Sale");
        return payment;
    }
    /**
     * @ngdoc method
     * @name configuration
     * @methodOf app.PaypalService
     * @description
     * Helper to create a paypal configuration object
     *
     * 
     * @returns {object} PayPal configuration
     */
    function configuration() {
        // for more options see `paypal-mobile-js-helper.js`
        var config = new PayPalConfiguration({ merchantName: shopSettings.payPalShopName, merchantPrivacyPolicyURL: shopSettings.payPalMerchantPrivacyPolicyURL, merchantUserAgreementURL: shopSettings.payPalMerchantUserAgreementURL });
        return config;
    }

    function onPayPalMobileInit() {
        deviceReady(function () {
            // must be called
            // use PayPalEnvironmentNoNetwork mode to get look and feel of the flow
            PayPalMobile.prepareToRender(shopSettings.payPalEnv, configuration(), function () {

                $timeout(function () {
                    init_defer.resolve();
                });

            });
        });
    }

    /**
     * @ngdoc method
     * @name makePayment
     * @methodOf app.PaypalService
     * @param {string|number} total total sum. Pattern 12.23
     * @param {string} name name of the item in paypal
     * @description
     * Performs a paypal single payment 
     *
     * 
     * @returns {object} Promise gets resolved on successful payment, rejected on error 
     */
    function makePayment(total, name) {

        alert("make payement");
        var defer = $q.defer();
        total = $filter('number')(total, 2);
        deviceReady(function () {
            PayPalMobile.renderSinglePaymentUI(createPayment(total, name), function (result) {
                alert("success payment");
                alert(result);
                $timeout(function () {
                    defer.resolve(result);
                });
            }, function (error) {
                $timeout(function () {
                    defer.reject(error);
                });
            });
        });

        return defer.promise;
    }

    return service;
}]);

//To use this service 



moment.locale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d sec",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    }
});



// elastic css directive


app.constant('msdElasticConfig', {
    append: ''
})

app.directive('msdElastic', [
  '$timeout', '$window', 'msdElasticConfig',
  function ($timeout, $window, config) {
      'use strict';
      return {
          require: 'ngModel',
          restrict: 'A, C',
          link: function (scope, element, attrs, ngModel) {

              // cache a reference to the DOM element
              var ta = element[0],
                  $ta = element;

              // ensure the element is a textarea, and browser is capable
              if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
                  return;
              }

              // set these properties before measuring dimensions
              $ta.css({
                  'overflow': 'hidden',
                  'overflow-y': 'hidden',
                  'word-wrap': 'break-word'
              });

              // force text reflow
              var text = ta.value;
              ta.value = '';
              ta.value = text;

              var append = attrs.msdElastic ? attrs.msdElastic.replace(/\\n/g, '\n') : config.append,
                  $win = angular.element($window),
                  mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' +
                                    'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' +
                                    '-moz-box-sizing: content-box; box-sizing: content-box;' +
                                    'min-height: 0 !important; height: 0 !important; padding: 0;' +
                                    'word-wrap: break-word; border: 0;',
                  $mirror = angular.element('<textarea tabindex="-1" ' +
                                            'style="' + mirrorInitStyle + '"/>').data('elastic', true),
                  mirror = $mirror[0],
                  taStyle = getComputedStyle(ta),
                  resize = taStyle.getPropertyValue('resize'),
                  borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                              taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                              taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
                  boxOuter = !borderBox ? { width: 0, height: 0 } : {
                      width: parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                              parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                              parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                              parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                      height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                              parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                              parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                              parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                  },
                  minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
                  heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
                  minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
                  maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
                  mirrored,
                  active,
                  copyStyle = ['font-family',
                               'font-size',
                               'font-weight',
                               'font-style',
                               'letter-spacing',
                               'line-height',
                               'text-transform',
                               'word-spacing',
                               'text-indent'];

              // exit if elastic already applied (or is the mirror element)
              if ($ta.data('elastic')) {
                  return;
              }

              // Opera returns max-height of -1 if not set
              maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

              // append mirror to the DOM
              if (mirror.parentNode !== document.body) {
                  angular.element(document.body).append(mirror);
              }

              // set resize and apply elastic
              $ta.css({
                  'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
              }).data('elastic', true);

              /*
               * methods
               */

              function initMirror() {
                  var mirrorStyle = mirrorInitStyle;

                  mirrored = ta;
                  // copy the essential styles from the textarea to the mirror
                  taStyle = getComputedStyle(ta);
                  angular.forEach(copyStyle, function (val) {
                      mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
                  });
                  mirror.setAttribute('style', mirrorStyle);
              }

              function adjust() {
                  var taHeight,
                      taComputedStyleWidth,
                      mirrorHeight,
                      width,
                      overflow;

                  if (mirrored !== ta) {
                      initMirror();
                  }

                  // active flag prevents actions in function from calling adjust again
                  if (!active) {
                      active = true;

                      mirror.value = ta.value + append; // optional whitespace to improve animation
                      mirror.style.overflowY = ta.style.overflowY;

                      taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

                      taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

                      // ensure getComputedStyle has returned a readable 'used value' pixel width
                      if (taComputedStyleWidth.substr(taComputedStyleWidth.length - 2, 2) === 'px') {
                          // update mirror width in case the textarea width has changed
                          width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
                          mirror.style.width = width + 'px';
                      }

                      mirrorHeight = mirror.scrollHeight;

                      if (mirrorHeight > maxHeight) {
                          mirrorHeight = maxHeight;
                          overflow = 'scroll';
                      } else if (mirrorHeight < minHeight) {
                          mirrorHeight = minHeight;
                      }
                      mirrorHeight += boxOuter.height;
                      ta.style.overflowY = overflow || 'hidden';

                      if (taHeight !== mirrorHeight) {
                          ta.style.height = mirrorHeight + 'px';
                          scope.$emit('elastic:resize', $ta);
                      }

                      scope.$emit('taResize', $ta); // listen to this in the UserMessagesCtrl

                      // small delay to prevent an infinite loop
                      $timeout(function () {
                          active = false;
                      }, 1);

                  }
              }

              function forceAdjust() {
                  active = false;
                  adjust();
              }

              /*
               * initialise
               */

              // listen
              if ('onpropertychange' in ta && 'oninput' in ta) {
                  // IE9
                  ta['oninput'] = ta.onkeyup = adjust;
              } else {
                  ta['oninput'] = adjust;
              }

              $win.bind('resize', forceAdjust);

              scope.$watch(function () {
                  return ngModel.$modelValue;
              }, function (newValue) {
                  forceAdjust();
              });

              scope.$on('elastic:adjust', function () {
                  initMirror();
                  forceAdjust();
              });

              $timeout(adjust);

              /*
               * destroy
               */

              scope.$on('$destroy', function () {
                  $mirror.remove();
                  $win.unbind('resize', forceAdjust);
              });
          }
      };
  }
]);





