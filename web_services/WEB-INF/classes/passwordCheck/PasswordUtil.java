import java.security.*;
import java.util.*;
import java.io.*;

public class PasswordUtil{
    private static final String passwordFile = "/srv/tomcat/webapps/jadrn025/WEB-INF/classes/passwordCheck/passwords.dat";
    
    public static boolean isValid(String user, String pass)
    {
        Vector<String> users = new Vector<String>();
        String line;
        try {
            BufferedReader reader = new BufferedReader(new FileReader(passwordFile));
            while((line=reader.readLine())!=null)
            {
                users.add(line);
            }
            reader.close();
        }catch(Exception e) {
            throw new RuntimeException("Error: Cannot read file");
        }
        
        String encryptPassword = getEncryptedPassword(pass);
        for(int i=0; i<users.size(); i++)
        {
            String tmpUserPass = users.elementAt(i);
            String[] data = tmpUserPass.split("=");
            String tmpUser = data[0];
            String tmpPass = data[1];
            if(tmpUser.equals(user) && tmpPass.equals(encryptPassword))
            {
                return true;
            }
        }
        return false;
    }
    
    public static String getEncryptedPassword(String pass)
    {
        try{
            MessageDigest d = MessageDigest.getInstance("MD5");
            byte [] b = pass.getBytes();     
            d.update(b);
            return  byteArrayToHexString(d.digest());
        }catch(Exception e) {
            e.printStackTrace(); 
        }
        return null;
    }
    
    private static String byteArrayToHexString(byte[] b){
        String str = "";
        for(int i=0; i < b.length; i++)
        {
            int value = b[i] & 0xFF;
            if(value < 16)
                str += "0";
            str += Integer.toHexString(value);
            }
        return str.toUpperCase();
    }                
}