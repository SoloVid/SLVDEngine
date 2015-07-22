find codeBase files -name '*.js' | while read file;do
    cat "$file" > tmpfile
    perl rename.pl tmpfile > "$file"
done
