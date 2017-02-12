angular.module('CARUSER.controllers.Team', [])
    .controller("TeamController", function ($scope, $ionicPopup, $ionicHistory, $ionicLoading, $state, $http, $location, SharedDataService, $window, SocketService, $stateParams, $ionicFilterBar) {
        





        $scope.search = false;
        $scope.Team = Enumerable.From(SharedDataService.UserD.lstTeam)
            .Where(function (x) { return x.Id == $stateParams.teamid })
            .FirstOrDefault();
        $scope.showFilterBar = function () {
            var filterBarInstance = $ionicFilterBar.show({
                //cancelText: "<i class='ion-ios-close-outline'></i>",
                items: $scope.TeamList,
                update: function (filteredItems, filterText) {
                    $scope.TeamList = filteredItems;
                },
                filterProperties: 'TeamName'

            });
        };
        $scope.enterprivate = function (username) {
            
            var newusername;

            if (SharedDataService.UserD.lstFriend.length != 0) {
                newusername = (Enumerable.From(SharedDataService.UserD.lstFriend).Where(function (x) { return x.Id == username }).FirstOrDefault()).NewFriend.UserName
            } else {
                newusername = (Enumerable.From(SharedDataService.UserD.lstReverseFriend).Where(function (x) { return x.Id == username }).FirstOrDefault()).NewUser.UserName
            }
            var room = {
                'room_name': 'private_' + username
            };
            SocketService.emit('join:room', room);
            $state.go('app.privateroom', {
                user: username,
                username: newusername
            });
        }
        $scope.enterRoom = function (room_name) {
            var room = {
                'room_name': 'room_' + room_name
            };
            SocketService.emit('join:room', room);
            $state.go('app.room', {
                roomid: room_name
            });
        };

        //if ($location.path().indexOf('/team/viewteam/') > -1)
        //{
        //    $.ajax({
        //        url: SharedDataService.BaseUrl + "/api/Team/Getallmembers/" + $stateParams.teamid,
        //        type: 'GET',
        //        success: function (evt) {
        //            $scope.userlist = evt;
        //        }
        //    });

        //}



        $scope.inviteMember = function (form) {
            if (form.$valid) {
                
                var User = SharedDataService.UserD;
                var InviteMembers = new Object();
                InviteMembers.InviteeEmail = form.inviteemail.$modelValue;
                InviteMembers.InviteStatus = false;
                User.InviteeMembers.push(InviteMembers);
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });


                $.ajax({


                    url: SharedDataService.BaseUrl + '/api/Team/InviteMember/' + form.teamselect.$modelValue,
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(User),
                    success: function (data) {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Info',
                            template: 'Invitation Sent Succesfully'
                        });
                        SharedDataService.UserD = data;
                        SharedDataService.UserD.UserDetail.ZipCode = parseInt(SharedDataService.UserD.UserDetail.ZipCode);
                        SharedDataService.UserD.UserDetail.PhoneNumber = parseInt(SharedDataService.UserD.UserDetail.PhoneNumber);
                        var d = new Date(SharedDataService.UserD.UserDetail.Dob);
                        SharedDataService.UserD.UserDetail.Dob = d;

                        $state.reload();
                    },
                    error: function (evt) {

                    }

                });

            }
        }


        $scope.EditTeam = function (id) {
            $state.go('app.teamEdit', { teamid: id });
        }

        $scope.ViewTeam = function (id) {
            $state.go('app.teamView', { teamid: id });
        }

        $scope.TeamList = SharedDataService.UserD.lstTeam;
        
        $scope.FriendList = SharedDataService.UserD.lstFriend;
        $scope.FriendListReverse = SharedDataService.UserD.lstReverseFriend;
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





        $scope.Addteam = function (form) {
            



            if (form.$valid) {

                var teamlist = '';

                if ($scope.Team.Id == null || $scope.Team.Id == undefined) {

                    teamlist = Enumerable.From(SharedDataService.UserD.lstTeam)
                        .Where(function (x) { return x.TeamName.toLowerCase() == form.teamname.$modelValue.toLowerCase() })
                        .ToArray();
                } else {


                    teamlist = Enumerable.From(SharedDataService.UserD.lstTeam)
                        .Where(function (x) { return (x.TeamName.toLowerCase() == form.teamname.$modelValue.toLowerCase() && x.Id != $scope.Team.Id) })
                        .ToArray();
                }


                if (teamlist.length == 0) {

                    if ($scope.Team.Id == null || $scope.Team.Id == undefined) {
                        SharedDataService.UserD.lstTeam.push($scope.Team);
                    }


                    if (SharedDataService.UserD.lstTeam.length <= 2) {
                        $ionicLoading.show({
                            content: 'Loading',
                            animation: 'fade-in',
                            showBackdrop: true,
                            maxWidth: 200,
                            showDelay: 0
                        });


                        var u = SharedDataService.BaseUrl + '/api/Team/Submit/' + SharedDataService.UserD.Id;
                        $.ajax({
                            url: u,
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify($scope.Team),
                            success: function (evt) {
                                if (evt != null || evt != undefined) {
                                    SharedDataService.UserD = evt;
                                    SharedDataService.UserD.UserDetail.ZipCode = parseInt(SharedDataService.UserD.UserDetail.ZipCode);
                                    SharedDataService.UserD.UserDetail.PhoneNumber = parseInt(SharedDataService.UserD.UserDetail.PhoneNumber);
                                    var d = new Date(SharedDataService.UserD.UserDetail.Dob);
                                    SharedDataService.UserD.UserDetail.Dob = d;

                                    $ionicLoading.hide();
                                    //$scope.Team.Id = null;
                                    //$scope.Team.TeamName = null;
                                    //$scope.Team.TeamImage = null;
                                    //$scope.Team.TeamPurpose = null;
                                    //$scope.Team.TeamStatement = null;
                                    $state.transitionTo('app.team', $state.$current.params, { reload: true, cache: true });

                                } else {

                                    $ionicPopup.alert({
                                        title: '! Oopss...',
                                        template: 'Something Went Wrong, Please Try again'
                                    });
                                }
                            }
                        });
                    } else {


                        var confirmPopup = $ionicPopup.confirm({
                            title: 'Oopss...',
                            template: 'You can add more than 2 Teams , After Payment... Pay Now'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $state.go('app.payment', {}, {
                                    //reload: true
                                });
                            }
                        })

                        //$ionicPopup.alert({
                        //    title: '! Oopss...',
                        //    template: 'You can add more than 2 Teams , After Payment <a href="#/app/payment"> Pay Now</a>'
                        //});



                        SharedDataService.UserD.lstTeam.pop();
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

                    var Team = Enumerable.From(SharedDataService.UserD.lstTeam)
                                               .Where(function (x) { return x.Id == id })
                                               .FirstOrDefault();
                    $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        url: SharedDataService.BaseUrl + '/api/Team/Delete/' + SharedDataService.UserD.Id,
                        data: JSON.stringify(Team),
                        success: function (data) {
                            
                            $ionicLoading.hide();
                            SharedDataService.UserD = data;
                            SharedDataService.UserD.UserDetail.ZipCode = parseInt(SharedDataService.UserD.UserDetail.ZipCode);
                            SharedDataService.UserD.UserDetail.PhoneNumber = parseInt(SharedDataService.UserD.UserDetail.PhoneNumber);
                            var d = new Date(SharedDataService.UserD.UserDetail.Dob);
                            SharedDataService.UserD.UserDetail.Dob = d;

                            $state.transitionTo('app.team', $state.$current.params, { reload: true, cache: true });
                            //$state.go('team', {}, {
                            //    reload: true,
                            //    cache:false
                            //});
                            //
                            //$ionicPopup.alert({
                            //    title: '! Oopss...',
                            //    template: 'Team Deleted successfully'
                            //})
                        },
                        error: function (xhr) {

                            $ionicLoading.hide();

                            $ionicPopup.alert({
                                title: 'Error',
                                template: 'Something Went Wrong, Please Try Again'
                            });

                        }
                    });
                } else {

                }
            });




        }

        $scope.DeleteMem = function (DeletedUserId) {
            
            userid = SharedDataService.UserD.Id;
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
                    var Team = Enumerable.From(SharedDataService.UserD.lstTeam)
                                          .Where(function (x) { return x.Id == teamid })
                                          .FirstOrDefault();

                    var User = Enumerable.From(Team.lstUser).Where(function (x) { return x.Id != DeletedUserId }).ToArray();
                    Team.lstUser = null;
                    Team.lstUser = User;
                    $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        url: SharedDataService.BaseUrl + '/api/Team/DeleteMember/' + SharedDataService.UserD.Id,
                        data: JSON.stringify(Team),
                        success: function (data) {
                            $ionicLoading.hide();
                            SharedDataService.UserD = data;
                            SharedDataService.UserD.UserDetail.ZipCode = parseInt(SharedDataService.UserD.UserDetail.ZipCode);
                            SharedDataService.UserD.UserDetail.PhoneNumber = parseInt(SharedDataService.UserD.UserDetail.PhoneNumber);
                            var d = new Date(SharedDataService.UserD.UserDetail.Dob);
                            SharedDataService.UserD.UserDetail.Dob = d;

                            $state.reload();
                        }
                    })
                } else {

                }
            });
        }



        $scope.deleteNotice = function (notice) {
            var index = $scope.NoticeList.indexOf(notice);
            if (index > -1) {
                $scope.NoticeList.splice(index, 1);
                // ajax code









                alert("cancel here");
            }

        };


    });