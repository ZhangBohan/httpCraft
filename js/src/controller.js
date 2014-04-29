var apiTalk = angular.module('apiTalk', ['ui.bootstrap']);

apiTalk.controller('APICtrl', function($scope, $http) {

    $scope.requestMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    $scope.requestMethod = 'GET';

    $scope.url = 'http://guides.appchina.com/guide/apps/4';
    $scope.requestParams = [];

    $scope.send = function() {
        $('#btn-send').button('loading');
        console.debug('url:', $scope.url);
        $http({method: $scope.requestMethod, url: $scope.url, config: {

        }}).success(function(data, status, headers, config) {
            console.log('data:', data);
            console.log('status:', status);
            console.log('headers:', headers());
            console.log('config:', config);
            $scope.result = data;
            $scope.headers = headers();
            $scope.status = status;
            $('#btn-send').button('reset');
        }).error(function(data, status, headers, config) {
            console.log('data:', data);
            console.log('status:', status);
            console.log('headers:', headers());
            console.log('config:', config);
            $scope.result = data;
            $scope.headers = headers();
            $scope.status = status;
            $('#btn-send').button('reset');
        });
    };

    $scope.changeMethod = function(methodName) {
        $scope.requestMethod = methodName;
    }
});