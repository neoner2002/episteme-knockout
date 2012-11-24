function createTooltips ()
{



    $(".draggable").tooltip({
        position: {
            my: "center+10 bottom-10",
            at: "center top"
        }
    });

    $(".droppable").tooltip({
        position: {
            my: "center+10 top+10",
            at: "center bottom"
        }
    });
};
$(document).ready(createTooltips);
