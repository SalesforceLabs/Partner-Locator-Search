({
	addMarkers: function(component) {
        var map = component.get('v.map');
        var markers = component.get('v.markers');
        var accounts = component.get('v.accounts');
        /*
        var profUrl = $A.get('$Resource.PartnerLocator_AccountIcon');
        url: '{!$Resource.PartnerLocator_AccountIcon}',*/
        
        var plocIcon = L.icon({
            iconUrl: $A.get('$Resource.partner_locator__PartnerLocator_AccountIcon'),
            iconSize:     [36, 36], // size of the icon
            iconAnchor:   [18, 36], // point of the icon which will correspond to marker's location
            popupAnchor:  [0, -36] // point from which the popup should open relative to the iconAnchor
            // shadowUrl: 'leaf-shadow.png',
            // shadowSize:   [50, 64], // size of the shadow
            // shadowAnchor: [4, 62],  // the same for the shadow
        });
        
        // Remove existing markers
        if (markers) {
        	markers.clearLayers();
        }
        
        // Add Markers
        var lastMarkerIndex = 0;
        if (map && accounts && accounts.length > 0) {
            for (var i=0; i<accounts.length; i++) {
                var account = accounts[i];
                if (account.BillingLatitude != null && account.BillingLongitude != null) {
	                var latLng = [account.BillingLatitude, account.BillingLongitude];
    	            var marker = window.L.marker(latLng, {icon: plocIcon}, {account: account}).bindPopup(account.Name);
                   	markers.addLayer(marker);
                    lastMarkerIndex = i;
                }
            }
           	component.set('v.markers', markers);
            /*
            map.setZoom(4);
            if(accounts[lastMarkerIndex].BillingLatitude != null && accounts[lastMarkerIndex].BillingLongitude != null){
            	map.panTo(new L.LatLng(parseFloat(accounts[lastMarkerIndex].BillingLatitude), parseFloat(accounts[lastMarkerIndex].BillingLongitude)));
            }
        	*/
            map.addLayer(markers);
            
            map.fitBounds(markers.getBounds());
            
        }
        else if(map){
            map.panTo(new L.LatLng(53.2839998, -9.0837732));
        }
    }
})