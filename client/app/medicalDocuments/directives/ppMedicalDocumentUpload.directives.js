/**
 * Created by jiahao.li on 12/11/2015.
 */
(function () {
    'use strict';

    angular
        .module('app.medicalDocument')
        .directive('ppMedicalDocumentsUpload', ppMedicalDocumentsUpload);

    function ppMedicalDocumentsUpload() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/medicalDocuments/directives/medicalDocumentUpload.html',
            scope: {},
            controllerAs: 'MedicalDocumentsUploadVm',
            bindToController: true,
            controller: ['$state', 'medicalDocumentsService', 'notificationService',
                function ($state, medicalDocumentsService, notificationService) {
                    var vm = this;
                    vm.extension = /\.xml$/;

                    var prepareMedicalDocument = function () {
                        var medicalDocument = {
                            file: vm.medicalFile,
                            name: vm.name,
                            description: vm.description,
                            documentType: vm.documentType
                        };
                        return medicalDocument;
                    };

                    vm.uploadDocument = function () {
                        var medicalDocument = prepareMedicalDocument();

                        if(angular.isUndefined(medicalDocument.description)) {
                            medicalDocument.description = '';
                        }

                        medicalDocumentsService.uploadMedicalDocument(medicalDocument)
                            .then(function () {
                                $state.go($state.current, {}, {reload: true});
                                notificationService.success('Success in uploading medical document');
                            }, function () {
                                notificationService.error('Error in uploading medical document');
                            }
                        );
                        console.log(medicalDocument);
                    };
                }]
        };
    }
})();