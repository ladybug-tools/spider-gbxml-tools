// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/file-reader
// 2020-01-15
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const FRJ = {};



FRJ.init = function () {

	FRJdivFileReaderJson.innerHTML += FRJ.getMenu();

};



FRJ.getMenu = function () {

	const htm = `
		<span class="info">?? <span class="infoTooltip">
			See <a href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader" target="_blank">file reader on mdn</a>
			for details regarding opening a file on your computer in JavaScript.
		</span></span>


	<div>Open a file on your computer</div>


	<!-- accept = '.rad, .res, .pts' multiple -->

	<p>
		<input type=file id=FRTinpFile onchange=FRJ.openFile(this); accept=".json" >
	</p>

	<div id=FRJdivOnLoad ></div>
<!--
	<div>
	Raw JSON
	<textarea id=FRJtxtRawJson style=height:100px;overflow:auto;width:100%; ></textarea>
	</div>
-->

	<p id=FRTpStats ></p>

`;

	return htm;

};


FRJ.openFile = function ( files ) {

	FRJ.timeStart = performance.now();

	const reader = new FileReader();
	reader.onload = ( event ) => {

		FRJ.files = files;
		FRJ.result = reader.result;

		FRJ.json = JSON.parse( FRJ.result );

		FRJ.event = new Event( "onloadJson", {"bubbles": true, "cancelable": false, detail: true } );

		//window.addEventListener( "onloadjson", FRJ.onLoad, false )

		FRJ.onLoad();

		//alert( "Should be working soon!");

		window.dispatchEvent( FRJ.event );


	};

	reader.readAsText( files.files[ 0 ] );

};


FRJ.onLoad = function () {

	//FRTtxtArea.innerHTML = FRJ.result;
	const files = FRJ.files;

	SAM.onLoadSam( FRJ.json );

	//FRJtxtRawJson.value = FRJ.result;

	JTV.json = FRJ.json;
	JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, FRJ.json, 0 );


	FRJdivOnLoad.innerHTML = `
	<p>
		name: ${ files.files[ 0 ].name }<br>
		size: ${ files.files[ 0 ].size.toLocaleString() } bytes<br>
		type: ${ files.files[ 0 ].type }<br>
		modified: ${files.files[ 0 ].lastModifiedDate.toLocaleDateString() }<br>
		time to load: ${ ( performance.now() - FRJ.timeStart ).toLocaleString() } ms
	</p>`;

	//GFOdivFileLoaded.innerHTML = "";

	//console.log( 'FRJ files', files.files );
	//console.log( 'FRJ event', event );

};
