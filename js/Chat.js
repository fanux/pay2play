//websocket类
function WebSocket(url){
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

    this.process = function() {
        console.log('CHAT_M process');
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
