#!/usr/bin/perl

# Using redirection breaks the chain and prevents reloads from accessing
# protected information.

use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);

my $q = new CGI;
my $action = $q->param('action');

    print <<END;
Content-type:  text/html

<html>
<head>
    <meta http-equiv="refresh" content="0; 
        url=http://jadran.sdsu.edu/perl/jadrn000/sessions_cookies/process_request.cgi?action=$action" />
</head><body></body>
</html>
END
    exit; # terminate the script after printing
    
