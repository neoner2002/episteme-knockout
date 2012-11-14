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
	},{
	"name" : { "value" : "offer8"},
	"province" : { "value" : "Madrid"},
        "type" : { "value" : "Pequeña Empresa"},
	"logo" : { "text" : "company 2 logo", "value" : "images/default.png"},
	"description" : "The description of second company"
	}
	]}

templateCategories = [
            {"id":0,"name":"province","values":[]}
            ];


AppViewModel = function() {
	    self = this;
	    var limit = "505";

	    self.lang = ko.observable(languages[0]);
            self.loading = ko.observable(false);
	    self.existPagination = ko.observable(false);

	    self.filter = ko.observable();
	    filterType = ko.observable("name");
	    self.availableCategories = ko.observableArray();
	    self.companiesData = ko.observableArray();
	    self.viewData = ko.observableArray();
	    self.loadedCategories = ko.mapping.fromJS(templateCategories);
	    //self.filteredCategory = ko.observableArray();
            //self.filteredData = ko.observableArray();

	    self.focusBar = ko.observable(true);
	    self.setFocusBar = function() { self.focusBar(true); return true;}

	    self.page = ko.observable(0);
            self.status = ko.observable(-1);
	    self.help = ko.observable(true);

            self.viewOffers = ko.mapping.fromJS(offers.offers);

            ko.bindingHandlers.kendoPanelBar.options.expandMode = "single";
            ko.bindingHandlers.kendoPanelBar.options.select = expandCollapse;
              function expandCollapse(e) {
                if ($(e.item).is(".k-state-active")) {
                  var that = this;
                   window.setTimeout(function(){that.collapse(e.item);}, 1);
		   $(e.item.children).removeClass("k-state-selected");
                 }
              };


//filter the items using selectors
self.filteredCategory = ko.computed(function() {  
   var data = self.viewData();
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
                    //console.log(tempString);
                }
           });
           tempFilter = ko.utils.arrayFilter(tempFilter, function(item) {
		return ko.utils.stringContains(item[catParent].value(), tempString);
  	        });
        }); 
        return tempFilter;
   }
},self);

self.hideElement = function(elem) { alert('eo');$(elem).fadeOut() }

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
    };

//reload when filteredData changes
ko.bindingHandlers.autoPaginate = {
    update: function(element, valueAccessor) {
	ko.utils.unwrapObservable(valueAccessor());
	self.reload();
    }
};



// Client-side routes    
sammyPlugin = $.sammy(function() {
	this.bind('redirectEvent', function(e, data) {
       	        this.redirect(data['url_data']);
    	});

        this.get('#/main', function(context) {
		self.page(0);
		self.viewOffers.sortByPropertyAsc('name', 'value');
		$("#droppableElements").animate({height: "122px", width: "152px"}, 200 );
		$("#droppableElements").css( 'box-shadow' , 'inset 0 0 3px #ccc'  );
		$(".dragContainer").hide();
		$(".dragContainer").fadeIn();
                $(".menuItemArrow").stop().animate({marginLeft: "50px",}, 300 );
		$(".filterPanel").stop().animate({marginLeft: "-200px"}, 300 );
		self.filter("");
		self.focusBar(true);
		self.reload();
	});

	this.get('#/composer', function(context) {
		if(self.status() <= 0){ 
                  this.redirect('#/main');
                  return;
                }
		self.page(1);
		if(self.status() > 0) $("#droppableElements").animate({height: "122px", width: "550px"}, 300 );
		$(".dragContainer").hide().fadeIn();
                $(".controlContainer").hide().fadeIn();
		//$(".filterPanel").hide().fadeIn();
		$("#droppableElements").css( 'box-shadow' , 'inset 0 0 3px #ccc'  );
                $(".menuItemArrow").stop().animate({marginLeft: "170px"}, 300 );
		$(".filterPanel").stop().animate({marginLeft: "15px"}, 300 );
	        $(".filterPanel").animate({marginLeft: "10px"}, 500 );
		self.filter("");
		self.focusBar(true);
		self.reload();
		
	});
        this.get('#/finalize', function(context) {
		if(self.status() <= 0){ 
                  this.redirect('#/main');
                  return;
                }
                self.page(2);
		if(self.status() > 0) {
                  $(".filterPanel").stop().animate({marginLeft: "-200px"}, 300 );
                  $("#droppableElements").animate({width: "550px"}, 300 );
		  $("#droppableElements").animate({height: "350px"}, 200 );
		  $("#droppableElements").css( 'box-shadow' , ' 0 0 10px #bbb'  );
                }
                $(".menuItemArrow").stop().animate({marginLeft: "290px",}, 300 );
		self.filter("");
		self.focusBar(true);
		self.reload();
		$(".droppable").draggable( "destroy" );	
	});
	this.get('#/wizard', function(context) {
		self.page(3);
		self.filter("");
		self.reload();
	});
}).run('#/main'); 


self.reload = function(){
	console.log("reload!");
	paginate();
	createTooltips();
        createFilters();
	OnloadFunction();
	if($('.page_navigation').is(':empty')){
	  self.existPagination(false);
	}else{
	  self.existPagination(true);
	}
}

function populateCategories(pIndex){
    var parent = self.loadedCategories()[pIndex];
    var countIndex = 0;      
        $.each(self.availableCategories(), function(index, item) {  
          //console.log(self.availableCategories()[index]); 
          parent.values.remove(function(item) {
            return item.name() == self.availableCategories()[index];
          });     
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

var url1 = "http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+*+WHERE+%7B%5B%5D+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fname%3E+%3Fname+%3B+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fprovince%3E+%3Fprovince+%3B+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Flogo%3E+%3Flogo+%3B+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Ftype%3E+%3Ftype+%3B%7D&output=json";

var url2 = "http://138.4.3.224:8080/Episteme/CompanyMatcher?categorie[0]=Web&categorie[1]=Wifi&weight[0]=0.25&weight[1]=0.75&json=json1";

self.loadData = function loadData(){
	    $('#blackDIV').addClass('blackActive');
            $.ajax({
	    type: 'GET',
	    url: "http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+%3Fname+%3Flogo+%3Furl+%3Fstreetaddress+%3Fprovince+%3Fsummary+WHERE+%7B%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23VCard%3E+%3Fnodoblanco+.%0D%0A++%3Fnodoblanco+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23logo%3E+%3Flogo+.%0D%0A++%3Fnodoblanco+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23fn%3E+%3Fname+.%0D%0A++%3Fnodoblanco+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23url%3E+%3Furl+.%0D%0A++%3Fnodoblanco+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23adr%3E+%3Fadrnodoblanco+.%0D%0A++%3Fadrnodoblanco+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23street-address%3E+%3Fstreetaddress+.%0D%0A++%3Fadrnodoblanco+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23locality%3E+%3Fprovince+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23General%3E+%3FnodoblancoSummary+.%0D%0A++%3FnodoblancoSummary+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23summary%3E+%3Fsummary%0D%0A%7D%0D%0ALIMIT+50&output=json",
	    dataType: 'json',
            success: function(allData) {
		    data = JSON.stringify(allData.results.bindings);
		    console.log("Alldata es: " + data); 
                    self.companiesData = ko.mapping.fromJSON(data);
		    self.viewData = ko.mapping.fromJSON(data);
	    },
            error: function (xhr, status) {  
                  self.loading(false);
                  alert('Unknown error ' + status); 
            },
	    data: {},
	    async: false
	    });
		
	    loadCategories();
}

function loadCategories(){
       $.each(self.loadedCategories(), function(index, item) {
         self.availableCategories(ko.utils.getDataColumns(item.name()));
         //console.log( self.availableCategories());
         populateCategories(index);
       });
}

self.changeLanguage = function(place) {  
        self.lang(languages[place]);
	if(self.status() == -1){
	  saveDefault = true;
	  ko.applyBindings(self, document.getElementById("droppableText1"), document.getElementById("droppableText2"), document.getElementById("droppableText3"));
          self.reload();
	}
};

self.activateHelp = function() {  
   self.help(!self.help());
};



}




	// Activates knockout.js
	ko.applyBindings(new AppViewModel());
});
