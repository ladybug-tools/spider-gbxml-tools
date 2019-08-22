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
		"version": "0.17.03-0tmp"

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

				<summary id=TMPsumSurfaces >Template</summary>

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
		<p><i>Template</i></p>

		<p><button onclick=TMP.updatePopupFooter() >new popup items</button></p>

		<p>${ new Date() }</p>

		<p>
lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit,
 sed quia non numquam eius modi
tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.
ut enim ad minima veniam,
quis nostrum exercitationem ullam corporis suscipit laboriosam,
nisi ut aliquid ex ea
commodi consequatur? quis autem vel eum iure reprehenderit,
qui in ea voluptate velit esse,
quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat,
quo voluptas nulla pariatur?
		</p>

		<p>
			Time to check:
			${ ( performance.now() - timeStart ).toLocaleString() } ms
		</p>

		<hr>

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
