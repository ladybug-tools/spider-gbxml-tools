# Spider gbXML Viewer compliance with _ISO 245010 System and software quality models


A side project is to document Spider gbXML Viewer compliance with _ISO 245010 System and software quality models_. By clarifying project priorities and converting abstract priorities to measurable values, the intention is develop a common understanding of the Spider gbXML Viewer's objectives and goals. The following are highlights of a much longer work-in-progress document. Text in italics are quotes from the text on the ISO 25010 web page. Text not in italics begins to describe compliance. The name 'Maevia' is used to indicate 'Spider gbXML Viewer Maevia v0.17.01'.

## Functional suitability

_The degree to which a product or system provides functions that meet stated and implied needs when used under specified conditions._


### Functional completeness

_Degree to which the set of functions covers all the specified tasks and user objectives._

File handling

* Maevia reads, parses and displays all the [Spider Sanple Files]( https://www.ladybug.tools/spider/#gbxml-sample-files/ )test files at without issue

Item viewing

* The official [gbXML schema v6.01]( http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html ) provides a specification for 346 elements and 122 simple types.
* Important or frequently used elements include: surfaces, spaces, stories, zones, constructions, materials - all of these are readily locatable and viewable using Maevia.
* A future revision could document any items not covered or viewable in Maevia



### Functional correctness

_ Degree to which a product or system provides the correct results with the needed degree of precision._

* Providing correct results is a primary mission of Maevia
* Every item in Maivia is viewable as raw GB XML, 'prettified' text and in 3D
* The results of any one format may be verified by the contents of the other two formats

### Functional appropriateness

_Degree to which the functions facilitate the accomplishment of specified tasks and objectives_


File handling

* Maevia has the ability to handle file idiosyncrasies
* Handles very large gbXML files in a speedy, no-fail, fashion
* Loads, extracts and saves 8-bit and 16-bit gbXML files to and from XML files and ZIP files
* Supports files that are local or on a server with one button press file reloading


Identifying content and viewing issues

* Displays virtually every aspect of numerical and attribute data in the file
* Supplies a variety of 3D visualization aids including exploding, cut sections


Identifying and fixing issues

* Maevia begins to provide tools to fix many issues found in the gbXML files




## Performance efficiency

_This characteristic represents the performance relative to the amount of resources used under stated conditions._

### Time behavior

_Degree to which the response and processing times and throughput rates of a product or system, when performing its functions, meet requirements._

* Most files - even hosted on remote servers - load in a second or two


### Resource utilization

_Degree to which the amounts and types of resources used by a product or system, when performing its functions, meet requirements._

* Maevia runs, opens and displays files on an Amazon Kindle Fire HD8 with just 1.5 GB of RAM


### Capacity

_Degree to which the maximum limits of a product or system parameter meet requirements._

* The largest file being currently tested with Maevia is 698 megabytes. File loads on a Win1 Core I7 with Nvidia GPU in about a minute.




## Compatibility

_Degree to which a product, system or component can exchange information with other products, systems or components, and/or perform its required functions, while sharing the same hardware or software environment._


### Co-existence

_Degree to which a product can perform its required functions efficiently while sharing a common environment and resources with other products, without detrimental impact on any other product._

* All typical files tested on Mavia run at 60 frames per second in a browser with multiple tabs open

### Interoperability.

_Degree to which two or more systems, products or components can exchange information and use the information that has been exchanged._

* Maevia is currently running in production environments with a variety of CAD applications and energy analysis programs including Revit. Open Studio. TAS Engineering and others



## Usability

_Degree to which a product or system can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction in a specified context of use_

### Appropriateness recognizability

_Degree to which users can recognize whether a product or system is appropriate for their needs._

* Running as a web app in the browser, means that Maevia's capabilities may be tested and analyzed in a very speedy fashion
* Product details, user activity may be verified by examining the Maevia repositories on GitHub


### Learnability

* Maevia a provides context sensitive help in both 3D and 2D
* Display helpful text including text-to-voice in popup
* Every module has a read me file with help, wish list, issues and a change log


### Operability

_Degree to which a product or system has attributes that make it easy to operate and control._

* Maevia runs as any webpage does in a browser
* Maevia a menus are organized in the standard file, edit, select, view, settings, help format used by many programs

### User error protection

_Degree to which a system protects users against making errors._

* Much time has been spent trying to make a workflow that is simple and logical and obvious
* Alerts that pop up are added to the code whenever a pattern of mistakes has been identified

### User interface aesthetics

_Degree to which a user interface enables pleasing and satisfying interaction for the user._

* By default Maevia is neither attractive nor unattractive
* By design, Maevia a delivers a user interface that may be themed to fit in with the house style of any organization

### Accessibility

_Degree to which a product or system can be used by people with the widest range of characteristics and capabilities to achieve a specified goal in a specified context of use._

* The senior maintainer for the Maevia project is 72 years old, is missing a left hand and is a partial paraplegic
* Maevea is tested on a wide variety of devices with a wide variety of interface elements
* Maevia is designed so that ARIA roles and other theme updates to assist with accessibility may be applied to the user interface, but awaiting testing procedures (and testers) these have not yet been implemented





## Reliability

_Degree to which a system, product or component performs specified functions under specified conditions for a specified period of time._

### Maturity

_Degree to which a system, product or component meets needs for reliability under normal operation._

* Maevia may be considered a fairly young project. the first commits were in 2017.
* The gbXML parser in Maevia however has been almost in continuous use ever since and has successfully opened and handled many thousands of files


### Availability

_Degree to which a system, product or component is operational and accessible when required for use._

* Maevia it is your typical web app, it just works

### Fault tolerance

_Degree to which a system, product or component operates as intended despite the presence of hardware or software faults._

* Glitches are quite rare, but when they occur a single click in the Maevia menu title will reload the webpage
* Reloads take only a second or so

### Recoverability

_Degree to which, in the event of an interruption or a failure, a product or system can recover the data directly affected and re-establish the desired state of the system._

* The current system apart from reloading, offers no protection in the case of a system failure
* If there is a system failure and you have not saved your unsaved edits are lost
* Future versins could be created that would save temporary data in local storage, but the overarching intention is to provide viewing and fixing that is so speedy that temporary storage is not required


## Security:

_Degree to which a product or system protects information and data so that persons or other products or systems have the degree of data access appropriate to their types and levels of authorization._

Given the nature of the Maevia application, there are few areas of copyright, trademark or secrecy where security could be an issue. In any case, no issues have been raised to this date



### Confidentiality

_Degree to which a product or system ensures that data are accessible only to those authorized to have access._

* Maevia euns locally, on server, in an iframe or even embedded in another app ( such as Open Studio ;-)
* Given that Maivia is just a webpage statically hosted, the organization using Mevia may apply security parameters that they might need

### Integrity

_Degree to which a system, product or component prevents unauthorized access to, or modification of, computer programs or data._

* See above
* Given that the Maevia files are hosted on GitHub, an organization seeking to verify code integrity could compare the SHA of the local instance aof a module gainst the SHA of the instance on GitHub


### Non-repudiation

_degree to which actions or events can be proven to have taken place, so that the events or actions cannot be repudiated later._

* It would be an interesting experiment to add blockchain capability to the instances of gbXML files


### Accountability

_Degree to which the actions of an entity can be traced uniquely to the entity._

* gbXML files have a document history element. 
* Previous versions of Maevia have had the ability to add and edit this data
* previous versions of Maevia have also had the ability to maintain log files of edits
* Future revisions of Maevia should add these capabilities back


### Authenticity

_Degree to which the identity of a subject or resource can be proved to be the one claimed._

* Given that the Maevia application is a web app, verifying the authenticity of an instance depends on the organization using Maevia and its ability to maintain encryption and security throughout their workflow pipeline




## Maintainability

_The degree of effectiveness and efficiency with which a product or system can be modified to improve it, correct it or adapt it to changes in environment, and in requirements._

### Modularity

_Degree to which a system or computer program is composed of discrete components such that a change to one component has minimal impact on other components._

* Maevia is entirely written in plain vanilla FOSS JavaScript with just thrlee dependencies: Three.js, pkZip.js and Showdown.js
* All three dependencies are in use in thousands of other applications
* The Maevia file handling, menu, theming and other modules are currently in use in dozens of other locations
* The primary Maevia parser is in use in a number of Maevia versions an as well as being embdedd in applcations by MREL and Perkins Will


### Reusability

_Degree to which an asset can be used in more than one system, or in building other assets._

* Given that the modules are written in plain vanilla JavaScript it should be fairly easy to reuse the code as part of a Vue, Angular or React environment
* Hosted on GitHub, everything is forkable
* Maevia is built up from several dozen JavaScript modules Each of which tends to be less than 500 lines long
* Groups of modules are kept in separate folders so as to be identifiable as a group

### Analysability

_Degree of effectiveness and efficiency with which it is possible to assess the impact on a product or system of an intended change to one or more of its parts, or to diagnose a product for deficiencies or causes of failures, or to identify parts to be modified._

* Maevia modules are passed through jsHint and jsLint on a frequent basis
* Maevia code is not currently compiled and therefore does not get all the error checking a compiler provides
* Maevia code is not currently being passed through a full 'prettify' cleanup


### Modifiability

_Degree to which a product or system can be effectively and efficiently modified without introducing defects or degrading existing product quality._

* Much attention in the development of Maivia has been devoted to creation of logical namespaces, folder, file and variable names that helped provide the feeling that the code is written as if it were a spoken language
* Maevia is written in plain vanilla JavaScript with code that is easy to read and designed so it is very simple for beginners to edit
* Maevia is written in a very simple coding style so rhat building engineers may be able to verify the validity of the calculations without being full stack programmers



### Testability

_Degree of effectiveness and efficiency with which test criteria can be established for a system, product or component and tests can be performed to determine whether those criteria have been met._

Code

* Currently all testing is manual and mostly carried out by opening the Spider Sample gbXML files and clicking on the various menus

gbXML element viewers

* Currently all testing is manual and carried out by interacting with the menus and viewing results in the 3D model and on the 2D context sensitive pop-up screen

Issue Fixers

* currently all issue fixers are checked by running the tests again and seeing if the number of errors has been reduced down to zero



## Portability

_Degree of effectiveness and efficiency with which a system, product or component can be transferred from one hardware, software or other operational or usage environment to another._

### Adaptability

_Degree to which a product or system can effectively and efficiently be adapted for different or evolving hardware, software or other operational or usage environments._

* Maevia works just fine on phones, tablets, laptops or workstations
* Maevia has been tested on Chrome, Edge, Firefox and Safari browsers
* Maevia has been tested on Windows, MacOS, Chromebooks and another number of other device operating systems
* maybe has been tested hosted on GitHub, hosted on content delivery networks and opened directly from the local hard disk
* Maevia has opened files exported from several CAD systems and has exported to files that are read by a number of energy analysis programs


### Installability

_Degree of effectiveness and efficiency with which a product or system can be successfully installed and/or uninstalled in a specified environment._

* Maevia is a JavaScript that runs in your browser. There is nothing to download or install.


### Replaceability

_Degree to which a product can replace another specified software product for the same purpose in the same environment_

* Maevia may replace or be replaced by any other programs that opens gbXML files
* There are a number of versions of Maevia hosted on the spider website. most but not all are curently operable. All of the versions may be used interchangeably to view gbXML files
