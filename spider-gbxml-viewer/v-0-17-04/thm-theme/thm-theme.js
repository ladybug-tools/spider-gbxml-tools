// Copyright 2019 pushMe pullYou authors. MIT License
// jshint esversion: 6
/* globals navMenu, THMdivW3Schools, divBootswatch, THMcssCurrent, THMcssW3schools, THMcssBootswatch */

const THM = {

	script: {
		"copyright": "Copyright 2019 pushMe-pullYou authors. MIT License",
		"date": "2019-09-30",
		"helpFile": "",
		"license": "MIT License",
		"version": "0.14.08-0",
	},


};

THM.getHelp = function () { console.log( '', 23 ); }

THM.script.description =
	`
		TooToo Theme Select (THM) creates HTML menus and provides JavaScript code to add, select and load themes based on industry-standard CSS stylesheets
	`;



//THM.cssDefault = "https://www.w3schools.com/lib/w3-theme-red.css";
THM.cssDefault = "style.css";

THM.themeUrlStorage = "tootoo14ThemeUrl"; // set for each instance in HTML file

THM.cssW3schools = "https://www.w3schools.com/lib/w3-theme-red.css";
THM.themeBootswatch = "https://bootswatch.com/_vendor/bootstrap/dist/css/bootstrap.css";


THM.getMenuThemeSelect = function() {

	const htm =
	`
		<details>

			<summary>Select theme </summary>

			<div>

				<button id=butTHM class=butHelp onclick="THM.getHelp();" >?</button>

				<p>
					Current stylesheet:<br>
					<input id=THMcssCurrent style=width:100%; >
				</p>

				<p>
					<button onclick=THM.loadCssDefault(); accessKey="z" title="access key: z ">load CSS default</button>
				</p>

				<p>
					<button onclick=THM.loadCssW3schools(); accessKey="x" title="access key: x " >load CSS W3schools</button>
				</p>

				<p id=THMdivW3Schools ></p>

				<p>
					<button onclick=THM.loadCssBootswatch(); accessKey="c" title="access key: c " >load CSS Bootswatch</button>
				</p>

			</div>

			<div id=divBootswatch ></div>

		</details>
	`;

	return htm;

};


THM.init = function() {

	THM.themeUrl = localStorage.getItem( THM.themeUrlStorage ) || "";

	THMcssCurrent.value = THM.themeUrl;
	console.log( "THM.themeUrl", THM.themeUrl );

	if ( THM.themeUrl.includes( "w3schools" ) ) {

		THM.loadCssW3schools();

	} else if ( THM.themeUrl.includes( "bootstrap" ) ) {

		THM.loadCssBootswatch();

	} else {

		THM.loadCssDefault();

	// } else {

	// 	THM.loadCssBootswatch();

	}

};



THM.linksRemove = function() {

	const sheets = document.querySelectorAll( `style,[rel="stylesheet"],[type="text/css"]` );

	Array.from( sheets ).forEach( ( element ) => {

		try { element.parentNode.removeChild( element ); }

		catch ( err ) { console.log( 'error', err ); }

	} );

	const cssDefault = document.head.appendChild( document.createElement( "link" ) );
	cssDefault.rel = "stylesheet";;
	cssDefault.href = THM.cssDefault;

	THM.toggleTagsClassListW3schools( "remove" );

	THM.toggleTagsClassListBootswatch( "remove" );

};



THM.loadCssDefault = function() {

	THM.linksRemove();

	localStorage.setItem( THM.themeUrlStorage, "" );
	THMcssCurrent.value = "";

	navMenu.style.backgroundColor = "#eee";
	//navMenu.style.padding = "0"; // why is this needed?

};



//////////

THM.loadCssW3schools = function() {

	THM.linksRemove();

	const cssW3 = document.head.appendChild( document.createElement( "link" ) );
	cssW3.rel = "stylesheet";
	cssW3.href = "https://www.w3schools.com/w3css/4/w3.css";

	THM.themeUrl = THM.themeUrl.includes( "w3schools" ) ? THM.themeUrl : THM.cssW3schools;

	THM.cssW3Theme = document.head.appendChild( document.createElement( "link" ) );
	THM.cssW3Theme.rel = "stylesheet";
	THM.cssW3Theme.id = "THMcssW3schools";
	THM.cssW3Theme.href = THM.themeUrl;

	THM.toggleTagsClassListW3schools( "add" );

	localStorage.setItem( THM.themeUrlStorage, THM.themeUrl);
	THMcssCurrent.value = THM.themeUrl;

};



THM.toggleTagsClassListW3schools= function( action = "add" ) {

	//document.body.querySelectorAll( "nav" )
	//.forEach( item => item.classList[ action ]( "w3-theme-l5" ) );

	//document.body.querySelectorAll( "a" )
	//.forEach( item => item.classList[ action ](  "w3-text-theme", "w3-hover-shadow" ) );

	document.body.querySelectorAll( "h1" )
		.forEach( item => item.classList[ action ]( "w3-theme-l1" ) );

	document.body.querySelectorAll( "h2" )
	.forEach( item => item.classList[ action ]( "w3-theme-l2" ) );

	document.body.querySelectorAll( "h3, h4, h5" )
	.forEach( item => item.classList[ action ]( "w3-theme-l3" ) );


	document.body.querySelectorAll( "aside, blockquote, code, input, pre" )
	.forEach( item => item.classList[ action ]( "w3-theme-l4", "w3-small", "w3-round", "w3-border", "w3-hover-theme" ) );

	document.body.querySelectorAll( "button" )
	.forEach( item => item.classList[ action ]( "w3-theme-l3", "w3-small", "w3-round", "w3-hover-shadow" ) );

	document.body.querySelectorAll( "select" )
	.forEach( item => item.classList[ action ]( "w3-select", "w3-theme-l2", "w3-round" ) );

	document.body.querySelectorAll( "summary" )
	.forEach( item => item.classList[ action ](  "w3-theme-l1", "w3-hover-shadow" ) );

	document.body.querySelectorAll( ".sumMenuTitle" )
	.forEach( item => item.classList[ action ]( "w3-bar-item", "w3-theme-l2", "w3-hover-shadow" ) );

	document.body.querySelectorAll( "#navMenu" )
		.forEach( item => item.classList[ action ]( "w3-theme-l5" ) );

	document.body.querySelectorAll( ".aTitle" )
		.forEach( item => {
			item.style.fontSize = "2rem";
		} );

	document.body.querySelectorAll( ".dingbat" )
		.forEach( item => item.classList[ action ]( "w3-text-theme" ) );

	THM.toggleTHMDivW3schools( action );

};



THM.toggleTHMDivW3schools = function( action = "add" ) {

	if ( action === "add" ) {

		const themes = [ "red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green", "light-green", "lime", "khaki", "yellow",
			"amber", "orange", "deep-orange", "blue-grey", "brown", "grey", "dark-grey", "black", "w3schools" ];

		const pThemes = themes.reduce( ( acc, theme ) =>
			acc + `<a href=JavaScript: onclick=THM.setCssW3schools("${ theme }"); style=font-size:2rem;line-height:1rem;text-decoration:none;color:${ theme.replace( "-", "" ) }
			title="${ theme }" >&bull;</a> `,
		"" );

		THMdivW3Schools.innerHTML =
		`
			<p id=pThemes >${ pThemes }</p>

			<p>Colors from:<br><a href="https://www.w3schools.com/w3css/" target="_blank" >www.w3schools.com/w3css</a></p>

		`;

	} else {

		THMdivW3Schools.innerHTML = "";

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

	THM.themeUrl = THMcssCurrent.value;

	const cssBootswatch = document.head.appendChild( document.createElement("link") );
	cssBootswatch.rel = "stylesheet";
	cssBootswatch.id = "THMcssBootswatch";
	cssBootswatch.href = THM.themeUrl;
	//console.log( "cssBootswatch", cssBootswatch );

	THM.toggleTagsClassListBootswatch();
	//localStorage.setItem( THM.themeUrlStorage, THM.themeUrl);
	//THMcssCurrent.value = THM.themeUrl;

};


THM.toggleTagsClassListBootswatch = function ( action = "add" ) {

	navMenu.style.backgroundColor = "initial";
	navMenu.classList[ action ]( "bg-light" );

	document.body.querySelectorAll( "a" )
		.forEach( item => item.classList[ action ]( "text-primary" ) );

	document.body.querySelectorAll( "h1, h2, h3, h4, h5" )
		.forEach( item => item.classList[ action ]( "bg-primary", "text-light" ) );

	document.body.querySelectorAll( "aside, blockquote, code, input, pre" )
	.forEach( item => item.classList[ action ]( "navbar", "navbar-light", "bg-light" ) );

	document.body.querySelectorAll( "button" )
		.forEach( item => item.classList[ action ]( "btn", "btn-primary", "btn-sm" ) );

	document.body.querySelectorAll( "input" )
		.forEach( item => item.classList[ action ]( "form-control" ) );

	document.body.querySelectorAll( "select" )
		.forEach( item => item.classList[ action ]( "form-control" ) );

	document.body.querySelectorAll( "summary" )
		.forEach( item => item.classList[ action ]( "nav-link", "btn", "btn-primary" ) );

	document.body.querySelectorAll( ".aTitle" )
		.forEach( item => item.classList[ action ]( "text-light" ) );

	document.body.querySelectorAll( ".dingbat" )
		.forEach( item => item.classList[ action ]( "text-primary" ) );

	THM.toggleDivBootswatch( action );

};



THM.toggleDivBootswatch = function( action = "add" ) {

	if ( action === "add") {

		const themesBootswatch = [
			{ "Default": "background-color: white; color: #007bff" },
			{ "Cerulean": "background-color: white; color: #2FA4E7;" },
			{ "Cosmo": "background-color: white; color: #2780E3;" },
			{ "Cyborg": "background-color: #060606; color: #2A9FD6; font-style: italic;" },
			{ "Darkly": "background-color: #222; color: #00bc8c; font-style: italic;" },
			{ "Flatly": "background-color: white; color: #18BC9C;" },
			{ "Journal": "background-color: white; color: #EB6864;" },
			{ "Litera": "background-color: white; color: #4582EC;" },
			{ "Lumen": "background-color: white; color: #158CBA;" },
			{ "Lux": "background-color: white; color: #1a1a1a;" },
			{ "Materia": "background-color: white; color: #2196F3;" },
			{ "Minty": "background-color: white; color: #78C2AD;" },
			{ "Pulse": "background-color: white; color: #593196;" },
			{ "Sandstone": "background-color: white; color: #93C54B;" },
			{ "Simplex": "background-color: white; color: #D9230F;" },
			{ "Sketchy": "background-color: white; color: #333;" },
			{ "Slate": "background-color: #272B30; color: #fff; font-style: italic;" },
			{ "Solar": "background-color: #002B36; color: #839496; font-style: italic;" },
			{ "Spacelab": "background-color: white; color: #3399F3;" },
			{ "Superhero": "background-color: #2B3E50; color: #DF691A; font-style: italic;" },
			{ "United": "background-color: white; color: #E95420;" },
			{ "Yeti": "background-color: white; color: #008cba;" },
		];

		const txt1 = themesBootswatch.map( theme => {

			const name = Object.keys( theme )[ 0 ];

			const link = name === "Default" ?
				"https://bootswatch.com/_vendor/bootstrap/dist/css/bootstrap.css" :
				`https://stackpath.bootstrapcdn.com/bootswatch/4.1.1/${ name.toLowerCase() }/bootstrap.min.css`;

			const bingo = link === THM.themeUrl ? "*" : "";

			return `<button class=theme onclick=THM.setCssBootswatch("${ link }"); style="${ theme[name] }" >${ bingo }${ name }${ bingo }</button> `;

		} );


		const themesOthers = [
			{ link: "https://demos.creative-tim.com/material-kit/assets/css/material-kit.min.css", name: "Material Kit" },
			{ link: "https://www.gettemplate.com/demo/initio/assets/css/styles.css", name: "Initio" },
			{ link: "https://blackrockdigital.github.io/startbootstrap-creative/css/creative.min.css", name: "Creative" },
			{ link: "https://tympanus.net/Freebies/Cardio/css/cardio.css", name: "Cardio" },
			{ link: "https://www.gettemplate.com/demo/magister/assets/css/magister.css", name: "Magister" },
		];

		let txt2 = "";

		for ( let theme of themesOthers ) {

			txt2 += `<button class="btn btn-secondary" onclick=THM.setCssBootswatch("${ theme.link }"); >${ theme.name }</button> `;

		}


		divBootswatch.innerHTML =
		`
			<p>
				Bootstrap themes from <a href="https://bootswatch.com/" target=_blank>Bootswatch</a>
			</p>
			<p>
				${ txt1.join( "" ) }
			</p>
			<p>
				Bootstrap themes from various sources
			</p>
			<p>
				${ txt2 }
			</p>
		`;

	} else {

		divBootswatch.innerHTML = "";

	}

};



THM.setCssBootswatch = function( link ) {

	THMcssBootswatch.href = link;

	localStorage.setItem( THM.themeUrlStorage, link );
	THMcssCurrent.value = link;

};