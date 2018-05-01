({  
    getCurrentLocation : function(component, event) {
        console.log('getCurrentLocation');
        var spinner = component.find("searchSpinner");

        window.navigator.geolocation.getCurrentPosition(function(e) {
            console.log('latitude', e.coords.latitude );
            console.log('longitude', e.coords.longitude );
            component.set( 'v.currentLocation', e.coords.latitude + ', ' + e.coords.longitude ); 
            component.set( 'v.currentLat', e.coords.latitude );  
            component.set( 'v.currentLng', e.coords.longitude );  
            
            $A.util.toggleClass(spinner, "slds-hide");
            
        }, function() {
            console.log('There was an error.');
        });
    
    },
    
    doMagicSearch : function(component, event, helper) { 
        console.log('doMagicSearch');
    	var action = component.get("c.getAccounts");
        
        var searchKey = component.get("v.searchKey");
        console.log('searchKey: ', searchKey);
        var industry = component.find("industry").get("v.value");
        console.log('industry: ', industry);
        var accType = component.find("type").get("v.value");
        console.log('accType: ', accType);
        var rating = component.find("rating").get("v.value");
        console.log('rating: ', rating);
        var isPartnerAcc = component.get("v.isPartner");
        console.log('isPartnerAcc: ', isPartnerAcc);
        var lat = component.get("v.currentLat");
        console.log('lat: ', lat);
        var lng = component.get("v.currentLng");
        console.log('lng: ', lng);
        var radius = component.get("v.radius");
        if (radius == '') {
            radius = null;
        }
        console.log('radius: ', radius);
        var useLocation = component.get('v.useLocation');
        console.log('useLocation: ', useLocation);
        var theRecordType = component.get("v.theRT");
        console.log('theRecordType: ', theRecordType);
        var advSearch = component.get("v.advSearchObject");
        console.log('advSearch: ', advSearch);
        var searchFields = component.get("v.formattedSearchFields");
        console.log('searchFields: ', searchFields);
        var additionalCustomSearchFields = component.get("v.customFieldFormattedSearchFields");
        console.log('additionalCustomSearchFields: ', additionalCustomSearchFields);
        
        var distanceType = component.get("v.distanceType");
        
        action.setParams({ 
            'searchKey' : searchKey,
            'industry' 	: industry,
            'accType'	: accType,
            'rating'	: rating,
            'isPartnerAcc' : isPartnerAcc,
            'lat' 		: lat,
            'lng' 		: lng,
            'radius' 	: radius,
            'useLocation' : useLocation,
            'theRecordType' : theRecordType,
            'distType'	: distanceType,
            'advSearch' : advSearch,
            'searchFields' : searchFields,
            'additionalCustomSearchFields' : additionalCustomSearchFields
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('doMagicSearch state', state);
            if (state === "SUCCESS") {
				var filteredAccounts = response.getReturnValue().accs;
                console.log('filteredAccounts:', filteredAccounts);
                component.set('v.accountFieldMap', response.getReturnValue().fieldMap);
                if( component.get('v.useLocation') ) {                     
                    for(var i = 0; i<filteredAccounts.length; i++) {
                        var dist = helper.calculateDistance(helper,lat,lng,filteredAccounts[i].BillingLatitude,filteredAccounts[i].BillingLongitude, distanceType).toFixed(0);
                        // console.log('filteredAccounts[i] dist', dist);
                        filteredAccounts[i].Distance = dist + ' ' + distanceType;
                    }
                }
                component.set("v.filteredAccounts", filteredAccounts );
                console.log('fireEvent: ', filteredAccounts );
                let myEvent = $A.get("e.c:PartnerLocatorSearchEvt");
                myEvent.setParams({ 
                    "accounts": component.get("v.filteredAccounts"),
                    "fieldMap": component.get("v.accountFieldMap")
                }); 
                myEvent.fire();
            }
            else if (state === "INCOMPLETE") {
                // do something
                console.log("INCOMPLETE");
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: ", errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
            // turn off the spinner launched at clicking search
            var spinner = component.find("searchSpinner");
        	$A.util.toggleClass(spinner, "slds-hide");
        });
        console.log('action: ', action);
        $A.enqueueAction(action); 
    },
    
    doSOQLSearch : function(component, event) {
        var action = component.get("c.locateAccounts");
        action.setParams({ 
            'searchKey' : component.get("v.searchKey"),
            'industry' 	: component.find("industry").get("v.value"),
            'accType'	: component.find("type").get("v.value"),
            'rating'	: component.find("rating").get("v.value"),
            'lat' 		: component.get("v.currentLat"),
            'lng' 		: component.get("v.currentLng"),
            'radius' 	: component.get("v.radius"),
            'advSearch' : component.get("v.advSearchObject")
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Alert the user with the value returned 
                // from the server
                //console.log("SOQL Response: ", response.getReturnValue());
                component.set("v.filteredAccounts", response.getReturnValue().accs);
                component.set('v.accountFieldMap', response.getReturnValue().fieldMap);
                // filteredAccounts = component.get("v.filteredAccounts");
                
                let myEvent1 = $A.get("e.c:PartnerLocatorSearchEvt");
                myEvent1.setParams({ 
                    "accounts": component.get("v.filteredAccounts"),
                    "fieldMap": component.get("v.accountFieldMap")
                }); 
                myEvent1.fire();
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        //console.log("Error message: ", errors[0].message);
                    }
                } else {
                    //console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action); 
    },
    
    doSOSLSearch : function(component, event) {
        // SOSL Query
        var action = component.get("c.findAccounts");
        action.setParams({ 
            'searchKey' : component.get("v.searchKey"),
            'industry' 	: component.find("industry").get("v.value"),
            'accType'	: component.find("type").get("v.value"),
            'rating'	: component.find("rating").get("v.value"),
            'lat' 		: component.get("v.currentLat"),
            'lng' 		: component.get("v.currentLng"),
            'radius' 	: component.get("v.radius"),
            'advSearch' : component.get("v.advSearchObject")
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log("SOSL Response: ", response.getReturnValue());
                component.set("v.filteredAccounts", response.getReturnValue() );
                let myEvent2 = $A.get("e.c:PartnerLocatorSearchEvt");
                myEvent2.setParams({ 
                    "accounts": component.get("v.filteredAccounts")
                }); 
                myEvent2.fire();
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: ", errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action); 
    },

    // get field picklists
    /* Dont think this is used anywhere
    getPicklistValues : function(component, event, fieldName) {	
        var action = component.get("c.getPicklistValues");
        action.setParams({ 
            "fieldName": fieldName
        }); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log("getPicklistValues: ", response.getReturnValue());
                // component.set('v.accIndustry', response.getReturnValue());
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                console.log('errors', errors);
            }
        });
        $A.enqueueAction(action);  
    },
    */
    
    // get field picklists
    buildPicklistResultList : function(component, event, fieldName) {	
        
        var action = component.get("c.getPicklistValues");
        action.setParams({ 
            "fieldName": fieldName
        }); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var picklistResultList = component.get('v.picklistResultList');
                console.log('BeforeBefore push ', picklistResultList);
                //console.log("buildPicklistResultList: ", response.getReturnValue());
                var theResult = response.getReturnValue();
                console.log('before push ', theResult);
                var theObject = {"label" : theResult.picklistLabel, "fields" : theResult.fields, "apiName" : theResult.apiFieldName, "fieldType" : theResult.fieldType, "visible" : theResult.visible};
                picklistResultList.push(theObject);
                console.log('after push ', picklistResultList);
                component.set('v.picklistResultList', picklistResultList);
                console.log('after set');
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                console.log('errors', errors);
            }
        });
        $A.enqueueAction(action);  
    },
     
    // OLD METHODS 
   	getIndustryPicklist : function(component, event) {	
        var action = component.get("c.getAccountIndustries");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Alert the user with the value returned 
                // from the server
                console.log("getIndustryPicklist: ", response.getReturnValue());
                component.set('v.accIndustry', response.getReturnValue().options);
                component.set('v.accIndustryLabel', response.getReturnValue().label);
                component.set('v.accIndustryVisible', response.getReturnValue().visible);
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                console.log('errors', errors);
            }
        });
        $A.enqueueAction(action);     
    },
    getTypePicklist : function(component, event) {	
        var action = component.get("c.getAccountTypes");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Alert the user with the value returned 
                // from the server
                console.log("getTypePicklist: ", response.getReturnValue());
                component.set('v.accType', response.getReturnValue().options);
                component.set('v.accTypeLabel', response.getReturnValue().label);
                component.set('v.accTypeVisible', response.getReturnValue().visible);
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                console.log('errors', errors);
            }
        });
        $A.enqueueAction(action);     
    },
    getRatingPicklist : function(component, event) {	
        var action = component.get("c.getAccountRatings");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                // Alert the user with the value returned 
                // from the server
                console.log("getRatingPicklist: ", response.getReturnValue());
                component.set('v.accRating', response.getReturnValue().options);
                component.set('v.accRatingLabel', response.getReturnValue().label);
                component.set('v.accRatingVisible', response.getReturnValue().visible);
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                console.log('errors', errors);
            }
        });
        $A.enqueueAction(action);     
    },
    
    calculateDistance : function(helper, lat1, lon1, lat2, lon2, distanceType) {
        // console.log('calculateDistance');
        // var distanceType = component.get("v.distanceType");
        // earth_radius_miles = 3959.0 
		// earth_radius_kilometers = 6372.8 
		var R = 0;
        switch(distanceType) {
            case 'km' :
                R = 6371;
                break;
            case 'mi':
                R = 3959;
                break;
            default:
                R = 6371;
        }
         
        var dLat = helper.toRad(lat2-lat1);
        var dLon = helper.toRad(lon2-lon1);
        var lat1 = helper.toRad(lat1);
        var lat2 = helper.toRad(lat2);
        
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    },
    
    toRad : function(theValue) {
        return theValue * Math.PI / 180;
    }
})