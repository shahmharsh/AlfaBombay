/*
	Shah, Harsh    Account:  jadrn025
        CS645, Spring 2014
        Project #1
*/

$(document).ready( function() {
 
    $('#new_processing_gif').hide();
    $('#new_sku_button').attr('disabled','disabled');
    
    $('#new_sku').on('keyup', function() {
       var currentVal = $('#new_sku').val().toUpperCase();
       $('#new_sku').val(currentVal);
       if(currentVal.length == 3)
           $('#new_sku').val(currentVal+"-");       
    });  
       
   
    $('#new_sku').on('blur', function() { 
        var inputValue =  $.trim( $('#new_sku').val() );  
        if( inputValue == "") return; // if no input do nothing
        
        if(new_validate_sku(inputValue)) 
	{
            $('#new_processing_gif').show();     
            var url = "/perl/jadrn025/CGI/check_dup_sku.cgi?sku=" + inputValue;
            $.get(url, new_check_sku_for_dups);
        }
        else
	{
            new_write_error("The SKU format appears to be invalid");
	    $('[name=new_item] [name=sku]').addClass('error');
	}
    });    
	

    $('#new_sku').on('focus', function() {
	$('#new_sku').removeClass('error');
        new_clear_error();
	$('#new_sku_button').attr('disabled','disabled');
    });
	

    $('#new_sku_button').on('click', function(e) {
        e.preventDefault();
	if(validate_new_form())
	{
	    $('#new_processing_gif').show();
	    processNewUpload();
	}
    });
	
    $('[name=new_item] [type="reset"]').click(function(e) {
  	$("#new_pic").html('');
	new_clear_error();
    });
    
    $('[name=new_item] [name=vendor],[name=new_item] [name=category],[name=new_item] [name=man_sku],[name=new_item] [name=desc],[name=new_item] [name=features],[name=new_item] [name=cost],[name=new_item] [name=retail]').on('focus', function() {
	$('[name=new_item] [name=vendor],[name=new_item] [name=category],[name=new_item] [name=man_sku],[name=new_item] [name=desc],[name=new_item] [name=features],[name=new_item] [name=cost],[name=new_item] [name=retail]').removeClass('error');
    });
    
});

function validate_new_form() {
    
    if ($('#new_sku').val() == "") {
	new_write_error("Please enter SKU.");
	$('#new_sku').addClass('error');
	return false;
    }

    if ($('[name=new_item] [name=vendor]').val() == "-1")
    {
	new_write_error("Please select vendor.");
	$('[name=new_item] [name=vendor]').addClass('error');
	return false;
    }
    
    if ($('[name=new_item] [name=category]').val() == "-1")
    {
	new_write_error("Please select category.");
	$('[name=new_item] [name=category]').addClass('error');
	return false;
    }
    
    if ($('[name=new_item] [name=man_sku]').val() == "")
    {
	new_write_error("Please enter vendor's ID.");
	$('[name=new_item] [name=man_sku]').addClass('error');
	return false;
    }
    
    if ($('[name=new_item] [name=desc]').val() == "")
    {
	new_write_error("Please enter description.");
	$('[name=new_item] [name=desc]').addClass('error');
	return false;
    }
    
    if ($('[name=new_item] [name=features]').val() == "")
    {
	new_write_error("Please enter features.");
	$('[name=new_item] [name=features]').addClass('error');
	return false;
    }
    
    if ($('[name=new_item] [name=cost]').val() == "")
    {
	new_write_error("Please enter cost.");
	$('[name=new_item] [name=cost]').addClass('error');
	return false;
    }
    
    if ($('[name=new_item] [name=retail]').val() == "")
    {
	new_write_error("Please enter retail cost.");
	$('[name=new_item] [name=retail]').addClass('error');
	return false;
    }
    
    if (!($('[name=new_item] [name=image]').val()))
    {
	new_write_error("Please select image.");
	$('[name=new_item] [name=image]').addClass('error');
	return false;
    }
    
    return true;
}

function new_check_sku_for_dups(response) {
    $('#new_processing_gif').hide();
    if (response.indexOf("not-auth") > -1)
        window.location.href = "http://jadran.sdsu.edu/~jadrn025/proj1/error.html";
    else if(response == "ok") 
    {
        new_clear_error();
	$('#new_sku_button').removeAttr('disabled');
        return;
    }
    $('[name=new_item] [name=sku]').addClass('error');
    new_write_error("Sorry, the SKU is a duplicate");
}


function new_validate_sku(value) {
    value = $.trim(value);
    var pattern = /^[A-Z]{3}-[0-9]{3}$/;
    if(pattern.test(value))
        return true;
    return false;
    } 
    
function new_write_error(msg) 
{
    $('#new_message_line').html("<b>"+msg+"</b>");   
}     
    
function new_clear_error() 
{
    $('#new_message_line').html("&nbsp;");   
}  

function processNewUpload()
{
    newUploadImage();
}

function newUploadImage()
{
    var form_data = new FormData($('form')[0]);       
    form_data.append("image_data", document.getElementById("new_image").files[0]);
    $.ajax({
            url: "/perl/jadrn025/CGI/upload_image.cgi",
            type: "post",
            data: form_data,
            processData: false,
            contentType: false,
	    
            success: function(response) {
               var fname = $("#new_image").val().replace(/C:\\fakepath\\/i,'').replace(/\s+/, "") ;
               var toDisplay = '<img width="200px" src="/~jadrn025/proj1/_uploadImageDIR_/' + fname + '" />';               
               $('#new_pic').html(toDisplay);
	       sendNewFormData();
            },
		
            error: function(response) {  
               new_write_error("Server not responding, Pls try again later.");
	       $('#new_processing_gif').hide();
            }
        });
}

function sendNewFormData()
{
    var url = "/perl/jadrn025/CGI/new_item.cgi";
    //var params = $('[name=new_item]').serialize();
    var params = "sku=" + $('[name=new_item] [name=sku]').val() + "&";
    params += "vendor=" + $('[name=new_item] [name=vendor]').val() + "&";
    params += "category=" + $('[name=new_item] [name=category]').val() + "&";
    params += "man_sku=" + $('[name=new_item] [name=man_sku]').val() + "&";
    params += "desc=" + $('[name=new_item] [name=desc]').val() + "&";
    params += "features=" + $('[name=new_item] [name=features]').val() + "&";
    params += "cost=" + $('[name=new_item] [name=cost]').val() + "&";
    params += "retail=" + $('[name=new_item] [name=retail]').val() + "&";
    params += "image=" + $('[name=new_item] [name=image]').val().replace(/C:\\fakepath\\/i,'').replace(/\s+/, "") ;
    
    params = encodeURI(params);
    $.post(url,params,new_handleResponse);
}

function new_handleResponse(response) 
{
    $('#new_processing_gif').hide();
    if (response.indexOf("not-auth") > -1)
        window.location.href = "http://jadran.sdsu.edu/~jadrn025/proj1/error.html";
    else if (response == "ok")
    {
        //go to new div
	$('#vtab>div').hide();
	$('.message').html('New inventory: ' + $('#new_sku').val() + ' added');
	$('.message').show();
    }
    else
    {
        //show error message
	new_write_error(response);
    }
}

/*Reference: http://jadran.sdsu.edu/~jadrn000/ajax_send_form_post/post_ajax.js*/