var apiTalk = angular.module('apiTalkControllers', []);

apiTalk.controller('APICtrl', ['$scope', '$http', 'UrlHelper', 'HtmlHelper',
    function($scope, $http, UrlHelper, HtmlHelper) {
        var currentKey = 'currentRequest';
        chrome.storage.sync.get(currentKey, function(result) {
            // The $apply is only necessary to execute the function inside Angular scope
            $scope.$apply(function() {
                console.log("result:", result);
                var currentRequest = result[currentKey];
                if(currentRequest) {
                    $scope.currentRequest = currentRequest;
                } else {
                    $scope.currentRequest = {
                        "name": "Name",
                        "desc": "Desc",
                        "url": "guides.appchina.com/guide/apps/4",
                        "urlParams": [{}],
                        "requestMethod": "GET"
                    };
                    console.log("init", $scope.currentRequest);
                }

                console.log("$scope.currentRequest:", $scope.currentRequest);
            });
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
        }

        $scope.send = function() {
            $('#btn-send').button('loading');
            console.debug('currentRequest:', $scope.currentRequest);
            $http({
                method: $scope.currentRequest.requestMethod,
                url: UrlHelper.httpFix($scope.currentRequest.url),
                params: UrlHelper.urlParamConvert($scope.currentRequest.urlParams)
            }).success(requestCallback).error(requestCallback);

            chrome.storage.sync.set({'currentRequest': $scope.currentRequest});
            var historyKey = 'historyRequests';
            chrome.storage.sync.get(historyKey, function(result) {
                var historyRequests = result[historyKey];
                console.debug('historyRequests:', historyRequests);
                if(!historyRequests) {
                    historyRequests = [];
                }
                historyRequests.push($scope.currentRequest);
                var a = {}; a[historyKey] = historyRequests;
                chrome.storage.sync.set(a);
            });

        };

        $scope.changeMethod = function(methodName) {
            $scope.currentRequest.requestMethod = methodName;
        }

        $scope.changeUrlParam = function(index) {
            // auto add form
            if(index + 1 == $scope.currentRequest.urlParams.length) {
                $scope.currentRequest.urlParams.push({});
            }
        }

        $scope.reset = function() {
            $scope.currentRequest = {
                "name": "Name",
                "desc": "Desc",
                "url": "",
                "urlParams": [{}],
                "requestMethod": "GET"
            }
        }
}]);