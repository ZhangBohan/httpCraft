var apiTalk = angular.module('apiTalk', ['ui.bootstrap']);

apiTalk.controller('APICtrl', function($scope, $http) {
    $scope.url = 'http://guides.appchina.com/guide/apps/4';

    $scope.getUrl = function() {
        console.debug('url:', $scope.url);
        $http({method: 'GET', url: $scope.url, config: {

        }}).success(function(data, status, headers, config) {
            console.log('data:', data);
            console.log('status:', status);
            console.log('headers:', headers());
            console.log('config:', config);
            $scope.result = data;
            $scope.headers = headers();
            $scope.status = status;
        })
    }
});