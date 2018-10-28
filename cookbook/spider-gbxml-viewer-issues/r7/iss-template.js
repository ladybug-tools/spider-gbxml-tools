// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, POP, ISSdivTemplateLog */
/* jshint esversion: 6 */

const ISS = { "release": "R7.0" };

ISS.getMenuTemplate = function() {

	const htm =

	`<details ontoggle=ISS.getTemplateCheck(); >

		<summary>Template</summary>

		<p>
			<i>
				File to be used to create new issues panels
				File Check ${ ISS.release }.
			</i>
		</p>

		<p>
			<button onclick=ISS.setTemplateToggle(this); > template toggle </button>
		</p>

		<div id=ISSdivTemplateLog >ccc</div>

		<details>

			<summary>Current Status 2018-10-27</summary>

			<p>lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?</p>

		</details>

	</details>`;

	return htm;

};



ISS.getTemplateCheck = function() {

	ISSdivTemplateLog.innerHTML = `<p>date & time: ${ ( new Date() ).toLocaleString() } </p>`;


};



ISS.setTemplateToggle = function( button, surfaceArray = [] ) {

	THR.scene.remove( POP.line, POP.particle );

	surfaceArray = GBX.gbjson.Campus.Surface.slice( 0, 100 );

	if ( button.style.fontStyle !== 'italic' ) {

		//console.log( 'surfaceArray', surfaceArray );

		if ( surfaceArray.length ) {

			GBX.surfaceMeshes.children.forEach( element => element.visible = false );

			surfaceMeshes = GBX.surfaceMeshes.children.filter( element => surfaceArray.find( item => item.id === element.userData.gbjson.id ) );
			//console.log( 'surfaceMeshes', surfaceMeshes );
			surfaceMeshes.forEach( mesh => mesh.visible = true );

		} else {

			GBX.surfaceMeshes.children.forEach( element => element.visible = !element.visible );

		}

		button.style.backgroundColor = 'pink';
		button.style.fontStyle = 'italic';

	} else {

		GBX.surfaceMeshes.children.forEach( element => element.visible = true );

		button.style.fontStyle = '';
		button.style.backgroundColor = '';
		button.style.fontWeight = '';

	}

};
