saveDefault = true;
opportunities = 1;
companies = 0;

function OnloadFunction (){

$(function() {
  if(saveDefault){
    droppableOfferHTML = $( ".droppableOffer" ).html();
    droppableCompanyHTML = $( ".droppableCompany" ).html();
  }
  saveDefault = false;
});


$( ".draggable" ).draggable({
    revert: "invalid",
    helper: "clone",
    start: function( event, ui ) {
      startAction( $(ui.helper), $(this));
    },
    stop: function( event, ui ) {
      stopAction( $(ui.helper), $(this));
    }
});



$( ".droppableCompany" ).droppable({
     accept: ".draggable",
     drop: function( event, ui ) {
       dropAction( $(ui.helper), $(this) );
       console.log("company drop");
    }
});

$('.droppableCompany').unbind('click');
$('.droppableCompany').click(function(e){
    $(this).toggleClass('selected');
});

$( ".droppableOffer" ).droppable({
    accept: ".offer",
    drop: function( event, ui ) {
      dropOfferAction( $(ui.helper), $(this) );
      companies = 0;
      stopCompanyAction( $( ".draggableCompany" ) );
      console.log("offer drop");
    }
});


 $( ".draggableOffer" ).draggable({
    helper: "clone",
    start: function( event, ui ) {
      startAction( $(ui.helper), $(this));
    },
    stop: function( event, ui ) {
      stopOfferAction( $(ui.helper), $(this));
    }
});


function stopOfferAction( $helper, $original ) {
	$original.removeClass("draggableOffer");
	$original.draggable( "destroy" );
	$original.html( droppableOfferHTML );
	$original.css( 'opacity' , ' 1'  );
	$original.attr('title' , '');
	self.status(0);
	self.reload();
	companies = 0;
	sammyPlugin.trigger('redirectEvent', {url_data: '#/main'});
}


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


function stopCompanyAction( $original ) {
	$original.removeClass("draggableCompany");
	$original.draggable( "destroy" );
	$original.html( droppableCompanyHTML );
	$original.css( 'opacity' , ' 1'  );
	$original.attr('title' , '');
	if(companies < 2){
	    self.status(1);
	}
	self.reload();
}

function dropAction( $drag, $drop ) {
	$drop.html( $drag.html() );
	$drop.attr('title' , $drag.find('.draggableText').text());
	$drop.addClass('draggableCompany');
        if(self.status() > 0){
	if(companies < 2){
          companies++;
	}
	if(companies >= 2){
	    self.status(2);
	    //sammyPlugin.trigger('redirectEvent', {url_data: '#/finalize'});
	}
	self.reload();
        }
}

function dropOfferAction( $drag, $drop ) {
	$drop.attr('title' , $drag.find('.draggableText').text());
	$drop.addClass('draggableOffer');
	$drop.html( $drag.html() );
        if(self.page() == 0){
	    self.status(1);
	    self.loading(true);
	    self.loadData();
	    self.viewData.sortByPropertyAsc('name', 'value');
	    sammyPlugin.trigger('redirectEvent', {url_data: '#/composer'});
        }
	self.reload();
}

function startAction( $helper, $original ) {
	$helper.css( 'box-shadow' , ' 0 0 40px #999'  );
	$helper.css( 'z-index' , '999'  );
	$helper.addClass( "dragged" );
	$original.css( 'opacity' , ' 0.5'  );
}

function stopAction( $helper, $original ) {
	$helper.css( 'box-shadow' , ' 0 0 40px #999'  );
	$helper.css( 'z-index' , '999'  );
	$helper.addClass( "dragged" );
	$original.css( 'opacity' , ' 1'  );
}

function resetDroppable() {
	
}

};$(document).ready(OnloadFunction);
