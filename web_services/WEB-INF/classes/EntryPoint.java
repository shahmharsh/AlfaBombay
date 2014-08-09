import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import passwordCheck.PasswordUtil;

public class EntryPoint extends HttpServlet {
    	private ServletContext context = null;
	private RequestDispatcher dispatcher = null;
        private String toDo = "";  

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		HttpSession session = request.getSession(false);
		PrintWriter out = response.getWriter();
		if(session==null)
		{
			out.print("ErrorPage");
			return;
		}
		
		if(session.getAttribute("SID") != "jadrn025")
		{
			out.print("ErrorPage");
			return;
		}
		
		String action = request.getParameter("action");
		String goTo = null;
		if(action == null)
		{
			session.invalidate();
			out.print("ErrorPage");
			return;
		}
		else if(action.equals("logout"))
		{
			session.invalidate();
			out.print("LogoutPage");
			return;
		}
		else if(action.equals("check_dup"))
			goTo = "CheckDup";
		else if(action.equals("in"))
			goTo = "RecordIncoming";
		else if(action.equals("out"))
			goTo = "RecordOutgoing";
			
		//Process request
		ServletContext context=null;
		RequestDispatcher dispatcher = null;
	    	try {
		    context = getServletContext();	
		    dispatcher = request.getRequestDispatcher(goTo);
		    
		    dispatcher.forward(request, response);	
		    }
		catch(Exception e) {
		    System.out.print("GoTo is " + goTo + " and dispatcher is " + dispatcher);
		    e.printStackTrace();
		}
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
            doPost(request, response);
        }  
}