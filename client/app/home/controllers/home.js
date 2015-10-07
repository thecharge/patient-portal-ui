﻿
(function () {

    'use strict';

    /**
     * Home config function
     *
     * @param $stateProvider
     */
    function config($stateProvider){

        $stateProvider
            .state('index', {
                abstract: true,
                url: '/index',
                data: { pageTitle: 'Home' },
                templateUrl: 'common/tmpl/content.tpl.html'
            })
            .state('index.home', {
                url: '/home',
                templateUrl: 'app/home/tmpl/home.tpl.html',
                data: { pageTitle: 'Home' },
                controllerAs: "HomeVm",
                controller: 'HomeController'
                });
    }

    /**
     * The home controller
     *
     * @param {Object} $scope - The Angularjs scope
     */
    function HomeController($scope, utilityService){
        var homeVm = this;
    }

    /**
     * Manages the home page
     */
    angular.module("app.homeModule",
        [
            'ui.router',
            'app.servicesModule'
        ])
        .config(config)
        .controller('HomeController',HomeController);

})();