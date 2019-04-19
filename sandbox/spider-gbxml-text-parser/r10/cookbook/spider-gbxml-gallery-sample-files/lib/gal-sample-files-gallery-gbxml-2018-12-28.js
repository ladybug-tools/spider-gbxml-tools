// Copyright 2018 Ladybug Tools authors. MIT License
/* globals COR, butGalleryGbxml, butGallerySampleFiles, butGallerySamples2, butGalleryBuildWell, divMenuItems */
/* jshint esversion: 6 */

var GAL = { "release": "r10.1", "date": "2018-12-13"  };

GAL.iconGitHubMark = 'https://pushme-pullyou.github.io/github-mark-64.png';

GAL.threeDefaultFile = 'https://www.ladybug.tools/spider-gbxml-tools/gbxml-viewer-basic/';

var GALdetGallery, GALdivgallery;


GAL.currentStatus =
	`

		<details>

			<summary>GAL ${ GAL.release} status ${ GAL.date }</summary>

			<p>Obtain links to sample gbXML files via GitHub API and update location hash with selected link<./p>

			<p>Updating the URL hash causes the indicated file to be loaded.</p>

			<p>This module is ready for testing.</p>

			<p>
				<ul>
					<li>2018-12-11 ~ Add ZIP file gallery button & menu</li>
					<li>2018-12-11 ~ significant code refactor</li>
				</ul>
			</p>

			<p>
				<a href="https://www.ladybug.tools/spider-gbxml-tools/#sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-gallery-sample-files/README.md" target="_blank">
				gal-sample-files-gallery-gbxml.js Read Me file</a>
			</p>

		</details>

	`;



GAL.getMenuSampleGalleries = function( buttons, target ) {

	GALdivCurrentStatus.innerHTML = GAL.currentStatus;

	const htm =
	`
		<p>
			<button id="butGalleryGbxml" class="btn btn-primary btn-sm"
				onclick = GAL.setGALdivGallery(this) >
				gbXML.org
			</button>

			<button id=butGallerySampleFiles class="btn btn-primary btn-sm"
				onclick = GAL.setGALdivGallery(this) >
				Samples1
			</button>

			<button id=butGallerySamples2 class="btn btn-primary btn-sm"
				onclick = GAL.setGALdivGallery(this) >
				Samples2
			</button>

			<button id=butGalleryBuildWell class="btn btn-primary btn-sm"
				onclick = GAL.setGALdivGallery(this) >
				Build Well
			</button>

			<button id=butGalleryZip class="btn btn-primary btn-sm"
				onclick = GAL.setGALdivGallery(this) >
				ZIP files
			</button>
		</p>

	`;

	return htm;

}



GAL.setGALdivGallery = function( button ) {
	//console.log( 'but', button );

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

	buttons = GALdivSampleFileButtons.querySelectorAll( "button" );

	buttons.forEach( butt => butt.classList.remove( 'active' ) );

	button.classList.add( 'active' );

	GALdivSampleFileItems.innerHTML =
	`
		<details id="GALdetGallery" class="app-menu" open >

			<summary>${ GAL.title }</summary>

			<div id=GALdivGallery ></div>

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

	const iconInfo = `<img src=${GAL.iconGitHubMark} height=14 >`;
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

			<a href=${ GAL.urlGitHubSource + fileName } title="Edit me" >${ iconInfo }</a>

			<a href=#${ GAL.urlGitHubPage + fileName } title="${ file.size.toLocaleString() } bytes" >${ file.name }</a>

			<a href=${ GAL.threeDefaultFile }#${ GAL.urlGitHubPage }${ fileName } title="Link to just this file" >&#x2750;</a>

		</div>`;

	}

	GALdivGallery.innerHTML = htm;

};
