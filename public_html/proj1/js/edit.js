/*
	Shah, Harsh    Account:  jadrn025
        CS645, Spring 2014
        Project #1
*/


$(document).ready( function() {
 
    $('#edit_processing_gif').hide();
    $('#edit_sku_button').attr('disabled','disabled');
    $('#edit_sku').on('keyup', function() {
       var currentVal = $('#edit_sku').val().toUpperCase();
       $('#edit_sku').val(currentVal);
       if(currentVal.length == 3)
           $('#edit_sku').val(currentVal+"-");       
       });  
       
   
    $('#edit_sku').on('blur', function() { 
        var inputValue =  $.trim( $('#edit_sku').val() );  
        if( inputValue == "") return; // if no input do nothing
        
        if(edit_validate_sku(inputValue))
	{
            $('#edit_processing_gif').show();    
            var url = "/perl/jadrn025/CGI/get_sku_data.cgi?sku=" + inputValue;
            $.get(url, edit_get_sku_data);
	}
        else
	{
            edit_write_error("The SKU format appears to be invalid");
	    $('[name=edit_item] [name=sku]').addClass('error');
	}
        });  
	

    $('#edit_sku').on('focus', function() {
	$('#edit_sku').removeClass('error');
        edit_clear_error();
	$('[name="edit_item"]')[0].reset();
	$("#edit_pic").html('');
	$('#edit_sku_button').attr('disabled','disabled');
    });
	

    $('#edit_sku_button').on('click', function(e) {
        e.preventDefault();
	if(validate_edit_form())
	{
	    $('#edit_processing_gif').show();
	    processEditUpload();
	}
    });
    
    $('[name=edit_item] [type="reset"]').click(function(e) {
  	$("#edit_pic").html('');
	edit_clear_error();
    });
    
    $("[name=edit_item] [name=image]").change(function (){
         var fileName = $(this).val().replace(/C:\\fakepath\\/i,'').replace(/\s+/g, "");
         $("[name=edit_item] [name=image_name]").val(fileName);
         $('#edit_pic').html('');
       //alert(fileName);
     });

    $('[name=edit_item] [name=vendor],[name=edit_item] [name=category],[name=edit_item] [name=man_sku],[name=edit_item] [name=desc],[name=edit_item] [name=features],[name=edit_item] [name=cost],[name=edit_item] [name=retail]').on('focus', function() {
	$('[name=edit_item] [name=vendor],[name=edit_item] [name=category],[name=edit_item] [name=man_sku],[name=edit_item] [name=desc],[name=edit_item] [name=features],[name=edit_item] [name=cost],[name=edit_item] [name=retail]').removeClass('error');
    });
   // $('[name=edit_item] [name=vendor],[name=edit_item] [name=category],[name=edit_item] [name=man_sku]').prop('disabled', true);
});

function validate_edit_form() {
    
    if ($('#edit_sku').val() == "") {
	edit_write_error("Please enter SKU.");
	$('#edit_sku').addClass('error');
	return false;
    }

    if ($('[name=edit_item] [name=vendor]').val() == "-1")
    {
	edit_write_error("Please select vendor.");
	$('[name=edit_item] [name=vendor]').addClass('error');
	return false;
    }
    
    if ($('[name=edit_item] [name=category]').val() == "-1")
    {
	edit_write_error("Please select category.");
	$('[name=edit_item] [name=category]').addClass('error');
	return false;
    }
    
    if ($('[name=edit_item] [name=man_sku]').val() == "")
    {
	edit_write_error("Please enter vendor's ID.");
	$('[name=edit_item] [name=man_sku]').addClass('error');
	return false;
    }
    
    if ($('[name=edit_item] [name=desc]').val() == "")
    {
	edit_write_error("Please enter description.");
	$('[name=edit_item] [name=desc]').addClass('error');
	return false;
    }
    
    if ($('[name=edit_item] [name=features]').val() == "")
    {
	edit_write_error("Please enter features.");
	$('[name=edit_item] [name=features]').addClass('error');
	return false;
    }
    
    if ($('[name=edit_item] [name=cost]').val() == "")
    {
	edit_write_error("Please enter cost.");
	$('[name=edit_item] [name=cost]').addClass('error');
	return false;
    }
    
    if ($('[name=edit_item] [name=retail]').val() == "")
    {
	edit_write_error("Please enter retail cost.");
	$('[name=edit_item] [name=retail]').addClass('error');
	return false;
    }
    
    if (!($('[name=edit_item] [name=image]').val()))
    {
	edit_write_error("Please select image.");
	$('[name=edit_item] [name=image]').addClass('error');
	return false;
    }
    
    
    
    return true;
}

function edit_get_sku_data(response) {
    $('#edit_processing_gif').hide();
    if (response.indexOf("not-auth") > -1)
        window.location.href = "http://jadran.sdsu.edu/~jadrn025/proj1/error.html";
    else if(response == "not_found") 
    {
        edit_write_error("Sorry, the SKU does not exists");
	$('[name=edit_item] [name=sku]').addClass('error');
    }
    else
    {
        edit_clear_error();
	$('#edit_sku_button').removeAttr('disabled');
	fill_form(response);
    }    
}

function fill_form(json_obj)
{
    json_obj = eval("("+json_obj+")");
    
    $('[name=edit_item] [name=vendor]').val(json_obj.product_detail[0].vendor);
    $('[name=edit_item] [name=category]').val(json_obj.product_detail[0].category);
    $('[name=edit_item] [name=man_sku]').val(json_obj.product_detail[0].manufacturerID);
    $('[name=edit_item] [name=desc]').val(json_obj.product_detail[0].description.replace(/``/g, "\n").replace(/~/g,"\""));
    $('[name=edit_item] [name=features]').val(json_obj.product_detail[0].features.replace(/``/g, "\n").replace(/~/g,"\""));
    $('[name=edit_item] [name=cost]').val(json_obj.product_detail[0].cost);
    $('[name=edit_item] [name=retail]').val(json_obj.product_detail[0].retail);
    
    var fname = json_obj.product_detail[0].image_name;
    $('[name=edit_item] [name=image_name]').val(fname);
    var toDisplay = '<img width="200px" src="/~jadrn025/proj1/_uploadImageDIR_/' + fname + '" />';               
    $('#edit_pic').html(toDisplay);
}

function edit_validate_sku(value) {
    value = $.trim(value);
    var pattern = /^[A-Z]{3}-[0-9]{3}$/;
    if(pattern.test(value))
        return true;
    return false;
    } 
    
function edit_write_error(msg) 
{
    $('#edit_message_line').html("<b>"+msg+"</b>");   
}     
    
function edit_clear_error() 
{
    $('#edit_message_line').html("&nbsp;");   
}  

function processEditUpload()
{
    editUploadImage();
}

function editUploadImage()
{
    if ($('[name=edit_item] [name=image]').val())
    {
	var edit_form_data = new FormData($('form')[0]);       
	edit_form_data.append("image_data", document.getElementById("edit_image").files[0]);
	$.ajax({
            url: "/perl/jadrn025/CGI/upload_image.cgi",
            type: "post",
            data: edit_form_data,
            processData: false,
            contentType: false,
	    
            success: function(response) {
               var fname = $("#edit_image").val().replace(/C:\\fakepath\\/i,'').replace(/\s+/g, "") ;
               var toDisplay = '<img width="200px" src="/~jadrn025/proj1/_uploadImageDIR_/' + fname + '" />';               
               $('#edit_pic').html(toDisplay);
		sendEditFormData();
            },
		
            error: function(response) {
               edit_write_error("Server not responding, Pls try again later.");
	       $('#edit_processing_gif').hide();
            }
        });
    }
    else
    {
	sendEditFormData();
    }
}

function sendEditFormData()
{
    var url = "/perl/jadrn025/CGI/edit_item.cgi";
    var params = "sku=" + $('[name=edit_item] [name=sku]').val() + "&";
    params += "vendor=" + $('[name=edit_item] [name=vendor]').val() + "&";
    params += "category=" + $('[name=edit_item] [name=category]').val() + "&";
    params += "man_sku=" + $('[name=edit_item] [name=man_sku]').val() + "&";
    params += "desc=" + $('[name=edit_item] [name=desc]').val() + "&";
    params += "features=" + $('[name=edit_item] [name=features]').val() + "&";
    params += "cost=" + $('[name=edit_item] [name=cost]').val() + "&";
    params += "retail=" + $('[name=edit_item] [name=retail]').val() + "&";
    params += "image=" +  $('[name=edit_item] [name=image_name]').val();
    
    params = encodeURI(params);
    $.post(url,params,edit_handleResponse);
}

function edit_handleResponse(response) 
{
    $('#edit_processing_gif').hide();
    if (response.indexOf("not-auth") > -1 )
        window.location.href = "http://jadran.sdsu.edu/~jadrn025/proj1/error.html";
    else if (response == "ok")
    {
	$('#vtab>div').hide();
	$('.message').html('Item: ' + $('#edit_sku').val() + ' edited');
	$('.message').show();
    }
    else
    {
	edit_write_error(response);
    }
}


/*Reference: http://jadran.sdsu.edu/~jadrn000/ajax_send_form_post/post_ajax.js*/