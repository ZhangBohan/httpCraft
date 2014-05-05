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

apiTalkServices.factory('Storage', ['$q', function($q) {
    return {
        defaultRequest: {
            "name": "Name",
            "desc": "Desc",
            "url": "guides.appchina.com/guide/apps/4",
            "urlParams": [{}],
            "requestMethod": "GET"
        },

        get: function(key) {
            chrome.storage.sync.get(key, function(value) {
                return value;
            });
        },

        set: function(key, value) {
            var a = {};
            a[key] = value;
            chrome.storage.sync.set(a, function() {});
        }
    }
}]) ;
