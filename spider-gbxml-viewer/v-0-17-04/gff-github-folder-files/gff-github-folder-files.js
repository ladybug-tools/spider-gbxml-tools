/* globals GFFdivFileInfo, GFFdivGithubFoldersFiles */
/* jshint esversion: 6 */
/* jshint loopfunc: true */


const GFF = {

	script: {

		"copyright": "Copyright 2019 Ladybug Tools authors. MIT License",
		"date": "2019-05-31",
		"description": "Get data from selected GitHub folders and files and display as links in details/summary that update location.hash",
		"helpFile": "js-menu/gff-github-folder-files.md",
		"urlSourceCode": "https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/spider-gbxml-viewer/v-0-17-01/js-menu/gff-github-folder-files.js",
		"version": "0.17.0-0gff",
	}
};

GFF.iconGitHubMark = "https://pushme-pullyou.github.io/github-mark-64.png";
GFF.iconInfo = `<img src=${GFF.iconGitHubMark} height=14 style=opacity:0.5 alt="Ladybug Tools logo" >`;

GFF.items = [
{
	"user": "GreenBuildingXML",
	"repo": "/Sample-gbXML-Files",
	"pathRepo": "",
	"title": "gbXML sample Files",
	"subTitle": "Sample Files on GitHubSample files from the gXML organization",
	"button": "butGalleryGbxml"
},
{
	"user": "ladybug-tools",
	"repo": "/spider",
	"pathRepo": "gbxml-sample-files/",
	"title": "Spider gbXML files ",
	"subTitle": "Ladybug Tools/Spider gbXML Viewer sample files from a variety of sourceson GitHub",
	"button": "butGallerySampleFiles"
},
{
	"user": "ladybug-tools",
	"repo": "/spider",
	"pathRepo": "gbxml-sample-files/samples-2/",
	"title": "Spider gbXML files #2",
	"subTitle": "Ladybug Tools/Spider gbXML Viewer sample files #2 on GitHub",
	"button": "butGallerySamples2"
},
{
	"user": "ladybug-tools",
	"repo": "/spider",
	"pathRepo": "cookbook/07-create-exportable-buildings/test-gbxml-files/",
	"title": "Build Well",
	"subTitle": "A spider project to generate gbXML files on the fly",
	"button": "butGalleryBuildWell"
},
{
	"user": "ladybug-tools",
	"repo": "/spider",
	"pathRepo": "gbxml-sample-files/zip/",
	"title": "Spider gbXML ZIP files",
	"subTitle": "Ladybug Tools/Spider gbXML Viewer sample ZIP files on GitHub",
	"button": "butGalleryZip"
}
];



GFF.getMenuGithubFoldersFiles = function() {

	const help = `<button id="GFFbutHelp" class="butHelp" onclick="POP.setPopupShowHide(GFFbutHelp,GFF.script.helpFile);" >?</button>`;

	let  htm = help;

	let index = 0;

	for ( let item of GFF.items ) {

		htm += GFF.getDetails( item, index++ );

	}

	return htm;

};


GFF.getDetails = function( item, index ){


	const htm =
		`
			<details ontoggle="GFFdivFoldersFiles${ index }.innerHTML=GFF.getGithubFoldersFiles(${ index });" >

				<summary id=TMPsumSurfaces >${ index + 1 } - ${ item.title }</summary>

				<div id=GFFdivFoldersFiles${ index } ></div>

			</details>

		`;

	return htm;

};



GFF.getGithubFoldersFiles = function( index ) {

	const item = GFF.items[ index ];

	item.urlGitHubApiContents = 'https://api.github.com/repos/' + item.user + item.repo + '/contents/' + item.pathRepo;
	//item.urlGitHubPage = 'https://rawgit.com/' + item.user + item.repo + '/master/' + item.pathRepo;
	item.urlGitHubPage = 'https://cdn.jsdelivr.net/gh/' + item.user + item.repo + '@master/' + item.pathRepo;

	item.urlGitHubSource = 'https://github.com/' + item.user + item.repo + '/blob/master/' + item.pathRepo;

	GFF.index = index;

	const htm =
	`
		<p><i>
			${ item.subTitle }.
			User: <a href="https://github.com/${ item.user }" target="_blank">${ item.user }</a>
			Repo: <a href="https://github.com/${ item.user }${ item.repo }" target="_blank">${ item.repo }</a>
		</i></p>

		<div id=GALdivGallery${ index } ></div>

		<p>Click any ${ GFF.iconInfo } icon to view file source code on GitHub.</p>

		<p>Click any file title to view the file in this script.</p>

		<!--<p>Click any ❐ icon to go full screen & get link to individual file.</p> -->

		<p>Tool tips provide file size.

		<hr>

	`;

	GFF.requestFile( item.urlGitHubApiContents, GFF.callbackGitHubMenu, index );

	return htm;

};



GFF.requestFile = function( url, callback, index ) {

	GFF.index = index;

	const xhr = new XMLHttpRequest();
	xhr.crossOrigin = 'anonymous';
	xhr.open( 'GET', url, true );
	xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
	xhr.onprogress = onRequestFileProgress;
	xhr.onload = callback;
	xhr.send( null );


	function onRequestFileProgress( xhr ) {

		let name = xhr.target.responseURL.split( '/').pop();

		const item = GFF.items[ GFF.index ];

		name = name ? item.user + '/' + name : `${item.user }  ${ item.repo } `;

		GFFdivFileInfo.innerHTML =
		`
			Files from: ${ name }<br>
			Bytes loaded: ${ xhr.loaded.toLocaleString() }<br>
		`;

	}

};



GFF.callbackGitHubMenu = function( xhr ) {

	const response = xhr.target.response;
	const files = JSON.parse( response );

	let htm = "";

	const item = GFF.items[ GFF.index ];
	//console.log( 'item', item );

	for ( let file of files ) {

		//const file = files[ i ];

		if ( file.name.toLowerCase() === 'README.md' ||

			( file.name.toLowerCase().endsWith( '.xml' ) === false && file.name.toLowerCase().endsWith( '.zip' ) === false )

		) { continue; }

		const fileName = encodeURI( file.name );
		//console.log( 'fileName', fileName );

		htm +=

		`<div style=margin:4px 0; >

			<a href=${ item.urlGitHubSource + fileName } title="Edit me" >${ GFF.iconInfo }</a>

			<a href=${ location.href.replace( location.hash, "" ) }#${ item.urlGitHubPage + fileName } title="${ file.size.toLocaleString() } bytes" >${ file.name }</a>

			<!--<a href=${ item.threeDefaultFile }#${ item.urlGitHubPage }${ fileName } title="Link to just this file" >&#x2750;</a> -->

		</div>`;

	}

	const divGallery = GFFdivGithubFoldersFiles.querySelectorAll ( "#GALdivGallery" + GFF.index )[ 0 ];
	//console.log( 'divGallery', divGallery );

	divGallery.innerHTML = htm;

};