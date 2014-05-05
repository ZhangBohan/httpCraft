'use strict';

/* Services */

var apiTalkServices = angular.module('apiTalkServices', []);

apiTalkServices.factory('UrlHelper', [
    function(){
        return {
            httpFix: function(url) {
                return new RegExp("^[http://|https://]").test(url) ? url : "http://" + url;
            },

            urlParamConvert: function(urlParamArray) {
                var obj = {};
                for (var i = 0; i < urlParamArray.length; ++i)  {
                    var urlParam = urlParamArray[i];
                    obj[urlParam.key] = urlParam.value;
                }

                return obj;
            }
        }
    }]);

apiTalkServices.factory('HtmlHelper', [ '$sce',
    function($sce){
        return function(content) {
            if(!(typeof content == 'string')) {
                content = JSON.stringify(content);
            }

            return $sce.trustAsHtml(content);
        }
    }]);

apiTalkServices.factory('RequestStorage', ['$q', '$rootScope', '$timeout', function($q, $rootScope, $timeout) {
    return {
        default: {
            "name": "Name",
            "desc": "Desc",
            "url": "https://api.douban.com/v2/book/1220562",
            "urlParams": [{}],
            "requestMethod": "GET",
            "data": ""
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
                            result = defaultValue;
                        }
                        deferred.resolve(result);
                    });
                });
            });
            console.debug('has get data!');
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

            console.debug('has set data!');
            return deferred.promise;
        }
    }
}]) ;
