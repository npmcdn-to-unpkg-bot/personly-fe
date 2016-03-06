/**
 * Created by MrSingh on 1/17/16.
 */

pmApp.controller('loginCtrl',[ '$scope','$rootScope','$location','$http','toastr','pmAuth','localStorageService', function($scope, $rootScope,$location,$http,toastr,pmAuth, localStorageService){

    if($rootScope.loggedIn){
        $location.path('/');
    }

    $rootScope.bgBlue = true;

    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        $rootScope.bgBlue = false;
    });


    $scope.signupUser = function(data) {
        $scope.signupError = "";
        pmAuth.signupUser(data)
            .then(function(response){
                console.log(response);
                if(response.data.success){
                    toastr.success('Account successfully created.');
                } else{
                    if(response.data.errCode == 11000){
                        $scope.signupError = 'User Already Exists.';
                        toastr.error('User Already Exists.');
                    }else{
                        toastr.error('Bummer... there is an error registering');
                    }
                }
            });
    }

    $scope.loginUser = function (data) {
        pmAuth.authenticateUser(data)
            .then(function(success){
                if(success){
                    toastr.success('Log In Successful');
                } else{
                    toastr.error('Bummer... Incorrect username/password');
                }
            });
    }




}]);