/* globals GBX, GBXU, THR, PIN, VGC, VSPdetMenu, divDragMoveContent, VSPselSpace, VSPinpAttribute, VSPspnCount, VSPdivReportsLog, VSPselAttribute */
// jshint esversion: 6
// jshint loopfunc: true

const VSP = {

	script: {

		copyright: "Copyright 2019 Ladybug Tools authors",
		date: "2019-07-25",
		description: "View the surfaces in a gbXML file by selecting one or more spaces from a list of all spaces",
		helpFile: "../v-0-17-01/js-view-gbxml/vsp-view-spaces.md",
		license: "MIT License",
		sourceCode: "js-view-gbxml/vsp-view-spaces.js",
		version: "0.17-01-1vsp"

	}

};



VSP.getMenuViewSpaces = function() {

	const source = `<a href=${ MNU.urlSourceCode + VSP.script.sourceCode } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const help = VGC.getHelpButton("VSPbutSum",VSP.script.helpFile,POP.footer,source);

	const selectOptions = [ "id", "CADObjectId", "spaceType", "Name" ]
		.map( option => `<option ${ option === "Name" ? "selected" : "" } >${ option }</option>`);

	const htm =
	`
		<details id=VSPdetMenu ontoggle=VSP.setViewSpacesOptions(); >

			<summary>VSP Spaces </summary>

			${ help }

			<p>Display surfaces by space. <span id="VSPspnCount" ></span></p>

			<p>
				<input type=search id=VSPinpAttribute oninput=VGC.setSelectedIndex(this,VSPselSpace) placeholder="Enter an attribute" >
			</p>

			<div id="VSPdivViewSpaces" >
				<select id=VSPselSpace onchange=VSP.selSpacesFocus(this); multiple style=min-width:15rem; ></select
			</div>

			<p id="VSPdivReportsLog" ></p>

			<p>Attribute to show:
				<select id=VSPselAttribute oninput=VSP.setViewSpacesOptions(); >${ selectOptions }</select></p>

			<p>Select multiple spaces by pressing shift or control keys</p>

			<p>
				<button onclick=VGC.toggleViewSelectedMeshes(this,VSPselSpace,VSP.visible); >
					Show/hide all spaces
				</button>
			</p>

		</details>
	`;

	return htm;
};



VSP.setViewSpacesOptions = function() {

	if ( VSPdetMenu.open === false ) { return; }

	VSPinpAttribute.value = "";

	VSPselSpace.size = GBX.spaces.length > 10 ? 10 : GBX.spaces.length;

	const attribute = VSPselAttribute.value;

	const options = GBX.spaces.map( ( space, index ) => {

		let text;

		if ( [ "id", "spaceType" ].includes( attribute ) ) {

			text = space.match( `${ attribute }="(.*?)"` );

		} else if ( [ "Name", "CADObjectId" ].includes( attribute ) ) {

			text = space.match( `<${ attribute }>(.*?)<\/${ attribute }>` );

		}
		text = text ? text[ 1 ] : "";

		text = text ? text : "no data in file";

		return { text, index };

	} );

	options.sort( (a, b) => b - a );

	let color;

	const spaceIds = GBX.spacesJson.map( space => space.spaceId );

	const htmOptions = options.map( option => {

		color = color === 'pink' ? '' : 'pink';

		return `<option style=background-color:${ color } value=${ spaceIds[ option.index ]}
			title="${ spaceIds[ option.index ] }" >${ option.text }</option>`;

	} );

	VSPselSpace.innerHTML = htmOptions;

	VSPspnCount.innerHTML = `${ GBX.spaces.length } spaces found.`;

	THR.controls.enableKeys = false;

};



VSP.selSpacesFocus = function( select ) {

	VGC.setPopupBlank();

	GBX.meshGroup.children.forEach( element => element.visible = false );

	VSP.ids = Array.from( select.selectedOptions ).map( option => option.value );

	VSP.ids.forEach( id => // is there a simpler logic?

		GBX.meshGroup.children.filter( mesh => mesh.userData.spaceIds.includes( id ) )
			.filter( mesh => PFO.surfaceTypesActive.includes( mesh.userData.surfaceType ) )
			.map( mesh => mesh.visible = true )
	);


	VSP.visible = GBX.meshGroup.children.filter( mesh => mesh.visible === true ).map( mesh => mesh.userData.index );

	divDragMoveContent.innerHTML = PCO.getSpaceAttributes( VSPselSpace.value );

};