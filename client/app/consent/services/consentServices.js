/**
 * Created by tomson.ngassa on 9/30/2015.
 */

(function () {
    'use strict';

    function ConsentService($resource, ENVService) {
        var consentResource = $resource(ENVService.pcmApiBaseUrl + "/consents/pageNumber/:pageNumber", {pageNumber: '@pageNumber'});
        var purposeOfUseResource = $resource(ENVService.pcmApiBaseUrl + "/purposeOfUse");
        var medicationSectionResource = $resource(ENVService.pcmApiBaseUrl + "/medicalSection");
        var sensitvityPolicyResource = $resource(ENVService.pcmApiBaseUrl + "/sensitivityPolicy");

        var selectedProvider = [];

        //To be refactore
        var hasNPI = function (list, npi) {
            for (var j = 0; j < list.length; j++) {
                if (npi === list[j]) {
                    return true;
                }
            }
            return false;
        };

        return {


            createConsent: function (consent, success, error) {

            },

            deleteConsent: function (id, success, error) {

            },

            updateConsent: function (consent, success, error) {
            },

            listConsent: function (page, success, error) {
                var consentList = {
                    totalItems: 20,
                    itemsPerPage: 5,
                    currentPage: 0,
                    consents: [{
                        "id": "1",
                        "toDiscloseName": ["VAN DONGEN, MONICA"],
                        "isMadeToName": ["GRIMES, MICHAEL"],
                        "doNotShareClinicalDocumentTypeCodes": [],
                        "doNotShareClinicalDocumentSectionTypeCodes": ["Medications", "Allergies"],
                        "doNotShareSensitivityPolicyCodes": ["Mental health information sensitivity", "HIV/AIDS information sensitivity"],
                        "shareForPurposeOfUseCodes": ["Payment", "Emergency Treatment", "Healthcare Treatment"],
                        "doNotShareClinicalConceptCodes": [],
                        "consentStage": "CONSENT_SAVED",
                        "revokeStage": "NA",
                        "consentStart": 1404446399000,
                        "consentEnd": 1437537600000,
                        "consentStartString": null,
                        "consentEndString": null,
                        "medicalInformationNotDisclosed": true
                    }, {
                        "id": "2",
                        "toDiscloseName": ["GRIMES, MICHAEL", "NEVAEH LLC", "CARLSON, GEORGE"],
                        "isMadeToName": ["VAN DONGEN, MONICA", "LUQUIN, TERESA", "MASTER CARE, INC."],
                        "doNotShareClinicalDocumentTypeCodes": [],
                        "doNotShareClinicalDocumentSectionTypeCodes": [],
                        "doNotShareSensitivityPolicyCodes": ["Mental health information sensitivity", "HIV/AIDS information sensitivity"],
                        "shareForPurposeOfUseCodes": ["Payment", "Emergency Treatment", "Healthcare Treatment"],
                        "doNotShareClinicalConceptCodes": [],
                        "consentStage": "CONSENT_SIGNED",
                        "revokeStage": "REVOCATION_NOT_SUBMITTED",
                        "consentStart": 1404446399000,
                        "consentEnd": 1437537600000,
                        "consentStartString": null,
                        "consentEndString": null,
                        "medicalInformationNotDisclosed": true
                    }, {
                        "id": "3",
                        "toDiscloseName": ["GRIMES, MICHAEL", "NEVAEH LLC", "CARLSON, GEORGE"],
                        "isMadeToName": ["VAN DONGEN, MONICA", "LUQUIN, TERESA", "MASTER CARE, INC."],
                        "doNotShareClinicalDocumentTypeCodes": [],
                        "doNotShareClinicalDocumentSectionTypeCodes": [],
                        "doNotShareSensitivityPolicyCodes": ["Mental health information sensitivity", "HIV/AIDS information sensitivity"],
                        "shareForPurposeOfUseCodes": ["Payment", "Emergency Treatment", "Healthcare Treatment"],
                        "doNotShareClinicalConceptCodes": [],
                        "consentStage": "CONSENT_SIGNED",
                        "revokeStage": "REVOCATION_REVOKED",
                        "consentStart": 1404446399000,
                        "consentEnd": 1437537600000,
                        "consentStartString": null,
                        "consentEndString": null,
                        "medicalInformationNotDisclosed": true
                    }, {
                        "id": "4",
                        "toDiscloseName": ["GRIMES, MICHAEL", "NEVAEH LLC", "CARLSON, GEORGE"],
                        "isMadeToName": ["VAN DONGEN, MONICA", "LUQUIN, TERESA", "MASTER CARE, INC."],
                        "doNotShareClinicalDocumentTypeCodes": [],
                        "doNotShareClinicalDocumentSectionTypeCodes": [],
                        "doNotShareSensitivityPolicyCodes": ["Mental health information sensitivity", "HIV/AIDS information sensitivity"],
                        "shareForPurposeOfUseCodes": ["Payment", "Emergency Treatment", "Healthcare Treatment"],
                        "doNotShareClinicalConceptCodes": [],
                        "consentStage": "CONSENT_SIGNED",
                        "revokeStage": "NA",
                        "consentStart": 1404446399000,
                        "consentEnd": 1437537600000,
                        "consentStartString": null,
                        "consentEndString": null,
                        "medicalInformationNotDisclosed": true
                    }, {
                        "id": "5",
                        "toDiscloseName": ["GRIMES, MICHAEL", "NEVAEH LLC", "CARLSON, GEORGE"],
                        "isMadeToName": ["VAN DONGEN, MONICA", "LUQUIN, TERESA", "MASTER CARE, INC."],
                        "doNotShareClinicalDocumentTypeCodes": [],
                        "doNotShareClinicalDocumentSectionTypeCodes": [],
                        "doNotShareSensitivityPolicyCodes": [],
                        "shareForPurposeOfUseCodes": ["Payment", "Emergency Treatment", "Healthcare Treatment"],
                        "doNotShareClinicalConceptCodes": [],
                        "consentStage": "CONSENT_SAVED",
                        "revokeStage": "NA",
                        "consentStart": 1404446399000,
                        "consentEnd": 1437537600000,
                        "consentStartString": null,
                        "consentEndString": null,
                        "medicalInformationNotDisclosed": true
                    }
                    ]
                };

                //consentList.currentPage = page - 1;
                adjustPageOnSuccessResponse(consentList);

                function adjustPageOnSuccessResponse(response) {
                    if (angular.isDefined(response.currentPage) && angular.isNumber(response.currentPage)) {
                        response.currentPage += 1;
                    }
                    (success || angular.identity)(response);
                }

                //consentResource.query({pageNumber: page-1}, adjustPageOnSuccessResponse, error);
            },

            setSelectedProviders: function (provider) {
                selectedProvider = provider;
            },

            getSelectedProviders: function (provider) {
                return selectedProvider;
            },

            prepareProviderList: function (selectedProviders, providers) {
                var providerList = [];
                for (var i = 0; i < providers.length; i++) {
                    if (hasNPI(selectedProviders, providers[i].npi)) {
                        providerList.push({isDisabled: true, provider: providers[i]});
                    } else {
                        providerList.push({isDisabled: false, provider: providers[i]});
                    }
                }
                return providerList;
            },

            resolveConsentState: function (consent) {
                var state = 'error';
                if (consent.consentStage === 'CONSENT_SAVED' && consent.revokeStage === 'NA') {
                    state = 'saved';
                } else if (consent.consentStage === 'CONSENT_SIGNED' && consent.revokeStage === 'REVOCATION_NOT_SUBMITTED') {
                    state = 'signed';
                } else if (consent.consentStage === 'CONSENT_SIGNED' && consent.revokeStage === 'REVOCATION_REVOKED') {
                    state = 'revoked';
                }
                return state;
            },

            isShareAll: function (consent) {
                return isEmptyArray(consent.doNotShareClinicalDocumentSectionTypeCodes) && isEmptyArray(consent.doNotShareSensitivityPolicyCodes);

                function isEmptyArray(o) {
                    return angular.isUndefined(o) || !angular.isArray(o) || o.length === 0;
                }
            },

            getPurposeOfUse: function (success, error) {
                purposeOfUseResource.query(success, error);
            },
            getMedicalSection: function (success, error) {
                medicationSectionResource.query(success, error);
            },
            getSensitivityPolicies: function (success, error) {
                sensitvityPolicyResource.query(success, error);
            },

        };
    }

    /**
     * The provider service
     *
     */
    angular.module("app.consentServices", ['ngResource', 'app.config'])
        .factory('ConsentService', ConsentService);
})();


