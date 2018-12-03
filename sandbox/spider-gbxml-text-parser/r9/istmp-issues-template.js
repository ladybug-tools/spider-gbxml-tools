// Copyright 2018 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */


const ISTMP = { "release": "R9.0", "date": "2018-12-02" };


ISTMP.currentStatus =
	`
		<aside>

			<details>

				<summary>ISTMP ${ ISTMP.release} status ${ ISTMP.date }</summary>

				<p>This module is ready for light testing.</p>

			</details>

		</aside>

		<hr>
	`;



ISTMP.getMenuTemplate = function( target ) {

	const htm =

	`<details id="ISTMPdetTemplate" ontoggle=ISTMP.getTemplateCheck(); >

		<summary>Template<span id="ISTMPspnCount" ></span></summary>

		<p>
			template template text
		</p>

		<p>
			<button id=butTemplate
				onclick=ISTMP.setSurfaceArrayShowHide(butDuplicateCoordinates,ISTMP.duplicates); >
				template
			</button>
		</p>

		<p>
			<select id=ISTMPselDuplicate onchange=ISTMP.selectedSurfaceFocus(); style=width:100%; size=10>
			</select>
		</p>


		<div id=divDuplicateAttributes ></div>
		<p>
			<button onclick=ISTMP.selectedSurfaceDelete(); title="Starting to work!" >
				template
			</button>
		</p>

		<div>${ ISTMP.currentStatus }</div>

	</details>`;

	return htm;

};


ISTMP.getTemplateCheck = function() {


	console.log( 'ISTMPdetTemplate.open', ISTMPdetTemplate.open );


};