<?php

require_once('./templight.class.php');

$matches = array();

$frelease = '';

if(preg_match('#[a-z|\-]{1,}#',$_GET['p'],$matches)) {
	if(file_exists('tpl/'.$matches[0].'.tpl')) {
		if(file_exists('rls/'.$matches[0].'.xml')) {
			$frelease = 'rls/'.$matches[0].'.xml';
		}
	    $page = 'tpl/'.$matches[0].'.tpl';
	} else {
		
		$page = 'tpl/main.tpl';
	}
} else {
    $page = 'tpl/main.tpl';
}

$tpl = new TempLight($page);

$res = '';
if(!empty($frelease)) {
	$releases = simplexml_load_file($frelease);
	$rls = array();
	foreach($releases->rls as $r) {
		$res .= '<dl>';
		$att = $r->attributes();
		$res .= '<dd>'.(string)$att->name.'</dd>';
		$res .= '<ul>';
		foreach($r->feature as $f) {
			$res .= '<li>'.preg_replace('/`(.*?)`/si', "<code class=\"javascript\">\\1</code>", (string)$f).'</li>';
		}
		$res .= '</ul>';
		$res .= '</dl>';
	}
}

$output = $tpl->toString();
$output = preg_replace('/<!--%Releases%-->/si', $res, $output);

echo $output;

?>