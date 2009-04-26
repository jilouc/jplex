<?php

$files = array('datepicker', 'datatable', 'tooltip', 'menubar', 'frame', 'tabs');


foreach($files as $k=>$v) {
	echo "Generating static demo file for $v\n";
	$res = '';
	$_GET['p'] = $v;
	ob_start();
	require( './index.php' );
	$raw = ob_get_clean();
	$raw = preg_replace("/\?p=(.*?)([\"'])/si", "\\1.html\\2", $raw);
	$raw = str_replace("libs/jplex.js", "../../jplex.js", $raw);
	$raw = str_replace("libs/assets/", "../../assets/", $raw);
	$f = fopen("./static/$v.html", 'w+');
	fwrite($f, $raw);
	fclose($f);
}