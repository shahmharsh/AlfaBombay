import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;
import helpers.DBHelper;

public class SellProducts extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        PrintWriter out = response.getWriter();
        String skuQty = request.getParameter("skuQty");
        String [] skuQtyArray = skuQty.split("\\|\\|");
        boolean errorFlag=false;
        for(int i=0; i<skuQtyArray.length; i++)
        {
            String [] tmp = skuQtyArray[i].split(",");
            String query = "insert into merchandise_out values('" + tmp[0] + "', now(), " + tmp[1] + ")";
            int result = DBHelper.doUpdate(query);
            if(result == 1)
            {
                query = "update on_hand set on_hand_quantity = on_hand_quantity-" + tmp[1] + ", last_date_modified=now() where sku = '" + tmp[0] + "'";
                result = DBHelper.doUpdate(query);
                if(result == -1)
                {
                    errorFlag=true;
                    break;
                }
            }
            else
            {
                errorFlag=true;
                break;
            }
        }
        
        if(errorFlag)
            out.print("error");
        else
            out.print("success");
        
    }
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        doPost(request, response);
    }  
}