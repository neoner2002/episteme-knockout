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

ko.observableArray.fn.sortByPropertyDesc = function(prop, accesor) {
        this.sort(function(obj1, obj2) {
            if (obj1[prop][accesor]() == obj2[prop][accesor]())
                return 0;
            else if (obj1[prop][accesor]() > obj2[prop][accesor]())
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

templateCategories = [
            {"id":0,"name":"province","values":[]},
	    {"id":1,"name":"type","values":[]}
            ];

templateOfferReq = [
            {"id":0,"name":"caja1","values":[]},
	    {"id":1,"name":"caja2","values":[]},
            {"id":2,"name":"caja3","values":[]},
            {"id":3,"name":"caja4","values":[]},
            {"id":4,"name":"caja5","values":[]},
            {"id":5,"name":"caja6","values":[]}
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
	    self.help = ko.observable(false);
            self.helpText = ko.observable(false);

            self.viewOffers = ko.observableArray();
            self.offerReq = ko.observableArray();  
            self.selectedOffer = ko.observable("");

	    self.offerDetails = ko.observableArray(); 
            self.offerDetailsSkills = ko.observableArray();
            self.offerReqSkills = ko.mapping.fromJS(templateOfferReq);
            self.nestedReqSkills = ko.observableArray();

	    self.companyDetails = ko.observableArray();
            self.companyDetailsSkills = ko.observableArray();

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

//LOAD OFFERS
self.loadOffers = function loadOffers(){
            $.ajax({
	    type: 'GET',
	    url: "http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+%3Fname+%3Flogo+WHERE+%7B%0D%0A%3Fs+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23name%3E+%3Fname+.+%0D%0A%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Flogo%3E+%3Flogo+%0D%0A%7D%0D%0A&output=json",
	    dataType: 'json',
            success: function(allData) {
		    data = JSON.stringify(allData.results.bindings);
		    //console.log("Alldata es: " + data); 
		    self.viewOffers = ko.mapping.fromJSON(data);
	    },
            error: function (xhr, status) {  
                  alert('Error loading offers ' + status);
            },
	    data: {},
	    async: false
	    });
}

// Client-side routes    
sammyPlugin = $.sammy(function() {
	this.bind('redirectEvent', function(e, data) {
       	        this.redirect(data['url_data']);
    	});
        self.loadOffers();
        this.get('#/main', function(context) {
		self.page(0);
		self.viewOffers.sortByPropertyAsc('name', 'value');
		$("#droppableElements").animate({height: "122px", width: "0px"}, 200 );
		$("#droppableElements").css( 'box-shadow' , 'inset 0 0 3px #ccc'  );
		$(".dragContainer").hide().fadeIn();
	        $(".lines").hide().fadeIn('slow');
                $(".menuItemArrow").stop().animate({marginLeft: "50px",}, 300 );
		$(".filterPanel").stop().animate({marginLeft: "-200px"}, 300 );
		self.filter("");
		self.focusBar(true);
		self.reload();
	});

	this.get('#/composer/:offerId', function(context) {
		if(self.status() <= 0){ 
                  this.redirect('#/main');
                  return;
                }
             
                if(self.selectedOffer() != this.params.offerId){
                numBoxes = -1;
		processOffer(this.params.offerId);
                self.loadData(this.params.offerId);
                self.viewData.sortByPropertyAsc('name', 'value');
                self.selectedOffer(this.params.offerId);
		}
		droppwidth = 152 + (numBoxes*152);
                if(self.page() == 0) $(".selectedOffer").hide().fadeIn();
                //if(self.page() == 0) $("#droppableElements").hide().fadeIn();
		self.page(1);
		if(self.status() > 0) $("#droppableElements").animate({height: "122px", width: droppwidth+"px"}, 300 );
		$(".dragContainer").hide().fadeIn();
                $(".controlContainer").hide().fadeIn();
		$(".lines").hide().fadeIn('slow');
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
                  $("#droppableElements").animate({width: droppwidth+"px"}, 300 );
		  $("#droppableElements").animate({height: "350px"}, 200 );
		  $("#droppableElements").css( 'box-shadow' , ' 0 0 10px #bbb'  );
                }
                $(".menuItemArrow").stop().animate({marginLeft: "290px",}, 300 );
		$(".lines").hide().fadeIn('slow');
		self.filter("");
		self.focusBar(true);
		self.reload();
		$(".droppable").draggable( "destroy" );
                resetDroppables();
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
//LOAD DATA
self.loadData = function loadData(offerName){
	    $('#blackDIV').addClass('blackActive');
            $.ajax({
	    type: 'GET',
	    url: "http://minsky.gsi.dit.upm.es/episteme/Episteme/CompanyMatcher?offer="+offerName,
	    dataType: 'json',
            success: function(allData) {
		    data = JSON.stringify(allData.results.bindings);
		    //console.log("Alldata es: " + data); 
                    self.companiesData = ko.mapping.fromJSON(data);
		    self.viewData = ko.mapping.fromJSON(data);
		    self.loading(false);
	    },
            error: function (xhr, status) {  
                  self.loading(false);
                  alert('Error loading companies ' + status); 
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

function processOffer(offerId){
            $.ajax({
	    type: 'GET',
	    url: 'http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+%3Freq+%3Ffield+%3Fweight+%0D%0AWHERE+%7B%0D%0AGRAPH+%3Chttp%3A%2F%2F'+offerId+'%3E+%7B+%0D%0A%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2FcompanyReq%3E+%3Freq+.+%0D%0A%3Freq+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Preference%3E+%3Fpref1t+.+%0D%0A%3Fpref1t+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Ffield%3E+%3Ffield+.+%0D%0A%3Fpref1t+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23weight%3E+%3Fweight%0D%0A%7D%0D%0A%7D&output=json',
	    dataType: 'json',
            success: function(allData) {
		    data = JSON.stringify(allData.results.bindings);
		    console.log("Alldata es: " + data);
		    postProcessOffer(allData.results.bindings);
	    },
            error: function (xhr, status) {  
                  alert('Error loading offer ' + status);
            },
	    data: {},
	    async: false
	    });
}

function postProcessOffer(data){
   self.offerReq.removeAll();
   var array = new Array();
   var init = true;
   $.each(data, function() {
     $.each(this, function(k, v) {
       if(k == 'req'){
         if(init){
           array.push(v.value);
           init = false;
	 }
         var exist = false;
         $.each(array, function (index,value) {
	   if(value == v.value){
             exist = true;
	 }
         });
	if(!exist) array.push(v.value);
       }
     });
   });
   for (var i=0;i<self.offerReqSkills().length;i++)
   { 
    
     var parent = self.offerReqSkills()[i];
     //alert(parent.values().length)
     parent.values.removeAll();
   }
   $.each(array, function (index,value) {
     self.offerReq.push('caja'+(index+1));
     populateReq(index, value, data);
     //alert(index+" "+value);
     numBoxes++; 
   });
   nestReqSkills();
}

function populateReq(pIndex, reqId, data){
    var parent = self.offerReqSkills()[pIndex];
    var countIndex = 0;      
    $.each(data, function() {
     var f; 
     var w;
     $.each(this, function(k, v) {
         if(k == 'field') f=v.value;
         if(k == 'weight') w=v.value;
         if(k == 'req'){
           if(v.value == reqId){
            parent.values.push(
            {"id": ko.observable(countIndex++),
             "name": ko.observable(f),
             "level": ko.observable(w)
            }
            );
           }
         }
     });
   });
}

function nestReqSkills(){
  self.nestedReqSkills([]);
  for (var i=0;i<self.offerReqSkills().length;i++)
   { 
     var nested = "";
     var parent = self.offerReqSkills()[i];
     //alert(parent.values().length)
     for (var j=0;j<parent.values().length;j++)
       {
	  //alert(parent.values()[j].name());
          nested = nested + '<tr><td>' +parent.values()[j].name()+'</td><td>'+parent.values()[j].level()+'</td></tr>';
       }
     self.nestedReqSkills.push(nested);
   }
}

self.changeLanguage = function(place) {  
        self.lang(languages[place]);
	if(self.status() == -1){
          saveDefault = true; 
          self.reload();
	}
};

self.activateHelp = function(type, value) { 
self.offerDetails([]);
self.offerDetailsSkills([]);
self.companyDetails([]);
self.companyDetailsSkills([]);
self.helpText(false);
if(type == "offer"){

   $.ajax({
	    type: 'GET',
	    url: 'http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+DISTINCT+%3Fname+%3Flogo+%3Fdetail+%3Fcontractor+%3Fbudget+%3Faddress+%3FbeginDate+%3FendDate+%3Freq%0D%0AWHERE+%7B%0D%0A++GRAPH+%3Chttp%3A%2F%2F'+value+'%3E+%7B%0D%0A++%3Fs+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23name%3E+%3Fname+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23detail%3E+%3Fdetail+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Flogo%3E+%3Flogo+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fcontractor%3E+%3Fcontractor+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Fbudget%3E+%3Fbudget+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Address%3E+%3Faddress+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2FbeginDate%3E+%3FbeginDate+.+%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2FendDate%3E+%3FendDate%0D%0A++%7D%0D%0A%7D&output=json',
	    dataType: 'json',
            success: function(allData) {
		    data = JSON.stringify(allData.results.bindings);
		    //console.log("Alldata es: " + data);
                    self.offerDetails(ko.mapping.fromJSON(data));
	    },
            error: function (xhr, status) {  
                  alert('Error loading offer ' + status);
            },
	    data: {},
	    async: false
	    });

   $.ajax({
	    type: 'GET',
	    url: 'http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+%3Freq+%3Ffield+%3Fweight+%0D%0AWHERE+%7B%0D%0A++GRAPH+%3Chttp%3A%2F%2F'+value+'%3E+%7B%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2FcompanyReq%3E+%3Freq+.+%0D%0A++++%3Freq+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Preference%3E+%3Fpref1t+.+%0D%0A++++++%3Fpref1t+%3Chttp%3A%2F%2Fwww.gsi.dit.upm.es%2Ffield%3E+%3Ffield+.+%0D%0A++++++%3Fpref1t+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23weight%3E+%3Fweight%0D%0A++%7D%0D%0A%7D&output=json',
	    dataType: 'json',
            success: function(allData) {
		    data = JSON.stringify(allData.results.bindings);
		    //console.log("Alldata es: " + data);
                    self.offerDetailsSkills(ko.mapping.fromJSON(data));
	    },
            error: function (xhr, status) {  
                  alert('Error loading offer ' + status);
            },
	    data: {},
	    async: false
	    });
}

if(type == "company"){

   $.ajax({
	    type: 'GET',
	    url: 'http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+%3Fname+%3Flogo+%3Fpostalcode+%3Fprovince+%3Faddress+%3Ftype+%3Fsummary+WHERE+%7B%0D%0A++%3C'+encodeURIComponent(value)+'%3E+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23VCard%3E+%3Fvcard+.%0D%0A++++OPTIONAL%7B%0D%0A++++%3Fvcard+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23logo%3E+%3Flogo+.%0D%0A++++%7D%0D%0A++++%3Fvcard+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23fn%3E+%3Fname+.%0D%0A++++%3Fvcard+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23adr%3E+%3Fdireccionnodo+.%0D%0A++++++%3Fdireccionnodo+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23postal-code%3E+%3Fpostalcode+.%0D%0A++++++%3Fdireccionnodo+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23locality%3E+%3Fprovince+.%0D%0A++++++%3Fdireccionnodo+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23street-address%3E+%3Faddress+.%0D%0A++++%3Fvcard+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23org%3E+%3Forg+.%0D%0A++++++%3Forg+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23organisation-unit%3E+%3Ftype+.%0D%0A++++%3C'+encodeURIComponent(value)+'%3E+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Specific%3E+%3Fspecific+.%0D%0A++++%3Fspecific+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Plan%3E+%3Fplan+.%0D%0A++++++%3Fplan+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23detail%3E+%3Fsummary+.%0D%0A%7D&output=json',
	    dataType: 'json',
            success: function(allData) {
		    data = JSON.stringify(allData.results.bindings);
		    //console.log("Alldata es: " + data);
                    self.companyDetails(ko.mapping.fromJSON(data));
	    },
            error: function (xhr, status) {  
                  alert('Error loading offer ' + status);
            },
	    data: {},
	    async: false
	    });

   $.ajax({
	    type: 'GET',
	    url: 'http://shannon.gsi.dit.upm.es/episteme/lmf/sparql/select?query=SELECT+%3Fskillname+%3Fskilllevel+WHERE+%7B%0D%0A+%3C'+encodeURIComponent(value)+'%3E+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Specific%3E+%3Fspecific+.%0D%0A++++%3Fspecific+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Skill%3E+%3Fnodoskill+.%0D%0A+++++++%3Fnodoskill+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23Bag%3E+%3Fnodobag+.%0D%0A+++++++++%3Fnodobag+%3Fp+%3Fskillcontent+.%0D%0A++%09%09%09%3Fskillcontent+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23name%3E+%3Fskillname+.%0D%0A++++++++++++%3Fskillcontent+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23level%3E+%3Fskilllevel%0D%0A%7D&output=json',
	    dataType: 'json',
            success: function(allData) {
		    data = JSON.stringify(allData.results.bindings);
		    //console.log("Alldata es: " + data);
                    self.companyDetailsSkills(ko.mapping.fromJSON(data));
	    },
            error: function (xhr, status) {  
                  alert('Error loading offer ' + status);
            },
	    data: {},
	    async: false
	    });
}

if(type == "help"){
  self.helpText(true);
}

   self.help(!self.help());
   if(self.help()){
     $("#blackDIV").hide().fadeIn();
   }
};

self.deleteOffer = function(item, event) {  

   deleteOfferModal(function(result) {
	if(result){
	  $(event.target).parent().hide(400, function () {
		  $(this).remove();
		  var offerName = $(event.target).parent().find(".draggableText").text();
		  self.viewOffers.remove(function(item) { return item.name.value() ==  offerName})
		  self.reload();
		  deleteOfferLMF(offerName);
	  });
	}else{
		
	}
   });
};

self.activateLoading = function() {  
   self.loading(true);
};

 //var endPoint = "http://localhost:8080/LMF/";
 var endPoint='http://shannon.gsi.dit.upm.es/episteme/lmf/';

 function deleteOfferLMF(offerName){

	var queryText = "DELETE WHERE { GRAPH <http://" + offerName + "> { ?s ?p ?o } }";

 	$.ajax({
 	 type: 'GET',
 	 url: endPoint+'sparql/update',
	 data: { query: queryText },
 	 success: function(){
 	 	console.log("Oferta eliminada");
 	 },
	 error: function(){
	 	console.log("No se ha podido eliminar");
	 }

 	});
 }

}




	// Activates knockout.js
	ko.applyBindings(new AppViewModel());
});
