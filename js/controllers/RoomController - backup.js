(function(){
	angular.module('CARUSER')
	.controller('RoomController', ['$scope', '$ionicPlatform', '$state', 'SocketService',
        'moment', '$ionicScrollDelegate', 'SharedDataService', '$stateParams', '$cordovaFileTransfer', '$cordovaFile', 'DATABASE',
        '$cordovaSQLite', RoomController]);
	
	function RoomController($scope, $ionicPlatform, $state, SocketService, moment, $ionicScrollDelegate
        , SharedDataService, $stateParams, $cordovaFileTransfer, $cordovaFile, DATABASE,$cordovaSQLite) {
	    
	   
		var me = this;
		$scope.image =null;
		$scope.doneLoading = false;
		me.messages = [];
		

	    try {
	        
	        alert("before select first");
	        selectmessages();

	    } catch (e) {
            alert(e.message)
	    }

		

		$ionicScrollDelegate.scrollBottom();
		$scope.humanize = function (timestamp) {
			return moment(timestamp).fromNow();
		};

		me.current_room = Enumerable.From(SharedDataService.UserD.lstTeam)
            .Where(function (x) { return x.Id == $stateParams.roomid })
            .FirstOrDefault();
		
		var current_user = SharedDataService.UserD.UserName;

		$scope.isNotCurrentUser = function (user)
		{
		 
			
			if(current_user != user){
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

		



		$scope.sendTextMessage = function(){
		   
		    var msg =
                {
				'room': me.current_room.Id,
				'user': current_user,
				'text': me.message,
				'time': moment(),
                'image' :$scope.image
			};

			
		   // Savemessage(msg);


			me.messages.push(msg);
			$ionicScrollDelegate.scrollBottom();

			me.message = '';
			
			SocketService.emit('send:message', msg);
			$scope.image = null;
		};


		$scope.leaveRoom = function(){
	
			var msg = {
				'user': current_user,
				'room': me.current_room,
				'time': moment()
			};

			SocketService.emit('leave:room', msg);
			$state.go('app.rooms');

		};

		SocketService.on('message', function (msg) {
		    me.messages.push(msg);
			$ionicScrollDelegate.scrollBottom();
		});


		$scope.openImagePopup = function (image)
		{
		    var hostPath = image.src;
		    var clientPath = fileTransferDir + 'test.jpg';
		    var fileTransferOptions = {};
		    try {
		        $cordovaFileTransfer.download(hostPath, clientPath, fileTransferOptions, true).then(function () {
		            alert("successfully saved to Folder");
		        });
		    } catch (e) {
		        alert(e.message);
		    }
		   
		}




		$ionicPlatform.ready(function () {
		    if (ionic.Platform.isAndroid()) {
		       

		        console.log('cordova.file.externalDataDirectory: ' + cordova.file.externalDataDirectory);
		       

		        myFsRootDirectory1 = 'file:///storage/emulated/0/'; // path for tablet
		        myFsRootDirectory2 = 'file:///storage/sdcard0/'; // path for phone
		        fileTransferDir = cordova.file.externalDataDirectory;
		       

		        if (fileTransferDir.indexOf(myFsRootDirectory1) === 0) {
		            fileDir = fileTransferDir.replace(myFsRootDirectory1, '');
		        }
		        if (fileTransferDir.indexOf(myFsRootDirectory2) === 0) {
		            fileDir = fileTransferDir.replace(myFsRootDirectory2, '');
		        }
		        console.log('Android FILETRANSFERDIR: ' + fileTransferDir);
		        console.log('Android FILEDIR: ' + fileDir);
		    }
		    if (ionic.Platform.isIOS()) {
		        console.log('cordova.file.documentsDirectory: ' + cordova.file.documentsDirectory);
		        fileTransferDir = cordova.file.documentsDirectory;
		        fileDir = '';
		        console.log('IOS FILETRANSFERDIR: ' + fileTransferDir);
		        console.log('IOS FILEDIR: ' + fileDir);
		    }

		    if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
		  
		    }
		});


		function ClearDirectory() {
		    console.log('ClearDirectory');
		    
		    
		    $cordovaFile.listDir(fileDir + 'test').then(function (entries) {
		        console.log('listDir: ', entries);
		    }, function (err) {
		        console.error('listDir error: ', err);
		    });

		    $cordovaFile.removeRecursively(fileDir + 'test')
            .then(function () {
                console.log(trinlDir + ' recursively removed');
            },
            function (err) {
                console.log(fileDir + ' error: ', err);
            });
		}

		function selectmessages() {

		    $cordovaSQLite.execute(DATABASE, 'SELECT * FROM conversation WHERE team_id = ?', [$stateParams.roomid])
                   .then(function (data) {
                       

                       for (var i = 0; i < data.rows.length; i++) {
                           var msg = null;
                           if (data.rows.item(i).image == "null") {
                               msg = {
                                   'room': $stateParams.roomid,
                                   'user': data.rows.item(i).from_id,
                                   'text': data.rows.item(i).chat_text,
                                   'time': data.rows.item(i).timestamp
                               };
                           } else {
                               msg =
                        {
                            'room': $stateParams.roomid,
                            'user': data.rows.item(i).from_id,
                            'text': data.rows.item(i).chat_text,
                            'time': data.rows.item(i).timestamp,
                            'image': data.rows.item(i).image
                        };
                           }
                           me.messages.push(msg);
                           $ionicScrollDelegate.scrollBottom();
                       }

                       SocketService.emit('completechat', $stateParams.roomid)
		                .on('messageSuccess', function (data) {
		                    Savemessage(data);
		                });
                   });
		}


		function Savemessage(msg)
		{
		    
		    $cordovaSQLite.execute(DATABASE, 'INSERT INTO conversation(from_id, to_id,timestamp,chat_text,image,team_id) VALUES ("' + SharedDataService.UserD.UserName + '","","' + msg.time + '","' + msg.text + '","' + msg.image + '","' + msg.room +  '")', [])
          .then(function (data) {

          });
		}

	}

})();