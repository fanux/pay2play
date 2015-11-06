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
            alert(JSON.stringify(contacts));
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


.controller('ResourcesCtrl',function($scope, Room, Account, $ionicModal, Class, $ionicSideMenuDelegate, $stateParams, Resource){
    $scope.getRoomNameById = function(roomId){
        return Room.get(roomId).name;
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

.controller('MineCtrl',function($scope, $stateParams, Account){
    $scope.cancelLogin = function(){
        Account.cancelLogin();
    }

    /*
    console.log('mine ctrl loading');

    document.addEventListener('deviceready', onDeviceReady, false);
    function onDeviceReady(){
        var simInfo = window.plugins.sim.getSimInfo(function(){},function(){});
        console.log(simInfo);
    }
    */
})

.controller('SessionsCtrl', function($scope, $stateParams){
})

.controller('FriendsCtrl', function($scope, $location, Contacts, Session){
    $scope.contacts = Contacts.get();

    $scope.createSessionFromContact = function(contact){
        var session = {
            'id':contact.phoneNumbers[0].normalizedNumber,
            'name':contact.displayName
        };
        console.log('contact session:'+JSON.stringify(session));

        var id = Session.create(session);
        $location.path('/chat/' + id);
    };
})

.controller('SettingsCtrl', function($scope, $stateParams){
})

.controller('ChatCtrl', function($scope, $ionicNavBarDelegate, $cordovaSms, $stateParams, Session){
    $scope.session = Session.get($stateParams.sessionId);
    $scope.message = '';
    $scope.send = function(session, message){
        $cordovaSms.send(session.id, message).
            then(function(){},function(){});
    };

    $scope.goBack = function(){
        $ionicNavBarDelegate.back();
    };
})

