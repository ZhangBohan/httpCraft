var httpCraftControllers = angular.module('httpCraftControllers', []);

httpCraftControllers.controller('APICtrl', ['$scope', '$http', 'HttpUtils',
        'HtmlHelper', 'RequestStorage', 'UUID',
    function($scope, $http, HttpUtils, HtmlHelper, RequestStorage, UUID) {
        var currentKey = 'currentRequest';
        var historyKey = 'historyRequests';
        var saveKey = 'savedRequests';

        RequestStorage.getData(currentKey, RequestStorage.defaultRequest).then(function(currentRequest) {
            $scope.currentRequest = currentRequest;
        });

        RequestStorage.getData(historyKey, []).then(function(historyRequests) {
            $scope.historyRequests = historyRequests;
        });


        $scope.requestMethods = {
            GET: {name: 'GET', css: 'label-success'},
            POST:{name: 'POST', css: 'label-primary'},
            PUT: {name: 'PUT', css: 'label-info'},
            DELETE: {name: 'DELETE', css: 'label-danger'}
        };

        $scope.radioModel = 'Raw';
        $scope.urlParams = [{}];

        $scope.send = function() {
            $('#btn-send').button('loading');
            console.debug('tabs', $scope.tabs);
            HttpUtils.send($scope.currentRequest).then(function(result) {
                console.debug('result:', result);
                $scope.result = result.data;
                $scope.resultHtml = HtmlHelper(result.data);
                $scope.headers = result.headers;
                $scope.status = result.status;
                $('#btn-send').button('reset');

                RequestStorage.setData('currentRequest', $scope.currentRequest);
                RequestStorage.getData(historyKey, []).then(function(historyRequests) {
                    console.log('hrs:', historyRequests, 'key:', historyKey);
                    $scope.currentRequest.createdAt = new Date().getTime();
                    historyRequests.push($scope.currentRequest);
                    $scope.historyRequests = historyRequests;
                    RequestStorage.setData(historyKey, historyRequests);
                });
            }, function(reason) {
                $('#btn-send').button('reset');
            });
        };

        $scope.changeMethod = function(methodName) {
            $scope.currentRequest.method = methodName;
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

        $scope.changeFormParam = function(index) {
            // auto add form
            if(index + 1 == $scope.currentRequest.formParams.length) {
                $scope.currentRequest.formParams.push({});
            }
        };

        $scope.delFormParams = function(index) {
            $scope.currentRequest.formParams.splice(index, 1);
            if($scope.currentRequest.formParams.length == 0) {
                $scope.currentRequest.formParams.push({});
            }
        };

        $scope.reset = function() {
            $scope.currentRequest = angular.copy(RequestStorage.defaultRequest);
        };

        $scope.clickHistory = function(request) {
            $scope.currentRequest = angular.copy(request);
            console.debug('request:', request, '$scope.currentRequest:', $scope.currentRequest);
        };

        $scope.saveRequest = function() {
            RequestStorage.get(saveKey, []).then(function(requests) {
                $scope.currentRequest.createdAt = new Date().getTime();
                $scope.currentRequest.uuid = UUID.newUUID();
                requests.push($scope.currentRequest);
            });
        };
}]);