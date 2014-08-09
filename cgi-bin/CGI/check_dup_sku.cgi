#!/usr/bin/perl

#
#	Shah, Harsh    Account:  jadrn025
#       CS645, Spring 2014
#       Project #1
#

use DBI;
use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);


my $q = new CGI;

my $sid = $q->cookie('jadrn025SID') || $q->param('jadrn025SID') || undef;   
my $session = new CGI::Session(undef, $sid, {Directory=>'/tmp'});
    
	unless($sid eq $session->id()) 
	{  
	    my $cookie = $q->cookie(jadrn025SID => '');
    	    print $q->header( -cookie=>$cookie ); #delete 
	    print "Content-type: text/html \n\n";
            print "not-auth";
	    return;
	} 
	
my $host = "opatija.sdsu.edu";
my $database = "jadrn025";
my $username = "jadrn025";
my $password = "severe";
my $port = "3306";

my $dbh = DBI->connect("DBI:mysql:$database;host=$host;post=$port", $username, $password) or die 'Cannot connect to DB';

my $sku = $q->param("sku");

my $query = "select sku from products where sku='".$sku."'";
            
my $sth = $dbh->prepare($query);
$sth->execute();

my $response = "";

while(my @row=$sth->fetchrow_array()) {    
    $response = $row[0];
    }
if($response ne "") {
    $response = "duplicate"; 
    }    
else {
    $response = "ok";
    }    
$sth->finish();
$dbh->disconnect();
    
print "Content-type: text/html\n\n";
print $response;

#Reference: /~jadrn000/cgi-bin/
