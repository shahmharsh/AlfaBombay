#!/usr/bin/perl

#
# 	Shah, Harsh    Account:  jadrn025
# 	CS645, Spring 2014
# 	Project #1
#


use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);

my $q = new CGI;
my $action = $q->param('action');

if($action eq 'login') {
    login_page();
    }

my $sid = $q->cookie('jadrn025SID') || $q->param('jadrn025SID') || undef;   
my $session = new CGI::Session(undef, $sid, {Directory=>'/tmp'});
    
	unless($sid eq $session->id()) {
	login_error_page();
	} 

if($action eq 'logout') {
    my $cookie = $q->cookie(jadrn025SID => '');
    $session->delete();
    print $q->header( -cookie=>$cookie ); #send cookie with session ID to browser 
    logout_page();
    }

send_page($action);    
    
####
sub send_page { 
    my $to_do = shift @_;               
    my $filename = $to_do.".txt";  
    open FILE, "</srv/www/cgi-bin/jadrn025/html/$filename" 
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

sub login_error_page {
    my $cookie = $q->cookie(jadrn025SID => '');
    print $q->header( -cookie=>$cookie ); #delete 
    print <<END;
Content-type:  text/html

<html>
<head>
    <meta http-equiv="refresh" content="0; 
        url=http://jadran.sdsu.edu/~jadrn025/proj1/error.html" />
</head><body></body>
</html>
END
    exit;
    }

sub login_page {
    my $cookie = $q->cookie(jadrn025SID => '');
    print $q->header( -cookie=>$cookie ); #delete 
    print <<END;
Content-type:  text/html

<html>
<head>
    <meta http-equiv="refresh" content="0; 
        url=http://jadran.sdsu.edu/~jadrn025/proj1/index.html" />
</head><body></body>
</html>
END
    exit; 
    }

sub logout_page {
    my $cookie = $q->cookie(jadrn025SID => '');
    print $q->header( -cookie=>$cookie ); #delete 
    print <<END;
Content-type:  text/html

<html>
<head>
    <meta http-equiv="refresh" content="0; 
        url=http://jadran.sdsu.edu/~jadrn025/proj1/logout.html" />
</head><body></body>
</html>
END
    exit;
    }



#Reference: /~jadrn000/cgi-bin/
