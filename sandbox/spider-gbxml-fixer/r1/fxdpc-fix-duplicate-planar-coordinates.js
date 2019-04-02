
// Copyright 2019 Ladybug Tools authors. MIT License
/* globals SGT, FXDPCsumDuplicatePlanar, FXDPCdivDuplData, FXDPCdivDuplicatePlanar */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


const FXDPC = { "release": "1.1", "date": "2019-04-02" };

FXDPC.description = `Identify two or more surfaces with the same planar geometry coordinates`;

FXDPC.currentStatus =
	`
		<h3>Fix Surfaces with duplicate planar coordinates (FXDPC) R${ FXDPC.release } ~ ${ FXDPC.date }</h3>

		<p>
			${ FXDPC.description }.
		</p>

		<details open>
			<summary>Issues</summary>
			<ul>
				<li>2019-03-29 ~ Reporting false positives</li>
			</ul>
		</details>

		<p>
			Wish List / To do:<br>
			<ul>
				<li>2019-03-29 ~ Check for openings</li>
				<li>2019-03-25 ~ Add select and update multiple surfaces at once</li>
				<li>2019-03-19 ~ Pre-select the correct surface to delete n the select type list box</li>
			</ul>
		</p>

		<details>
			<summary>Change log</summary>

			<ul>
				<li>2019-04-02 ~ B - Validate and fix with jsHint</li>
				<li>2019-03-29 ~ F - Add FXDPC.showSelectedSurfaceGbxml() / B - incorrect space shown.</li>
				<li>2019-03-25 ~ F - Duplicate surface is deleted as expected / Upon deletion, repeats check</li>
				<li>2019-03-25 ~ D - Pop-up help defined in detail</li>
				<li>2019-03-25 ~ F - List errant surfaces by name with IDs as tool tips</li>
				<li>2019-03-19 ~ First commit</li>
			</ul>
		</details>
	`;



FXDPC.getCheckDuplicatePlanarCoordinates = function() {

	const timeStart = performance.now();
	const planes = [];

	for ( let surface of SGT.surfaces ) {

		const arr = surface.match( /<PlanarGeometry>(.*?)<\/PlanarGeometry>/ );

		if ( arr ) { planes.push( arr[ 1 ] ); }

	}

	const duplicates = [];

	planes.forEach( ( plane1, index1 ) => {

		const planesRemainder = planes.slice( index1 + 1 );

		planesRemainder.forEach( ( plane2, index2 ) => {

			if ( plane1 === plane2 ) {

				//duplicates.push( [ index1, ( planes.length - planesRemainder.length ) ] );

				duplicates.push( [ index1, ( index1 + index2 + 1) ] );
				//p1 = plane1;
				//p2 = plane2
				//console.log( 'plane1', plane1 );
				//console.log( 'plane2', plane2 );

			}

		} );

	} );
	//console.log( 'duplicates', duplicates );

	const options = duplicates.map( ( arr, count ) => arr.map( index => {

		const surface = SGT.surfaces[ index ];
		return `<option value="${ arr.join() }" style=background-color:${ count % 2 === 0 ? "#eee" : "" };
			title="${ surface.match( / id="(.*?)"/i )[ 1 ] }" >
			${ count + 1 } ${ surface.match( /<Name>(.*?)<\/Name>/i )[ 1 ] }
		</option>`;

		} )

	);
	//console.log( 'options', options );


	const help = `<a id=fxdpcHelp class=helpItem href="JavaScript:MNU.setPopupShowHide(fxdpcHelp,FXDPC.currentStatus);" >&nbsp; ? &nbsp;</a>`;

	FXDPCsumDuplicatePlanar.innerHTML =
		`Fix surfaces with duplicate planar coordinates ~ ${ duplicates.length.toLocaleString() } found
			${ help }
		`;

	const htm =
	`
			<p><i>${ FXDPC.description }</i></p>

			<p>
				${ duplicates.length.toLocaleString() } sets duplicates found.  See tool tips for surface ID.<br>
			</p>

			<p>
				<select onclick=FXDPC.setDuplData(this); style=min-width:8rem; size=${ duplicates.length >= 5 &&  duplicates.length <= 20 ? 2 * duplicates.length : 10 } >${ options }</select>
			</p>

			<div id="FXDPCdivDuplData" >Click a surface ID above to view its details and delete if necessary</div>

			<p>
				<button onclick=FXDPCdivDuplicatePlanar.innerHTML=FXDPC.getCheckDuplicatePlanarCoordinates(); >Run check again</button>
			</p>

			<div id=FXDPCdivSelectedSurface ></div>

			<p>
				Click 'Save file' button in File Menu to save changes to a file.
			</p>

			<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
		`;

	return htm;

};



FXDPC.setDuplData = function( select ) {
	//console.log( '', select.value );

	const items = select.value.split( ",");
	//console.log( '', items );

	const htm =
		`
			${ SGT.getSurfacesAttributesByIndex( items[ 0 ], 1 ) }

			<p>
				<button onclick=FXDPC.deleteSelectedSurface(${ items[ 0 ] }); >delete</button>

				<button onclick=FXDPC.showSelectedSurfaceGbxml(${ items[ 0 ] },FXDPCdivSelectedSurface); >view gbXML text</button>

			</p>

			${ SGT.getSurfacesAttributesByIndex( items[ 1 ],  2 ) }

			<p>
				<button onclick=FXDPC.deleteSelectedSurface(${ items[ 1 ] }); >Delete</button>

				<button onclick=FXDPC.showSelectedSurfaceGbxml(${ items[ 1 ] },FXDPCdivSelectedSurface); >View gbXML text</button>

			</p>

		`;

	FXDPCdivDuplData.innerHTML= htm;

	const det = FXDPCdivDuplData.querySelectorAll( 'details' );
	det[ 1 ].open = true;
	det[ 4 ].open = true;

};



FXDPC.deleteSelectedSurface = function( index ) {
	//console.log( 'select.value', select );

	const result = confirm( `OK to delete surface?` );

	if ( result === false ) { return; }

	const surfaceText = SGT.surfaces[ index ];

	SGT.text = SGT.text.replace( surfaceText, '' );
	//console.log( 'len2', SGT.text.length );

	SGT.surfaces = SGT.text.match( /<Surface(.*?)<\/Surface>/gi );
	//console.log( 'SGT.surfaces', SGT.surfaces.length );

	FXDPCdivDuplicatePlanar.innerHTML =FXDPC.getCheckDuplicatePlanarCoordinates();

};



FXDPC.showSelectedSurfaceGbxml = function( index, target ) {

	target.innerText = SGT.surfaces[ index ];

};