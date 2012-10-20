$(document).ready(function() {


ko.utils.stringContains = function(string, contain) {
    string = string.toLowerCase();
    contain = contain.toLowerCase().replace(/^\s\s*/, '').replace(/\s\s*$/, '').split(" ").join("|");
    string = string || "";
    //if (contain.length > string.length) return false;
    var regex = new RegExp(""+contain+"");
    //console.log(contain);
    return string.search(regex) !== -1
};

//Ordenar ObservableArray por "datacolumn"
//self.myObservableArray.sortByPropertyAsc('name');
ko.observableArray.fn.sortByPropertyAsc = function(prop, accesor) {
        this.sort(function(obj1, obj2) {
            if (obj1[prop][accesor]() == obj2[prop][accesor]())
                return 0;
            else if (obj1[prop][accesor]() < obj2[prop][accesor]())
                return -1;
            else
                return 1;
        });
}

ko.observableArray.fn.sortByPropertyCat = function(prop) {
        this.sort(function(obj1, obj2) {
            if (obj1[prop]() == obj2[prop]())
                return 0;
            else if (obj1[prop]() < obj2[prop]())
                return -1;
            else
                return 1;
        });
}

//Te devuelve el contenido compacto de un datacolumn
ko.utils.getDataColumns = function(type) {    
    var results = ko.utils.arrayMap(self.companiesData(), function(item) {
        return item[type].value();
    });
	//console.log(ko.utils.arrayGetDistinctValues(results).sort());
    return ko.utils.arrayGetDistinctValues(results).sort();
};


offers = {"offers": [{
	"name" : { "value" : "offer1"},
        "province" : { "value" : "Madrid"},
        "type" : { "value" : "Pequeña Empresa"},
	"logo" : { "text" : "company 4 logo", "value" : "images/offer1.png"},
	"description" : "The description of fourth company"

	},{
	"name" : { "value" : "offer2"},
	"province" : { "value" : "Madrid"},
        "type" : { "value" : "Pequeña Empresa"},
	"logo" : { "text" : "company 4 logo", "value" : "images/offer2.png"},
	"description" : "The description of fourth company"

	},{
	"name" : { "value" : "offer3"},
	"province" : { "value" : "Madrid"},
        "type" : { "value" : "Pequeña Empresa"},
	"logo" : { "text" : "company 4 logo", "value" : "images/offer3.png"},
	"description" : "The description of fourth company"

	},{
	"name" : { "value" : "offer4"},
	"province" : { "value" : "Madrid"},
        "type" : { "value" : "Pequeña Empresa"},
	"province" : { "value" : "Madrid"},
        "type" : { "value" : "Pequeña Empresa"},
	"logo" : { "text" : "company 4 logo", "value" : "images/offer4.png"},
	"description" : "The description of fourth company"

	},{
	"name" : { "value" : "offer5"},
	"province" : { "value" : "Madrid"},
        "type" : { "value" : "Pequeña Empresa"},
	"logo" : { "text" : "company 4 logo", "value" : "images/offer5.png"},
	"description" : "The description of fourth company"

	},{
	"name" : { "value" : "offer6"},
	"province" : { "value" : "Madrid"},
        "type" : { "value" : "Pequeña Empresa"},
	"logo" : { "text" : "company 3 logo", "value" : "images/offer6.png"},
	"description" : "The description of third company"

	},{
	"name" : { "value" : "offer7"},
	"province" : { "value" : "Madrid"},
        "type" : { "value" : "Pequeña Empresa"},
	"logo" : { "text" : "company 2 logo", "value" : "images/offer7.png"},
	"description" : "The description of second company"

	}]}

availableCategories = [
            {"id":0,"name":"province","values":[]},
            {"id":1,"name":"type","values":[]}
            ];


AppViewModel = function() {
	    self = this;
	    var limit = "505";

	    self.lang = ko.observable(languages[0]);
            self.loading = ko.observable(true);
            self.loadingCat = ko.observable(true);

	    self.filter = ko.observable();

	    self.availableCategories = ko.observableArray();
	    self.loadedCategories = ko.mapping.fromJS(availableCategories);
	    self.filteredCategory = ko.observableArray();
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

//filter the items using selectors
self.filteredCategory = ko.computed(function() {  

   var data = self.viewData();
   if(self.loadingCat() == true){
       $.each(self.loadedCategories(), function(index, item) {  
         self.availableCategories(ko.utils.getDataColumns(item.name()));
         //console.log( self.availableCategories());
         populateCategories(index);
       });
      self.loadingCat(false);
   }

   var filtro = self.loadedCategories();

   if(!filtro){
	return self.viewData();  
   }else{
        tempFilter = self.viewData();
        //return ko.utils.arrayFilter(self.viewData(), function(item) {
	//	return ko.utils.stringContains(item.name.value(), filtro);
  	//});
        $.each(self.loadedCategories(), function(index1, item1) {
           tempString = "";
           catParent = item1.name();
           //console.log(item1.values());
           $.each(item1.values(), function(index2, item2) {
                if(item2.state() == true){
                    tempString += " "+item2.name();
                    console.log(tempString);
                }
           });
           tempFilter = ko.utils.arrayFilter(tempFilter, function(item) {
		return ko.utils.stringContains(item[catParent].value(), tempString);
  	        });
        }); 
        return tempFilter;
   }
},self);

//filter the items using the filter text
self.filteredData = ko.computed(function() {
    var filter = self.filter();
    var data = self.filteredCategory();
    if (!filter) {
        //console.log(self.viewData().length);
        return data;
    } else {
        return ko.utils.arrayFilter(data, function(item) {
		var type = filterType();
            return ko.utils.stringContains(item[type].value(), filter);
        });
    }
}, self);

self.selection = function(pIndex, index, name) {
        var parent = self.loadedCategories()[pIndex];
        var temp = !parent.values()[index()].state();  
        //alert(pIndex +" "+ index +" "+ name); 
        parent.values.remove(function(item) {
            return item.name() == name;
        });                 
        parent.values.push(
            {"id": index,
             "name": ko.observable(name),
             "state": ko.observable(temp)
            }
        );
        parent.values.sortByPropertyCat('id');
    self.loadedCategories(self.loadedCategories());
    };

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
		self.viewData.sortByPropertyAsc('name', 'value');
		$(".dropContainer").animate({height: "150px", width: "190px", opacity: 1,}, 300 );
		$(".dragContainer").hide();
		$(".dragContainer").fadeIn();
                $("#filterBtn").hide();
                $("#search").animate({width: "450px",}, 300 );
		self.filter("");
		self.focusBar(true);
		reload();
	});

	this.get('#/composer', function(context) {
		if(self.status() == 0) this.redirect('#/main');
		self.page(1);
		ko.mapping.fromJS(self.companiesData, self.viewData);
		self.viewData.sortByPropertyAsc('name', 'value');
		if(self.status() != 0) $(".dropContainer").animate({height: "150px", width: "510px", opacity: 1,}, 300 );
		$(".dragContainer").hide();
		$(".dragContainer").fadeIn();
                $("#filterBtn").fadeIn();
                $("#search").animate({width: "300px",}, 300 );
		self.filter("");
		self.focusBar(true);
		reload();
		
	});
        this.get('#/finalize', function(context) {
		self.page(2);
		if(self.status() == 0) this.redirect('#/main');
		if(self.status() != 0) {
                  $(".dropContainer").animate({width: "510px"}, 300 );
		  $(".dropContainer").animate({height: "350px"}, 300 );
                }
		self.filter("");
		self.focusBar(true);
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
	createTooltips();
	OnloadFunction();

}

function populateCategories(pIndex){
    var parent = self.loadedCategories()[pIndex];
    var countIndex = 0;      
        $.each(self.availableCategories(), function(index, item) {  
          //console.log(self.availableCategories()[index]);  
          parent.values.push(
            {"id": ko.observable(countIndex++),
             "name": ko.observable(self.availableCategories()[index]),
             "state": ko.observable(false)
            }
          );
        });  
        parent.values.sortByPropertyCat('id');
}

 function HtmlEncode(s)
{
 var el = document.createElement("div");
 el.innerText = el.textContent = s;
 s = el.innerHTML;
 return s;
}

function loadData(){
            $.ajax({
	    type: 'GET',
	    url: "http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+*+WHERE+%7B%5B%5D+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fname%3E+%3Fname+%3B+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fprovince%3E+%3Fprovince+%3B+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Flogo%3E+%3Flogo+%3B+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Ftype%3E+%3Ftype+%3B%7D&output=json",
	    dataType: 'json',
	    success: function(allData) {
		    //console.log("Alldata es: " + JSON.stringify(allData)); 
		    self.companiesData = ko.mapping.fromJS(allData.results.bindings);
		    self.viewData = ko.mapping.fromJS(self.companiesData);
		    self.loading(false);
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
