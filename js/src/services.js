'use strict';

/* Services */

var httpCraftServices = angular.module('httpCraftServices', []);

httpCraftServices.factory("UUID", function () {
    return {
        newUUID: function () {
            // http://www.ietf.org/rfc/rfc4122.txt
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            return s.join("");
        }
    }
});

httpCraftServices.factory('UrlHelper', [
    function(){
        return {
            urlFix: function(url) {
                return new RegExp("^[http://|https://]").test(url) ? url : "http://" + url;
            },

            urlParamConvert: function(urlParamArray) {
                var obj = {};
                for (var i = 0; i < urlParamArray.length; ++i)  {
                    var urlParam = urlParamArray[i];
                    if(urlParam.key != undefined) {
                        obj[urlParam.key] = urlParam.value;
                    }
                }

                return obj;
            },

            urlValidate: function(url) {
                return url && url.trim() != '';
            }
        }
    }]);

httpCraftServices.factory('HtmlHelper', [ '$sce',
    function($sce){
        return function(content) {
            if(!(typeof content == 'string')) {
                content = JSON.stringify(content);
            }

            return $sce.trustAsHtml(content);
        }
    }]);

httpCraftServices.factory('RequestStorage', ['$q', '$rootScope', '$timeout', function($q, $rootScope, $timeout) {
    return {
        defaultRequest: {
            "name": "",
            "description": "",
            "url": "",
            "urlParams": [{}],
            "headers": [],
            "method": "GET",
            "tabName": "x-www-form-urlencoded",
            "data": "",
            "formParams": [{}],
            "xFormParams": [{}],
            "responseData": {}
        },

        getData: function(key, defaultValue) {
            var deferred = $q.defer();

            chrome.storage.sync.get(key, function(value) {
                $timeout(function() {
                    $rootScope.$apply(function () {
                        var result = value[key];
                        console.debug('get from storage:', result, 'key:', key);
                        if(!result) {
                            console.debug('init from defaultValue:', defaultValue);
                            result = angular.copy(defaultValue);
                        }
                        deferred.resolve(result);
                    });
                });
            });
            return deferred.promise;
        },

        setData: function(key, value) {
            var deferred = $q.defer();

            console.debug('set data, key:', key, ', value:', value);
            var a = {};
            a[key] = value;
            chrome.storage.sync.set(a, function() {
                $timeout(function() {
                    $rootScope.$apply(function () {
                        deferred.resolve();
                    });
                });

            });

            return deferred.promise;
        },

        setArrayData: function(arrayData) {
            var deferred = $q.defer();

            console.debug('set arrayData:', arrayData);
            var a = {};
            for(var i = 0; i < arrayData.length; i++) {
                var data = arrayData[i];
                a[data.key] = data.value;
            }
            console.debug('a', a);
            chrome.storage.sync.set(a, function() {
                $timeout(function() {
                    $rootScope.$apply(function () {
                        deferred.resolve();
                    });
                });

            });

            return deferred.promise;
        }
    }
}]);


httpCraftServices.factory('HttpUtils', [ '$http', '$q', 'UrlHelper',
    function($http, $q, UrlHelper){
        return {
            send: function(request) {
                var deferred = $q.defer();

                var data = request.data;
                var headers = UrlHelper.urlParamConvert(request.headers);
                if(request.method != 'GET' && 'x-www-form-urlencoded' == request.tabName) {
                    console.debug('x-www-form-urlencoded request');
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    data = $.param(UrlHelper.urlParamConvert(request.xFormParams));
                }
                console.debug('request:', request, 'data:', data, 'headers:', headers);
                if(UrlHelper.urlValidate(request.url)) {
                    $http({
                        method: request.method,
                        url: UrlHelper.urlFix(request.url),
                        params: UrlHelper.urlParamConvert(request.urlParams),
                        data: data,
                        headers: headers
                    }).success(function(data, status, headers) {
                        deferred.resolve({
                            data: data,
                            status: status,
                            headers: headers()
                        });
                    }).error(function(data, status, headers) {
                        deferred.resolve({
                            data: data,
                            status: status,
                            headers: headers()
                        });
                    });


                } else {
                    deferred.reject('not validate url!');
                }

                console.debug('promise');
                return deferred.promise;
            }
        }
    }]);