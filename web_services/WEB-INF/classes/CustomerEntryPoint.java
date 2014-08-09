import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import passwordCheck.PasswordUtil;

public class CustomerEntryPoint extends HttpServlet {
    private ServletContext context = null;
    private RequestDispatcher dispatcher = null;

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
	String action = request.getParameter("action");
	ServletContext context=null;
	RequestDispatcher dispatcher = null;
	try {
	    context = getServletContext();	
	    dispatcher = request.getRequestDispatcher(action); 
	    dispatcher.forward(request, response);	
	}catch(Exception e) {
	    System.out.print("GoTo is " + action + " and dispatcher is " + dispatcher);
	    e.printStackTrace();
	}
    }
	
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        doPost(request, response);
    }
}