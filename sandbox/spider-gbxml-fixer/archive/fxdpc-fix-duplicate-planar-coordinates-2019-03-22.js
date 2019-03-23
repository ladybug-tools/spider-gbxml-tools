
// Copyright 2019 Ladybug Tools authors. MIT License
/* globals */
/* jshint esversion: 6 */
/* jshint loopfunc:true */


SGT.getCheckDuplicatePlanarCoordinates = function() {

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

				duplicates.push( [ index1, ( planes.length - planesRemainder.length ) ] );

			}

		} );

	} );
	//console.log( 'duplicates', duplicates );

	options = duplicates.map( ( arr, count ) => arr.map( index =>

		`<option value="${ arr.join() }" style=background-color:${ count % 2 === 0 ? "#eee" : "" }; >
			${ count + 1 } ${ SGT.surfaces[ index ].match( / id="(.*?)"/i )[ 1 ] }
		</option>`

		)
	);
	//console.log( 'options', options );

	/*
	const htm = SGT.getItemHtm( {
		open: duplicates.length > 0 ? "open" : "",
		summary: `Surfaces with Duplicate Planar Coordinates - ${ duplicates.length} found`,
		description: `Two surfaces with identical vertex coordinates for their planar geometry`,
		contents:
		`
			<p>
				${ duplicates.length.toLocaleString() } sets duplicates found<br>
			</p>

			<p>
				<select onclick=SGT.setDuplData(this); size=5 >${ options }</select>
			</p>

			<div id="SGTdivDuplData" >Click a surface ID above to view its details and delete if necessary</div>
		`,
		timeStart: timeStart

	} );
	*/

	
	const htm =
	`
		<p><i>Two surfaces with identical vertex coordinates for their planar geometry</i></p>

		<p>
			${ duplicates.length.toLocaleString() } sets duplicates found<br>
		</p>

		<p>
			<select onclick=SGT.setDuplData(this); size=5 >${ options }</select>
		</p>

		<div id="SGTdivDuplData" >Click a surface ID above to view its details and delete if necessary</div>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>
	`;

	return htm;




/*
	duplicatesData = SGT.getSurfacesAttributesByIndex( duplicates );

	//console.log( 'duplicatesData', duplicatesData );


	htm = duplicatesData.map( ( item, index ) =>  {

		return item + `<button onclick=confirm("coming-soon"); >delete</button>${ ( ( index + 1 ) % 2 === 0 ? "<hr>" : "<br>" ) }`;

	} ).join( "");

	SGT.addItem( {
		open: duplicates.length > 0 ? "open" : "",
		summary: `Surfaces with Duplicate Planar Coordinates - ${ duplicates.length} found`,
		description: `Two surfaces with identical vertex coordinates for their planar geometry`,
		contents:
		`
			${ ( duplicates.length / 2 ).toLocaleString() } sets found<br>
			${ htm }
		`,
		timeStart: timeStart
	} );
	*/

};



SGT.setDuplData = function( select ) {

	console.log( '', select.value );

	items = select.value.split( ",");

	console.log( '', items );

	const htm =

		`
			${ SGT.getSurfacesAttributesByIndex( items[ 0 ] ) }

			<p>
				<button onclick=SGT.deleteSelectedSurface(${ items[ 1 ] }); >delete</button>
			</p>

			${ SGT.getSurfacesAttributesByIndex( items[ 1 ] ) }

			<p>
				<button onclick=SGT.deleteSelectedSurface(${ items[ 1 ] }); >delete</button>
			</p>
		`;

	SGTdivDuplData.innerHTML= htm;

};



SGT.deleteSelectedSurface = function( index ) {

	//console.log( 'select.value', select );

	result = confirm(
		`OK to delete\n`+

		`\nWork-in-progress. Could be working soon.`
	);

	if ( result === true ) {

		//index = select.value;

		//child = SGT.surfaceGroup.children.find( item => item.userData.index === index );

		//SGT.surfaceGroup.remove( child );

		str = SGT.surfaces[ index ];
		console.log( 'str', str );

		reg = new RegExp( `${ str }`, 'i');

		text = SGT.text.replace( reg, '' );
		//console.log( 'text', text );

	}

};