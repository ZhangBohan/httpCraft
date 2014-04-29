function APICtrl($scope, $http) {
    $scope.url = 'http://chassis.appchina.com:8080/chassis/safety/result' +
        '?md5=888b80cedbac7cf2bb734bdeb70065a0&callback=JSON_CALLBACK';

    $scope.getUrl = function() {
        console.debug('url:', $scope.url);
        $http.get($scope.url).success(function(data, status, headers, config) {
            console.log('data:', data);
            console.log('status:', status);
            console.log('headers:', headers);
            console.log('config:', config);
            $scope.result = data;
        })
    }
}