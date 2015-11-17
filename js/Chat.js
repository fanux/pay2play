//websocket类
function MyWebSocket(url){
    //建立连接接口
    this.websocket = null;
    this.init = function(){
        this.websocket = new WebSocket(url);
        console.log('new websocket url:'+url);
        return this.websocket;
    };

    //发送消息接口
    this.send = function(data){
        console.log('send message:'+JOSN.stringify(data));
        this.websocket.send(JSON.stringify(data));
    };
}

//用户信息类
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
}

//消息对象工厂
function Fac_Message(message, ctx) {
    var messageObj = JSON.parse(message);

    var processer = null;
    switch(messageObj.c) {
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
        default:
            console.log('unknown command:'+message);
    }
    processer.messageObj = messageObj;
    processer.ctx = ctx;

    return processer;
}

//处理器上下文类。处理器处理消息时需要的参数，如$scope,以及其它对象,包含controller注入的所有服务
function Ctx() {
    this.scope = null;
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

    //接收到消息的处理
    this.process = function() {
        console.log('CHAT_M process');
    };

    //发送消息
    this.send = function(gname, message) {}
}

//聊天记录处理器,获取到聊天记录的处理，以及获取聊天记录的接口
function GET_RECORD_message(message) {
    Message.call(this, message);

    //获取到聊天记录的处理
    this.process = function() {
        console.log('GET_RECORD_message process');
    };

    //获取聊天记录接口,房间id，需要获取的数量，结果直接填充上下文中的对象
    this.send = function(gname, num){};
}

//组用户信息
function GROUP_USERS_message(message) {
    Message.call(this, message);

    this.process = function() {
        console.log('GROUP_USERS_message process');
    };

    //发送获取组用户信息请求，结果直接填充上下文中的对象
    this.send = function(gname) {};
}

//进组或者聊天室
function ENTR_GROUP_message(message) {
    Message.call(this, message);

    //新人进组会收到此消息
    this.process = function() {
        console.log('ENTR_GROUP_message process');
    };

    //用户进入哪个房间时发送的消息。该消息会发送给组内其他成员
    this.send = function(userId, gname) {};
}

//退出讨论组或者聊天室
function EXIT_G_message(message) {
    Message.call(this, message);

    this.process = function() {
        console.log('EXIT_G_message process');
    };

    //用户退出组时发送此消息。哪个用户退出哪个组.该消息会发送给组内其他成员
    this.send = function(userId, gname) {};
}

//被拉时接受到的邀请信息
function INVITE_message(message) {
    Message.call(this, message);

    this.process = function() {
        console.log('INVITE_message process');
    };
}

//摇一摇信息
function SHAKE_KEYS_message(message) {
    Message.call(this, message);

    this.process = function() {
        console.log('SHAKE_KEYS_message process');
    };

    //通过http接口发送摇一摇请求 url:/chat/match
    this.send = function(url, data){};
}

//用户组信息
function USER_GROUPS_message(message) {
    Message.call(this, message);

    this.process = function() {
        console.log('USER_GROUPS_message process');
    };

    //获取用户组信息请求
    this.send = function(userId){};
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
function Room(gname) {
    //房间内人员信息
    this.userIds = []; //房间内人员id列表
    this.userNum = 0;  //房间人数
    this.ownerId = 0;   //创建者id

    //房间基本信息
    this.roomImgUrl = ''; //房间头像url
    this.roomName = '';     //房间名称
    this.roomGname = gname; //房间id，唯一标识
    this.roomType = '';     //房间类型

    //房间内消息信息
    this.messages = [];
    /*
     * newMessageNum = this.messages.length - messageReadCur;
     * 当用户点击某个room时
     * this.messageReadCur = this.messages.length
     * 游标左边是已读消息，游标右边是未读消息
     * */
    this.messageReadCur = 0; //已读消息游标。
    //this.newMessageNum = 0;
}
