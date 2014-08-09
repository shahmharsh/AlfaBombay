import java.io.*;
import java.util.*;


public class PasswordTester {
    public static void main(String [] args) {
        String username, clearTextPassword, encryptedPassword;
        String passwordFileName = "passwords.dat";
        
        if(args.length != 2) {
            System.out.println("Usage:\njava PasswordFileMaker" +
            "  USERNAME  PASSWORD");
            return;
            }
        username = args[0].trim();
        clearTextPassword = args[1].trim();
        //PasswordFileMaker.listProviders();

        encryptedPassword = 
            PasswordFileMaker.getEncryptedPassword(clearTextPassword);
       
       Vector<String> userData = new Vector<String>(); 
       String inLine;
       try {    
        BufferedReader reader = new BufferedReader
               (new FileReader(passwordFileName));
           while((inLine = reader.readLine()) != null)
               userData.add(inLine);
           reader.close();  
            }
        catch(Exception e) {
            System.out.println("Error reading datafile.");
            e.printStackTrace();
            return;
            }       
       for(int i=0; i < userData.size(); i++) {
            String tmp = userData.elementAt(i);
            StringTokenizer t = new StringTokenizer(tmp,"=",false);
            String fileUsername = t.nextToken();
            String filePassword = t.nextToken();
            if(fileUsername.equals(username) &&
               filePassword.equals(encryptedPassword)) {
                System.out.println("Validation successful!");
                return;
                }            
            }  // end for 
        System.out.println("Error, not authorized");   
        }
}                
        
