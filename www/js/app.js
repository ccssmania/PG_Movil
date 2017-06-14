// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
example=angular.module('starter', ['ionic','ngCordova','ui.router','starter.services'])
example.constant('$ionicLoadingConfig', {
  template: 'Loading...'
});
example.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});



example.config(function($stateProvider,$urlRouterProvider){
  console.log("privider");
  $stateProvider
  .state('login',{
    url: '/login',
    templateUrl: 'templates/login.html',
    controller : 'AppCtrl'

  })
  .state('registro',{
    url: '/registro',
    templateUrl: 'templates/registro.html',
    controller: 'RegistroCtrl'
  })
  .state('camera',{
    url: '/camera',
    templateUrl: 'templates/camera.html',
    controller : 'ExampleController'
  })
  .state('bienvenida',{
    url: '/bienvenida',
    templateUrl: 'templates/bienvenida.html',
    controller : 'BienvenidaController'
  })
  .state('home-avocado',{
    url: '/home-avocado',
    templateUrl: 'templates/home.html',
    controller : 'HomeController'
  });
  $urlRouterProvider.otherwise('/login');
});

example.controller('BienvenidaController', function($scope,$state){
  $scope.cam= function(){
    $state.go('camera');
  };
  $scope.info = function(){
    $state.go('home-avocado');
  };
});
example.controller('HomeController', function($scope,$state){
  $scope.cam = function(){
    $state.go('camera');
  };
});

example.controller('AppCtrl', function($scope, $http,$state) {
    $scope.data = {};
    $scope.toRegister = function(){
      $state.go('registro');
    };
    $scope.login = function(){
      console.log("hola", $scope.data.password, " username " , $scope.data.username);
        var link = 'https://avocadosutp.herokuapp.com/sessions/movil';

        $http.post(link, {email : $scope.data.username, password: $scope.data.password }).then(function (res){
            $scope.response = res.data.message;

            console.log(res.data);
            if(res.data.message == "loggedIn"){
              console.log("hola");
              $state.go('bienvenida');
            }
        });
    };

});
example.controller('RegistroCtrl', function($scope, $http,$state) {
    $scope.data = {};
    $scope.toLogin = function(){
      $state.go('login');
    };
    $scope.registro = function(){
      console.log("hola", $scope.data);
        var link = 'https://avocadosutp.herokuapp.com/users/movil';

        $http.post(link, {email : $scope.data.email, password: $scope.data.password, 
          password_confirmation: $scope.data.password_confirmation,
          username: $scope.data.username
        }).then(function (res){
            $scope.response = res.data.message;
            console.log(res.data.message);
            if(res.data.message == "login"){
              console.log("hola");
              $state.go('camera');
            }
        });
    };

});
example.controller("ExampleController", function($scope, $cordovaFileTransfer, Camara, $ionicLoading, $state) {
  var dir;
  $scope.tomaFoto = function(){
    var options = {
      quality: 100,
      encodingType: Camera.EncodingType.JPEG
    }
    Camara.tomaFoto(options).then(function(imageURI){
      $scope.lastPhoto = imageURI;
      dir = imageURI;
      console.log(imageURI);
    }, function(err){
      console.log(err);
    }, {
      quality: 100,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: false
    });
  };
  $scope.upload = function() {
    var options = {
      fileKey: "movil",
      fileName: "image.png",
      chunkedMode: false,
      mimeType: "image/png"
    };
    $cordovaFileTransfer.upload("https://avocadosutp.herokuapp.com/app/imagenes/movil", dir, options).then(function(result) {
      console.log("Code = " + result.responseCode);
      console.log("Response = " + result.response);
      console.log("Sent = " + result.bytesSent);
      $ionicLoading.hide();
      //fileUrl = "http://192.168.100.8:8080/" + result.response;
      //console.log(fileUrl);
      $scope.response = result.response;
      
        
    }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
    }, function (progress) {
      $ionicLoading.show().then(function(){
       console.log("The loading indicator is now displayed");
    });
            // constant progress updates
          });

    // DOWNLOAD FILE

  

  }

});