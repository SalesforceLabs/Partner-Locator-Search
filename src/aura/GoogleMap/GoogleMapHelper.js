({
    sendToVF : function(component, helper, refresh) {
        //Prepare message in the format required in VF page
        var message = {
			            "loadGoogleMap" : refresh,
            			"mapData": component.get('v.mapData'), 
            			"mapOptions": component.get('v.mapOptions'),  
                       	'mapOptionsCenter': component.get('v.mapOptionsCenter')
        		} ;
        //Send message to VF
        helper.sendMessage(component, helper, message);
    },
    sendMessage: function(component, helper, message){
        //Send message to VF
        try{
            message.origin = window.location.hostname;
            var vfWindow = component.find("vfFrame");
            console.log('component.get("v.vfHost"): ', component.get("v.vfHost"));
            if(vfWindow){
                if(vfWindow.getElement()){
                    vfWindow = vfWindow.getElement().contentWindow;
                    console.log('vfWindow: ', vfWindow);
                    message = JSON.parse(JSON.stringify(message));
                    vfWindow.postMessage(message, component.get("v.vfHost"));
                }
            }
        }
        catch(e){
            //console.log('e: ',e);
        }
        
    }
})