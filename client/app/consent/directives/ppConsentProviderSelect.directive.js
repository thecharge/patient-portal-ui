
'use strict';

(function () {

    angular
        .module('app.consent')
            .directive('ppConsentProviderSelect', ppConsentProviderSelect);

            /* @ngInject */
            function ppConsentProviderSelect($modal, ProviderService, consentService) {
                var directive =  {
                    restrict: 'E',
                    replace: false,
                    templateUrl: 'app/consent/directives/consentSelectProvider.tpl.html',
                    scope: {
                        modaltitle: "=",
                        providers: "=",
                        ngModel: '='
                    },
                    bindToController: true,
                    controllerAs: 'SelectProviderVm',
                    controller: SelectProviderController
                };

                return directive;
            }

            /* @ngInject */
            function SelectProviderController ($scope, consentService, $modal, ProviderService, notificationService) {
                var SelectProviderVm = this;
                SelectProviderVm.selectedProvider = SelectProviderVm.ngModel;
                SelectProviderVm.fieldplaceholder = SelectProviderVm.modaltitle === 'Authorize' ? "The following individual or organization" : "To disclose my information to";
                SelectProviderVm.openSelectProviderModal = openSelectProviderModal;

                function openSelectProviderModal () {
                    var modalInstance = $modal.open({
                        templateUrl: 'app/consent/directives/consentSelectProviderModal.tpl.html',
                        resolve: {
                            data: function () {
                                return {
                                    modalTitle: SelectProviderVm.modaltitle,
                                    providers: SelectProviderVm.providers,
                                    selectedProvider: SelectProviderVm.selectedProvider
                                };
                            }
                        },
                        controller:[ '$scope', '$modalInstance','notificationService', 'data', 'ProviderService', 'consentService', function SelectProviderModalController($scope, $modalInstance, notificationService, data, ProviderService, consentService) {
                            $scope.title = data.modalTitle;
                            $scope.selectedProvider = getSelectedProvider;
                            $scope.providers = data.providers;
                            $scope.selectedNpi = consentService.getSelectedNpi();
                            $scope.isOrganizationProvider = isOrganizationProvider;
                            $scope.isIndividualProvider = isIndividualProvider;
                            $scope.isSelected = isSelected;
                            $scope.ok = ok;
                            $scope.cancel = cancel;

                            function getSelectedProvider(){
                                return {npi: ((data.selectedProvider !== null) && angular.isDefined(data.selectedProvider) && angular.isDefined(data.selectedProvider.npi)) ? data.selectedProvider.npi : ''};
                            }

                            function isOrganizationProvider (provider) {
                                return ProviderService.isOrganizationProvider(provider);
                            }

                            function isIndividualProvider(provider) {
                                return ProviderService.isIndividualProvider(provider);
                            }

                            function isSelected (npi) {
                                if ($scope.title === 'Authorize') {
                                    return ($scope.selectedNpi.discloseNpi === npi);
                                } else if ($scope.title === 'Disclosure') {
                                    return ($scope.selectedNpi.authorizeNpi === npi);
                                }
                            }

                            function ok () {
                                $modalInstance.close();
                                var selectedProvider = ProviderService.getProviderByNPI($scope.providers, $scope.selectedProvider.npi);
                                SelectProviderVm.ngModel = selectedProvider;
                                SelectProviderVm.selectedProvider = selectedProvider;

                                if ($scope.title === 'Authorize') {
                                    consentService.setAuthorizeNpi(selectedProvider.npi);
                                } else {
                                    consentService.setDiscloseNpi(selectedProvider.npi);
                                }
                            }

                            function cancel () {
                                $modalInstance.dismiss('cancel');
                            }
                        }]

                    });
                }
            }
})();