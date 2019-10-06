/* eslint strict: ["error", "global"] */

"use strict";

/* globals performance, MNU, VGC, POP, navDragMove, divDragMoveContent */
// jshint esversion: 6
// jshint loopfunc: true


const TMP = {

	"script": {

		"copyright": "Copyright 2019 Ladybug Tools authors",
		"date": "2019-08-21",
		"description": "description",
		"helpFile": "js-templates/tmp-template.md",
		"license": "MIT License",
		"sourceCode": "js-templates/tmp-template.js",
		"version": "0.17.04-0tmp"

	}

};


TMP.getMenuTemplate = function () {

	const source =
	`
		<a href=${ MNU.urlSourceCode + TMP.script.sourceCode } target=_blank >
		${ MNU.urlSourceCodeIcon } source code</a>
	`;

	const help = VGC.getHelpButton(
		"TMPbutSum", TMP.script.helpFile, POP.footer, source );

	const htm =
		`
			<details ontoggle="TMPdivTmp1.innerHTML=TMP.getTemplate();" >

				<summary id=TMPsumSurfaces >Versions</summary>

				${ help }

				<div id=TMPdivTmp1 ></div>

			</details>

		`;

	return htm;

};


TMP.getTemplate = function () {

	const timeStart = performance.now();

	const htm =
	`
		<p><i>Use whatever version you like</i></p>

		<p>Ladybug Tools / Spider gbXML Viewer 'Maevia' v0.17:<br>
		<a href="https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer">
			Stable version
		</a>
		<a href="https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/dev/" >
			Development version
		</a>
	</p>
		<p>
			<a href="https://www.ladybug.tools/spider/gbxml-viewer/r14/gv-cor-core/gv-cor.html" target="_blank">
				Ladybug Tools / Spider gbXML Viewer 'Aragog' R14
			</a>
		</p>

		<p>
			<a href="https://www.ladybug.tools/spider/gbxml-viewer/" target="_blank">
				Ladybug Tools / Spider gbXML Viewer 'Aragog' R12
			</a>
		</p>

		<hr>

		<p>
			<a href="https://www.ladybug.tools/spider-gbxml-fixer/" target="_blank">
				Ladybug Tools / Spider gbXML Fixer 'Atrax' v0.05</a>
		</p>


	`;

	return htm;

};


TMP.updatePopupFooter = function () {

	navDragMove.hidden = false;

	const htm =
`
<p>
<button onclick=TMP.screen1(); style=background:#fdd;min-width:3rem; >
	one</button>
<button onclick=TMP.screen2(); style=background:#ddf;min-width:3rem;>
	two</button>
<button style=background:#dfd;min-width:3rem;>three</button>
</p>
`;

	divDragMoveContent.innerHTML = htm + divDragMoveContent.innerHTML;

};


TMP.screen1 = function () {

	divDragMoveContent.innerHTML =
	`
		<h2>screen 1</h2>
	`;

};


TMP.screen2 = function () {

	divDragMoveContent.innerHTML =
	`
		<h2>screen 2</h2>

		<img src=https://picsum.photos/320/240/?random  >

	`;

};
