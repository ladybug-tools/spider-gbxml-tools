// Copyright 2019 Ladybug Tools authors. MIT License
/* globals COR, butGalleryGbxml, butGallerySampleFiles, butGallerySamples2, butGalleryBuildWell, divMenuItems */
/* jshint esversion: 6 */

var GAL = { "release": "r11.0", "date": "2019-01-01"  };

GAL.iconGitHubMark = "https://pushme-pullyou.github.io/github-mark-64.png"
GAL.iconInfo = `<img src=${GAL.iconGitHubMark} height=14 style=opacity:0.5 >`;

GAL.threeDefaultFile = 'https://www.ladybug.tools/spider-gbxml-tools/gbxml-viewer-basic/';

var GALdetGallery, GALdivgallery;


GAL.currentStatus =
	`
		<h3>GAL ${ GAL.release} status ${ GAL.date }</h3>

		<p>Sample files gallery script.</p>

		<p>This script is ready for testing. Generally it appears to be working well.</p>

		<p>We are always looking for more sample files and more complete attributions.</p>

		<p>
			<ul>
				<li>2018-12-29 ~ Add helpItem class</li>
				<li>2018-12-28 ~ Move HTML from core script to gallery script</li>
				<li>2018-12-28 ~ Move current status to Pop-Up</li>
				<li>2018-12-28 ~ Add and edit text content</li>
				<li>2018-12-11 ~ Add ZIP file gallery button & menu</li>
				<li>2018-12-11 ~ significant code refactor</li>
			</ul>
		</p>

		<p>
			<a href="https://www.ladybug.tools/spider-gbxml-tools/#sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-gallery-sample-files/README.md" target="_blank">
			gal-sample-files-gallery-gbxml.js Read Me file</a>
		</p>

	`;



GAL.getMenuSampleFilesGallery = function( buttons, target ) {

	const htm =
	`
		<details>

			<summary title="gbXML files on the web for exploring, learning and testing" >Open gbXML sample files
				<a id=galSum class=helpItem href="JavaScript:MNU.setPopupShowHide(galSum,GAL.currentStatus);" style=float:right; >&nbsp; ? &nbsp;</a>
			</summary>

			<p>This script obtains links to sample gbXML files from a variety of sources via GitHub API, updates location hash with selected link causing selected file to be loaded.</p>

			<p>
				<button id="butGalleryGbxml"
					onclick = GAL.setGALdivGallery(this) >
					gbXML.org
				</button>

				<button id=butGallerySampleFiles
					onclick = GAL.setGALdivGallery(this) >
					Samples1
				</button>

				<button id=butGallerySamples2
					onclick = GAL.setGALdivGallery(this) >
					Samples2
				</button>

				<button id=butGalleryBuildWell
					onclick = GAL.setGALdivGallery(this) >
					Build Well
				</button>

				<button id=butGalleryZip
					onclick = GAL.setGALdivGallery(this) >
					ZIP files
				</button>
			</p>

			<div id=GALdivSampleFileItems ></div>

			<hr>

			<div id=GALdivFileInfo >

				<p>Click button to view list of files</p>

				<p>When open, tooltips will show info for icons</p>

			</div>

			<br>

			<hr>

		</details>

	`;

	return htm;

}



GAL.setGALdivGallery = function( button ) {
	//console.log( 'button', button );

	// Um, this seems like a kind of dorky way of doing things. On the other hand, it works.

	if ( button.id === 'butGalleryGbxml' ) {

		GAL.user = 'GreenBuildingXML';
		GAL.repo = '/Sample-gbXML-Files';
		GAL.pathRepo = '';
		GAL.title = 'gbXML Sample Files on GitHub';
		GAL.button = butGalleryGbxml;

	} else if ( button.id === 'butGallerySampleFiles' ) {

		GAL.user = 'ladybug-tools';
		GAL.repo = '/spider';
		GAL.pathRepo = 'gbxml-sample-files/';
		GAL.title = 'Ladybug Tools/Spider gbXML Viewer sample files on GitHub';
		GAL.button = butGallerySampleFiles;

	} else if ( button.id === 'butGallerySamples2' ) {

		GAL.user = 'ladybug-tools';
		GAL.repo = '/spider';
		GAL.pathRepo = 'gbxml-sample-files/samples-2/';
		GAL.title = 'Ladybug Tools/Spider gbXML Viewer sample files #2 on GitHub';
		GAL.button = butGallerySamples2;

	} else if ( button.id === 'butGalleryBuildWell' ) {

		GAL.user = 'ladybug-tools';
		GAL.repo = '/spider';
		GAL.pathRepo = 'cookbook/07-create-exportable-buildings/test-gbxml-files/';
		GAL.title = 'Build Well on GitHub';
		GAL.button = butGalleryBuildWell;

	} else if ( button.id === 'butGalleryZip' ) {

		GAL.user = 'ladybug-tools';
		GAL.repo = '/spider';
		GAL.pathRepo = 'gbxml-sample-files/zip/';
		GAL.title = 'Ladybug Tools/Spider gbXML Viewer sample ZIP files #2 on GitHub';
		GAL.button = butGalleryZip;

	}

	GAL.urlGitHubApiContents = 'https://api.github.com/repos/' + GAL.user + GAL.repo + '/contents/' + GAL.pathRepo;
	GAL.urlGitHubPage = 'https://rawgit.com/' + GAL.user + GAL.repo + '/master/' + GAL.pathRepo;
	GAL.urlGitHubSource = 'https://github.com/' + GAL.user + GAL.repo + '/blob/master/' + GAL.pathRepo;

	const buttons = GALdivSampleFilesGallery.querySelectorAll( "button" );

	buttons.forEach( butt => butt.classList.remove( 'active' ) );

	button.classList.add( 'active' );

	GALdivSampleFileItems.innerHTML =
	`
		<details id="GALdetGallery" class="app-menu" open >

			<summary>${ GAL.title }</summary>

			<div id=GALdivGallery ></div>

			<p>Click any ${ GAL.iconInfo } icon to view file source code on GitHub.</p>

			<p>Click any file title to view the file in this script.</p>

			<p>Click any ❐ icon to go full screen & get link to individual file.</p>

			<p>Tool tips provide file size.

		</details>

	`;

	GAL.requestFile( GAL.urlGitHubApiContents, GAL.callbackGitHubMenu );

};



GAL.requestFile = function( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.crossOrigin = 'anonymous';
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	xhr.onprogress = onRequestFileProgress;
	xhr.onload = callback;
	xhr.send( null );


	function onRequestFileProgress( xhr ) {

		let name = xhr.target.responseURL.split( '/').pop();

		name = name ? GAL.user + '/' + name : GAL.user + GAL.repo;

		GALdivFileInfo.innerHTML =
		`
			Files from: ${ name }<br>
			Bytes loaded: ${ xhr.loaded.toLocaleString() }<br>
		`;

	}

};



GAL.callbackGitHubMenu = function( xhr ) {

	const response = xhr.target.response;
	const files = JSON.parse( response );

	let htm = '';

	for ( let file of files ) {

		//const file = files[ i ];

		if ( file.name.toLowerCase() === 'README.md' ||

			( file.name.toLowerCase().endsWith( '.xml' ) === false && file.name.toLowerCase().endsWith( '.zip' ) === false )

		) { continue; }

		const fileName = encodeURI( file.name );
		//console.log( 'fileName', fileName );

		htm +=

		`<div style=margin:4px 0; >

			<a href=${ GAL.urlGitHubSource + fileName } title="Edit me" >${ GAL.iconInfo }</a>

			<a href=#${ GAL.urlGitHubPage + fileName } title="${ file.size.toLocaleString() } bytes" >${ file.name }</a>

			<a href=${ GAL.threeDefaultFile }#${ GAL.urlGitHubPage }${ fileName } title="Link to just this file" >&#x2750;</a>

		</div>`;

	}

	GALdivGallery.innerHTML = htm;

};
