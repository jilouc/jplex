#!/bin/sh

release=Pangolin

# The location of your yuidoc install
yuidoc_home=tools/yuidoc

# The location of the files to parse.  Parses subdirectories, but will fail if
# there are duplicate file names in these directories.  You can specify multiple
# source trees:
#     parser_in="%HOME/www/yahoo.dev/src/js %HOME/www/Event.dev/src"
parser_in="../src"

# The location to output the parser data.  This output is a file containing a 
# json string, and copies of the parsed files.
parser_out=parse

# The directory to put the html file outputted by the generator
generator_out=tmpdocs

# The location of the template files.  Any subdirectories here will be copied
# verbatim to the destination directory.
template=$yuidoc_home/template

##############################################################################
# add -s to the end of the line to show items marked private
rm -rf ${generator_out}
echo Compiling docs...
$yuidoc_home/bin/yuidoc.py $parser_in -p $parser_out -o $generator_out -t $template -m $release -s

rm -rf $parser_out
rm -rf ${generator_out}/.svn ${generator_out}/assets/.svn

out=docs
rm -rf $out
mkdir $out
cd $generator_out

for i in `ls | grep ^jplex`; do
   name=`echo $i | sed 's/jplex//g' | sed 's/html//g' | sed 's/\.//g'`
   cp $i ../$out/API$release$name.wiki 
done                               
cp jPlex.html ../$out/API${release}jPlex.wiki 

for i in `ls | grep ^module`; do
   name=`echo $i | sed 's/^module_//g' | sed 's/.html//g' | sed -E 's/^\([[:alpha:]]\)/\U\0/g'`
   cp $i ../$out/API$release${name}Index.wiki 
done

cp index.html ../$out/API${release}Index.wiki