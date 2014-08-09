import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;
import helpers.DBHelper;

public class CheckDup extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        PrintWriter out = response.getWriter();
        String sku = request.getParameter("sku");
        String query = "select vendor, manufacturerID, category, description, features, cost, image_name from products where sku = '" + sku + "'";
        Vector result = DBHelper.doQuery(query);
        if(result.size() == 1)
        {
            String jsonResponse = null;
            String[] tmp = (String[]) result.get(0);
            jsonResponse = "{\"vendor\":\"" + tmp[0]
                           + "\",\"vendorID\":\"" + tmp[1]
                           + "\",\"category\":\"" + tmp[2]
                           + "\",\"description\":\"" + tmp[3].replaceAll(System.getProperty("line.separator"),"``").replaceAll("\"","~")
                           + "\",\"features\":\"" + tmp[4].replaceAll(System.getProperty("line.separator"),"``").replaceAll("\"","~")
                           + "\",\"cost\":\"" + tmp[5]
                           + "\",\"image_name\":\"" + tmp[6]
                           + "\"}";
            out.print(jsonResponse);
        }
        else
        {
            out.print("invalid");
        }
    }
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        doPost(request, response);
    }  
}