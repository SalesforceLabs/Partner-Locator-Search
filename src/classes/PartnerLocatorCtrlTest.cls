/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
@isTest(seeAllData = true)
public class PartnerLocatorCtrlTest {
    
    public String searchKey {get;set;} {searchKey = 'a'; String test = searchKey; System.assertEquals(test, 'a');}
    public String industry {get;set;} {industry = 'Communications'; System.assertEquals(industry, 'Communications');}
    public String rating {get;set;} {rating = 'Hot'; System.assertEquals(rating, 'Hot');}
    public String accType {get;set;} {accType = 'Customer - Channel'; System.assertEquals(accType, 'Customer - Channel');}
    public Boolean isPartnerAcc {get;set;} {isPartnerAcc = true; System.assertEquals(isPartnerAcc, true);}
    public Decimal lat {get;set;} {lat = 42.1; System.assertEquals(lat, 42.1);}
    public Decimal lng {get;set;} {lng = 41.9; System.assertEquals(lng, 41.9);}
    public Integer radius {get;set;} {radius = 100; System.assertEquals(radius, 100);}
    public Boolean useLocation {get;set;} {useLocation = true; System.assertEquals(useLocation, true);}
    public String theRecordType {get;set;} {theRecordType = 'All'; System.assertEquals(theRecordType, 'All');}
    public String distanceFormat {get;set;} {distanceFormat = 'km'; System.assertEquals(distanceFormat, 'km');}
    public List<String> advSearch {get;set;} {advSearch = new List<String>(); System.assert(advSearch.isEmpty() == true);}
    public String test1 {get;set;} {test1 = 'Type = \'Customer - Channel\''; System.assertEquals(test1, 'Type = \'Customer - Channel\'');}
    public String test2 {get;set;} {test2 = 'Industry = \'Energy\''; System.assertEquals(test2, 'Industry = \'Energy\'');}
    public String test3 {get;set;} {test3 = 'NumberOfEmployees'; System.assertEquals(test3, 'NumberOfEmployees');}
    public String fieldName {get;set;} {fieldName = 'Type'; System.assertEquals(fieldName, 'Type');}
    public String searchFields {get;set;} {searchFields = ''; System.assertEquals(searchFields, '');}
    public String additionalCustomSearchFields {get;set;} {additionalCustomSearchFields = ''; System.assertEquals(additionalCustomSearchFields, '');}
    
    @isTest
    static void testfindAll() {
        List<Account> theAccounts = PartnerLocatorCtrl.findAll();
        System.assert(theAccounts.isEmpty() != true);
    }
    @isTest
    static void testgetAccounts() {
        PartnerLocatorCtrlTest theTestOptions = new PartnerLocatorCtrlTest();
        theTestOptions.advSearch.add(theTestOptions.test1);
        theTestOptions.advSearch.add(theTestOptions.test2);
        
        PartnerLocatorCtrl.fieldLabelAccounts thesObjects = PartnerLocatorCtrl.getAccounts(theTestOptions.searchKey, theTestOptions.industry, theTestOptions.rating, theTestOptions.accType, theTestOptions.isPartnerAcc, theTestOptions.lat, theTestOptions.lng, theTestOptions.radius, theTestOptions.useLocation, theTestOptions.theRecordType, theTestOptions.distanceFormat, theTestOptions.advSearch, theTestOptions.searchFields, theTestOptions.additionalCustomSearchFields);
        
        PartnerLocatorCtrl.fieldLabelAccounts thesObjects2 = PartnerLocatorCtrl.getAccounts(null, theTestOptions.industry, theTestOptions.rating, theTestOptions.accType, theTestOptions.isPartnerAcc, theTestOptions.lat, theTestOptions.lng, theTestOptions.radius, theTestOptions.useLocation, theTestOptions.theRecordType, theTestOptions.distanceFormat, theTestOptions.advSearch, theTestOptions.searchFields, theTestOptions.additionalCustomSearchFields);
        
        PartnerLocatorCtrl.fieldLabelAccounts thesObjects3 = PartnerLocatorCtrl.getAccounts(theTestOptions.searchKey, null, null, null, null, null, null, null, null, null, null, null, null, null);
        
        PartnerLocatorCtrl.fieldLabelAccounts thesObjects4 = PartnerLocatorCtrl.getAccounts(null, null, null, null, null, null, null, null, null, null, null, null, null, null);
        
		System.assert(thesObjects != null);
    }
    @isTest
    static void testgetFieldNames() {
        PartnerLocatorCtrlTest theTestOptions = new PartnerLocatorCtrlTest();
        theTestOptions.advSearch.add(theTestOptions.test3);
        List<PartnerLocatorCtrl.fieldAccessLabelWrapper> theResult = PartnerLocatorCtrl.getFieldLabels(theTestOptions.advSearch);
        System.assert(theResult.isEmpty() != true);
    }
    /*
    @isTest
    static void testlocateAccounts() {
        PartnerLocatorCtrlTest theTestOptions = new PartnerLocatorCtrlTest();
        theTestOptions.advSearch.add(theTestOptions.test1);
        theTestOptions.advSearch.add(theTestOptions.test2);
        List<Account> theaccounts = PartnerLocatorCtrl.locateAccounts(theTestOptions.searchKey, theTestOptions.industry, theTestOptions.rating, theTestOptions.accType, theTestOptions.lat, theTestOptions.lng, theTestOptions.radius, theTestOptions.advSearch);
        List<Account> theaccounts2 = PartnerLocatorCtrl.locateAccounts(null, null, null, null, null, null, null, null);
    }
    @isTest
    static void testfindAccounts() {
        PartnerLocatorCtrlTest theTestOptions = new PartnerLocatorCtrlTest();
        theTestOptions.advSearch.add(theTestOptions.test1);
        theTestOptions.advSearch.add(theTestOptions.test2);
        List<sObject> theaccounts = PartnerLocatorCtrl.findAccounts(theTestOptions.searchKey, theTestOptions.industry, theTestOptions.rating, theTestOptions.accType, theTestOptions.lat, theTestOptions.lng, theTestOptions.radius, theTestOptions.advSearch);
        List<sObject> theaccounts2 = PartnerLocatorCtrl.findAccounts(null, null, null, null, null, null, null, null);
    }
	*/
    @isTest
    static void testgetAccountIndustries() {
        PartnerLocatorCtrl.standardPicklistWrapper theResult = PartnerLocatorCtrl.getAccountIndustries();
        System.assert(theResult != null);
    }
    @isTest
    static void testgetAccountTypes() {
        PartnerLocatorCtrl.standardPicklistWrapper theResult = PartnerLocatorCtrl.getAccountTypes();
        System.assert(theResult != null);
    }
    @isTest
    static void testgetAccountRatings() {
        PartnerLocatorCtrl.standardPicklistWrapper theResult = PartnerLocatorCtrl.getAccountRatings();
        System.assert(theResult != null);
    }
    @isTest
    static void testgetPicklistValues() {
        PartnerLocatorCtrlTest theTestOptions = new PartnerLocatorCtrlTest();
        PartnerLocatorCtrl.picklistWrapper theResult = PartnerLocatorCtrl.getPicklistValues(theTestOptions.fieldName);
        System.assert(theResult != null);
    }
	/*    
    @isTest
    static void testgetAccountLogo() {
        PartnerLocatorCtrlTest theTestOptions = new PartnerLocatorCtrlTest();
        
        List<Account> theAccounts = [SELECT Id FROM Account LIMIT 100];
        List<Id> contentDocIdList = new List<Id>();
        for(Account theAcc : theAccounts){
            contentDocIdList.add(theAcc.Id);
        }
        List<ContentDocumentLink> docLinks = [SELECT Id, LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId IN :contentDocIdList];
        String theDocId = docLinks[0].LinkedEntityId;
        
        ContentDocumentLink theResult = PartnerLocatorCtrl.getAccLogo(theDocId);

        System.assert(theResult != null);
    }
*/
}