/* globals GBX, GSA, FASAdivSurfaceAttributeData, FASAsumSurfaces, FASAtxt, FASAdet, FASAdivFixAirSingleAdjacent
 */
// jshint esversion: 6
// jshint loopfunc: true


const FASA = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-23",
		description:
		"Identify all the surfaces of a model of type \"Air\" that have a single adjacent space attribute. " +
		"Allow you to change the surface type to \"Roof\". ",
		helpFile: "../v-0-17-00/js-fixer/fasa-fix-air-single-adjacent/fasa-fix-air-single-adjacent.md",
		license: "MIT License",
		version: "0.17.00-0fasa",

	}

};



FASA.getMenuAirSingleAdjacent = function() {

	const htm =
		`
			<details id=FASAdet ontoggle="FASAdivAirSingleAdjacent.innerHTML=FASA.getAirSingleAdjacent();" >

				<summary id=FASAsumSurfaces >Fix air surfaces with single adjacent space</summary>

				${ GBXF.getHelpButton( "FASAbutHelp", FASA.script.helpFile ) }

				<div id=FASAdivAirSingleAdjacent ></div>

				<div id=FASAdivSurfaceAttributeData ></div>

			</details>

		`;

	return htm;

};



FASA.getAirSingleAdjacent = function() {

	const timeStart = performance.now();

	FASAdivSurfaceAttributeData.innerHTML = "";

	FASA.airSurfaces = GBX.surfaces.filter( surface => {

		let surfaceType = surface.match( /surfaceType="(.*?)"/);
		surfaceType = surfaceType ? surfaceType[ 1 ] : "";

		return surfaceType === "Air";

	} );
	//console.log( 'FASA.airSurfaces', FASA.airSurfaces );

	FASA.airSingleAdjacents = FASA.airSurfaces.filter( surface => {

		let adjacentSpaceArr = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
		adjacentSpaceArr = adjacentSpaceArr ? adjacentSpaceArr : [];
		//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

		return adjacentSpaceArr.length === 1;

	} );
	//console.log( 'FASA.', FASA.airSingleAdjacents );

	FASA.surfaces = FASA.airSingleAdjacents.map( ( surface ) => {

		const index = GBX.surfaces.indexOf( surface );

		const id = surface.match( / id="(.*?)"/i )[ 1 ];

		let name = surface.match( /<Name>(.*?)<\/Name>/i );
		name = name ? name[ 1 ] : id;

		let typeSource = surface.match( /surfaceType="(.*?)"/i );
		typeSource = typeSource ? typeSource[ 1 ] : "";
		//console.log( '', typeSource );

		let adjacentSpaceArr = surface.match( /<AdjacentSpaceId(.*?)\/>/gi );
		adjacentSpaceArr = adjacentSpaceArr ? adjacentSpaceArr : [];
		//console.log( 'adjacentSpaceArr', adjacentSpaceArr );

		//let exposedToSun = surface.match( /exposedToSun="(.*?)"/i );
		//console.log( 'exposedToSun', exposedToSun );
		//exposedToSun = exposedToSun ? exposedToSun[ 0 ] : "";

		//let exposedToSunBoolean = exposedToSun ? exposedToSun[ 1 ].toLowerCase() === "true" : "false";
		//console.log( 'exposedToSun', exposedToSun );

		return( { index, id, name, typeSource, adjacentSpaceArr } );


	} );
	//console.log( 'FASA.surfaces', FASA.surfaces );
	//console.log( 'FASA.surfaceTypes', FASA.surfaceTypes );

	const options = FASA.surfaces.map( extra => {

		return `<option value=${ extra.index } title="${ extra.id }" >${ extra.name }</option>`;

	} );

	const tag = FASA.surfaces.length === 0 ? "span" : "mark";

	FASAsumSurfaces.innerHTML =
		`Fix air surfaces with single adjacent space
			~ <${ tag }>${ FASA.surfaces.length.toLocaleString() }</${ tag }> found
			${ FASA.help }
		`;

	const htm =
	`
		<p><i>Surfaces</i></p>

		<p>${ FASA.description }</p>

		<p>${ FASA.surfaces.length.toLocaleString() } surfaces of type "Air" with single adjacent space.</p>

		<p>
			<select id=FASEselAdjacentSpaceExtra onclick=FASA.setAirSingleAdjacentData(this); size=5 style=min-width:8rem; >
				${ options }
			</select>
		</p>

		<p><button onclick=FASA.changeAllAirSingleAdjacent(); >Fix all</button></p>

		<p>Time to check: ${ ( performance.now() - timeStart ).toLocaleString() } ms</p>

		<hr>

		<div id="FASAdivAirSingleAdjacentData" >Click a surface name above to view its details. Tool tip shows the ID of the surface.</div>

	`;

	return htm;

};



FASA.setAirSingleAdjacentData = function( select ) {
	//console.log( 'select.value', select.value );

	const surface = FASA.surfaces[ select.selectedIndex ];
	//console.log( 'surface', surface );

	const htm =
	`
		<p>
			gbXML adjacent space text: <br>
			<textarea style=width:100%; >${ surface.adjacentSpaceArr.join( "\n" ) }</textarea>
		</p>

		${ GSA.getSurfacesAttributesByIndex( surface.index, surface.name ) }

		<p>
			<button onclick=FASA.changeAirSingleAdjacent(${ select.selectedIndex }); title="If tilt equals zero" >change adjacent space type to "Roof"</button>
		</p>

		<p>
			<textarea id=FASAtxt style="height:20rem; width:100%;" ></textarea>
		</p>
	`;

	//FASAdivSurfaceAttributeData.innerHTML = htm;

	//const det = FASAdivSurfaceAttributeData.querySelectorAll( 'details');

	//det[ 0 ].open = true;

};



FASA.changeAirSingleAdjacent = function( index ) {

	const air = FASA.surfaces[ index ];
	//console.log( 'air', air );

	let surfaceTextCurrent = GBX.surfaces[ air.index ];
	//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

	const tilts = surfaceTextCurrent.match( /<Tilt>(.*?)<\/Tilt>/i );
	const tilt = tilts ? tilts[ 1 ] : "";
	console.log( 'tilt', tilt );

	let surfaceTextNew;

	if ( tilt === "0" ) {

		surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="Air"/i , 'surfaceType="Roof"' );
		//console.log( 'surfaceTextNew', surfaceTextNew );

		surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="Air"/i , 'surfaceType="Roof"' );
		//console.log( 'surfaceTextNew', surfaceTextNew );
		surfaceTextNew = surfaceTextNew.replace( /<CADObjectId>(.*?)\[(.*)\]<\/CADObjectId>/i, `<CADObjectId>Basic Roof: SIM_EXT_SLD_Roof SpiderFix [$2]</CADObjectId>` );

		surfaceTextNew = surfaceTextNew.replace( /exposedToSun="(.*?)"/i, `exposedToSun="true"` );

		//console.log( 'surfaceTextNew', surfaceTextNew );
		GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

		surfaceTextCurrent = surfaceTextNew;

		GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	} else {

		console.log( 'tilt !== 0: TBD', tilt );

	}

	FASAtxt.value = surfaceTextNew;

	//FASAdet.open = false;

	//FASAdivFixAirSingleAdjacent.innerHTML = FASA.getMenuAirSingleAdjacent();

};



FASA.changeAllAirSingleAdjacent = function() {

	FASA.surfaces.forEach( ( air, index ) => {
		//console.log( 'air', air );

		let surfaceTextCurrent = GBX.surfaces[ air.index ];
		//console.log( 'surfaceTextCurrent', surfaceTextCurrent );

		const tilts = surfaceTextCurrent.match( /<Tilt>(.*?)<\/Tilt>/i );
		const tilt = tilts ? tilts[ 1 ] : "";
		console.log( 'tilt', tilt );

		let surfaceTextNew;

		if ( tilt === "0" ) {

			surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="Air"/i , 'surfaceType="Roof"' );
			//console.log( 'surfaceTextNew', surfaceTextNew );

			surfaceTextNew = surfaceTextCurrent.replace( /surfaceType="Air"/i , 'surfaceType="Roof"' );
			//console.log( 'surfaceTextNew', surfaceTextNew );
			surfaceTextNew = surfaceTextNew.replace( /<CADObjectId>(.*?)\[(.*)\]<\/CADObjectId>/i, `<CADObjectId>Basic Roof: SIM_EXT_SLD_Roof SpiderFix [$2]</CADObjectId>` );

			surfaceTextNew = surfaceTextNew.replace( /exposedToSun="(.*?)"/i, `exposedToSun="true"` );

			//console.log( 'surfaceTextNew', surfaceTextNew );
			GBX.text = GBX.text.replace( surfaceTextCurrent, surfaceTextNew );

			//surfaceTextCurrent = surfaceTextNew;

		} else {

			console.log( 'tilt !== 0: TBD', tilt );

		}

	} );

	GBX.surfaces = GBX.text.match( /<Surface(.*?)<\/Surface>/gi );

	FASAdet.open = false;

	FASAdivFixAirSingleAdjacent.innerHTML = FASA.getMenuAirSingleAdjacent();

};
