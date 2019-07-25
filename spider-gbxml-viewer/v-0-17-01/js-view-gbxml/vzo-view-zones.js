/* globals GBX, VST, THREE, divDragMoveContent, VZOselZone, VZOdivReportsLog, VSTdivSurfaceType */
// jshint esversion: 6
// jshint loopfunc: true


const VZO = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "View the surfaces in a gbXML file by selecting one or more zones from a list of all zones",
		helpFile: "../v-0-17-01/js-view-gbxml/vzo-view-zones.md",
		license: "MIT License",
		version: "0.17-01-1vzo"

	}

};



VZO.temperatureZones = [
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



VZO.getMenuViewZones = function() {

	const help = VGC.getHelpButton("VZObutSum",VZO.script.helpFile);

	// VZO.selectOptions = [
	// 	"id", "airChangesSchedIdRef", "coolSchedIdRef", "fanSchedIdRef", "fanTempSchedIdRef",
	// 	"heatSchedIdRef", "outAirSchedIdRef", "AirChangesPerHour", "OAFlowPerPerson", "DesignHeatT",
	// 	"DesignCoolT", "CADObjectId", "Name", "TypeCode"
	// ].map( option => `<option>${ option }</option>`);

	VZO.selectAttribute = [

		"id", "CADObjectId", "Name", "TypeCode"

	].map( option => `<option  ${ option === "Name" ? "selected" : "" } >${ option }</option>`);

	// VZO.selectElement = [
	// 	"airChangesSchedIdRef", "coolSchedIdRef", "fanSchedIdRef", "fanTempSchedIdRef", "heatSchedIdRef",
	// 	"outAirSchedIdRef", "AirChangesPerHour", "OAFlowPerPerson", "DesignHeatT", "DesignCoolT"
	// ].map( option => `<option>${ option }</option>`);

	VZO.selectElement = [ "DesignHeatT", "DesignCoolT" ].map( option => `<option>${ option }</option>`);

	const htm =
	`
		<details id=VZOdetMenu ontoggle=VZO.getZonesOptions(); >

			<summary>VZO Zones</summary>

			${ help }

			<p>
				Display surfaces by zone. Default is all zones visible. Legends viewable in
				<button id="butVZOtxt" onclick="POP.setPopupShowHide(butVZOtxt,VZO.helpFile);">? / read me</button>.
				<span id="VZOspnCount" ></span>. Very slow on large files. Will speed things up.
			/p>

			<p>
				<input type=search id=VZOinpSelectIndex oninput=VGC.setSelectedIndex(this,VZOselZone) placeholder="Enter an attribute" >
			</p>

			<p>
				<select id=VZOselZone oninput=VZO.selectZoneFocus(this); style=width:100%; ></select
			</p>

			<div id="VZOdivReportsLog" ></div>

			<p>Attribute to show: <select id=VZOselAttribute oninput=VZO.getZonesOptions(); >${ VZO.selectAttribute }</select></p>

			<p>Value to show: <select id=VZOselElement oninput=VZO.getZonesOptions(); >${ VZO.selectElement }</select></p>

			<p><button onclick=VZO.resetColors(); >reset colors</button> </p>

		</details>
	`;

	return htm;

};



VZO.getZonesOptions = function() {

	VZOselZone.size = GBX.zones.length > 10 ? 10 : GBX.zones.length;

	const attribute = VZOselAttribute.value;
	//console.log( 'attribute', attribute );

	VZOinpSelectIndex.value = "";

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

		const element = VZOselElement.value;

		const tempArr = zone.match( `<${ element }(.*?)>(.*?)<\/${ element }>` );
		const temp = tempArr ? tempArr[ 2 ] : 20;

		const color = VZO.temperatureZones[ parseInt( temp ) ];

		return `<option style=background-color:${ color} value=${ zoneId } title="id: ${ zoneId }"; >
			${ zoneAttribute || zoneId }</option>`;

	} );

	if ( zoneAttributes.length === 1 ) {

		zoneOptions = `<option placeholder="" >select an option</option> ${ zoneOptions }`;

	}

	VZOselZone.innerHTML = zoneOptions;

	VZOspnCount.innerHTML = `${ zoneAttributes.length } zones found`;

};



VZO.selectZoneFocus = function( select ) {

	VGC.setPopup();

	const zoneId = select.value;
	//console.log( 'zoneId', zoneId );

	divDragMoveContent.innerHTML = PIN.getZoneAttributes( zoneId );

	const options = select.selectedOptions
	//console.log( 'options', options );

	GBX.meshGroup.children.forEach( element => element.visible = false );

	Array.from( options ).forEach( option => VZO.setZoneVisible( option.value ) );

};



VZO.setZoneVisible = function ( zoneId ) {

	//console.log( 'zoneId', zoneId );

	const children = GBX.meshGroup.children;

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

				//zoneData = VZO.zones.find( zone => zone.includes( zoneId ) )
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

VZO.resetColors = function( ) {

	GBX.meshGroup.children.forEach( ( mesh, index ) => {

		const string = GBX.surfaces[ index ].match( 'surfaceType="(.*?)"')[ 1 ];
		//console.log( 'string', GBX.colorsDefault[ string ]);

		mesh.material.color.set(  parseInt( GBX.colorsDefault[ string ] ) );

	} );

}



VZO.toggleZones = function( button ) {

	button.classList.toggle( "active" );

	const focus = button.classList.contains( "active" );

	if ( focus === true ) {

		GBX.meshGroup.children.forEach( element => element.visible = true );

	} else {

		GBX.meshGroup.children.forEach( element => element.visible = false );

		const options = VZOselZone.selectedOptions
		console.log( 'options', options );

		Array.from( options ).forEach( option =>

			VZO.setZoneVisible( option.title )

		);
	}

};




////////// looks at surface types

VZO.setSurfacesFilteredZone = function( surfaces ) {

	const zoneIds = VZOselZone.selectedOptions;
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

	const surfacesFilteredZone = surfaces ? surfaces : [];

	for ( let zoneId of zoneIds ) {

		const zonesFiltered = GBX.zones.filter( zone => zone.includes( ` id="${ zoneId.value }"` ) );
		//console.log( 'zonesFiltered', zonesFiltered );

		const zonesInZoneIds = zonesFiltered.map( zone => zone.match( ' id="(.*?)"' )[ 1 ] );
		//console.log( 'zonesInZoneIds', zonesInZoneIds );

		const surfacesVisibleZone = zonesInZoneIds.flatMap( zoneId =>
			GBX.surfacesIndexed.filter( surface => surface.includes( `zoneIdRef="${ zoneId }"`  ) )
		);
		//console.log( 'surfacesVisibleZone', surfacesVisibleZone );
/*
		const buttonsActive = VSTdivSurfaceType.getElementsByClassName( "active" ); // collection

		let filterArr = Array.from( buttonsActive ).map( button => button.innerText );

		filterArr = filterArr.length > 0 ? filterArr : VST.filtersDefault;

		const surfacesFiltered = filterArr.flatMap( filter =>

			surfacesVisibleZone.filter( surface => surface.includes( `"${ filter }"` ) )

		);
*/
		surfacesFilteredZone.push( ...surfacesVisibleZone );

		console.log( 'GBX.surfacesFiltered',  GBX.surfacesFiltered );

	}

	return surfacesFilteredZone;

};
