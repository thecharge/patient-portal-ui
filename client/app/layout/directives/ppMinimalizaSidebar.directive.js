(function () {
    'use strict';

    angular
        .module('app.layout')
            .directive('ppMinimalizaSidebar', ppMinimalizaSidebar);

            /**
             * @ngInject
             */
            function ppMinimalizaSidebar($timeout) {
                var directive =  {
                    restrict: 'A',
                    scope: {
                        togglesidebar: "&"
                    },
                    templateUrl: 'app/layout/directives/minimalizaSidebar.html',
                    controllerAs: 'minimalizaSidebarVm',
                    bindToController: true,
                    controller: MinimalizaSidebarController

                };

                return directive;

                function MinimalizaSidebarController ($scope, $element) {
                    var vm = this;

                    vm.minimalize = function () {

                        vm.togglesidebar();

                        // Side Navbar
                        $("body").toggleClass("mini-navbar");

                        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                            // Hide menu in order to smoothly turn on when maximize menu
                            $('#side-menu').hide();
                            // For smoothly turn on menu
                            setTimeout(
                                function () {
                                    $('#side-menu').fadeIn(500);
                                }, 100);
                        } else if ($('body').hasClass('fixed-sidebar')) {
                            $('#side-menu').hide();
                            setTimeout(
                                function () {
                                    $('#side-menu').fadeIn(500);
                                }, 300);
                        } else {
                            // Remove all inline style from jquery fadeIn function to reset menu state
                            $('#side-menu').removeAttr('style');
                        }
                    };
                }
            }

})();