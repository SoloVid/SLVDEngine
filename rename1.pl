#!/usr/local/bin/perl

open VARS, shift;

@vars = <VARS>;
local $/;
$_ = <>;

$/ = "\n";

#print "";

for $var (@vars) {
	chomp $var;
	print "|$var|\n";
	s/\b(?!SLVDEngine\.)$var\b/SLVDEngine.$var/g;
}

print;