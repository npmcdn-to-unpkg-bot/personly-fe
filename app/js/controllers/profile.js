/**
 * Created by MrSingh on 1/17/16.
 */

pmApp.controller('profileCtrl',[ '$scope', '$rootScope','$location','$http','pmAuth','Upload','ENV', function($scope, $rootScope, $location,$http,pmAuth,Upload,ENV){

    pmAuth.validateSession();

    if(!$rootScope.loggedIn){
        $location.path('/login');
    }

    $scope.pageFullyLoaded=false;

    $scope.max = 100;
    $scope.progressPercentage = 0;
    $scope.designUploadSuccess = false;
    $scope.onboardProgress =20;

    $scope.allDesigns = [];


    $scope.profileInit = function () {

        $http.get(ENV.apiUrl + '/api/v1/me')
            .success(function(response){
                console.log(response);

                if(!response.details){
                    $location.url('/profile/image');
                }

                if(response.details && response.details.hobbies.length === 0){
                    $location.url('/profile/hobbies');
                }


            })
            .error(function(response){
                console.log(response);
                $scope.pageFullyLoaded=true;
            });
    };

    if($location.url() == '/profile'){
        $scope.profileInit();
    }

    if($location.url() == '/profile/image'){
        $scope.imageUploadStep = true;
        $scope.pageFullyLoaded = true;
    }

    if($location.url() == '/profile/hobbies'){
        $scope.hobbiesStep = true;
        $scope.onboardProgress = 40;
        $scope.pageFullyLoaded = true;
    }

    if($location.url() == '/profile/interests'){
        $scope.interestsStep = true;
        $scope.onboardProgress = 60;
        $scope.pageFullyLoaded = true;
    }

    if($location.url() == '/profile/username'){
        $scope.usernameStep = true;
        $scope.onboardProgress = 80;
        $scope.pageFullyLoaded = true;
    }


    //*************************************************************************
    //                     /Profile/image-upload
    //*************************************************************************

    $scope.submitImage = function(imageData) {

        if(!imageData || !imageData.description){
            $scope.imageDataError = "All the fields are mandatory.";
            return;
        }

        if(!imageData.phone){
            imageData.phone = '';
        }


        $scope.upload(imageData.file,imageData);
    };

    // upload on file select or drop
    $scope.upload = function (file,imageData) {
        console.log(imageData);
        Upload.upload({
            url: ENV.apiUrl + '/api/v1/profile/image-upload',
            data: {file: file, 'data':imageData}
        }).then(function (res) {
            console.log(res.data);
            if(res.data.success){
                console.log('upload successful');
                $location.url('/profile/hobbies');
            }
            _clearFormData();
        }, function (res) {
            $scope.formLoading = false;
            console.log(res.data.message);
        }, function (evt) {
            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
            if($scope.progressPercentage == 100){
                $scope.formLoading = true;
            }
        });
    };

    function _clearFormData() {
        $scope.design = null;
        $scope.progressPercentage = 0;
        $scope.formLoading = false;
    }
    
    //*************************************************************************
    //                     Submit Hobbies
    //*************************************************************************

    $scope.hobbies = [
        'Reading','Watching TV','Family Time','Going to Movies','Fishing','Computer','Gardening','Renting Movies','Walking','Exercise','Listening to Music','Entertaining','Hunting','Team Sports','Shopping','Traveling','Sleeping','Socializing','Sewing','Golf','Church Activities','Relaxing','Playing Music','Housework','Crafts','Watching Sports','Bicycling','Playing Cards','Hiking','Cooking','Eating Out','Dating Online','Swimming','Camping','Skiing','Working on Cars','Writing','Boating','Motorcycling','Animal Care','Bowling','Painting','Running','Dancing','Horseback Riding','Tennis','Theater','Billiards','Beach','Volunteer Work'
    ];

    $scope.selectedHobbies = [];

    $scope.selectHobby = function (hobby, custom) {
        console.log($scope.selectedHobbies.length);
        if($scope.selectedHobbies.length < 5){
            $scope.selectedHobbies.push(hobby);
            var idx = $scope.hobbies.indexOf(hobby);

            $scope.hobbies.splice(idx,1);

            if(custom){
                $scope.customHobby = '';
            }
        }else{
            $scope.hobbiesError = 'You can only select up to 5 hobbies.'
        }
    }

    $scope.removeHobby = function (hobby) {
        $scope.hobbies.unshift(hobby);
        var idx = $scope.selectedHobbies.indexOf(hobby);

        $scope.selectedHobbies.splice(idx,1);
    }

    $scope.submitHobbies = function () {
        
        var json = JSON.stringify($scope.selectedHobbies);
        
        console.log(json);
        
        $http.post(ENV.apiUrl + '/api/v1/profile/hobbies', json)
            .success(function(response){
                console.log(response);
                $location.url('/profile/interests');
            })
            .error(function(response){
                console.log(response);
            });
    }

    //*************************************************************************
    //                     Submit Interests
    //*************************************************************************

    $scope.interests = [
        'Reading','Watching TV','Family Time','Going to Movies','Fishing','Computer','Gardening','Renting Movies','Walking','Exercise','Listening to Music','Entertaining','Hunting','Team Sports','Shopping','Traveling','Sleeping','Socializing','Sewing','Golf','Church Activities','Relaxing','Playing Music','Housework','Crafts','Watching Sports','Bicycling','Playing Cards','Hiking','Cooking','Eating Out','Dating Online','Swimming','Camping','Skiing','Working on Cars','Writing','Boating','Motorcycling','Animal Care','Bowling','Painting','Running','Dancing','Horseback Riding','Tennis','Theater','Billiards','Beach','Volunteer Work'
    ];

    $scope.selectedInterests = [];

    $scope.selectInterest = function (interest, custom) {
        console.log($scope.selectedInterests.length);
        if($scope.selectedInterests.length < 5){
            $scope.selectedInterests.push(interest);
            var idx = $scope.interests.indexOf(interest);

            $scope.interests.splice(idx,1);

            if(custom){
                $scope.customInterest = '';
            }
        }else{
            $scope.interestsError = 'You can only select up to 5 hobbies.'
        }
    }

    $scope.removeInterest = function (interest) {
        $scope.interests.unshift(interest);
        var idx = $scope.selectedInterests.indexOf(interest);

        $scope.selectedInterests.splice(idx,1);
    }

    $scope.submitInterests = function () {

        var json = JSON.stringify($scope.selectedInterests);

        console.log(json);

        $http.post(ENV.apiUrl + '/api/v1/profile/interests', json)
            .success(function(response){
                console.log(response);
                $location.url('/profile/username');
            })
            .error(function(response){
                console.log(response);
            });
    }

    //*************************************************************************
    //                     Choose username
    //*************************************************************************

    $scope.checkUsername = function () {
        var str = $scope.username;
        str = str.replace(/\s+/g, '-').toLowerCase();

        $scope.usernameShow = str;

        var json = {username : str};

        $http.post(ENV.apiUrl + '/api/v1/profile/check-username', json)
            .success(function(response){
                console.log(response);
                if(response.success){
                    $scope.userAvailable = true;
                }else{
                    $scope.userNotAvailable =true;
                }

            })
            .error(function(response){
                console.log(response);
            });
    }

    $scope.saveUsername = function () {

        $scope.saveUsernameLoading = true;

        var json = {username : $scope.usernameShow};

        $http.post(ENV.apiUrl + '/api/v1/profile/save-username', json)
            .success(function(response){
                console.log(response);
                $location.url('/profile/call-to-action');
            })
            .error(function(response){
                console.log(response);
            });

    }



}]);