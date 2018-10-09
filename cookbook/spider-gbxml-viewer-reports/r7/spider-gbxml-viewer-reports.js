
const REP = {};

REP.colorButtonToggle = 'pink';

REP.getMenuItems = function() {

	const htm  =
	`
		<details ontoggle=divSurfacesByType.innerHTML=REP.getMenuPanelSurfacesByType() >

			<summary >Surfaces by Type </summary>

			<div id=divSurfacesByType ></div>

			<div>
				<p><button class=toggle onclick=REP.setExposedToSunVisible(); >Exposed to Sun</button> </p>
				<p><button class=toggle onclick=GBX.setAllVisible(); >all visible</button></p>
			</div>

		</details>

		<div id=REPdivMenuPanelOpeningsByType >hh</div>

		<div id=REPdivMenuPanelCadObjectsByType >bb</div>

	`;

	return htm;


};


REP.setMenuItems = function() {

	//REP.setMenuPanelSurfacesByType( REPdivMenuPanelSurfacesByType );

	//REP.setMenuPanelOpeningsByType( REPdivMenuPanelOpeningsByType );

	//REP.setMenuPanelCadObjectsByType( REPdivMenuPanelCadObjectsByType );

}

///// Types -

REP.getMenuPanelSurfacesByType = function( target ) {

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
	let txt = `<p>${ types.length } surface types found</p>`;

	for ( let i = 0; i < types.length; i++ ) {

		let color =  GBX.colorsDefault[types[ i ]] ? GBX.colorsDefault[types[ i ]].toString( 16 ) : '';
		color = color.length > 4 ? color : '00' + color;
		//console.log( 'col', color );

		txt +=
		`
			<button class=toggleView onclick=REP.setSurfaceTypeInvisible(this);REP.toggleButtonColor(this);
				value=${ types[ i ] } ><img src="./eye.png" height=18>
			</button>

			<button class=toggle onclick=REP.setSurfaceTypeVisible(this.innerText);
				style="width:12rem;background-color:#${ color } !important;" >
				${ types[ i ] } </button>
					${ typesCount[ i ] }/${ surfaces.length }
		<br>`;

	}

	return txt;

	const details =

	`<details id=REPdetSurfaceTypes >

		<summary >Surfaces by Type &raquo; ` + types.length + ` found</summary>

		<div>` + txt +
			`<p><button class=toggle onclick=REP.setExposedToSunVisible(); >Exposed to Sun</button> </p>
			<p><button class=toggle onclick=GBX.setAllVisible(); >all visible</button></p>
		</div>

	</details>`;


	//target.innerHTML = details;

	const butts = REPdetSurfaceTypes.getElementsByClassName( "toggleView" );

	for ( let butt of butts ) REP.toggleButtonColor( butt );

};



REP.toggleButtonColor = function( that ) {

	const cssText = 'background-color: ' + REP.colorButtonToggle + ' !important; font-style: italic; font-weight: bold';

	if ( that.style.backgroundColor !== REP.colorButtonToggle ) {

		that.style.cssText = cssText;

	} else {

		that.style.cssText = '';

	}

};



////////// various toggles
// all used by REP

	REP.setSurfaceVisibleToggle = function( id ) {

		GBX.surfaceMeshes.visible = true;

		const surfaceMesh = GBX.surfaceMeshes.children.find( element => element.userData.gbjson.id === id );

		surfaceMesh.visible = !surfaceMesh.visible;

	};



	REP.setSurfaceTypeVisible = function( type ) {

		REP.setSurfaceGroupsVisible();

		GBX.surfaceMeshes.children.forEach( element => element.visible = element.userData.gbjson.surfaceType === type? true : false );

		if ( window.CTXdivAttributes ) {

			CTXdivAttributes.innerHTML =

			`<details open>

				<summary>Surface Type: ${type}</summary>

				<p><button onclick=CTX.updateSurfaceType() >Update surface type of the surface</button></p>

				<div><select id=SELselSurfaceType ></select></div>


			</details>

			<hr>`;

		}

		//const surfaces = GBX.gbjson.Campus.Surface;

		let txt = '';

		//for ( let i = 0; i < types.length; i++ ) {
		for ( let i = 0; i < GBX.surfaceTypes.length; i++ ) {

			txt += `<option>${GBX.surfaceTypes[i]}</option>`;

		}

	};



	REP.setSurfaceTypeInvisible = function( button ) {


		for ( let child of GBX.surfaceMeshes.children ) {

			if ( !child.userData.gbjson ) { continue; }

			if ( child.userData.gbjson.surfaceType === button.value && button.style.backgroundColor === REP.colorButtonToggle ) {

				child.visible = false;

			} else if ( child.userData.gbjson.surfaceType === button.value ) {

				child.visible = true;

			}

		}

	};


	REP.setSurfaceGroupsVisible = function( meshesVis = true, edgesVis = true, openingsVis = false ) {

		GBX.surfaceMeshes.visible = meshesVis;
		GBX.surfaceEdges.visible = edgesVis;
		GBX.surfaceOpenings.visible = openingsVis;

	}