// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, POP, ISCOR, divPopupData */
/* jshint esversion: 6 */


const TMP = { "release": "R10.1", "date": "2018-12-21" };


TMP.currentStatus =
	`
		<aside>

				<h3>TMP ${ TMP.release} status ${ TMP.date }</h3>

				<p>This module is new / ready for light testing.</p>

				<p>
					<ul>
						<li>2018-12-11 ~ xxx</li>


						<!-- <li></li> -->
					</ul>
				</p>

		</aside>

		<hr>
	`;



TMP.getTemplateCheck = function() {
	//console.log( 'TMPdetTemplate.open', TMPdetTemplate.open );


	/*

	if ( TMPdetTemplate.open === false && ISCOR.runAll === false ) { return; }

	TMP.invalidTemplate = [];

	const surfaces = GBX.surfaces;

	// refactor to a reduce??
	for ( let i = 0; i < surfaces.length; i++ ) {

		const surface = surfaces[ i ];

		const surfaceId = surface.match( /id="(.*?)"/)[ 1 ];

		const invalidTemplate = GBX.surfaces.find( element => GBX.surfaceTypes.indexOf( surfaceId ) < 0 );
		//console.log( 'invalidTemplate', invalidTemplate );

		if ( invalidTemplate ) {

			TMP.invalidTemplate.push( i );

		}

	}

	let color;
	let htmOptions = '';

	for ( let surfaceIndex of TMP.invalidTemplate ) {

		color = color === 'pink' ? '' : 'pink';

		const surfaceText = GBX.surfaces[ surfaceIndex ];

		const id = surfaceText.match( 'id="(.*?)"' )[ 1 ];

		htmOptions +=
			`<option style=background-color:${ color } value=${ surfaceIndex } >${ id }</option>`;
	}

	TMPselTemplate.innerHTML = htmOptions;
	TMPspnCount.innerHTML = `: ${ TMP.invalidTemplate.length } found`;

	return TMP.invalidTemplate.length;

	*/

};



TMP.getDivMenuTemplate = function() {

	const htm =

	`<details id="TMPdetTemplate" ontoggle=TMP.getTemplateCheck(); open >

		<summary>Template<span id="TMPspnCount" ></span> <a id=stat href="JavaScript:TMP.setPopupShowHide();" >&nbsp; ? &nbsp;</a></summary>

		<p>
			template template text
		</p>

		<p>
			<button onclick=TMP.setTemplateShowHide(this,TMP.invalidTemplate); >
				Show/hide template surfaces
			</button>
		</p>

		<p>
			<button onclick=TMP.setPopupShowHide(this); >?</button>
		</p>
		<p>
			<select id=TMPselTemplate onchange=TMP.selectedSurfaceFocus(this); style=width:100%; size=10 >
			</select>
		</p>

		<p>
			<button onclick=TMP.selectedSurfaceDelete(); title="Starting to work!" >
				template
			</button>
		</p>

		<div>${ TMP.currentStatus }</div>

	</details>`;

	return htm;

};



TMP.setTemplateShowHide = function( button, surfaceArray ) {
	//console.log( 'surfaceArray', surfaceArray );

	//THR.scene.remove( POP.line, POP.particle );

	button.classList.toggle( "active" );

	if ( button.classList.contains( 'active' ) && surfaceArray.length ) {

		//GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		//surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

	} else {

		//GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}

};


TMP.onDocumentMouseDown = function() {

	divPopUpData.innerHTML = '';

};



TMP.setPopupShowHide = function(  ) {

	//console.log( 'butt', button);

	//divPopUpData.addEventListener( 'mousedown', TMP.onDocumentMouseDown, false );
	//document.addEventListener( 'touchstart', TMP.onDocumentMouseDown, false ); // for mobile

	stat.classList.toggle( "active" );

	if ( stat.classList.contains( 'active' ) ) {

		divPopUpData.innerHTML =

		TMP.currentStatus +

		`lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?`
		//GBX.surfaceGroup.children.forEach( mesh => mesh.visible = false );

		//surfaceArray.forEach( surfaceId => GBX.surfaceGroup.children[ surfaceId ].visible = true );

 	} else {

		divPopUpData.innerHTML = '';

		//GBX.surfaceGroup.children.forEach( element => element.visible = true );

	}


}


TMP.selectedSurfaceFocus = function( select ) {

	//POP.intersected = GBX.surfaceGroup.children[ select.value ];

	//POP.getIntersectedDataHtml();

	//divPopupData.innerHTML = POP.getIntersectedDataHtml();

};

