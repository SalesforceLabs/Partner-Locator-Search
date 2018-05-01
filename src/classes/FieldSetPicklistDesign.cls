/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
global class FieldSetPicklistDesign extends VisualEditor.DynamicPickList {
	
    global override VisualEditor.DataRow getDefaultValue(){
        VisualEditor.DataRow defaultValue = new VisualEditor.DataRow('Selected Account Fields', 'Selected_Account_Fields', true); 
        System.debug('defaultValue: ' + defaultValue);
        return defaultValue;
    }
    global override VisualEditor.DynamicPickListRows getValues() {
        
        VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
        
        Map<String, Schema.FieldSet> FsMap = Schema.SObjectType.Account.fieldSets.getMap();
        for (String key : FsMap.keySet()) {
            // The "key" variable is also available inside the loop
            Schema.FieldSet fs = FsMap.get(key);
            String fsAPINamespace = fs.getNamespace();
            System.debug('fsAPINamespace: ' +fsAPINamespace);
            String fsAPI = fs.getName();
            System.debug('fsAPI: ' +fsAPI);
            String fsLabel = fs.getLabel();
            System.debug('fsLabel: ' +fsLabel);
            if(fsAPINamespace != null){
                fsAPI = fsAPINamespace+'__'+fsAPI;
            }
            System.debug('fsAPI: ' +fsAPI);
            VisualEditor.DataRow val = new VisualEditor.DataRow(fsLabel, fsAPI);
            myValues.addRow(val);
        }
        return myValues;
    }
    
}