/* globals FOB, MNU, POP */
// jshint esversion: 6
// jshint loopfunc: true

const COR = {
	"script": {
		"copyright": "Copyright 2019 Ladybug Tools authors",
		"date": "2019-09-06",
		"description": "core - contains local overrides",
		"helpFile": "cor-core/README.md",
		"license": "MIT License",
		"version": "0.17.03-1cor",
	}
};

THM.cssBasic = "https://pushme-pullyou.github.io/tootoo14/js-14-07/style.css";


POP.license = "https://www.ladybug.tools/spider/pages/license.md";

// For main menu header

MNU.helpFile = "../../README.md";

//MNU.description = document.head.querySelector( '[ name=description ]' ).content;
//MNU.description = `Tools to help you find, load, examine and edit gbXML files - in large numbers and size`;
MNU.description =
	`
		Mission: run a series of basic checks on <a href="http://gbXML.org" target="_blank">gbXML</a> files to identify, report and help you fix any issues.
	`;

MNU.urlSourceCode = "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-17-03/";

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

			details { margin: 0 0 0.5rem 0; }

			#divContents { height: 100%; max-width: 100%; }

			.sumMenuTitle { padding: 0 0.5rem; text-align: left }

		`;
};