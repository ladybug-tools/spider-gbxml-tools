// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopUpData */
/* jshint esversion: 6 */


const ISTMP = { "release": "R15.0", "date": "2019-02-11" };

ISTMP.description =
	`
		Issues Template (ISTMP) provides HTML and JavaScript 'boilerplate' to create a typical TooToo menu.

	`;

ISTMP.currentStatus =
	`

		<summary>Issues Template ISTMP ${ ISTMP.release} ~ ${ ISTMP.date }</summary>

		<p>
			${ ISTMP.description }
		</p>
		<p>
		Concept
			<ul>
				<li>Provides default current status text template</li>
				<li>Provides default description text template</li>
				<li>Includes JavaScript code to generate an HTML menu</li>
			</ul>
		</p>
		<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/r15/js-gbxml/istmp-issues-template.js: target="_blank" >
				Issues Template source code
			</a>
		</p>
		<details>
			<summary>Change log</summary>
			<ul>
				<li>2019-02-11 ~ Bring up to same level a TooToo TMP</li>
				<!-- <li></li>
				-->
			</ul>
		</details>
	`;


	ISTMP.getMenuTemplate = function() {

		const htm =

		`<details id="ISTMPdetTemplate" ontoggle=ISTMP.getTemplateCheck(); >

			<summary>Issues Template<span id="ISTMPspnCount" ></span>
			<a id=ISTMPsumHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(ISTMPsumHelp,ISTMP.currentStatus);" >&nbsp; ? &nbsp;</a>

			</summary>

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

		</details>`;

		return htm;

	};

ISTMP.getTemplateCheck = function() {
	//console.log( 'ISTMPdetTemplate.open', ISTMPdetTemplate.open );

	if ( ISTMPdetTemplate.open === false && ISCOR.runAll === false ) { return; }

	if ( GBX.surfaces.length > ISCOR.surfaceCheckLimit ) { return; } // don't run test automatically on very large files

	ISTMP.invalidTemplate = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		const surfaceId = surface.match( /id="(.*?)"/)[ 1 ];

		// bogus code - admits all surfaces
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

