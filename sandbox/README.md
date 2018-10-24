
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#sandbox/README.md "View file as a web page." ) </span>

<div><input type=button class = "btn btn-secondary btn-sm" onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/xxxxxx/README.md'";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<br>

# [Spider gbXML Tools Sandbox Read Me]( #sandbox/README.md )

<!--
<iframe src=https://www.ladybug.tools/spider-gbxml-tools/xxxxxx/index.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Viewer ZZZZZ</small>_
-->

## [embeddable_gbxml_editor_assembled Read Me]( #sandbox/embeddable_gbxml_editor_assembled/README.md )

Files for [OpenStudio]( https://www.openstudio.net/ ). See also OpenStudio tutorial: Import gbXML

OpenStudio Release 2.7.0 and later allow you to load and view gbXML files from within the program. The tool for doing this a based on a specially constructed HTML file. The file is embbeded into the OpenStdio during the make process. The following are requirements

* The file must contain all the required HTML tags, CSS and JavaScript to enable the app to run.
* Data as the text source of an XML file is sent to the script via ```GBX.parseFileXML()```
* Parsed text is converted into Three.js meshes and displayed
* Initialization is via ```init()``` and commencing the animation via ```animate()``` are controlled by Open Stdio

This folder contains files that meet the above requirements and that could be embedded in builds of  Open Studio.

2018-10-23 ~ Contents include:

* A copy of the original file
* A hacked stripped-down version of the original file
* An HTML web page that allows you to load anf view these scripts in an ```iframe```


## [embeddable_gbxml_editor_demos Read Me]( #sandbox/embeddable_gbxml_editor_demos/README.md )

A very nice feature of the OpenStudio gbXML import tools is that you may build and and test your own versions very easily.

The single requirement is that an HTML file with the title 'embeddable_gbxml_editor.html' be made available in the ```bin``` of the OpenStudio program folders. This file is loaded as and when an instance of OpeStdio is invoked. And it is reloaded each time there is a call to import a gbXML file. The makes editing and testing very easy.

The requirements for the HTML file are fare less strigant that the embedded file. In essence, almost anything goes. Three.js files may be loaded from a CDN. Support files may be loaded from disk and so on. The only significant requirement is that ```init()``` and ```animate()``` are called by OpenStudio

2018-10-23 ~ Contents include:

*




## Concept

Experiments. Work-in-progress. Interesting failures. Whatever.

## To Do / Wish List


## Issues




## Links of Interest

* http://nrel.github.io/OpenStudio-user-documentation/

## Change Log

### 2018-10-23 ~ Theo

* First commit


***

### <center title="Howdy! My web is better than yours. ;-)" ><a href=javascript:window.scrollTo(0,0); style="text-decoration:none !important;" > &#x1f578; </a></center>

