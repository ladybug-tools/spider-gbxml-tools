/* globals FOB, MNU, POP */
// jshint esversion: 6
// jshint loopfunc: true

const COR = {
	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-07-18",
		"description": "core - contains local overrides",
		"helpFile": "cor-core/README.md",
		"version": "0.17.00-0cor",
	}
};

THM.cssBasic = "https://pushme-pullyou.github.io/tootoo14/js-14-05/style.css";

// For main menu header

MNU.helpFile = "../../README.md";

//MNU.description = document.head.querySelector( '[ name=description ]' ).content;
//MNU.description = `Tools to help you find, load, examine and edit gbXML files - in large numbers and size`;
MNU.description =
	`
		Mission: run a series of basics checks on <a href="https://gbXML.org" target="_blank">gbXML</a> files to identify, report and help you fix any errors
	`;

MNU.urlSourceCode = "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-17-00/";

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
MNU.footerIssues = "https://github.com/ladybug-tools/spider-gbxml-tools/issues";


COR.init = function() {

	COR.css = document.body.appendChild( document.createElement('style') );
	COR.css.innerHTML =
		`
			body { margin: 0; padding: 0; overflow: hidden; }

			#divContents { border: 0px solid red; height: 100%; max-width: 100%; overflow: hidden;}

			.sumMenuTitle { padding: 0 0.5rem; text-align: left }

			#navPanel { background-color: #eee; }

			#VSTdivSurfaceType button  { background-color: #ddd; border: 2px solid white; color: white; cursor: pointer;
				padding: 2px 5px; min-width: 13.5rem; }

			#VSTdivSurfaceType button:hover { background: #ccc; color: #888 }

		`;
};