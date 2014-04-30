var apiTalk = angular.module('apiTalkControllers', []);

apiTalk.controller('APICtrl', ['$scope', '$http', 'UrlHelper', '$sce',
    function($scope, $http, UrlHelper, $sce) {

    $scope.requestMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    $scope.requestMethod = 'GET';

    $scope.urlParams = [{}];

    $scope.url = 'http://guides.appchina.com/guide/apps/4';
    $scope.radioModel = 'Raw';

    $scope.send = function() {
        $('#btn-send').button('loading');
        console.debug('url:', $scope.url, 'after helper:', UrlHelper($scope.url));
        $http({method: $scope.requestMethod, url: UrlHelper($scope.url), config: {

        }}).success(function(data, status, headers) {
            console.log('data:', data);
            console.log('status:', status);
            console.log('headers:', headers());
            $scope.result = data;
            $scope.headers = headers();
            $scope.status = status;
            $('#btn-send').button('reset');
        }).error(function(data, status, headers) {
            $scope.result = data;
            $scope.resultHtml = $sce.trustAsHtml(data);
            $scope.headers = headers();
            $scope.status = status;
            $('#btn-send').button('reset');

            console.log('data:', data);
            console.log('status:', status);
            console.log('headers:', headers());
            console.log('resultHtml:', $scope.resultHtml);
        });
    };

    $scope.changeMethod = function(methodName) {
        $scope.requestMethod = methodName;
    }

    $scope.changeUrlParam = function(index) {
        // save to urlParams
        $scope.urlParams[index] = {key: $scope.urlKey, value: $scope.urlValue};
        console.log('$scope.urlParams:', $scope.urlParams);

        // auto add form
        if(index + 1 == $scope.urlParams.length) {
            $scope.urlParams.push({});
        }
    }
}]);