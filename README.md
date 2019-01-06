

<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page](https://www.ladybug.tools/spider-gbxml-tools/index.html#README.md "View file as a web page." ) </span>


<div><input type=button class = btn btn-secondary btn-sm" onclick=window.location.href="https://github.com/ladybug-tools/spider-gbxml-tools/" value="You are now in a GitHub web page view - Click this button to view this read me file as source code" ><div>

<br>

# [Spider gbXML Tools Read Me]( #README.md )

<iframe class=iframeReadMe src=https://www.ladybug.tools/spider-gbxml-tools/cookbook/spider-gbxml-iframe-carousel/ width=100% height=500px >Iframes are not displayed on github.com</iframe>
_<small>Spider gbXML Viewer ~ Iframe Carousel: display multiple interactive 3D models in a single space on any web page. Zoom turned off.</small>_


## Welcome <a href="https://www.openstudio.net/" title="Hi Dan! Hi NREL!" style=color:red; target="_blank">Open Studio</a> fans!
Welcome [LinkedIn]( https://www.linkedin.com/feed/update/urn:li:activity:6458956499195568128/ ) and [discourse.ladybug.tools]( https://discourse.ladybug.tools/t/spider-gbxml-viewer-embedded-in-openstudio/4129 ) viewers

<!--
## Welcome <a href="https://www.rtcevents.com/bilt/eur18/" title="Hi Michal! Hi Ljubljana!" style=color:red; target="_blank">BILT EUR 2018</a> attendees!
-->

<br>

## Concept

Scripts to help you view and manage [gbXML]( http://gbxml.org ) files.

The scripts here are a fork of the scripts at https://www.ladybug.tools/spider/. The intention is to provide a faster, simpler more effective user experience base on a simpler, more modular code base.

The impetus for this code arose from the request by the developers of OpenStudio for a viewer that could embedded in their code. It became quickly evident that the new codebase offered significant advantages over the the previous codebase. And, thus, the majority of ongoing development efforts have been transferred to this project. Previous releases will be supported at least to the extent of fixing bugs that that are reported.


2019-01-01 ~ The following list is is outdated and needs refactoring

[Spider gbXML Text Parser]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/ )

***

### Latest release: [gbXML Viewer Basic]( https://www.ladybug.tools/spider-gbxml-tools/gbxml-viewer-basic/index.html )


#### [gbXML Viewer Basic Read Me]( https://www.ladybug.tools/spider-gbxml-tools/#gbxml-viewer-basic/README.md )

* Open, view gbXML files in 3D in your browser with free, open source entry-level Three.js JavaScript
* This script contains the core or basic modules for an entry level viewing experience

***

### [gbXML Viewer Cookbook Gallery]( https://www.ladybug.tools/spider-gbxml-tools/#cookbook/cookbook-viewer-one-pager.html )

#### [gbXML Viewer Cookbook Read Me]( https://www.ladybug.tools/spider-gbxml-tools/#cookbook/README.md )

* A variety of add-on scripts that enhance Spider gbXML Basic
* Current capabilities include identifying issues with gbXML files, cutting 3D sections through 3D models and more
* Eventually all the features of Spider 'Aragog' Viewer R14 will be added as modules here


***


### [gbXML Viewer Sandbox Read Me]( https://www.ladybug.tools/spider-gbxml-tools/#sandbox/README.md )

* Files at an early stage of development

#### Latest release: [Spider gbXML Text Parser]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/ )

#### [Spider gbXML Text Parser Read Me]( https://www.ladybug.tools/spider-gbxml-tools/#sandbox/spider-gbxml-text-parser/README.md )

Many features
* Load very large gbXML files ( greater than 700 megabytes ) at a reasonable speed
* Read files in either UTF-8 or UTF-16 format
* Display geometry progressively as file loads - visual feedback for very large files
* Open remote files via a URL or local files via the file dialog box
* Open and automatically extract UTF-8 and UTF-6 files contained in ZIP compressed folders using file dialog box
* Save edited file to disk

And much more


#### Latest release: [Fetch Assemble Save ]( https://www.ladybug.tools/spider-gbxml-tools/fetch-assemble-save/index.html )

#### [Fetch Assemble Save Read Me]( https://www.ladybug.tools/spider-gbxml-tools/#fetch-assemble-save/README.md )

* Fetch source files from a CDN, assemble these into a single HTML file, save to file
* Build the source code needed to embed the Spider gbXML Viewer in OpenStudio
* 2018-10-23 ~ Currently very out of date. Fixes coming soon

***

## Links of Interest

#### [gbXML to OpenStudio Report]( https://www.ladybug.tools/spider-gbxml-tools/#gbxml-to-openstudio-report.md )

***

#### gbXML Home Page

* <http://www.gbxml.org/>
> gbXML is an industry supported schema for sharing building information between disparate building design software tools.

#### gbXML GitHub Presence
* <https://github.com/GreenBuildingXML>
	* <https://github.com/GreenBuildingXML/gbXML-Schema>
	* <https://github.com/GreenBuildingXML/Sample-gbXML-Files>

> Repositories for all things gbXML including the schema, validator source code, test cases, and more...

#### gbXML Schema as a document

* <http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html>

> Schema GreenBuildingXML_Ver6.01.xsd / the core definition of gbXML in a format that is easier to read than the source code.

### More gbXML References

* <https://en.wikipedia.org/wiki/Green_Building_XML>

> The Green Building XML schema (gbXML) is an open schema developed to facilitate transfer of building data stored in Building Information Models (BIM) to engineering analysis tools. gbXML is being integrated into a range of software CAD and engineering tools and supported by leading 3D BIM vendors. gbXML is streamlined to transfer building properties to and from engineering analysis tools to reduce the interoperability issues and eliminate plan take-off time.


* <https://twitter.com/gbXML>
> The gbXML open schema helps facilitate the transfer of building properties stored in 3D building information models (BIM) to engineering analysis tools.

## To Do

* 2019-01-01 ~ HTML iframes and textareas have incorrect heights
* 2019-01-01 ~ Footer links needs homogenizing with tootoo
* 2019-01-01 ~ Bootstrap menu backgrounds need better classes
* 2019-01-01 ~ W3Schools fonts need better text sizes

## Change Log



### 2019-01-01 ~ Theo

New home page based on tootoo cms r13

### 2018-10-23 ~ Theo

Home page
* Minor text updates

#### 2018-10-19 ~ Theo

R7.6
* Add link to Issues module

#### 2018-10-15 ~ Theo

R7.5 Home page
* Many text updates
* Add full screen icons
* Fix scrolling issue

#### 2018-08-06 ~ Theo

R5
* Cleanup read me & index.html


#### 2018-07-14 ~ Theo

* Update text & links
* Add links of interest

#### 2018-07-13 ~ Theo

* First commit
* Add index.html & read me
* Add gbxml viewer basic folder and files

***

# <center title="hello!" ><a href=javascript:window.scrollTo(0,0); style=text-decoration:none; > &#x1f578; </a></center>


