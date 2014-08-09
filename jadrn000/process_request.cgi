#!/usr/bin/perl

# Check to make sure the user is authenticated, then deliver the page requested.

use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);

my $q = new CGI;
my $action = $q->param('action');

##---------------------------- MAIN ---------------------------------------
if($action eq 'login') {
    login_page();
    }
if($action eq 'logout') {
    my $cookie = $q->cookie(jadrn025SID => '');
    print $q->header( -cookie=>$cookie ); #send cookie with session ID to browser 
    send_page('logout');
    }
    
    my $sid = $q->cookie('jadrn025SID') || $q->param('jadrn025SID') || undef;   
    my $session = new CGI::Session(undef, $sid, {Directory=>'/tmp'});
    unless($sid eq $session->id()) {
	login_error_page();
	}   
    send_page($action);
###########################################################################

###########################################################################    
sub send_page { 
    my $to_do = shift @_;               
    my $filename = $to_do.".txt";  
    open FILE, "</srv/www/cgi-bin/jadrn000/sessions_cookies/$filename" 
        or die "Cannot open file $filename";
    @lines = <FILE>;
    unless($to_do eq 'logout') {
        print "Content-type: text/html\n\n";
        }
    foreach $line (@lines) {
        print $line;
        }
    exit;
    }
###########################################################################

###########################################################################
sub login_error_page {
    my $cookie = $q->cookie(jadrn000SID => '');
    print $q->header( -cookie=>$cookie ); #delete 
    print <<END;
Content-type:  text/html

<html>
<head>
    <meta http-equiv="refresh" content="0; 
        url=http://jadran.sdsu.edu/~jadrn000/proj1/error.html" />
</head><body></body>
</html>
END
    exit; # terminate the script after printing
    }
###########################################################################

###########################################################################
sub login_page {
    my $cookie = $q->cookie(jadrn025SID => '');
    print $q->header( -cookie=>$cookie ); #delete 
    print <<END;
Content-type:  text/html

<html>
<head>
    <meta http-equiv="refresh" content="0; 
        url=http://jadran.sdsu.edu/~jadrn000/proj1/login.html" />
</head><body></body>
</html>
END
    exit; # terminate the script after printing
    }
###########################################################################
