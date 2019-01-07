// Copyright 2019 pushMe pullYou authors. MIT License
// jshint esversion: 6
/* globals navMenu */

const HSH = { "release": "R1.2", "date": "2019-01-02" };

HSH.currentStatus =
	`
		<h3>HSH ${ HSH.release} status ${ HSH.date }</h3>

		<p>HSH On Hash Change</p>

		<p>Lists files and folders in a repo in a menu</p>
	`;



HSH.getMenuRepoFilesFolders= function() {

	window.addEventListener ( 'hashchange', HSH.onHashChange, false );

	const htm =
	`
		<details open >

			<summary>All files and folders
				<a id=hshSum class=helpItem href="JavaScript:MNU.setPopupShowHide(hshSum,HSH.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div id = "divBreadcrumbs" ></div>

			<div id = "divMenuItems" ></div>

		</details>

	`;

	return htm;

};



HSH.onHashChange = function() {

	const url = !location.hash ? uriDefaultFile : location.hash.slice( 1 );
	const ulc = url.toLowerCase();

	const crumbs = url.slice( urlGitHubPage.length );
	const pathCurrent = crumbs.lastIndexOf( '/' ) > 0 ? crumbs.slice( 0, crumbs.lastIndexOf( '/' ) ) : '';
	//console.log( 'pathCurrent',  pathCurrent );

	HSH.setMenuGitHubPathFileNames( pathCurrent );

	if ( ulc.endsWith( ".md" ) ) {

		HSH.requestFile( url, FOB.callbackDecider );

	} else if ( ulc.endsWith( '.html' ) ) {

		//divContents.style.maxWidth = '100%';
		//document.body.style.overflow = 'hidden';

		divContents.innerHTML = `<iframe src=${ url } height=900px width=100% ></iframe>`;

	} else if ( /\.(jpe?g|png|ico|svg|gif)$/i.test( ulc )  ) {
	//} else if ( ulc.endsWith( '.gif' ) || ulc.endsWith( '.png' ) || ulc.endsWith( '.jpg' ) || ulc.endsWith( '.ico' ) || ulc.endsWith( '.svg' ) ) {

		divContents.innerHTML = `<img src=${ url } >`;

	} else {

		HSH.requestFile( url, HSH.callbackToTextarea );

	}

};



HSH.requestFile = function( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.crossOrigin = 'anonymous';
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	//xhr.onprogress = function( xhr ) { console.log(  'bytes loaded: ' + xhr.loaded.toLocaleString() ) }; /// or something
	xhr.onload = callback;
	xhr.send( null );

};


/*
HSH.callbackMarkdown = function( xhr ){

	showdown.setFlavor('github');
	const converter = new showdown.Converter();
	const response = xhr.target.response;
	const html = converter.makeHtml( response );

	divContents.style.maxWidth = '800px';
	document.body.overflow = '';
	divContents.innerHTML = html;
	window.scrollTo( 0, 0 );

};



HSH.callbackToTextarea = function( xhr ){

	const response = xhr.target.response;

	divContents.innerHTML = `<textarea style=height:900px;width:100%; >${ response }</textarea>`;

};


HSH.onDrop = function( event ) {

	//console.log( 'event', event );

	const dropUrl = event.dataTransfer.getData( 'URL' );

	if ( dropUrl ) {

		location.hash = dropUrl;

	} else {

		//var file = event.dataTransfer.files[0];
		//console.log(file.name);

		HFOBSH.openFile( event.dataTransfer );
		//console.log( 'ed', event.dataTransfer );

	}

	event.preventDefault();

};



HSH.openFile = function( files ) {

	file = files.files[ 0 ];

	//reader.onprogress = onRequestFileProgress;
	const reader = new FileReader();

	reader.onload = function( event ) {

		//console.log( 'reader', reader );

		if ( file.name.endsWith('.md' ) ) {

			showdown.setFlavor('github');
			const converter = new showdown.Converter();
			const html = converter.makeHtml( reader.result );

			divContents.style.maxWidth = '800px';
			document.body.overflow = '';
			divContents.innerHTML = html;
			window.scrollTo( 0, 0 );

		} else if ( /\.(jpe?g|png|ico|svg|gif)$/i.test( file.name)  ) {

			divContents.innerHTML = `<img src=${ reader.result } >`;

		} else {

			divContents.innerHTML = `<textarea style=height:100%;width:100%; >${ reader.result }</textarea>`;

		}


	};

	if ( /\.(jpe?g|png|ico|svg|gif)$/i.test(file.name) ) {

		reader.readAsDataURL(file);

	} else {

		reader.readAsText( file );

	}


		function onRequestFileProgress( event ) {

			divLog.innerHTML =
				fileAttributes.name + ' bytes loaded: ' + event.loaded.toLocaleString() +
				//( event.lengthComputable ? ' of ' + event.total.toLocaleString() : '' ) +
			'';

		}

};

*/


//////////

HSH.setMenuGitHubPathFileNames = function( path = '' ) {

	const url = urlGitHubApiContents + path;

	HSH.requestFile( url, HSH.callbackGitHubPathFileNames );

	HSH.setBreadcrumbs( path );

};



HSH.callbackGitHubPathFileNames = function( xhr ) {

	const response = xhr.target.response;
	const items = JSON.parse( response );
	const len = pathRepo.length;

	let txt = '';

	if ( items.message ) { console.log( items.message ); return; }

	const ignoreFolders = [ 'data' ]; //, 'plugins'

	for ( let item of items ) {

		if ( item.type === 'dir' ) {

			if ( ignoreFolders.includes( item.name ) ) { continue; }

			txt +=
				'<div style=margin-bottom:8px; >' +
					'<a href=JavaScript:HSH.setMenuGitHubPathFileNames("' + item.path.slice( len )  + '"); >&#x1f4c1; ' +
						item.name  +
					'</a>' +
				'</div>' +
			'';

		}

	};

	const ignoreFiles = [ '.gitattributes', '.gitignore', '404.html' ];

	for ( let item of items ) {

		if ( item.type === 'file' ) {

			if ( ignoreFiles.includes( item.name ) ) { continue; }

			itemPath = encodeURI( item.path.slice( len ) );

			txt += // try grid or flexbox??
				'<table><tr>' +

					'<td><a href="' + urlGitHubSource + '/blob' + branch + itemPath + '" target=_top >' + iconInfo + '</a></td>' +
					'<td>' +

						'<a href=#' + urlGitHubPage + pathRepo + itemPath +
						' title="' + item.size.toLocaleString() + ' bytes" > ' + item.name + '</a> ' +
						( item.path.endsWith( 'html' ) ? '<a href=' + urlGitHubPage + pathRepo + itemPath + ' >&#x2750;</a>' : '' ) +

					'</td>' +

				'</tr></table>';

			// simplify
			if ( ( !location.hash || location.hash.toLowerCase().endsWith( 'readme.md' ) )
				//&& item.path !== 'README.md'
				&& item.name.toLowerCase() === 'readme.md' ) {

				location.hash = urlGitHubPage + pathRepo + itemPath;

			}

		}

	}

	divMenuItems.innerHTML = txt;

};



HSH.setBreadcrumbs = function( path ) {

	let txt =
		'<b>' +
			'<a href=JavaScript:HSH.setMenuGitHubPathFileNames(); title="home folder" >' +

				( pathRepo ? pathRepo : '<span style=font-size:24px >&#x2302</span>' ) +

			'</a> &raquo; ' +
		'</b>';

	const folders = path ? path.split( '/' ) : [] ;

	let str = '';

	for ( let folder of folders ) {

		str += folder + '/';

		txt += '<b><a href=JavaScript:HSH.setMenuGitHubPathFileNames("' + str.slice( 0, -1 ) + '"); >' + folder + '</a> &raquo; </b>';

	}

	divBreadcrumbs.innerHTML = txt;

};