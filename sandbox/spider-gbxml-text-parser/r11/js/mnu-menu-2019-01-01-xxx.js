/* global THREE * /
/* jshint esversion: 6 */

// Copyright 2019 pushMe-pullYou authors. MIT License


const MNU = { "release": "R1.0", "date": "2018-12-31" };


MNU.description = MNU.description || document.head.querySelector( "[ name=description ]" ).content;

MNU.currentStatus =
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

		<p><a href="#sandbox/spider-gbxml-text-parser/r10/cookbook/spider-core-menu/README.md" target="_blank">MNU Read Me</a></p>

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

MNU.urlSourceCode = "https://github.com/pushme-pullyou/pushme-pullyou.github.io/tree/master/tootoo-templates/hamburger-theme-cms";


//////////


MNU.getNavHeader = function() {

	// Swipe events
	document.addEventListener( 'touchstart', onTouchStart, false );
	document.addEventListener( 'touchmove', onTouchMove, false );

	const path = "../../../index.html";

	const htm  =
	`
		<h3>
		<a href="${ path }" title="" target="_top">
		pushMe-pullYou
		</a>
		&raquo;
		<a href="${ path }#tootoo-templates/README.md" title="" target="_top">
		TooToo
		</a>
		&raquo;
		<a href="https://pushme-pullyou.github.io/#tootoo-templates/hamburger-theme-cms/README.md" title="" >
		cms</a>
		&raquo;
		</h3>
		<h2>
			<a href=${ MNU.urlSourceCode } target="_top" title="Source code on GitHub" >
				<img src="https://status.github.com/images/invertocat.png" height=18 >
			</a>
			<a href="" title="Click to reload this page" >${ document.title }</a>

			<a id=mnuHead class=helpItem href="JavaScript:MNU.setPopupShowHide(mnuHead,MNUcoreCurrentStatus);"
			title="Current status: menu MNU module" >&nbsp; ? &nbsp;</a>
		</h3>

		<p> ${ MNU.description }

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

	// &#x1f578; :: 🕸 / &#x2766; :: ❦

	path = `../../..`;
	const htm  =
	`
		<details>

			<summary>Footer / Help
				<a id=mnuFoot class=helpItem href="JavaScript:MNU.setPopupShowHide(mnuFoot,MNU.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<div style=margin-top:1rem; title='What is this stuff?' ><a href=#${ path }/pages/coding-style.md target="_blank" >Coding style</a></div>
			<div title='many thanks!' ><a href=#${ path }/pages/credits.md target="_blank" >Credits</a></div>
			<div><a href=#${ path }/pages/code-of-conduct.md target="_blank" >Code of conduct</a></div>
			<div><a href=#${ path }/pages/contributing.md target="_blank" >Contributing via GitHub</a></div>
			<div><a href=#${ path }/pages/license.md target="_blank" >MIT License</a></div>
			<div><a href=#${ path }/pages/markdown-help.md target="_blank" >Markdown help</a></div>
			<div><a href=#${ path }/pages/themes.md target="_blank" >Themes help</a></div>
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


function onTouchStart( event ) {

	xDown = event.touches[ 0 ].clientX;
	yDown = event.touches[ 0 ].clientY;

}



function onTouchMove(event) {

	if ( ! xDown || ! yDown ) {

		return;

	}

	const xUp = event.touches[ 0 ].clientX;
	const yUp = event.touches[ 0 ].clientY;

	const xDiff = xDown - xUp;
	const yDiff = yDown - yUp;

	if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {// most significant

		if ( xDiff > 0 ) {

			toggleNav();
			// left swipe
			console.log( 'left swipe' );

		} else {

			toggleNav();
			// right swipe
			console.log( 'right swipe' );

		}

	} else {

		if ( yDiff > 0 ) {

			//up swipe
			console.log( 'up swipe' );

		} else {

			// down swipe
			console.log( 'down swipe' );

		}

	}

	xDown = null;
	yDown = null;

}


MNU.xxxxtoggleNavLeft = function() {

	const width = navMenu.getBoundingClientRect().width;

	if ( navMenu.style.left === '' || navMenu.style.left === '0px' ) {

		navMenu.style.left = '-' + width + 'px';
		butHamburger.style.left = '10px';

	} else {

		navMenu.style.left = '0px';
		butHamburger.style.left = width + 'px';

	}

};



//function toggleNav() {
MNU.toggleNavLeft = function() {

	const width = getComputedStyle(document.documentElement).getPropertyValue( '--mnu-width' ).trim();

	if ( !navMenu.style.width || navMenu.style.width === width ) {

		navMenu.style.width = '0';
		navMenu.style.padding = '0';
		butHamburger.style.left = '-75px';
		divContainer.style.marginLeft = '0';

	} else {

		navMenu.style.width = width;
		//navMenu.style.padding = '30px 10px 0 10px';
		navMenu.style.padding = '1rem';
		butHamburger.style.left = 'calc( var( --mnu-width ) - 4rem )';
		divContainer.style.marginLeft = width;

	}

}

