// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/file-reader
// 2020-01-15
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const FRX = {};



FRX.init = function () {

	const htm = `
<details open>

	<summary>
		File reader

		<span class="info">?? <span class="infoTooltip">
			<a href="https://developer.mozilla.org/en-US/docs/Web/API/FileReader" target="_blank">file reader on mdn</a>
		</span></span>

	</summary>

	<!-- accept = '.rad, .res, .pts' multiple -->

	<p>
		<input type=file id=FRXinpFile onchange=FRX.openFile(this); accept = ".gbxml, .xml"  >
	</p>

	<textarea id=FRXtxtArea style=height:100px;overflow:auto;width:100%; ></textarea>

	<p id=FRXpStats ></p>


</details>`;

	return htm;

};


FRX.openFile = function ( files ) {

	FRX.timeStart = performance.now();

	const reader = new FileReader();
	reader.onload = ( event ) => {

		FRX.files = files;
		FRX.result = reader.result;

		FRX.event = new Event( "onloadFRX", {"bubbles": true, "cancelable": false, detail: true } );

		window.addEventListener( "onloadFRX", FRX.onLoad, false )

		window.dispatchEvent( FRX.event );

	};

	reader.readAsText( files.files[ 0 ] );

};


FRX.onLoad = function () {

	FRXtxtArea.innerHTML = FRX.result;
	const files = FRX.files;

	GBX.meshGroup = THR.setSceneNew( GBX.meshGroup);
	GBX.meshGroup.name = "GBX.meshGroup";

	GBX.parseResponse( FRX.result );

	THR.updateGroup(GBX.meshGroup); 

	divFileData.innerHTML = `
	<p>
		name: ${ files.files[ 0 ].name }<br>
		size: ${ files.files[ 0 ].size.toLocaleString() } bytes<br>
		type: ${ files.files[ 0 ].type }<br>
		modified: ${files.files[ 0 ].lastModifiedDate.toLocaleDateString() }<br>
		time to load: ${ ( performance.now() - FRX.timeStart ).toLocaleString() } ms
	</p>`;

	console.log( '', files.files );
	console.log( '', event );
	
};
