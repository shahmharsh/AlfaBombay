#!/usr/bin/perl

#   This script reads a username and password from the command line,
#   then compares it to entries in password.dat.  You will want to use
#   this technique in your script that validates user logins.
#   The salt value is not needed as it is extracted from the encrypted
#   block.  You do not need to encrypt the password entered by the user
#   as this will be done by the check_password function.
#   
#   CS545, Fall 2013
#   Alan Riggins

use Crypt::Password;

my $salt = "LaPremier025";
my ($user, $password, $OK, $stored_user, $stored_pass, $line);
my @file_lines;

open INFILE, "</srv/www/cgi-bin/jadrn000/authentication/passwords.dat" or die "Cannot open file.";
@file_lines = <INFILE>;
close INFILE;

print "Enter your username: ";
$user = <STDIN>;
chomp $user;
print "Enter your password: ";
$password = <STDIN>;
chomp $password;

$OK = 0; #not authorized

foreach $line (@file_lines) {
    chomp $line;
    ($stored_user, $stored_pass) = split /=/, $line;    
    if($stored_user eq $user && check_password($stored_pass, $password)) {
        $OK = 1;
        last;
        }
    }
    
print "Content-type:  text/html\n\n";
print "<html><body>";
if($OK) {
    print "OK, you are authorized.\n";
    }
else {
    print "ERROR, unauthorized user.\n";
    }

    

