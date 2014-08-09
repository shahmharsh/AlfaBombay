import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;
import helpers.DBHelper;

public class RecordIncoming extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        PrintWriter out = response.getWriter();
        String sku = request.getParameter("sku");
        String qty = request.getParameter("qty");
        String query = "insert into merchandise_in values('" + sku + "', now(), " + qty + ")";
        int result = DBHelper.doUpdate(query);
        if(result == 1)
        {
            query = "select on_hand_quantity from on_hand where sku = '" + sku + "'";
            Vector onHandResult = DBHelper.doQuery(query);
            if(onHandResult.size() == 0)
            {
                query = "insert into on_hand values('" + sku + "', now(), " + qty + ")";
                result = DBHelper.doUpdate(query);
                if(result == -1)
                    out.print("Error");
                else
                    out.print("Success");
            }
            else if(onHandResult.size() == 1)
            {
                int oldQty = Integer.parseInt(((String[])onHandResult.get(0))[0]);
                int newQty = oldQty + Integer.parseInt(qty);
                query = "update on_hand set on_hand_quantity = " + newQty + ", last_date_modified=now() where sku = '" + sku + "'";
                result = DBHelper.doUpdate(query);
                if(result == -1)
                    out.print("Error");
                else
                    out.print("Success");
            }
            else
            {
                out.print("Error");
            }
        }
        else
        {
            out.print("Error");
        }
    }
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        doPost(request, response);
    }  
}