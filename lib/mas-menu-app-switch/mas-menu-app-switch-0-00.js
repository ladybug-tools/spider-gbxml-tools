// copyright 2019 Ladybug Tools authors. MIT license.


var MAS = {}

MAS.arrApps = [

	{
		text: "Ladybug Tools home page", url: "https://www.ladybug.tools",
		title: "free computer applications that support environmental design and education"
	},
	{
		text: "Ladybug Tools GitHub", url: "https://github.com/ladybug-tools",
		title: "Source code repositories"
	},
	{
		text: "gbXML.org home page", url: "http://www.gbxml.org",
		title: "Green Building XML (gbXML) is the language of buildings ... allowing disparate building design software tools to all communicate with one another."
	},
	{
		text: "gbXML.org Schema", url: "http://www.gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html",
		title: "Version 6.01 of the gbXML schema"
	},
	{
		text: "Spider home page", url: "https://www.ladybug.tools/spider/",
		title: "3D interactive analysis in your browser mostly written around the Three.js JavaScript library"
	},
	{
		text: "Spider gbXML Viewer R12 'Aragog'", url: "https://www.ladybug.tools/spider/gbxml-viewer/",
		title: "A popular release"
	},
	{
		text: "Spider gbXML Viewer R12.36", url: "https://www.ladybug.tools/spider/gbxml-viewer/dev-12/",
		title: "stable"
	},
	{
		text: "Spider gbXML Viewer R13", url: "https://www.ladybug.tools/spider/gbxml-viewer/r13/dev/",
		title: "Yet another release"
	},
	{
		text: "Spider gbXML Viewer R14", url: "https://www.ladybug.tools/spider/gbxml-viewer/r14/aragog-shortcut.html",
		title: "An interesting release"
	},
	{
		text: "Spider gbXML tools", url: "https://www.ladybug.tools/spider-gbxml-tools/",
		title: "Home page for yools to help you find, load, examine and edit gbXML files - in large numbers and sizes"
	},
	{
		text: "Spider gbXML Viewer v0.17 'Maevia' stable", url: "https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/",
		title: "Mission: run a series of basic checks on gbXML files to identify, report and help you fix any issues."
	},
	{
		text: "Spider gbXML Viewer v0.17 beta", url: "https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/dev/",
		title: "Latest development release - still under development - may have issues"
	},
	{
		text: "Spider gbXML Fixer 'Atrax'", url: "https://www.ladybug.tools/spider-gbxml-fixer/",
		title: "Scripts to help you load and manage gbXML files"
	},
	{
		text: "Radiance Online home page", url: "https://www.radiance-online.org/",
		title: "Radiance is a suite of programs for the analysis and visualization of lighting in design."
	},
	{
		text: "Spider RAD viewer", url: "https://www.ladybug.tools/spider-rad-viewer/rad-viewer",
		title: "View Radiance RAD files in interactive 3D in your browser using the Three.js JavaScript library"
	},

];


MAS.getAppSwitch = function () {

	const options = MAS.arrApps.map( item =>
		`<option value="${item.url}" title="${item.title}" >${item.text}</option>`
	).join( "" );

	htm = `<select oninput=window.location.href=this.value >${ options }</select>`;

	return htm;

}
