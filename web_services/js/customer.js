/*
    Shah, Harsh    Account:  jadrn025
    CS645, Spring 2014
    Project #3
*/

var cart = new shopping_cart("jadrn025");
var fromEdit = false; // used to indicate if payment modal is displayed via edit button click or not
$(document).ready( function() {

    getLandingPage();
    url = "/jadrn025/servlet/CustomerEntryPoint?action=GetVendors";
    $.get(url, populateVendors);
    $("#count").html(cart.size());
    
    $('ul.navbar li').click(function() { 
        var category = $(this).text();
        if (category == "Home") {
            getLandingPage();
            return;
        }
        var url = "/jadrn025/servlet/CustomerEntryPoint?action=GetProducts&category=" + category;
        $.get(url, displayProducts);
    });
    
    $("#product-details").dialog({
	height: 500,
	width: 600,
	modal: true,
	autoOpen: false
    });
    
    $("#customer-details").dialog({
	height: 500,
	width: 700,
	modal: true,
	autoOpen: false
    });
    
    $("#cart").click(function(){
        var cartArray = cart.getCartArray();
        var skus="";
        for(i=0; i < cartArray.length; i++) {
            skus += cartArray[i][0] + "||";
        }
        
        skus = skus.slice(0,-2);
        var url = "/jadrn025/servlet/CustomerEntryPoint?action=GetProducts&category=sku&skus=" + skus;
        $.get(url, writeCart);
    });
});

$(document).on("keypress", "#search-text", function (e) {
        
        if(e.keyCode == 13) {
            goSearch();
        }
        
        var regex = new RegExp("^[a-zA-Z0-9 \b]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (!regex.test(str)) {
            e.preventDefault();
        }
        
    });

$(document).on("click", "#placeOrder", function() {
        var skuQty = "";
        $('#cartTable > tbody > tr').each( function() {
            var sku = $(this).find('td:eq(1)').find('p').html();
            var qty = $(this).find('input').val();
            skuQty += sku + "," + qty + "||";
        });
        
        skuQty = skuQty.slice(0,-2);
        skuQty = encodeURI(skuQty);
        var url = "/jadrn025/servlet/CustomerEntryPoint?action=SellProducts&skuQty=" + skuQty;
        $.get(url, orderConfirmation);
    });

$(document).on("click", "#cancel", getLandingPage);

$(document).on("change", "select[name=vendorDropdown]", goSearch);

$(document).on("click", "input[name=summary]", function(){
        summarizeOrder();
    });

$(document).on("click", "#checkout", function(){
        var isValid = true;
        $('#cartTable > tbody > tr').each( function() {
            var sku = $(this).find('p').html();
            var qty = $(this).find('input').val();
            if(!quantityAvailable(sku,qty))
            {
                isValid = false;
                $(this).find('td:eq(3) > input').addClass("error");
                $(this).find('td:eq(3) > div.error-msg').html('Quantity not currently available, kidly reduce');
            }
        });
        if (isValid) {
            clearPaymentDialog();
            fromEdit = false;
            $("#customer-details").dialog('open');   
        }
    });

$(document).on("click",".element",function(e){
            var json = $(this).find("p").html();
            
            json = eval("(" + json + ")");
            
            var status = json.status;
            var colorCode;
            if (status == "Coming Soon") {
                colorCode = "red";
            }
            else if (status == "In Stock") {
                colorCode = "green";
            }
            else {
                colorCode = "blue";
            }
            var divContent = '<div class="add_to_cart">'
                            +   '<img class="large_pic" src="/~jadrn025/proj1/_uploadImageDIR_/' + json.image_name +'" /><br/><br/>'
                            +   '<input id="qty" type="number" placeholder = "Quantity"/><br/>'
                            +   '<input name="add" type="submit" value="Add to Cart" />'
                            +   '<input id="sku" type="hidden" value="' + json.sku + '">'
                            +   '<div class="status ' + colorCode + '">' + json.status + '</div>'
                            +   '<div class="error-msg"></div>'
                            + '</div>'
                            + '<div class="content">'
                            +   '<div class="title"><h2>' + json.vendorID + '</h2></div>'
                            +   '<div class="vendor"><h4>' + json.vendor + '</h4></div>'
                            +   '<div class="cost"> $' + json.cost + '</div>'
                            +   '<div class="features"><br/><div class="features-header">Features:</div><br/>' + json.features.replace(/``/g, "<br/>-").replace(/~/g,"\"") + '</div>'
                            +   '<div class="description"><br/><div class="description-header">Description:</div><br/>' + json.description.replace(/``/g, "\n").replace(/~/g,"\"") + '</div>'
                            + '</div>';
            
            $(".product-content").html(divContent);
            if (colorCode == "red" || colorCode == "blue") {
                $("input[name=add]").prop('disabled', true);
                $("#qty").prop('disabled', true);
            }
            
            $("#product-details").dialog('open');
     });

$(document).on("click",".ui-widget-overlay",function(e){
        closeDialog();
     });

$(document).on("click","input[name=add]",function(e){
        var sku = $("#sku").val();
        var qty = parseInt($("#qty").val());
        if (qty==null || qty==0 || isNaN(qty)) {
            $('#qty').addClass('error');
        }
        else {
            if (quantityAvailable(sku,qty)) {
                cart.add(sku, qty);
                $("#count").html(cart.size());
                closeDialog();
            }
            else
            {
                $(this).closest('div').find('div.error-msg').html("Quantity currently  not <br/> available, kindly reduce <br/> and try again.");
                $('#qty').addClass('error');
            }
        }
    });

$(document).on("click",".delete",function(e){
        var sku = $(this).closest('tr').find("p").html();
        cart.delete(sku);
        $(this).closest('tr').remove();
        $("#count").html(cart.size());
        if(cart.size()==0)
        {
            var msg = "No items currently in cart.";
            $('#products').html(msg);
        }
        else
            updateCartTable();
    });

$(document).on("blur",".quantity",function(e){
        var sku = $(this).closest('tr').find("p").html();
        var qty = $(this).val();
        if (qty=="" || qty ==null || parseInt(qty)==0) {
            $(this).addClass("error");
            return;
        }
        if (quantityAvailable(sku,qty)) {
            cart.setQuantity(sku, qty);
            $("#count").html(cart.size());
            updateCartTable();
        }
        else
        {
            $(this).addClass('error');
            $(this).closest('td').find('div.error-msg').html('<br/>Quantity not currently available, kidly reduce');
        }
    });

$(document).on("focus",".quantity",function(e){
        $(this).removeClass('error');
        $(this).closest('td').find('div.error-msg').html('');
    });

$(document).on("focus","#qty",function(e){
        $(this).closest('div').find('div.error-msg').html('');
        $('#qty').removeClass('error');
    });

$(document).on("change","input[type=checkbox]",function(e){
        if(this.checked) {
            $(".shipping > input[name=addr1]").val($(".billing > input[name=addr1]").val());
            $(".shipping > input[name=addr2]").val($(".billing > input[name=addr2]").val());
            $(".shipping > input[name=city]").val($(".billing > input[name=city]").val());
            $(".shipping > input[name=state]").val($(".billing > input[name=state]").val());
            $(".shipping > input[name=zip]").val($(".billing > input[name=zip]").val());
        }
        else
        {
           $('.shipping > input[type=text]').each( function() {
                $(this).val('');
            }); 
        }
    });

$(document).on("click","#edit",function(e){
        fromEdit = true;
        $("#customer-details").dialog('open');  
    });


/* validation */
$(document).on("focus", "input[type=text]", function(){
        $(this).removeClass('error');
        clearError();
    });

$(document).on("input", "#qty, .quantity", function(){
        this.value = this.value.replace(/[^0-9]/g, '');
    });

$(document).on("input", "input[name=fname],input[name=lname], .shipping > input[name=state], .shipping > input[name=city], .billing > input[name=state], .billing > input[name=city]", function(){
        this.value = this.value.replace(/[^a-zA-Z -]/g, '');
    });

$(document).on("keydown", ".shipping > input[name=zip], .billing > input[name=zip]", function(e){
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
            return;
        }
        var currentVal = $(this).val();
        if(currentVal.length == 5)
            e.preventDefault();
    });

$(document).on("keydown", "input[name=phone]", function(e){
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
            return;
        }
        var currentVal = $(this).val();
        if(currentVal.length == 3 || currentVal.length == 7)
            $(this).val(currentVal+"-");
            
        if(currentVal.length == 12)
            e.preventDefault();
    });

$(document).on("keydown", "input[name=card-no]", function(e){
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
            return;
        }
        var currentVal = $(this).val();
        if(currentVal.length == 4 || currentVal.length == 9 || currentVal.length == 14)
            $(this).val(currentVal+"-");
            
        if(currentVal.length == 19)
            e.preventDefault();
        
    });

$(document).on("keydown", "input[name=card-code]", function(e){
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
            return;
        }
        var currentVal = $(this).val();
        if(currentVal.length == 3 )
            e.preventDefault();
    });

$(document).on("keydown", "input[name=card-expdate]", function(e){
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
            return;
        }
        var currentVal = $(this).val();
        
        if (currentVal.length == 2) 
            $(this).val(currentVal+"/");
        
        if(currentVal.length == 5)
            e.preventDefault();
        
    });