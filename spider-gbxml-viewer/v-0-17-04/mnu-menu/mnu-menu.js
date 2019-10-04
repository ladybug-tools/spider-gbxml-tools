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

MNU.urlSourceCodeImage = "https://pushme-pullyou.github.io/github-mark-64.png";
MNU.urlSourceCodeIcon = `<img src=${ MNU.urlSourceCodeImage } height=18 style=opacity:0.5 >`;
MNU.urlSourceCode = `https://github.com/pushme-pullyou/tootoo14/tree/master/js-14-08/`;

MNU.title = document.title;

MNU.version = document.head.querySelector( '[ name=version ]' ).content || "";
MNU.date = document.head.querySelector( '[ name=date ]' ).content || "";
MNU.description = document.head.querySelector( '[ name=description ]' ).content || "";

MNU.helpFile = "README.md";

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


// For main menu header
MNU.homeText  = "homeText";
MNU.homeTitle = "homeTitle";
MNU.homeUrl   = "";

MNU.repoText  = "repoText";
MNU.repoTitle = "repoTitle";
MNU.repoUrl   = "";

MNU.appText  = "appText";
MNU.appTitle = "appTitle";
MNU.appUrl   = "";

MNU.footerUrl		= "#tootoo14/";
MNU.footerPopupUrl	= "tootoo14/";
MNU.footerIssues	= "https://github.com/pushme-pullyou/tootoo14/issues";



//////////

MNU.getNavHeader = function() {

	const source = `<a href=${ MNU.urlSourceCode + MNU.script.helpFile } target=_blank >${ MNU.urlSourceCodeIcon } source code</a>`;

	const htm  =
	`
	<div>
		<h3>
			<a href="${ MNU.homeUrl }" title="${ MNU.homeTitle }" target="_top">
				${ MNU.homeText }
			</a>
			${ MNU.homeText ? '&raquo;' : '' }
			<a href="${ MNU.repoUrl }" title="${ MNU.repoTitle }" target="_top">
				${ MNU.repoText }
			</a>
			${ MNU.repoText ? '&raquo;' : '' }
			<a href="${ MNU.appUrl }" title="${ MNU.appTitle }" >
				${ MNU.appText }
			</a>
			${ MNU.appText ? '&raquo;' : '' }
		</h3>

		<h2>

			<a href=${ MNU.urlSourceCode } ${ MNU.target } title="Source code on GitHub" >
			${ MNU.urlSourceCodeIcon }
			</a>

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



MNU.toggleDetailsOpen = function( target = navPanel ) {

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