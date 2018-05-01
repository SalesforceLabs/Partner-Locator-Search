({
    doInit : function(component, event, helper) {
        console.log('in PLSC doInit ');
        
        // debugger;
        var url = window.location.host;
        var isPreview = false;
        if (url.includes('livepreview')) {
            isPreview = true;
        }
        // helper.getCurrentLocation(component, event);
        helper.getIndustryPicklist(component, event);    
        helper.getTypePicklist(component, event); 
        helper.getRatingPicklist(component, event); 
        console.log('after helpers');
        var searchFields = component.get("v.searchFields");
        //Remove whitespace from string
        if(searchFields) {
            console.log('searchFields: ', searchFields);
            searchFields = searchFields.replace(/\s+/g, '');
            console.log('searchFields: ', searchFields);
            component.set('v.customFieldFormattedSearchFields', searchFields); //used for isAccessable() in apex
            component.set('v.formattedSearchFields', searchFields);
            var splitFields = searchFields.split(',');
            var newArray = new Array();
            for (var i = 0; i < splitFields.length; i++) {
                if (splitFields[i]) {
                    newArray.push(splitFields[i]);
                }
            }
            for(var i = 0; i < newArray.length; i++ ) {
                console.log('inside for');
                helper.buildPicklistResultList(component, event, newArray[i]);
            }
            console.log('after for');
        }
        console.log('after if');
    },
    
    searchAccounts : function(component, event, helper) {
        
        console.log('calling searchAccounts');
        
        var searchKeyValidity = component.find("searchKey").get("v.validity");
        console.log('searchKeyValidity: ', searchKeyValidity);
        var distanceValidity = component.find("distance").get("v.validity");
        console.log('distanceValidity: ', distanceValidity);
        if(searchKeyValidity.valid && distanceValidity.valid){
            
            // start search spinner
            var spinner = component.find("searchSpinner");
            $A.util.toggleClass(spinner, "slds-hide");
            
            var searchKey = component.get("v.searchKey");
            var accIndustry = component.find("industry").get("v.value");
            var filteredAccounts = component.get("v.filteredAccounts");
            var currentLat = component.get("v.currentLat");
            var currentLng = component.get("v.currentLng");
            var radius = component.get("v.radius");
            
            /*
            console.log('searchKey', searchKey);
            console.log('accIndustry', accIndustry);
            console.log('filteredAccounts', filteredAccounts);
            console.log('currentLat', currentLat);
            console.log('currentLng', currentLng);
            console.log('radius km', radius);
            */
            
            var picklistholder = component.get('v.picklistResultList');
            
            var theSearch = component.get('v.advSearchObject');
            //console.log('theSearch: ',theSearch);
            
            //For loop to check if any Picklist search criteria is already present in the advSearch String and if so replace it.
            var picklistSearchList = [];
            for(var i=0;i<picklistholder.length;i++){
                if(picklistholder[i].fieldType == 'PICKLIST'){
                    
                    var theIndex = -1;
                    if(theSearch){
                        for(var z = 0;z<theSearch.length;z++){
                            //console.log(theSearch[z]+' indexOf '+picklistholder[i].apiName);
                            //console.log(theSearch[z].indexOf(picklistholder[i].apiName));
                            if(theSearch[z].indexOf(picklistholder[i].apiName) > -1){
                                theIndex = z;
                            }
                        }
                    }
                    
                    if($("#"+picklistholder[i].apiName+" option:selected" ).text() != "All" ){
                        var thePicklist = $("#"+picklistholder[i].apiName+" option:selected" ).text();
                        var theFormattedSearch = picklistholder[i].apiName + ' = \''+thePicklist+'\'';
                        
                        picklistSearchList.push(theFormattedSearch);
                        
                        //console.log('theIndex: ', theIndex);
                        if(theIndex > -1){
                            var theFormattedSearch = picklistholder[i].apiName + ' = \''+thePicklist+'\'';
                            //console.log('theFormattedSearch: ', theFormattedSearch);
                            theSearch[theIndex] = theFormattedSearch;
                            //console.log('theSearch: ', theSearch);
                        }
                        else{
                            var theFormattedSearch = picklistholder[i].apiName + ' = \''+thePicklist+'\'';
                            console.log('theFormattedSearch: ', theFormattedSearch);
                            theSearch.push(theFormattedSearch);
                            //console.log('theSearch: ', theSearch);
                        }
                    }
                    else if($("#"+picklistholder[i].apiName+" option:selected" ).text() == "All" && theIndex > -1){
                        theSearch.splice(theIndex,1);
                    }
                }
                else{
                    //DO SOMETHING TO GET SEARCHABLE PICKLIST VALUES
                }
            }
            //console.log('theSearch: ',theSearch);
            
            /*
            if(searchKey) {
                console.log('doSOSLSearch');
                helper.doSOSLSearch(component, event);
            }
            else {
                console.log('doSOQLSearch');
                helper.doSOQLSearch(component, event);
            }
            */
            
            helper.doMagicSearch(component, event, helper);
        }
    },
    checkEnterKey : function(component, event, helper) {
        if (event.keyCode === 13) {
            console.log('checkEnterKeyPressed');
            console.log('calling searchAccounts');
            
            var searchKeyValidity = component.find("searchKey").get("v.validity");
            console.log('searchKeyValidity: ', searchKeyValidity);
            var distanceValidity = component.find("distance").get("v.validity");
            console.log('distanceValidity: ', distanceValidity);
            if(searchKeyValidity.valid && distanceValidity.valid){
                
                // start search spinner
                var spinner = component.find("searchSpinner");
                $A.util.toggleClass(spinner, "slds-hide");
                
                var searchKey = component.get("v.searchKey");
                var accIndustry = component.find("industry").get("v.value");
                var filteredAccounts = component.get("v.filteredAccounts");
                var currentLat = component.get("v.currentLat");
                var currentLng = component.get("v.currentLng");
                var radius = component.get("v.radius");
                
                /*
                console.log('searchKey', searchKey);
                console.log('accIndustry', accIndustry);
                console.log('filteredAccounts', filteredAccounts);
                console.log('currentLat', currentLat);
                console.log('currentLng', currentLng);
                console.log('radius km', radius);
                */
                
                var picklistholder = component.get('v.picklistResultList');
                
                var theSearch = component.get('v.advSearchObject');
                //console.log('theSearch: ',theSearch);
                
                //For loop to check if any Picklist search criteria is already present in the advSearch String and if so replace it.
                var picklistSearchList = [];
                for(var i=0;i<picklistholder.length;i++){
                    if(picklistholder[i].fieldType == 'PICKLIST'){
                        
                        var theIndex = -1;
                        if(theSearch){
                            for(var z = 0;z<theSearch.length;z++){
                                //console.log(theSearch[z]+' indexOf '+picklistholder[i].apiName);
                                //console.log(theSearch[z].indexOf(picklistholder[i].apiName));
                                if(theSearch[z].indexOf(picklistholder[i].apiName) > -1){
                                    theIndex = z;
                                }
                            }
                        }
                        
                        if($("#"+picklistholder[i].apiName+" option:selected" ).text() != "All" ){
                            var thePicklist = $("#"+picklistholder[i].apiName+" option:selected" ).text();
                            var theFormattedSearch = picklistholder[i].apiName + ' = \''+thePicklist+'\'';
                            
                            picklistSearchList.push(theFormattedSearch);
                            
                            //console.log('theIndex: ', theIndex);
                            if(theIndex > -1){
                                var theFormattedSearch = picklistholder[i].apiName + ' = \''+thePicklist+'\'';
                                //console.log('theFormattedSearch: ', theFormattedSearch);
                                theSearch[theIndex] = theFormattedSearch;
                                //console.log('theSearch: ', theSearch);
                            }
                            else{
                                var theFormattedSearch = picklistholder[i].apiName + ' = \''+thePicklist+'\'';
                                console.log('theFormattedSearch: ', theFormattedSearch);
                                theSearch.push(theFormattedSearch);
                                //console.log('theSearch: ', theSearch);
                            }
                        }
                        else if($("#"+picklistholder[i].apiName+" option:selected" ).text() == "All" && theIndex > -1){
                            theSearch.splice(theIndex,1);
                        }
                    }
                    else{
                        //DO SOMETHING TO GET SEARCHABLE PICKLIST VALUES
                    }
                }
                helper.doMagicSearch(component, event, helper);
            }
        }
    },
    toggleLocation : function(component, event, helper) {
        //console.log('toggleLocation');
        // console.log('useLocation', component.get('v.useLocation'));
        
        var spinner = component.find("searchSpinner");
        $A.util.toggleClass(spinner, "slds-hide");
        
        if(component.get('v.useLocation') == false) {
            helper.getCurrentLocation(component, event);
            component.set("v.useLocation", true);
        }
        else {
            component.set("v.useLocation", false);
            $A.util.toggleClass(spinner, "slds-hide");
        }
    },
    
    toggleIsPartner : function(component, event, helper) {
        console.log('toggleIsPartner');
        if(component.get('v.isPartner') == false) {
            component.set("v.isPartner", true);
            console.log(component.get("v.isPartner"));
        }
        else {
            component.set("v.isPartner", false);   
            console.log(component.get("v.isPartner"));
        }
    },
    
    showAdvancedSearch : function(component, event, helper) {
        console.log('showAdvancedSearch');
        var advancedSearch = component.get('v.showAdvSearch');
        if(advancedSearch) {
            component.set('v.showAdvSearch', false);
        }
        else {
            component.set('v.showAdvSearch', true);
        }
    },
    
    handleSelectChangeEvent : function(component, event, helper) {
        var items = component.get("v.items");
        items = event.getParam("values");
        //console.log('items: ', items);
        var apiName = event.getParam("apiName");
        //console.log('apiName: ', apiName);
        
        
        //Check if any Multipicklist search criteria is already present in the advSearch String and if so replace it. 
        var thePresentSelections = component.get('v.advSearchObject');
        var theIndex = -1;
        if(thePresentSelections){
            for(var i = 0;i<thePresentSelections.length;i++){
                //console.log(thePresentSelections[i]+' indexOf '+apiName);
                //console.log(thePresentSelections[i].indexOf(apiName));
                if(thePresentSelections[i].indexOf(apiName) > -1){
                    theIndex = i;
                }
            }
        }
        //console.log('theIndex: ', theIndex);
        if(theIndex > -1 && items.length > 0){
            var theString = apiName + ' = \''+items.join(';')+'\'';
            //console.log('theString: ', theString);
            thePresentSelections[theIndex] = theString;
            //console.log('thePresentSelections: ', thePresentSelections);
        }
        else if(theIndex > -1){
            //var theString = apiName + ' = \''+items.join(';')+'\'';
            //console.log('theString: ', theString);
            thePresentSelections.splice(theIndex,1)
            //console.log('thePresentSelections: ', thePresentSelections);
        }
            else{
                var theString = apiName + ' = \''+items.join(';')+'\'';
                //console.log('theString: ', theString);
                thePresentSelections.push(theString);
                //console.log('thePresentSelections: ', thePresentSelections);
            }
        component.set('v.advSearchObject', thePresentSelections);
    }                            
})