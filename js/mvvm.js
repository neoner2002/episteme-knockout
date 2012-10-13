$(document).ready(function() {


ko.utils.stringContains = function(string, contain) {
    string = string.toLowerCase();
    contain = contain.toLowerCase();
    string = string || "";
    if (contain.length > string.length) return false;
    return string.indexOf(contain) !== -1
};

offers = {"offers": [{
	"name" : { "value" : "offer1"},
	"logo" : { "text" : "company 4 logo", "value" : "images/offer1.png"},
	"description" : "The description of fourth company",
	"capabilities" : [ "Pequeña y mediana empresa", "Universidad","Otros" ]

	},{
	"name" : { "value" : "offer2"},
	"logo" : { "text" : "company 4 logo", "value" : "images/offer2.png"},
	"description" : "The description of fourth company",
	"capabilities" : [ "Pequeña y mediana empresa", "Universidad","Otros" ]

	},{
	"name" : { "value" : "offer3"},
	"logo" : { "text" : "company 4 logo", "value" : "images/offer3.png"},
	"description" : "The description of fourth company",
	"capabilities" : [ "Pequeña y mediana empresa", "Universidad","Otros" ]

	},{
	"name" : { "value" : "offer4"},
	"logo" : { "text" : "company 4 logo", "value" : "images/offer4.png"},
	"description" : "The description of fourth company",
	"capabilities" : [ "Pequeña y mediana empresa", "Universidad","Otros" ]

	},{
	"name" : { "value" : "offer5"},
	"logo" : { "text" : "company 4 logo", "value" : "images/offer5.png"},
	"description" : "The description of fourth company",
	"capabilities" : [ "Pequeña y mediana empresa", "Universidad","Otros" ]

	},{
	"name" : { "value" : "offer6"},
	"logo" : { "text" : "company 3 logo", "value" : "images/offer6.png"},
	"description" : "The description of third company",
	"capabilities" : [ "Gran Empresa","Centro Tecnológico","Pequeña y mediana empresa" ]

	},{
	"name" : { "value" : "offer7"},
	"logo" : { "text" : "company 2 logo", "value" : "images/offer7.png"},
	"description" : "The description of second company",
	"capabilities" : [ "Centro Privado de Investigación","Asociación de Empresa"  ]

	}]}
	
AppViewModel = function() {
	    self = this;
	    var limit = "505";

	    self.lang = ko.observable(languages[0]);

	    self.filter = ko.observable();

	    loadeddata = "";
            self.filteredData = ko.observableArray();

	    filterType = ko.observable("name");
	    self.focusBar = ko.observable(true);
	    self.pageNavigation = ko.observable(true);
	    self.setFocusBar = function() { self.focusBar(true); console.log("eo"); return true;}

	    self.page = ko.observable(0);
            self.status = ko.observable(0);

if(self.page() == 0){
loadData();
}

//filter the items using the filter text
self.filteredData = ko.computed(function() {
    var filter = self.filter();
    var data = self.viewData();
    if (!filter) {
        //console.log(self.viewData().length);
        return self.viewData();
    } else {
        return ko.utils.arrayFilter(self.viewData(), function(item) {
		var type = filterType();
            return ko.utils.stringContains(item[type].value(), filter);
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
		self.page(0);
		ko.mapping.fromJS(offers.offers, self.viewData);
		$(".dropContainer").animate({width: "140px", opacity: 1,}, 300 );
		$(".dragContainer").hide();
		$(".dragContainer").fadeIn();
		self.filter("");
		reload();
	});

	this.get('#/composer', function(context) {
		if(self.status() == 0) this.redirect('#/main');
		self.page(1);
		ko.mapping.fromJS(loadedData, self.viewData);
		if(self.status() != 0) $(".dropContainer").animate({width: "460px", opacity: 1,}, 300 );
		$(".dragContainer").hide();
		$(".dragContainer").fadeIn();
		self.filter("");
		reload();
		
	});
        this.get('#/finalize', function(context) {
		if(self.status() == 0) this.redirect('#/main');
		if(self.status() != 0) $(".dropContainer").animate({width: "460px", opacity: 1,}, 300 );
		self.page(2);
		self.filter("");
		reload();
	});
	this.get('#/wizard', function(context) {
		self.page(3);
		self.filter("");
		reload();
	});
}).run('#/main'); 


function reload(){
	console.log("reload!");
	paginate();
	OnloadFunction();

}


function loadData(){
            $.ajax({
	    type: 'GET',
	    url: "http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+*+WHERE%7B%5B%5D+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fname%3E+%3Fname+%3B+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fprovince%3E+%3Fprovince+%3B+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Flogo%3E+%3Flogo+%3B+%7D+LIMIT+"+limit+"&output=json",
	    dataType: 'json',
	    success: function(allData) {
		    console.log("Alldata es: " + JSON.stringify(allData)); 
		    loadedData = allData.results.bindings;
		    self.viewData = ko.mapping.fromJS(loadedData);
		      //console.log(offers.offers);

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
}


self.changeLanguage = function(place) {  
             self.lang(languages[place]); 
         };



}




	// Activates knockout.js
	ko.applyBindings(new AppViewModel());
});
