/**
 * Created by tomson.ngassa on 9/30/2015.
 */

(function () {

    'use strict';

    function CreateConsent() {
        return {
            restrict: 'AE',
            templateUrl: 'app/consent/tmpl/consent-create-edit.tpl.html',
            controllerAs: 'CreateConsentVm',
            bindToController: true,
            controller: ['ConsentService', function (ConsentService) {
                var CreateConsentVm = this;
                CreateConsentVm.authorize = "Authorize";
                CreateConsentVm.disclosure = "Disclosure";
            }]
        };
    }

    function SelectProvider($modal, ProviderService, ConsentService) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'app/consent/tmpl/consent-select-provider.tpl.html',
            require: '?ngModel',
            scope: {
                modaltitle: "="
            },
            bindToController: true,
            controllerAs: 'SelectProviderVm',
            controller: ['$scope', 'ConsentService', '$modal', 'ProviderService', function ($scope, ConsentService, $modal, ProviderService) {
                var SelectProviderVm = this;
                //SelectProviderVm.selectedProviders = ConsentService.getSelectedProviders();

                SelectProviderVm.fieldplaceholder = SelectProviderVm.modaltitle === 'Authorize' ? "The following individual or organization" : "To disclose my information to";

                ProviderService.getProviders(function (response) {
                    SelectProviderVm.providers = response;
                }, function (error) {
                    console.log("Error: in getting providers");
                });

                function SelectProviderModalController($scope, $modalInstance, notificationService, data, ProviderService, ConsentService) {

                    $scope.selectedProviders = ConsentService.getSelectedProviders();

                    $scope.title = data.modalTitle;
                    $scope.consent = {
                        selectedProviders: []
                    };
                    $scope.providerData = ConsentService.prepareProviderList($scope.selectedProviders, data.providers);

                    $scope.isOrganizationProvider = function (provider) {
                        return ProviderService.isOrganizationProvider(provider);
                    };

                    $scope.isIndividualProvider = function (provider) {
                        return ProviderService.isIndividualProvider(provider);
                    };

                    $scope.ok = function () {
                        ConsentService.setSelectedProviders($scope.consent.selectedProviders);
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }

                SelectProviderVm.openSelectProviderModal = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'app/consent/tmpl/consent-select-provider-modal.tpl.html',

                        resolve: {
                            data: function () {
                                return {
                                    modalTitle: SelectProviderVm.modaltitle,
                                    providers: SelectProviderVm.providers
                                };
                            }
                        },
                        controller: SelectProviderModalController
                    });
                };
            }],
        };
    }

    function MedicalInformation($modal, ConsentService) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'app/consent/tmpl/consent-medical-information.tpl.html',
            require: '?ngModel',
            scope: {
                data: "="
            },
            bindToController: true,
            controllerAs: 'MedicalInformationVm',
            controller: ['$scope', 'ConsentService', '$modal', function ($scope, ConsentService, $modal) {
                var MedicalInformationVm = this;


                ConsentService.getMedicalSection(function (response) {
                    MedicalInformationVm.medicatlSections = response;
                }, function (error) {
                    console.log("Error: in getting providers");
                });

                ConsentService.getSensitivityPolicies(function (response) {
                    MedicalInformationVm.sensitivityPolicies = response;
                }, function (error) {
                    console.log("Error: in getting providers");
                });


                function MedicalInformationModalController($scope, $modalInstance, data) {
                    $scope.mediactionSections = data.mediactionSections;

                    $scope.sensitivityPolicies = data.sensitivityPolicies;


                    $scope.consent = {selectedMedicalSections: [], selectedSensitivityPolicies: []};


                    $scope.selectAllMedicalSections = function () {
                        for (var i = 0; i < $scope.mediactionSections.length; i++) {
                            $scope.consent.selectedMedicalSections.push($scope.mediactionSections[i].code);
                        }
                    };

                    $scope.deselectAllMedicalSections = function () {
                        $scope.consent.selectedMedicalSections = [];
                    };

                    $scope.selectAllSensitivityPolicies = function () {
                        for (var i = 0; i < $scope.sensitivityPolicies.length; i++) {
                            $scope.consent.selectedSensitivityPolicies.push($scope.sensitivityPolicies[i].code);
                        }
                    };

                    $scope.deselectAllSensitivityPolicies = function () {
                        $scope.consent.selectedSensitivityPolicies = [];
                    };


                    $scope.ok = function () {
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }

                MedicalInformationVm.openPrivacySettingsModal = function () {


                    var modalInstance = $modal.open({
                        templateUrl: 'app/consent/tmpl/consent-medical-information-modal.tpl.html',

                        resolve: {
                            data: function () {
                                return {
                                    mediactionSections: MedicalInformationVm.medicatlSections,
                                    sensitivityPolicies: MedicalInformationVm.sensitivityPolicies
                                };
                            }
                        },
                        controller: MedicalInformationModalController
                    });
                };
            }],
        };
    }

    function PurposeOfUse(ConsentService, $modal) {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'app/consent/tmpl/consent-purpose-of-use.tpl.html',
            require: '?ngModel',
            bindToController: true,
            controllerAs: 'PurposeOfUseVm',
            controller: ['$scope', 'ConsentService', '$modal', function ($scope, ConsentService, $modal) {
                var PurposeOfUseVm = this;

                ConsentService.getPurposeOfUse(function (response) {
                    PurposeOfUseVm.data = response;
                }, function (error) {
                    console.log("Error: in getting providers");
                });

                PurposeOfUseVm.setSelectecPurposeOfuse = function (purposeOfUse) {
                    console.log("Setting purose of use: " + purposeOfUse);
                };

                function PurposeOfUseModalController($scope, $modalInstance, data) {
                    $scope.data = data;
                    $scope.consent = {
                        selectedPurposeOfUse: []
                    };

                    $scope.selectAll = function () {
                        for (var i = 0; i < $scope.data.length; i++) {
                            $scope.consent.selectedPurposeOfUse.push($scope.data[i].code);
                        }
                    };

                    $scope.deselectAll = function () {
                        $scope.consent.selectedPurposeOfUse = [];
                    };

                    $scope.ok = function () {
                        PurposeOfUseVm.setSelectecPurposeOfuse($scope.consent.selectedPurposeOfUse);
                        $modalInstance.close();
                    };

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                }

                PurposeOfUseVm.openSelectPurposeModal = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'app/consent/tmpl/consent-purpose-of-use-modal.tpl.html',

                        resolve: {
                            data: function () {
                                return PurposeOfUseVm.data;
                            }
                        },
                        controller: PurposeOfUseModalController
                    });
                };
            }],
        };
    }

    function ConsentTerm() {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: 'app/consent/tmpl/consent-term.tpl.html',
            require: '?ngModel',
            bindToController: true,
            controllerAs: 'ConsentTermVm',
            controller: ['$scope', function ($scope) {
                var ConsentTermVm = this;
            }]
        };
    }

    function ConsentCard() {
        var directive = {
            scope: {consent: '='},
            restrict: 'E',
            templateUrl: 'app/consent/tmpl/consent-card.tpl.html',
            controller: ['$modal', 'ConsentService', ConsentCardController],
            controllerAs: 'ConsentCardVm'
        };
        return directive;

        function ConsentCardController($modal, ConsentService) {
            var ConsentCardVm = this;
            ConsentCardVm.openManageConsentModal = openManageConsentModal;
            ConsentCardVm.consentState = ConsentService.resolveConsentState;
            ConsentCardVm.isShareAll = ConsentService.isShareAll;
            ConsentCardVm.notDisclosedItems = notDisclosedItems;
            ConsentCardVm.purposeOfUseItems = purposeOfUseItems;

            function openManageConsentModal(consent) {
                $modal.open({
                    templateUrl: 'app/consent/tmpl/consent-list-manage-options-modal-' + ConsentService.resolveConsentState(consent) + '.tpl.html',
                    controller: ['$state', '$modalInstance', 'consent', ManageConsentModalController],
                    controllerAs: 'ManageConsentModalVm',
                    resolve: {
                        consent: function () {
                            return consent;
                        }
                    }
                });
            }

            function ManageConsentModalController($state, $modalInstance, consent) {
                var ManageConsentModalVm = this;
                ManageConsentModalVm.cancel = cancel;
                ManageConsentModalVm.revoke = revoke;

                function cancel() {
                    $modalInstance.dismiss('cancel');
                }

                function revoke() {
                    $state.go('consent.revoke', {consent: consent});
                    $modalInstance.close();
                }
            }

            function notDisclosedItems(consent) {
                return [].concat(consent.doNotShareClinicalDocumentSectionTypeCodes).concat(consent.doNotShareSensitivityPolicyCodes).join(', ');
            }

            function purposeOfUseItems(consent) {
                return consent.shareForPurposeOfUseCodes.join(', ');
            }
        }
    }

    function ConsentCardList() {
        var directive = {
            restrict: 'E',
            scope: {},
            templateUrl: 'app/consent/tmpl/consent-card-list.tpl.html',
            controller: ['ConsentService', 'notificationService', 'utilityService', ConsentCardListController],
            controllerAs: 'ConsentCardListVm'
        };
        return directive;

        function ConsentCardListController(ConsentService, notificationService, utilityService) {
            var ConsentCardListVm = this;
            var oldPage = 1;
            ConsentCardListVm.consentList = {};
            ConsentCardListVm.pagination = {totalItems: 0, currentPage: oldPage, itemsPerPage: 5, maxSize: 10};
            ConsentCardListVm.loadPage = loadPage;

            ConsentCardListVm.loadPage();

            function updatePagination(response) {
                ConsentCardListVm.pagination.totalItems = response.totalItems;
                ConsentCardListVm.pagination.currentPage = response.currentPage;
                ConsentCardListVm.pagination.itemsPerPage = response.itemsPerPage;
            }

            function success(response) {
                oldPage = response.currentPage;
                updatePagination(response);
                ConsentCardListVm.consentList = response;
                utilityService.scrollTo('content_wrapper');
            }

            function error(response) {
                notificationService.error('Failed to get the consent list, please try again later...');
            }

            function loadPage() {
                var newPage = ConsentCardListVm.pagination.currentPage;
                ConsentCardListVm.pagination.currentPage = oldPage;
                ConsentService.listConsent(newPage, success, error);
            }
        }
    }

    angular.module("app.consentDirectives",
        [
            'app.consentServices',
            'app.providerService',
            'app.providerFiltersModule',
            'checklist-model'
        ])
        .directive('createConsent', CreateConsent)
        .directive('consentCard', ConsentCard)
        .directive('consentCardList', ConsentCardList)
        .directive('selectProvider', SelectProvider)
        .directive('medicalInformation', MedicalInformation)
        .directive('purposeOfUse', PurposeOfUse)
        .directive('consentTerm', ConsentTerm);
})();