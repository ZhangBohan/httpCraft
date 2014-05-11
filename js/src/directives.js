'use strict';

/* Services */

var httpCraftDirectives = angular.module('httpCraftDirectives', []);

httpCraftDirectives.directive('statusLabel', function() {
    return {
        restrict: 'E',
        scope: {
            status: '=status'
        },

        template: function() {
            var content = '<span class="label label-primary" ng-show="status< 200 || status >= 600">{{status}}</span>';

            content += '<span class="label label-success" ng-show="status>= 200 && status < 300">{{status}}</span>';
            content += '<span class="label label-info" ng-show="status>= 300 && status < 400">{{status}}</span>';
            content += '<span class="label label-warning" ng-show="status>= 400 && status < 500">{{status}}</span>';
            content += '<span class="label label-danger" ng-show="status>= 500 && status < 600">{{status}}</span>';
            return content;
        }
    };
});

httpCraftDirectives.directive('back', function () {
    return {
        restrict: 'E',
        template: '<button class="btn btn-info pull-right">Back</button>',
        scope: {
        },
        link: function(scope, element, attrs) {
            $(element[0]).on('click', function() {
                history.back();
                scope.$apply();
            });
        }
    };
});