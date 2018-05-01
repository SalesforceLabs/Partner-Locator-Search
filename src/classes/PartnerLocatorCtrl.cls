/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
public with sharing class PartnerLocatorCtrl {

    // get all accounts on first load - limit to 25
    @AuraEnabled
    public static List<Account> findAll() {
        return [SELECT id, Name FROM Account LIMIT 25];
    }

    // findAccounts and locateAccounts merged into one
	@AuraEnabled
	public static fieldLabelAccounts getAccounts(String searchKey, String industry, String rating, String accType, Boolean isPartnerAcc, Decimal lat, Decimal lng, Integer radius, Boolean useLocation, String theRecordType, String distType, List<String> advSearch, String searchFields, String additionalCustomSearchFields) {

        String thePossibleSearchFields = 'AccountNumber,BillingAddress,BillingCity,BillingCountry,BillingGeocodeAccuracy,BillingLatitude,BillingLongitude,BillingPostalCode,BillingState,BillingStreet,Description,Fax,Id,Industry,IsPartner,Name,NumberOfEmployees,Phone,Rating,Type,Website';
        system.debug('thePossibleSearchFields: '+thePossibleSearchFields);
        
        List<String> theStandardFieldsList = thePossibleSearchFields.split(',');
        List<String> theCustomFieldsList = new List<String>();
        if(searchFields != null && searchFields != '') {
            theCustomFieldsList = searchFields.split(',');
        }
        Set<String> theUniqueFieldsSet = new Set<String>();
        theUniqueFieldsSet.addAll(theStandardFieldsList);
        theUniqueFieldsSet.addAll(theCustomFieldsList);
        system.debug('theUniqueFieldsSet: '+theUniqueFieldsSet);
        thePossibleSearchFields = '';
        for(String s : theUniqueFieldsSet) {
            thePossibleSearchFields += (thePossibleSearchFields=='' ? '':',')+s;
        }
       	system.debug('thePossibleSearchFields: '+thePossibleSearchFields);
		  
        String accessibleSearchFields = queryAccessible('Account', thePossibleSearchFields);
        Map<String, String> theFieldMap = PartnerLocatorCtrl.getFieldLabelsMap(accessibleSearchFields);
        
        Boolean customSearchFlag = true;
        if(additionalCustomSearchFields != null && additionalCustomSearchFields != ''){
            String result = queryAccessible('Account', additionalCustomSearchFields);
            if(result.equals(additionalCustomSearchFields)){
                customSearchFlag = true;
            }
            else{
                customSearchFlag = false;
            }
        }
        
		List<Account> theAccs = new List<Account>();
		List<String> clauses = new List<String>();
		String dbQuery;

		// do if for each of the args
        if(industry != null && industry != '') {
            clauses.add('Industry =: industry');
        }
        if(rating != null && rating != '') {
            clauses.add('Rating =: rating');
        }
        if(accType != null && accType != '') {
            clauses.add('Type =: accType');
        }
        if(isPartnerAcc == true) {
            clauses.add('IsPartner =: isPartnerAcc');
        }
        System.debug('THE radius: ' + radius);
        if(lat != null && lng != null && radius != null && useLocation == true) {
            // clauses.add('DISTANCE(BillingAddress, GEOLOCATION(:lat,:lng), \'km\') < ' + radius);
            clauses.add('DISTANCE(BillingAddress, GEOLOCATION(:lat,:lng), \''+distType+'\') < ' + radius);
        }
        
        if(theRecordType != null && theRecordType != 'All'){
       		clauses.add('recordTypeId =: theRecordType');
        }
        
        //JOIN search with AdvancedSearch
        if(advSearch != null && customSearchFlag){
        	clauses.addAll(advSearch);
        }

        String allstring = String.join(clauses,' AND ');
        System.debug('allstring: ' + allstring);

        if(searchKey != null && searchKey != '') {
            searchKey = String.escapeSingleQuotes(searchKey);
        	String dbFind = 'FIND \'' + searchKey + '\' IN ALL FIELDS RETURNING Account';
	        String dbFields = '(' + accessibleSearchFields;
            String dbWhere = ' WHERE ';
	        String dbEnd = ')';

	        if(clauses.size() > 0) {
                dbQuery = dbFind + dbFields + dbWhere + allstring + dbEnd;
	        }
	        else {
                dbQuery = dbFind + dbFields + dbEnd;
	        }
            
			System.debug('SOSL dbQuery: ' + dbQuery);
	        List<List<sObject>> searchAccounts = system.Search.query(dbQuery);
	        theAccs = searchAccounts[0];

        } 
        else {
            String dbSelect = 'SELECT ';
        	String dbFields = accessibleSearchFields;
	        String dbFrom = ' FROM Account ';
            String dbWhere = 'WHERE ';
	        String dbEnd = ' LIMIT 900';

	        if(clauses.size() > 0) {
                dbQuery = dbSelect + dbFields + dbFrom + dbWhere + allstring + dbEnd;
	        }
	        else {
                dbQuery = dbSelect + dbFields + dbFrom + dbEnd;
	        }
			System.debug('SOQL dbQuery: ' + dbQuery);
	        theAccs = Database.query(dbQuery);
        }
        System.debug('theAccs: ' + theAccs);
        //wrapper theWrapper = wrapper(theFieldMap, theAccs);
        fieldLabelAccounts theWrapper = new fieldLabelAccounts(theFieldMap, theAccs);
        return theWrapper;
	}

    @AuraEnabled
    public static standardPicklistWrapper getAccountIndustries (){
        
        Boolean theRead = Schema.sObjectType.Account.fields.Industry.isAccessible();
        List<String> options = new List<String>();
        String theLabel = '';
        if(theRead){
            Schema.DescribeFieldResult fieldResult = Account.Industry.getDescribe();
            theLabel = fieldResult.getLabel();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for (Schema.PicklistEntry f: ple) {
                options.add(f.getLabel());
            }
        }
        standardPicklistWrapper theWrap = new standardPicklistWrapper(options, theLabel, theRead);
        System.debug('theWrap: '+theWrap);
        return theWrap;
        
    }
    
    @AuraEnabled
    public static standardPicklistWrapper getAccountTypes (){
        
        Boolean theRead = Schema.sObjectType.Account.fields.Type.isAccessible();
        List<String> options = new List<String>();
        String theLabel = '';
        if(theRead){
            Schema.DescribeFieldResult fieldResult = Account.Type.getDescribe();
            theLabel = fieldResult.getLabel();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for (Schema.PicklistEntry f: ple) {
                options.add(f.getLabel());
            }
        }
        standardPicklistWrapper theWrap = new standardPicklistWrapper(options, theLabel, theRead);
        System.debug('theWrap: '+theWrap);
        return theWrap;
    }
    
    @AuraEnabled
    public static standardPicklistWrapper getAccountRatings (){
        
        Boolean theRead = Schema.sObjectType.Account.fields.Rating.isAccessible();
        List<String> options = new List<String>();
        String theLabel = '';
        if(theRead){
            Schema.DescribeFieldResult fieldResult = Account.Rating.getDescribe();
            theLabel = fieldResult.getLabel();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for (Schema.PicklistEntry f: ple) {
                options.add(f.getLabel());
            }
        }
        standardPicklistWrapper theWrap = new standardPicklistWrapper(options, theLabel, theRead);
        System.debug('theWrap: '+theWrap);
        return theWrap;
    }
    
    @AuraEnabled
    public static List<fieldAccessLabelWrapper> getFieldLabels(List<String> fieldNames){
        List<fieldAccessLabelWrapper> formattedNames = new List<fieldAccessLabelWrapper>();
        List<String> api = new List<String>();
    	Schema.SObjectType t = Schema.getGlobalDescribe().get('Account');        
        Schema.DescribeSObjectResult r = t.getDescribe();
        for(String theName : fieldNames){
            
            Boolean theRead = r.fields.getMap().get(theName).getDescribe().isAccessible();
            if(theRead){
                try{
                    String fieldLabelResult = r.fields.getMap().get(theName).getDescribe().getLabel();
                    fieldAccessLabelWrapper theWrap = new fieldAccessLabelWrapper(theName, fieldLabelResult);
                    formattedNames.add(theWrap);
                }
                catch(exception e){
                    system.debug('Get Field Names exception e: '+ e);
                }
            }
        }
        return formattedNames;
    }
    
    @AuraEnabled
    public static picklistWrapper getPicklistValues(String fieldName){
        // Assume that "sObjectName" is populated elsewhere
        Schema.SObjectType t = Schema.getGlobalDescribe().get('Account');        
        Schema.DescribeSObjectResult r = t.getDescribe();
        System.debug('t ' + t);
        System.debug('r ' + r);
        System.debug('fieldName ' + fieldName);
        Schema.DescribeFieldResult fieldResult = r.fields.getMap().get(fieldName).getDescribe();
        Boolean theRead = fieldResult.isAccessible();
        
        List<innerWrapper> options = new List<innerWrapper>();
        String theType = '';
        
        if(theRead){
            Schema.DisplayType fieldDisplayType = fieldResult.getType();
            if(fieldDisplayType == Schema.DisplayType.MULTIPICKLIST) {
                theType = 'MULTIPICKLIST';
            }
            else if(fieldDisplayType == Schema.DisplayType.PICKLIST){
                theType = 'PICKLIST';
            }
            
            System.debug('fieldResult ' + fieldResult);
            
            
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            for (Schema.PicklistEntry f: ple) {
                innerWrapper theInnerWrapper = new innerWrapper(f.getLabel(), false);
                options.add(theInnerWrapper);
            }
            /*
            if (f.getType() == Schema.DisplayType.String){
                return 'String';
            } // .... else if
            */
        }
        
        String theLabel = fieldResult.getLabel();
        system.debug('theLabel: ' + theLabel);
         
        picklistWrapper theReturn = new picklistWrapper(options, theLabel, fieldName, theType, theRead);
        
        return theReturn;
    }


	@AuraEnabled
    public static ContentDocumentLink getAccLogo(String accountId) {
        
        List<ContentDocumentLink> docLinks = new List<ContentDocumentLink>();
        // List<Attachment> logos = new List<Attachment>();
        try{
            // logos = [SELECT Id,Name FROM Attachment WHERE Name LIKE 'PL_%' AND ParentId =: accountId LIMIT 1];
            docLinks = [SELECT Id,ContentDocumentId,ContentDocument.Title,LinkedEntityId, ContentDocument.LatestPublishedVersionId
						FROM ContentDocumentLink 
                        WHERE LinkedEntityId =: accountId LIMIT 1];
            System.debug('getAccLogo logo: ' + docLinks);
            
            if(!docLinks.isEmpty()) {
                return docLinks[0];
            }    
            else {
                System.Debug('No Logo found on Acocunt');
                return null;
            }
            
        }
        catch(Exception e){
            System.Debug('Error in getAccLogo: ' + e.getMessage() );
            return null;
        }
    }

	// Eminem classes    
	
    public class fieldAccessLabelWrapper{
        @AuraEnabled
        public String apiName {get;set;}
        @AuraEnabled
        public String label {get;set;}
        
        public fieldAccessLabelWrapper(String api, String lab){
            this.apiName = api;
            this.label = lab;
        }
    }
    
    public class picklistWrapper{
        @AuraEnabled
        public List<innerWrapper> fields {get;set;}
        @AuraEnabled
        public String picklistLabel {get;set;}
        @AuraEnabled
        public String apiFieldName {get;set;}
        @AuraEnabled
        public String fieldType {get;set;}
        @AuraEnabled
        public Boolean visible {get;set;}
        
        public picklistWrapper(List<innerWrapper> f, String l, String apiN, String fType, Boolean theVisiblity){
            this.fields = f;
            this.picklistLabel = l;
            this.apiFieldName = apiN;
            this.fieldType = fType;
            this.visible = theVisiblity;
        }
    }
    
    public class innerWrapper{
        @AuraEnabled
        public String value {get;set;}
        @AuraEnabled
        public Boolean selected {get;set;}
        
        public innerWrapper(String v, Boolean s){
            this.value = v;
            this.selected = s;
        }
    }
    
    public class standardPicklistWrapper{
        @AuraEnabled
        public List<String> options {get;set;}
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled
        public Boolean visible {get;set;}
        
        public standardPicklistWrapper(List<String> theOptions, String theLabel, Boolean theVisiblity){
            this.options = theOptions;
            this.label = theLabel;
            this.visible = theVisiblity;
        }
    }
    
    public class fieldLabelAccounts{
        @AuraEnabled
        public Map<String, String> fieldMap {get;set;}
        @AuraEnabled
        public List<Account> accs {get;set;}
        
        public fieldLabelAccounts(Map<String, String> theFieldMap, List<Account> theAccs){
            this.fieldMap = theFieldMap;
            this.accs = theAccs;
        }
    }
    
    public static String queryAccessible(String sObjectType, String commaDelimitedFields)
    {
        SObjectType schemaType = Schema.getGlobalDescribe().get(sObjectType);
        Map<String, SObjectField> fieldMap = schemaType.getDescribe().fields.getMap();
    
        List<String> fieldList = new List<String>();
        Boolean theFlag = true;
        for (String field : commaDelimitedFields.split(',')){
            if (fieldMap.get(field).getDescribe().isAccessible()){
                fieldList.add(field.trim());
            }
        }
        String theResultFields = String.join(fieldList, ',');
        return theResultFields;
    }
    
    public static Map<String, String> getFieldLabelsMap(String fieldNames){
        system.debug('getFieldLabelsMap');
        Map<String, String> formattedNamesList = new Map<String, String>();
        List<String> theFieldNames = fieldNames.split(',');
    	Schema.SObjectType t = Schema.getGlobalDescribe().get('Account');        
        Schema.DescribeSObjectResult r = t.getDescribe();
        for(String theName : theFieldNames){
            String fieldLabelResult = r.fields.getMap().get(theName).getDescribe().getLabel();
            formattedNamesList.put(theName, fieldLabelResult);
        }
        return formattedNamesList;
    }
    
}