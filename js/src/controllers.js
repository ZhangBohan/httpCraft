var httpCraftControllers = angular.module('httpCraftControllers', []);

httpCraftControllers.controller('APICtrl', ['$scope', '$http', 'HttpUtils',
        'HtmlHelper', 'RequestStorage', '$location', '$rootScope',
    function($scope, $http, HttpUtils, HtmlHelper, RequestStorage, $location, $rootScope) {

        RequestStorage.getData($rootScope.currentKey, RequestStorage.defaultRequest).then(function(currentRequest) {
            $scope.currentRequest = currentRequest;
        });

        RequestStorage.getData($rootScope.historyKey, []).then(function(historyRequests) {
            $scope.historyRequests = historyRequests;
        });

        RequestStorage.getData($rootScope.saveKey, []).then(function(savedRequests) {
            $scope.savedRequests = savedRequests;
        });

        $scope.radioModel = 'Raw';
        $scope.urlParams = [{}];

        $scope.send = function() {
            $('#btn-send').button('loading');
            HttpUtils.send($scope.currentRequest).then(function(result) {
                console.debug('result:', result);
                $scope.result = result.data;
                $scope.resultHtml = HtmlHelper(result.data);
                $scope.headers = result.headers;
                $scope.status = result.status;
                $('#btn-send').button('reset');

                RequestStorage.setData('currentRequest', $scope.currentRequest);
                RequestStorage.getData($rootScope.historyKey, []).then(function(historyRequests) {
                    console.log('hrs:', historyRequests, 'key:', $rootScope.historyKey);
                    $scope.currentRequest.createdAt = new Date().getTime();
                    historyRequests.push($scope.currentRequest);
                    $scope.historyRequests = historyRequests;
                    RequestStorage.setData($rootScope.historyKey, historyRequests);
                });
            }, function() {
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

        $scope.changeXFormParam = function(index) {
            // auto add form
            if(index + 1 == $scope.currentRequest.xFormParams.length) {
                $scope.currentRequest.xFormParams.push({});
            }
        };

        $scope.delXFormParams = function(index) {
            $scope.currentRequest.xFormParams.splice(index, 1);
            if($scope.currentRequest.xFormParams.length == 0) {
                $scope.currentRequest.xFormParams.push({});
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
            RequestStorage.setData($rootScope.currentKey, $scope.currentRequest);
            $location.path('/save')
        }

}]);


httpCraftControllers.controller('NewAPICtrl', ['$scope', 'RequestStorage', '$location', '$rootScope', 'UUID',
        function ($scope, RequestStorage, $location, $rootScope, UUID) {

            RequestStorage.getData($rootScope.currentKey, RequestStorage.defaultRequest).then(function(currentRequest) {
                $scope.currentRequest = currentRequest;
            });

            RequestStorage.getData($rootScope.historyKey, []).then(function(historyRequests) {
                $scope.historyRequests = historyRequests;
            });

            RequestStorage.getData($rootScope.saveKey, []).then(function(requests) {
                $scope.savedRequests = requests;
            });

            $scope.clickHistory = function(request) {
                $scope.currentRequest = angular.copy(request);
                RequestStorage.setData($rootScope.currentKey, $scope.currentRequest).then(function () {
                    $location.path('/');
                });

            };

            $scope.save = function() {
                console.debug('$scope.currentRequest', $scope.currentRequest);
                RequestStorage.getData($rootScope.saveKey, []).then(function(requests) {
                    if(!$scope.currentRequest.uuid) {
                        $scope.currentRequest.createdAt = new Date().getTime();
                        $scope.currentRequest.uuid = UUID.newUUID();
                    } else {
                        for(var i = 0; i < requests.length; i++) {
                            var request = requests[i];
                            if(request.uuid == $scope.currentRequest.uuid) {
                                request = $scope.currentRequest;
                                break;
                            }
                        }
                    }

                    $scope.currentRequest.updatedAt = new Date().getTime();
                    requests.push($scope.currentRequest);

                    RequestStorage.setData($rootScope.saveKey, requests).then(function () {
                        RequestStorage.setData($rootScope.currentKey, $scope.currentRequest).then(function () {
                            $rootScope.alerts.push({type: 'success', msg: '保存成功'});
                            $location.path('/');
                        })
                    });
                });
            };
        }]
);