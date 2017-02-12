angular.module('CARUSER.controllers.Notification', [])
.controller("NotificationController", function ($scope, $ionicPlatform, CONNECT, $ionicPopup, $ionicLoading, $state, $http, $location, SharedDataService) {


    if (SharedDataService.Count == undefined || SharedDataService.Count == '') {
        SharedDataService.Count = 0;
    }


    $scope.Notifications = [];
    $scope.LoadNotifications = function () {

        $scope.Notifications = [];
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        debugger;
        var a = CONNECT.auth().currentUser;
        var keys = [];
        var usernames = [];
        var teamnames = [];
        var i = 0;
        CONNECT.database().ref('invitemembers').orderByChild('InviteeEmail')
            .equalTo(a.email)
            .on('value', function (snap) {
                snap.forEach(function (da) {

                    keys[i] = da.key;
                    i++;
                                
                    debugger;
                    var p = da.exists();
                    var key = da.key;
                    var s = da.A.m.ca.key;

                    
                    CONNECT.database().ref('invitemembers').child(key).on('value', function (snapshot) {
                        debugger;
                        var statuscheck = snapshot.val();
                        if (!Boolean(statuscheck.InviteStatus)) {
                            debugger;
                            CONNECT.database().ref('teams').child(statuscheck.TeamId).on('value', function (p) {
                                debugger;
                                var teamdata = p.val();
                                CONNECT.database().ref('users').child(statuscheck.SentBy).on('value', function (q) {
                                    debugger;
                                    $scope.Notifications.push({
                                        Id:key,
                                        Name: q.val().username,
                                        Text: q.val().username + " invites you to join the Team " + p.val().TeamName,
                                        TeamId: statuscheck.TeamId,
                                        SentBy: statuscheck.SentBy
                                    });
                                    $ionicLoading.hide();
                                    debugger;
                                });
                            });
                        }
                    });
                });
            });

        if ($scope.Notifications.length == 0)
        {
            $ionicLoading.hide();
        }

    }


    $scope.Accept = function (teamid, sentby, Id) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });


        CONNECT.database().ref('teammembers').push({
            teamid: teamid,
            userid : CONNECT.auth().currentUser.uid
        });


        CONNECT.database().ref('invitemembers').child(Id).once('value', function (snapshot) {

            var val = snapshot.val();
            val.InviteStatus = true;
            CONNECT.database().ref('invitemembers').child(Id).update(val);
            $ionicPopup.alert({
                title: 'Success',
                template: 'Now You Connected with team'
            });
            $ionicLoading.hide();
            $state.go('app.team', {}, {
                reload: true
            });
        });
    }


    $scope.No = function (teamid, sentby, notifyid) {
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });


        CONNECT.database().ref('invitemembers').child(Id).once('value', function (snapshot) {

            var val = snapshot.val();
            val.InviteStatus = 'reject';
            CONNECT.database().ref('invitemembers').child(Id).update(val);
            $ionicLoading.hide();
            $state.go('app.home', {}, {
                reload: true
            });
        });

    }

});
