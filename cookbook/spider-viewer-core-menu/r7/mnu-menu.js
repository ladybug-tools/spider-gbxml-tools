/* global THREE * /
/* jshint esversion: 6 */

// Copyright 2018 Ladybug Tools authors. MIT License


const MNU = {};


//MNU.urlSourceCode = 'https://github.com/pushme-pullyou/pushme-pullyou.github.io/tree/master/tootoo-templates/threejs-lib';

MNU.urlSourceCode = "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/gbxml-viewer-basic/";


MNU.getNavHeader = function() {

	const htm  =
	`
		<a href="https://www.ladybug.tools" title=" free computer applications that support environmental design and education" target="_top">ladybug tools</a>
		&raquo;
		<a href="https://www.ladybug.tools/spider/" title="3D interactive analysis in your browser mostly written around the Three.js JavaScript library" target="_top">spider</a>
		&raquo;
		<a href="https://www.ladybug.tools/spider-gbxml-tools/" title="3D interactive analysis in your browser mostly written around the Three.js JavaScript library" >gbxml</a>
		&raquo;

		<h2>
			<a href=${ MNU.urlSourceCode } target="_top" title="Source code on GitHub" >
				<img src="https://pushme-pullyou.github.io/github-mark-64.png" height=18 >
			</a>
			<a href="" title="Click to reload this page" >${ document.title }</a>
		</h2>

		<p>
			${ document.head.querySelector( '[ name=description ]' ).content }
		</p>
	`;

	return htm;

};



MNU.getNavFooter = function() {

	// &#x1f578; :: 🕸 / &#x2766; :: ❦

	const htm  =
	`

	<details>

		<summary>Footer</summary>

		<div title='What is this stuff?' ><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/about-spider-code-style.md target="_blank" >Coding style</a></div>
		<div title='many thanks!' ><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/credits.md target="_blank" >Credits</a></div>
		<div><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/code-of-conduct.md target="_blank" >Code of conduct</a></div>
		<div><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/contributing.md target="_blank" >Contributing</a></div>
		<div><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/license.md target="_blank" >License</a></div>
		<div><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/markdown-help.md target="_blank" >Markdown help</a></div>
		<div><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/themes.md target="_blank" >Themes help</a></div>

		<div><a title='Need help' href=https://github.com/ladybug-tools/spider-gbxml-tools/issues target=_blank >🗗 GitHub Issues</a></div>

		<div><a href="javascript:( function(){ var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()" title="Mr.doob's Stats.js appear in top left corner" >Show frames/second statistics</a></div>
		<div><a href="https://api.github.com/rate_limit" title='If menu stops appearing, it is likely due to too many API calls' target=_blank >View GitHub API rate limits</a></div>

	</details>

		<h2 onclick=navMenu.scrollTop=0; style=cursor:pointer;text-align:center;
			title='go to top' >
			🕸
		</h2>
	`;

	return htm;

};



MNU.toggleNavLeft = function() {

	const width = navMenu.getBoundingClientRect().width;

	if ( navMenu.style.left === '' || navMenu.style.left === '0px' ) {

		navMenu.style.left = '-' + width + 'px';
		butHamburger.style.left = '10px';

	} else {

		navMenu.style.left = '0px';
		butHamburger.style.left = width + 'px';

	}

};
