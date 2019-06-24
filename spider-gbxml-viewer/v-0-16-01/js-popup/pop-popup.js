/* global Stats, POPbutRateLimits, navPopup, POPdivPopupData, divContents, showdown */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const POP = {
	"copyright": "Copyright 2019 pushMe-pullYou authors. MIT License",
	"date": "2019-06-23",
	"description": "TooToo Menu (POP) generates standard HTML TooToo menu code and content and code that works on computers, tablets and phones",
	"helpFile": "README.md",
	"version": "0.16.01-1pop",
	"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-16-01/js-popup/pop-popup.js"
};




POP.getMenuDivPopup = function() {

	POP.appVersion = document.head.querySelector( '[ name=version ]' ).content;

	POP.appDate = document.head.querySelector( '[ name=date ]' ).content;

	POP.footer = `v${ POP.appVersion } - ${ POP.appDate }`;

	const htm =
	`
		<div style=text-align:right; ><button id=butPopClose onclick="POP.setPopupShowHide(butPopClose);" >×</button></div>

		<div id="POPdivPopupData" ></div>

		<div id="POPdivMessage" ></div>
	`;

	return htm;

};



POP.setPopupShowHide = function( id = POP.popupId, text = "", footer = "" ) {
	//console.log( 'id', id );

	//if ( id ) {

		POP.popupId = id;

		POP.popupId.classList.toggle( "active" );

	//}


	if ( POP.popupId.classList.contains( 'active' ) ) {

		if ( POPdivPopup.innerHTML === "" ) { POPdivPopup.innerHTML = POP.getMenuDivPopup(); }

		if ( text &&  text.toLowerCase().endsWith( ".md" ) ) {

			POP.requestFile( text, POPdivPopupData );
			navPopup.hidden = false;

		} else {

			POPdivPopupData.innerHTML = text;
			navPopup.hidden = false;

		}

		POPdivMessage.innerHTML = footer || POP.footer;

		divContents.addEventListener( 'click', POP.onClickClose, false );
		divContents.addEventListener( 'touchstart', POP.onClickClose, false );

	} else {

		POP.onClickClose();

	}

};



POP.onClickClose = function() {

	if ( POP.popupId.classList.contains( 'active' ) === false ) {

		navPopup.hidden = true;
		POP.popupId.classList.remove( "active" );
		POPdivPopupData.innerHTML = "";
		divContents.removeEventListener( 'click', POP.onClickClose, false );
		divContents.removeEventListener( 'touchstart', POP.onClickClose, false );

	}

};



POP.requestFile = function( url, target ) {

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	//xhr.onerror = ( xhr ) => console.log( 'error:', xhr  );
	//xhr.onprogress = ( xhr ) => console.log( 'loaded', xhr.loaded );
	xhr.onload = ( xhr ) => POP.callbackMarkdown( xhr.target.response, target );
	xhr.send( null );

};



POP.callbackMarkdown = function( markdown, target ) {
	//console.log( '', markdown );

	showdown.setFlavor('github');
	const converter = new showdown.Converter();
	const html = converter.makeHtml( markdown );

	target.innerHTML = html;
	//console.log( '', html );

	//window.scrollTo( 0, 0 );



};
