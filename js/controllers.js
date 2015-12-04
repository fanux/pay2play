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

.controller('MMX_ChatCtrl', function($scope, $http, $q, $ionicScrollDelegate, $anchorScroll, 
        Contacts, $location, RoomInfo, UsersInfo, ChatApi, $ionicModal, $cordovaSms){
    /*测试使用，模拟登陆，合入框架后必须删除*/
    $http.post(API_URL+'/user/login',JSON.stringify({"mode":2,"type":4,"phone":"15805691422","password":'96e79218965eb72c92a549dd5a330112',"dev":"121.199.9.187"}));

    //锚点跳转
    $scope.goto = function(id) {
        $location.hash(id);
        $anchorScroll();
    };

    //获取e2e类型的gname中的userid，返回聊天对方的id
    function getUserIdInGname(gname) {
        var list = gname.split('_');
        if (list[1] == $scope.currentUser) {
            return list[2];
        } else {
            return list[1];
        }
    };

    //房间信息map
    $scope.roomsDict = {
        //房间列表
        roomIds:[],
        //roomIds里面移除gname
        removeRoomFromList:function(gname){
            return this.roomIds.splice(this.roomIds.indexOf(gname),1);
        },

        addRoomId:function(roomId){
            if (this.roomIds.indexOf(roomId) == -1) {
                console.log('add roomIds:'+roomId+',roomIds:'+JSON.stringify(this.roomIds));
                this.roomIds.push(roomId);
            }
        },
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
                } else if (gname.slice(0,3) == 'e2e') {
                    var r = new Room(gname);
                    var pro = $scope.usersDict.get(getUserIdInGname(gname));

                    pro.then(function(user){
                        r.setRoomBaseInfo(gname, user.showName, user.userImgUrl);
                        $scope.roomsDict[gname] = r;
                        $scope.roomsDict.addRoomId(gname);
                        deferred.resolve(r);
                    }, function(){});
                } else {
                    //创建新房间,获取房间信息，放入缓存
                    var room = new Room(gname);
                    var promise = RoomInfo.get(gname);
                    var _this = this;

                    promise.then(function(data){
                        if ('eroor' in data) {
                            return deferred.promise;
                        }
                        //房间列表中添加新房间
                        if (_this.roomIds.indexOf(gname) == -1) {
                            _this.roomIds.push(gname);
                        }
                        room.setRoomBaseInfo(data.gname, data.roomName, data.roomImg);
                        _this[gname] = room;
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
        //好友列表
        friendsListOrder : [['A',[]],['B',[]],['C',[]],['D',[]],['E',[]],['F',[]],['G',[]],['H',[]],['I',[]],['J',[]],['K',[]],['L',[]],['M',[]],['N',[]],['O',[]],['P',[]],['Q',[]],['R',[]],['S',[]],['T',[]],['U',[]],['V',[]],['W',[]],['X',[]],['Y',[]], ['Z',[]],],
        //存储无顺序的userid
        friendsList:[],

        //ch:好友名称首字母,添加好友信息，id放入friendsList,信息放入userDict
        friendsListPush : function(ch, userId) {
            var flag = 0; //标志friendsList中有没有其首字母

            for (var i = 0; i < this.friendsListOrder.length; i++) {
                if (ch == this.friendsListOrder[i][0]) {
                    if (this.friendsList.indexOf(userId) == -1) {
                        this.friendsListOrder[i][1].push({'id':userId, 'flag':false});
                        this.friendsList.push(userId);
                    }
                    flag = 1;
                    break;
                }
            }
            //列表中不存在ch首字母
            if (flag = 0) {
                this.friendsListOrder.push([ch, [{'id':userId, 'flag':false}]]);
            }

        },

        getUserFriends : function(userId) {
                             var url = API_URL + '/userweb/' + $scope.currentUser + '/friends';
                             $http.get(url).success(function(data, status, headers, config){
                                 console.log('get user friends:'+JSON.stringify(data));

                                 for (var fs in data.friends) {
                                     for (var u = 0; u < data.friends[fs].length; u++) {
                                         var userId = data.friends[fs][u].friend_id;

                                         if ($scope.usersDict.hasOwnProperty(userId)) {
                                             var userInfo = $scope.usersDict[userId];
                                         } else {
                                             var userInfo = new User(userId);
                                         }

                                         userInfo.setUserInfo(userId, data.friends[fs][u].name, data.friends[fs][u].portrait_url, data.friends[fs][u].gender, data.friends[fs][u].mcode, data.friends[fs][u].phone_no, data.friends[fs][u].city_id, data.friends[fs][u].city_name, 2, true, data.friends[fs][u].friend_name);

                                         $scope.usersDict[userId] = userInfo;

                                         $scope.usersDict.friendsListPush(fs, userId);
                                     }
                                 }
                                 console.log('friendList:'+JSON.stringify($scope.usersDict.friendsListOrder));
                             });
                         },

        //返回一个User对象
        get:function(userId) {
                var deferred = $q.defer();
                if (this.hasOwnProperty(userId)) {
                    console.log('already has user info in cache');
                    //缓存中已经存在用户信息
                    deferred.resolve(this[userId]);
                } else {
                    console.log('get user info by http request');
                    var user = new User(userId);
                    var promise = UsersInfo.gets([userId], $scope.currentUser);
                    promise.then(function(u){
                        user.setUserInfo(u[0].userId, u[0].userName, u[0].userImgUrl, u[0].gender, u[0].mcode, u[0].phoneNo, u[0].cityId, u[0].cityName, u[0].userType, u[0].isMyFriend, u[0].remark);
                        $scope.usersDict[u[0].userId] = user;
                        deferred.resolve(user);
                    },function(){});
                }

                return deferred.promise;
            },
        gets:function(userIds) {
                 var deferred = $q.defer();
                 var promise = UsersInfo.gets(userIds, $scope.currentUser);
                 promise.then(function(users){
                     deferred.resolve(users);
                 }, function(){});

                 return deferred.promise;
             }
    };
    //当前房间
    $scope.currentRoom = 'users_100021448589188';
    //当前用户
    $scope.currentUser = 10002;
    //通讯录
    $scope.contacts = Contacts.get();


    //websocket 处理
    var WS_IP_PORT = 'chat.immbear.com:8889';
    var passwd = '96e79218965eb72c92a549dd5a330112';
    var wsUrl = 'ws://' + WS_IP_PORT + '/chat/?u=' + $scope.currentUser + '&p=' + passwd;
    //登出标志位，登出时websocket链接不可以重连
    $scope.logoutFlag = 0;

    //不包含ws链接的上下文
    var ctx = new Ctx($scope);
    ctx.scroll = $ionicScrollDelegate;
    var ws = new MyWebSocket(wsUrl, ctx);
    ws.init();

    ChatApi.save($scope, ws, ctx);

    
    /*views触发的函数*/
    //发送消息
    $scope.send = function(message){
        var msg = new Fac_Message(null, ctx, 'CHAT_M');
        msg.send($scope.currentRoom, message, $scope.currentUser, 'text');
    };
    //向好友创建会话
    $scope.createSessionToFriend = function(userId) {
        ChatApi.createSessionToUser(userId);
    };
    //关闭聊天窗口
    $scope.cancelChat = function(){
        ChatApi.chatWindowPopup(0);
    }
    $scope.exchangeRoom = function(room) {
        ChatApi.exchangeRoom(room);
        //$scope.currentRoom = room;
        //ChatApi.chatWindowPopup(1);
    };
    //移除会话
    $scope.removeRoom = function(room) {
        console.log('remove room from list');
        $scope.roomsDict.removeRoomFromList(room);
    }
    //好友列表
    $scope.openAddFriend = function(){
        ChatApi.addFriendWindowPopup(1);
    };
    $scope.closeAddFriend = function(){
        ChatApi.addFriendWindowPopup(0);
    };
    //添加好友请求
    $scope.addFriend = function(friend) {
        ChatApi.addFriend(friend);
    };
    //通过通讯录添加好友
    $scope.addFriendByContact = function(friend) {
        $scope.addFriend(friend);
        //TODO 在手机上取消注释,发送短信给对方
        //$cordovaSms.send(friend, '我在喵喵熊上加你好友了，去接收一下吧。http://www.immbear.com/#/user/'+friend+'/?invite='+$scope.currentUser).then(function(){},function(){});
    };
})

.controller('SessionsCtrl', function($scope){})
