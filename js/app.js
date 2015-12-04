// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('p2p', ['ionic', 'p2p.controllers', 'p2p.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $httpProvider, $urlRouterProvider){
    $httpProvider.defaults.withCredentials=true;
    $stateProvider

    .state('mine',{
        url:'/mine/?userId',
        views:{
            'panelView':{
                templateUrl:'templates/mine.html',
                controller:'MineCtrl'
            }
        }
    })

    .state('index',{
        //url:'/',
        views:{
            'leftMenuView':{
                templateUrl:'templates/chatTabs.html',
                controller:'MMX_ChatCtrl'
            }
        }
    })

    .state('index.friends',{
        //url:'friends',
        views:{
            'leftTabViews':{
                templateUrl:'templates/tabs/friends.html',
                controller:'FriendsCtrl'
            }
        }
    })

    .state('index.settings',{
        //url:'settings',
        views:{
            'leftTabViews':{
                templateUrl:'templates/tabs/settings.html',
                controller:'SettingsCtrl'
            }
        }
    })


    .state('index.sessions',{
        //url:'sessions',
        views:{
            'leftTabViews':{
                templateUrl:'templates/tabs/sessions.html',
                controller:'SessionsCtrl'
            }
        }
    })

    .state('rooms',{
        url:'/rooms/:classId',
        views:{
            'panelView':{
                templateUrl:'templates/rooms.html',
                controller:'RoomsCtrl'
            },
            'leftMenuView':{
                templateUrl:'templates/chatTabs.html',
                controller:'ClassCtrl'
            }
        }
    })

    .state('rooms.class', {
        url:'/',
        views:{
            'leftTabViews':{
                templateUrl:'templates/classes.html',
                controller:'ClassCtrl'
            }
        }
    })


    .state('resources',{
        url:'/room/:roomId/resources/:classId/',
        views:{
            'panelView':{
                templateUrl:'templates/resources.html',
                controller:'ResourcesCtrl'
            },
            'leftMenuView':{
                templateUrl:'templates/chatTabs.html',
                controller:'ClassCtrl'
            }
        }
    })

    .state('resources.reclass',{
        url:'class',
        views:{
            'leftTabViews':{
                templateUrl:'templates/reClasses.html',
                controller:'ResourcesCtrl'
            }
        }
    })

    .state('resourceDetail',{
        url:'/room/:roomId/class/:classId/resource/:resourceId',
        views:{
            'panelView':{
                templateUrl:'templates/resourceDetail.html',
                controller:'ResourceDetailCtrl'
            }
        }
    })

    .state('chat',{
        url:'/chat/?type&name&id',
        views:{
            'panelView':{
                templateUrl:'templates/chatWindow.html',
                //controller:'ChatCtrl'
                controller:'MMX_ChatCtrl'
            }
        }
    })

    $urlRouterProvider.otherwise('/rooms/0/');
})


