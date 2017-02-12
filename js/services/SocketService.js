(function(){

	angular.module('CARUSER')
	.service('SocketService', ['socketFactory', SocketService]);

	function SocketService(socketFactory){
		return socketFactory({
		    ioSocket: io.connect('http://104.154.28.73:7000')    //		 //  http://localhost:7000/ 	
		});
	}
})();