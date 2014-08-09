#!/usr/bin/perl 

#
#	Shah, Harsh    Account:  jadrn025
#       CS645, Spring 2014
#       Project #1
#

use CGI;
use CGI::Carp qw (fatalsToBrowser);
use File::Basename;

## constants
$CGI::POST_MAX = 1024 * 3000; # Limit file size to 3MB
my $upload_dir = '/home/jadrn025/public_html/proj1/_uploadImageDIR_';
my $safe_filename_chars = "a-zA-Z0-9_.-";
##

my $q = new CGI;
my $filename = $q->param("image_data");
unless($filename) {
    die "There was a problem uploading the image; ".
        "it's probably too big.";
    }
    
my $mimetype = $q->uploadInfo($filename)->{'Content-Type'};

# check the mime type and if it is not an image, reject it.
if($mimetype !~ /image/) {
    die "Invalid mime type, $mimetype";
    }    
    
my ($name, $path, $extension) = fileparse($filename, '/..*/');
$filename = $name.$extension;
$filename =~ s/ //g; #remove any spaces
if($filename !~ /^([$safe_filename_chars]+)$/) {
    die "Sorry, invalid character in the filename.";
    }   

$filename = untaint($filename);

# get a handle on the uploaded image     
my $filehandle = $q->upload("image_data"); 

unless($filehandle) { die "Invalid handle"; }

# save the file
open (UPLOADFILE, ">$upload_dir/$filename") or die "Error, cannot save the file. $!";
binmode UPLOADFILE;

while(<$filehandle>) {
    if($_ =~ /\<\?php/) {
        die "Invalid file, php tag found!";
        }
    print UPLOADFILE $_;
    }
close UPLOADFILE;

sub untaint {
    if($filename =~ m/^(\w+)$/) { die "Tainted filename!"; }
    return $1;
    }


# Reference: /~jadrn000/cgi-bin/
