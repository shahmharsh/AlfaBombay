import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;
import helpers.DBHelper;

public class GetQuantity extends HttpServlet {
    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        PrintWriter out = response.getWriter();
        String sku = request.getParameter("sku");
        String query = "select on_hand_quantity from on_hand where sku='" + sku +"'";
        Vector result = DBHelper.doQuery(query);
        String qty="-1";
        if(result.size() == 1)
            qty = ((String[])result.get(0))[0];
        
        out.print(qty);
    }
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        doPost(request, response);
    }  
}