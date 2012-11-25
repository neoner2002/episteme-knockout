/**
 * This script has been custom develop for episteme's project.
 * Developed by Gsi
 */
function nospaces(t){
if(t.value.match(/\s/g)){
//alert('Sorry, you are not allowed to enter any spaces');
//t.value=t.value.replace(/\s/g,'');
}
}

$(document).ready(function() {
		
	var current_offer_line=0;
	var endPoint='http://shannon.gsi.dit.upm.es/episteme/lmf/';
		//var endPoint='http://localhost:8080/LMF/';
	level=['Intermediate','Expert','Advanced'];

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}



OfferViewModel = function(lang) {
		self = this;

		self.lang = ko.observable(languages[lang]);

		self.offerName = ko.observable(""),
		self.offerLogo = ko.observable(""),
		self.description = ko.observable(""),
		self.contractor = ko.observable(""),
		self.budget = ko.observable(""),
		self.address = ko.observable(""),
		self.beginDate = ko.observable(""),
		self.endDate = ko.observable(""),
		self.currentCompany = ko.observable(1),
		self.companyGapArray = ko.observableArray(),
		self.skillsArray = ko.observableArray(),
		self.selectedChoice = ko.observable()

		self.availableLogos = ko.observableArray([
		  "episteme","Globalmetanoia","GSI","sphere","bird","circle","coffee",
		  "ipod","map","next","twitter","windows","youtube"
		])

		self.help = ko.observable(false);


		self.changeLanguage = function(place) {  
      		  self.lang(languages[place]);
                  setButtons();
		};

                self.activateHelp = function() {  
  		  self.help(!self.help());
		};

	};
	init();

	/* Función de inicialización */
	function init(){
		lang = 0;
		if(getURLParameter('lang') == 'English'){
			lang = 1;
		}
		ko.applyBindings(new OfferViewModel(lang));
		setButtons();
		loadSkills();
		$('#wizard').smartWizard({onLeaveStep:leaveAStepCallback, onFinish:onFinishCallback});

		$( "#datepickerI" ).datepicker();
		$( "#datepickerF" ).datepicker();
		$( "#datepickerI" ).datepicker("option", "dateFormat", "dd-mm-yy");
		$( "#datepickerF" ).datepicker("option", "dateFormat", "dd-mm-yy");
		rateIt('\'#act0\'');
                setButtons();
	}

        function setButtons(){
	  $(".buttonNext").text(self.lang().f1);
	  $(".buttonPrevious").text(self.lang().f2);
	  $(".buttonFinish").text(self.lang().f3);
	}

	function leaveAStepCallback(obj){
          var step_num = obj.attr('rel'); // get the current step number
          var isValid = true;
          msg = "error";
          if(step_num == 1) isValid = validateStep1();
	  if(step_num == 2) isValid = validateStep2();
	  if(step_num == 3) isValid = validateStep3();
          if(!isValid)errorModal(msg);
          return isValid;
        }
 
        function validateStep1(){
          if(self.offerName() == ''){
            msg = self.lang().b5+self.lang().b2;
	    return false;
	  }
	  if(self.offerName().match(/\s/g)){
            msg = self.lang().k1;
	    return false;
	  }
	  if(self.description() == ''){
            msg = self.lang().b5+self.lang().b4;
	    return false;
	  }
	  return true;
        }

	function validateStep2(){
	  if(self.contractor() == ''){
            msg = self.lang().b5+self.lang().c2;
	    return false;
	  }
	  if(self.budget() == ''){
            msg = self.lang().b5+self.lang().c3;
	    return false;
	  }
	  if(self.budget().search(/^\s*\d+\s*$/)){
            msg = self.lang().k2;
	    return false;
	  }
	  if(self.address() == ''){
            msg = self.lang().b5+self.lang().c4;
	    return false;
	  }
	  if(self.beginDate() == ''){
            msg = self.lang().c7;
	    return false;
	  }
	  if(self.endDate() == ''){
            msg = self.lang().c7;
	    return false;
	  }
	  return true;
        }
		
	function validateStep3(){
	  if(self.companyGapArray().length == 0){
            msg = self.lang().k3;
	    return false;
	  }
	  return true;
        }


	/* Función que activa los campos de autocomplete */
	function loadActivities(selector){
		$(eval(selector)).empty();
		$( eval(selector) ).autocomplete({
			source: self.skillsArray()
		});
	}

	/* Función que carga del endpoint la lista de skills */
	function loadSkills(){
		var query=endPoint+'sparql/select?query=SELECT+DISTINCT+%3Fskillname+WHERE+%7B%0D%0A++%3Fs+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Specific%3E+%3Fspecific+.%0D%0A++++%3Fspecific+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23Skill%3E+%3Fnodoskill+.%0D%0A+++++++%3Fnodoskill+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23Bag%3E+%3Fnodobag+.%0D%0A+++++++++%3Fnodobag+%3Fp+%3Fskillcontent+.%0D%0A++%09%09%09%3Fskillcontent+%3Chttp%3A%2F%2Fkmm.lboro.ac.uk%2Fecos%2F1.0%23name%3E+%3Fskillname+%0D%0A%7D&output=json';
		$.getJSON(query,function(data){

			$.each(data.results.bindings,function(key,val){
				var skill=val.skillname.value;
				console.log(skill);
				self.skillsArray.push(skill);
			});
			loadActivities('\'#act0 .activity\'');
			$('#autocomplete' ).autocomplete({
				source: self.skillsArray()
			});

		});

	}

	/* Binding para el botón de nuevo requisito */
	$('#new_offer_entry').bind('click', function() {
		newOfferLine();
	});

	/* Función que genera nueva linea de requisito */
	/*jshint multistr:true */
	function make_new_activityline() {
		var newLine='<tr class="companyGap" style="display:none" id="act'+current_offer_line+'"> \
		<th> \
		' + self.lang().d5 +' '+(current_offer_line+1)+ '\
		</th> <td > \
		<input class="activity"> \
		</td><td> \
		<select class="rating">\
		<option value="0">'+ self.lang().d6 +'</option>\
		<option value="1" selected="selected">'+ self.lang().d7 +'</option>\
		<option value="2">'+ self.lang().d8 +'</option>\
		</select>\
		<span class="ratingText"></span>\
		<div class="remove-line">x</div> \
		</td> \
		</tr>';
		return newLine;
	}

	/* Binding para el botón de fin de compañia */
	$('#done-button').unbind('click');
	$('#done-button').bind('click', function() {
		fillCompanyGap();
		$('#tableCompanies').fadeOut('slow',function(){
			$('#tableCompaniesCompleted').fadeIn('slow',function(){
				$('#done-button').fadeOut('slow',function(){
					$('#new-company-entry').fadeIn('slow',function(){});
				});
			});
		});
	});

	/* Binding para el botón de nueva compañia */
	$('#new-company-entry').bind('click',function(){
		nextCompanyGap();
		$('#tableCompaniesCompleted').fadeOut('slow',function(){
			$('#tableCompanies').fadeIn('slow',function(){
				$('#new-company-entry').fadeOut('slow',function(){
					$('#done-button').fadeIn('slow',function(){});
				});
			});
		});
	});

	/* Guarda en la viewModel un companyGap */
	function fillCompanyGap(){
		var companyGap=ko.observableArray();
		$('.companyGap').each(function(){
			var requirement=new Requirement();
			var children = $(this).children("td");

			$(children[0]).find('.activity').each(function(){
				console.log("Habilidad"+$(this).val());
				requirement.field=$(this).val();
			});
			$(children[1]).find('.ratingText').each(function(){
				requirement.weight=$(this).html();
				console.log("Peso"+$(this).html());
			});
			companyGap.push(requirement);
		});
		self.companyGapArray.push(companyGap);
	}

	/* Modifica la interfaz y la prepara para un nuevo companyGap */
	function nextCompanyGap(){
		var i=self.currentCompany()+1;
		self.currentCompany(i);
		current_offer_line=-1;
		$('.companyGap').remove();
		newOfferLine();
	}

	/* Activa el plugin de rating en un determinado elemento, selector */
	function rateIt(selector){
		var selectorRating=selector.split('\'')[1];
		var selectorRatingText='\''+selectorRating+' .ratingText'+'\'';
		selectorRating='\''+selectorRating+' .rating'+'\'';

		$(eval(selectorRating)).rating({
			showCancel:false
		});
		$(eval(selectorRating)).bind("change",function(){
			$(eval(selectorRatingText)).text(level[$(eval(selectorRating)).val()]);
		});

		$(eval(selectorRating)).val(1).change();
	}

	/* Modelo de cada requisito, formarán parte de un companyGap */
	function Requirement(field,weight){
		var self=this;

		self.field=field;
		self.weight=weight;
	}
		
	/* Añade una linea, creada con la función make_new_activity_line */
	function newOfferLine(){
		current_offer_line = current_offer_line + 1;
		var new_line = (make_new_activityline());

		var selector='\'#act'+(current_offer_line-1)+'\'';
		var selectorSlider='\'#act'+(current_offer_line)+'  \'';
		if(current_offer_line===0){
			$('#tableCompanies tbody').append(new_line);
		}else{
			$(eval(selector)).after(new_line);
		}
		$(eval(selectorSlider)).fadeIn('slow',function(){});
		rateIt(selectorSlider);

		loadActivities('\'#act'+current_offer_line+' .activity\'');
		$('.remove-line').unbind();
		$('.remove-line').bind('click', function(){
			$(this).parent().remove();

			current_offer_line = current_offer_line - 1;
		});
	}

	/* Función llamada al hacer click en finish */
	function onFinishCallback(){

		createOfferModal(function(result) {
		  if(result){
		    var serialized= serializer();
		    uploader(serialized);
		    console.log(serialized);
		  }else{
		    
	 	  }
		});
			//window.location.replace("./");
	}
	
	/* Extrae los datos del viewModel y devuelve el rdf */
	function serializer(){
		var serialized='<?xml version="1.0" encoding="utf-8"?> \
		<rdf:RDF \
		xmlns:gsi="http://www.gsi.dit.upm.es/" \
		xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" \
		xmlns:ecos="http://kmm.lboro.ac.uk/ecos/1.0#"> \
		<rdf:Description rdf:about="' ;
		serialized = serialized + self.offerName().replace(/ +?/g,'');
		serialized = serialized + '">'+ '<gsi:id>'+ Math.floor(Math.random()*10000)+'</gsi:id>';
		serialized = serialized + '<gsi:logo>'+ '/images/offers/' + self.offerLogo() + '.png' +'</gsi:logo>';
		serialized = serialized + '<ecos:name>';
		serialized = serialized + self.offerName();
		serialized = serialized + '</ecos:name>' + '<ecos:detail>';
		serialized = serialized + self.description();
		serialized = serialized + '</ecos:detail>' + '<gsi:contractor>';
		serialized = serialized + self.contractor();
		serialized = serialized + '</gsi:contractor>' + '<gsi:budget>';
		serialized = serialized + self.budget();
		serialized = serialized + '</gsi:budget>' + '<ecos:Address>';
		serialized = serialized + self.address();
		serialized = serialized + '</ecos:Address>' + '<gsi:beginDate>';
		serialized = serialized + self.beginDate();
		serialized = serialized + '</gsi:beginDate>' + '<gsi:endDate>';
		serialized = serialized + self.endDate();
		serialized = serialized + '</gsi:endDate>' ;

		ko.utils.arrayForEach(self.companyGapArray(), function(item){
			serialized = serialized + '<gsi:companyReq rdf:parseType="Resource">';
			ko.utils.arrayForEach(item(), function(req){
				serialized = serialized + '<ecos:Preference rdf:parseType="Resource">';
				serialized = serialized + '<gsi:field>'+ req.field + '</gsi:field>';
				serialized = serialized + '<ecos:weight>'+ req.weight + '</ecos:weight>';
				serialized = serialized + '</ecos:Preference>';
			});
			serialized = serialized + '</gsi:companyReq>';
		});
		self.companyGapArray(self.companyGapArray());

		serialized = serialized + '</rdf:Description></rdf:RDF>';
		return serialized;
	}

	/* Sube un archivo, payload, al endpoint definido*/
	function uploader(payload){
		$.ajax({
			type: 'POST',
			url: endPoint+'import/upload?context=http://' + self.offerName().replace(/ +?/g,''),
			contentType: 'application/rdf+xml',
			data: payload,
			success: function(){
				console.log("Success");
				window.location.href = "../index.html#/main";
			}

		});
	}
});









