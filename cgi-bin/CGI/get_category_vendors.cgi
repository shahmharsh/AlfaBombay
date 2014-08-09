#!/usr/bin/perl

#
#	Shah, Harsh    Account:  jadrn025
#       CS645, Spring 2014
#       Project #1
#


use DBI;
use CGI;

my $host = "opatija.sdsu.edu";
my $database = "jadrn025";
my $username = "jadrn025";
my $password = "severe";
my $port = "3306";

my $dbh = DBI->connect("DBI:mysql:$database;host=$host;post=$port", $username, $password) or die 'Cannot connect to DB';

my $query = "SELECT id, name from category";

my $sth = $dbh->prepare($query);
$sth->execute();

my $category='"category" : [';

while(my @row=$sth->fetchrow_array())
{
	$category .= '{"id":"' . $row[0] . '","name":"' . $row[1] . '"},';
}

if($category ne '"category" : [')
{	
	chop($category);
}
$category .= ']';


$query = "SELECT id, name from vendor";

$sth = $dbh->prepare($query);
$sth->execute();

my $vendor='"vendors" : [';

while(my @row=$sth->fetchrow_array())
{
	$vendor .= '{"id":"' . $row[0] . '","name":"' . $row[1] . '"},';
}

if($vendor ne '"vendors" : [')
{	
	chop($vendor);
}
$vendor .= ']';

$sth->finish();
$dbh->disconnect();

my $response = "{" . $category .", " . $vendor . "}";

print "Content-type: text/html \n\n";
print $response;


#Reference: /~jadrn000/cgi-bin/
