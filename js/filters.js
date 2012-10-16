function createTooltips2 ()
{

	$(function() {
            $( "#tabs" ).tabs();
        });
 
	$(function() {
	    $( "#dialog" ).dialog({
                resizable: true,
	        autoOpen: false,
                height: 300,
          	width: 500,
	    });
	});

	$( ".category" )
            .click(function() {
                $( "#dialog" ).dialog( "open" );
            });

};


$(document).ready(createTooltips2);
