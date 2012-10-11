$(document).ready(function() {





var loadedData;

ko.utils.stringContains = function(string, contain) {
    string = string || "";
    if (contain.length > string.length) return false;
    return string.indexOf(contain) !== -1
};
	
function AppViewModel() {
	    var self = this;
	    var limit = "115";
	    self.filter = ko.observable();
	    filteredData : ko.observableArray();
	    filterType = ko.observable("name");
	    self.focusBar = ko.observable(true);
	    self.setFocusBar = function() { self.focusBar(true); console.log("eo"); return true;}
	    self.dragdropPage = ko.observable();

	    $.ajax({
	    type: 'GET',
	    url: "http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+*+WHERE%7B%5B%5D+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fname%3E+%3Fname+%3B+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fprovince%3E+%3Fprovince+%3B+%7D+LIMIT+"+limit+"&output=json",
	    dataType: 'json',
	    success: function(allData) {
		    //console.log("Alldata es: " + JSON.stringify(allData.results.bindings)); 
		    loadedData = ko.mapping.fromJS(allData.results.bindings);
		    self.viewData = loadedData;
	    },
	    data: {},
	    async: false
	    });
	    
	    
	     this.dataColumns = ko.computed( function() {
		    var mapping = _.map(self.viewData(), function(element){ return Object.keys(element); });
		    var flat = _.reduce(mapping, function(a,b){return a.concat(b); }, [] );
		    var unique = _.uniq(flat);
		    return unique;
	    });

//filter the items using the filter text
self.filteredData = ko.computed(function() {
    var filter = self.filter();
    if (!filter) {
        console.log();
        return self.viewData();
    } else {
        return ko.utils.arrayFilter(self.viewData(), function(item) {
		//console.log(itm.province.value());
		var type = filterType();
            return ko.utils.stringContains(item[type].value().toLowerCase(), filter.toLowerCase());
        });
    }
}, self);


//reload when filteredData changes
ko.bindingHandlers.autoPaginate = {
    update: function(element, valueAccessor) {
	ko.utils.unwrapObservable(valueAccessor());
	reload();
    }
};



// Client-side routes    
sammyPlugin = $.sammy(function() {
	this.bind('redirectEvent', function(e, data) {
       	        this.redirect(data['url_data']);
    	});

        this.get('#/main', function(context) {
		self.dragdropPage(true);
	});

	this.get('#/composer', function(context) {
		self.dragdropPage(false);
	});
    }).run('#/main'); 


function reload(){
	console.log("reload!");
	paginate();
	OnloadFunction();

}


}
	// Activates knockout.js
	ko.applyBindings(new AppViewModel());
});
