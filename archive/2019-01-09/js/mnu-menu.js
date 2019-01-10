// Copyright 2019 pushMe-pullYou authors. MIT License
/* global THREE * /
/* jshint esversion: 6 */


const MNU = { "release": "R13.1", "date": "2019-01-06" };

MNU.description = MNU.descriptionCore || document.head.querySelector( "[ name=description ]" ).content;

MNU.currentStatusCore =
	`
		<h3>MNU.currentStatusCore</h3>
	`;

MNU.currentStatusMenu =
	`
		<h3>MNU ${ MNU.release} status ${ MNU.date }</h3>

		<p>TooToo Core Menu.</p>

		<p>
			Concept
			<ul>
				<li>Creates default menu header and footer content and code</li>
				<li>Code for hamburger sliding menu</li>
				<li>Code for pop-up window</li>
				<li>Code to add and select and load theme stylesheets</li>
			</ul>

		</p>

		<p>This module is ready for light testing.</p>

		<p><a href="#/README.md" target="_blank">MNU Read Me</a></p>

		<p>
			Change log
			<ul>
				<li>2018-12-29 ~ Add helpItem class</li>
				<li>2018-12-28 ~ Current Status link changed to question mark</li>
				<li>2018-12-28 ~ Content displayed in the Pop-Up</li>
				<li>2018-12-22 ~ Themes added</li>
				<li>2018-12-22 ~ Update subtext</li>
				<!-- <li></li> -->
			</ul>
		</p>
	`;

//MNU.urlSourceCode = "https://github.com/pushme-pullyou/pushme-pullyou.github.io/tree/master/tootoo-templates/hamburger-theme-cms";


// For main menu header
MNU.homeText = "homeText";
MNU.homeTitle = "homeTitle";
MNU.homeUrl = "";

MNU.repoText = "repoRext";
MNU.repoTitle = "repoTitle";
MNU.repoUrl = "";

MNU.appText = "appText";
MNU.appTitle = "appTitle";
MNU.appUrl = "";

MNU.urlSourceCodeImage = "https://status.github.com/images/invertocat.png";
MNU.urlSourceCodeIcon = `<img src="${ MNU.urlSourceCodeImage }" height=18 >`;
MNU.urlSourceCodeUrl = "https://github.com/pushme-pullyou/pushme-pullyou.github.io/tree/master/tootoo-templates/hamburger-theme-cms";


MNU.xDown = null;
MNU.yDown = null;

//////////


MNU.getNavHeader = function() {

	// Swipe events
	document.addEventListener( 'touchstart', MNU.onTouchStart, false );
	document.addEventListener( 'touchmove', MNU.onTouchMove, false );

	const path = "../../../index.html";

	const htm  =
	`
		<h3>
		<a href="${ MNU.homeUrl }" title="${ MNU.homeTitle }" target="_top">
		${ MNU.homeText }
		</a>
		&raquo;
		<a href="${ MNU.repoUrl }" title="${ MNU.repoTitle }" target="_top">
		${ MNU.repoText }
		</a>
		&raquo;
		<a href="${ MNU.appUrl }" title="${ MNU.appTitle }" >
		${ MNU.appText }
		</a>
		${ MNU.appUrl ? '&raquo;' : '' }
		</h3>
		<h2>
			<a href=${ MNU.urlSourceCodeUrl } target="_blank" title="Source code on GitHub" >
			${ MNU.urlSourceCodeIcon }
			</a>
			<a href="" title="Click to reload this page" >${ document.title }</a>

			<a id=mnuCore class=helpItem href="JavaScript:MNU.setPopupShowHide(mnuCore,MNU.currentStatusCore);"
				title="Current status: core module" >&nbsp; ? &nbsp;
			</a>
		</h3>

		<p>
			${ MNU.description }
			<a id=mnuHead class=helpItem href="JavaScript:MNU.setPopupShowHide(mnuHead,MNU.currentStatusMenu);"
				title="Current status: core module" >&nbsp; ? &nbsp;
			</a>

		<!--
			 ${ document.head.querySelector( '[ name=description ]' ).content }
			 Open, examine and edit very large <a href="http://gbxml.org" target="_blank"  title="Thank you, Stephen">gbXML</a> files in 3D in your browser with free, open source
			 <a href="https://en.wikipedia.org/wiki/JavaScript" target="_blank"  title="Thank you, Brendan">JavaScript</a>,
			 <a href="https://en.wikipedia.org/wiki/WebGL" target="_blank" title="Thank you, Ken" >WebGL</a> &
			 <a href="https://en.wikipedia.org/wiki/Three.js" target="_blank" title="Thank you, Ricardo" >Three.js</a>
			 <a class=helpItem href="JavaScript:MNU.setPopupShowHide(this,MNU.currentStatus);"
			 title="Current status: menu MNU module" >&nbsp; ? &nbsp;</a>
		-->
		</p>
	`;

	return htm;

};



MNU.getNavFooter = function() {

	const path = "../../../index.html#";
	const htm  =
	`
		<details>

			<summary>Footer / Help
				<a id=mnuFoot class=helpItem href="JavaScript:MNU.setPopupShowHide(mnuFoot,MNU.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div style=margin-top:1rem; title='What is this stuff?' ><a href=${ path }pages/about-spider-code-style.md target="_blank" >Coding style</a></div>
			<div title='many thanks!' ><a href=${ path }pages/credits.md target="_blank" >Credits</a></div>
			<div><a href=${ path }pages/code-of-conduct.md target="_blank" >Code of conduct</a></div>
			<div><a href=${ path }pages/contributing.md target="_blank" >Contributing via GitHub</a></div>
			<div><a href=${ path }pages/license.md target="_blank" >MIT License</a></div>
			<div><a href=${ path }pages/markdown-help.md target="_blank" >Markdown help</a></div>
			<div><a href=${ path }pages/themes.md target="_blank" >Themes help</a></div>
			<div><a title='Need help' href=https://github.com/ladybug-tools/spider-gbxml-tools/issues target=_blank >GitHub Issues</a></div>
			<div><a href="javascript:( function(){ var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()" title="Mr.doob's Stats.js appear in top left MNUner" >Show frames/second statistics</a></div>
			<div><a href="https://api.github.com/rate_limit" title='If menu stops appearing, it is likely due to too many API calls' target=_blank >View GitHub API rate limits</a></div>

			<hr>

		</details>
	`;

	return htm;

};



//////////

MNU.setPopupShowHide = function( id, text ) {
	//console.log( 'id', id );

	id.classList.toggle( "active" );

	divPopUpData.innerHTML = id.classList.contains( 'active' ) ? text : '';

};



//////////

MNU.onTouchStart = function( event ) {

	MNU.xDown = event.touches[ 0 ].clientX;
	MNU.yDown = event.touches[ 0 ].clientY;

};



MNU.onTouchMove = function(event) {

	// if ( ! MNU.xDown || ! MNU.yDown ) { return; }

	const xUp = event.touches[ 0 ].clientX;
	const yUp = event.touches[ 0 ].clientY;

	const xDiff = MNU.xDown - xUp;
	const yDiff = MNU.yDown - yUp;

	if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {// most significant

		if ( xDiff > 0 ) {

			MNU.toggleNavLeft();
			//console.log( 'left swipe' );

		} else {

			MNU.toggleNavLeft();
			console.log( 'right swipe' );

		}

	} else {

		if ( yDiff > 0 ) {

			console.log( 'up swipe' );

		} else {

			console.log( 'down swipe' );

		}

	}

	MNU.xDown = null;
	MNU.yDown = null;

};


MNU.toggleNavLeft = function() {

	width = getComputedStyle(document.documentElement).getPropertyValue( '--mnu-width' ).trim();
	//console.log( 'navMenu.style.width', navMenu.style.width );

	if ( !navMenu.style.width || navMenu.style.width === '0px' || navMenu.style.width === '' ) { // visible

		navMenu.style.width = width;
		navMenu.style.padding = '1rem';
		butHamburger.style.left = 'var( --mnu-width )';
		divContainer.style.marginLeft = width;

	} else {

		navMenu.style.width = '0';
		navMenu.style.padding = '0';
		butHamburger.style.left = '-3rem';
		divContainer.style.marginLeft = '0';

	}

}
