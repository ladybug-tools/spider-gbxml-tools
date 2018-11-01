
<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-gbxml-tools/#sandbox/spider-gbxml-hacker/README.md "View file as a web page." ) </span>

<div><input type=button class = "btn btn-secondary btn-sm" onclick="window.location.href='https://github.com/ladybug-tools/spider-gbxml-tools/blob/master/sandbox/spider-gbxml-hacker/README.md'";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>

<br>

# [Spider gbXML Hacker Read Me]( #sandbox/spider-gbxml-hacker/README.md )


<iframe src=https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-hacker/index.html width=100% height=500px >Iframes are not viewable in GitHub source code views</iframe>
_<small>Spider gbXML Hacker</small>_



## Concept

Open and examine very large gbXML files in your browser with free, open source JavaScript

The script is a work in progress for of opening very large gbXML files,

It is currently being tested on a gbXML file ( private and not sharable ) of 698,000,000 bytes and:

* Lines of text: 8,746,903
* Spaces: 5,550
* Surfaces: 70,774
* Zones: 2,618

The file breaks the Chrome browser on Windows 10, the FireFox browser on Windows 10 and OpenStudio on Windows 10.

## Full Screen: [Spider gbXML Hacker R1.0]( https://www.ladybug.tools/spider-gbxml-tools/sandbox/spider-gbxml-hacker/r1/spider-gbxml-hacker.html )

With Chrome browser on Windows 10/Core i7/Nvidia GPU  reads the file and displays limited text data for the file in under 15 seconds. No attempts are made to display data in 3D

* Opens file
* Splits data into an array of trimmed lines
* Searches the array for selected text data such as 'space', 'surface' and 'zone'


## To Do / Wish List

See if we can parse and display in 3D files of this size


## Issues


## Things you can do using this script

* Click the three bars( 'hamburger menu icon' ) to slide the menu in and out
* Click the Octocat icon to view or edit the source code on GitHub
* Click on title to reload
* Press Control-U/Command-Option-U to view the source code
* Press Control-Shift-J/Command-Option-J to see if the JavaScript console reports any errors


## Links of Interest



## Change Log

### 2018-11-01 ~ Theo

I've just been working on a file similar to the 'hacker' file included here. What I am discovering is that it is much faster to load a file as a text file then it is to load it as an XML file and then convert it to JSON

I've been experimenting with the Warwick University file. This file is just over 20 megabytes in size. Even with this size, it takes the browser less than a couple of seconds to load the data as a text file.

Once loaded and when using the browser built-in XML parser and the xml2obj routine that we have been using, it takes about 8 seconds to do the parsing of the entire file.

On the other hand, reading the text and converting it into an array of lines and then doing some simple parsing, takes only a couple of seconds. Therefore, even if the more complicated parsing takes double the time, overall processing would still be half the time of using the XML parser system.

Using the simple array parsing method would provide a significant secondary benefit. Under the current system, the script must wait until all the XML/JSON parsing is completed before display of the 3D surfaces commences. but if we treat the file as an array, we could start displaying the 3D surfaces almost immediately once the file is loaded. This would create a much more pleasant user experience. Instead of viewing a blank screen for a number of seconds, you would see each surfaces display as soon as it read.

If this process could be made to work, it might represent a huge leap forward with the development of gbXML viewers.

It will take a number of revisions of scripts in order to see if this process does work as currently imagined. Development will continue, but only as a secondary effort in parallel with the main development work of the primary current Spider gbXML Viewer.



### 2018-10-27 ~ Theo

* First commit


***

### <center title="Howdy! My web is better than yours. ;-)" ><a href=javascript:window.scrollTo(0,0); style="text-decoration:none !important;" > &#x1f578; </a></center>
