angular.module('CARUSER.controllers.Team', [])
    .controller("TeamController", function (CONNECT, $scope, $ionicPopup, $ionicHistory,
        $ionicLoading, $state, $http, $location, SharedDataService, $window, $stateParams,
        $ionicFilterBar) {

        $scope.GetMembers = function () {
            $scope.Team = Enumerable.From(SharedDataService.Team)
                   .Where(function (x) { return x.Id == $stateParams.teamid })
                   .FirstOrDefault();
        }
        $scope.inviteemail = new Object();
        $scope.TeamList = SharedDataService.Team;
        $scope.Team = new Object();
        $scope.Friends = new Object();

        $scope.LoadTeams = function () {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            $scope.TeamList = [];
            var a = CONNECT.auth().currentUser;

            CONNECT.database().ref('teammembers').orderByChild('userid')
           .equalTo(a.uid).on('value', function (snapshot) {
               snapshot.forEach(function (da) {
                   debugger;
                   var te = da.val().teamid;

                   CONNECT.database().ref('teams').child(da.val().teamid)
                       .on('value', function (das) {
                           debugger;
                           var key = da.key;

                           //var testteam = Enumerable.From($scope.TeamList)
                           //              .Where(function (x) { return x.Id == te })
                           //              .FirstOrDefault();
                           //var index = $scope.TeamList.indexOf(testteam);
                           //$scope.TeamList.splice(index, 1);

                           if (das.val().TeamImage != undefined || das.val().TeamImage != null) {

                               $scope.TeamList.push({
                                   Id: te,
                                   TeamName: das.val().TeamName,
                                   TeamPurpose: das.val().TeamPurpose,
                                   TeamStatement: das.val().TeamStatement,
                                   TeamImage: das.val().TeamImage
                               });
                           } else {
                               $scope.TeamList.push({
                                   Id: te,
                                   TeamName: das.val().TeamName,
                                   TeamPurpose: das.val().TeamPurpose,
                                   TeamStatement: das.val().TeamStatement,
                                 
                               });
                           }
                           SharedDataService.Team = $scope.TeamList;
                           //  teamcount = $scope.TeamList.length;
                           $scope.Team = SharedDataService.Team;
                           $scope.$apply();
                       });
               });

               $ionicLoading.hide();
           });

            CONNECT.database().ref('teams').orderByChild('CreatedBy').equalTo(a.uid)
                .on('value', function (snapshot) {

                    debugger;
                    snapshot.forEach(function (da) {
                        debugger;
                        var key = da.key;
                        //var testteam = Enumerable.From($scope.TeamList)
                        //                .Where(function (x) { return x.Id == da.key })
                        //                .FirstOrDefault();
                        //var index = $scope.TeamList.indexOf(testteam);
                        //$scope.TeamList.splice(index, 1);
                        $scope.TeamList.push({
                            Id: da.key,
                            TeamName: da.val().TeamName,
                            TeamPurpose: da.val().TeamPurpose,
                            TeamImage: da.val().TeamImage,
                            TeamStatement: da.val().TeamStatement
                        });
                        SharedDataService.Team = $scope.TeamList;
                        $scope.Team = SharedDataService.Team;
                        //$scope.$apply();
                    });
                    $ionicLoading.hide();
                });


        }

        $scope.GetTeamAndFriends = function () {
            //$ionicLoading.show({
            //    content: 'Loading',
            //    animation: 'fade-in',
            //    showBackdrop: true,
            //    maxWidth: 200,
            //    showDelay: 0
            //});
            debugger;
            if (SharedDataService.Team == undefined || SharedDataService.Team == "") {
                debugger;
                $scope.LoadTeams();
            }
            else {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                //    $ionicLoading.hide();
                $scope.Team = SharedDataService.Team;
                $ionicLoading.hide();
            }
        }


        $scope.search = false;
        $scope.RedirectEditTeam = function (id) {

            $state.go('app.teamEdit', { teamid: id });
        }
        $scope.EditTeam = function () {

            $scope.Team = Enumerable.From(SharedDataService.Team)
                .Where(function (x) { return x.Id == $stateParams.teamid })
                .FirstOrDefault();
        }

        $scope.ViewTeam = function () {
            debugger;
            $scope.Team = Enumerable.From(SharedDataService.Team)
                  .Where(function (x) { return x.Id == $stateParams.teamid })
                  .FirstOrDefault();

            if ($scope.Team.TeamImage == undefined || $scope.Team.TeamImage == null) {
                $scope.Team.TeamImage = './images/download.jpg';
            }

        }

        $scope.fileNameChanged = function (input) {


            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {

                    $('#TeamImage').show();
                    $('#TeamImage').attr('src', e.target.result);
                    $scope.Team.TeamImage = e.target.result;
                    $('#TeamImage').attr('width', '100px');
                    $('#TeamImage').attr('height', '100px');

                }
                reader.readAsDataURL(input.files[0]);
            }
        }
        $scope.enterRoom = function (roomid) {
            debugger;
            $state.go('app.room', {
                roomid: roomid
            });
        };
        $scope.showFilterBar = function () {
            var filterBarInstance = $ionicFilterBar.show({
                items: $scope.TeamList,
                update: function (filteredItems, filterText) {
                    $scope.TeamList = filteredItems;
                },
                filterProperties: 'TeamName'
            });
        };
        $scope.enterprivate = function (friendid) {

            var newusername;

            if (SharedDataService.Friends.length != 0) {
                newusername = (Enumerable.From(SharedDataService.Friends).Where(function (x) { return x.Id == friendid }).FirstOrDefault()).username

                var room = {
                    'room_name': 'private_' + friendid
                };
                SocketService.emit('join:room', room);
                $state.go('app.privateroom', {
                    user: friendid,
                    username: newusername
                });

            }
        }
        $scope.inviteMember = function (form) {
            if (form.$valid) {

                var s = CONNECT.auth().currentUser;

                if (CONNECT.auth().currentUser.email == form.inviteemail.$modelValue) {
                    $ionicPopup.alert({
                        title: 'Alert',
                        template: 'You cant invite yourself'
                    });
                    return false;
                }

                $scope.inviteemail = {};
                var InviteMembers = new Object();
                InviteMembers.InviteeEmail = form.inviteemail.$modelValue;
                InviteMembers.InviteStatus = false;
                InviteMembers.TeamId = form.teamselect.$modelValue;
                InviteMembers.SentBy = CONNECT.auth().currentUser.uid;
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                var isername = '';
                debugger;
                CONNECT.database().ref('users').child(CONNECT.auth().currentUser.uid).on('value', function (da) {
                    isername = da.val().username;

                    CONNECT.database().ref('teams').child(form.teamselect.$modelValue).on('value', function (snap) {

                        CONNECT.database().ref().child('invitemembers')
                                      .push(InviteMembers).then(function (d) {
                                          debugger;
                                          $.ajax({
                                              url: "http://elumba.com/CARUSERinvitemail",
                                              data: {
                                                  mail: InviteMembers.InviteeEmail,
                                                  sender: da.val().username,
                                                  teamname: snap.val().TeamName
                                              },
                                              success: function (data) {
                                              }

                                          });

                                          $ionicLoading.hide();
                                          $ionicPopup.alert({
                                              title: 'Info',
                                              template: 'Invitation Sent Successfully'
                                          });
                                          $scope.inviteemail.Email = '';
                                          form.inviteemail.$modelValue = null;
                                          $state.reload();
                                      });

                    });



                });
            }
        }
        $scope.Addteam = function (form) {
            if (form.$valid) {
                var teamlist = '';
                if ($scope.Team.Id == null || $scope.Team.Id == undefined) {
                    teamlist = Enumerable.From(SharedDataService.Team)
                        .Where(function (x) { return x.TeamName.toLowerCase() == form.teamname.$modelValue.toLowerCase() })
                        .ToArray();
                } else {
                    teamlist = Enumerable.From(SharedDataService.Team)
                        .Where(function (x) { return (x.TeamName.toLowerCase() == form.teamname.$modelValue.toLowerCase() && x.Id != $scope.Team.Id) })
                        .ToArray();
                }
                if (teamlist.length == 0) {
                    if ($scope.Team.Id == null || $scope.Team.Id == undefined) {
                        debugger;
                        if (SharedDataService.Team == undefined || SharedDataService.Team == '') {
                            SharedDataService.Team = [];
                            SharedDataService.Team.push($scope.Team);
                        } else {
                            SharedDataService.Team.push($scope.Team);
                        }
                    }

                    if (SharedDataService.Team.length <= 2) {
                        $ionicLoading.show({
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: 0
                        }); debugger;
                        if ($scope.Team.Id == null || $scope.Team.Id == undefined) {
                            if ($scope.Team.TeamImage != undefined || $scope.Team.TeamImage != null) {
                                var image = $scope.Team.TeamImage;
                                var base64content = image.split(',')[1];
                                CONNECT.storage().ref('teams').child(CONNECT.auth().currentUser.uid+"-"+ $scope.Team.TeamName + '.png')
                               .putString(base64content, 'base64', { contentType: 'image/png' }).then(function (snapshot) {
                                   $scope.Team.TeamImage = snapshot.downloadURL;

                                   $scope.Team.CreatedBy = CONNECT.auth().currentUser.uid;
                                   CONNECT.database().ref().child('teams')
                                   .push($scope.Team);
                                   $state.go('app.team', {}, { reload: true });
                               });
                            }
                            else {
                                $scope.Team.CreatedBy = CONNECT.auth().currentUser.uid;
                                CONNECT.database().ref().child('teams')
                                .push($scope.Team);
                                $state.go('app.team', {}, { reload: true });
                            }
                        } else {                
                            
                            $scope.Team1 = new Object();
                            $scope.Team1.TeamName = $scope.Team.TeamName;
                            $scope.Team1.CreatedBy = CONNECT.auth().currentUser.uid;
                            $scope.Team1.TeamStatement = $scope.Team.TeamStatement;
                            $scope.Team1.TeamPurpose = $scope.Team.TeamPurpose;

                            if ($scope.Team.TeamImage != undefined || $scope.Team.TeamImage != null) {
                                var image = $scope.Team.TeamImage;
                                var base64content = image.split(',')[1];
                                CONNECT.storage().ref('teams').child(CONNECT.auth().currentUser.uid + '-' + $scope.Team.TeamName + '.png')
                                .putString(base64content, 'base64', { contentType: 'image/png' }).then(function (snapshot) {
                                    debugger;

                                    $scope.Team1.TeamImage = $scope.Team.TeamImage = snapshot.downloadURL;  //
                                    CONNECT.database().ref().child('teams').child($scope.Team.Id)
                                    .update($scope.Team1).then(function () {
                                        SharedDataService.Team = [];
                                        $scope.$apply();
                                        $state.go('app.team', {}, { reload: true });
                                    });
                                  
                                });
                            } else {
                                CONNECT.database().ref().child('teams').child($scope.Team.Id)
                                .update($scope.Team1).then(function (sa) {
                                    SharedDataService.Team = [];
                                    $scope.$apply();
                                    $state.go('app.team', {}, { reload: true });

                                });                               
                            }                            
                        }
                      
                    } else {

                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Oopss...',
                            template: 'You can add more than 2 Teams , After Payment... Pay Now'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $state.go('app.payment', {}, {
                                });
                            }
                        })
                        SharedDataService.Team.pop();
                    }
                } else {
                    $ionicPopup.alert({
                        title: '! Oopss...',
                        template: 'Team Name Already Exists'
                    });
                }
            }
        }

        $scope.DeleteTeam = function (id) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete',
                template: 'Are you sure you want to Delete?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $ionicHistory.clearCache()
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });

                    var Team = Enumerable.From(SharedDataService.Team)
                                               .Where(function (x) { return x.Id == id })
                                               .FirstOrDefault();

                    CONNECT.database().ref().child("teams").child(Team.Id)
					.remove(function (snap) {

					    var index = SharedDataService.Team.indexOf(Team);
					    SharedDataService.Team.splice(index, 1);

					    CONNECT.database().ref('teammembers').orderByChild('teamid').on('value', function (snapshot) {
					        snapshot.forEach(function (da) {
					            CONNECT.database().ref('teammembers').child(da.key).remove();
					        });
					    });


					    CONNECT.database.ref('invitemembers').orderByChild('TeamId')
                           .equalTo(Team.Id).on('value', function (s) {
                               s.forEach(function (da) {
                                   CONNECT.database().ref('invitemembers').child(da.key).remove();
                               });
                           });




					    $state.transitionTo('app.team', $state.$current.params, { reload: true, cache: true });

					});

                } else {

                }
            });
        }
        /*Remaining .ea*/
        $scope.DeleteMem = function (DeletedUserId) {

            userid = SharedDataService.User.Id;
            teamid = $stateParams.teamid;
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete',
                template: 'Are you sure you want to Delete?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $ionicHistory.clearCache()
                    $ionicLoading.show({
                        content: 'Loading',
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    var Team = Enumerable.From(SharedDataService.User.Team)
                                          .Where(function (x) { return x.Id == teamid })
                                          .FirstOrDefault();
                    var User = Enumerable.From(Team.lstUser).Where(function (x) { return x.Id != DeletedUserId }).ToArray();
                    Team.lstUser = null;
                    Team.lstUser = User;
                    $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        url: SharedDataService.BaseUrl + '/api/Team/DeleteMember/' + SharedDataService.User.Id,
                        data: JSON.stringify(Team),
                        success: function (data) {
                            $ionicLoading.hide();
                            $state.reload();
                        }
                    }).error(function (XMLHttpRequest) {

                        //$("#signin").html('LOGIN');
                        $ionicLoading.hide();
                        if (XMLHttpRequest == null) {
                            $ionicPopup.alert({
                                title: 'No Network',
                                template: 'Error In Connection'
                            });
                        }
                    });
                } else {
                }
            });
        }
        $scope.deleteNotice = function (notice) {
            var index = $scope.NoticeList.indexOf(notice);
            if (index > -1) {
                $scope.NoticeList.splice(index, 1);
                alert("cancel here");
            }
        };

    });