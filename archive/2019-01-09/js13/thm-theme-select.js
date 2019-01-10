// Copyright 2019 pushMe pullYou authors. MIT License
// jshint esversion: 6
/* globals navMenu, divW3Schools, divBootswatch, THMcssCurrent, THMcssW3schools, THMcssBootswatch */

const THM = { "release": "R1.3", "date": "2019-01-02" };

THM.currentStatus =
	`
		<h3>THM ${ THM.release} status ${ THM.date }</h3>

		<p>Select Stylesheet Theme</p>

		<p>This edition of the script provides significantly greater functionality over previous releases. Much testing needed</p>

		<p>This module allows you to load:
			<ul>
				<li>Basic style sheet</li>
				<li>Style sheet from W3Schools</li>
				<li>Style sheet from Bootswatch</li>
				<!-- <li></li> -->
			</ul>
		</p>
		<p>
			You can switch themes at any time. Current them choice is saved between sessions.
		</p>
		<p>
			Objective: make it easy for you to adapt the style of this viewer to the needs specific to your organization.
		</p>

		<p><a href="https://pushme-pullyou.github.io/#tootoo-templates/cookbook/select-stylesheet-theme/README.md" target="_blank">Read Me</a></p>

		<p>
			Change log
			<ul>
				<li>2018-12-31 First commit here</li>
				<li>Forked from Jaanga Cookbook R1</li>
				<li>Add save/read stylesheet url to localStorage</li>
				<li>Add input box to display and edit current stylesheet URL</li>
				<li>Add ability to load any Bootstrap stylesheet</li>
				<li>Much refactoring</li>
			</ul>
		</p>

`;

// THM.description = THM.description || document.head.querySelector( "[ name=description ]" ).content;

THM.themeUrlStorage = 'tootooCookbookThemeUrl';

//THM.cssBasic = "js13/style.css";
THM.cssW3schools = "https://www.w3schools.com/lib/w3-theme-red.css";
THM.themeBootswatch = 'https://bootswatch.com/_vendor/bootstrap/dist/css/bootstrap.css';


THM.init = function() {

	THM.themeUrl = localStorage.getItem( THM.themeUrlStorage ) || THM.cssBasic;
	THMcssCurrent.value = THM.themeUrl;

	//console.log( 'THM.themeUrl', THM.themeUrl );

	 if ( THM.themeUrl.includes( 'w3schools' ) ) {

		THM.loadCssW3schools();

	} else if ( THM.themeUrl.includes( 'bootstrap' ) ) {

		THM.loadCssBootswatch();

	} else if ( THM.themeUrl === THM.cssBasic ) {

		THM.loadCssBasic();

	} else {

		THM.loadCssBootswatch();

	}

};



THM.getMenuThemeSelect = function() {

	const htm =
	`
		<details >

			<summary>Select Theme
				<a id=thmSum class=helpItem href="JavaScript:MNU.setPopupShowHide(thmSum,THM.currentStatus);" >&nbsp; ? &nbsp;</a>
			</summary>

			<p>
				Current stylesheet:<br>
				<input id=THMcssCurrent >
			</p>

			<p>
				<button onclick=THM.loadCssBasic(); accessKey='z' title='access key: z '>load CSS Basic</button>
			</p>

			<p>
				<button onclick=THM.loadCssW3schools(); accessKey='x' title='access key: x ' >load CSS W3schools</button>
			</p>

			<p id=divW3Schools ></p>

			<p>
				<button onclick=THM.loadCssBootswatch(); accessKey='c' title='access key: c ' >load CSS Bootswatch</button>
			</p>

			<div id=divBootswatch ></div>

		</details>
	`;

	return htm;

};


THM.linksRemove = function() {

	Array.prototype.forEach.call( document.querySelectorAll( 'style,[rel="stylesheet"],[type="text/css"]'),

	function( element ){

		try {

			element.parentNode.removeChild( element );

		}

		catch( err ) {}

	} );

	const cssBasic = document.head.appendChild( document.createElement( 'link' ) );
	cssBasic.rel = "stylesheet";
	//cssBasic.id = 'THMcssBasic';
	cssBasic.href = THM.cssBasic;

	THM.toggleTagsClassListW3schools( 'remove' );

	THM.toggleTagsClassListBootswatch( 'remove' );

};



THM.loadCssBasic = function() {

	THM.linksRemove();

	localStorage.setItem( THM.themeUrlStorage, THM.cssBasic );
	THMcssCurrent.value = THM.cssBasic;

};



//////////

THM.loadCssW3schools = function() {

	THM.linksRemove();

	const cssW3 = document.head.appendChild( document.createElement( 'link' ) );
	cssW3.rel = "stylesheet";
	cssW3.href = "https://www.w3schools.com/w3css/4/w3.css";

	THM.themeUrl = THM.themeUrl.includes( 'w3schools' ) ? THM.themeUrl : THM.cssW3schools;

	THM.cssW3Theme = document.head.appendChild( document.createElement( 'link' ) );
	THM.cssW3Theme.rel = "stylesheet";
	THM.cssW3Theme.id = "THMcssW3schools";
	THM.cssW3Theme.href = THM.themeUrl;

	THM.toggleTagsClassListW3schools( 'add' );

	localStorage.setItem( THM.themeUrlStorage, THM.themeUrl);
	THMcssCurrent.value = THM.themeUrl;

};



THM.toggleTagsClassListW3schools= function( action = 'add' ) {

	document.body.querySelectorAll( 'nav' )
	.forEach( item => item.classList[ action ]( "w3-theme-l5" ) );

	document.body.querySelectorAll( 'a' )
	.forEach( item => item.classList[ action ]( "w3-text-theme", "w3-medium", "w3-hover-shadow" ) );

	navMenu.querySelectorAll( 'div' )
	.forEach( item => item.classList[ action ]( "w3-container", "w3-text-theme", "w3-small" ) );

	document.body.querySelectorAll( 'summary' )
	.forEach( item => item.classList[ action ]( "w3-bar-item", "w3-theme-l2", "w3-small", "w3-hover-shadow"  ) );

	document.body.querySelectorAll( 'button' )
	.forEach( item => item.classList[ action ]( "w3-button", "w3-theme-l3", "w3-small", "w3-round" ) );

	document.body.querySelectorAll( 'input' )
	.forEach( item => item.classList[ action ]( "w3-input", "w3-theme-l4", "w3-small", "w3-round", "w3-border", "w3-hover-theme" ) );

	document.body.querySelectorAll( 'select' )
	.forEach( item => item.classList[ action ]( "w3-select", "w3-theme-l2", "w3-round" ) );

	THM.toggleDivW3schools( action );

};



THM.toggleDivW3schools = function( action = 'add' ) {

	if ( action === 'add' ) {

		const themes = [ 'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'khaki', 'yellow',
			'amber', 'orange', 'deep-orange', 'blue-grey', 'brown', 'grey', 'dark-grey', 'black', 'w3schools' ];

		const pThemes = themes.reduce( ( acc, theme ) =>
			acc + `<a href=JavaScript: onclick=THM.setCssW3schools("${ theme }"); style=font-size:2rem;line-height:1rem;text-decoration:none;color:${ theme.replace( '-', '' ) }
			title="${ theme }" >&bull;</a> `, '' );

		divW3Schools.innerHTML =
		`
			<p id=pThemes >${ pThemes }</p>

			<p>Colors from:<br><a href="https://www.w3schools.com/w3css/" target="_blank" >www.w3schools.com/w3css</a></p>

		`;

	} else {

		divW3Schools.innerHTML = '';

	}

};



THM.setCssW3schools = function( color ) {

	THMcssW3schools.href = "https://www.w3schools.com/lib/w3-theme-" + color + ".css";

	localStorage.setItem( THM.themeUrlStorage, THM.cssW3Theme.href );
	THMcssCurrent.value = THM.cssW3Theme.href;

};



//////////

THM.loadCssBootswatch = function() {

	THM.linksRemove();

	//THM.themeUrl = THM.themeUrl.includes( 'bootswatch' ) ? THM.themeUrl : THM.themeBootswatch;

	THM.themeUrl = THMcssCurrent.value;

	const cssBootswatch = document.head.appendChild( document.createElement('link') );
	cssBootswatch.rel = "stylesheet";
	cssBootswatch.id = 'THMcssBootswatch';
	cssBootswatch.href = THM.themeUrl;
	//console.log( 'cssBootswatch', cssBootswatch );

	THM.toggleTagsClassListBootswatch();
	localStorage.setItem( THM.themeUrlStorage, THM.themeUrl);
	//THMcssCurrent.value = THM.themeUrl;

};



THM.toggleTagsClassListBootswatch = function( action = 'add' ) {

	document.body.querySelectorAll( 'nav' )
		.forEach( item => {
			item.classList[ action ]( "jumbotron" );
			item.style.backgroundColor = '';
		} );


	document.body.querySelectorAll( 'div' )
		.forEach( item => item.classList[ action ]( "card-body" ) );

	document.body.querySelectorAll( 'summary' )
		.forEach( item => item.classList[ action ]( "nav-link", "btn", "btn-primary" ) );

	document.body.querySelectorAll( 'button' )
		.forEach( item => item.classList[ action ]( "btn", "btn-primary", "btn-sm" ) );

	document.body.querySelectorAll( 'input' )
		.forEach( item => item.classList[ action ]( "form-control" ) );

	document.body.querySelectorAll( 'select' )
		.forEach( item => item.classList[ action ]( "form-control") );

	THM.toggleDivBootswatch( action );

};



THM.toggleDivBootswatch = function( action = 'add' ) {

	if ( action === 'add') {

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

		const txt1 = themesBootswatch.map( theme => {

			const name = Object.keys( theme )[ 0 ];

			const link = name === 'Default' ?
				'https://bootswatch.com/_vendor/bootstrap/dist/css/bootstrap.css' :
				`https://stackpath.bootstrapcdn.com/bootswatch/4.1.1/${ name.toLowerCase() }/bootstrap.min.css`;

			const bingo = link === THM.themeUrl ? '*' : '';

			return `<button class=theme onclick=THM.setCssBootswatch("${ link }"); style="${ theme[name] }" >${ bingo }${ name }${ bingo }</button> `;

		} );


		const themesOthers = [
			{ link: "https://demos.creative-tim.com/material-kit/assets/css/material-kit.min.css", name: "Material Kit" },
			{ link: "https://www.gettemplate.com/demo/initio/assets/css/styles.css", name: 'Initio' },
			{ link: "https://blackrockdigital.github.io/startbootstrap-creative/css/creative.min.css", name: 'Creative' },
			{ link: "https://tympanus.net/Freebies/Cardio/css/cardio.css", name: 'Cardio' },
			{ link: "https://www.gettemplate.com/demo/magister/assets/css/magister.css", name: 'Magister' },
		];

		let txt2 = '';

		for ( let theme of themesOthers ) {

			txt2 += `<button class="btn btn-secondary" onclick=THM.setCssBootswatch("${ theme.link }"); >${ theme.name }</button> `;

		}


		divBootswatch.innerHTML =
		`
			<p>
				Bootstrap themes from <a href="https://bootswatch.com/" target=_blank>Bootswatch</a>
			</p>
			<p>
				${ txt1.join( '' ) }
			</p>
			<p>
				Bootstrap themes from various sources
			</p>
			<p>
				${ txt2 }
			</p>
		`;

	} else {

		divBootswatch.innerHTML = '';

	}

};



THM.setCssBootswatch = function( link ) {

	THMcssBootswatch.href = link;

	localStorage.setItem( THM.themeUrlStorage, link );
	THMcssCurrent.value = link;

};
