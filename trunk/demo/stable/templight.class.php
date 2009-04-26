<?php #charset utf-8

/**
A simple but powerfull php class for generating text

@author Bieler Batiste
@version 1.0.1
@company http://dosimple.ch

Copyright (C) 2006  Bieler Batiste

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

// TODO
// cache system

class TempLight{

function TempLight($file)
{
    $this->file = $file;
    // syntay definition
    $this->sa['startOrphan'] = '<';
    $this->sa['endOrphan'] = '/>';
    $this->sa['endBlockHeader'] = '</';
    $this->sa['startBlockHeader'] = '<';
    $this->sa['endBlockHeader'] = '</';
    $this->sa['endBlock'] = '>';
    $this->sa['path'] = ' path="(.*?)"';
    $this->sa['name'] = ' name="{id}"';
    $this->sa['test'] = ' test="(.*?)"';
    $this->sa['regex'] = ' name="{id}" regex="(.*?)"';
    $this->sa['index'] = ' index="{id}"';
    $this->sa['block'] = ' name="\w*"';
    // get the data with all ineritance and inclusion
    $this->model = $this->getTemplate($file);
    $this->compileConditions();
}

function getTemplate($file)
{
    if(file_exists($file))
    {
        $content = file_get_contents( $file );
        $this->compileInclusion($content);
        $this->compileInheritance($content);
        return $content;
    }
    else
    {
        trigger_error("TempLight: impossible to reach ressource '$file'", E_USER_ERROR);
    }
}

// get inclusions
function compileInclusion(&$content)
{
    $si = $this->sa['startOrphan'];
    $ei = $this->sa['path'].$this->sa['endOrphan'];
    $reg_expr='#'.$si.'include'.$ei.'#si';
    while(preg_match($reg_expr,$content,$matches))
    {
        $content = preg_replace('#'.$matches[0].'#si',
            $this->getTemplate($matches[1]),$content);
    }
}

// get inherited data
function compileInheritance(&$content)
{
    $dir = dirname($this->file);
    if($dir!="")
        $dir.='/';
    $tag = $this->sa['startOrphan'].'extends'.$this->sa['path'].$this->sa['endOrphan'];
    if(!preg_match($tag,$content,$matches))
        return;
    if($matches[1]==$this->file)
        trigger_error("TempLight: impossible inherit a template form itself in '".$this->file."'", E_USER_ERROR);
    $fatherContent = $this->getTemplate($dir.$matches[1]);
    $sb = $this->sa['startBlockHeader'].'block'.$this->sa['block'].$this->sa['endBlock'];
    $eb = $this->sa['endBlockHeader'].'block'.$this->sa['endBlock'];
    while(preg_match('#('.$sb.').*?'.$eb.'#s',$fatherContent, $matches))
    {
        preg_match('#'.$matches[1].'(.*?)'.$eb.'#s',$content, $contentMatches);
        if(!array_key_exists(1, $contentMatches)) {
        	$contentMatches[1] = '';	
        }
	    $fatherContent = preg_replace('#'.$matches[1].'.*?'.$eb.'#s',$contentMatches[1], $fatherContent);
    }
    //echo $fatherContent;
    $content = $fatherContent;
}

// identify conditions blocks with a number.
// a stack of number is used in this purpose
function compileConditions()
{
    $i=0; // conditions blocks counter
    $a=array(); // the number stack
    
    // the start strings to get in the template
    $all = $this->sa['startBlockHeader'].'if|'.$this->sa['startOrphan'].'elseif'
        .'|'.$this->sa['startOrphan'].'else'.'|'.$this->sa['endBlockHeader'].'if';
    
    while(preg_match('#('.$all.')([^0-9i])#si',$this->model,$matches))
    {
        if($matches[1]==$this->sa['startBlockHeader'].'if')
        {
            $i++;
            array_push($a,$i);
        }
        
        if(count($a)==0)
            trigger_error ( "TempLight: unexpected condition close statement (number $i) in ".$this->file, E_USER_ERROR );
        
        $this->model = preg_replace('#'.$matches[0].'#si', $matches[1].$a[count($a)-1].$matches[2], $this->model, 1);
    
        if($matches[1]==$this->sa['endBlockHeader'].'if')
        {
            array_pop($a);
        }
    }
    if( count($a)>0 )
        trigger_error ( 'TempLight: unexpected open condition statement in '.$this->file, E_USER_ERROR );
}

// compile the array in a Tree of node
function makeObjectFromArray(&$arrays)
{
    $root=new Node();
    $this->_makeObjectFromRecursiveArray($root,$arrays);
    return $root;
}

function _makeObjectFromRecursiveArray(&$currentNode,&$arrays)
{
    //print_r($arrays);
    $i=0;
    foreach($arrays as $key => $value)
    {
        if(is_array($value))
        {
            $i++;
            $child = new Node();
            $child->index=$i;
            $child->parentNode=$currentNode;
            $currentNode->children[]=$child;
            $this->_makeObjectFromRecursiveArray($child,$value);
        }
        else
        {
            $currentNode->fields[$key]=$value;
        }
    }
}

// simple variable replacement
function replace($variableName, $value)
{
    $this->_replace($variableName, $value, $this->model);
}

// internal variable replacement
function _replace($variableName, $value, &$content)
{
    $this->_varReplace($variableName, $value, $content);
    $this->_regexvarReplace($variableName, $value, $content);
}

function _varReplace($variableName, $value, &$content)
{
    $vp = preg_replace('#{id}#si',$variableName, $this->sa['name']);
    $sv = $this->sa['startOrphan'].'var';
    $ev = $this->sa['endOrphan'];
    $content = preg_replace('#'.$sv.$vp.$ev.'#si', $value, $content );
}

function _regexvarReplace($variableName, $value, &$content)
{
    $rxvp = preg_replace('#{id}#si',$variableName, $this->sa['regex']);
    $sv = $this->sa['startBlockHeader'].'regexvar'.$rxvp.$this->sa['endBlock'];
    $ev = $this->sa['endBlockHeader'].'regexvar'.$this->sa['endBlock'];
    while(preg_match('#'.$sv.'(.*?)'.$ev.'#s', $content, $matches))
    {
        $valueBuffer = $value;
        $varContentBuffer = "";
        $j=0;
        while(preg_match('#'.$matches[1].'#s',$valueBuffer, $regex) && $j<5)
        {
            $varContent = $this->solveAlternative($matches[2],$this->makeObjectFromArray($regex));
            // replace regex
            for($i=0;$i<count($regex);$i++)
            {
                $index = preg_replace('#{id}#',$i,$this->sa['index']);
                $varContent = preg_replace('#'.$this->sa['startOrphan'].'regex'
                .$index.$this->sa['endOrphan'].'#s',$regex[$i], $varContent);
            }
            // reduce the value
            $valueBuffer = preg_replace('#'.$matches[1].'#s','', $valueBuffer, 1);
            $varContentBuffer .= $varContent;
            $j++;
        }
        $escaped_varcontent = preg_replace("#\(#","\(",$matches[2]);
        $escaped_varcontent = preg_replace("#\)#","\)",$escaped_varcontent);
        $content = preg_replace('#'.$sv.$escaped_varcontent.$ev.'#s',$varContentBuffer, $content);
    }
}

// iterative remplacement 
function iterateReplace($iterateName, &$contentsArray)
{
    $root = $this->makeObjectFromArray($contentsArray);
    $this->_iterateReplace($iterateName, $root );
}

// internal iterative remplacement used by recursive and iterative functions
function _iterateReplace($iterateName, &$currentNode)
{
    $lp = preg_replace('#{id}#si',$iterateName, $this->sa['name']);
    $beginLoop=$this->sa['startBlockHeader'].'loop'.$lp.$this->sa['endBlock'];
    $endLoop=$this->sa['endBlockHeader'].'loop'.$this->sa['endBlock'];
    if(preg_match("#$beginLoop(.*)$endLoop#si", $this->model, $matches))
    {
        $iterateContent = $matches[1];
        $result='';
        foreach($currentNode->children as $child)
        {
            $iterateContentBuffer = $this->solveAlternative($iterateContent, $child);
            foreach($child->fields as $tag=>$value)
            {
                $this->_replace($tag, $value, $iterateContentBuffer);
            }
            $result.=$iterateContentBuffer;
        }
        $this->model = preg_replace("#$beginLoop.*$endLoop#si", $result, $this->model);
    }
    else
    {
        trigger_error("TempLight: loop '$iterateName' not found in file ".$this->file, E_USER_ERROR);
    }
}

// search conditions and evaluate
// the current context that is given by a node
function solveAlternative($contents, &$currentNode)
{
    // TODO : optimize that
    // we are searching conditionnal blocs
    $sbh = $this->sa['startBlockHeader'].'if';// start block header
    $sbf = $this->sa['test'].$this->sa['endBlock']; // start block footer
    $ebh = $this->sa['endBlockHeader'].'if'; // end block header
    $ebf = $this->sa['endBlock']; // end block footer
    $reg_expr='#('.$sbh.'([0-9]*)'.$sbf.')(.*?)'.$ebh.'[0-9]*'.$ebf.'#si';

    while(preg_match($reg_expr,$contents,$matches))
    {
        $testIf = $matches[3];
        $nb=$matches[2];
        $alternativeContent = $matches[4];
        $reg_expr2='#'.$sbh.$nb.$sbf.'.*?'.$ebh.$nb.$ebf.'#sie';
        $contents = preg_replace($reg_expr2,
        "\$this->_replaceAlternative(\$testIf,\$nb,\$alternativeContent,\$currentNode)", $contents );
    }
    return $contents;
}
    
// replace the conditions
function _replaceAlternative($testIf, $nb, $content, &$currentNode)
{
    $elseIf = $this->sa['startOrphan'].'elseif'.$nb.$this->sa['test'].$this->sa['endOrphan'];
    $else = $this->sa['startOrphan'].'else'.$nb.$this->sa['endOrphan'];
    // split content between elseIf and else
    $contents = preg_split('#('.$elseIf.'|'.$else.')#si', $content, -1, PREG_SPLIT_NO_EMPTY);
    if($this->_solveTest($testIf,$currentNode))
        return $contents[0];
    // extract the test form elseIf
    preg_match_all('#'.$elseIf.'#si', $content, $tests, PREG_SET_ORDER);
    // test loop
    for($i=1;$i<count($contents);$i++)
    {
        $c = $contents[$i];
        // condition exists ?
        if(isset($tests[$i]))
        {
            if($this->_solveTest($tests[$i][1],$currentNode))
                return $c;
        }
        else
            return $c;
        // next condition
        $i++;
    }
}

// a little expression parser to avoid security issues eval
function _solveTest($test,&$currentNode)
{
    // the test must begin by node
    if(preg_match("#^node(\.\w.*?\))(==|>=|<=|>|<|!=)(.*)#",$test,$matches)==0)
    {
        // lazy expression disabled
        /*if(preg_match("#^node\.(\w*)\((.*?)\)#s",$test,$matches)==0)*/
            trigger_error("TempLight: condition expression '".$test."' is not valid", E_USER_ERROR);
    }
    
    $functions = $matches[1];
    $leftValue = $currentNode;
    $i=0;
    $reg_expr = '#^\.([a-z]{1,})\((.*?)\)#s';
    while(preg_match($reg_expr,$functions,$func))
    {
        if(!method_exists($leftValue,$func[1]))
            trigger_error("TempLight: function '".$func[1]."' does not exists", E_USER_ERROR);
        if($func[2]=='')
            $leftValue = $leftValue->{$func[1]}();
        else
            $leftValue = $leftValue->{$func[1]}($func[2]);

        $functions = preg_replace($reg_expr, '', $functions, 1);
        $i++;
    }
    
    $rightValue = &$matches[3];
    switch ($matches[2])
    {
        case '':
            return $leftValue;
        case '==':
            return $leftValue == $rightValue;
        case '!=':
            return $leftValue != $rightValue;
        case '>':
            return $leftValue > $rightValue;
        case '<':
            return $leftValue < $rightValue;
        case '>=':
            return $leftValue >= $rightValue;
        case '<=':
            return $leftValue <= $rightValue;
    }

}
    
// Recursive replace
function recursiveReplace($tagName, &$contentsArray)
{
    $root = $this->makeObjectFromArray($contentsArray);
    $rp = preg_replace('#{id}#si',$tagName, $this->sa['name']);
    $beginRecursion = $this->sa['startBlockHeader'].'recursion'.$rp.$this->sa['endBlock'];
    $endRecursion = $this->sa['endBlockHeader'].'recursion'.$this->sa['endBlock'];
    
    $reg_expr='#'.$beginRecursion.'(.*?)'.$endRecursion.'#sie';
    
    if(preg_match($reg_expr, $this->model, $matches)==0)
        trigger_error("TempLight: recursion '$tagName' not found in file ".$this->file, E_USER_ERROR);
    $recursiveContent = $matches[1];
    // the content of the recursivity is extracted and passed to recursiveLoop;
    $this->model = preg_replace($reg_expr, "\$this->recursiveLoop(\$recursiveContent,\$root)", $this->model );
}

function recursiveLoop($recursiveContent, &$currentNode)
{
    $loopContentArray=array();
    $beginLoop = $this->sa['startBlockHeader'].'loop'.$this->sa['endBlock'];
    $endLoop = $this->sa['endBlockHeader'].'loop'.$this->sa['endBlock'];
    $reg_expr='#'.$beginLoop.'(.*?)'.$endLoop.'#si';
    $i=0;
    $recursiveContentBuffer=$recursiveContent;
    // at each level of recursion, there could be multiple loops
    // each loop is saved in an array to avoid to solve conditions that must not be
    while(preg_match($reg_expr, $recursiveContentBuffer, $matches))
    {
        array_push($loopContentArray,$matches[1]);
        $recursiveContentBuffer = preg_replace($reg_expr, $this->sa['startOrphan'].'savedLoop'.$i.$this->sa['endOrphan'], $recursiveContentBuffer, 1);
        $i++;
    }
    
    // solve conditions surrounding the loops
    $recursiveContentBuffer = $this->solveAlternative($recursiveContentBuffer, $currentNode);
    // now there must be only one loop remaining
    preg_match('#'.$this->sa['startOrphan'].'savedLoop([0-9]*)'.$this->sa['endOrphan'].'#si',$recursiveContentBuffer, $matches);
    $iterateContent = $loopContentArray[$matches[1]];
    
    $loopResult='';
    
    foreach($currentNode->children as $child)
    {
        // solve conditions of the loop
        $iterateContentBuffer=$this->solveAlternative($iterateContent, $child);
        
        foreach($child->fields as $tag=>$value)
        {
            $this->_replace( $tag, $value, $iterateContentBuffer );
        }
        // lauch recursion
        if($child->nbChildren()>0)
        {
            $iterateContentBuffer = preg_replace('#'.$this->sa['startOrphan'].'recursion'.$this->sa['endOrphan'].'#si',
                $this->recursiveLoop($recursiveContent, $child), $iterateContentBuffer);
        }
        else
        {
            $iterateContentBuffer = preg_replace('#'.$this->sa['startOrphan'].'recursion'.$this->sa['endOrphan'].'#si',
                '', $iterateContentBuffer);
        }
        /*$iterateContentBuffer = preg_replace('#'.$this->sa['startBlockHeader'].$this->sa['rn'].$this->sa['endOrphan'].'#si', '', $iterateContentBuffer);*/
        
        $loopResult.=$iterateContentBuffer;
    }
    // finaly the loop in the recursive content is replaced by the result
    return preg_replace('#'.$this->sa['startOrphan'].'savedLoop[0-9]*'.$this->sa['endOrphan'].'#si', $loopResult, $recursiveContentBuffer );
}
    
function setContext( $contextArray )
{
    $this->contextArray=array_merge($this->contextArray,$contextArray);
}

function toString( $final=true )
{
    return $this->model;
}
    
}

class Node
{
    function Node()
    {
        $this->fields=array();
        $this->index=false;
        $this->parentNode=false;
        $this->children=array();
    }
    
    function field($key)
    {
        if(isset($this->fields[$key]))
            return $this->fields[$key];
        else
            return false;
    }
    
    function level($i=1)
    {
        if($this->parentNode!=false)
        {
            $i++;
            return $this->parentNode->level($i);
        }
        return $i;
    }

    function parent()
    {
        return $this->parentNode;
    }
    
    function nbBrother()
    {
        return $this->parentNode->nbChildren();
    }
    
    function nbChildren()
    {
        return count($this->children);
    }
    
    function brother($index)
    {
        $i=$index+$this->index-1;
        while($i<0)
            $i+=$this->nbBrother();
        while($i>$this->nbBrother()-1)
            $i-=$this->nbBrother();
        $p = $this->parentNode();
        $c = $p->child($i);
        return $c;
    }
    
    function isFirst()
    {
        return $this->index==1;
    }
    
    function isLast()
    {
        return $this->index==$this->nbBrother();
    }
    
    function index()
    {
        return $this->index;
    }
    
    function isMultipleOf($nb)
    {
        return $this->index%$nb==0;
    }
    
    function child($index)
    {
        return $this->children[$index];
    }
}

?>
