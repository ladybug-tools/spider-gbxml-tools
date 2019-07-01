/* globals GBX, VST, THREE, VBZselZone, VBZdivReportsLog, VSTdivSurfaceType */
// jshint esversion: 6
/* jshint loopfunc: true */


const VBZ = {

	"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
	"date": "2019-07-01",
	"description": "View the surfaces in a gbXML file by selecting one or more zones from a list of all zones",
	"helpFile": "../js-view/vbz-view-by-zones.md",
	"version": "0.16-01-4vbz",
	"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-16-01/js-view/vbz-view-by-zones.js",

};



VBZ.temperatureZones = [
	"#38b8a", "#38b8a","#38b8a", "#38b8a", "#38b8a", // 0 -5
	"#71ccc6", "#71ccc6", "#71ccc6", "#71ccc6", "#71ccc6", "#71ccc6", "#71ccc6", "#71ccc6", "#71ccc6", "#71ccc6",
	"#aae0dd", "#aae0dd", "#aae0dd",
	"#e2f4f3", "#e2f4f3",
	"#fae2e8", "#fae2e8",
	"#f1aaba", "#f1aaba",
	"#e7718d", "#e7718d","#e7718d",
	"#de385", "#de385", "#de385", "#de385", "#de385", "#de385", "#d=e385", "#de385",
	"#d50032", "#d50032", "#d50032", "#d50032", "#d50032",  "#d50032",  "#d50032",  "#d50032"
];



VBZ.getMenuViewByZones = function() {

	document.body.addEventListener( 'onGbxParse', function(){ VBZdetMenu.open = false; }, false );

	const help = `<button id="butVBZsum" class="butHelp" onclick="POP.setPopupShowHide(butVBZsum,VBZ.helpFile);" >?</button>`;

	// VBZ.selectOptions = [
	// 	"id", "airChangesSchedIdRef", "coolSchedIdRef", "fanSchedIdRef", "fanTempSchedIdRef",
	// 	"heatSchedIdRef", "outAirSchedIdRef", "AirChangesPerHour", "OAFlowPerPerson", "DesignHeatT",
	// 	"DesignCoolT", "CADObjectId", "Name", "TypeCode"
	// ].map( option => `<option>${ option }</option>`);

	VBZ.selectAttribute = [

		"id", "CADObjectId", "Name", "TypeCode"

	].map( option => `<option  ${ option === "Name" ? "selected" : "" } >${ option }</option>`);

	// VBZ.selectElement = [
	// 	"airChangesSchedIdRef", "coolSchedIdRef", "fanSchedIdRef", "fanTempSchedIdRef", "heatSchedIdRef",
	// 	"outAirSchedIdRef", "AirChangesPerHour", "OAFlowPerPerson", "DesignHeatT", "DesignCoolT"
	// ].map( option => `<option>${ option }</option>`);

	VBZ.selectElement = [ "DesignHeatT", "DesignCoolT" ].map( option => `<option>${ option }</option>`);

	const htm =
	`
		<details id=VBZdetMenu ontoggle=VBZ.getZonesOptions(); >

			<summary>Zones  ${ help }</summary>

			<p>Display surfaces by zone. Default is all zones visible. Legends viewable in
			<button id="butVBZtxt" onclick="POP.setPopupShowHide(butVBZtxt,VBZ.helpFile);">? / read me</button>.
			<span id="VBZspnCount" ></span>. Very slow on large files. Will speed things up.</p>


			<div>
				<select id=VBZselZone oninput=VBZ.selectZoneFocus(this); style=width:100%; ></select
			</div>

			<div id="VBZdivReportsLog" ></div>

			<p>Attribute to show: <select id=VBZselAttribute oninput=VBZ.getZonesOptions(); >${ VBZ.selectAttribute }</select></p>

			<p>Value to show: <select id=VBZselElement oninput=VBZ.getZonesOptions(); >${ VBZ.selectElement }</select></p>

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

	zoneAttributes = GBX.zones.map( zone => {

		if ( ["CADObjectId", "Name", "TypeCode" ].includes( attribute )) {

			zoneArr = zone.match( `<${ attribute }(.*?)>(.*?)</${ attribute }>` );
			zoneArr = zoneArr ? zoneArr[ 2 ] : "";
			//console.log( '', zoneArr );

		} else if ( ["id" ].includes( attribute ) ) {

			zoneArr = zone.match( ` ${ attribute }="(.*?)"` );
			zoneArr = zoneArr ? zoneArr[ 1 ] : "";

		}

		return zoneArr;

	} );
	//console.log( 'zoneAttributes', zoneAttributes);

	zoneAttributes = zoneAttributes.sort( (a, b) => b - a );
	//console.log( 'zoneAttributes', zoneAttributes );

	if ( !zoneAttributes ){ alert( "none of this attribute. Try another" ); return; }

	let zoneOptions = zoneAttributes.map( zoneAttribute => {

		const zone = GBX.zones.find( zone => zone.includes( zoneAttribute ) );

		const zoneArr = zone.match( ' id="(.*?)"');
		const zoneId = zoneArr ? zoneArr[ 1 ] : `no ${ zoneAttribute }`;

		const element = VBZselElement.value;

		const tempArr = zone.match( `<${ element }(.*?)>(.*?)<\/${ element }>` );
		const temp = tempArr ? tempArr[ 2 ] : 20;

		const color = VBZ.temperatureZones[ parseInt( temp ) ];

		return `<option style=background-color:${ color} value=${ zoneId } title="id: ${ zoneId }"; >
			${ zoneAttribute || zoneId }</option>`;

	} );

	if ( zoneAttributes.length === 1 ) {

		zoneOptions = `<option placeholder="" >select an option</option> ${ zoneOptions }`;

	}

	VBZselZone.innerHTML = zoneOptions;

	VBZspnCount.innerHTML = `${ zoneAttributes.length } zones found`;

};



VBZ.selectZoneFocus = function( select ) {

	console.log( '', 23 );

	THR.controls.enableKeys = false;

	POPX.intersected = null;

	THR.scene.remove( POPX.line, POPX.particle );

	const zoneId = select.value;
	//console.log( 'zoneId', zoneId );

	POPdivMain.innerHTML = POPX.getZoneAttributes( zoneId );

	const options = select.selectedOptions
	//console.log( 'options', options );

	//GBX.surfaceGroup.children.forEach( element => element.visible = false );

	Array.from( options ).forEach( option => VBZ.setZoneVisible( option.value ) );

};



VBZ.setZoneVisible = function ( zoneId ) {

	//console.log( 'zoneId', zoneId );

	const children = GBX.surfaceGroup.children;

	const spaces = GBX.spaces;

	const spaceIdsInZone = [];

	for ( let space of spaces ) {

		const spaceZoneId = space.match( /zoneIdRef="(.*?)"/ );

		if ( spaceZoneId && spaceZoneId[ 1 ] === zoneId ) {
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
				zoneIdRef = spaceText.match( /zoneIdRef="(.*?)"/i )[ 1 ];
				//console.log( '', zoneId );

				//zoneData = VBZ.zones.find( zone => zone.includes( zoneId ) )
				//console.log( 'zoneData', zoneData );
				//console.log( '', zoneData.tempHeat );

				child.visible = spacesIdsArr.includes( spaceId ) ? true : child.visible;

				//console.log( 'child', child );

				//child.material.color.setHex( zoneData.color ); // new THREE.MeshPhongMaterial( { color: 0xff0000, side: 2 } );

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
