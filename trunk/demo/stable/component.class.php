<?php
class Component {
	public $name = "";
	public $path = "";
	public $overview = "";
	public $releases = array();
	public $usage = "";
	public $configs = array();
	public $events = array();
	public $examples = array();
	
	public static function highlightJS($s) {
		$res = preg_replace("/<script(.*?)>(.*?)<\/script>/si", "<pre><code class=\"javascript\">\\2</code></pre>", $s);
		$res = preg_replace("/``(.*?)``/si", "<pre><code class=\"javascript\">\\1</code></pre>", $res);
		$res = preg_replace("/`(.*?)`/si", "<code class=\"javascript\">\\1</code>", $res);
		return trim($res);
	}
	public static function highlightHTML($s) {
		$res = preg_replace("/<HTML>(.*?)<\/HTML>/esi", "'<pre><code class=\"html\">'.stripslashes(htmlentities('\\1')).'</code></pre>'", $s);
		return trim($res);
	}
	
	public static function highlight($s) {
		return self::highlightHTML(self::highlightJS($s));
	}
	
	function __construct($xmlfile) {
		$xml = simplexml_load_file($xmlfile, "SimpleXmlElement", LIBXML_NOCDATA);
		$this->name = (string)$xml->attributes()->name;
		$this->path = (string)$xml->attributes()->path;
		
		$this->overview = $xml->overview;
		foreach($xml->releases->rls as $release) {
			$this->addRelease($release);
		}
		$this->usage = $xml->usage;
		foreach($xml->configuration->param as $param) {
			$this->addConfig($param);
		}
		foreach($xml->events->event as $event) {
			$this->addEvent($event);
		}
		foreach($xml->examples->example as $example) {
			$this->addExample($example);
		}
		
	}
	
	function addRelease(&$node) {
		$release = array(
			"name" => (string)$node->attributes()->name,
			"features" => array()
		);

		foreach($node->feature as $feature) {
			array_push($release["features"], $feature);
		}
		array_push($this->releases, $release);
	}
	
	function addConfig(&$node) {
		$param = array(
			"name" => (string)$node->attributes()->name,
			"default" => (string)$node->attributes()->default,
			"description" => trim((string)$node)
		);
		array_push($this->configs, $param);
	}
	
	function addEvent(&$node) {
		$event = array(
			"name" => (string)$node->attributes()->name,
			"description" => $node->description,
			"params" => array()
		);
		
		foreach($node->params->param as $param) {
			array_push($event["params"], array(
				"name" => (string)$param->attributes()->name,
				"type" => (string)$param->attributes()->type,
				"description" => (string)$param	
			));
		}
		array_push($this->events, $event);	
	}
	
	function addExample(&$node) {
		$example = array(
			"title" => (string)$node->attributes()->title,
			"html" => "",
			"js" => ""
		);
		$f = COMPONENTS_DIR.'/examples/'.(string)$node->attributes()->html;
		if(!file_exists($f)) {
			return;
		}
		$example["html"] = file_get_contents($f);
		
		$f = COMPONENTS_DIR.'/examples/'.(string)$node->attributes()->js;
		if(!file_exists($f)) {
			return;
		}
		$example["js"] = "\nfunction() {\n".file_get_contents($f)."\n}";
		array_push($this->examples, $example);
	}
	
	
	function output() {
		global $tpl;
		
		$res = $tpl->toString();
			
		$releases = '';
		foreach($this->releases as $rlz) {
			$releases .= '<dl>';
			$releases .= '<dd>'.$rlz["name"].'</dd>';
			$releases .= '<ul>';
			foreach($rlz["features"] as $f) {
				$releases .= '<li>'.self::highlight($f).'</li>';
			}
			$releases .= '</ul>';
			$releases .= '</dl>';
		}
		
		$configs = '<table class="config" cellpadding="0" cellspacing="0"><thead><tr>';
        $configs .= '<th>Name</th>';
        $configs .= '<th>Default value</th>';
        $configs .= '<th>Details</th>';
        $configs .= '</tr></thead><tbody style="display:none">';
        foreach($this->configs as $cfg) {
			$configs .= '<tr><td class="param">'.$cfg["name"].'</td>';
            $configs .= '<td><code class="javascript">'.$cfg["default"].'</code></td>';
            $configs .= '<td>'.self::highlightJS($cfg["description"]).'</td></tr>';
        }
        $configs .= '</tbody></table>';
		
		$events = '<table class="events" cellpadding="0" cellspacing="0"><thead><tr>';
        $events .= '<th>Name</th>';
        $events .= '<th>Parameters</th>';
        $events .= '<th>Description</th>';
        $events .= '</tr></thead><tbody style="display:none">';
        foreach($this->events as $evt) {
			$events .= '<tr><td class="param">'.$evt["name"].'</td>';
            $events .= '<td>';
            if(count($evt["params"]) == 0) {
            	$events .= '<div style="text-align:center"><em>No parameter</em></div>';
            } elseif(count($evt["params"]) == 1) {
            	$events .= '<code class="javascript">('.$evt["params"][0]["type"].') '.$evt["params"][0]["name"].'</code>';	
            } else {
            	$events .= '<ul>';
            	foreach($evt["params"] as $par) {
            		$events .= '<li><code class="javascript">('.$par["type"].') '.$par["name"].'</code><br/>'.$par['description'].'</li>';	
            	}
            	$events .= '</ul>';
            }
            $events .= '</td><td>'.self::highlightJS($evt["description"]).'</td>';
        }
        $events .= '</tbody></table>';
        
        $examples = '<ol id="examples">';
		$runners = '';
        $i = 1;
        foreach($this->examples as $ex) {
			$examples .= '<li>'.$ex['title'].'</li>';
			$examples .= '<div class="example" id="ex'.$i.'">'.self::highlight($ex['html']).'</div>';
			$runners .= ",\n".$ex["js"];
			$i++;
        }
        if(!empty($runners)) {
        	$runners = substr($runners, 2);
        }
		
		$res = str_replace('<!--%Overview%-->', self::highlight($this->overview), $res);
		$res = str_replace('<!--%Releases%-->', $releases, $res);
		$res = str_replace('<!--%Usage%-->', self::highlight($this->usage), $res);
		$res = str_replace('<!--%Configs%-->', $configs, $res);
		$res = str_replace('<!--%Events%-->', $events, $res);
		$res = str_replace('<!--%Examples%-->', $examples, $res);
		$res = str_replace('/***JSPath***/', $this->path, $res);
		$res = str_replace('/***JSRunners***/', $runners, $res);
		
		
			
		return $res;
	}
}
