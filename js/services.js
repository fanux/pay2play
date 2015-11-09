angular.module('p2p.services', [])

.factory('Account', function($ionicModal){
    var modal;

    $ionicModal.fromTemplateUrl('login.html',{
        animation:'slide-in-up'
    }).then(function(m){
        modal = m;
    });

    return {
        cancelLogin:function(){
            modal.hide();
        },
        login:function(){
            modal.show();
        }
    }
})

.factory('Room', function(){
    var rooms = {
        '1':[
            {'name':'笑死人不偿命', 'id':1, 'img':'img/lameleg.jpg'},
            {'name':'经典动作片', 'id':2, 'img':'img/lameleg.jpg'},
            {'name':'好莱坞大片', 'id':3, 'img':'img/lameleg.jpg'},
            {'name':'小七带你看喜剧', 'id':4, 'img':'img/lameleg.jpg'},
            {'name':'经典喜剧集', 'id':5, 'img':'img/lameleg.jpg'},
            {'name':'搞笑视频集', 'id':6, 'img':'img/lameleg.jpg'},
            {'name':'经典短片', 'id':7, 'img':'img/lameleg.jpg'},
            {'name':'恐怖血腥电影,胆小误入吓死不偿命', 'id':6, 'img':'img/lameleg.jpg'},
            {'name':'恐怖', 'id':8, 'img':'img/lameleg.jpg'},
            {'name':'血腥', 'id':9, 'img':'img/lameleg.jpg'},
            {'name':'熊出没', 'id':10, 'img':'img/lameleg.jpg'},
            {'name':'三个奶爸', 'id':11, 'img':'img/lameleg.jpg'},
            {'name':'盗墓笔记', 'id':12, 'img':'img/lameleg.jpg'},
            {'name':'越狱', 'id':13, 'img':'img/lameleg.jpg'},
            {'name':'儿童片', 'id':14, 'img':'img/lameleg.jpg'},
            {'name':'日本爱情动作片', 'id':15, 'img':'img/lameleg.jpg'},
            {'name':'二战记录片', 'id':16, 'img':'img/lameleg.jpg'},
            {'name':'整蛊路人', 'id':17, 'img':'img/lameleg.jpg'},
            {'name':'二次元', 'id':18, 'img':'img/lameleg.jpg'},
            {'name':'自媒体', 'id':19, 'img':'img/lameleg.jpg'},
        ],
        '7':[
            {'name':'小七带你看喜剧', 'id':4, 'img':'img/lameleg.jpg'},
            {'name':'经典喜剧集', 'id':21, 'img':'img/lameleg.jpg'},
            {'name':'搞笑视频集', 'id':22, 'img':'img/lameleg.jpg'},
        ],
        '8':[
            {'name':'房间7', 'id':23, 'img':'img/lameleg.jpg'},
            {'name':'房间8', 'id':24, 'img':'img/lameleg.jpg'},
            {'name':'房间9', 'id':25, 'img':'img/lameleg.jpg'},
        ],
        '4':[
            {'name':'房间10', 'id':26, 'img':'img/lameleg.jpg'},
            {'name':'房间11', 'id':27, 'img':'img/lameleg.jpg'},
            {'name':'房间12', 'id':28, 'img':'img/lameleg.jpg'},
        ],
        '5':[
            {'name':'房间13', 'id':29, 'img':'img/lameleg.jpg'},
            {'name':'房间14', 'id':30, 'img':'img/lameleg.jpg'},
            {'name':'房间15', 'id':31, 'img':'img/lameleg.jpg'},
        ],
    };
    return {
        get:function(roomId){
            for (var c in rooms) {
                for (var i =0; i < rooms[c].length; i++){
                    if (rooms[c][i].id == roomId) {
                        return rooms[c][i];
                    }
                }
            }
        },
        query:function(classId){
            if (classId == 0 || typeof(classId) == 'undefined'){
                classId = 1;
            }
            return rooms[classId];
        }
    }
})

.factory('Class', function(){
    //type 1:room 2:resource
    var classes = [
        {'name':'视频', 'id':1, 'fid':0, 'type':1, 'ion':'ion-videocamera'},
        {'name':'喜剧', 'id':7, 'fid':1, 'type':1, 'ion':''},
        {'name':'动作', 'id':8, 'fid':1, 'type':1, 'ion':''},

        {'name':'图片', 'id':2, 'fid':0, 'type':1, 'ion':'ion-images'},
        {'name':'mp3', 'id':3, 'fid':0, 'type':1, 'ion':'ion-music-note'},
        {'name':'商城', 'id':4, 'fid':0, 'type':1, 'ion':'ion-bag'},
        {'name':'小说', 'id':5, 'fid':0, 'type':1, 'ion':'ion-ios-book-outline'},
        {'name':'文章', 'id':6, 'fid':0, 'type':1, 'ion':'ion-ios-compose-outline'},

        {'name':'周星星', 'id':6, 'fid':4, 'type':2},
        {'name':'金凯瑞', 'id':7, 'fid':4, 'type':2},
        {'name':'其他', 'id':8, 'fid':4, 'type':2},
    ];
    return {
        query:function(fatherId, type){
            console.log('father id:',fatherId);
            var res = [];
            for (var i = 0; i < classes.length; i++){
                if (classes[i].fid == fatherId && classes[i].type == type){
                    res.push(classes[i]);
                }
            }
            return res;
        }
    }
})

.factory('Resource', function(){
    var resources = {
        '4':[
            {'name':'唐伯虎点秋香', 'id':3, 'classId':6, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'少林足球', 'id':4, 'classId':6, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'回魂夜', 'id':9, 'classId':6, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'大话王', 'id':10, 'classId':7, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'楚门的世界', 'id':11, 'classId':7, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':12, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':13, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':14, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':15, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':16, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':17, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':18, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':19, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':20, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':21, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':22, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':23, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':24, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':25, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'两杆大烟枪', 'id':26, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
        ],
        '7':[
            {'name':'唐伯虎点秋香', 'id':3, 'classId':6, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'少林足球', 'id':4, 'classId':6, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'回魂夜', 'id':9, 'classId':6, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'大话王', 'id':10, 'classId':7, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'楚门的世界', 'id':10, 'classId':7, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'你呀闭嘴', 'id':10, 'classId':8, 'body':'resource detail', 'img':'img/tatanic.jpg'},
        ],
        '9':[
            {'name':'资源3', 'id':5, 'classId':1, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'资源3', 'id':6, 'classId':1, 'body':'resource detail', 'img':'img/tatanic.jpg'},
        ],
        '8':[
            {'name':'资源4', 'id':7, 'classId':1, 'body':'resource detail', 'img':'img/tatanic.jpg'},
            {'name':'资源4', 'id':8, 'classId':1, 'body':'resource detail', 'img':'img/tatanic.jpg'},
        ]
    };
    return {
        query:function(roomId, classId){
            if (classId == 0 || typeof(classId) == 'undefined') {
                return resources[roomId];
            }
            var res = [];
            for (var i = 0; i < resources[roomId].length; i++){
                if (classId == resources[roomId][i].classId){
                    res.push(resources[roomId][i]);
                }
            }
            return res;
        },

        get:function(roomId, resourceId){
            for (var i = 0; i < resources[roomId].length; i++){
                if (resourceId == resources[roomId][i].id) {
                    return resources[roomId][i];
                }
            }
        }
    }
})

.factory('Contacts',function(){
    var contacts = [{
        "id": "1",
        "firstName": "方",
        "lastName": "海涛",
        "displayName": "方海涛",
        "phoneNumbers": [
            {
                "number": "15805691422",
                "normalizedNumber": "15805691422",
                "type": "MOBILE"
            }, 
            {
                "number": "(415) 555-3695",
                "normalizedNumber": "(415) 555-3695",
                "type": "OTHER"
            }
        ]
    }];
    return {
        save:function(phoneContacts){
            contacts = phoneContacts;
            //alert('save contact:'+JSON.stringify(contacts));
        },
        get:function(){
            return contacts;
        }
    }
})

.factory('Session',function(){
    /*
      {
        '15805691422':{
            'id':'15805691422',
            'name':'方海涛',
            'img':'',
        },
      }
     * */
    var sessions = {}
    return {
        get:function(sessionId){
            console.log('get session:'+JSON.stringify(sessions[sessionId]));
            return sessions[sessionId];
        },
        //创建会话，返回创建好的id
        create:function(session){
            if (sessions.hasOwnProperty(session.id)){
                return sessions[session.id];
            }
            sessions[session.id] = {};
            sessions[session.id].id = session.id;
            sessions[session.id].name = session.name;
            var sessionId = session.id;

            console.log('create session:',JSON.stringify(sessions[session.id]),sessionId);

            return sessionId;
        }
    }
})
