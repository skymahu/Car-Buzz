(function () {
    angular.module('CARUSER')
    .controller('RoomController', ['$scope', '$ionicPlatform', '$state',
           'moment', '$ionicScrollDelegate', 'CONNECT', 'SharedDataService', '$stateParams', '$cordovaFileTransfer', '$cordovaFile',
           '$cordovaSQLite', '$ionicLoading', RoomController]);

    function RoomController($scope, $ionicPlatform, $state, moment,
             $ionicScrollDelegate, CONNECT
           , SharedDataService, $stateParams,
           $cordovaFileTransfer, $cordovaFile,
            $cordovaSQLite, $ionicLoading) {


        var me = this;
        me.Image = $scope.userImage = SharedDataService.User.Image;
        me.BaseUrl = SharedDataService.BaseUrl;
        $scope.image = null;
        $scope.doneLoading = false;
        me.messages = [];
        $ionicScrollDelegate.scrollBottom();
        var current_user = SharedDataService.User.UserName;
        me.showloader = true;

        $scope.GetPrivateLocalChats = function () {
            me.chatuser = $stateParams.username;
            getPrivatemessages($stateParams.username);
        }


        //$scope.$apply(function () {
        //    $scope.messages = me.messages;
        //    me.messages = $scope.messages;

        //});


        $scope.GetGroupLocalChats = function () {
            debugger;
            me.current_room = Enumerable.From(SharedDataService.Team)
              .Where(function (x) {
                  return x.Id == $stateParams.roomid
              })
              .FirstOrDefault();
            $scope.TeamName = me.current_room.TeamName;
           // $scope.$apply();
            CONNECT.database().ref('chatmessages').child($stateParams.roomid)
                .on('value', function (snap) {
                    debugger;
                    me.showloader = false;
                    me.messages = [];
                    snap.forEach(function (data) {

                        CONNECT.database().ref('users').child(data.val().userid).on('value', function (d) {
                            debugger;
                            me.messages.push({
                                userid: data.val().userid,
                                user: d.val().username,
                                text: data.val().text,
                                time: data.val().time,
                                image: data.val().image
                            });
                            $ionicScrollDelegate.scrollBottom();


                        });
                    });
                 //   if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        debugger; $scope.$apply();
               //     }
                    $ionicScrollDelegate.scrollBottom();
                });

        }

        $scope.praveen = function (d) {
            debugger;
            var dst = '';
            CONNECT.database().ref('users').child(d).on('value', function (snap) {
                dst = snap.val().username;
                return dst;
            });



        }

        $scope.humanize = function (timestamp) {
            return moment(timestamp).fromNow();
        };


        $scope.getImageurl = function (userid) {
            return 'https://firebasestorage.googleapis.com/v0/b/CARUSER-19723.appspot.com/o/users%2F'+ userid + '.png?alt=media';
        }

        $scope.isNotCurrentUser = function (user) {
            debugger;
            if (CONNECT.auth().currentUser.uid != user) {
                return true;
            }
            return false;
        };

        $scope.fileNameChanged = function (input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.image = e.target.result;
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
      $scope.sendTextMessage = function () {
            debugger;
            var d = moment();
            var popp = $scope.image;
            if ($scope.image != undefined || $scope.image != null) {
                //   UserDetail.Image = 'data:image/jpeg;base64,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';
                var d = Date.now();

                var image = $scope.image;
                var base64content = image.split(',')[1];
                CONNECT.storage().ref('chatmessages').child($stateParams.roomid + '-' + d + '.png')
                .putString(base64content, 'base64', { contentType: 'image/png' }).then(function (snapshot) {
                    debugger;
                    var imageurl = snapshot.downloadURL;

                    if (me.message == undefined || me.message == '' || me.message == null) {
                          CONNECT.database().ref().child("chatmessages").child($stateParams.roomid).push({
                            userid: CONNECT.auth().currentUser.uid,
                            text: me.message,
                            time: CONNECT.database.ServerValue.TIMESTAMP,
                            image: imageurl
                        }).then(function () {
                            debugger;
                            $ionicScrollDelegate.scrollBottom();
                            me.message = '';
                            $scope.image = null;
                        });
                    }
                    else {
                        CONNECT.database().ref().child("chatmessages").child($stateParams.roomid).push({
                            userid: CONNECT.auth().currentUser.uid,
                            text: me.message,
                            time: CONNECT.database.ServerValue.TIMESTAMP,
                            image: imageurl
                        }).then(function () {
                            debugger;
                            $ionicScrollDelegate.scrollBottom();
                            me.message = '';
                            $scope.image = null;
                            $scope.$apply();
                        });
                    }
                });
            }
            else {
                CONNECT.database().ref().child("chatmessages").child($stateParams.roomid).push({
                    userid: CONNECT.auth().currentUser.uid,
                    text: me.message,
                    time: CONNECT.database.ServerValue.TIMESTAMP
                  //  image: $scope.image
                }).then(function () {
                    $ionicScrollDelegate.scrollBottom();
                    me.message = '';
                    $scope.image = null;
                    $scope.$apply();
                });
            }
        };



        $scope.social = function () {
            alert("working on model");
        };



        $scope.sendprivatemessage = function () {

            var msg =
                     {
                         'to_username': $stateParams.username,
                         'from_username': current_user,
                         'chattext': me.message,
                         'createdate': moment(),
                         'chatimage': $scope.image,
                         'room_id': 'private_' + $stateParams.user
                     };
            $ionicScrollDelegate.scrollBottom();
            me.message = '';
            //  SocketService.emit('privatemessage', msg)
            $scope.image = null;
        }

        $scope.leaveRoom = function () {
            var msg = {
                'user': current_user, 'room': me.current_room, 'time': moment()
            };

            $state.go('app.rooms');
        };






        $scope.openImagePopup = function (image) {
            var hostPath = image.src;
            var clientPath = fileTransferDir + 'test.jpg';
            var fileTransferOptions = {};
            try {
                $cordovaFileTransfer.download(hostPath, clientPath, fileTransferOptions, true).then(function () {
                    console.log("successfully saved to Folder");
                });
            } catch (e) {

            }
        }


        //$ionicPlatform.ready(function () {
        //    if (ionic.Platform.isAndroid()) {


        //        console.log('cordova.file.externalDataDirectory: ' + cordova.file.externalDataDirectory);


        //        myFsRootDirectory1 = 'file:///storage/emulated/0/'; // path for tablet
        //        myFsRootDirectory2 = 'file:///storage/sdcard0/'; // path for phone
        //        fileTransferDir = cordova.file.externalDataDirectory;


        //        if (fileTransferDir.indexOf(myFsRootDirectory1) === 0) {
        //            fileDir = fileTransferDir.replace(myFsRootDirectory1, '');
        //        }
        //        if (fileTransferDir.indexOf(myFsRootDirectory2) === 0) {
        //            fileDir = fileTransferDir.replace(myFsRootDirectory2, '');
        //        }
        //        console.log('Android FILETRANSFERDIR: ' + fileTransferDir);
        //        console.log('Android FILEDIR: ' + fileDir);
        //    }
        //    if (ionic.Platform.isIOS()) {
        //        console.log('cordova.file.documentsDirectory: ' + cordova.file.documentsDirectory);
        //        fileTransferDir = cordova.file.documentsDirectory;
        //        fileDir = '';
        //        console.log('IOS FILETRANSFERDIR: ' + fileTransferDir);
        //        console.log('IOS FILEDIR: ' + fileDir);
        //    }

        //    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {

        //    }
        //});


        //private chat portion

        function getPrivatemessages(username) {

            console.log(username);
            try {

                var pp = [$stateParams.roomid];
                $cordovaSQLite.execute(DATABASE, 'SELECT * FROM friend_conversation WHERE (from_username = "' + SharedDataService.User.UserName + '" and to_username = "' + username + '") OR (from_username = "' + username + '" and to_username = "' + SharedDataService.User.UserName + '") ORDER BY server_id', [$stateParams.roomid])
                       .then(function (data) {
                           //alert("complete data " + data.rows.length);
                           if (data.rows.length > 0) {
                               var serverid = 0;
                               console.log(data.rows.length + " : data ");
                               me.messages = [];

                               for (var jj = 0; jj < data.rows.length; jj++) {
                                   var msg = null;
                                   serverid = data.rows.item(jj).server_id;
                                   if (data.rows.item(jj).chatimage == "null") {
                                       msg = {
                                           'to_username': data.rows.item(jj).to_username,
                                           'from_username': data.rows.item(jj).from_username,
                                           'chattext': data.rows.item(jj).chattext,
                                           'createdate': data.rows.item(jj).timestamp,
                                           'server_id': data.rows.item(jj).server_id
                                       };
                                   } else {
                                       msg = {
                                           'to_username': data.rows.item(jj).to_username,
                                           'from_username': data.rows.item(jj).from_username,
                                           'chattext': data.rows.item(jj).chattext,
                                           'createdate': data.rows.item(jj).timestamp,
                                           'server_id': data.rows.item(jj).server_id,
                                           'chatimage': data.rows.item(jj).chatimage,
                                       };
                                   }
                                   me.messages.push(msg);

                                   $ionicScrollDelegate.scrollBottom();
                               }
                           }
                           console.log(data.rows.length);
                           var da = new Object;
                           da.to = $stateParams.user;
                           da.serverid = serverid;
                           da.from = SharedDataService.User.UserName;

                           SocketService.emit('privatechat', da).on('privateSuccess', function (data) {
                               SavePrivate(data);
                           });
                           //    ids.roomid = $stateParams.roomid;
                           //      ids.serverid = serverid;

                       });
            } catch (e) {

                console.log(e.message);
            }

        }

        function SavePrivate(msg) {
            console.log("Sever id" + msg.server_id);

            $ionicScrollDelegate.scrollBottom();
            me.showloader = false;
            $cordovaSQLite.execute(DATABASE, 'SELECT * from friend_conversation where server_id =  ' + msg.server_id, []).then(function (d) {
                debugger
                console.log("select length " + d.rows.length);
                if (d.rows.length == 0) {
                    try {
                        $cordovaSQLite.execute(DATABASE, 'INSERT INTO friend_conversation(from_username, to_username,timestamp,chattext,chatimage,server_id) VALUES ("' + msg.from_username + '","' + msg.to_username + '","' + msg.createdate + '","' + msg.chattext + '","' + msg.chatimage + '",' + msg.server_id + ')', [])
                                                 .then(function (data) {
                                                     console.log(data);
                                                     console.log(data.insertId);
                                                     getPrivatemessages(msg.to_username);
                                                 });
                    } catch (e) {
                        console.log(e.message);
                    }
                }
            });
        }

        /// select group messages
        function selectmessages() {

            $cordovaSQLite.execute(DATABASE, 'SELECT * FROM conversation WHERE team_id = ? ORDER BY server_id', [$stateParams.roomid])
                         .then(function (data) {

                             var serverid = 0;
                             console.log(data.rows.length + " : data ");
                             me.messages = [];
                             for (var i = 0; i < data.rows.length; i++) {
                                 var msg = null;
                                 serverid = data.rows.item(i).server_id;
                                 if (data.rows.item(i).image == "null") {

                                     msg = {
                                         'room': $stateParams.roomid,
                                         'user': data.rows.item(i).from_id,
                                         'text': data.rows.item(i).chat_text,
                                         'time': data.rows.item(i).timestamp,
                                         'server_id': data.rows.item(i).server_id

                                     };
                                 } else {
                                     msg =
                              {
                                  'room': $stateParams.roomid,
                                  'user': data.rows.item(i).from_id,
                                  'text': data.rows.item(i).chat_text,
                                  'time': data.rows.item(i).timestamp,
                                  'image': data.rows.item(i).image,
                                  'server_id': data.rows.item(i).server_id
                              };
                                 }
                                 me.messages.push(msg);
                                 me.showloader = false;
                                 $ionicScrollDelegate.scrollBottom();
                             }
                             var ids = new Object();
                             ids.roomid = $stateParams.roomid;
                             ids.serverid = serverid;
                             SocketService.emit('completechat', ids).on('messageSuccess', function (data) {

                                 Savemessage(data);
                             });

                         });
        }

        function Savemessage(msg) {
            $ionicScrollDelegate.scrollBottom();
            me.showloader = false;

            if (msg.length == 0) {
                if (me.messages.length == 0) {

                    me.messages = [];
                }


                return false;
            }


            if (me.messages == null) { me.showloader = false; me.messages = []; }

            for (var i = 0; i < msg.length; i++) {

                var dp = msg[i];
                var testchk = true;



                var datanew = Enumerable.From(me.messages)
                                          .Where(function (x) { return x.server_id == msg[i].server_id })
                                          .FirstOrDefault();



                if (datanew == null || datanew == undefined) {

                    me.messages.push(msg[i]);
                    $ionicScrollDelegate.scrollBottom();
                }

                $cordovaSQLite.execute(DATABASE,
                       'INSERT INTO conversation(from_id, to_id,timestamp,chat_text,image,team_id,server_id) VALUES ("' + msg[i].user + '","","' + msg[i].time + '","' + msg[i].text + '","' + msg[i].image + '","' + msg[i].room.roomid + '","' + msg[i].server_id + '")', [])
                             .then(function (data) {

                                 testchk = false;

                             });
            }
        }
    }





})();












//var selectquery = "SELECT * from conversation where server_id =  '" + msg[i].server_id + "'";
//$cordovaSQLite.execute(DATABASE, selectquery, []).then(function (res) {
//
//    var sddsdsds = msg[i];
//    var user = msg[i].user;

//    if (res.rows.length == 0) {
//        var user = msg[i].user;
//        var usertime = msg[i].time
//        var usertes = msg[i].text;

//        $cordovaSQLite.execute(DATABASE,
//        'INSERT INTO conversation(from_id, to_id,timestamp,chat_text,image,team_id,server_id) VALUES ("' + msg[i].user + '","","' + msg[i].time + '","' + msg[i].text + '","' + msg[i].image + '","' + msg[i].room_id + '","' + msg[i].server_id + '")', [])
//              .then(function (data) {
//
//                  testchk = false;
//              });
//
//    }
//});


//$cordovaSQLite.execute(DATABASE, 'SELECT * from conversation where server_id =  ' + msg[i].server_id, []).then(function (d) {
//
//    var sddsdsds = msg[i];
//    if (d.rows.length == 0) {
//        $cordovaSQLite.execute(DATABASE,
//            'INSERT INTO conversation(from_id, to_id,timestamp,chat_text,image,team_id,server_id) VALUES ("' + msg[i].user + '","","' + msg[i].time + '","' + msg[i].text + '","' + msg[i].image + '","' + msg[i].room_id + '","' + msg[i].server_id + '")', [])
//                  .then(function (data) {
//
//                      testchk = false;
//                  });
//    } else {
//        testchk = false;
//    }
//});
