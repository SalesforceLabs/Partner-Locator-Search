({
	doInit : function(component, event, helper) {
        
        var theHeight = component.get('v.height');
        var theWidth = component.get('v.width');
        
        var globalId = component.getGlobalId();
        
        var mapId = 'map_' + globalId;
        console.log('mapId: ', mapId);
        var theMap = document.getElementById(mapId);
        console.log('theMap: ', theMap);
        var previewId = 'preview_'+globalId
        console.log('previewId: ', previewId);
        var thePreview = document.getElementById(previewId);
        console.log('thePreview: ', thePreview);
        
        $(theMap).css('height',theHeight+'px');
        console.log('Height change called');
        $(thePreview).css('height',theHeight+'px');
        
        var url = window.location;
        var isPreview = false;
        console.log('window.location: ', window.location);
        console.log('host: ', window.location.host.includes('livepreview'));
        console.log('pathname: ', window.location.pathname.includes('visualEditor'));
        if (window.location.host.includes('livepreview') || window.location.pathname.includes('flexipageEditor')) {
            component.set('v.isPreview', true);
            isPreview = true;
        }
        if (!isPreview) {
            //Send LC Host as parameter to VF page so VF page can send message to LC; make it all dynamic
            component.set('v.lcHost', window.location.hostname);
            var mapOptionsCenter = {"lat":53.2839998, "lng":-9.0837732};
            component.set('v.mapOptionsCenter', mapOptionsCenter);
            //Add message listener
            window.addEventListener("message", function(event) {
                //Can enable origin control for more security
                //if (event.origin != vfOrigin) {
                    //console.log('Wrong Origin');
                    // Not the expected origin: Reject the message!
                    //return;
                //}
                // Handle the message
                if(event.data.state == 'LOADED'){
                    //Set vfHost which will be used later to send message
                    component.set('v.vfHost', event.data.vfHost);
                    
                    //Send data to VF page to draw map
                    helper.sendToVF(component, helper, true);
                }
                else if(event.data.state == 'COMPLETED'){
                    console.log('fireEvent to hide spinner');
                    var spinner = component.find("mySpinner");
                    $A.util.addClass(spinner, "slds-hide");
                    //$A.util.toggleClass(spinner, "slds-hide");
                }
            }, false);
        }
        
        
	    
	},
    handleNewAccounts : function(component, event, helper) {
        console.log('handleNewAccountsMAPS');
        
		var accounts = event.getParam("accounts");
        console.log('accountsMAP: ', accounts);
        
        var mapOptionsCenterBackUp = {"lat":53.2839998, "lng":-9.0837732};
        
        var thePreview = component.get('v.isPreview');
        if(!thePreview){
            if(accounts){
                if(accounts.length > 0){
                    var accountHasMarker = false;
                    for(var i=0; i<accounts.length; i++){
                        if(accounts[i].BillingLatitude != null && accounts[i].BillingLongitude != null){
                            accountHasMarker = true;
                            break;
                        }
                        else{
                            accountHasMarker = false;
                        }
                    }
                    
                    if(accountHasMarker){
                        var mapData = Array();
                        //cmp.set("v.opportunities", response.getReturnValue());
                        for(var z=0; z<accounts.length; z++){
                            if(accounts[z].BillingLatitude != null && accounts[z].BillingLongitude != null){
                                mapData.push({"lat":parseFloat(accounts[z].BillingLatitude), "lng":parseFloat(accounts[z].BillingLongitude), "markerText":accounts[z].Name})
                                var mapOptionsCenter = {"lat":parseFloat(accounts[z].BillingLatitude), "lng":parseFloat(accounts[z].BillingLongitude)};
                            }
                        }
                        component.set('v.mapOptionsCenter', mapOptionsCenter);
                        component.set('v.mapData', mapData);
                        helper.sendToVF(component, helper, false);
                    }
                    else{
                        var mapData = Array();
                        component.set('v.mapData', mapData);
                        component.set('v.mapOptionsCenter', mapOptionsCenterBackUp);
                        helper.sendToVF(component, helper, false);
                    }                    
                }
            }
            else{
                var mapOptionsCenter = mapOptionsCenterBackUp;
                var mapData = Array();
                component.set('v.mapOptionsCenter', mapOptionsCenter);
                component.set('v.mapData', mapData);
                helper.sendToVF(component, helper, false);
            }
        }
        
    }
})