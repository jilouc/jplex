<?php
error_reporting(0);
header('Content-type:text/html; charset=utf-8');

define('COMPONENTS_DIR', 'components');
define('TEMPLATES_DIR', 'tpl');

require_once('./templight.class.php');
require_once('./component.class.php');

$matches = array();
$frelease = '';



if(preg_match('#[a-z|\-]{1,}#', $_GET['p'], $matches)) {
	$page = TEMPLATES_DIR.'/'.$matches[0].'.tpl';
	if(!file_exists($page)) {
		die('Error while generating API page.');	
	}
	$xmlFile = COMPONENTS_DIR.'/'.$matches[0].'.xml';
	if(!file_exists($xmlFile)) {
		die("Error, the XML file of the component could not be loaded.");
	}
} else {
    die('Error while generating API Page.');
}

$tpl = new TempLight($page);
$component = new Component($xmlFile);

echo $component->output();
