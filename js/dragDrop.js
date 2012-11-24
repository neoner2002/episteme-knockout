saveDefault = true;
opportunities = 1;
companies = 0;

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
      stopCompanyAction($(this));
    }
  });
//WHEN A COMPANY IS DRAGGED FROM DROPPABLE
function stopCompanyAction( $original ) {
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
        }
}
//WHEN A OFFER IS DROPPED
function dropOfferAction( $drop ) {
	//$drop.attr('title' , $drag.find('.draggableText').text());
	//$drop.addClass('draggableOffer');
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
//WHEN A COMPPANY IS DRAGGED
function startAction( $helper, $original ) {
	$helper.css( 'box-shadow' , ' 0 0 40px #999'  );
	$helper.css( 'z-index' , '999'  );
	$helper.addClass( "dragged" );
	$original.css( 'opacity' , ' 0.5'  );
}
//WHEN A COMPPANY IS RELEASED AND NOT DROPPED
function stopAction( $helper, $original ) {
	$helper.css( 'box-shadow' , ' 0 0 40px #999'  );
	$helper.css( 'z-index' , '999'  );
	$helper.addClass( "dragged" );
	$original.css( 'opacity' , ' 1'  );
}
//WHEN A DROPPABLE COMPANY IS CLICKED
$('.droppableCompany').unbind('click');
$('.droppableCompany').click(function(e){
    if($(this).hasClass( 'selected' )){
      resetDroppables();
      self.viewData.sortByPropertyAsc('name', 'value');
    }else{
      self.viewData.sortByPropertyAsc('name', 'value');
      self.viewData.sortByPropertyDesc($(this).attr('name'), 'value');
      $.each($('.droppableCompany'), function() {
        $(this).removeClass('selected');
        $(this).addClass('no_selected');
        $(this).droppable( "disable" );
      });
      $(this).removeClass('no_selected');
      $(this).addClass('selected');
      $(this).droppable( "enable" );
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
    $.each($('.droppableCompany'), function() {
      $(this).removeClass('no_selected');
      $(this).removeClass('selected');
      $(this).animate({opacity: 1}, 20 );
      $(this).droppable( "enable" );
    });
}
