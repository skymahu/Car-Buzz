angular.module('CARUSER.controllers.Account', [])
.controller("AccountController", function ($scope,CONNECT,$firebaseAuth,$stateParams,

    $ionicPlatform,
     $ionicPopup,
    $ionicLoading, $http, $location, $state,
    $rootScope, SharedDataService,
    $localStorage, $sessionStorage, $ionicFilterBar) {

    $scope.NotificationCount = '';
    $scope.Email;
    $scope.ConfirmPassword;
    $scope.agree;
    $scope.loading = false;
    $scope.User = SharedDataService.User;
    $scope.check;
    $scope.NotificationCount = '';

    $scope.Purchase = new Object();
    $scope.Sale = new Object();
    $ionicLoading.hide();
    $scope.Cars = [];
    $scope.CarModel = [];
    $scope.Place = [];
    $scope.salecarsVarient = [];
    $scope.purchasecarsVarient = [];



    $scope.User = new Object();
	
    $scope.notification = function () {
        $state.go('app.notification', {}, {
            reload: true
        });
    }

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
   
    $scope.logout = function () {
                
		CONNECT.auth().signOut().then(function(evt){
		SharedDataService.User = '';
        SharedDataService.user = '';
        SharedDataService.Image = '';	
		$state.transitionTo('login', $state.$current.params, { reload: true });	
		});
        
    }


    $scope.NotificationListCount = function ()
    {
        $scope.Notifications = [];
        var a = CONNECT.auth().currentUser;
        var keys = [];
        var usernames = [];
        var teamnames = [];
        var i = 0; var j = 0;
        $scope.NotificationCount = j;
        //CONNECT.database().ref('invitemembers').orderByChild('InviteeEmail')
        //    .equalTo(a.email)
        //    .on('value', function (snap) {
        //        snap.forEach(function (da) {

        //            keys[i] = da.key;
        //            i++;

        //            debugger;
        //            var p = da.exists();
        //            var key = da.key;
        //            var s = da.A.m.ca.key;


        //            CONNECT.database().ref('invitemembers').child(key).on('value', function (snapshot) {
        //                debugger;
        //                var statuscheck = snapshot.val();
        //                if (!Boolean(statuscheck.InviteStatus)) {
        //                    debugger;
        //                    CONNECT.database().ref('teams').child(statuscheck.TeamId).on('value', function (p) {
        //                        debugger;
        //                        j = j + 1;
        //                        var teamdata = p.val();
        //                        $scope.NotificationCount = j;
        //                    });
        //                }
        //            });
        //        });       
        //    });

        if ($scope.Notifications.length != 0) {
            debugger;        
            $scope.NotificationCount = $scope.Notifications.length;

        }
    }

    $scope.LogIn = function (form) {

        if (form.$valid) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            var pp = form.email.$modelValue;
            var pwd = form.password.$modelValue;
            debugger;
            CONNECT.auth().signInWithEmailAndPassword(form.email.$modelValue, form.password.$modelValue)
                .then(function (authData) {


                //    if (authData.emailVerified) {
                        CONNECT.database().ref().child("users").child(authData.uid)
                        .on('value', function (snapshot) {
                            debugger;
                            var val = snapshot.val();
                            SharedDataService.User = snapshot.val();
                            $scope.User -= snapshot.val();
                          //  angular.copy($scope.User, SharedDataService.User);
                            $ionicLoading.hide();
                            $state.go('app.home', {}, {
                                reload: true
                            });

                        }); 
                                     
                }).catch(function (error) {
                    $ionicPopup.alert({
                        title: 'Invalid',
                        template: error.message
                    });
                    $ionicLoading.hide(); return false;
                });
        }
    }



    // Old code , not using

    $scope.signIn = function (form) {
        debugger;
        if (form.$valid) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            }); 
            var pwd = form.password.$modelValue;  
            var mob = form.MobileNo.$modelValue;         

            CONNECT.database().ref().child('users').once('value', function (snapshot) {
                debugger;
                var pp = snapshot.val();
                for(item in pp)
                {
                    var s = pp[item];
                    debugger;
                    if(s.MobileNo == mob && s.password == pwd)
                    {
                        $scope.User = pp[item];
                        $scope.User.uid = item;
                        angular.copy( $scope.User,  SharedDataService.User);
                        break;
                        debugger;
                    }
                }

                if ($scope.User == undefined || $scope.User == null)
                {
                    alert("User Not Authorized !");
                    return false;
                }
                $state.go('app.home', {}, { reload: true });
                debugger;
            }).catch(function (test) { debugger; alert(test); $ionicLoading.hide(); });            debugger;
            $ionicLoading.hide();
        }
    }
    //


    $scope.SaleFunction = function (form) {
        debugger;
        if (form.$valid) {
               $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            debugger;         
            $scope.Sale.Time = CONNECT.database.ServerValue.TIMESTAMP;
            $scope.Sale.Saleby = CONNECT.auth().currentUser.uid;
            CONNECT.database().ref().child("Sale").push($scope.Sale)
            
                   alert("Sale record save successfully!");
                   $state.go('app.home', {}, { reload: true });

                 
                    $ionicLoading.hide();             
        }
    }

    $scope.PurchaseFunction = function (form) {
        debugger;
        if (form.$valid) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            debugger;
            // pp = SharedDataService.User.uid;  
            $scope.Purchase.Purchaseby = CONNECT.auth().currentUser.uid;        
            $scope.Purchase.Time = CONNECT.database.ServerValue.TIMESTAMP;
       
           CONNECT.database().ref().child("Purchase").push($scope.Purchase)
          
            alert("Purchase record save successfully!");
            $state.go('app.home', {}, { reload: true });

            $ionicLoading.hide();
        }
    }


    $scope.Exchange = function(form)
    {
        debugger;
        if (form.$valid) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            debugger;
            pp = CONNECT.auth().currentUser.uid;

            CONNECT.database().ref().child("Exchange").child(pp).push({
                Modal: form.Modal.$modelValue,
                Vehiclemanufacturer: form.Vehiclemanufacturer.$modelValue,
                RegistrationNo: form.RegistrationNo.$modelValue,
                Variant: form.Variant.$modelValue,
                YOM: form.YOM.$modelValue,
                KMS: form.KMS.$modelValue,
                EXPValue: form.EXPValue.$modelValue,
                OtherDetail: form.OtherDetail.$modelValue,              
                Time: CONNECT.database.ServerValue.TIMESTAMP

             });
            alert("Exchange record save successfully!");
            $state.go('app.home', {}, { reload: true });

            $ionicLoading.hide();
        }
    }


  //  GetModel
    $scope.GetModel = function (check) {
        debugger;
        $scope.Place = [];
        $scope.CarModel = [];
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        if (check == "hello") {
            CONNECT.database().ref('carModels').child($scope.Purchase.Car).on('value', function (st) {
                st.forEach(function (item) {
                    var a = {};
                    a.Id = item.key;
                    a.val = item.val();
                    $scope.CarModel.push(a);
                });
            });
            CONNECT.database().ref('Place').on('value', function (st) {
                st.forEach(function (item) {
                    var a = {};
                    a.Id = item.key;
                    a.val = item.val();
                    $scope.Place.push(a);
                });
                $ionicLoading.hide();

            })

        }else {
        CONNECT.database().ref('carModels').child($scope.Sale.Car).on('value', function (st) {
            st.forEach(function (item) {
                var a = {};
                a.Id = item.key;
                a.val = item.val();
                $scope.CarModel.push(a);
            });            
        })
        }
        $ionicLoading.hide();  

    }



    $scope.GetCars = function (check) {
        debugger;
        $scope.Cars = [];
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
            CONNECT.database().ref('cars').on('value', function (st) {
                st.forEach(function (item) {
                    var a = {};
                    a.Id = item.key;
                    a.val = item.val();
                    $scope.Cars.push(a);
                });
                $ionicLoading.hide();

            })         
    }

    $scope.GetSaleCars = function () {      
        $scope.salecarsVarient = [];
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        debugger;
      

        CONNECT.database().ref('Sale').on('value', function (st) {
            st.forEach(function (item) {
                debugger;
                var a = {};
                a.Id = item.key;
                a.val = item.val();
                $scope.salecarsVarient.push(a);
            });
            debugger;
            var pp = $scope.salecarsVarient;
            $ionicLoading.hide();

        })
    }



    $scope.GetPurchaseCars = function () {
        $scope.purchasecarsVarient = [];

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        debugger;

        CONNECT.database().ref('Purchase').on('value', function (st) {
            st.forEach(function (item) {
                debugger;
                var a = {};
                a.Id = item.key;
                a.val = item.val();
                $scope.purchasecarsVarient.push(a);
            });
            debugger;
            var pp = $scope.purchasecarsVarient;
            $ionicLoading.hide();

        })
    }


    $scope.forgetpass = function (form) {
        
        if (form.$valid) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            
              CONNECT.auth().sendPasswordResetEmail(form.username.$modelValue)
			  .then(function(authdata){
			      $ionicPopup.alert({
			          title: 'Success',
			          template: 'Please Check the Email'
			      });
			    $ionicLoading.hide();
				  
			  }).catch(function(err){
				  	    $ionicLoading.hide();
				   $ionicPopup.alert({
                    title: 'Error !',
                    template: 'Please Enter Valid Email'
                });
			  });
			  
            }
        }
    





    $scope.Register = function (form) {
        debugger;
        if (form.$valid) {
            var User = {
                "UserName": "" + form.username.$modelValue + "",
                "EmailId": "" + form.email.$modelValue + "",
                "password": "" + CryptoJS.MD5(form.password.$modelValue) + ""
            };
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

          
            CONNECT.auth().createUserWithEmailAndPassword(form.email.$modelValue, form.password.$modelValue)
                .then(function (userData) {
                    
                alert("User created successfully!");
                CONNECT.database().ref().child("users").child(userData.uid).set({
                    password: form.password.$modelValue,
                    username: form.username.$modelValue,
                    Whatsappnumber: form.WAnumber.$modelValue,
                    MobileNo: form.MobileNo.$modelValue,
                    email: form.email.$modelValue                   
                });
              //  CONNECT.auth().currentUser.sendEmailVerification();

                $ionicLoading.hide();
               
            }).catch(function (error) {
                alert("Error: " + error);
                $ionicLoading.hide();
            })
        }
    }
});



