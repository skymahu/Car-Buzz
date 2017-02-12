angular.module('CARUSER.controllers.chat', [])

.controller('ChatCtrl', function ($scope, $state, $stateParams, $ionicPopup, $timeout,
     SharedDataService) {

    
    $scope.data = SharedDataService.User;
    $scope.data.message = "";
    $scope.messages = Chat.getMessages();
    var typing = false;
    var lastTypingTime;
    var TYPING_TIMER_LENGTH = 250;

    $scope.chats = Chats.all();

    //var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
    
    //$scope.dataFire = $firebaseObject(ref);


    // Dont delete impr code 

    Socket.on('connect', function () {
       
        Socket.emit('add user', $scope.data.UserName);
        Chat.setUsername($scope.data.UserName);
    });

    Chat.scrollBottom();

    if ($stateParams.username) {
        $scope.data.message = "@" + $stateParams.username;
        document.getElementById("msg-input").focus();
    }

    var sendUpdateTyping = function () {
        if (!typing) {
            typing = true;
            Socket.emit('typing');
        }
        lastTypingTime = (new Date()).getTime();
        $timeout(function () {
            var typingTimer = (new Date()).getTime();
            var timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                Socket.emit('stop typing');
                typing = false;
            }
        }, TYPING_TIMER_LENGTH);
    };

    $scope.updateTyping = function () {
        sendUpdateTyping();
    };

    $scope.messageIsMine = function (username) {
        return $scope.data.username === username;
    };

    $scope.getBubbleClass = function (username) {
        var classname = 'from-them';
        if ($scope.messageIsMine(username)) {
            classname = 'from-me';
        }
        return classname;
    };

    $scope.sendMessage = function (msg) {
        Chat.sendMessage(msg);
        $scope.data.message = "";
    };

})

.controller('PeopleCtrl', function ($scope, Users) {
    $scope.data = Users.getUsers();
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope, Chat) {
    $scope.username = Chat.getUsername();
}, true);



angular.module('CARUSER.services', [])
