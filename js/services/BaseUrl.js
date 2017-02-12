



app.factory('SharedDataService', function () {
    var User = {
        UserDetails: '',
        User: new Object(),
        Team: [],
        InviteMembers: '',
        Notifications: '',
        Count :'',
        Friends: '',
        BaseUrl: "http://104.154.28.73"  //  "http://localhost:1098" //
    };
    return User;
});
