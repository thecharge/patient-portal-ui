/**
 * Created by tomson.ngassa on 7/20/2015.
 * Modified by cindy.ren on 6/13/2016
 */

'use strict';

describe('app.healthInformationService ', function() {
    var healthInformationService, $resource, envService, patientResource;

    var expectEmpty;
    var allergies = [{
        Author: null, EndDate: null, Name: "Penicillin",
        Reactions: [{Code: "123456", CodeSystem: "2.16.840.1.113883.6.96", CodeSystemName: "SNOMEDCT"}],
        Severity: {Code: "123456", CodeSystem: "2.16.840.1.113883.6.96", CodeSystemName: "SNOMEDCT", DisplayName: "Mild"},
        StartDate: "2011-10-19T10:32:02.367551-04:00",
        Status: "Active",
        Substance: {Code: "123456", CodeSystem: "2.16.840.1.113883.6.96", CodeSystemName: "SNOMEDCT"},
    }];
    var AllergySection = {Allergies: allergies, Code: {}, Name: "Allergy", Narrative: "", Title:""};
    var ccdaDocument =  {AllergySection: AllergySection, CCDAHeader: {}, EncounterSection:{}};
    var document = null;
    var patientData = null;


    beforeEach(module('app.config'));
    beforeEach(module('app.healthInformation'));
    // beforeEach(console.log = jasmine.createSpy("log")); //used so console does not fill up
    // beforeEach(console.log.and.callThrough());

    beforeEach(inject(function(_healthInformationService_, _$resource_, _envService_){
        healthInformationService = _healthInformationService_;
        $resource = _$resource_;
        envService = _envService_;
    }));

    it("should be registered", function() {
        expect(module).not.toEqual(null);
    });

    it('should be defined and not null', function(){
        expect(healthInformationService.isDefineAndNotNull(patientResource)).toBeFalsy();
        patientResource = null;
        expect(healthInformationService.isDefineAndNotNull(patientResource)).toBeFalsy();
        patientResource = {value: 'value'};
        expect(healthInformationService.isDefineAndNotNull(patientResource)).toBeTruthy();
    });
    
    it('should have getHealthInformationResource function', function () {
        patientResource = $resource(envService.securedApis.phrApiBaseUrl + "/patients/healthInformation/:mrn", {mrn: '@mrn'});
        //TODO: test if it returns the correct patientResource
    });

    /*    xit('should get getHealthInformation data', function () {
        var ccdaDocument =  {AllergySection: {}, CCDAHeader: {}, EncounterSection:{}};
        var data = {CcdaDocuments: [ccdaDocument]};
        expect(angular.isFunction(healthInformationService.getHealthInformation)).toBe(true);
        expect(healthInformationService.getHealthInformation(data)).toEqual(ccdaDocument);
     });*/

    /*    xit('should print error message if data parameter in getHealthInformation is empty', function () {
        spyOn(console, 'log').and.callThrough();
        var emptyData = {CcdaDocuments:[]};
        healthInformationService.getHealthInformation(emptyData);
        expect(console.log).toHaveBeenCalledWith("health information object missing.");
     });*/

    it('should get CCDA section by name or print console message if empty', function () {
        expect(healthInformationService.getSectionByName(ccdaDocument, "AllergySection")).toEqual(AllergySection);
    });

    it('should print out message to console if CCDA is empty', function(){
        console.log = jasmine.createSpy("log");
        var ccdaDocument = {};
        expectEmpty = healthInformationService.getSectionByName(ccdaDocument, "AllergySection");
        expect(console.log).toHaveBeenCalledWith("Section missing.");
    });

    it('should get section collection by name', function () {
        expect(healthInformationService.getSectionCollectionByName(ccdaDocument, "AllergySection", "Allergies")).toEqual(allergies);
    });

    it('should log error message if section collection has no collection', function () {
        var AllergySection = {Code: {}, Name: "Allergy", Narrative: "", Title:""};
        var ccdaDocument =  {AllergySection: AllergySection, CCDAHeader: {}, EncounterSection:{}};
        healthInformationService.getSectionCollectionByName(ccdaDocument, "AllergySection", "Allergies");
        expect(console.log).toHaveBeenCalledWith("Section: AllergySection collection is missing.");
    });

    it('should log error message if section collection has no section', function () {
        var ccdaDocument =  { CCDAHeader: {}, EncounterSection:{}};
        healthInformationService.getSectionCollectionByName(ccdaDocument, "AllergySection", "Allergies");
        expect(console.log).toHaveBeenCalledWith("Section: AllergySection missing.");
    });

    it('should log error message if document is empty', function(){
        healthInformationService.getCDADocument(document);
        expect(console.log).toHaveBeenCalledWith("Error getting CDA Document from Documents.");
        expect(console.log).toHaveBeenCalledWith(document);
    });

    it('should get CDA Document', function(){
        document = {CDAdocuments: ['doc1.doc','doc2.doc']};
        expect(healthInformationService.getCDADocument(document)).toBe('doc1.doc');
    });

    it('should log error message if patientData is empty', function(){
        healthInformationService.getDocuments(patientData);
        expect(console.log).toHaveBeenCalledWith("Error getting CDA Document from Documents.");
        expect(console.log).toHaveBeenCalledWith(patientData);
    });

    it('should get CDA Document', function(){
        document = {Documents: 'Dummy document'};
        patientData = [document,ccdaDocument];
        expect(healthInformationService.getDocuments(patientData)).toBe('Dummy document');
    });


});
