function createTooltips ()
{


$('.draggable').each(function(){



  $(this).qtip(
  {
    content: $(this).attr('name'),
    position: {
      corner: {
        target: 'topMiddle',
         tooltip: 'bottomMiddle'
      }
    },
    style: { 
      margin: 2,
      padding: 5,
      background: '#ECF2E1',
      color: 'black',
      textAlign: 'center',
      border: {
         width: 1,
         radius: 0,
         color: '#79A04B'
      },
      tip: true,
    }
  });


});

};





$(document).ready(createTooltips);
