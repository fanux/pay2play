angular.module('p2p.controllers',[])

.controller('ClassCtrl', function($scope, Account, $ionicSideMenuDelegate, Class, $stateParams){
    console.log('classctrl load');
    $scope.resetClasses = function(){
        $scope.classes = Class.query(0, 1);
        console.log('toggle classes:',$scope.classes);
    };

    $scope.loginJudge = function(){
        Account.login();
    };

    $scope.classes = Class.query(0, 1);
    $scope.getChildrenClasses = function(classId){
        var classes = Class.query(classId, 1);
        console.log('children classes:', classes);
        if (classes.length == 0){
            $ionicSideMenuDelegate.toggleLeft();
        } else {
            $scope.classes = classes;
        }
    };
})

.controller('RoomsCtrl',function($scope, Contacts, Account, $ionicModal,  $ionicSideMenuDelegate, Room, $stateParams){
    $scope.toggleClasses = function(){
        $ionicSideMenuDelegate.toggleLeft();
    };

    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady() {
        console.log('device ready');
        navigator.contactsPhoneNumbers.list(function(contacts){
            Contacts.save(contacts);
            //alert(JSON.stringify(contacts));
        },function(error){
            alert('contact error:'+error);
        });

        window.plugins.sim.getSimInfo(function(simInfo){
            //alert('SIM info:'+JSON.stringify(simInfo));
        },function(error){
            alert('contact error:'+error);
        });
    }

    $scope.barcodeScan = function() {
        cordova.plugins.barcodeScanner.scan(function(result){
            alert(result.text+'\n'+result.format+'\n'+result.cancelled);
        },function(error){
            alert("scanning failed:"+error);
        });
    };
   
    $scope.rooms = Room.query($stateParams.classId);
    console.log('class id:',$stateParams.classId);
    $scope.loginJudge = function(){
        Account.login();
    };

    //new room modal
    $ionicModal.fromTemplateUrl('add-new-room.html',{
        scope:$scope,
        animation:'slide-in-up'
    }).then(function(modal){
        $scope.modal = modal;
    });

    $scope.newRoom = function(){
        $scope.modal.show();
    };

    $scope.cancelNewRoom = function(){
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function(){
        $scope.modal.remove();
    });
    $scope.$on('modal.hide', function(){
    });
    $scope.$on('modal.remove', function(){
    });
})


.controller('ResourcesCtrl',function($scope, $ionicHistory, Room, Account, $ionicModal, Class, $ionicSideMenuDelegate, $stateParams, Resource){
    $scope.getRoomNameById = function(roomId){
        return Room.get(roomId).name;
    };

    $scope.goBackHome = function(){
        $ionicHistory.goBack(-1);
    };


    $scope.toggleClasses = function(){
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.currentRoomId = $stateParams.roomId;
    $scope.currentClass = $stateParams.classId;

    $scope.reClasses = Class.query($stateParams.roomId, 2);
    $scope.reClasses = Class.query($stateParams.roomId, 2);
    console.log('room id:',$stateParams.roomId, 'class id:', $stateParams.classId);

    $scope.resources = Resource.query($stateParams.roomId, $stateParams.classId);

    console.log('resources:',$scope.resources);

    $scope.loginJudge = function(){
        Account.login();
    };

    //new resource modal
    $ionicModal.fromTemplateUrl('add-new-resource.html',{
        scope:$scope,
        animation:'slide-in-up'
    }).then(function(modal){
        $scope.modal = modal;
    });

    $scope.newResource = function(){
        $scope.modal.show();
    };

    $scope.cancelNewResource = function(){
        $scope.modal.hide();
    };
})

.controller('ResourceDetailCtrl',function($scope, $stateParams, Resource){
    $scope.currentRoomId = $stateParams.roomId;
    $scope.currentClass = $stateParams.classId;

    $scope.resource = Resource.get($stateParams.roomId, $stateParams.resourceId);
})

.controller('MineCtrl',function($scope, $cordovaSms, $stateParams, Account){
    $scope.account = {
        'isNewUser':false,
    };
    $scope.cancelLogin = function(){
        Account.cancelLogin();
    };

    $scope.sendVerify = function(phoneNum) {
        $scope.account.verify = Math.round(Math.random()*100000);
        //$cordovaSms.send(phoneNum, $scope.account.verify);
        console.log("verify:"+$scope.account.verify);
    };

    $scope.login = function(account, password) {
        var a = Account.get(account);
        if (a != false) {
            if (Account.get(account).password == password) {
                Account.cancelLogin();
                return true;
            }
        } else {
            console.log($scope.account.verify + '=='+$scope.account.verifyInput+','+$scope.account.account);
            if ($scope.account.verify == $scope.account.verifyInput) {
                Account.save(account, password, $scope.account.nickName, $scope.account.portrait);
                Account.cancelLogin();
            }
        }
    };

    //判断账户是否存在
    $scope.judgeAccountExist = function(account) {
        var a = Account.get(account);
        if (a == false) {
            console.log('new user, show regist view:' + account);
            $scope.account.isNewUser = true;
            return false;
        } else {
            console.log('old user,show user login view:' + account);
            $scope.account.isNewUser = false;
            return true;
        }
    };
})

/*
.controller('SessionsCtrl', function($scope, $stateParams){
})
*/
.controller('FriendsCtrl', function($scope, Contacts, $ionicSideMenuDelegate){
    $scope.contacts = Contacts.get();
    $scope.closeLeftMenu = function(){
        $ionicSideMenuDelegate.toggleLeft();
    };
})

.controller('SettingsCtrl', function($scope, $stateParams){
})

.controller('ChatCtrl', function($scope, $ionicHistory, Contacts, $cordovaSms, $stateParams, Session){
    $scope.session = {};

    $scope.session.id = $stateParams.id;
    $scope.session.name = $stateParams.name;
    $scope.session.type = $stateParams.type;

    Session.create($scope.session);

    $scope.message = '';
    $scope.send = function(session, message){
        $cordovaSms.send(session.id, message).
            then(function(){},function(){});
    };

    $scope.goBack = function(){
        $ionicHistory.goBack(-2);
    };

    console.log('history:'+JSON.stringify($ionicHistory.viewHistory()));
})

.controller('MMX_ChatCtrl', function($scope, $q, RoomInfo){
    //房间信息map
    $scope.roomsDict = {
        //房间列表
        roomIds:[],
        //返回一个Room对象
        //调用方式:
        // var promise = $scope.roomsDict.get(gname);
        // promise.then(function(data){
        //     成功回调
        // }, function(data){
        //     失败回调
        // });
        get:function(gname) {
                var deferred = $q.defer();//有可能需要向后台异步请求
                if (this.hasOwnProperty(gname)) {
                    //缓存已存在房间信息
                    deferred.resolve(this[gname]);
                } else {
                    //创建新房间,获取房间信息，放入缓存
                    var room = new Room(gname);
                    var promise = RoomInfo.get(gname);

                    promise.then(function(data){
                        //房间列表中添加新房间
                        if (this.roomIds.indexOf(gname) == -1) {
                            this.roomIds.push(gname);
                        }

                        //TODO 获取房间信息,获取人员，人数，创建者信息

                        this[gname] = room;
                        deferred.resolve(room);
                    }, function(data){
                        deferred.reject(data);
                    });
                }
                return deferred.promise; //返回承诺
            },
    };
    //用户信息map
    $scope.usersDict = {
        //返回一个User对象
        get:function(userId) {
            },
    };
    //当前房间
    $scope.currentRoom = null;
    //当前用户
    $scope.currentUser = null;
})
