/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
@isTest(seeAllData=false)
private class FieldSetSectionControllerTest {

    @testSetup
    static void createTestData(){
        
        Account testAccount = new Account();
        testAccount.Name = 'Avengers Corp Test';
        testAccount.AnnualRevenue = 5000000;
        testAccount.Industry = 'Energy';
        testAccount.NumberOfEmployees = 150;
        testAccount.Rating = 'Hot';
        
        insert testAccount;
        System.assert(testAccount.Id != null);
		
        /*
        Case testCase = new Case();
        testCase.Subject = 'FS Case Test';
        testCase.Status = 'Open';
        insert testCase;
        System.assert(testCase.Id != null); */
    }

    @isTest
    private static void testGetOutputFields(){
        Account testAccount = [SELECT Id FROM Account WHERE Name = 'Avengers Corp Test' LIMIT 1];
        
        // Case testCase = [SELECT Id FROM Case WHERE Subject = 'FS Case Test' LIMIT 1];
        
        Test.startTest();
        Field[] sectionFields = FieldSetSectionController.getOutputFields(testAccount.Id, 'partner_locator__Selected_Account_Fields');
        System.assert(sectionFields.size() > 0);
        Test.stopTest();
    }
    
    @isTest
    private static void testGetOutputFields_NegativeScenario(){
        Account testAccount = [SELECT Id FROM Account WHERE Name = 'Avengers Corp Test' LIMIT 1];
        
        // Case testCase = [SELECT Id FROM Case WHERE Subject = 'FS Case Test' LIMIT 1];
        
        Test.startTest();
        Field[] sectionFields = FieldSetSectionController.getOutputFields(testAccount.Id, 'DummyFieldSet');
        System.assert(sectionFields == null);
        Test.stopTest();
    }

}