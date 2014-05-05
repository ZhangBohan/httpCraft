var apiTalk = angular.module('apiTalkControllers', []);

apiTalk.controller('APICtrl', ['$scope', '$http', 'UrlHelper', 'HtmlHelper', 'RequestStorage',
    function($scope, $http, UrlHelper, HtmlHelper, RequestStorage) {
        var currentKey = 'currentRequest';
        RequestStorage.getData(currentKey, RequestStorage.default).then(function(currentRequest) {
            console.log("result:", currentRequest);
            $scope.currentRequest = currentRequest;
        });


        $scope.requestMethods = ['GET', 'POST', 'PUT', 'DELETE'];

        $scope.radioModel = 'Raw';
        $scope.urlParams = [{}];


        var requestCallback = function(data, status, headers) {
            console.log('data:', data);
            console.log('status:', status);
            console.log('headers:', headers());
            $scope.result = data;
            $scope.resultHtml = HtmlHelper(data);
            $scope.headers = headers();
            $scope.status = status;
            $('#btn-send').button('reset');
        };

        $scope.send = function() {
            $('#btn-send').button('loading');
            console.debug('currentRequest:', $scope.currentRequest, RequestStorage.getData('currentRequest'));
            $http({
                method: $scope.currentRequest.requestMethod,
                url: UrlHelper.httpFix($scope.currentRequest.url),
                params: UrlHelper.urlParamConvert($scope.currentRequest.urlParams),
                data: $scope.currentRequest.data
            }).success(requestCallback).error(requestCallback);

            RequestStorage.setData('currentRequest', $scope.currentRequest);
            var historyKey = 'historyRequests';
            RequestStorage.getData(historyKey, []).then(function(historyRequests) {
                console.log('hrs:', historyRequests, 'key:', historyKey);
                historyRequests.push($scope.currentRequest);
                RequestStorage.setData(historyKey, historyRequests);
            });

        };

        $scope.changeMethod = function(methodName) {
            $scope.currentRequest.requestMethod = methodName;
        };

        $scope.changeUrlParam = function(index) {
            // auto add form
            if(index + 1 == $scope.currentRequest.urlParams.length) {
                $scope.currentRequest.urlParams.push({});
            }
        };

        $scope.delUrlParams = function(index) {
            $scope.currentRequest.urlParams.splice(index, 1);
            if($scope.currentRequest.urlParams.length == 0) {
                $scope.currentRequest.urlParams.push({});
            }
        };

        $scope.reset = function() {
            $scope.currentRequest = RequestStorage.default;
        };
}]);