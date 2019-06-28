/* globals GBX, VST, THREE, VBZselZone, VBZdivReportsLog, VSTdivSurfaceType */
// jshint esversion: 6
/* jshint loopfunc: true */


const VBZ = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-06-28",
	"description": "View the surfaces in a gbXML file by selecting one or more zones from a list of all zones",
	"helpFile": "../js-view/vbz-view-by-zones.md",
	"version": "0.16-01-3vbz",
	"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-16-01/js-view/vbz-view-by-zones.js",

};



VBZ.getMenuViewByZones = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBZdetMenu.open = false; }, false );

	const help = `<button id="butVBZsum" class="butHelp" onclick="POP.setPopupShowHide(butVBZsum,VBZ.helpFile);" >?</button>`;

	VBZ.selectOptions = ["id", "airChangesSchedIdRef", "coolSchedIdRef", "fanSchedIdRef", "fanTempSchedIdRef",
	"heatSchedIdRef", "outAirSchedIdRef", "AirChangesPerHour", "OAFlowPerPerson", "DesignHeatT", "DesignCoolT",
	"CADObjectId", "Name", "TypeCode"].map( option => `<option>${ option }</option>`)

	const htm =
	`
		<details id=VBZdetMenu ontoggle=VBZ.getZonesOptions(); >

			<summary>Zones  ${ help }</summary>

			<p>Display surfaces by zone. Default is all zones visible. Legends viewable in ?/read me file.
			<span id="VBZspnCount" ></span></p>

			<p><mark>Currently only displays colors for DesignHeatT. More options on way.</mark></p>

			<div id="VBZdivViewByZones" >
				<select id=VBZselZone onchange=VBZ.selectZoneFocus(this); multiple style=min-width:100%; ></select
			</div>

			<div id="VBZdivReportsLog" ></div>

			<p>Attribute to show: <select id=VBZselAttribute oninput=VBZ.getZonesOptions(); >${ VBZ.selectOptions.slice() }</select></p>

			<p>Select multiple zones by pressing shift or control keys</p>

			<p><button onclick=VBZ.resetColors(); >reset colors</button> </p>


		</details>
	`;

	return htm;
};



VBZ.getZonesOptions = function() {

	VBZselZone.size = GBX.zones.length > 10 ? 10 : GBX.zones.length;


	const attribute = VBZselAttribute.value;
	//console.log( 'attribute', attribute );

	let zoneArr;

	const zoneNameArray = GBX.zones.map( zone => {

		if ( ["AirChangesPerHour","CADObjectId", "OAFlowPerPerson", "DesignHeatT", "DesignCoolT", "Name", "TypeCode" ].includes( attribute )) {

			zoneArr = zone.match( `<${ attribute }(.*?)>(.*?)</${ attribute }>` );
			zoneArr = zoneArr ? zoneArr[ 2 ] : ""
			//console.log( '', zoneArr );

		} else if ( ["id", "airChangesSchedIdRef", "coolSchedIdRef", "fanSchedIdRef", "fanTempSchedIdRef", "heatSchedIdRef"].includes( attribute ) ) {

			zoneArr = zone.match( ` id="(.*?)"` );
			zoneArr = zoneArr ? zoneArr[ 1 ] : "no zone name in file";

		}

		return zoneArr

	} );
	//console.log( 'zoneNames', zoneNames);

	zoneNames = zoneNameArray.sort( (a, b) => b - a );
	//console.log( 'zoneNames', zoneNames );

	VBZ.zones = zoneNames.map( zoneName => {

		zone = GBX.zones.find( zone => zone.includes( zoneName ) );

		zoneId = zone.match( 'id="(.*?)"')[ 1 ];

		tempHeat = Number( zone.match( /<DesignHeatT(.*?)>(.*?)<\/DesignHeatT>/i)[ 2 ] );

		colors = [ 0x38b8a, 0x71ccc6, 0xaae0dd, 0xe2f4f3, 0xfae2e8, 0xf1aaba, 0xe7718d, 0xde385, 0xd50032 ];

		let color;

		if ( tempHeat < 6 ) {

			color = colors[ 0 ];

		} else if ( tempHeat < 16 ) {

			color = colors[ 1 ];

		} else if ( tempHeat < 19 ) {

			color = colors[ 2 ];

		} else if ( tempHeat < 21 ) {

			color = colors[ 3 ];

		} else if ( tempHeat < 23 ) {

			color = colors[ 4 ];

		} else if ( tempHeat < 24 ) {

			color = colors[ 5 ];

		} else if ( tempHeat < 27 ) {

			color = colors[ 6 ];

		} else if ( tempHeat < 36 ) {

			color = colors[ 7 ];

		} else {

			color = colors[ 8 ];

		}

		return { zoneName, zoneId, tempHeat, color };

	} )
	//console.log( 'VBZ.zones', VBZ.zones );

	const options = VBZ.zones.map( ( zone, index ) =>

		`<option style=background-color:#${ zone.color.toString(16) } value=${ index } title="${ zone.zoneId }"; >${ zone.zoneId } / ${ zone.zoneName }</option>`

	);

	VBZselZone.innerHTML = options;

	VBZspnCount.innerHTML = `: ${ VBZ.zones.length } zones found`;

};



VBZ.selectZoneFocus = function( select ) {

	THR.controls.enableKeys = false;

	//POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	const zone = VBZ.zones[ select.value ];
	//console.log( 'zone', zone );

	POPdivPopupData.innerHTML = POPX.getZoneAttributes( zone.zoneId );

	const options = select.selectedOptions
	//console.log( 'options', options );

	GBX.surfaceGroup.children.forEach( element => element.visible = false );

	Array.from( options ).forEach( option =>

		VBZ.setZoneVisible( option.title )

	);

};


VBZ.setColorByHeat = function() {

	const colors = ["#38b8a", "71ccc6", "aae0dd", "e2f4f3", "fae2e8", "f1aaba", "e7718d", "de385", "d50032" ]

	temps = GBX.zones.map( zone => zone.match( /<DesignHeatT unit="C">(.*?)<\/DesignHeatT>/i)[ 1 ] );

	temps = temps.sort( (a, b) => a - b );
	temps = [...new Set( temps )];
	console.log( 'temps', temps );

};



VBZ.setZoneVisible = function ( zoneIdRef ) {

	const children = GBX.surfaceGroup.children;

	const spaces = GBX.spaces;

	//const spaceIdRef = GSA.adjacentSpaceIds.length === 1 ? GSA.adjacentSpaceIds[ 0 ] : GSA.adjacentSpaceIds[ 1 ];

	const spaceIdsInZone = [];

	for ( let space of spaces ) {

		const spaceZoneId = space.match( /zoneIdRef="(.*?)"/ );

		if ( spaceZoneId && spaceZoneId[ 1 ] === zoneIdRef ) {
			//console.log( 'spaceZoneId', spaceZoneId[ 1 ] );

			const spaceId = space.match( ` id="(.*?)"` )[ 1 ];
			//console.log( 'spaceId', spaceId );

			spaceIdsInZone.push( spaceId );

		}

	}
	//console.log( 'spaceIdsInZone', spaceIdsInZone );


	for ( let child of children ) {

		const id = child.userData.index;
		const surface = GBX.surfaces[ id ];
		const spacesArr = surface.match( / spaceIdRef="(.*?)"/g );
		//console.log( 'spacesArr', spacesArr );

		if ( spacesArr ) {

			const spacesIdsArr = spacesArr.map( space => space.match( `="(.*?)"` )[ 1 ] );
			//console.log( 'spacesIdsArr', spacesIdsArr );

			for ( let spaceId of spaceIdsInZone ) {

				spaceText = GBX.spaces.find( space => space.includes( spaceId ) );
				zoneId = spaceText.match( /zoneIdRef="(.*?)"/i )[ 1 ];
				//console.log( '', zoneId );

				zoneData = VBZ.zones.find( zone => zone.zoneId === zoneId )
				//console.log( 'zoneData', zoneData );
				//console.log( '', zoneData.tempHeat );

				child.visible = spacesIdsArr.includes( spaceId ) ? true : child.visible;

				//console.log( 'child', child );

				child.material.color.setHex( zoneData.color ); // new THREE.MeshPhongMaterial( { color: 0xff0000, side: 2 } );

			}

		}

	}

};


//////////

VBZ.resetColors = function( ) {

	GBX.surfaceGroup.children.forEach( ( mesh, index ) => {

		const string = GBX.surfaces[ index ].match( 'surfaceType="(.*?)"')[ 1 ];
		//console.log( 'string', GBX.colorsDefault[ string ]);

		mesh.material.color.set(  parseInt( GBX.colorsDefault[ string ] ) );

	} );

}



VBZ.toggleZones = function( button ) {

	button.classList.toggle( "active" );

	const focus = button.classList.contains( "active" );

	if ( focus === true ) {

		GBX.surfaceGroup.children.forEach( element => element.visible = true );

	} else {

		GBX.surfaceGroup.children.forEach( element => element.visible = false );

		const options = VBZselZone.selectedOptions
		console.log( 'options', options );

		Array.from( options ).forEach( option =>

			VBZ.setZoneVisible( option.title )

		);
	}

};




////////// looks at surface types

VBZ.setSurfacesFilteredByZone = function( surfaces ) {

	const zoneIds = VBZselZone.selectedOptions;
	//console.log( 'zoneIds', zoneIds );

	if ( zoneIds.length === 0 ) {

		const buttonsActive = VSTdivSurfaceType.getElementsByClassName( "active" ); // collection

		let filterArray = Array.from( buttonsActive ).map( button => button.innerText );

		filterArray = filterArray.length > 0 ? filterArray : VST.filtersDefault;
		//console.log( 'filterArray', filterArray );

		surfaces = filterArray.flatMap( filter =>

			GBX.surfacesIndexed.filter( surface => surface.includes( `"${ filter }"` ) )

		);

	}

	const surfacesFilteredByZone = surfaces ? surfaces : [];

	for ( let zoneId of zoneIds ) {

		const zonesFiltered = GBX.zones.filter( zone => zone.includes( ` id="${ zoneId.value }"` ) );
		//console.log( 'zonesFiltered', zonesFiltered );

		const zonesInZoneIds = zonesFiltered.map( zone => zone.match( ' id="(.*?)"' )[ 1 ] );
		//console.log( 'zonesInZoneIds', zonesInZoneIds );

		const surfacesVisibleByZone = zonesInZoneIds.flatMap( zoneId =>
			GBX.surfacesIndexed.filter( surface => surface.includes( `zoneIdRef="${ zoneId }"`  ) )
		);
		//console.log( 'surfacesVisibleByZone', surfacesVisibleByZone );
/*
		const buttonsActive = VSTdivSurfaceType.getElementsByClassName( "active" ); // collection

		let filterArr = Array.from( buttonsActive ).map( button => button.innerText );

		filterArr = filterArr.length > 0 ? filterArr : VST.filtersDefault;

		const surfacesFiltered = filterArr.flatMap( filter =>

			surfacesVisibleByZone.filter( surface => surface.includes( `"${ filter }"` ) )

		);
*/
		surfacesFilteredByZone.push( ...surfacesVisibleByZone );

		console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	}

	return surfacesFilteredByZone;

};
