

<script>




function initThreejsOriginal() {

	ifrOriginal.contentWindow.init();

	ifrOriginal.contentWindow.animate();

	requestFile( urlDefaultFile, callbackGbxml )

}


function initThreejsOneBox() {

	ifrOneBox.contentWindow.init();

	ifrOneBox.contentWindow.animate();

	ifrOneBox.contentWindow.controls.autoRotate = true;

}


function requestFile( url, callback ) {

const xhr = new XMLHttpRequest();
xhr.crossOrigin = 'anonymous';
xhr.open( 'GET', url, true );
xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
//xhr.onprogress = onRequestFileProgress;
xhr.onload = callback;
xhr.send( null );


	function onRequestFileProgress( xhr ) {

		FIL.name = xhr.target.responseURL.split( '/').pop();

		FIL.timeToLoad = performance.now() - FIL.timeStart;

		FIL.divFileInfo.innerHTML =
		`
			<div>${ FIL.name}</div>
			<div>bytes loaded: ${xhr.loaded.toLocaleString()}</div>
			<div>time to load: ${ parseInt( FIL.timeToLoad, 10 ).toLocaleString() } ms</div>

		`;

	}

};


function callbackGbxml( xhr ) {

const gbxmlResponseXML =  xhr.target.responseXML;

//const gbxml = xhr.target.responseXML.documentElement;
const gbxml = xhr.target.response;


const meshesArray = ifrOriginal.contentWindow.GBX.parseFileXML( gbxml );

ifrOriginal.contentWindow.scene.add( ...meshesArray );

ifrOriginal.contentWindow.zoomObjectBoundingSphere( ifrOriginal.contentWindow.GBX.surfaceMeshes );

/*
FIL.timeToLoad = performance.now() - FIL.timeStart;

FIL.divFileInfo.innerHTML =
`
	<div>${ FIL.name }</div>
	<div>bytes loaded: ${xhr.loaded.toLocaleString()}</div>
	<div>time to load: ${ parseInt( FIL.timeToLoad, 10 ).toLocaleString() } ms</div>

`;
*/

};

</script>


# Viewer embeddable_gbxml_editor_assembled


<iframe id=ifrOriginal src=sandbox/embeddable_gbxml_editor_assembled/embeddable_gbxml_editor_original.html onload=ifrOriginal.contentWindow.init();ifrOriginal.contentWindow.animate(); width=100% height=500 ></iframe>

<p>

<button onclick=initThreejsOriginal() >start original demo</button>

</p>

<iframe id=ifrOneBox src=sandbox/embeddable_gbxml_editor_assembled/embeddable_gbxml_editor_one_box.html onload=ifrOneBox.contentWindow.init();ifrOneBox.contentWindow.animate(); width=100% height=500 ></iframe>
