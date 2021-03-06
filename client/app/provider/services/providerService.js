/**
 * Created by tomson.ngassa on 9/30/2015.
 */

(function () {
    'use strict';

    angular
        .module("app.provider")
        .factory('providerService', providerService);

    /* @ngInject */
    function providerService($resource, configService, utilityService) {
        var providers = $resource(configService.getPcmApiBaseUrl() + "/providers/:npi", {npi: '@npi'});

        var service = {};

        service.getProvidersResource = getProvidersResource;
        service.deleteProvider = deleteProvider;
        service.addProvider = addProvider;
        service.lookupProviders = lookupProviders;
        service.isEmptyLookupResult = isEmptyLookupResult;
        service.hasNpi = hasNpi;
        service.getLookupResult = getLookupResult;

        return service;

        function getProvidersResource() {
            return providers;
        }

        function deleteProvider(npi, success, error) {
            providers.delete({npi: npi}, success, error);

        }

        function addProvider(npi, success, error) {
            providers.save({npi: npi}, success, error);
        }

        function lookupProviders(plsQueryParameters, page, success, error) {
            var params = {
                state: '@state',
                city: '@city',
                zipcode: '@zipcode',
                gender: '@gender',
                phone: '@phone',
                firstname: '@firstname',
                lastname: '@lastname',
                orgname: '@orgname'
            };

            var patientListResource = $resource(configService.getPlsApiBaseUrl() + "/search/query",
                params,
                {
                    'query': {
                        method: 'GET',
                        params: params
                    }
                }
            );

            var queryParams = prepareQueryParams(plsQueryParameters, page) ;

            function adjustPageOnSuccessResponse(response) {
                if (angular.isDefined(response.page) && angular.isDefined(response.page.number)&& angular.isNumber(response.page.number)) {
                    response.page.number += 1;
                }
                (success || angular.identity)(response);
            }

            patientListResource.query(queryParams,adjustPageOnSuccessResponse, error);
        }

        function getLookupResult(response){
            var result = {};

            if(response){
                if(angular.isDefined(response.page) ){
                    var page = response.page;
                    result.currentPage = page.number;
                    result.totalNumberOfProviders = page.totalElements;
                    result.itemsPerPage = page.size;
                }
                if(!isEmptyLookupResult(response)){
                    result.providers = response._embedded.providers;
                }
            }
            return result;
        }
        function prepareQueryParams(plsQueryParameters, page){
            var queryParams = {projection:"FlattenSmallProvider"};

            if(utilityService.isDefinedAndLengthNotZero(plsQueryParameters.usstate)){
                queryParams.state = utilityService.addQueryParameterPrefixAndSuffix(plsQueryParameters.usstate);
            }
            if(utilityService.isDefinedAndLengthNotZero(plsQueryParameters.city)){
                queryParams.city = utilityService.addQueryParameterPrefixAndSuffix(plsQueryParameters.city);
            }
            if(utilityService.isDefinedAndLengthNotZero(plsQueryParameters.zipcode)){
                queryParams.zipcode = utilityService.addQueryParameterPrefixAndSuffix(plsQueryParameters.zipcode);
            }
            if(utilityService.isDefinedAndLengthNotZero(plsQueryParameters.gender) ){
                queryParams.gender = utilityService.addQueryParameterPrefixAndSuffix(plsQueryParameters.gender);
            }
            if(utilityService.isDefinedAndLengthNotZero(plsQueryParameters.phone)){
                queryParams.phone = utilityService.addQueryParameterPrefixAndSuffix(plsQueryParameters.phone);
            }
            if(utilityService.isDefinedAndLengthNotZero(plsQueryParameters.firstname) ){
                queryParams.firstname = utilityService.addQueryParameterPrefixAndSuffix(plsQueryParameters.firstname);
            }
            if(utilityService.isDefinedAndLengthNotZero(plsQueryParameters.lastname) ){
                queryParams.lastname = utilityService.addQueryParameterPrefixAndSuffix(plsQueryParameters.lastname);
            }
            //Mapping facility name in the UI to organizational name in the backend
            if(utilityService.isDefinedAndLengthNotZero(plsQueryParameters.facilityname) ){
                queryParams.orgname = utilityService.addQueryParameterPrefixAndSuffix(plsQueryParameters.facilityname);
            }

            if(!isNaN(page) && (parseInt(page)>= 0) ){
                queryParams.page = page - 1;
            }
            return queryParams;
        }

        function isEmptyLookupResult(providerLookupResult) {
            var empty = false;
            if (!providerLookupResult || !providerLookupResult._embedded|| !providerLookupResult._embedded.providers || providerLookupResult._embedded.providers.length === 0) {
                empty = true;
            }
            return empty;
        }

        function hasNpi(providersData, npi) {
            var isAlreadyAdded = false;
            if (angular.isDefined(providersData) && angular.isArray(providersData) && providersData.length > 0) {
                for (var i = 0; i < providersData.length; i++) {
                    if (npi === providersData[i].npi) {
                        isAlreadyAdded = true;
                        break;
                    }
                }
            }
            return isAlreadyAdded;
        }
    }
})();