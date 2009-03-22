#!/bin/sh

VERSION=`cat ../src/jPlex.js | grep version: | awk '{ print $2 }' | sed -e "s/[',]//g"`
REV=`svn info | grep sion | head -n 1 | (awk '{ print $NF; }')`
VERSION=$VERSION.$REV
SEPARATOR=":"
FINALFILE=jplex-$VERSION

if [ $1 = "win" ]; then
	SEPARATOR="\;"
fi         
                     
echo "Dist files:"  
echo "\tPrototype:\t1.6.0.3" 
echo "\tScriptaculous:\t1.8.1"
echo "\tjPlex:\t\t$VERSION"

echo "Output folder: \n\t$FINALFILE/"

cd tools/dist/src/
javac Main.java -classpath .$SEPARATOR../../yuicompressor-2.4.jar  

cd ../../../
mkdir $FINALFILE
if [ ! $? = 0 ]; then
    echo "This release has already been dist"
    exit 2;
fi

mkdir $FINALFILE/assets

java -classpath tools/yuicompressor-2.4.jar$SEPARATOR./tools/dist/src/ Main ../ $FINALFILE

if [ ! $? = 0 ]; then
    rm -rf $FINALFILE
fi

#Then copy the demo files
cp -r ../demo $FINALFILE/
for i in `find $FINALFILE/demo | grep '\.svn$'`; do
    rm -rf $i;
done;
for i in `find $FINALFILE/demo | grep '\.html$'`; do
    cat $i | sed -e 's/src\/jPlex\.js/jplex\.js/g' | sed -e 's/src\/.*ie7\.css/assets\/jplex-ie7\.css/g' | sed -e 's/src\/.*ie6\.css/assets\/jplex-ie6\.css/g' | sed -e 's/src\/.*\.css/assets\/jplex\.css/g'  > $i.tmp
    mv $i.tmp $i
done;