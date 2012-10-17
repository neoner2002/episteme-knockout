function OnloadFunction ()
{

opportunities = 1;
companies = 1;

$(function() {
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

});

$(function() {
        $( ".company" ).droppable({
	    accept: ".draggable",
            drop: function( event, ui ) {
                dropAction( $(ui.helper), $(this) );
		console.log("company drop");
            }
        });
    });

$(function() {
        $( ".offer" ).droppable({
	    accept: ".draggable",
            drop: function( event, ui ) {
                dropOfferAction( $(ui.helper), $(this) );
		console.log("offer drop");
            }
        });
    });

function dropAction( $drag, $drop ) {
	$drop.css( 'background' , 'white'  );
        $drop.css( 'box-shadow' , ' 0 0 0px #555'  );
	$drop.html( $drag.html() );
        if(self.status() > 0){
	if(companies > 1){
	    self.status(2);
	    sammyPlugin.trigger('redirectEvent', {url_data: '#/finalize'});
	}
	else{
	    companies++;
	}
        }
}

function dropOfferAction( $drag, $drop ) {
	$drop.css( 'background' , 'white'  );
        $drop.css( 'box-shadow' , ' 0 0 0px #5c5'  );
	$drop.html( $drag.html() );
        if(self.page() == 0){
	    self.status(1);
	    sammyPlugin.trigger('redirectEvent', {url_data: '#/composer'});
        }
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

};

$(document).ready(OnloadFunction);
