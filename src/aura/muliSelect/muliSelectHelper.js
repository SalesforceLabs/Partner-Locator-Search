({
    
    setInfoText: function(component, values) {
        
        if (values.length == 0) {
            component.set("v.infoText", "Select an option...");
        }
        if (values.length == 1) {
            component.set("v.infoText", values[0]);
        }
        else if (values.length > 1) {
            component.set("v.infoText", values.length + " options selected");
        }
    },
    
    getSelectedValues: function(component){
        var options = component.get("v.options_");
        var values = [];
        options.forEach(function(element) {
            if (element.selected) {
                values.push(element.value);
            }
        });
        component.set('v.selectedValues', values);
        return values;
    },
    
    getSelectedLabels: function(component){
        var options = component.get("v.options_");
        var labels = [];
        options.forEach(function(element) {
            if (element.selected) {
                labels.push(element.label);
            }
        });
        return labels;
    },
    
    despatchSelectChangeEvent: function(component,values){
        var compEvent = component.getEvent("selectChange");
        var apiName = component.get('v.picklistApiName');
        console.log('apiNameapiNameapiName', apiName);
        compEvent.setParams({ "values": values, "apiName": apiName });
        compEvent.fire();
    }
    
})