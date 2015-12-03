//websocket类
function MyWebSocket(url, ctx){
    //建立连接接口
    this.websocket = null;
    this.ctx = ctx;
    this.url = url;

    var _this = this;

    this.init = function(){
        console.log('new websocket url:'+url);
        _this.websocket = new WebSocket(url);

        //初始化上下文中的链接
        _this.ctx.ws = _this;

        _this.websocket.onclose = function(evt) {_this.onClose(evt);}
        _this.websocket.onopen = function(evt) {_this.onOpen(evt);}
        _this.websocket.onmessage = function(evt) {_this.onMessage(evt);}
        _this.websocket.onerror = function(evt) {_this.onError(evt);}

        return _this.websocket;
    };

    this.onOpen = function(evt){
        //获取用户组信息
        var msg = Fac_Message(null, _this.ctx, 'USER_GROUPS');
        msg.send(ctx.scope.currentUser);
        console.log('open websocket');
    };

    this.onMessage = function(evt){
        //返回一个消息处理器对象
        console.log('receive message:'+evt.data);
        var msg = Fac_Message(evt.data, _this.ctx, null);
        msg.process();
    };

    this.onClose = function(evt){
        if (!_this.ctx.scope.logoutFlag) {
            setTimeout(_this.init, 30000);
        } else {
            _this.ctx.scope.logoutFlag = 0;
        }
        console.log('websocket close');
    };
    this.onError = function(evt){
        console.log('websocket error:' + evt);
    };

    //发送消息接口
    this.send = function(data){
        console.log('send message:'+JSON.stringify(data));
        _this.websocket.send(JSON.stringify(data));
    };
}

//用户信息类
//API: /user/(myId)/info?uid=1&uid=2&uid=3
//userId也有可能是商家，也需要取到对应字段的信息
function User(userId) {
    this.userId = userId;   //必须
    this.userName = '';     //如没有显示默认值(喵喵号)
    this.userImgUrl = '';   //用户头像url ,如没有显示默认值
    this.gender = 0;        //性别
    this.mcode = '';        //喵喵号 必须
    this.phoneNo = '';      //电话 可选
    this.cityId = '';       //可选
    this.cityName = '';     //城市名称 可选
    this.userType = 1;      //1商家，2用户 必须

    //好友信息
    this.isMyFriend = false;//是否是我的好友
    this.remark = '';       //备注姓名

    //view上展现的名字，是好友显示备注，不是好友显示昵称
    this.showName = '';

    var _this = this;

    this.setUserInfo = function(a,b,c,d,e,f,g,h,i,j,k){
        _this.userId = a;
        _this.userName = b;
        _this.userImgUrl = c;
        _this.gender = d;
        _this.mcode = e;
        _this.phoneNo = f;
        _this.cityId = g;
        _this.cityName = h;
        _this.userType = i;
        _this.isMyFriend = j;
        _this.remark = k;

        if (_this.isMyFriend == true && _this.remark != "") {
            _this.showName = _this.remark;
        } else {
            _this.showName = _this.userName;
        }
    };
}

//消息对象工厂
//有两种用法1：接收一条消息时type == null，用户解析消息。  
//function onMessage(msg){
//  processer = Fac_Message(msg, ctx, null);
//  processer.process();
//}
//2：type == (消息类型) 用于获取一个可以发送消息的对象,调用send方法构造和发送消息，message可以为空
//  sender = Fac_Message(null, ctx, 'CHAT_M');
//  sender.send('gname', 'message');
function Fac_Message(message, ctx, type) {
    var processer = null;

    var messageObj = null;
    if (type == null) {
        messageObj = JSON.parse(message);
        type = messageObj.c;
    }

    switch(type) {
        case 'CHAT_M': 
            processer = new CHAT_M_message(message);
            processer.messageType = 'CHAT_M';
            break;
        case 'GET_RECORD': 
            processer = new GET_RECORD_message(message);
            processer.messageType = 'GET_RECORD';
            break;
        case 'GROUP_USERS': 
            processer = new GROUP_USERS_message(message);
            processer.messageType = 'GROUP_USERS';
            break;
        case 'ENTR_GROUP': 
        case 'ENTR_SHOP': 
            processer = new ENTR_GROUP_message(message);
            processer.messageType = 'ENTR_GROUP';
            break;
        case 'EXIT_G': 
            processer = new EXIT_G_message(message);
            processer.messageType = 'EXIT_G';
            break;
        case 'INVITE': 
            processer = new INVITE_message(message);
            processer.messageType = 'INVITE';
            break;
        case 'ADD_FRIEND': 
            processer = new ADD_FRIEND_message(message);
            processer.messageType = 'ADD_FRIEND';
            break;
        case 'CON_FRIEND': 
            processer = new CON_FRIEND_message(message);
            processer.messageType = 'CON_FRIEND';
            break;
        case 'SEND_FANS_M': 
            processer = new TUNNEL_message(message);
            processer.messageType = 'SEND_FANS_M';
            break;
        case 'SHAKE_KEYS': 
            processer = new SHAKE_KEYS_message(message);
            processer.messageType = 'SHAKE_KEYS';
            break;
        case 'USER_GROUPS': 
            processer = new USER_GROUPS_message(message);
            processer.messageType = 'USER_GROUPS';
            break;
        case 'CHANGE_DEVICE':
            processer = new CHANGE_DEVICE_message(message);
            processer.messageType = 'CHANGE_DEVICE';
            break;
        default:
            console.log('unknown command:'+message);
    }
    if (processer != null) {
        processer.ctx = ctx;

        processer.messageObj = messageObj;
    }

    return processer;
}

//处理器上下文类。处理器处理消息时需要的参数，如$scope,以及其它对象,包含controller注入的所有服务
function Ctx(scope) {
    this.scope = scope;
    this.ws = null;     //websocket 对象
    this.scroll = null; //聊天窗口滚动条
}

//消息类
function Message(message) {
    this.messageType = '';
    this.messageObj = null;
    this.message = message;
    this.ctx = null;

    this.process = function(){
        console.log('base process');
    };
}

//聊天消息类
//接收到消息的处理，和发送消息的接口
function CHAT_M_message(message) {
    Message.call(this, message);
    var _this = this;


    //接收到消息的处理
    this.process = function() {
        var gname = _this.messageObj.gname;
        var promise = _this.ctx.scope.roomsDict.get(gname);
        promise.then(function(room){
            //TODO可能还需要一个附加条件判断当前room是否打开了
            if (gname == _this.ctx.scope.currentRoom) {
                room.readNewMessage();
            } 
            //以前是只将消息的body放到room里，考虑将来其他的消息可能也会放到里面，room当作容器
            //包含命令码等其他信息
            room.addMessage(_this.messageObj);
            //滚动条滚动到底部
            _this.ctx.scroll.scrollBottom();
        },function(){
            console.log('get room in rooms dict failed');
        });

        //获取发送者的用户信息,获取到缓存中即可
        var pro = _this.ctx.scope.usersDict.get(_this.messageObj.body.user);
        pro.then(function(user){},function(){});

        console.log('CHAT_M process');
    };

    //发送消息 message:消息体,user:发送方,mtype:消息类型content-type
    //message 可以是一个对象
    this.send = function(gname, message, user, mtype) {
        var messageBody = {
            'user':user,
            'time':0,
            'mtype':mtype,
            'm':message
        };

        var sendMessage = {
            'c':'CHAT_M',
            'gname':gname,
            'body':messageBody
        };

        if(_this.ctx.ws) {
            _this.ctx.ws.send(sendMessage);
        } else {
            console.log('send message ERROR, websocket is null');
        }
    };
}

//聊天记录处理器,获取到聊天记录的处理，以及获取聊天记录的接口
function GET_RECORD_message(message) {
    Message.call(this, message);
    var _this = this;

    //获取到聊天记录的处理
    this.process = function() {
        var gname = _this.messageObj.gname;
        var promise = _this.ctx.scope.roomsDict.get(gname);
        promise.then(function(room){
            room.addMessagesHead(_this.messageObj.ms);
        }, function(){
        });
        console.log('GET_RECORD_message process');
    };

    //获取聊天记录接口,房间id，需要获取的数量，结果直接填充上下文中的对象
    //从哪开始获取多少条记录
    this.send = function(gname, num, startTime){
        var message = {
            'c':'GET_RECORD',
            'gname':gname,
            'stime':startTime,
            'limit':num
        };

        _this.ctx.ws.send(message);
    };
}

//组用户信息
function GROUP_USERS_message(message) {
    Message.call(this, message);
    var _this = this;

    this.process = function() {
        var gname = _this.messageObj.gname;
        //调用get的时候room的基本信息就会被填充
        var promise = _this.ctx.scope.roomsDict.get(gname);
        promise.then(function(room){
            room.setRoomUsers(_this.messageObj.users);
        }, function(){});
        console.log('GROUP_USERS_message process');
    };

    //发送获取组用户信息请求，结果直接填充上下文中的对象
    this.send = function(gname) {
        var message = {
            'c':'GROUP_USERS',
            'gname':gname
        };

        _this.ctx.ws.send(message);
    };
}

//进组或者聊天室
function ENTR_GROUP_message(message) {
    Message.call(this, message);
    var _this = this;

    //新人进组会收到此消息
    this.process = function() {
        var gname = _this.messageObj.gname;
        var promise = _this.ctx.scope.roomsDict.get(gname);
        promise.then(function(room){
            room.addUser(_this.messageObj.user);
        }, function(){});
        console.log('ENTR_GROUP_message process');
    };

    //用户进入哪个房间时发送的消息。该消息会发送给组内其他成员
    this.send = function(userId, gname) {
        var message = {
            'c':'ENTR_GROUP',
            'user':userId,
            'gname':gname
        }
        
        _this.ctx.ws.send(message);
    };
}

//退出讨论组或者聊天室
function EXIT_G_message(message) {
    Message.call(this, message);
    var _this = this;

    this.process = function() {
        var gname = _this.messageObj.gname;
        var promise = _this.ctx.scope.roomsDict.get(gname);
        promise.then(function(room){
            room.removeUser(_this.messageObj.user);
            //如果是自己退出组，删除房间列表对应项
            if (_this.messageObj.user == _this.ctx.scope.currentUser) {
                _this.scope.roomsDict.removeRoomFromList(_this.messageObj.gname);
            }
        }, function(){});
        console.log('EXIT_G_message process');
    };

    //用户退出组时发送此消息。哪个用户退出哪个组.该消息会发送给组内其他成员
    this.send = function(userId, gname) {
        var message = {
            'c':'EXIT_G',
            'user':userId,
            'gname':gname
        }

        _this.ctx.ws.send(message);
    };
}

//被拉时接受到的邀请信息
function INVITE_message(message) {
    Message.call(this, message);
    var _this = this;

    this.process = function() {
        var promise = _this.ctx.scope.roomsDict.get(_this.messageObj.gname);
        promise.then(function(room){
            room.setRoomUsers(_this.messageObj.users);
        }, function(){});

        _this.ctx.ws.send({
            'c':'ACCEPT',
            'gname':_this.messageObj.gname
        });
        console.log('INVITE_message process');
    };
}

//换设备登陆处理
function CHANGE_DEVICE_message(message) {
    Message.call(this, message);

    this.process = function() {
        console.log('CHANGE_DEVICE_message process');
    };
}

//摇一摇信息 TODO
function SHAKE_KEYS_message(message) {
    Message.call(this, message);

    this.process = function() {
        console.log('SHAKE_KEYS_message process');
    };

    //通过http接口发送摇一摇请求 url:/chat/match
    this.send = function(url, gender, cityId){};
}

//用户组信息
function USER_GROUPS_message(message) {
    Message.call(this, message);
    var _this = this; 
    this.process = function() {
        var groups = _this.messageObj.groups;
        for (var i = 0; i < groups.length; i++) {
            //获取room基本信息，可能在缓存中，也可能去平台上获取，怎么获取的此处不关心
            var promise = _this.ctx.scope.roomsDict.get(groups[i]);
            promise.then(function(room){
                //添加room列表
                _this.ctx.scope.roomsDict.addRoomId(room.roomGname);
                //发送获取组用户信息请求
                var groupUsersMsg = Fac_Message(null, _this.ctx, 'GROUP_USERS');
                groupUsersMsg.send(room.roomGname);
            }, function(){});
        }
        console.log('USER_GROUPS_message process');
    };

    //获取用户组信息请求
    this.send = function(userId){
        var msg = {
            'c':'USER_GROUPS',
            'user':userId
        };
        _this.ctx.ws.send(msg);
    };
}

//添加好友信息
function ADD_FRIEND_message(message) {
    Message.call(this, message);

    this.process = function() {
        console.log('ADD_FRIEND_message process');
    };

    //通过http接口发送添加好友请求
    this.send = function(url, data) {};
}

//确认添加好友回应
function CON_FRIEND_message(message) {
    Message.call(this, message);

    this.process = function() {
        console.log('CON_FRIEND_message process');
    };

    //通过http请求，发送添加好友请求的回应
    this.send = function(url, data) {};
}

//管道消息，这类消息聊天模块不处理的消息。
//如给粉丝发消息，一些推送通知等等。
function TUNNEL_message(message) {
    Message.call(this, message);

    this.process = function() {
        console.log('TUNNEL process');
    };
}

//gname is roomId
//房间信息类
function Room(gname, img, name, type) {
    var _this = this;

    //房间内人员信息
    this.userIds = []; //房间内人员id列表
    this.ownerId = 0;   //创建者id

    //房间基本信息
    this.roomImgUrl = img; //房间头像url
    this.roomName = name;     //房间名称
    this.roomGname = gname; //房间id，唯一标识
    this.roomType = type;     //房间类型

    //房间内消息信息
    this.messages = [];
    /*
     * newMessageNum = this.messages.length - messageReadCur;
     * 当用户点击某个room时
     * this.messageReadCur = this.messages.length
     * 游标左边是已读消息，游标右边是未读消息
     * */
    this.messageReadCur = 0; //已读消息游标。

    //设置room成员信息
    this.setRoomMembersInfo = function(userIds, userNum, ownerId){
        _this.userIds = userIds;
        _this.userNum = userNum;
        _this.ownerId = ownerId;
    };

    //设置room基本信息
    this.setRoomBaseInfo = function(gname, name, img) {
        var t = gname.slice(0, 4);
        if (t == 'shop') {
            _this.roomType = 'shop';
        } else if(t == 'grou'){
            _this.roomType = 'groups';
        } else {
            _this.roomType = 'e2e';
        }

        this.roomGname = gname;
        this.roomName = name;
        this.roomImgUrl = img;

        console.log('set room base info:'+gname+','+name+','+img);
    }

    //添加消息
    this.addMessage = function(message) {
        _this.messages.push(message);
    };

    //添加多条消息
    this.addMessages = function(messages) {
        _this.messages = _this.messages.concat(messages);
    };
    //往首部添加多条消息
    this.addMessagesHead = function(messages) {
    };

    //阅读新消息,会把游标移到尾部
    this.readNewMessage = function(){
        _this.messageReadCur = _this.messages.length;
    };

    //获取未读消息数量
    this.getNewMessageNum = function(){
        return _this.messages.length - _this.messageReadCur;
    };

    //初始化房间人员信息
    this.setRoomUsers = function(users){
        _this.userIds = users;
        _this.ownerId = users[0];
    };

    //添加房间人员
    this.addUser = function(user){
        _this.userIds.push(user);
    };
    //删除某个人员
    this.removeUser = function(user) {
    };
}
