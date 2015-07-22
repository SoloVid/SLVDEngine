find codeBase files -name '*.js' > fileList
find codeBase -name 'test.js' > testFile

perl -ne 'm/SLVDEngine\.(\w+) = / and print "$1\n"' $(cat fileList) | sort -u > varList

cat fileList | while read file; do
	perl rename1.pl varList "$file"
done
