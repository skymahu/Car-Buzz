angular.module('CARUSER.controllers.Profile', [])
.controller("ProfileController", function ($scope, CONNECT, $ionicPlatform, $ionicPopup, $ionicLoading, $state, $http, $location, SharedDataService) {






    $scope.UserValue = SharedDataService.UserDetails;


    $scope.LoadProfile = function () {

        var atu = CONNECT.auth().currentUser.uid;
        debugger;

        if (SharedDataService.UserDetails == undefined || SharedDataService.UserDetails == '') {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            CONNECT.database().ref().child("users")
			.child(CONNECT.auth().currentUser.uid)
			.child('profile')
			.on('value', function (snapshot) {

			    var val = snapshot.val();
			    if (val != null) {
			        $scope.UserValue = SharedDataService.UserDetails = val;

			    } else {
			        $scope.UserValue = SharedDataService.UserDetails = new Object();
			    } $ionicLoading.hide();
			});
        }
    }


    $scope.profile = function (form) {
        if (form.$valid) {
            var d = SharedDataService.UserDetails;

            $state.go('app.profile1', {}, {
                // reload: true
            });
        }
    };


    $scope.profile1 = function (form) {
        if (form.$valid) {
            $state.go('app.profile2', {}, {
                // reload: true
            });
        }
    };


    $scope.profile2 = function (form) {
        if (form.$valid) {
            $state.go('app.profile3', {}, {
                // reload: true
            });
        }
    };



    $scope.profile3 = function (form) {
        if (form.$valid) {
            $state.go('app.profile4', {}, {
                // reload: true
            });
        }
    };


    $scope.profile4 = function (form) {
        debugger
        if (form.$valid) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            var data = SharedDataService.UserDetails;
            var UserDetail = $scope.UserValue;



            if (UserDetail.Image == undefined || UserDetail.Image == null) {
                UserDetail.Image = 'data:image/jpeg;base64,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';
            }
            var image = UserDetail.Image;
            var base64content = image.split(',')[1];
            CONNECT.storage().ref('users').child(CONNECT.auth().currentUser.uid + '.png')
            .putString(base64content, 'base64', { contentType: 'image/png' }).then(function (snapshot) {
                debugger;
                UserDetail.Image = snapshot.downloadURL;
                CONNECT.database().ref().child("users")
                .child(CONNECT.auth().currentUser.uid)
                .child('profile').set(UserDetail).then(function (e) {
                    $ionicPopup.alert({
                        title: 'Profile Details',
                        template: 'Saved Successfully.'
                    });
                    $state.go('app.home', {}, {
                        //reload: true
                    });
                });
            });
        }
    };

    $scope.fileNameChanged = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#image_upload_preview').attr('src', e.target.result);
                SharedDataService.UserDetails.Image = e.target.result;
                SharedDataService.User.profile.Image = e.target.result;
            }
            reader.readAsDataURL(input.files[0]);
        }
    }



});




