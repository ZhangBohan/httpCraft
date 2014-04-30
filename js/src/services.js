'use strict';

/* Services */

var apiTalkServices = angular.module('apiTalkServices', []);

apiTalkServices.factory('UrlHelper', [
    function(){
        return function(url) {
            return new RegExp("^[http://|https://]").test(url) ? url : "http://" + url;
        }
    }]);
