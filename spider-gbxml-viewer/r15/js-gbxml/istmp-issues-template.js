// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopUpData */
/* jshint esversion: 6 */


const ISTMP = { "release": "R9.1", "date": "2018-12-05" };


ISTMP.currentStatus =
	`
		<aside>

			<details>

				<summary>ISTMP ${ ISTMP.release} status ${ ISTMP.date }</summary>

				<p>This module is ready for light testing.</p>

				<p>
					2018-12-06 ~ Adds ability to run in 'check all issues'. Simplified code a bit. passed through jsHint<br>
					2018-12-05 ~ Add more functions
				</p>

			</details>

		</aside>

		<hr>
	`;



ISTMP.getTemplateCheck = function() {
	//console.log( 'ISTMPdetTemplate.open', ISTMPdetTemplate.open );

	if ( ISTMPdetTemplate.open === false && ISCOR.runAll === false ) { return; }

	if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; }

	ISTMP.invalidTemplate = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		const surfaceId = surface.match( /id="(.*?)"/)[ 1 ];

		const invalidTemplate = GBX.surfaces.find( element => GBX.surfaceTypes.indexOf( surfaceId ) < 0 );
		//console.log( 'invalidTemplate', invalidTemplate );

		if ( invalidTemplate ) {

			ISTMP.invalidTemplate.push( i );

		}

	}

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of ISTMP.invalidTemplate ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;
	}

	ISTMPselTemplate.innerHTML = htmOptions;
	ISTMPspnCount.innerHTML = `: ${ ISTMP.invalidTemplate.length } found`;

	return ISTMP.invalidTemplate.length;

};



ISTMP.getMenuTemplate = function() {

	const htm =

	`<details id="ISTMPdetTemplate" ontoggle=ISTMP.getTemplateCheck(); >

		<summary>Template<span id="ISTMPspnCount" ></span></summary>

		<p>
			template template text
		</p>

		<p>
			<button onclick=ISTMP.setTemplateShowHide(this,ISTMP.invalidTemplate); >
				Show/hide template surfaces
			</button>
		</p>

		<p>
			<select id=ISTMPselTemplate onchange=ISTMP.selectedSurfaceFocus(this); style=width:100%; size=10 >
			</select>
		</p>

		<p>
			<button onclick=ISTMP.selectedSurfaceDelete(); title="Starting to work!" >
				template
			</button>
		</p>

		<div>${ ISTMP.currentStatus }</div>

	</details>`;

	return htm;

};



ISTMP.setTemplateShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	//THR.scene.remove( POP.line, POP.particle );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};



ISTMP.selectedSurfaceFocus = function( select ) {

	POP.intersected = GBX.surfaceGroup.children[ select.value ];

	POP.getIntersectedDataHtml();

	divPopUpData.innerHTML = POP.getIntersectedDataHtml();

};

