/**
 * Created by MrSingh on 1/17/16.
 */

pmApp.controller('miscCtrl',[ '$scope', '$rootScope','$location','$http','$routeParams','ENV',
    function($scope, $rootScope, $location,$http,$routeParams,ENV){
        
        console.log('Inside Misc Controller');
        console.log($routeParams);

        var verifyToken = $routeParams.token;

        if(verifyToken){
            $http.get(ENV.apiUrl + '/api/v1/verify-email/'+verifyToken)
                .success(function(response){
                    console.log(response);
                    $scope.emailVerified = true;
                    $scope.userVerified = 'Thank you for confirming your email. Your account have been activated and is ready for you to share across the globe. You will be redirected to profile page in 5 seconds.';

                    setInterval(function () {
                        $location.path('/profile');
                        $scope.$apply();
                    }, 5000)

                })
                .error(function(response){
                    console.log(response);

                    if(response.errCode == 1000){
                        $scope.emailVerified = true;
                        $scope.userVerified = 'Your email has already been verified. You will be redirected to profile page in 5 seconds.';
                        setInterval(function () {
                            $location.path('/profile');
                            $scope.$apply();
                        }, 5000)
                    }else{
                        $scope.errorVerifying = true;
                        $scope.userVerified = 'uh-oh. Something went wrong. Please check your requested url or click on the link from your email again.';
                    }

                });
        }
}]);