import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;
import helpers.DBHelper;

public class GetProducts extends HttpServlet {

    private Hashtable<String, Integer> onHandItems = new Hashtable<String, Integer>();
    
    private void updateOnHand(){
       String query = "select sku, on_hand_quantity from on_hand";
       Vector result = DBHelper.doQuery(query);
       if(result.size() > 0)
       {
            for(int i=0; i<result.size(); i++)
            {
                String[] tmp = (String[]) result.get(i);
                String sku = tmp[0];
                int qty = Integer.parseInt(tmp[1]);
                onHandItems.put(sku,qty);
            }
       }
    }
    
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
        PrintWriter out = response.getWriter();
        String category = request.getParameter("category");
        Vector result=null;
        
        if(category.equals("search"))
        {
            String searchTerm = request.getParameter("term");
            String vendor = request.getParameter("vendor");
            String query = "select sku, vendor, manufacturerID, category, description, features, retail, image_name from products";
            
            query += " where (description like '%" + searchTerm + "%' OR features like '%" + searchTerm + "%')";
            
            if(!vendor.equals("all"))
                query += " AND (vendor='" + vendor + "')";
            
            //System.out.println(query);
            
            result = DBHelper.doQuery(query);
        }
        else if(category.equals("sku"))
        {
            String skusToReturn = request.getParameter("skus");
            String [] skus = skusToReturn.split("\\|\\|");
            result = new Vector();
            for(int i=0;i < skus.length; i++)
            {
                String query = "select sku, vendor, manufacturerID, category, description, features, retail, image_name from products where sku='" + skus[i] + "'";
                Vector queryResult = DBHelper.doQuery(query);
                result.add(queryResult.get(0));
            }
        }
        else
        {
            String query = "select sku, vendor, manufacturerID, category, description, features, retail, image_name from products";
            if(category.equals("landingPage"))
            {
                query += " limit 8";
            }
            else
            {
                query +=  " where category = '" + category + "'";
            }
            result = DBHelper.doQuery(query);
        }
        String jsonResponse = "";
        if(result.size() > 0)
        {
            updateOnHand();
            for(int i=0; i<result.size(); i++)
            {
                String[] tmp = (String[]) result.get(i);
                String sku = tmp[0];
                Integer qty = onHandItems.get(sku);
                String status;
                if(qty == null)
                    status = "Coming Soon";
                else if(qty == 0)
                    status = "More on the way";
                else
                    status = "In Stock";
                
                jsonResponse += "{\"sku\":\"" + sku
                               + "\",\"vendor\":\"" + tmp[1]
                               + "\",\"vendorID\":\"" + tmp[2]
                               + "\",\"category\":\"" + tmp[3]
                               + "\",\"description\":\"" + tmp[4].replaceAll(System.getProperty("line.separator"),"``").replaceAll("\"","~")
                               + "\",\"features\":\"" + tmp[5].replaceAll(System.getProperty("line.separator"),"``").replaceAll("\"","~")
                               + "\",\"cost\":\"" + tmp[6]
                               + "\",\"image_name\":\"" + tmp[7]
                               + "\",\"status\":\"" + status
                               + "\"},";
            }
            
            jsonResponse = jsonResponse.substring(0, jsonResponse.length() - 1); //remove trailing ','
            jsonResponse = "[" + jsonResponse + "]";
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