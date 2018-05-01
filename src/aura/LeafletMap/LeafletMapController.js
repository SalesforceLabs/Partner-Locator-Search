({
    doInit : function(component, event, helper) {
        console.log('************************doInit MAP');
        
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
        
        $(theMap).css('height',theHeight);
        console.log('Height change called');
        $(thePreview).css('height',theHeight);
        
        var url = window.location;
        var isPreview = false;
        
        if (window.location.host.includes('livepreview') || window.location.pathname.includes('flexipageEditor')) {
            component.set('v.isPreview', true);
            isPreview = true;
        }
        
        var map = component.get("v.map");
        
        // Draw the map if it hasn't been drawn yet
        if (!map) {
        	var mapElement = component.find("map").getElement();
        	map = window.L.map(mapElement, {zoomControl: true, zoomAnimation:false}).setView([53.2839998, -9.0837732], 4);
        	window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
                           {attributionControl: false}).addTo(map);
        	component.set("v.map", map);
            
            var markers = new L.featureGroup();
            component.set("v.markers", markers);
            // If we had received accounts before Leaflet was loaded, add markers for these accounts
            //helper.addMarkers(component);
            
        }
    },
    handleNewAccounts : function(component, event, helper) {
        console.log('handleNewAccounts');
        
        var accounts = event.getParam("accounts");
        console.log('accountsMAP: ', accounts);
        component.set("v.accounts", accounts);
        
    },
    accountsChangeHandler: function(component, event, helper) {
        helper.addMarkers(component);
    }
})