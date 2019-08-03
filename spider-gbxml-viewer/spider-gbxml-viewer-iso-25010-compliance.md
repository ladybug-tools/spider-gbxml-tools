# Spider gbXML Viewer compliance with _ISO 245010 System and software quality models




A side project is to document Spider gbXML Viewer compliance with _ISO 245010 System and software quality models_. By clarifying project priorities and converting abstract priorities to measurable values, the intention is develop a common understanding of the Spider gbXML Viewer's objectives and goals. The following are highlights of a much longer work-in-progress document. Text in italics are quotes from the text on the ISO 25010 web page. Text not in italics begins to describe compliance. The name 'Maevia' is used to indicate 'Spider gbXML Viewer Maevia v0.17.01'.

## Functional suitability

_The degree to which a product or system provides functions that meet stated and implied needs when used under specified conditions._


### Functional completeness

_Degree to which the set of functions covers all the specified tasks and user objectives._

File handling

* Maevia read, parses and display all the test files at withut issue

Element Viewing

* The official [gbXML schema v6.01]( http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html ) provides a specification for 346 elements and 122 simple types.
* Important or frequently used elements include: surfaces, spaces, stories, zones, constructions, materials - all of these are readily locatable and viewable using Maevia.
* A future revision could document any items not covered in Maevia



### Functional correctness

_ Degree to which a product or system provides the correct results with the needed degree of precision._


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

* Maevia begins to provide tools to fix many issues found in the files




## Performance efficiency

_This characteristic represents the performance relative to the amount of resources used under stated conditions._

### Time behavior

_Degree to which the response and processing times and throughput rates of a product or system, when performing its functions, meet requirements._

* Most files - even hosted on remote servers - load in a second or two


### Resource utilization

_Degree to which the amounts and types of resources used by a product or system, when performing its functions, meet requirements._

* Runs on an Amazon Kindle Fire with 4GB Ram


### Capacity

_Degree to which the maximum limits of a product or system parameter meet requirements._

* The largest file being currently tested with Maevia is 698 megabytes. File loads on a Win1 Core I7 with Nvidia GPU in about a minute.




## Compatibility

_Degree to which a product, system or component can exchange information with other products, systems or components, and/or perform its required functions, while sharing the same hardware or software environment._


### Co-existence

_Degree to which a product can perform its required functions efficiently while sharing a common environment and resources with other products, without detrimental impact on any other product._


* All typical files tested run at 60 frames per second in a browser with multiple tabs open

### Interoperability.

_Degree to which two or more systems, products or components can exchange information and use the information that has been exchanged._





## Usability

_Degree to which a product or system can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction in a specified context of use_

### Appropriateness recognizability

_Degree to which users can recognize whether a product or system is appropriate for their needs._



### Learnability

context sensitive help in both 3D and 2D

* Display helpful text including text-to-voice in popup
* Every module has a read me file with help, wish list, issues and a change log


### Operability

_Degree to which a product or system has attributes that make it easy to operate and control._

### User error protection

_Degree to which a system protects users against making errors._


### User interface aesthetics

_Degree to which a user interface enables pleasing and satisfying interaction for the user._

* Delivers a user interface that may be themed to fit in with the house style of any organization

### Accessibility

_Degree to which a product or system can be used by people with the widest range of characteristics and capabilities to achieve a specified goal in a specified context of use._





## Reliability

_Degree to which a system, product or component performs specified functions under specified conditions for a specified period of time._

### Maturity

_Degree to which a system, product or component meets needs for reliability under normal operation._


### Availability

_Degree to which a system, product or component is operational and accessible when required for use._



### Fault tolerance

_Degree to which a system, product or component operates as intended despite the presence of hardware or software faults._



### Recoverability

_Degree to which, in the event of an interruption or a failure, a product or system can recover the data directly affected and re-establish the desired state of the system._





## Security: confidentiality fits your needs

_Degree to which a product or system protects information and data so that persons or other products or systems have the degree of data access appropriate to their types and levels of authorization._

### Confidentiality

_Degree to which a product or system ensures that data are accessible only to those authorized to have access._

* Runs locally, on server, in an iframe or even embedded in another app ( such as Open Studio ;-)


### Integrity

_Degree to which a system, product or component prevents unauthorized access to, or modification of, computer programs or data._


### Non-repudiation

_degree to which actions or events can be proven to have taken place, so that the events or actions cannot be repudiated later._


### Accountability

_Degree to which the actions of an entity can be traced uniquely to the entity._

### Authenticity

_Degree to which the identity of a subject or resource can be proved to be the one claimed._





## Maintainability

_The degree of effectiveness and efficiency with which a product or system can be modified to improve it, correct it or adapt it to changes in environment, and in requirements._

### Modularity

_Degree to which a system or computer program is composed of discrete components such that a change to one component has minimal impact on other components._

* Entirely written in plain vanilla FOSS JavaScript with just three dependencies: Three.js, pkZip.js and Showdown.js
* Hosted on GitHub

### Reusability

_Degree to which an asset can be used in more than one system, or in building other assets._


### Analysability

_Degree of effectiveness and efficiency with which it is possible to assess the impact on a product or system of an intended change to one or more of its parts, or to diagnose a product for deficiencies or causes of failures, or to identify parts to be modified._

### Modifiability

_Degree to which a product or system can be effectively and efficiently modified without introducing defects or degrading existing product quality._


### Testability

_Degree of effectiveness and efficiency with which test criteria can be established for a system, product or component and tests can be performed to determine whether those criteria have been met._




## Portability

_Degree of effectiveness and efficiency with which a system, product or component can be transferred from one hardware, software or other operational or usage environment to another._

### Adaptability

_Degree to which a product or system can effectively and efficiently be adapted for different or evolving hardware, software or other operational or usage environments._

* Maevia Works just fine on phone, tablet, laptop or workstation
* Maevia has opened files from several CAD systems and has exported to files read by a number of energy analysis programs


### Installability

_Degree of effectiveness and efficiency with which a product or system can be successfully installed and/or uninstalled in a specified environment._

* Maevia is a JavaScript that runs in your browser. There is nothing to download or install.


### Replaceability

_Degree to which a product can replace another specified software product for the same purpose in the same environment_

* Maevia may replace or be replaced by anu other programs that opens gbXML files
