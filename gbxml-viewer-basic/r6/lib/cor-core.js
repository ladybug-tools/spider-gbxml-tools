/* global THREE * /
/* jshint esversion: 6 */

// Copyright 2018 Ladybug Tools authors. MIT License

const COR = {};

COR.getNavHeader = function() {

	const htm  =
	`
		<a href="https://www.ladybug.tools" title=" free computer applications that support environmental design and education" target="_top">ladybug tools</a>
		&raquo;
		<a href="https://www.ladybug.tools/spider/" title="3D interactive analysis in your browser mostly written around the Three.js JavaScript library" target="_top">spider</a>
		&raquo;
		<a href="https://www.ladybug.tools/spider-gbxml-tools/" title="3D interactive analysis in your browser mostly written around the Three.js JavaScript library" >gbxml</a>
		&raquo;
		<h2>
			<a href=${ urlSourceCode } target="_top" title="Source code on GitHub" >
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



COR.getNavFooter = function() {

	const htm  =
	`
		<hr>
		<center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > &#x1f578; </a></center>
	`;

	return htm;

};