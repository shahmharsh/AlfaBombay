#!/usr/bin/perl

#
# 	Shah, Harsh    Account:  jadrn025
# 	CS645, Spring 2014
# 	Project #1
#

use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);
use Crypt::Password;

my $q;
if(authenticate_user()) {
    send_to_main();   
    }
else {
    send_to_login_error();
    }
    
sub authenticate_user {
    $q = new CGI;
    my $user = $q->param("user");
    my $password = $q->param("pass");    
    open DATA, "</srv/www/cgi-bin/jadrn025/passwords.dat" 
        or die "Cannot open file.";
    @file_lines = <DATA>;
    close DATA;

    $OK = 0; #not authorized
    chomp $user;
    chomp $password;
    foreach $line (@file_lines) {
        chomp $line;
        ($stored_user, $stored_pass) = split /=/, $line;    
        if($stored_user eq $user && check_password($stored_pass, $password)) {
            $OK = 1;
            last;
            }
        }
    return $OK;
    }

sub send_to_login_error {
    print <<END;
Content-type:  text/html

<html>
<head>
    <meta http-equiv="refresh" 
        content="0; url=http://jadran.sdsu.edu/~jadrn025/proj1/error.html" />
</head><body></body>
</html>

END
    }  

sub send_to_main {

    my $session = new CGI::Session(undef, undef, {Directory=>'/tmp'});
    $session->expires('+1d');
    my $cookie = $q->cookie(jadrn025SID => $session->id);
    print $q->header( -cookie=>$cookie ); #send cookie with session ID to browser    

    print <<END;
Content-type:  text/html

<html>
<head>
    <meta http-equiv="Cache-control" content="no-cache">
    <meta http-equiv="refresh" 
        content="0; url=http://jadran.sdsu.edu/perl/jadrn025/CGI/process_request.cgi?action=menu" />
</head><body></body>
</html>

END
}


#Reference: /~jadrn000/cgi-bin/
