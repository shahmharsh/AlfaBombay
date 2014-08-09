import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;
import helpers.DBHelper;

public class RecordOutgoing extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        PrintWriter out = response.getWriter();
        String sku = request.getParameter("sku");
        String qty = request.getParameter("qty");
        int qtyAfterUpdate = -1;
        
        String query = "select on_hand_quantity from on_hand where sku = '" + sku + "'";
        Vector onHandResult = DBHelper.doQuery(query);
        if(onHandResult.size() == 0)
        {
            out.print("no-stock");
            return;
        }
        else if(onHandResult.size() == 1)
        {
            int currQty = Integer.parseInt(((String[])onHandResult.get(0))[0]);
            qtyAfterUpdate = currQty - Integer.parseInt(qty);
            if(qtyAfterUpdate < 0)
            {
                out.print("not-enough");
                return;
            }
        }
        else
        {
            out.print("Error");
            return;
        }
        
        query = "insert into merchandise_out values('" + sku + "', now(), " + qty + ")";
        int result = DBHelper.doUpdate(query);
        if(result == 1)
        {
            query = "update on_hand set on_hand_quantity = " + qtyAfterUpdate + ", last_date_modified=now() where sku = '" + sku + "'";
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
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        doPost(request, response);
    }  
}