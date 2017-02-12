var db = null;

app.factory('DATABASE', function ($ionicPlatform, $cordovaSQLite, deviceReady, $ionicPlatform) {
    $ionicPlatform.ready(function () {
        deviceReady(function () {
            $ionicPlatform.ready(function () {
                if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                    
                    db = $cordovaSQLite.openDB({ name: 'LSPTestDB.db', location: 0 });   // LSPTest  old DB
                } else if (ionic.Platform.isWebView) {
                    db = window.openDatabase("HelloDB.db", "1.0", "My app", -1);
                }
                $cordovaSQLite.execute(db, 'CREATE  TABLE IF NOT EXISTS "main"."conversation" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT  NOT NULL  UNIQUE , "from_id" VARCHAR, "to_id" VARCHAR, "chat_text" TEXT, "image" TEXT, "team_id" VARCHAR DEFAULT (null), "timestamp" VARCHAR, "server_id" INTEGER NOT NULL UNIQUE )');
                $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS "main"."friend_conversation" ("id" INTEGER PRIMARY KEY  AUTOINCREMENT NOT NULL UNIQUE ,"from_username" VARCHAR DEFAULT (null) ,"to_username" VARCHAR DEFAULT (null) ,"chattext" VARCHAR DEFAULT (null) ,"timestamp" VARCHAR DEFAULT (null) , "chatimage" VARCHAR, "server_id" INTEGER NOT NULL UNIQUE)');
            });
        });
    });
    return db
});