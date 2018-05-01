/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
global class Field {

    @AuraEnabled global String  fieldName     {get; set;}
    @AuraEnabled global String  fieldLabel    {get; set;}
    @AuraEnabled global String  fieldType     {get; set;}
    @AuraEnabled global Object  fieldValue    {get; set;}
    @AuraEnabled global Boolean isRequired    {get; set;}
    @AuraEnabled global Integer fieldPosition {get; set;}
    @AuraEnabled global String  fieldHelpText {get; set;}

    //Added for supporting reference fields
    @AuraEnabled global String  fieldDisplayValue {get; set;}
}