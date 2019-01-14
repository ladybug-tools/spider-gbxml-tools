
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-file-open/README.md "View file as a web page." ) </span>

<div><input type=button class = "btn btn-secondary btn-sm" onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/tree/master/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-file-open'";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<br>

# [Spider gbXML Viewer Open File Read Me]( #cookbook/spider-viewer-open-file/README.md )


<iframe src=https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-file-open/index.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Viewer Open File</small>_

## Full Screen: [Spider gbXML Viewer Open File]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-text-parser/r10/cookbook/spider-gbxml-file-open/ )



## Concept



## To Do / Wish List

* Needs a bit more cleanup and moving calls to GBX module
* Rename to fil-file-handling-utilities?

## Features


### File Open

Files may be opened is a variety of ways
* By providing a link in a URL
* By dragging either a file or URL into the designated area of the file menu
* By using the operating system file dialog box
* By entering a link in a designated text input box

Testing often requires reloading a file many times in a rapid succession
The viewer is designed to help
* Clicking the reload browser will reload the file in the URL
* Any link in designated text input box will be reload using
	* Browser reload button
	* Clicking the larger script title at the top of the menu


Given a URL
* Requests an XML file and returns the text
* Uses jsZIP to request ZIP files, decompresses, extracts text from first file found

Given a DOM Reader.result - from Drag and Drop or input type file
* Load an XML
* Uses jsZIP to request ZIP files, decompresses, extracts text from first file found

Progress indication
* Current status update and displayed regularly
* There is good feedback even on very large files


### File save

* Saves files as XML text
* Compresses XML data and saves to ZIP file with same name as XML file


## Issues



## Links of Interest



## Change Log


### 2018-12-29 ~ Theo

* Fix read me links
* Add helpItem class

### 2018-12-14 ~ Theo

fil-open-file.js r10.2
* Streamline FIL.onProgress handling a lot
* Update variable and function names to be clearer
* Add events - no more GBX references except for file saves
* Fix jsHint warnings

### 2018-12-13 ~ Theo

spider-gbxml-file-open.html
spider-gbxml-text-parser.html
* Rejig the menu again

fil-open-file.js r10.1
* 2018-12-13 ~ Add save to gbXML abd to ZIP<
* 2018-12-13 ~ Open gbXML and open zip combined into single UI element. Major code refactor.<
* 2018-12-13 ~ Add cookbook test script<
* 2018-12-13 ~ Improve modularization and event-handing between modules<
* 2018-12-13 ~ Improve loading progress indication<
* 2018-12-13 ~ Fixed: Files saved to ZIP are OK but not compressed

### 2018-11-03 ~ Theo

* First commit


***

### <center title="Howdy! My web is better than yours. ;-)" ><a href=javascript:window.scrollTo(0,0); style="text-decoration:none !important;" > &#x1f578; </a></center>

