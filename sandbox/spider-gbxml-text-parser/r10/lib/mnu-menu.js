/* global THREE * /
/* jshint esversion: 6 */

// Copyright 2018 Ladybug Tools authors. MIT License


const MNU = { "release": "R10.1", "date": "2018-12-21" };


MNU.currentStatus =
	`
		<h3>MNU ${ MNU.release} status ${ MNU.date }</h3>

		<p>This module is new / ready for light testing.</p>

		<p>
			<ul>
				<li>2018-12-22 ~ Update subtext</li>

				<!-- <li></li> -->
			</ul>
		</p>
	`;

MNU.statusThemes =
`
	<h3>MNU Themes ${ MNU.release} status ${ MNU.date }</h3>

	<p>This module allows you to load:
		<ul>
			<li>Basic style sheet</li>
			<li>Style sheet from W3Schools</li>
			<li>Style sheet from Bootswatch (coming soon)</li>
		<!-- <li></li> -->
		</ul>
	</p>
	<p>
		You can switch themes at any time. Current them choice is saved between sessions (coming soon).
	</p>
	<p>
			<a href="https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-core-menu" target="_blank">Read Me</a>
	</p>
	<p>
		Status:
		<ul>
			<li>2018-12-22 ~ First commit</li>

			<!-- <li></li> -->
		</ul>
	</p>

`;

//MNU.urlSourceCode = 'https://github.com/pushme-pullyou/pushme-pullyou.github.io/tree/master/tootoo-templates/threejs-lib';

MNU.urlSourceCode = "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-MNUe-menu";

let themeName = localStorage.getItem( 'themeName' ) || 'https://bootswatch.com/_vendor/bootstrap/dist/css/bootstrap.css';

let w3Themecss;

let themeNameBootswatch = 'https://bootswatch.com/_vendor/bootstrap/dist/css/bootstrap.css';


//////////


MNU.getNavHeader = function() {

	//MNU.loadCssBasic();

	const htm  =
	`
		<h3>
		<a href="https://www.ladybug.tools" title="Ladybug Tools: free computer applications that support environmental design and education" target="_top">
		<img src="https://ladybug.tools/artwork/icons_bugs/ico/ladybug.ico" height=24 >
		</a>
		&raquo;
		<a href="https://www.ladybug.tools/spider/" title="Spider: 3D interactive analysis in your browser mostly written around the Three.js JavaScript library" target="_top">
		<img src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" height=24 >
		</a>
		&raquo;
		<a href="https://www.ladybug.tools/spider-gbxml-tools/" title="Tools to help you find, load, examine and edit gbXML files - in large numbers and sizes" >gbXML Tools</a>
		&raquo;
		</h3>
		<h2>
			<a href=${ MNU.urlSourceCode } target="_top" title="Source code on GitHub" >
				<img src="https://status.github.com/images/invertocat.png" height=18 >
			</a>
			<a href="" title="Click to reload this page" >${ document.title }</a>

			<a id=statusCore href="JavaScript:MNU.setPopupShowHide(statusCore,coreCurrentStatus);"
			title="Current status: menu MNU module" >&nbsp; ? &nbsp;</a>
		</h3>

		<p>
			<!-- ${ document.head.querySelector( '[ name=description ]' ).content } -->

			DEV version: Open, examine and edit very large <a href="http://gbxml.org" target="_blank"  title="Thank you, Stephen">gbXML</a> files in 3D in your browser with free, open source
			<a href="https://en.wikipedia.org/wiki/JavaScript" target="_blank"  title="Thank you, Brendan">JavaScript</a>,
			<a href="https://en.wikipedia.org/wiki/WebGL" target="_blank" title="Thank you, Ken" >WebGL</a> &
			<a href="https://en.wikipedia.org/wiki/Three.js" target="_blank" title="Thank you, Ricardo" >Three.js</a>

			<a id=statusHeader href="JavaScript:MNU.setPopupShowHide(statusHeader,MNU.currentStatus);"
				title="Current status: menu MNU module" >&nbsp; ? &nbsp;</a>

		</p>
	`;

	return htm;

};



MNU.setPopupShowHide = function( id, text ) {

	//id.classList.toggle( "active" );

	divPopUpData.innerHTML = text; //id.classList.contains( 'active' ) ? text : '';

};



MNU.getNavFooter = function() {

	// &#x1f578; :: 🕸 / &#x2766; :: ❦

	const htm  =
	`
	<details>

		<summary>
			Footer
			<a id=statusFooter href="JavaScript:MNU.setPopupShowHide(statusFooter,'Howdy, World!<br> More text coming soon.');" >&nbsp; ? &nbsp;</a>
		</summary>

		<div style=margin-top:1rem; title='What is this stuff?' ><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/about-spider-code-style.md target="_blank" >Coding style</a></div>
		<div title='many thanks!' ><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/credits.md target="_blank" >Credits</a></div>
		<div><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/code-of-conduct.md target="_blank" >Code of conduct</a></div>
		<div><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/contributing.md target="_blank" >Contributing via GitHub</a></div>
		<div><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/license.md target="_blank" >MIT License</a></div>
		<div><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/markdown-help.md target="_blank" >Markdown help</a></div>
		<div><a href=https://www.ladybug.tools/spider-gbxml-tools/#../spider/pages/themes.md target="_blank" >Themes help</a></div>
		<div><a title='Need help' href=https://github.com/ladybug-tools/spider-gbxml-tools/issues target=_blank >GitHub Issues</a></div>
		<div><a href="javascript:( function(){ var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='https://rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()" title="Mr.doob's Stats.js appear in top left MNUner" >Show frames/second statistics</a></div>
		<div><a href="https://api.github.com/rate_limit" title='If menu stops appearing, it is likely due to too many API calls' target=_blank >View GitHub API rate limits</a></div>

		<hr>

	</details>

	<h2 onclick=navMenu.scrollTop=0; style=cursor:pointer;text-align:center;
		title='Help eensy weensy spider up the water spout / top of menu' >
		<img src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" height=24 >
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



//////////

MNU.getThemeSelect = function () {

	const htm =
	`
		<details open>

			<summary>Change Themes
				<a id=statusThemes href="JavaScript:MNU.setPopupShowHide(statusThemes,MNU.statusThemes);" >&nbsp; ? &nbsp;</a>
			</summary>

			<br>

			<p>
				<button id=but onclick=MNU.loadCssBasic(); accessKey= 'z' title='access key: z '>load CSS Basic</button>
			</p>

			<p>
				<button id=butW3 onclick=MNU.loadCssW3school(); accessKey= 'w' title='access key: z '>load CSS W3schools</button>
			</p>

			<p id=MNUdivW3Schools ></p>

			<p>
				<button onclick=MNU.loadCssBootswatch() >load CSS Bootswatch</button>
			</p>

			<div id=divBootswatch ></div>

		</details>
	`;

	return htm;

};



MNU.getMenuTemplate = function() {

	htm =
	`
		<details>

			<summary>Menu Template
				<a id=statusMenu href="JavaScript:MNU.setPopupShowHide(statusMenu,MNU.currentStatus);" >&nbsp; ? &nbsp;</a></summary>

			<br>
			<p>
				<button onclick=MNU.onUpdateThings(); >update things</button>
			</p>
			<p>
				<label><b>Last Name</b></label>
				<input type="text" style=width:100px; >
			</p>
			<p>
				<button >button 1</button>
			</p>
			<p>
				<button >button 2</button>
			</p>
			<p>
				<select size=3 >
					<option value="" disabled selected>Choose your option</option>
					<option value="1">Option 1</option>
					<option value="2">Option 2</option>
					<option value="3">Option 3</option>
				</select>
			</p>
			<p>
				lorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem. ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? quis autem vel eum iure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?
			</p>

			<hr>

		</details>
	`

	return htm;

};



//////////

MNU.loadCssBasic = function() {

	if ( !MNU.cssBasic ) {

		MNU.cssBasic = document.head.appendChild( document.createElement('link') );
		MNU.cssBasic.rel = "stylesheet";
		MNU.cssBasic.href = "../lib/style.css";
		//console.log( 'MNU.cssBasic', MNU.cssBasic );

	}

	if ( MNU.w3css ) {

		MNU.tagsClassListRemoveW3schools();

	}

	//MNU.tagsClassListRemoveBootswatch();

}



//////////

MNU.loadCssW3school = function() {

	//MNU.tagsClassListRemoveBootswatch();

	if ( !MNU.w3css ) {

		MNU.w3css = document.head.appendChild( document.createElement('link') );
		MNU.w3css.rel = "stylesheet";
		MNU.w3css.href = "https://www.w3schools.com/w3css/4/w3.css";

		MNU.w3Themecss = document.head.appendChild( document.createElement('link') );
		MNU.w3Themecss.rel = "stylesheet";
		MNU.w3Themecss.id = "stylesheetW3schools";
		MNU.w3Themecss.href = "https://www.w3schools.com/lib/w3-theme-red.css";

	}


	MNU.tagsClassListAddW3schools();

	const themes = [ 'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'khaki', 'yellow',
			'amber', 'orange', 'deep-orange', 'blue-grey', 'brown', 'grey', 'dark-grey', 'black', 'w3schools' ];

	const pThemes = themes.reduce( ( acc, theme ) =>
		acc + `<a href=JavaScript: onclick=MNU.setStyleW3("${ theme }");
		style=font-size:3rem;line-height:2rem;text-decoration:none;color:${ theme.replace( '-', '' ) }
		title="${ theme }" >&bull;</a> `,
	'' );

	MNUdivW3Schools.innerHTML =
	`
		<p id=pThemes >${ pThemes }</p>

		<p><a href="https://www.w3schools.com/w3css/" target="_blank">www.w3schools.com/w3css</a></p>
	`;

	if ( !MNU.cssBasic ) {

		MNU.cssBasic = document.head.appendChild( document.createElement('link') );
		MNU.cssBasic.rel = "stylesheet";
		MNU.cssBasic.href = "../lib/style.css";
		//console.log( 'MNU.cssBasic', MNU.cssBasic );

	}

};



MNU.setStyleW3 = function( color ) {

	//console.log( 'color', color );
	stylesheetW3schools.href="https://www.w3schools.com/lib/w3-theme-" + color + ".css";

	//localStorage.setItem('GbxmlViewerStyleColor', color );

};


MNU.tagsClassListAddW3schools = function() {


	nav = document.body.querySelectorAll( 'nav' )
		.forEach( item => item.classList.add( "w3-theme-l5" ) );

	a = document.body.querySelectorAll( 'a' )
		.forEach( item => item.classList.add( "w3-hover-shadow" ) );

	h2s = document.body.querySelectorAll( 'h2' )
		.forEach( item => item.style.fontSize = '2rem' );

	h3s = document.body.querySelectorAll( 'h3' )
		.forEach( item => item.style.fontSize = '1.5rem' );

	div = navMenu.querySelectorAll( 'div' )
		.forEach( item => item.classList.add( "w3-container", "w3-text-theme" ) );

	summary = document.body.querySelectorAll( 'summary' )
		.forEach( item => item.classList.add( "w3-bar-item", "w3-theme", "w3-padding-small", "w3-hover-shadow"  ) );

	button = document.body.querySelectorAll( 'button' )
		.forEach( item => item.classList.add( "w3-btn", "w3-theme-l2", "w3-round" ) );

	input = document.body.querySelectorAll( 'input' )
		.forEach( item => item.classList.add( "w3-input", "w3-theme-l4", "w3-round", "w3-border", "w3-hover-theme" ) );

	select = document.body.querySelectorAll( 'select' )
		.forEach( item => item.classList.add( "w3-select", "w3-theme-l2", "w3-round" ) );

};



MNU.tagsClassListRemoveW3schools = function() {

	nav = document.body.querySelectorAll( 'nav' )
		.forEach( item => item.classList.remove( "w3-theme-l5" ) );

	a = document.body.querySelectorAll( 'a' )
		.forEach( item => item.classList.remove( "w3-hover-shadow" ) );

	//h2s = document.body.querySelectorAll( 'h2' )
	//	.forEach( item => item.style.fontSize = '' );

	//h3s = document.body.querySelectorAll( 'h3' )
	//	.forEach( item => item.style.fontSize = '' );

	div = navMenu.querySelectorAll( 'div' )
		.forEach( item => item.classList.remove( "w3-container", "w3-text-theme" ) );

	summary = document.body.querySelectorAll( 'summary' )
		.forEach( item => item.classList.remove( "w3-bar-item", "w3-theme", "w3-padding-small", "w3-hover-shadow" ) );

	button = document.body.querySelectorAll( 'button' )
		.forEach( item => item.classList.remove( "w3-btn", "w3-theme-l2", "w3-round" ) );

	input = document.body.querySelectorAll( 'input' )
		.forEach( item => item.classList.remove( "w3-input", "w3-theme-l4", "w3-round", "w3-border", "w3-hover-theme" ) );

	select = document.body.querySelectorAll( 'select' )
		.forEach( item => item.classList.remove( "w3-select", "w3-theme-l2", "w3-round" ) );

	MNUdivW3Schools.innerHTML = '';

};


//////////
