// Copyright 2018 Ladybug Tools authors. MIT License
/* globals GBX, REPTdetSurfacesByType, divSurfacesByType, butAllVisible, butExposeToSun */
/* jshint esversion: 6 */


const REPT = { "release": "7.1" };

REPT.colorButtonToggle = 'pink';
REPT.cssText = `background-color: ${ REPT.colorButtonToggle } !important; font-style: italic; font-weight: bold`;


REPT.onToggleReports = function(that) {
	//console.log( 'that', that.children[ 0 ] );


}


REPT.getTypesMenuItems = function( that ) {

	const htm  =

		`<i>View surfaces in groups ${ REPT.release }
				<a href="https://www.ladybug.tools/spider-gbxml-tools/#cookbook/spider-gbxml-viewer-reports/README.md" title="View Reports Read Me file in new tab" target="_blank"> ? </a>
		</i>

		<details id=REPTdetSurfacesByType ontoggle=divSurfacesByType.innerHTML=REPT.getMenuPanelSurfacesByType();REPT.initButtons(); >

			<summary >Surfaces by Type </summary>

			<div id=divSurfacesByType ></div>

			<p>
				<button id=butAllVisible class=toggle onclick=REPT.toggleAllVisible(this); >all visible</button>
				<button id=butExposeToSun class=toggle onclick=REPT.toggleExposedToSunVisible(this); >Exposed to Sun</button>
			</p>

			<p>
				<i>Updates of button colors needs more work.<br>See also 'Numbers' panel in AGV R14. Coming here in due course</i>
			</p>

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
			<button class=toggleView onclick=REPT.setSurfaceTypeInvisible(this);REPT.toggleButtonColor(this); value=${ types[ i ] } title="Show/hide ${ types[ i ] } surfaces" >
			&#x1f441;
			</button>

			<button onclick=REPT.setSurfaceTypeVisible(this.innerText);
				style="width:12rem;background-color:#${ color } !important;" title="Show only ${ types[ i ] } surfaces">
				${ types[ i ] } </button>
					${ typesCount[ i ] }/${ surfaces.length }
		<br>`;

	}

	return txt;

};



REPT.initButtons = function() {

	if ( REPTdetSurfacesByType.open === true ) {

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

	THR.scene.remove( POP.line, POP.particle );  // POP must be loaded

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

	THR.scene.remove( POP.line, POP.particle );  // POP must be loaded

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
	//console.log( 'type ', type );

	THR.scene.remove( POP.line, POP.particle );  // POP must be loaded

	GBX.surfaceMeshes.children.forEach( element => element.visible = element.userData.gbjson.surfaceType === type? true : false );

	const butts = Array.from( divSurfacesByType.getElementsByClassName( "toggleView" ) );
	butts.forEach( butt => butt.style.cssText = '' );

	butt = butts.find( item => item.value === type )
	butt.style.cssText = REPT.cssText;

};



REPT.setCadObjectTypeVisible = function( CADObjectGroup ) {

	//REPT.setSurfaceGroupsVisible();

	THR.scene.remove( POP.line, POP.particle );  // POP must be loaded

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

	THR.scene.remove( POP.line, POP.particle );  // POP must be loaded

	butAllVisible.style.cssText = '';

	butExposeToSun.style.cssText = '';

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