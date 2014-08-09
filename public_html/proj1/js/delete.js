/*
	Shah, Harsh    Account:  jadrn025
        CS645, Spring 2014
        Project #1
*/


$(document).ready( function() {
 
    $('#delete_processing_gif').hide();
    $('#delete_sku_button').attr('disabled','disabled');
    
    $('#delete_sku').on('keyup', function() {
       var currentVal = $('#delete_sku').val().toUpperCase();
       $('#delete_sku').val(currentVal);
       if(currentVal.length == 3)
           $('#delete_sku').val(currentVal+"-");       
    });  
       
   
    $('#delete_sku').on('blur', function() { 
        var inputValue =  $.trim( $('#delete_sku').val() );  
        if( inputValue == "") return; // if no input do nothing
        
        if(delete_validate_sku(inputValue)) {
            $('#delete_processing_gif').show();  
            var url = "/perl/jadrn025/CGI/get_sku_data.cgi?sku=" + inputValue;
            $.get(url, delete_get_sku_data);
            }
        else
	{
            delete_write_error("The SKU format appears to be invalid");
	    $('[name=delete_item] [name=sku]').addClass('error');
	}
    });  
	

    $('#delete_sku').on('focus', function() {
	$('#edit_sku').removeClass('error');
        delete_clear_error();
	$('[name="delete_item"]')[0].reset();
	$("#delete_pic").html('');
	$('#delete_sku_button').attr('disabled','disabled');
    });
	

    $('#delete_sku_button').on('click', function(e) {
        e.preventDefault();
	if (confirm("Are you sure you want to delete item " + $('#delete_sku').val() + "? (this action cannot be undone)"))
	{
	    $('#delete_processing_gif').show();
	    processDelete();
	}
	
    });
    
    $('[name=delete_item] [type="reset"]').click(function(e) {
  	$("#delete_pic").html('');
	delete_clear_error();
    });
    
    $('[name=delete_item] [name=vendor],[name=delete_item] [name=category],[name=delete_item] [name=man_sku],[name=delete_item] [name=desc],[name=delete_item] [name=features],[name=delete_item] [name=cost],[name=delete_item] [name=retail]').prop('disabled', true);
 });

function delete_get_sku_data(response) {
    $('#delete_processing_gif').hide();
    if (response.indexOf("not-auth") > -1)
        window.location.href = "http://jadran.sdsu.edu/~jadrn025/proj1/error.html";
    else if(response == "not_found") 
    {
        delete_write_error("Sorry, the SKU does not exists");
	$('[name=delete_item] [name=delete]').addClass('error');
    }
    else
    {
        delete_clear_error();
	$('#delete_sku_button').removeAttr('disabled');
	delete_fill_form(response);
    }    
}

function delete_fill_form(json_obj)
{
json_obj = eval("("+json_obj+")");
    
    $('[name=delete_item] [name=vendor]').val(json_obj.product_detail[0].vendor);
    $('[name=delete_item] [name=category]').val(json_obj.product_detail[0].category);
    $('[name=delete_item] [name=man_sku]').val(json_obj.product_detail[0].manufacturerID);
    $('[name=delete_item] [name=desc]').val(json_obj.product_detail[0].description.replace(/``/g, "\n").replace(/~/g,"\""));
    $('[name=delete_item] [name=features]').val(json_obj.product_detail[0].features.replace(/``/g, "\n").replace(/~/g,"\""));
    $('[name=delete_item] [name=cost]').val(json_obj.product_detail[0].cost);
    $('[name=delete_item] [name=retail]').val(json_obj.product_detail[0].retail);
    
    var fname = json_obj.product_detail[0].image_name;
    var toDisplay = '<img width="200px" src="/~jadrn025/proj1/_uploadImageDIR_/' + fname + '" />';               
    $('#delete_pic').html(toDisplay);
}

function delete_validate_sku(value) {
    value = $.trim(value);
    var pattern = /^[A-Z]{3}-[0-9]{3}$/;
    if(pattern.test(value))
        return true;
    return false;
    } 
    
function delete_write_error(msg) 
{
    $('#delete_message_line').html("<b>"+msg+"</b>");   
}     
    
function delete_clear_error() 
{
    $('#delete_message_line').html("&nbsp;");   
}  

function processDelete()
{
    //deleteImage();
    sendDeleteFormData();
}

function sendDeleteFormData()
{
    var url = "/perl/jadrn025/CGI/delete_item.cgi";
    var params = "sku=" + $('#delete_sku').val();
    $.post(url,params,delete_handleResponse);
}

function delete_handleResponse(response) 
{
    $('#delete_processing_gif').hide();
    if (response.indexOf("not-auth") > -1 )
        window.location.href = "http://jadran.sdsu.edu/~jadrn025/proj1/error.html";
    else if (response == "ok")
    {
        //go to new div
	$('#vtab>div').hide();
	$('.message').html('Item deleted: ' + $('#delete_sku').val());
	$('.message').show();
    }
    else
    {
        //show error message
	delete_write_error(response);
    }
     
}

/* Reference: http://jadran.sdsu.edu/~jadrn000/ajax_send_form_post/post_ajax.js */