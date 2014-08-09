import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;
import helpers.DBHelper;

public class GetVendors extends HttpServlet {
    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        PrintWriter out = response.getWriter();
        // gets the on hand table in memory for easy retrieval
       String query = "select name from vendor";
       Vector result = DBHelper.doQuery(query);
       String vendors = "";
       if(result.size() > 0)
       {
            for(int i=0; i<result.size(); i++)
            {
                String[] tmp = (String[]) result.get(i);
                vendors += tmp[0] + "|";
            }
       }

        out.print(vendors);
    }
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        doPost(request, response);
    }  
}