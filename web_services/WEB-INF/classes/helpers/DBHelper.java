package helpers;

import java.util.*;
import java.sql.*;

public class DBHelper implements java.io.Serializable {
    
// This method is for queries that return a result set.  The returned
// vector holds the results.    
    public static Vector doQuery(String s) {
        String user = "jadrn025";
        String password = "severe";
        String database = "jadrn025";
	String connectionURL = "jdbc:mysql://opatija:3306/" + database + "?user=" + user + "&password=" + password;		
	Connection connection = null;
	Statement statement = null;
	ResultSet resultSet = null;
        Vector<String []> v = new Vector<String []>();
	
	try {
	    Class.forName("com.mysql.jdbc.Driver").newInstance();
	    connection = DriverManager.getConnection(connectionURL);
	    statement = connection.createStatement();
	    resultSet = statement.executeQuery(s);
           
	    ResultSetMetaData md = resultSet.getMetaData();
            int numCols = md.getColumnCount();
          
            while(resultSet.next())
	    {
                String [] tmp = new String[numCols];
                for(int i=0; i < numCols; i++)
                {
		    tmp[i] = resultSet.getString(i+1);  // resultSet getString is 1 based
		}
                v.add(tmp);                
            }
	}
	catch(Exception e) {
	    e.printStackTrace();
	}
// IMPORTANT, you must make sure that the resultSet, statement and connection
// are closed, or a memory leak occurs in Tomcat.            
        finally {
            try {
                resultSet.close();
                statement.close();                
        	connection.close();
            }
            catch(SQLException e) {}  // don't do anything if the connection is not open.
        }
        return v;
    }
    
// This method is appropriate for DB operations that do not return a result 
// set, but rather the number of affected rows.  This includes INSERT and UPDATE    
    public static int doUpdate(String s) {
        String user = "jadrn025";
        String password = "severe";
        String database = "jadrn025";
	String connectionURL = "jdbc:mysql://opatija:3306/" + database + "?user=" + user + "&password=" + password;		
	Connection connection = null;
	Statement statement = null;
        int result = -1;
	
	try {
	    Class.forName("com.mysql.jdbc.Driver").newInstance();
	    connection = DriverManager.getConnection(connectionURL);
	    statement = connection.createStatement();  
            result = statement.executeUpdate(s);
        }
	catch(Exception e) {
	    e.printStackTrace();
	}
// IMPORTANT, you must make sure that the statement and connection
// are closed, or a memory leak occurs in Tomcat.            
        finally {
            try {
                statement.close();                
        	connection.close();
            }
            catch(SQLException e) {}  // don't do anything if the connection is not open.
        }
        return result;
    }              
}

//Reference: jadrn045