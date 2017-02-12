angular.module('CARUSER.controllers.menu', [])
.controller("MenuController", function ($scope,

    $ionicPlatform,
   $ionicPopup,
    $ionicLoading, $http, $location, $state,
    $rootScope, SharedDataService,
    $localStorage, $sessionStorage) {


    $scope.Email;
    $scope.ConfirmPassword;
    $scope.agree;
    $scope.loading = false;
    $scope.User = $localStorage.User;

    

    $scope.logout = function () {
        
        SharedDataService.User = null;
        SharedDataService.UserDetails = null;
        SharedDataService.Friends = null;
        SharedDataService.InviteMembers = null;
        SharedDataService.Team = null;

        //SharedDataService.user = null;
        SharedDataService.Image = null;
        //$state.transitionTo('login', $state.$current.params, { reload: true });

        $state.go("login");

    }




});



