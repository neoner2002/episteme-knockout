function OnloadFunction ()
{

var droppedElements = 1;


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
        $( ".droppable" ).droppable({
            drop: function( event, ui ) {
                dropAction( $(ui.helper), $(this) );
            }
        });
    });

function dropAction( $drag, $drop ) {
	$drop.css( 'background' , '#FAFAFA'  );
        $drop.css( 'box-shadow' , ' 0 0 1px #999'  );
	$drop.html( $drag.html() );
	if(droppedElements == 3){
	    sammyPlugin.trigger('redirectEvent', {url_data: '#/composer'});
	}
	else{
	    droppedElements++;
	}
}

function startAction( $helper, $original ) {
	$helper.css( 'box-shadow' , ' 0 0 40px #666'  );
	$helper.css( 'z-index' , '999'  );
	$helper.addClass( "dragged" );
	$original.css( 'opacity' , ' 0.5'  );
}

function stopAction( $helper, $original ) {
	$helper.css( 'box-shadow' , ' 0 0 40px #666'  );
	$helper.css( 'z-index' , '999'  );
	$helper.addClass( "dragged" );
	$original.css( 'opacity' , ' 1'  );
}


$( "ul.gallery > li" ).click(function( event ) {
            var $item = $( this ),
                $target = $( event.target );
 
            if ( $target.is( "a.ui-icon-trash" ) ) {
                deleteImage( $item );
            } else if ( $target.is( "a.ui-icon-zoomin" ) ) {
                viewLargerImage( $target );
            } else if ( $target.is( "a.ui-icon-refresh" ) ) {
                recycleImage( $item );
            }
 
            return false;
        });

};

$(document).ready(OnloadFunction);
