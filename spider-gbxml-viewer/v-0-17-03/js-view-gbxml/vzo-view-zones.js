/* globals MNU, POP, GBX, VGC, PCO, THREE, divDragMoveContent, VZOselZone, VZOdetMenu
112	VZOinpSelectIndex
116	VZOselAttribute
152	VZOselElement, VZOspnCount
*/
// jshint esversion: 6
// jshint loopfunc: true


const VZO = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-31",
		description: "View the surfaces in a gbXML file by selecting one or more zones from a list of all zones",
		helpFile: "js-view-gbxml/vzo-view-zones.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vzo-view-zones.js",
		version: "0.17-01-3vzo"

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
	"#de385", "#de385", "#de385", "#de385", "#de385", "#de385", "#de385", "#de385",
	"#d50032", "#d50032", "#d50032", "#d50032", "#d50032",  "#d50032",  "#d50032",  "#d50032"
];



VZO.getMenuViewZones = function() {

	const source = `<a href=${ MNU.urlSourceCode + VZO.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help = VGC.getHelpButton("VZObutSum", VZO.script.helpFile, POP.footer, source );

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
				<button id="butVZOtxt" onclick="POP.setPopupShowHide(butVZOtxt,VZO.script.helpFile);">? / read me</button>.
			</p>
			<p>
				<mark>Current version is Celsius only</mark>. May be slow on large files. Will speed things up.
			</p>

			</p>
				<span id="VZOspnCount" ></span>.
			<p>
				<input type=search id=VZOinpSelectIndex oninput=VGC.setSelectedIndex(this,VZOselZone) placeholder="Enter an attribute" >
			</p>

			<p>
				<select id=VZOselZone onclick=VZO.selectZoneFocus(this); oninput=VZO.selectZoneFocus(this); style=width:100%; multiple ></select
			</p>

			<div id="VZOdivReportsLog" ></div>

			<p>Attribute to show: <select id=VZOselAttribute oninput=VZO.getZonesOptions(); >${ VZO.selectAttribute }</select></p>

			<p>Value to show: <select id=VZOselElement oninput=VZO.getZonesOptions(); >${ VZO.selectElement }</select></p>

			<p>Select multiple surfaces by pressing shift or control keys</p>

			<p><button onclick=VZO.resetColors(); >reset colors</button> </p>

		</details>
	`;

	return htm;

};



VZO.getZonesOptions = function() {

	if ( VZOdetMenu.open === false ) { return; }

	VZOinpSelectIndex.value = "";

	VZOselZone.size = GBX.zones.length > 10 ? 10 : GBX.zones.length;

	const attribute = VZOselAttribute.value;
	//console.log( 'attribute', attribute );

	let zoneArr;

	let zoneAttributes = GBX.zones.map( zone => {

		if ( ["CADObjectId", "Name", "TypeCode" ].includes( attribute )) {

			zoneArr = zone.match( `<${ attribute }(.*?)>(.*?)</${ attribute }>` );
			zoneArr = zoneArr ? zoneArr[ 2 ] : "";

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
		let temp = tempArr ? tempArr[ 2 ] : 20;
		temp = temp < 0 ? 0 : temp;
		temp = temp > 36 ? 36 : temp;

		//console.log( 'temp', temp );

		const color = VZO.temperatureZones[ parseInt( temp ) ];

		return `<option style=background-color:${ color} value=${ zoneId } title="id: ${ zoneId }"; >
			${ zoneAttribute || zoneId }</option>`;

	} );
	//console.log( 'zoneOptions', zoneOptions );

	VZOselZone.innerHTML = zoneOptions;

	VZOspnCount.innerHTML = `${ zoneAttributes.length } zone(s) found`;

};



VZO.selectZoneFocus = function( select ) {

	VGC.setPopupBlank();

	const zoneId = select.value;
	//console.log( 'zoneId', zoneId );

	divDragMoveContent.innerHTML = PCO.getZoneAttributes( zoneId );

	const options = select.selectedOptions;
	//console.log( 'options', options );

	GBX.meshGroup.children.forEach( element => element.visible = false );

	Array.from( options ).forEach( option => VZO.setZoneVisible( option ) );

};



VZO.setZoneVisible = function ( option ) {

	const types = [ "InteriorFloor", "SlabOnGrade", "UndergroundSlab" ];

	GBX.meshGroup.children.forEach( mesh => {

		if (mesh.userData.zoneId === option.value && types.includes( mesh.userData.surfaceType )  ) {

			mesh.visible = true;

			mesh.material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: 2 } );
			mesh.material.color.setStyle( option.style.backgroundColor ); //

		}

	} );

};



//////////

VZO.resetColors = function( ) {

	GBX.meshGroup.children.forEach( ( mesh, index ) => {

		const string = GBX.surfaces[ index ].match( 'surfaceType="(.*?)"')[ 1 ];
		//console.log( 'string', GBX.colorsDefault[ string ]);

		mesh.material.color.set(  parseInt( GBX.colorsDefault[ string ] ) );

	} );

};



VZO.toggleZones = function( button ) {

	button.classList.toggle( "active" );

	const focus = button.classList.contains( "active" );

	if ( focus === true ) {

		GBX.meshGroup.children.forEach( element => element.visible = true );

	} else {

		GBX.meshGroup.children.forEach( element => element.visible = false );

		const options = VZOselZone.selectedOptions;
		console.log( 'options', options );

		Array.from( options ).forEach( option =>

			VZO.setZoneVisible( option.title )

		);
	}

};

