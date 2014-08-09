import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import passwordCheck.PasswordUtil;

public class Login extends HttpServlet {
    	private ServletContext context = null;
	private RequestDispatcher dispatcher = null;
        private String toDo = "";  

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
	{
		String user = request.getParameter("user");
		String pass = request.getParameter("pass");
		if(PasswordUtil.isValid(user, pass))
		{
			toDo = "/jadrn025/jsp/home.jsp";
			HttpSession session = request.getSession(true);
			session.setAttribute("SID", "jadrn025");
		}
		else
		{
			toDo = "/jadrn025/error.html";
		}
		//System.out.println(toDo);
		response.sendRedirect(toDo);   
	}
}