
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#spider-gbxml-viewer/README.md "View file as a web page." ) </span>

<div><input type=button onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/spider-gbxml-viewer/'";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<br>

# [Spider gbXML Viewer 'Maevia' Read Me]( #spider-gbxml-viewer/README.md )


<iframe src=https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/dev/index.html width=100% height=500px >Iframes are do not render in GitHub source code views</iframe>
<div style=display:none; >
<img src=https://www.ladybug.tools/spider-gbxml-tools/images/sgv-0-17-02.png >
</div>

_Spider gbXML Viewer 'Maevia'_



## Stable version: [Spider gbXML Viewer 'Maevia' ]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/ "Click me to run the stable app" )

Or copy this link: https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/


## Development Version: [Spider gbXML Viewer Dev ]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/dev/ "Click me to run the latest app" )


## [Experimental version]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/vx-2020-01-29/gbx-gbxml/gbx-threejs-basic-2020-01-29.html )

***


## Concept

Mission: _Open and examine very large gbXML files in your browser with free, open source JavaScript._

Spider gbXML Viewer opens, parses and displays gbXML files. First released in 1999, [gbXML]( http://gbxml.org) is the architecture, engineering and construction (AEC) industry standard file format for transmitting data between CAD programs such as [Revit]( https://www.autodesk.com/products/revit/overview ), [AutoCAD]( https://www.autodesk.com/products/autocad/overview ), [Bentley MicroStation]( https://www.bentley.com/en/products/brands/microstation )  and energy analysis programs such as [Open Studio]( https://www.openstudio.net/ ), [Energy Plus]( https://energyplus.net/ ), [Sefaira]( https://sefaira.com/ ), [TAS Engineering]( https://www.edsl.net/tas-engineering/ ) and others.

gbXML files are generally created as exports from architectural design CAD programs as the minimum 3D representation of building data suitable to carry out energy and illumination studies. The intended purpose of a gbXML file is to act as a method of transferring data between applications.  This is similar to the use of [CSV]( https://en.wikipedia.org/wiki/Comma-separated_values ), [JSON]( https://en.wikipedia.org/wiki/JSON ) files or other similar uses of [XML]( https://en.wikipedia.org/wiki/XML ).

Although the guidelines of the gbXML format are clear and well documented, the process of simplifying data required for a complex building is fraught with issues. In turn the import of gbXML files with problems is also fraught with issues. A sad result is that building engineers around the world spend much time dealing with data file issues - time which would much be much better spent actually analyzing the models and recommending better solutions. The Spider project is an effort to help remedy these issues.

First released in 2017 as a programming exercise, the Spider gbXML Viewer is a web browser viewer of gbXML data. It reads the data from ASCII or ZIP files, parses the data and creates 3D representations viewable in the browser. Right from the get go, designers and engineers saw the potential for the Viewer to help spot errors visually. Within a few months release 12 of the viewer was allowing users to spot many issues as well as providing tools to fix the issues and save the data to new files

The latest version, Spider gbbXML Viewer v0.17.01 - code name 'Maevia' - helps make managing your gbXML files even faster, simpler and provides you with higher quality data transfers.



## Spider gbXML Viewer compliance with _ISO 245010 System and software quality models

Behind the improvements in the Spider gbXML Viewer, there lie a myriad of features and benefits that need to be documented and shared.

A side project for the Spider team is to document Spider gbXML Viewer compliance with _ISO 245010 System and software quality models_. By clarifying project priorities and converting abstract priorities to measurable values, the intention is develop a common understanding of the Spider gbXML Viewer's objectives and goals.

Please have a look at the following document:

## [spider-gbxml-viewer-iso-25010-compliance.md]( https://www.ladybug.tools/spider-gbxml-tools/index.html#spider-gbxml-viewer/spider-gbxml-viewer-iso-25010-compliance.md )



## Usage

All Spider are designed to open, run and update in your browser. Typically, you click on a link to the script, it loads, opens a default file to let you know it's working and then you select files to work on using the file open dialog box, clicking on a link or dragging and dropping a file into the designated box.

Once you have opened a file for viewing you can click on any 'surface' in the model to view its attributes in the popup menu on the right. Using the left menu you may view the model by applying filters. You mau also locate and fix errors in the file.

Just about every menu panel has an associated help file you may access by clicking the "?" button to the right of the menu.

## Variations

The are a number of slightly different Spider gbXML Viewer files you may experiment with:

### Absolute and relative link versions

If a file title is like this: file-name.html then you can move or copy that file anywhere - to your computer or server - and it should run. by clicking on it. All assets are called using absolute links

If a file title is like this: file-name-dev.html then file is set up for you to edit and customize. The file uses relative links. All support files need to be available nearby.

You may follow the guidelines for loading local files here [Opening and loading files with gbXML Viewer]( https://www.ladybug.tools/spider/#pages/file-open.md ) in order to embed the Viewer in a local workflow and avoid CORS issues.

### Cor and pop versions

* [cor]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/cor ): no menu or popup. Useful for embedding in an [iframe]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/v-0-17-02/app-core/view-core-in-iframe.html )
* [pop]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/ ): popup on right but no left menu. Also good in an [iframe]( https://www.ladybug.tools/spider-gbxml-tools/spider-gbxml-viewer/v-0-17-02/app-popup/iframe-src-xml-via-filereader.html )


## More

For contributing, license and other similar information, click on 'Help menu' in the eft menu. 2019-08-06: There's a bug and currently you will have to scroll back to the top of the page to read the content.


***

### <center title="Howdy! My web is better than yours. ;-)" ><a href=javascript:window.scrollTo(0,0); style="text-decoration:none !important;" > <img src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" height="18"> </a></center>

