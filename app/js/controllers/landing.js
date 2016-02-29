/**
 * Created by MrSingh on 1/17/16.
 */

pmApp.controller('landingCtrl',[ '$scope', '$rootScope','$location','$http','pmAuth','ENV', function($scope, $rootScope, $location,$http,pmAuth,ENV){



    if(pmAuth.isSessionValid()){
        $location.path('/profile');
    }

    $scope.sendEmail = function (email) {
        console.log(email);
        var json = {
            'name'      :email.name,
            'email'     :email.email,
            'subject'   :email.subject,
            'message'   :email.message
        };

        $http.post(ENV.apiUrl + '/api/v1/submitEmail', json)
            .success(function(response){
                console.log(response);
            })
            .error(function(response){
                console.log(response);
            });
    }




}]);