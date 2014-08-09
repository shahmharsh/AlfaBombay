
$(document).ready( function() {
 
 clear_everything();

//in functions     
    $('#inventory_in').on('keyup', function() {
       var currentVal = $('#inventory_in').val().toUpperCase();
       $('#inventory_in').val(currentVal);
       if(currentVal.length == 3)
	    $('#inventory_in').val(currentVal+"-");       
    });
 
    $('#inventory_in').on('blur', function() { 
        var inputValue =  $.trim( $('#inventory_in').val() );  
        if( inputValue == "") return; // if no input do nothing
        
        if(validate_sku(inputValue)) 
	{
            $('#in_processing_gif').show();     
            var url = "/jadrn025/servlet/EntryPoint?action=check_dup&sku=" + inputValue;
            $.get(url, in_check_sku_for_dups);
        }
        else
	{
            write_error("The SKU format appears to be invalid");
	    $('#inventory_in').addClass('error');
	}
    });    
 
    $('#inventory_in').on('focus', function() {
	$('#inventory_in').removeClass('error');
        clear_everything();
	$('#inventory_in_button').attr('disabled','disabled');
    });
  
    $('#inventory_in_button').on('click', function(e) {
        e.preventDefault();
	var qty = $("[name=qty_in]").val();
	if (qty!="")
	{
	   $('#in_processing_gif').show();
	    var sku =  $.trim( $('#inventory_in').val());  
	    var url = "/jadrn025/servlet/EntryPoint?action=in&sku=" + sku + "&qty=" + qty;
            $.post(url, in_transaction_response);  
	}
	else
	{
	    write_error("Quantity cannot be empty");
	    $('[name=qty_in]').addClass('error');
	}
    });
  
//out functions
    $('#inventory_out').on('keyup', function() {
       var currentVal = $('#inventory_out').val().toUpperCase();
       $('#inventory_out').val(currentVal);
       if(currentVal.length == 3)
	    $('#inventory_out').val(currentVal+"-");       
    });
  
    $('#inventory_out').on('blur', function() { 
        var inputValue =  $.trim( $('#inventory_out').val() );  
        if( inputValue == "") return; // if no input do nothing
        
        if(validate_sku(inputValue)) 
	{
            $('#out_processing_gif').show();     
            var url = "/jadrn025/servlet/EntryPoint?action=check_dup&sku=" + inputValue;
            $.get(url, out_check_sku_for_dups);
        }
        else
	{
            write_error("The SKU format appears to be invalid");
	    $('#inventory_out').addClass('error');
	}
    });    
 
    $('#inventory_out').on('focus', function() {
	$('#inventory_out').removeClass('error');
        clear_everything();
	$('#inventory_out_button').attr('disabled','disabled');
    });
  
    $('#inventory_out_button').on('click', function(e) {
        e.preventDefault();
	var qty = $("[name=qty_out]").val();
	if (qty!="")
	{
	    $('#out_processing_gif').show();
	    var sku =  $.trim( $('#inventory_out').val());  
	    var url = "/jadrn025/servlet/EntryPoint?action=out&sku=" + sku + "&qty=" + qty;
            $.post(url, out_transaction_response);  
	}
	else
	{
	    write_error("Quantity cannot be empty");
	    $('[name=qty_out]').addClass('error');
	}
    });
   
//common
    $('[type=reset]').click(function(e) {
	e.preventDefault();
	clear_everything();
    });
 
    $("[name=qty_out], [name=qty_in]").keydown(function (e) {
        validate_qty(e);
    });
    
    $("[name=qty_out], [name=qty_in]").on('focus', function() {
	clear_error();
	$('[name=qty_in]').removeClass('error');
	$('[name=qty_out]').removeClass('error');
    });
 
    $("[name=vendor], [name=man_sku], [name=category], [name=desc], [name=cost], [name=features]").attr('disabled','disabled');

    $(".logout_button").on('click', function(){
	var url = "/jadrn025/servlet/EntryPoint?action=logout";
        $.post(url, in_transaction_response);
    });
});


function clear_everything()
{
  $('#in_processing_gif').hide();
  $('#out_processing_gif').hide();
  $('#inventory_in_button').attr('disabled','disabled');
  $('#inventory_out_button').attr('disabled','disabled');
  $('#inventory_in').val("");
  $('#inventory_out').val("");
  $('[name=vendor], [name=man_sku], [name=category], [name=desc], [name=cost], [name=features]').val("");
  $('#inventory_in').removeClass('error');
  $('#inventory_out').removeClass('error');
  $('[name=qty_in]').removeClass('error');
  $('[name=qty_out]').removeClass('error');
  $('[name=qty_in]').val("");
  $('[name=qty_out]').val("");
  $('[name=pic]').html("&nbsp;");
  clear_error();
}

function clear_error()
{
    $('.error-message').html("&nbsp;");   
}

function write_error(msg)
{
    $('.error-message').html("<b>" + msg + "<b>");   
}

function in_transaction_response(response)
{
    $('#in_processing_gif').hide();   
    if (response == "Success")
    {
	$('#vtab>div').hide();
	$('.message').html('Inward Transaction Recorded <br> SKU: ' + $('#inventory_in').val()  + ' Quantity: ' +  $("[name=qty_in]").val());
	$('.message').show();
    }
    else if (response == "Error")
    {
	write_error("Cannot record transaction, pls try again later.");
    }
    else if (response == "ErrorPage")
    {
	window.location.href = "/jadrn025/error.html";
    }
    else if (response == "LogoutPage")
    {
	window.location.href = "/jadrn025/logout.html";
    }
}

function out_transaction_response(response)
{
    $('#out_processing_gif').hide();   
    if (response == "Success")
    {
	$('#vtab>div').hide();
	$('.message').html('Outward Transaction Recorded <br> SKU: ' + $('#inventory_out').val()  + ' Quantity: ' +  $("[name=qty_out]").val());
	$('.message').show();
    }
    else if (response == "not-enough")
    {
	write_error("Not enough quantity on hand to complete this transaction.");
	$('[name=qty_out]').addClass('error');
    }
    else if (response == "no-stock") {
	write_error("This stock is currently not available.");
    }
    else if (response == "Error")
    {
	write_error("Cannot record transaction, pls try again later.");
    }
    else if (response == "ErrorPage")
    {
	window.location.href = "/jadrn025/error.html";
    }
}

function in_check_sku_for_dups(response)
{
     $('#in_processing_gif').hide();
    if(response == "invalid") 
    {
	$('#inventory_in').addClass('error');
	write_error("Sorry, the SKU does not exists");   
        return;
    }
    else if(response == "ErrorPage")
    {
	window.location.href = "/jadrn025/error.html";
    }
    else
    {
	clear_error();
	$('#inventory_in_button').removeAttr('disabled');
	fill_form(response);
    }
}

function out_check_sku_for_dups(response)
{
    $('#out_processing_gif').hide();
    if(response == "invalid") 
    {
	$('#inventory_out').addClass('error');
	write_error("Sorry, the SKU does not exists");   
        return;
    }
    else if(response == "ErrorPage")
    {
	window.location.href = "/jadrn025/error.html";
    }
    else
    {
	clear_error();
        $('#inventory_out_button').removeAttr('disabled');
        fill_form(response);
    }
}

function fill_form(jsonObj)
{
    jsonObj = eval("("+jsonObj+")");
    
    $("[name=vendor]").val(jsonObj.vendor);
    $("[name=man_sku]").val(jsonObj.vendorID);
    $("[name=category]").val(jsonObj.category);
    $("[name=desc]").val(jsonObj.description.replace(/``/g, "\n").replace(/~/g,"\""));
    $("[name=features]").val(jsonObj.features.replace(/``/g, "\n").replace(/~/g,"\""));
    $("[name=cost]").val(jsonObj.cost);
    
    var fname = jsonObj.image_name;
    var toDisplay = '<img width="200px" src="/~jadrn025/proj1/_uploadImageDIR_/' + fname + '" />';               
    $('[name=pic]').html(toDisplay);

}

function validate_sku(value)
{
    value = $.trim(value);
    var pattern = /^[A-Z]{3}-[0-9]{3}$/;
    if(pattern.test(value))
        return true;
    return false;
    } 

function validate_qty(e)
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

$(function()
  {
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
	  clear_everything();
	}
	else if(index==1)
	{
	  $('#edit_sku').focus();
	  clear_everything();
	}
    }).eq(0).click();
});
