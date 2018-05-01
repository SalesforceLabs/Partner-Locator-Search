/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
global class AccountRecordTypes extends VisualEditor.DynamicPickList{
    
	global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('All', 'All', true); 
        System.debug('defaultValue: ' + defaultValue);
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        
        Schema.DescribeSObjectResult R = Account.SObjectType.getDescribe();
        
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('All', 'All', true); 
        System.debug('defaultValue: ' + defaultValue);
        myValues.addRow(defaultValue);
        
        List<Schema.RecordTypeInfo> RT = R.getRecordTypeInfos();
        system.debug('RT: ' + RT);
        for (Schema.RecordTypeInfo theRT : RT) {
            if(!theRT.isMaster()){
                if(theRT.isActive()){
                    String rtName = theRT.getName();
                    System.debug('rtName: ' + rtName);
                    
                    String rtId = theRT.getRecordTypeId();
                    System.debug('rtId: ' + rtId);
                    
                    VisualEditor.DataRow val = new VisualEditor.DataRow(rtName,rtId);
                    myValues.addRow(val);
                }
            }
        }
        return myValues;
    }
}