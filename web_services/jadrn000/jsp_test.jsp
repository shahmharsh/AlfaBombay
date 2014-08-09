<%@ page import = "java.util.*" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html;
    charset=iso-8859-1" />
    
    <title>JSP Example Page</title>
     
    <link rel="stylesheet" type="text/css" 
        href="http://pindar.sdsu.edu/sdsu.css" />    
</head>

<body>
    <div>
	<% out.print("<h3>Welcome to trieste</h3>"); %>    
    	<p>
	           
        	The current Date/Time is: 
		 <%!Date d = new Date();
		%>
	        <%= new Date() %> 
		    
	        The date/time when the servlet was loaded is: <%= d %>
	</p>        
    </div>
</body>

</html>
