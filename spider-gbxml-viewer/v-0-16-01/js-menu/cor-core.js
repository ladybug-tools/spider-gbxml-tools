/* globals FOB, MNU, POP */
// jshint esversion: 6
// jshint loopfunc: true

const COR = {
	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-06-28",
		"description": "core - contains local overrides",
		"helpFile": "cor-core/README.md",
		"version": "0.16.01-2cor",
	}
};

POP.date = MNU.date = "2019-06-28";
POP.version = MNU.version = "0.16.01-8"; //document.head.querySelector( '[ name=version ]' ).content || "";

//THM.themeUrlStorage = 'spider-gbxml-menu-theme-url';// set for each instance in HTML file
//THM.cssBasic = "https://pushme-pullyou.github.io/tootoo14/js-14-03/style.css";

//FOB.urlDefaultFile = "../README.md";
FOB.urlDefaultFile = "https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-broken.xml";
//FOB.urlDefaultFile = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/coventry-university-of-warwick-small.zip";
//FOB.urlDefaultFile = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/annapolis-md-single-family-residential-2016.xml"
//FOB.urlDefaultFile = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/pittsburg-airport.zip";
//FOB.urlDefaultFile = "https://cdn.jsdelivr.net/gh/GreenBuildingXML/Sample-gbXML-Files@master/gbXML_TRK.xml";

// For main menu header
MNU.urlSourceCode = `https://github.com/pushme-pullyou/tootoo14/tree/master/js-14-03/`;

MNU.title = document.title;


MNU.helpFile = "../../README.md";

//MNU.description = document.head.querySelector( '[ name=description ]' ).content;
//MNU.description = `Tools to help you find, load, examine and edit gbXML files - in large numbers and size`;
MNU.description =
	`
		Mission: run a series of basics checks on <a href="https://gbXML.org" target="_blank">gbXML</a> files to identify, report and help you fix any errors
	`;

MNU.urlSourceCode = "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/";

MNU.homeText = "<img src = 'https://ladybug.tools/artwork/icons_bugs/ico/ladybug.ico' height=24 >";
MNU.homeTitle= "Ladybug Tools: free computer applications that support environmental design and education";
MNU.homeUrl  = "https://www.ladybug.tools";

MNU.repoText ="<img src = 'https://ladybug.tools/artwork/icons_bugs/ico/spider.ico' height=24 >";
MNU.repoTitle="Spider: 3D interactive analysis in your browser mostly written around the Three.js JavaScript library";
MNU.repoUrl  ="https://www.ladybug.tools/spider/";

MNU.appText  = "gbXML Tools";
MNU.appTitle = "Tools to help you find, load, examine and edit gbXML files - in large numbers and sizes";
MNU.appUrl   = "https://www.ladybug.tools/spider-gbxml-tools/";

MNU.footerPopupUrl = "https://www.ladybug.tools/spider/";
MNU.footerTarget = "target=_blank";
MNU.footerIssues = "https://github.com/ladybug-tools/spider-gbxml-fixer/issues";


COR.init = function() {

	COR.css = document.body.appendChild( document.createElement('style') );
	COR.css.innerHTML =
		`
		#POPdivFooter { color: #f00; }

		body { margin: 0; padding: 0; overflow: hidden; }

		#divContents { border: 0px solid red; height: 100%; max-width: 100%; }

		#navPanel { background-color: #eee; }

		#navPopup { left: auto; max-width: 25%; right: 1rem; top: 1rem; }



		#VSTdivSurfaceType button  { background-color: #ddd; border: 2px solid white; color: white; cursor: pointer;
			padding: 2px 5px; min-width: 13.5rem; }

		#VSTdivSurfaceType button:hover { background: #ccc; color: #888 }

		button.active { border-color: black; font-style: italic; font-weight: bold; margin-left: 0.1rem;
			box-shadow: 2px 2px #888; }

		`;

};