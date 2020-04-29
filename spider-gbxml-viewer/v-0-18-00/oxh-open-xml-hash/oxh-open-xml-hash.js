// copyright pushMe-pullYou authors. MIT license.

const OXH = {};


//OXH.urlDefaultFile = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/bilt-2019-template.zip";

//OXH.urlDefaultFile = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/bilt-2019-template.zip";
//OXH.urlDefaultFile = "https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-downs-broken.xml";
OXH.urlDefaultFile = "https://www.ladybug.tools/spider/gbxml-sample-files/bristol-clifton-down-road-utf16.xml";

//OXH.urlDefaultFile = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/warwick-university-5k-surfaces.zip";
//OXH.urlDefaultFile = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/annapolis-md-single-family-residential-2016.xml"
//OXH.urlDefaultFile = "https://cdn.jsdelivr.net/gh/ladybug-tools/spider@master/gbxml-sample-files/zip/pittsburg-airport.zip";
//OXH.urlDefaultFile = "https://cdn.jsdelivr.net/gh/GreenBuildingXML/Sample-gbXML-Files@master/gbXML_TRK.xml";



OXH.onHashChange = function() { // to be simplified

	const url = !location.hash ? OXH.urlDefaultFile : location.hash.slice(1);

	OXH.timeStart = performance.now();

	OXH.fileName = url.split("/").pop();
	//OXH.requestFileXml(url);

	OXH.fetchXml( url, divContent )

};

window.addEventListener ( 'hashchange', OXH.onHashChange, false );


OXH.requestFileXml= function( url ) {

	if ( !url ) { return; }

	OXH.timeStart = performance.now();

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	//xhr.onprogress = function (xhr) { console.log('loaded', xhr.loaded ); };
	xhr.onload = OXH.callbackXml;
	xhr.send( null );

};


OXH.callbackXml = function( xhr ) {

	//OXH.onProgress( text.length, "load complete" );

	OXH.text = xhr.target.response;

	const eventLoad = new Event( 'OXHonXmlFileLoad' );

	//document.body.addEventListener('OXHonXmlFileLoad', () => { console.log('', 23) }, false);

	document.body.dispatchEvent(eventLoad);

};


OXH.fetchXml = async function( url, target ){

	const buffer = await fetch(new Request(url))
		.then(response => response.arrayBuffer());

	const arr8 = new Uint8Array(buffer);

	const charSet = (arr8.slice(0, 2).join() === "255,254") ? "utf-16le" : "utf-8";

	OXH.text = new TextDecoder( charSet ).decode(buffer);

	//target.innerText = OXH.text;

	timeToLoad = ( performance.now() - OXH.timeStart ).toLocaleString();

	OXH.fileInfo =
	`
		<p>
			<span class=attributeTitle >Name: <span class=attributeValue >${ OXH.fileName }</span></br>
			<span class=attributeTitle >Bytes loaded: </span>: <span class=attributeValue >${ OXH.text.length.toLocaleString() }</span></br>
			<span class=attributeTitle >Time to load: </span>: <span class=attributeValue>${ timeToLoad } ms</span></br>
		</p>
	`;

	if ( OXHdivFileInfo ) { OXHdivFileInfo.innerHTML = OXH.fileInfo; }

	const eventLoad = new Event( 'OXHonXmlFileLoad' );

	//document.body.addEventListener('OXHonXmlFileLoad', () => { console.log('', 23) }, false);

	document.body.dispatchEvent(eventLoad);

}
