// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, detSurfacesByType, divSurfacesByType, butAllVisible, butExposeToSun */
/* jshint esversion: 6 */


const REPT = {};

REPT.colorButtonToggle = 'pink';
REPT.cssText = `background-color: ${ REPT.colorButtonToggle } !important; font-style: italic; font-weight: bold`;


REPT.getTypesMenuItems = function() {

	const htm  =
	`
		<br>
		<i>View surfaces in groups</i>
		<details id=detSurfacesByType ontoggle=divSurfacesByType.innerHTML=REPT.getMenuPanelSurfacesByType();REPT.initButtons(); >

			<summary >Surfaces by Type </summary>

			<div id=divSurfacesByType ></div>

			<p>
				<button id=butAllVisible class=toggle onclick=REPT.toggleAllVisible(this); >all visible</button>
				<button id=butExposeToSun class=toggle onclick=REPT.toggleExposedToSunVisible(this); >Exposed to Sun</button>
			</p>

			<i>What more would we like to know? total area for each type? Other info?</i>

		</details>


		<details ontoggle=REPselCadIdGroups.innerHTML=REPT.getMenuPanelCadObjectsByType(); >

			<summary >CAD Objects by Type</summary>

			<p>Select one or more types using the shift or control/command keys</p>

			<p>
				<select id="REPselCadIdGroups" onchange=REPT.setCadObjectTypeVisible(this); size=10 multiple >
				</select>
			</p>

		</details>


		<details onToggle="" >

			<summary>Openings</summary>

			<div id=divOpenings>Coming soon</div>

			<hr>

		</details>

		<hr>
	`;

	return htm;

};


///// Surfaces by Type

REPT.getMenuPanelSurfacesByType = function( target ) {

	const surfaces = GBX.gbjson.Campus.Surface;
	const types = [];
	const typesCount = [];

	for ( let surface of surfaces ) {

		const index = types.indexOf( surface.surfaceType );

		if ( index < 0 ) {

			types.push( surface.surfaceType );
			typesCount[ types.length - 1 ] = 1;

		} else {

			typesCount[ index ] ++;

		}

	}

	// do we want to sort types?

	let txt = `<p>${ surfaces.length } surfaces with ${ types.length } surface types found</p>`;

	for ( let i = 0; i < types.length; i++ ) {

		let color =  GBX.colorsDefault[types[ i ]] ? GBX.colorsDefault[types[ i ]].toString( 16 ) : '';
		color = color.length > 4 ? color : '00' + color; // otherwise greens no show
		//console.log( 'col', color );

		txt +=
		`
			<button class=toggleView onclick=REPT.setSurfaceTypeInvisible(this);REPT.toggleButtonColor(this); value=${ types[ i ] } >
				<img src="./eye.png" height=18>
			</button>

			<button onclick=REPT.setSurfaceTypeVisible(this.innerText);
				style="width:12rem;background-color:#${ color } !important;" >
				${ types[ i ] } </button>
					${ typesCount[ i ] }/${ surfaces.length }
		<br>`;

	}

	return txt;

};



REPT.initButtons = function() {

	if ( detSurfacesByType.open === true ) {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );
		butAllVisible.style.cssText = REPT.cssText;

		const butts = Array.from( divSurfacesByType.getElementsByClassName( "toggleView" ) );
		butts.forEach( butt => butt.style.cssText = REPT.cssText );

	}

};



REPT.toggleButtonColor = function( button ) {

	if ( button.style.backgroundColor !== REPT.colorButtonToggle ) {

		button.style.cssText = REPT.cssText;

		return true;

	} else {

		button.style.cssText = '';

		return false;

	}

};



REPT.toggleAllVisible = function( button ) {

	const visible = REPT.toggleButtonColor( button );
	const butts = Array.from( divSurfacesByType.getElementsByClassName( "toggleView" ) );

	butExposeToSun.style.cssText = '';

	if ( visible === true ) {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		butts.forEach( butt => butt.style.cssText = REPT.cssText );

	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = false );

		butts.forEach( butt  => butt.style.cssText = '' );

	}

};



REPT.toggleExposedToSunVisible = function( button ) {

	const visible = REPT.toggleButtonColor( button );

	butAllVisible.style.cssText = '';

	//REPT.setSurfaceGroupsVisible();

	if ( visible === true ) {

		GBX.surfaceMeshes.children.forEach( element => element.visible = element.userData.gbjson.exposedToSun === "true" ? true : false );

	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

	}

};



//////////

REPT.getMenuPanelCadObjectsByType = function( target ) {

	const surfaces = GBX.gbjson.Campus.Surface;
	const cadIds = [];

	for ( let surface of surfaces ) {

		if ( !surface.CADObjectId || typeof surface.CADObjectId !== 'string' ) { continue; }

		const id = surface.CADObjectId.replace( / \[(.*?)\]/gi, '' ).trim();

		if ( !cadIds.includes( id ) ) { cadIds.push( id ); }

	}
	//console.log( 'cadIds', cadIds );

	cadIds.sort();

	let htm = '';

	for ( let id of cadIds ){

		htm += '<option>' + id + '</option>';

	}

	return htm;

};



//////////

REPT.setSurfaceTypeVisible = function( type ) {

	//REPT.setSurfaceGroupsVisible();

	GBX.surfaceMeshes.children.forEach( element => element.visible = element.userData.gbjson.surfaceType === type? true : false );

};



REPT.setCadObjectTypeVisible = function( CADObjectGroup ) {

	//REPT.setSurfaceGroupsVisible();

	for ( let child of GBX.surfaceMeshes.children ) {

		child.visible = false;

	}


	for ( let option of CADObjectGroup.selectedOptions ) {

		const cadId = option.value.trim();
		//console.log( 'cadId', cadId );

		for ( let child of GBX.surfaceMeshes.children ) {

			if ( !child.userData.gbjson.CADObjectId || typeof child.userData.gbjson.CADObjectId !== 'string' ) { continue; }

			const id = child.userData.gbjson.CADObjectId.replace( /\[(.*?)\]/gi, '' ).trim() ;

			if ( id === cadId ) { child.visible = true; }

		}

	}

};



REPT.setSurfaceTypeInvisible = function( button ) {

	for ( let child of GBX.surfaceMeshes.children ) {

		if ( !child.userData.gbjson ) { continue; }

		if ( child.userData.gbjson.surfaceType === button.value && button.style.backgroundColor === REPT.colorButtonToggle ) {

			child.visible = false;

		} else if ( child.userData.gbjson.surfaceType === button.value ) {

			child.visible = true;

		}

	}

};


// needed?? wanted??
REPT.setSurfaceGroupsVisible = function( meshesVis = true, edgesVis = true, openingsVis = false ) {

	GBX.surfaceMeshes.visible = meshesVis;
	GBX.surfaceEdges.visible = edgesVis;
	GBX.surfaceOpenings.visible = openingsVis;

}