#!/usr/bin/env python
import os, re, string, logging, logging.config
import const
from htmlentitydefs import entitydefs
from cStringIO import StringIO 
from optparse import OptionParser
from pygments import highlight
from pygments.lexers import JavascriptLexer
from pygments.formatters import HtmlFormatter

try:
    logging.config.fileConfig(os.path.join(sys.path[0], const.LOGCONFIG))
except:
    pass

log = logging.getLogger('yuidoc.highlight')

entitydefs_inverted = {}
for k,v in entitydefs.items():
   entitydefs_inverted[v] = k
_badchars_regex = re.compile('|'.join(entitydefs.values()))
_been_fixed_regex = re.compile('&\w+;|&#[0-9]+;')

def html_entity_fixer(text, skipchars=[], extra_careful=0):
   # if extra_careful we don't attempt to do anything to
   # the string if it might have been converted already.
   if extra_careful and _been_fixed_regex.findall(text):
       return text
   if type(skipchars) == type('s'):
      skipchars = [skipchars]

   keyholder= {}
   for x in _badchars_regex.findall(text):
       if x not in skipchars:
           keyholder[x] = 1
   #text = text.replace('&','&amp;')
   text = text.replace('\x80', '&#8364;')
   for each in keyholder.keys():
       if each == '&':
           continue

       better = entitydefs_inverted[each]
       if not better.startswith('&#'):
           better = '&%s;'%entitydefs_inverted[each]

       text = text.replace(each, better)
   return text 
    
class DocHighlighter(object):

    def __init__(self, inputdirs, outputdir, ext, newext):

        def _mkdir(newdir):
            if os.path.isdir(newdir): pass
            elif os.path.isfile(newdir):
                raise OSError("a file with the same name as the desired " \
                              "dir, '%s', already exists." % newdir)
            else:
                head, tail = os.path.split(newdir)
                if head and not os.path.isdir(head): _mkdir(head)
                if tail: os.mkdir(newdir)

        def highlightString(src):
            try:
                return highlight(src, JavascriptLexer(), HtmlFormatter())
            except: 
                return "File could not be highlighted"

        def highlightFile(path, file):
            f=open(os.path.join(path, file))
            fileStr=StringIO(f.read()).getvalue()
            f.close()
            log.info("highlighting " + file)

            highlighted = highlightString(fileStr)
			
            out = open(os.path.join(self.outputdir, file + self.newext), "w")
            out.writelines(html_entity_fixer( unicode(highlighted.encode('iso-8859-1'),'utf-8').encode('latin1'), ['<','>','\'','\"']))
            out.close()

        def highlightDir(path):
            subdirs = []
            dircontent = ""
            for i in os.listdir(path):
                fullname = os.path.join(path, i)
                if os.path.isdir(fullname):
                    subdirs.append(fullname)
                elif i.lower().endswith(self.ext):
                    highlightFile(path, i)

            for i in subdirs:
                highlightDir(i)

        self.inputdirs = inputdirs
        self.outputdir = os.path.abspath(outputdir)
        _mkdir(self.outputdir)
        self.ext = ext
        self.newext = newext

        log.info("-------------------------------------------------------")

        for i in inputdirs: 
            highlightDir(os.path.abspath(i))


def main():
    optparser = OptionParser("usage: %prog [options] inputdir1 inputdir2 etc")
    optparser.set_defaults(outputdir="out", ext=".js", newext=".highlighted")
    optparser.add_option( "-o", "--outputdir",
                          action="store", dest="outputdir", type="string",
                          help="Directory to write the parser results" )
    optparser.add_option( "-e", "--extension",
                          action="store", dest="ext", type="string",
                          help="The extension for the files that should be parsed" )
    optparser.add_option( "-n", "--newextension",
                          action="store", dest="newext", type="string",
                          help="The extension to append to the output file" )
    (opts, inputdirs) = optparser.parse_args()
    if len(inputdirs) > 0:
        docparser = DocHighlighter( inputdirs, 
                            opts.outputdir, 
                            opts.ext,
                            opts.newext )
    else:
        optparser.error("Incorrect number of arguments")
           
if __name__ == '__main__':
    main()
