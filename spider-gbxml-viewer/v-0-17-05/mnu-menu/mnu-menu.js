/* global POP, Stats, navPanel */
// jshint esversion: 6
// jshint loopfunc: true


const MNU = {
	"script": {

		"copyright": "Copyright 2019 pushMe-pullYou authors. MIT License",
		"scriptDate": "2019-09-06",
		"description": "TooToo Menu (MNU) generates standard HTML TooToo menu code and content and code that works on computers, tablets and phones",
		"helpFile": "mnu-menu/README.md",
		"version": "0.14.08-0mnu",
	}
};

////////// boilerplate for downstream users

MNU.urlSourceCodeImage = "https://pushme-pullyou.github.io/github-mark-32.png";
MNU.urlSourceCodeIcon = `<img src=${ MNU.urlSourceCodeImage } height=18 style=opacity:0.5 >`;
MNU.urlSourceCode = `https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/v-0-17-05`;

MNU.title = document.title;

MNU.version = document.head.querySelector( '[ name=version ]' ).content || "";
MNU.date = document.head.querySelector( '[ name=date ]' ).content || "";
MNU.description = document.head.querySelector( '[ name=description ]' ).content || "";

MNU.helpFile = "https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/v-0-17-05/README.md";

MNU.target	= ""; //"target=_blank";

MNU.descriptionTooToo =
	`
		<i>The menu and user interface used here are built on:</i>
		<h3>
			<a href="https://github.com/pushme-pullyou/tootoo14" target="_blank">${ MNU.urlSourceCodeIcon }</a>
			 <a href="https://pushme-pullyou.github.io#tootoo14/README.md" target="_blank">
				TooToo14
			</a>
		</h3>

		<p>
			<ul>
				<li>TooToo is a collection of JavaScript scripts to help you browse and view the contents of many files on <a href="https://github.com">GitHub</a> with remarkable ease</li>
				<li>View HTML, <a href="https://en.wikipedia.org/wiki/Markdown">Markdown</a>, images and many other file types either as rendered web pages or as source code</li>
				<li>Traverse a tree menu, select and display folder and file names with single clicks</li>
				<li>Open local files with OS file dialog or by drag & drop. Open remote files with a URL</li>
				<li>Note: you may access files quickly and then edit and commit changes to source using the GitHub interface</li>
				<li>Web app with sliding menu that works on computer, tablet or phone</li>
				<li>Enjoy: All written in plain-vanilla JavaScript / Uses the <a href="https://developer.github.com/v3/">GitHub Developer API</a> / Hosting with <a href="https://pages.github.com/">GitHub Pages</a> / Simple CSS theme selection</li>
			</ul>
		</p>

		<p>TooToo is is one of several apps in the <a href="https://pushme-pullyou.github.io" target="_blank">pushMe-pullYou</a> GitHub organization.</p>
	`;


//////////


// // For main menu header


MNU.footerPopupUrl = "https://www.ladybug.tools/spider/";
MNU.footerTarget = "target=_blank";
MNU.footerIssues = "https://github.com/ladybug-tools/spider-gbxml-tools/issues";

MNU.arrApps = [

	{ text: "Ladybug Tools home page", url: "https://www.ladybug.tools", title: "free computer applications that support environmental design and education" },
	{ text: "Ladybug Tools GitHub", url: "https://github.com/ladybug-tools", title: "Source code repositories" },
	{ text: "gbXML.org home page", url: "http://www.gbxml.org", title: "Green Building XML (gbXML) is the language of buildings ... allowing disparate building design software tools to all communicate with one another." },
	{ text: "gbXML.org Schema", url: "http://www.gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html", title: "Version 6.01 of the gbXML schema" },
	{ text: "Spider home page", url: "https://www.ladybug.tools/spider/", title: "3D interactive analysis in your browser mostly written around the Three.js JavaScript library" },
	{ text: "Spider gbXML Viewer R12 Aragog", url: "https://https://www.ladybug.tools/spider/gbxml-viewer/", title: "A popular release" },
	{ text: "Spider gbXML Viewer R14", url: "https://www.ladybug.tools/spider/gbxml-viewer/r14/aragog-shortcut.html", title: "An interesting release" },
	{ text: "Spider gbXML tools", url: "https://www.ladybug.tools/spider-gbxml-tools/", title: "Home page for yools to help you find, load, examine and edit gbXML files - in large numbers and sizes" },
	{ text: "Spider gbXML Viewer v0.17 Atrax stable", url: "https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/", title: "Mission: run a series of basic checks on gbXML files to identify, report and help you fix any issues." },
	{ text: "Spider gbXML Viewer v0.17 beta", url: "https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/dev/", title: "Latest development release - still under development - may have issues" },
	{ text: "Spider gbXML Fixer", url: "https://www.ladybug.tools/spider-gbxml-fixer/", title: "Scripts to help you load and manage gbXML files" },
	{ text: "Radiance Online home page", url: "https://www.radiance-online.org/", title: "Radiance is a suite of programs for the analysis and visualization of lighting in design." },
	{ text: "Spider RAD viewer", url: "https://www.ladybug.tools/spider-rad-viewer/rad-viewer", title: "View Radiance RAD files in interactive 3D in your browser using the Three.js JavaScript library" },

].map( item => `<option value="${ item.url}" title="${ item.title }" >${ item.text }</option>`).join( "" )

//////////

MNU.getNavHeader = function() {

	const source = `<a href=${ MNU.urlSourceCode + MNU.script.helpFile } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const htm  =
	`
	<div>

		<h3 style="padding: 1rem 0;">
			<select oninput=window.location.href=this.value >${ MNU.arrApps }</select>
		</h3>


		<h2>

			<a href=${ MNU.urlSourceCode } ${ MNU.target } title="Source code on GitHub" >
			${ MNU.urlSourceCodeIcon }
			</a>
			&nbsp;
			<a href="${ location.href.replace( location.hash, "" ) }" title="Click to reload this page" >${ MNU.title }
				<span id=titleRelease >${ MNU.version }</span></a>

			<button class=butHelp id=butTitle onclick="POP.setPopupShowHide(butTitle,MNU.helpFile);" title="Click me!" >?</button>

		</h2>

		<p>
			${ MNU.description }
		</p>

		<p>
			<button onclick=MNU.toggleDetailsOpen() >Close all menus</button>

			<button class=butHelp id=butMenu onclick="POP.setPopupShowHide(butMenu,MNU.descriptionTooToo,POP.footer,'${ source }');" >?</button>
		</p>

	</div>
	`;

	return htm;

};



MNU.getNavFooter = function() { // deprecate??

	const htm  =
	`
		<details id=MNUdetFooter >

			<summary class=sumMenuTitle >Help menu
				<button id=MNUbutFooter class=butHelp onclick="POP.setPopupShowHide(MNUbutFooter,MNU.descriptionTooToo);" style=float:right; >?</button>
			</summary>

			<div><a href=${ MNU.footerUrl }pages/about-tootoo.md ${ MNU.target } >About TooToo</a></div>
			<div><a href=${ MNU.footerUrl }pages/credits.md ${ MNU.target } >Credits</a></div>
			<div><a href=${ MNU.footerUrl }pages/code-of-conduct.md ${ MNU.target } >Code of conduct</a></div>
			<div><a href=${ MNU.footerUrl }pages/contributing.md ${ MNU.target } >Contributing via GitHub</a></div>
			<div><a href=${ MNU.footerUrl }pages/license.md ${ MNU.target } >MIT License</a></div>
			<div><a href=${ MNU.footerUrl }pages/markdown-help.md ${ MNU.target } >Markdown help</a></div>
			<div><a href=${ MNU.footerUrl }pages/themes.md ${ MNU.target } >Themes help</a></div>
			<div>&raquo; <a title='Need help' href=${ MNU.footerIssues } target=_blank >${ MNU.repoText } GitHub Issues</a></div>
			<div><button onclick=MNU.showFps() >Show frames/second statistics</button></div>
			<div><button id=MNUbutRateLimits onclick=MNU.rateLimits(MNUbutRateLimits); >View GitHub API rate limits</button>
			<hr>

		</details>
	`;

	return htm;

};



MNU.getNavFooterPopup = function() {

	const htm  =
	`
			<button id=MNUbutFooterPopup class=butHelp onclick="POP.setPopupShowHide(MNUbutFooterPopup,MNU.descriptionTooToo);" style=float:right; >?</button>

			<p><button id=MNUbutTooToo onclick="POP.setPopupShowHide(MNUbutTooToo,'${ MNU.footerPopupUrl }pages/about-tootoo.md');" >About TooToo</button></p>
			<p><button id=MNUbutCredits onclick="POP.setPopupShowHide(MNUbutCredits,'${ MNU.footerPopupUrl }pages/credits.md');" >Credits</button></p>
			<p><button id=MNUbutCode onclick="POP.setPopupShowHide(MNUbutContribute,'${ MNU.footerPopupUrl }pages/code-of-conduct.md');" >Code of Coduct</button></p>
			<p><button id=MNUbutContribute onclick="POP.setPopupShowHide(MNUbutContribute,'${ MNU.footerPopupUrl }pages/contributing.md');" >Contributing via GitHub</button></p>
			<p><button id=MNUbutLicense onclick="POP.setPopupShowHide(MNUbutLicense,'${ MNU.footerPopupUrl }pages/license.md');" >MIT License</button></p>
			<p><button id=MNUbutMarkdown onclick="POP.setPopupShowHide(MNUbutMarkdown,'${ MNU.footerPopupUrl }pages/markdown-help.md');" >Markdown help</button></p>
			<p><button id=MNUbutThemes onclick="POP.setPopupShowHide(MNUbutThemes,'${ MNU.footerPopupUrl }pages/themes.md');" >Themes help</button></p>
			<p><button onclick=MNU.showFps() >Show frames/second statistics</button></p>
			<p><button id=MNUbutRateLimitsPopup onclick=MNU.rateLimits(MNUbutRateLimitsPopup); >View GitHub API rate limits</button></p>

			<p>&raquo; <a title='Need help?' href=${ MNU.footerIssues } target=_blank >${ MNU.repoText } GitHub Issues</a></p>

			<hr>
	`;

	return htm;

};



MNU.toggleDetailsOpen = function( target = navMenu ) {

	const details = target.querySelectorAll( "details" );

	details.forEach( element => element.open = false );

};



//////////

MNU.showFps = function(){

	const script = document.body.appendChild( document.createElement('script') );

	script.onload = function() {

		MNU.stats = new Stats();

		document.body.appendChild( MNU.stats.dom );

		loop();

	};

	script.src = 'https://cdn.jsdelivr.net/gh/mrdoob/stats.js@master/build/stats.min.js';


	function loop(){

		MNU.stats.update();
		requestAnimationFrame( loop );

	}

};



MNU.rateLimits = function( button ) {
	//console.log( 'button', button );

	const url = "https://api.github.com/rate_limit";

	const xhr = new XMLHttpRequest();
	xhr.open( 'GET', url, true );
	xhr.onload = callback;
	xhr.send( null );

	function callback( xhr ) {

		const text =
		`
			<h3>GitHub rate limits status</h3>

			<p>
				Some TooToo scripts use the GitHub Developer API which has rate limits.
			</p>

			<p>See <a href="https://developer.github.com/v3/#rate-limiting" target="_blank">developer.github.com/v3</a>.</p>

			<pre> ${ xhr.target.response } </pre>
		`;

		POP.setPopupShowHide( button, text );

	}

};