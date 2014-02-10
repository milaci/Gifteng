define(["angular","app","services"],function(angular,app){return app.config(["$routeProvider","$httpProvider","$locationProvider",function($routeProvider,$httpProvider,$locationProvider){$routeProvider.when("/",{controller:"NavController",templateUrl:"app/partials/index.html",reloadOnSearch:!1}).when("/confirm",{templateUrl:"app/partials/confirm.html"}).when("/signin",{controller:"LoginController",templateUrl:"app/partials/login.html"}).when("/browse",{controller:"BrowseController",templateUrl:"app/partials/browse.html",reloadOnSearch:!1}).when("/admin",{controller:"AdminController",templateUrl:"app/partials/admin.html"}).when("/post",{templateUrl:"app/partials/post.html"}).when("/top-giftengers",{controller:"TopController",templateUrl:"app/partials/top.html"}).when("/profile",{controller:"ProfileController",templateUrl:"app/partials/profile.html"}).when("/profile/:section",{controller:"ProfileController",templateUrl:"app/partials/profile.html",reloadOnSearch:!1}).when("/profile/:section/:profilePage",{controller:"ProfileController",templateUrl:"app/partials/profile.html",reloadOnSearch:!1}).when("/view/profile/:id",{controller:"ProfileController",templateUrl:"app/partials/profile.html",reloadOnSearch:!1}).when("/view/profile/:id/:section",{controller:"ProfileController",templateUrl:"app/partials/profile.html",reloadOnSearch:!1}).when("/view/profile/:id/:section/:profilePage",{controller:"ProfileController",templateUrl:"app/partials/profile.html",reloadOnSearch:!1}).when("/view/gift/:id",{controller:"ViewGiftController",templateUrl:"app/partials/view/ad.html"}).when("/edit/gift/:id",{controller:"PostController",templateUrl:"app/partials/post.html"}).when("/edit/gift/:id/:update",{controller:"PostController",templateUrl:"app/partials/post.html"}).when("/authentication/verify/:code",{controller:"ResetController",templateUrl:"app/partials/reset-password.html"}).when("/invite",{controller:"InviteController",templateUrl:"app/partials/invite.html"}).when("/media",{templateUrl:"app/partials/media.html"}).otherwise({redirectTo:"/"});var numLoadings=0,loadingScreen=$("#loader");$httpProvider.interceptors.push(function(){return{request:function(config){return numLoadings++,loadingScreen.show(),config||$q.when(config)},response:function(response){return--numLoadings===0&&loadingScreen.hide(),response||$q.when(response)},responseError:function(response){return--numLoadings||loadingScreen.hide(),$q.reject(response)}}})}])});