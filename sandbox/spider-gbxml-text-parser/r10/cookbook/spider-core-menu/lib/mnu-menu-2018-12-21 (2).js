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
				<li>2018-12-21 ~ Update subtext</li>

				<!-- <li></li> -->
			</ul>
		</p>
	`;

//MNU.urlSourceCode = 'https://github.com/pushme-pullyou/pushme-pullyou.github.io/tree/master/tootoo-templates/threejs-lib';

MNU.urlSourceCode = "https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-MNUe-menu";

let themeName = localStorage.getItem( 'themeName' ) || 'https://bootswatch.com/_vendor/bootstrap/dist/css/bootstrap.css';


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


MNU.getThemeSelect = function () {

	htm =
	`
		<details open >

			<summary>Select a Theme<a id=statusTheme href="JavaScript:MNU.setPopupShowHide(statusTheme,MNU.currentStatus);" >&nbsp; ? &nbsp;</a></summary>

			<div id=MNUdivBootswatch ></div>

			<div id=MNUdivCssOthers ></div>

			</hr>

		</details>

	`;

	return htm;

};



MNU.onUpdateThings = function() {

	butts = navMenu.querySelectorAll( 'button' );

	navMenu.classList.add( "jumbotron" );

	console.log( 'butts', butts );

	butts.forEach( butt => butt.classList.add( 'btn' ) );

	var elements = document.querySelectorAll('.btn');

	for( let i = 0; i < elements.length; i++ ){
		elements[i].style.color = "red";
		elements[i].style.height = "30px";
	};

}






MNU.updateCss = function( link ) {

	themeName = MNUcss.href = link;

	localStorage.setItem( 'themeName', link );

	MNU.setTheme();

};



MNU.setTheme = function() {

	const themesBootswatch = [
		{ 'Default': 'background-color: white; color: #007bff' },
		{ "Cerulean": 'background-color: white; color: #2FA4E7;' },
		{ 'Cosmo': 'background-color: white; color: #2780E3;' },
		{ 'Cyborg': 'background-color: #060606; color: #2A9FD6; font-style: italic;' },
		{ 'Darkly': 'background-color: #222; color: #00bc8c; font-style: italic;' },
		{ 'Flatly': 'background-color: white; color: #18BC9C;' },
		{ 'Journal': 'background-color: white; color: #EB6864;' },
		{ 'Litera': 'background-color: white; color: #4582EC;' },
		{ 'Lumen': 'background-color: white; color: #158CBA;' },
		{ 'Lux': 'background-color: white; color: #1a1a1a;' },
		{ 'Materia': 'background-color: white; color: #2196F3;' },
		{ 'Minty': 'background-color: white; color: #78C2AD;' },
		{ 'Pulse': 'background-color: white; color: #593196;' },
		{ 'Sandstone': 'background-color: white; color: #93C54B;' },
		{ 'Simplex': 'background-color: white; color: #D9230F;' },
		{ 'Sketchy': 'background-color: white; color: #333;' },
		{ 'Slate': 'background-color: #272B30; color: #fff; font-style: italic;' },
		{ 'Solar': 'background-color: #002B36; color: #839496; font-style: italic;' },
		{ 'Spacelab': 'background-color: white; color: #3399F3;' },
		{ 'Superhero': 'background-color: #2B3E50; color: #DF691A; font-style: italic;' },
		{ 'United': 'background-color: white; color: #E95420;' },
		{ 'Yeti': 'background-color: white; color: #008cba;' },
	];


	const themesOthers = [
		{ link: "https://demos.creative-tim.com/material-kit/assets/css/material-kit.min.css", name: "Material Kit" },
		{ link: "https://www.gettemplate.com/demo/initio/assets/css/styles.css", name: 'Initio' },
		{ link: "https://blackrockdigital.github.io/startbootstrap-creative/css/creative.min.css", name: 'Creative' },
		{ link: "https://tympanus.net/Freebies/Cardio/css/cardio.css", name: 'Cardio' },
		{ link: "https://www.gettemplate.com/demo/magister/assets/css/magister.css", name: 'Magister' },
	];


	const txt1 = themesBootswatch.map( theme => {
		const name = Object.keys( theme )[ 0 ];
		const link = name === 'Default' ?
			'https://bootswatch.com/_vendor/bootstrap/dist/css/bootstrap.css' :
			`https://stackpath.bootstrapcdn.com/bootswatch/4.1.1/${ name.toLowerCase() }/bootstrap.min.css`;
		const bingo = link === themeName ? '*' : '';
		return `<button class=theme onclick=MNU.updateCss("${ link }"); style="${ theme[name] }" >${ bingo }${ name }${ bingo }</button> `;

	});

	MNUdivBootswatch.innerHTML = '<p>Themes from <a href="https://bootswatch.com/" target=_blank>Bootswatch</a><br>' + txt1.join( '' );

	let txt = '<p>Themes from other sources</p>';

	for ( let theme of themesOthers ) {

		//name = Object.keys( theme )[ 0 ];
		//console.log( 'name', name );
		//console.log( 'link', theme.link );
		txt += `<button class="theme btn btn-secondary" onclick=MNU.updateCss("${ theme.link }"); style="${ theme.name }" >${ theme.name }</button> `;

	}

	MNUdivCssOthers.innerHTML = txt + '<p><small>these buttons are work-in-progress WIP</small></p>';

};




MNU.getNavHeader = function() {

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
		</h2>
		<h2>
			<a href=${ MNU.urlSourceCode } target="_top" title="Source code on GitHub" >
				<img src="https://status.github.com/images/invertocat.png" height=18 >
			</a>
			<a href="" title="Click to reload this page" >${ document.title }</a>
		</h3>

		<p>
			<!-- ${ document.head.querySelector( '[ name=description ]' ).content } -->

			DEV version: Open, examine and edit very large <a href="https://gbxml.org" target="_blank"  title="Thank you, Stephen">gbXML</a> files in 3D in your browser with free, open source
			<a href="https://en.wikipedia.org/wiki/JavaScript" target="_blank"  title="Thank you, Brendan">JavaScript</a>,
			<a href="https://en.wikipedia.org/wiki/WebGL" target="_blank" title="Thank you, Ken" >WebGL</a> &
			<a href="https://en.wikipedia.org/wiki/Three.js" target="_blank" title="Thank you, Ricardo" >Three.js</a>

		</p>
	`;

	return htm;

};


MNU.setPopupShowHide = function( id, text ) {

	id.classList.toggle( "active" );

	divPopUpData.innerHTML = id.classList.contains( 'active' ) ? text : '';

}


MNU.getNavFooter = function() {

	// &#x1f578; :: 🕸 / &#x2766; :: ❦

	const htm  =
	`
	<details>

		<summary>Footer <a id=statusFooter href="JavaScript:MNU.setPopupShowHide(statusFooter,'Howdy, World!');" >&nbsp; ? &nbsp;</a></summary>

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

// https://ladybug.tools/artwork/icons_bugs/ico/spider.ico
// https://ladybug.tools/artwork/icons_bugs/ico/ladybug.ico


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
