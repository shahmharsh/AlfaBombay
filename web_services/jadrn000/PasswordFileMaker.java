import java.security.*;
import java.io.*;

public class PasswordFileMaker {
    private String username, clearTextPassword, encryptedPassword;
            
        public PasswordFileMaker(String usr, String pass) {
            username = usr.trim();
            clearTextPassword = pass.trim();
            encryptedPassword = getEncryptedPassword(clearTextPassword);
            System.out.println("User: " + username + " Clear Text Password: " + 
            clearTextPassword + " Encrypted Password: " + encryptedPassword);
            }
                        
        public static String getEncryptedPassword(String str) {   
            try {  
                MessageDigest d = MessageDigest.getInstance("MD5");
                byte [] b = str.getBytes();     
                d.update(b);
                return  byteArrayToHexString(d.digest());
                }
            catch(Exception e) {
                e.printStackTrace();               
                }
        return null;
        }          
        
        private static String byteArrayToHexString(byte[] b){
            String str = "";
            for(int i=0; i < b.length; i++) {
                int value = b[i] & 0xFF;
                if(value < 16)
                    str += "0";
                str += Integer.toHexString(value);
                }
            return str.toUpperCase();
            }
            
        private void writeToFile(String filename) {
            try {
                PrintWriter out = new PrintWriter(
                    new BufferedWriter(
                        new FileWriter(filename, true)));
                String toWrite = username + "=" + encryptedPassword;
                out.println(toWrite);
                out.flush();
                out.close();
                }
            catch(IOException e) {
                e.printStackTrace();
                }
            }
      
        public static void main(String [] args) {
            if(args.length != 2) {
                System.out.println("Usage:\njava PasswordFileMaker" +
                "  USERNAME  PASSWORD");
                return;
                }
    
            PasswordFileMaker maker = new PasswordFileMaker(args[0], args[1]);
            maker.writeToFile("passwords.dat");
        }    
}    
        
