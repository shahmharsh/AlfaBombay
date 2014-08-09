/*
	Shah, Harsh    Account:  jadrn025
        CS645, Spring 2014
        Project #1
*/


$(document).ready( function() {
 
  //Make AJAX call get list of vendors
  $.get("/perl/jadrn025/CGI/get_category_vendors.cgi", populate);
  
  $("[name=cost]").keydown(function (e) {
        validate_cost(e);
    });
    
  $("[name=retail]").keydown(function (e) {
        validate_cost(e);
    });
  
});

function validate_cost(e)
{
	// Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)  || e.keyCode == 190) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
}

$(function() {
    var $items = $('#vtab>ul>li');
    
    $items.click(function() {
        $items.removeClass('selected');
        $(this).addClass('selected');

        var index = $items.index($(this));
        $('#vtab>div').hide();
	$('#vtab>div').eq(index).show();
	
	if(index==0)
	{
	  $('#new_sku').focus();
	  clear_tab("new_item");
	  $("#new_pic").html('');	 
	}
	else if(index==1)
	{
	  $('#edit_sku').focus();
	  clear_tab("edit_item");
	  $("#edit_pic").html('');
	}
	else
	{
	  $('#delete_sku').focus();
	  clear_tab("delete_item");
	  $("#delete_pic").html('');
	}
		
    }).eq(0).click();
});


function clear_tab(sentForm)
{
    $('[name="' + sentForm + '"]')[0].reset();
}

 
function populate(response) 
{
    var json_data = eval("("+response+")"); 
    var categoryDropdown='<option value="-1" disabled selected>Select Category</option>\n';
    for(i=0; i<json_data.category.length; i++) 
    {
     	categoryDropdown += "<option value='" + json_data.category[i].name + "'>"+ json_data.category[i].name +"</option>\n";
    }
	
    $('[name="category"]').append(categoryDropdown);
    
    var vedorsDropdown='<option value="-1" disabled selected>Select Vendor</option>\n';
    for(i=0; i<json_data.vendors.length; i++) 
    {
     	vedorsDropdown += "<option value='" + json_data.vendors[i].name + "'>"+ json_data.vendors[i].name +"</option>\n";
    }
	
    $('[name="vendor"]').append(vedorsDropdown);
    
}

/*Reference: http://jadran.sdsu.edu/~jadrn000/ajax_send_form_post/post_ajax.js*/
