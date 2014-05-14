var httpCraft = angular.module('httpCraft', [
    'ui.bootstrap', 'ngRoute', 'httpCraftControllers', 'httpCraftServices', 'httpCraftDirectives'
]).run(function ($rootScope) {
    $rootScope.alerts = [];

    $rootScope.requestMethods = {
        GET: {name: 'GET', css: 'label-success'},
        POST:{name: 'POST', css: 'label-primary'},
        PUT: {name: 'PUT', css: 'label-info'},
        DELETE: {name: 'DELETE', css: 'label-danger'}
    };

    $rootScope.currentKey = 'cRequest';
    $rootScope.historyKey = 'historyRequests';
    $rootScope.saveKey = 'savedRequests';
});

httpCraft.
    filter('markdown', function ($sce) {
        var converter = new Showdown.converter();
        return function (value) {
            var html = converter.makeHtml(value || '');
            return $sce.trustAsHtml(html);
        };
    });

httpCraft.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/save', {
                templateUrl: 'src/save.html',
                controller: 'NewAPICtrl'
            }).
            otherwise({
                templateUrl: 'src/main.html',
                controller: 'APICtrl'
            });
    }]);