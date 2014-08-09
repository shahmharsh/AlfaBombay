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

my $sku = $q->param('sku');
my $vendor = $q->param('vendor');
my $category = $q->param('category');
my $manufacturer_id = $q->param('man_sku');
my $description = $q->param('desc');
my $features = $q->param('features');
my $cost = $q->param('cost');
my $retail = $q->param('retail');
my $image = $q->param('image');

my $host = "opatija.sdsu.edu";
my $database = "jadrn025";
my $username = "jadrn025";
my $password = "severe";
my $port = "3306";

my $dbh = DBI->connect("DBI:mysql:$database;host=$host;post=$port", $username, $password) or die 'Cannot connect to DB';

my $query = "UPDATE products SET category=?, vendor=?, manufacturerID=?, description=?, features=?, cost=?, retail=?, image_name=? WHERE sku=?";
#my $query = "UPDATE products SET category='$category', vendor='$vendor', manufacturerID='$manufacturer_id', description='$description', features='$features', cost=$cost, retail=$retail, image_name='$image' WHERE sku='$sku'";

my $sth = $dbh->prepare($query) or die "Couldn't prepare";
$sth->execute($category, $vendor, $manufacturer_id, $description, $features, $cost, $retail, $image, $sku);

if($sth->err)
{
    print "Content-type: text/html \n\n";
    print "Database ERROR: " . $sth->errstr;
}
else
{
    print "Content-type: text/html \n\n";
    print "ok";
}

$sth->finish();
$dbh->disconnect();


