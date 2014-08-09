

/* All functions */
function clearPaymentDialog()
{
    $('#customer-details > table > tbody > tr').each( function() {
        $(this).find('input[type=text]').val('');
    });
}

function getLandingPage()
{
    var url = "/jadrn025/servlet/CustomerEntryPoint?action=GetProducts&category=landingPage";
    $.get(url, displayProducts);
}

function goSearch() {
    var searchTerm = encodeURI($("#search-text").val());
    var vendor = $("select[name=vendorDropdown]").val();
    var url = "/jadrn025/servlet/CustomerEntryPoint?action=GetProducts&category=search&term=" + searchTerm + "&vendor=" + vendor;
    $.get(url, displayProducts);
}

function orderConfirmation(response)
{
    if (response == "success") {
        
        var cartArray = cart.getCartArray();
        for(var i=0; i<cartArray.length; i++)
        {
            cart.delete(cartArray[i][0]);
        }
        
        $("#products").html('<div class="green">Order Sucessfully Placed!</div>');
        $("div.customer-details").html('');
        $("#count").html(cart.size());
    }
    else{
        $("#products").html('<div class="red">There was some problem while placing order, please try again later.</div>');
        $("div.customer-details").html('');
    }
}

function summarizeOrder()
{
    if (validPaymentInfo()) {
        if (!fromEdit) {
            $("input.quantity").prop('disabled', true);
            $("div.delete").html("");
            $("#checkoutButton").html('<input type="button" id="cancel" value="Cancel"><input type="button" id="placeOrder" value="Place Order">');
            
            var totalOrder = $("#total").html();
            totalOrder = parseFloat(totalOrder.slice(1,totalOrder.length));
            totalOrder += 5;
            var tax = totalOrder * 0.08;
            totalOrder += tax;
            var totalHtml=      '<tr>'
                            +       '<td></td>'
                            +       '<th>Shipping</th>'
                            +       '<td>$5.00</td>'
                            +   '</tr>';
                            
            totalHtml += '<tr>'
                            +       '<td></td>'
                            +       '<th>Tax</th>'
                            +       '<td>$'+tax.toFixed(2)+'</td>'
                            +   '</tr>';
            
            totalHtml += '<tr>'
                            +       '<td></td>'
                            +       '<th>Total</th>'
                            +       '<td>$'+totalOrder.toFixed(2)+'</td>'
                            +   '</tr>';
            
            $('#cartTable > tfoot').append(totalHtml);
	    
	    $("#cartTable").closest("div").addClass("summary-cart");
        }
        var creditCardNo = $("input[name=card-no]").val();
        // getBillingDetails
        var customerDetails =  '<div class="payment-details Lfloat"><table><caption><h2>Payment Summary</h2></caption>'
			+   '<tr><td>Name:</td><td>' + $("input[name=fname]").val() + ' ' + $("input[name=lname]").val() +'</td></tr>'
                        +   '<tr><td>Phone No:</td><td>' + $("input[name=phone]").val() + '</td></tr>'
                        +   '<tr><td>Credit Card:</td><td>xxxx-xxxx-xxxx-' + creditCardNo.slice(creditCardNo.length - 4, creditCardNo.length) + '</td><td>'
                        +   '<tr><td>Billing Address:</td><td>'
                                + $(".billing > input[name=addr1]").val() + ' '
                                + $(".billing > input[name=addr2]").val() + ', '
                                + $(".billing > input[name=city]").val() + ' '
                                + $(".billing > input[name=state]").val() + ' '
                                + $(".billing > input[name=zip]").val() + '</td></tr>'
                        +   '<tr><td>Shipping Address:</td><td>'
                                + $(".shipping > input[name=addr1]").val() + ' '
                                + $(".shipping > input[name=addr2]").val() + ', '
                                + $(".shipping > input[name=city]").val() + ' '
                                + $(".shipping > input[name=state]").val() + ' '
                                + $(".shipping > input[name=zip]").val() + '</td></tr>'
                        +   '<tr><td colspan=2 class="center-align"><input type="button" id="edit" value="Edit"/></td></tr>'
                        + '</table></div>';
                        
        $("div.customer-details").html(customerDetails);
	
	closeDialog();
    }
}

function validPaymentInfo()
{
    if ($("input[name=fname]").val() == '') {
        $("input[name=fname]").addClass("error");
	displayError('First name cannot be blank');
        return false;
    }
    
    if ($("input[name=lname]").val() == '') {
        $("input[name=lname]").addClass("error");
	displayError('Last name cannot be blank');
        return false;
    }
    
    if ($("input[name=phone]").val().length < 12 || $("input[name=phone]").val() == '') {
        $("input[name=phone]").addClass("error");
	displayError('Invalid Phone No');
        return false;
    }
    
    if ($("input[name=card-no]").val().length < 19 || $("input[name=card-no]").val() == '') {
        $("input[name=card-no]").addClass("error");
	displayError('Invalid Credit Card No');
        return false;
    }
    
    if ($("input[name=card-expdate]").val().length < 5 || $("input[name=card-expdate]").val() == '') {
        $("input[name=card-expdate]").addClass("error");
	displayError('Invalid Expiration Date');
        return false;
    }
    var expdateArray = $("input[name=card-expdate]").val().split("/");
    if (parseInt(expdateArray[0]) > 12  || parseInt(expdateArray[1]) > 31) {
	$("input[name=card-expdate]").addClass("error");
	displayError('Invalid Expiration Date');
        return false;
    }
    
    if ($("input[name=card-code]").val().length < 3 || $("input[name=card-code]").val() == '') {
        $("input[name=card-code]").addClass("error");
	displayError('Invalid Security Code');
        return false;
    }
    
    if ($(".billing > input[name=addr1]").val() == '') {
        $(".billing > input[name=addr1]").addClass("error");
	displayError('Address cannot be blank');
        return false;
    }
    
    if ($(".billing > input[name=city]").val() == '') {
        $(".billing > input[name=city]").addClass("error");
	displayError('City cannot be blank');
        return false;
    }
    
    if ($(".billing > input[name=state]").val() == '') {
        $(".billing > input[name=state]").addClass("error");
	displayError('State cannot be blank');
        return false;
    }
    
    if ($(".billing > input[name=zip]").val() == '' || $(".billing > input[name=zip]").val().length < 5) {
        $(".billing > input[name=zip]").addClass("error");
	displayError('Invalid Zip code');
        return false;
    }
    
    if ($(".shipping > input[name=addr1]").val() == '') {
        $(".shipping > input[name=addr1]").addClass("error");
	displayError('Address cannot be blank');
        return false;
    }
    
    if ($(".shipping > input[name=city]").val() == '') {
        $(".shipping > input[name=city]").addClass("error");
	displayError('City cannot be blank');
        return false;
    }
    
    if ($(".shipping > input[name=state]").val() == '') {
        $(".shipping > input[name=state]").addClass("error");
	displayError('State cannot be blank');
        return false;
    }
    
    if ($(".shipping > input[name=zip]").val() == '' || $(".billing > input[name=zip]").val().length < 5) {
        $(".shipping > input[name=zip]").addClass("error");
	displayError('Invalid Zip code');
        return false;
    }
    
    return true;
}

function displayError(msg){
    $("div.err-msg").html(msg);
}

function clearError()
{
    $("div.err-msg").html('');
}

function quantityAvailable(sku, qty)
{
    var actualQty = 0;
    jQuery.ajax({
         url:  "/jadrn025/servlet/CustomerEntryPoint?action=GetQuantity&sku=" + sku,
         success: function(result) {
                    if(result.isOk == false)
                          alert(result.message);
                    actualQty = parseInt(result);
                  },
         async:   false
    });          
    
    if (actualQty < qty)
        return false;
    else
        return true;
}


function closeDialog()
{
    $('#product-details').dialog("close");
    $('#customer-details').dialog("close");
}

function displayProducts(response)
{
    if (response == "invalid") {
        var msg = "No products found matching current criteria. ";
        $("#products").html(msg);
    }
    else {
        var jsonObj = eval("(" + response + ")");
        
        var allProducts = "";
        for(var i=1; i<=jsonObj.length; i++)
        {
            var status = jsonObj[i-1].status;
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
            
            allProducts += '<div class="element">'
                        +       '<div class="product_header">' + jsonObj[i-1].vendorID + '</div>'
                        +       '<img class="pic" src="/~jadrn025/proj1/_uploadImageDIR_/' + jsonObj[i-1].image_name +'" />'
                        +       '<div class="product_price">$' + jsonObj[i-1].cost +'</div>'
                        +       '<div class="status ' + colorCode + '">' + jsonObj[i-1].status + '</div>'
                        +       '<p class="hidden">' + JSON.stringify(jsonObj[i-1]) +'</p>'
                        +  '</div>';
            if (i%4 == 0) {
                allProducts += "<br />";
            }
        }
        
        $("#products").html(allProducts);
        $("div.customer-details").html('');
    }
}

function writeCart(response)
{
    if (response == null || response == "") {
        var msg = "No items currently in cart.";
        $('#products').html(msg);
        return;
    }
    var cartArray = cart.getCartArray();
    var jsonObj = eval("(" + response + ")");
    var header =  "<thead>"
		    +   "<tr>"
		    +     "<th colspan=2>Items</th>"
		    +     "<th>Price</th>"
                    +     "<th>Quantity</th>"
		    +   "</tr>"
                    + "</thead>";
                    
    var body =  '<tbody>';
    
    var totalCost = 0;
    for(i=0; i < jsonObj.length; i++) {   
        body += '<tr>'
                +   '<td class="icon">'
                +       '<img class="icon_pic Lfloat" src="/~jadrn025/proj1/_uploadImageDIR_/' + jsonObj[i].image_name +'" />'
                +   '</td>'
                +   '<td>'
                +       '<div class="Lfloat center-align">' + jsonObj[i].vendorID + '<br/>'
                +       '<div class="delete">Delete</div>'
                +       '<p class="hidden">' + jsonObj[i].sku + '</p>'
                +   '</td>'
                +   '<td>$' + jsonObj[i].cost + '</td>'
                +   '<td>'
                +       '<input class="quantity" type="number" value="' + cartArray[i][1] + '"/>'
                +       '<div class="error-msg"></div>'
                +   '</td>'
            +   '</tr>';
        totalCost += parseFloat(jsonObj[i].cost) * parseFloat(cartArray[i][1]);
    }
    body += "</tbody>";
                    
    var footer =  '<tfoot>'
		    +   '<tr>'
                    +       '<td></td>'
                    +       '<th>Subtotal</th>'
		    +       '<td id="total">$'+totalCost.toFixed(2)+'</td>'
		    +   '</tr>'
                + '</tfoot>';
            
    var cartTable = '<div><table id="cartTable"><caption><h2>My Cart</h2></caption> ' + header + body + footer + '</table></div>';
    
    cartTable += '<div id="checkoutButton"><input type="button" id="checkout" value="Proceed to Checkout"></div>';
    $('#products').html(cartTable);
    $("div.customer-details").html('');
}

function populateVendors(response)
{
    response = response.slice(0,-1);
    var allVendors = response.split("|");
    var vendorDropdown='<option value="all" selected>All</option>\n';
    for(i=0; i<allVendors.length; i++) 
    {
     	vendorDropdown += "<option value='" + allVendors[i] + "'>"+ allVendors[i] +"</option>";
    }
    
    $('[name="vendorDropdown"]').append(vendorDropdown);
}

function updateCartTable()
{
    var totalCost = 0 ;
    $('#cartTable > tbody > tr').each( function() {
        var cost = $(this).find('td:eq(2)').html();
        var qty = $(this).find('input').val();
        totalCost += parseFloat(cost.slice(1,cost.length)) * parseInt(qty);
    });
    $("#total").html("$" + totalCost.toFixed(2));
}