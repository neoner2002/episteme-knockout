saveDefault = true;
opportunities = 1;
companies = 0;
storedOpacity = 0;

function OnloadFunction (){
//SAVE DROPPABLE DEFAULT STATE
$(function() {
  if(saveDefault){
    droppableOfferHTML = $( ".droppableOffer" ).html();
    droppableCompanyHTML = $( ".droppableCompany" ).html();
  }
  saveDefault = false;
});
//DRAGGABLE COMPANIES/OFFERS
$( ".draggableCompanies" ).draggable({
    revert: "invalid",
    helper: "clone",
    start: function( event, ui ) {
      startAction( $(ui.helper), $(this));
    },
    stop: function( event, ui ) {
      stopAction( $(ui.helper), $(this));
    }
});
$( ".clickableOffers" ).unbind('click');
$( ".clickableOffers" ).click(function(e){
    dropOfferAction( $(this) );
      companies = 0;
      stopCompanyAction( $( ".draggableCompany" ) );
      console.log("offer drop");
});
//DROPPABLE COMPANIES
$( ".droppableCompany" ).droppable({
     accept: ".draggable",
     drop: function( event, ui ) {
       dropAction( $(ui.helper), $(this) );
       console.log("company drop");
    }
});
//DROPPABLE OFFER
$( ".droppableOffer" ).droppable({
    accept: ".offer",
    drop: function( event, ui ) {
      dropOfferAction( $(ui.helper), $(this) );
      companies = 0;
      stopCompanyAction( $( ".draggableCompany" ) );
      console.log("offer drop");
    }
});
//WHEN OFFER IS DROPPED CAN BE DRAGGED
 $( ".draggableOffer" ).draggable({
    helper: "clone",
    start: function( event, ui ) {
      startAction( $(ui.helper), $(this));
    },
    stop: function( event, ui ) {
      stopOfferAction( $(ui.helper), $(this));
    }
});
//WHEN A OFFER IS DRAGGED FROM DROPPABLE
function stopOfferAction( $helper, $original ) {
	$original.removeClass("draggableOffer");
	$original.draggable( "destroy" );
	$original.html( droppableOfferHTML );
	$original.css( 'opacity' , ' 1'  );
	$original.attr('title' , '');
	self.status(0);
	self.reload();
	companies = 0;
        resetDroppables();
	sammyPlugin.trigger('redirectEvent', {url_data: '#/main'});
}
//WHEN A COMPANY IS DROPPED CAN BE DRAGGED
  $( ".draggableCompany" ).draggable({
    helper: "clone",
    start: function( event, ui ) {
      startAction( $(ui.helper), $(this));
    },
    stop: function( event, ui ) {
      companies--;
      stopCompanyAction( $(ui.helper), $(this));
    }
  });
//WHEN A COMPANY IS DRAGGED FROM DROPPABLE
function stopCompanyAction( $helper, $original ) {
	$original.removeClass("draggableCompany");
	$original.draggable( "destroy" );
        $original.droppable( "enable" );
	$original.html( droppableCompanyHTML );
	$original.css( 'opacity' , ' 1'  );
	$original.attr('title' , '');
	if(companies < numBoxes+1){
	    self.status(1);
	}
        if($original.hasClass( 'ui-droppable-disabled' )){
            $original.animate({opacity: 0.5}, 200 );
        }
	self.reload();
        if(!$original.hasClass( 'selected' ) && self.semanticOrder()){
          $original.trigger('click');
        }
}
//WHEN A COMPANY IS DROPPED
function dropAction( $drag, $drop ) {
	$drop.html( $drag.html() );
	$drop.attr('title' , $drag.find('.draggableText').text());
	$drop.addClass('draggableCompany');
	$drop.droppable( "disable" );
        if(self.status() > 0){
	if(companies < numBoxes+1){
          companies++;
	}
	if(companies >= numBoxes+1){
	    self.status(2);
	    finalizeModal(function(result) {
		  if(result){
		   sammyPlugin.trigger('redirectEvent', {url_data: '#/finalize'});
		  }else{
		    
	 	  }
		});
	}
	self.reload();
        if($drop.hasClass( 'selected' ) && self.semanticOrder()){
          var next = $drop.next('.droppableCompany');
          while(next.hasClass( 'draggableCompany' )){
            next = next.next('.droppableCompany');
          }
          next.trigger('click');
        }
        }
}
//WHEN A OFFER IS DROPPED
function dropOfferAction( $drop ) {
	//$drop.attr('title' , $drag.find('.draggableText').text());
	//$drop.addClass('draggableOffer');
        resetDroppables();
	$(".selectedOffer > .logoContainer").remove();
	$(".selectedOffer > .textContainer").remove();
	$(".selectedOffer").append( $drop.find('.logoContainer').clone() );
	$(".selectedOffer").append( $drop.find('.textContainer').clone() );
        if(self.page() == 0){
            saveDefault = true; 
            var offername = $drop.find('.draggableText').text();
	    self.status(1);
	    sammyPlugin.trigger('redirectEvent', {url_data: '#/composer/'+offername});
        }
	self.reload();
}
//WHEN A COMPANY IS DRAGGED
function startAction( $helper, $original ) {
	$helper.css( 'box-shadow' , ' 0 0 40px #999'  );
	$helper.css( 'z-index' , '999'  );
	$helper.addClass( "dragged" );
        storedOpacity = $original.css( 'opacity' );
	$original.css( 'opacity' , ' 0.5'  );
        $helper.find(".companyMedal").removeClass('gold').removeClass('silver').removeClass('bronze');
}
//WHEN A COMPANY IS RELEASED AND NOT DROPPED
function stopAction( $helper, $original ) {
	$helper.css( 'box-shadow' , ' 0 0 40px #999'  );
	$helper.css( 'z-index' , '999'  );
	$helper.addClass( "dragged" );
	$original.css( 'opacity' , storedOpacity  );
}
//WHEN A DROPPABLE COMPANY IS CLICKED
$('.droppableCompany').unbind('click');
$('.droppableCompany').click(function(e){
e.stopPropagation();
    if($(this).hasClass( 'selected' )){
      resetDroppables();
      $('.draggableCompanies').find(".companyMedal").removeClass('gold').removeClass('silver').removeClass('bronze');
      self.viewData.sortByPropertyAsc('name', 'value');
      $('.draggableCompanies').each(function(index) {
        $(this).animate({opacity: 1}, 1);
        if($(this).css('display') != 'none'){
          $(this).hide();
          $(this).fadeIn('fast');
        }
      });
    }else{
      self.viewData.sortByPropertyAsc('name', 'value');
      self.viewData.sortByPropertyDesc($(this).attr('name'), 'value');
      self.semanticOrder(true);
      $.each($('.droppableCompany'), function() {
        $(this).removeClass('selected');
        $(this).addClass('no_selected');
        $(this).droppable( "disable" );
      });
      $(this).removeClass('no_selected');
      $(this).addClass('selected');
       if(!$(this).hasClass( 'draggableCompany' )) $(this).droppable( "enable" );
      $('.draggableCompanies').find(".companyMedal").removeClass('gold').removeClass('silver').removeClass('bronze');
      $('.draggableCompanies').each(function(index) {
        var stallFor = 75 * parseInt(index);
        var value = 1/(index/5)
        $(this).animate({opacity: value}, 1);
        if(index == 0) $(this).find(".companyMedal").addClass('gold');
	if(index == 1) $(this).find(".companyMedal").addClass('silver');
	if(index == 2) $(this).find(".companyMedal").addClass('bronze');
        if($(this).css('display') != 'none'){
          $(this).hide();
          $(this).delay(stallFor).fadeIn();
          $(this).delay(stallFor).fadeIn();
        }
      });
    }
    $.each($('.no_selected'), function() {
      if($(this).hasClass( 'draggableCompany' )){
        $(this).animate({opacity: 1}, 200 );
      }else{
        $(this).animate({opacity: 0.5}, 10 );
      }
    });
    $('.selected').animate({opacity: 1}, 20 );
});


};$(document).ready(OnloadFunction);

//RESET DROPPABLE COMPANY STATE
function resetDroppables() {
    self.semanticOrder(false);
    $.each($('.droppableCompany'), function() {
      $(this).removeClass('no_selected');
      $(this).removeClass('selected');
      $(this).animate({opacity: 1}, 20 );
      if(!$(this).hasClass( 'draggableCompany' )) $(this).droppable( "enable" );
    });
}
