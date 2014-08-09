<%@ page import="javax.servlet.*, javax.servlet.http.*" %>
<%
        if(session.getAttribute("SID")==null)
	{
	    response.sendRedirect("/jadrn025/error.html");	        
        }
%>

<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<!--    
	Shah, Harsh    Account:  jadrn025
        CS645, Spring 2014
        Project #2
-->
       

<head>
	<title>Main Menu</title>
        <meta http-equiv="Cache-control" content="no-cache" />        
	<meta http-equiv="content-type" content="text/html;charset=utf-8" />
	<link rel="stylesheet" type="text/css" href="/jadrn025/css/style.css" />
	<link rel="stylesheet" type="text/css" href="/jadrn025/css/tabs.css" />
	<script type="text/javascript" src="/jquery/jquery.js"></script>
	<script type="text/javascript" src="/jquery/jQueryUI.js"></script>
	<script type="text/javascript" src="/jadrn025/js/functions.js"></script>
</head>

<body onunload="">
  <div class="company-header"><img src="/jadrn025/images/logo.png" height="80px"></div>

  <div id="vtab">
    <ul>
        <li class="In selected text-style">Inventory In</li>
        <li class="Out text-style">Inventory Out</li>
    </ul>
    <div class="in-div">
        <h4>Inventory In <input type="button" value="Logout" class="logout_button button"/></h4>
	<div>
	  <form method="post" 
            action=""
            name="inven_in">
	    <table>
		<tr>
			<td class="right-align"><label>SKU: </label></td>
			<td><input type="text" name="sku" size="10" id="inventory_in" placeholder="SKU" class="error-box"/><img id="in_processing_gif" width="40px" height="40px" src="/jadrn025/images/processing.gif" /><td>
		</tr>
		<tr>
			<td class="right-align"><label>Vendor: </label></td>
			<td><input type="text" name="vendor" placeholder="Vendor"/></td>
		</tr>
		<tr>
			<td class="right-align"><label>Category: </label></td>
			<td><input type="text" name="category" placeholder="Category"/></td>
		</tr> 
		<tr>
			<td class="right-align"><label>Vendor's ID: </label></td>
			<td><input type="text" name="man_sku" size="25" placeholder="Vendor's ID"/></td>
		</tr>
		<tr>
			<td class="right-align"><label>Description: </label></td>
			<td><textarea type="text" name="desc" rows="4" cols="50" placeholder="Description.."></textarea></td>
		</tr>
		<tr>
			<td class="right-align"><label>Product Features: </label></td>
			<td><textarea type="text" name="features" rows="4" cols="50" placeholder="Product Features.."></textarea></td>
		</tr>
		<tr>
			<td class="right-align"><label>Cost (in $): </label></td>
			<td><input type="text" name="cost" size="5" placeholder="Cost"/></td>
		</tr>
		<tr>
			<td class="right-align"><label>Image: </label></td>
			<td><div name="pic">&nbsp;</div></td>
		</tr>
		<tr>
			<td class="right-align"><label>Quantity: </label></td>
			<td><input type="text" name="qty_in" size="5" placeholder="Quantity"/></td>
		</tr>
	    </table>
	    <div class="error-message">&nbsp;</div>
	    <div class="buttons">
		<input type="reset" value="Clear Data" class="button"/>
		<input id="inventory_in_button" type="submit" value="Submit" class="button"/>
	    </div> 
	  </form>
	</div>
    </div>
    <div class="out-div">
        <h4>Inventory Out <input type="button" value="Logout" class="logout_button button"/></h4>
	<div>
	  <form method="post" 
            action=""
            name="inven_out">
	    <table>
		<tr>
			<td class="right-align"><label>SKU: </label></td>
			<td><input type="text" name="sku" size="10" id="inventory_out" placeholder="SKU" class="error-box"/><img id="out_processing_gif" width="40px" height="40px" src="/jadrn025/images/processing.gif" /><td>
		</tr>
		<tr>
			<td class="right-align"><label>Vendor: </label></td>
			<td><input type="text" name="vendor" placeholder="Vendor"/></td>
		</tr>
		<tr>
			<td class="right-align"><label>Category: </label></td>
			<td><input type="text" name="category" placeholder="Category"/></td>
		</tr> 
		<tr>
			<td class="right-align"><label>Vendor's ID: </label></td>
			<td><input type="text" name="man_sku" size="25" placeholder="Vendor's ID"/></td>
		</tr>
		<tr>
			<td class="right-align"><label>Description: </label></td>
			<td><textarea type="text" name="desc" rows="4" cols="50" placeholder="Description.."></textarea></td>
		</tr>
		<tr>
			<td class="right-align"><label>Product Features: </label></td>
			<td><textarea type="text" name="features" rows="4" cols="50" placeholder="Product Features.."></textarea></td>
		</tr>
		<tr>
			<td class="right-align"><label>Cost (in $): </label></td>
			<td><input type="text" name="cost" size="5" placeholder="Cost"/></td>
		</tr>
		<tr>
			<td class="right-align"><label>Image: </label></td>
			<td><div name="pic">&nbsp;</div></td>
		</tr>
		<tr>
			<td class="right-align"><label>Quantity: </label></td>
			<td><input type="text" name="qty_out" size="5" placeholder="Quantity"/></td>
		</tr>
	    </table>
	    <div class="error-message">&nbsp;</div>
	    <div class="buttons">
		<input type="reset" value="Clear Data" class="button"/>
		<input id="inventory_out_button" type="submit" value="Submit" class="button"/>
	    </div> 
	  </form>
	</div>
    </div>

    <div class="message">
	this is message tab
    <input type="button" value="Logout" class="logout_button button"/>
    </div>
  </div>
  
  
</body>
</html>


<!--Reference: http://www.faridesign.net/2012/05/create-a-awesome-vertical-tabbed-content-area-using-css3-jquery/ -->