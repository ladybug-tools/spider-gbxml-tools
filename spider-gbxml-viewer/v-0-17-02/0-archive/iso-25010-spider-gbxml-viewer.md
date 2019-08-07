# Spider gbXML Viewer ISO 25010 Compliance

## Overview of this effort

The owners of a typical commercial software product sold on the open market frequently pay to have a web site built by an advertising agency. The web site is usually designed to push the features and benefits of the product and omit any aspects about the products being sold that are not positive. Many open source projects follow similar routes.

Are there other paths to gain your recognition and adoption in your organization? This document is the initial exploration of another method of gaining "Appropriateness recognizability".

Paraphrasing the ISO 9126 terminology, our mission here may be stated as:

By clarifying project priorities and converting abstract priorities to measurable values this document develops a common and sharable understanding of the Spider gbXML Viewer's objectives and capabilities.



## Prefaces

[Wikipedia introduction previous version, ISO 9126]( https://en.wikipedia.org/wiki/ISO/IEC_9126): _The fundamental objective of the ISO/IEC 9126 standard is to address some of the well known human biases that can adversely affect the delivery and perception of a software development project. These biases include changing priorities after the start of a project or not having any clear definitions of "success". By clarifying, then agreeing on the project priorities and subsequently converting abstract priorities (compliance) to measurable values (output data can be validated against schema X with zero intervention), ISO/IEC 9126 tries to develop a common understanding of the project's objectives and goals._

[iso25000.com introduction to current version, ISO/IEC 25010]( https://iso25000.com/index.php/en/iso-25000-standards/iso-25010 ): _The quality model is the cornerstone of a product quality evaluation system. The quality model determines which quality characteristics will be taken into account when evaluating the properties of a software product._

_The quality of a system is the degree to which the system satisfies the stated and implied needs of its various stakeholders, and thus provides value. Those stakeholders' needs (functionality, performance, security, maintainability, etc.) are precisely what is represented in the quality model, which categorizes the product quality into characteristics and sub-characteristics._

_The product quality model defined in ISO/IEC 25010 comprises eight quality characteristics_

The the source for the following text is from [iso25000.com](  https://iso25000.com/index.php/en/iso-25000-standards/iso-25010 ). And that hext appears to be a redaction from [iso.org]( https://www.iso.org/obp/ui/#iso:std:iso-iec:25010:ed-1:v1:en )

## ISO 25010 ~ System and software quality models

_Describes the model, consisting of characteristics and sub-characteristics, for software product quality, and software quality in use._

## 1. Functionality

_Degree to which a product or system provides functions that meet stated and implied needs when used under specified conditions._

### Functional completeness

_Degree to which the set of functions covers all the specified tasks and user objectives._


#### gbXML Overview

The official [gbXML schema v6.01]( http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html ) provides a specification for 346 elements and 122 simple types.

Important or frequently used elements include: surfaces, spaces, stories, zones, constructions, materials.


#### Spider Compliance

Spider provides the tools to view every instance in every element with a few keystrokes. For example, surface elements may be located using ID, name, construction or CAD Object ID. Once located, the attributes of the surface may be viewed as clickable items, a raw gbXML or as 3D representation highlighted un the 3D model

Relevance: Very important. Spiders ability to locate an element, highlight it, view its detail, zoom into it, show its neighbors and more are the things that make Maevia useful, speedy and fun.



### Functional correctness

_Degree to which a product or system provides the correct results with the needed degree of precision._


#### gbXML Considerations

* Files may be
	* local or remote
	* 8 bit/single or 16bit/double-byte
	* in ASCII or ZIP format
	* small or hundreds of megabytes
	* working or broken
	* loaded once or repeatedly with a click
	* readable as text, as XML, as JSON or in 3D.



### Functional appropriateness

_Degree to which the functions facilitate the accomplishment of specified tasks and objectives._

You should have access to any and all of these types whenever they appear in a data file.

You should be able to view the data in the following ways

* Raw gbXML
* As 'prettified' text
* In a format suitable to the data type
	* 3D coordinate data in 3D
	* Tabular data in table

You may access any item with three clicks or fewer

You may filter the data so that only selected subsets of the data are visible



## 2. Performance Efficiency

A set of attributes that bear on the relationship between the level of performance of the software and the amount of resources used, under stated conditions.

### Time behavior

Degree to which the response and processing times and throughput rates of a product or system, when performing its functions, meet requirements.


#### Performance / Speedy execution

**Problem**: Going from one tab or window to another tab or window and then returning to the first tab or window is boring, frustrating and old-skool. Fixing the design takes longer than designing the design. Every keystroke is it takes to do something is a keystroke slowing down better engineering

**Want/Need**: Every click in your current tab just keeps new things coming into your current tab. The menu trees just make this happen for you

**Problem**: Spider is designed for you to see, review and fix with as few keystrokes as possible while giving you the maximum feedback, timeliness and direction.



### Resource utilization

Degree to which the amounts and types of resources used by a product or system, when performing its functions, meet requirements.

### Capacity

Degree to which the maximum limits of a product or system parameter meet requirements.



## 3. Compatibility

Degree to which a product, system or component can exchange information with other products, systems or components, and/or perform its required functions, while sharing the same hardware or software environment.

### Co-existence

Degree to which a product can perform its required functions efficiently while sharing a common environment and resources with other products, without detrimental impact on any other product.

#### Effectiveness

**Problem**: You have to know Revit, AutoCAD, Open Studio, TAS and a bunch of other programs. You have to download, install and keep them up to date. Most engineering apps are programs you have to download, install and update. Then you have watch innumerable podcasts in order to get going.

**Want/Need**: easy to use, free, just works. Easy to re-purpose

Solution. Spider: it just works. If you can use the menus in a browser you can use Spider. If you have something that take two clicks and yu ask us, we can probably make it happen in one click.

Relevance: All apps 'should just work'. So this category in the future should nor be important. But for th moment Spider is a good early adopter.



#### Extensible Product Portfolio (EPP )

**Problem**: Users hate change

**Want/Need**: The idea of EPP is thus: when you have a product that works, and an existing customer base - freeze it. Instead of a major redesign simply leave the product the way it is, bar minor bug-fix work. Instead devote effort into building a new, next-generation product that addresses (hopefully) a new customer segment, and allow existing customers to add this new product to their portfolio. This allows existing customers to self-select into a new product, protects revenue and reduces the risk of existing product customers leaving due to badwill.


**Solution**: Spider is very EPP. All of the Spider gbXML Viewer versions are online. Most are in usable working order.


**Links of interest**:

* Jacon Nielson:[Users Hate Change]( https://www.nngroup.com/videos/users-hate-change/ )
* Comments by sleepyfix [Users hate change]( https://gist.github.com/sleepyfox/a4d311ffcdc4fd908ec97d1c245e57dc )



### Interoperability

Degree to which two or more systems, products or components can exchange information and use the information that has been exchanged.


### data files

File management, data safety

**Problem**: We live in a connected world. Data may arrive from anywhere at any time. Systems that force you to download a file or limit you to opening file on a remote server or use another app to decompress data are problems not solutions.

**Want/Need**: Opening files is not an issue. You may open any file, of any type, from any source, anywhere, any time.

**Solution**: Spider is good at opening gbXML files and making the data usable for you. The file open module deals with data files that may be local or remote, 8 bit/single or 16bit/double-byte, in ASCII or ZIP format, small or hundreds of megabytes, working or broken, loaded once or repeatedly with a click, readable as text, as XML, as JSON or in 3D.

**Importance**: This is a nice to have. It won't change the world, but every app should have this. And since file-open-basic.js is on GitHug, what are you waiting for?






## Usability

Degree to which a product or system can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction in a specified context of use.

### Appropriateness recognizability

Degree to which users can recognize whether a product or system is appropriate for their needs.

Note 1 to entry: Appropriateness recognizability will depend on the ability to recognize the appropriateness of the product or system’s functions from initial impressions of the product or system and/or any associated documentation.

Note 2 to entry: The information provided by the product or system can include demonstrations, tutorials, documentation or, for a web site, the information on the home page.

### Learnability

Degree to which a product or system can be used by specified users to achieve specified goals of learning to use the product or system with effectiveness, efficiency, freedom from risk and satisfaction in a specified context of use.


#### Documentation

**Comments**: Inline comments are rare in Spider. Often they merely indicate the beginning and end of a logical grouping of functions. The bigger, deeper effort is going into the naming of variable, function, files and folders Every module has its own name space.


**Read Me Files**: Every module has an associated read me file written in Markdown format. fileName.js has fileName.md. Every read me incorporates module mission/vision/problem-being-solved, wish list, issues, links of interest and change log. Automating the process of updating - ( think jsDOc, aspects of YAML and so on ) of the module read me is a work-in-progress


#### Sample Data

**Problem**: People have to start somewhere but there is nothing there to start with. Data to learn from or for testing is not available

**Want/Need**: Sample data for learning, testing and manipulating

**Solution**: Spider provides dozens of sample gbXML files for you to practice with

[Importance of Sampling in the Era of Big Data]( https://towardsdatascience.com/importance-of-sampling-in-the-era-of-big-data-d2cf83e06c6a )



### Operability

Degree to which a product or system has attributes that make it easy to operate and control.

Operability corresponds to controllability, (operator) error tolerance and conformity with user expectations

### User error protection

Degree to which a system protects users against making errors.


### User interface aesthetics

Degree to which a user interface enables pleasing and satisfying interaction for the user.

This refers to properties of the product or system that increase the pleasure and satisfaction of the user, such as the use of colour and the nature of the graphical design.

#### Workflow adaptable

**Problem**: Every organization, every discipline, every project may have its own work flow, web presence methodology, look and feel. Having to adapt to new methods is a deal breaker

**Want**: Tools that adapt to your current needs rather than the reverse. Your needs are complex. They range from appearance to performance, from security to economic value

**Solution**: Spider is easy to theme. Demos for Bootstrap and W3Schools theme provided. Spider is easy to embed. Demos for embedding Spider in an iframe are provide


### Accessibility

Degree to which a product or system can be used by people with the widest range of characteristics and capabilities to achieve a specified goal in a specified context of use.

Note1: The range of capabilities includes disabilities associated with age.

Note 2: Accessibility for people with disabilities can be specified or measured either as the extent to which a product or system can be used by users with specified disabilities to achieve specified goals with effectiveness, efficiency, freedom from risk and satisfaction in a specified context of use, or by the presence of product properties that support accessibility.




## Reliability

A set of attributes that bear on the capability of software to maintain its level of performance under stated conditions for a stated period of time. Attributes:

Degree to which a system, product or component performs specified functions under specified conditions for a specified period of time.

Note 2 to entry: Wear does not occur in software. Limitations in reliability are due to faults in requirements, design and implementation, or due to contextual changes.

Note 3 to entry: Dependability characteristics include availability and its inherent or external influencing factors, such as availability, reliability (including fault tolerance and recoverability), security (including confidentiality and integrity), maintainability, durability, and maintenance support.

### Maturity

Degree to which a system, product or component meets needs for reliability under normal operation.

Note 1 to entry: The concept of maturity can also be applied to other quality characteristics to indicate the degree to which they meet required needs under normal operation.

### Availability

Degree to which a system, product or component is operational and accessible when required for use.

Note 1 to entry: Externally, availability can be assessed by the proportion of total time during which the system, product or component is in an up state. Availability is therefore a combination of maturity (which governs the frequency of failure), fault tolerance and recoverability (which governs the length of down time following each failure).

### Fault tolerance

Degree to which a system, product or component operates as intended despite the presence of hardware or software faults.

### Recoverability

Degree to which, in the event of an interruption or a failure, a product or system can recover the data directly affected and re-establish the desired state of the system.

Note 1 to entry: Following a failure, a computer system will sometimes be down for a period of time, the length of which is determined by its recoverability.


#### Error repair

**Problem**. You receive many gbXML files with many issues. In other words, you receive files of hundreds of thousands lines with hundred of errors. The process of repairing the files is done by humans and is drudgery, complicated and expensive.

**Want/Need**: Files that can fix themselves.

**Solution**: Spider has eight routines for checking for issues and nine modules that identify issues and can fix the issues with a click of a single button

**Importance**: This is it. Fix the files and get on with it. Files that make the round trip between energy analysis and CAD apps are worth their weight in copper pipes or something.




## Security

Degree to which a product or system protects information and data so that persons or other products or systems have the degree of data access appropriate to their types and levels of authorization.

### Confidentiality

Degree to which a product or system ensures that data are accessible only to those authorized to have access.


### Integrity

Degree to which a system, product or component prevents unauthorized access to, or modification of, computer programs or data.

### Non-repudiation

Degree to which actions or events can be proven to have taken place, so that the events or actions cannot be repudiated later.

### Accountability

Degree to which the actions of an entity can be traced uniquely to the entity.

### Authenticity

Degree to which the identity of a subject or resource can be proved to be the one claimed.







## Maintainability

Degree of effectiveness and efficiency with which a product or system can be modified by the intended maintainers.


### Not Distracting

**Problem**: Solving building engineering problems and creating elegant solutions is time-consuming, expensive and complicated. We are working with complex building engineering concepts and these take up most of our thought processing capabilities. Code of any complexity makes you spend more time analyzing the code than analyzing the building design.

**Want/Need**: methods where we spend time on the engineering not the coding or programming

**Solution**: The code in Spider 'Maevia' The actual code for visualizing and investigating should not slow down
Coding style follows Mr.doob Three.js coding style very closely. In other words code should look good as good as a poem on a page.

**Importance**





### Modularity

Degree to which a system or computer program is composed of discrete components such that a change to one component has minimal impact on other components.

### Reusability

Degree to which an asset can be used in more than one system, or in building other assets.





### Analysability

Degree of effectiveness and efficiency with which it is possible to assess the impact on a product or system of an intended change to one or more of its parts, or to diagnose a product for deficiencies or causes of failures, or to identify parts to be modified.


### Software verification and validation

**Problem**: The system has given you an answer, but you need to know that the answer is authoritative, verifiable and beneficial.

* Verification: Are we building the product right?
* Validation: Are we building the right product?

**Want/Need**: Answers and solutions that are trustworthy and my be audited

**Solution**: All built on FOSS, few dependencies. Spider is built on our own source code and the following JavaScript libraries Three.js, PKZip.js and Showdown.js.  Also several dozen in-house modules all written in plain-vanilla JavaScript. There are no other dependencies. All of the above are plain vanilla open source JavaScript files available for inspection on GitHub.

**Importance**: Unknown. At some time in the future all programs may be some AI neural network thingies. On the other hand maybe programming becomes things like strumming a guitar or combing your hair.

**Links of interest**:

* https://en.wikipedia.org/wiki/Software_verification_and_validation
* https://en.wikipedia.org/wiki/Verification_and_validation
* https://en.wikipedia.org/wiki/Runtime_verification




### Modifiability

Degree to which a product or system can be effectively and efficiently modified without introducing defects or degrading existing product quality.


#### Hackability

**Problem**: We have entered an era where programming apps for the browser has become a highly sophisticated, directed and all consuming affair. People with excellent STEM skills but limited coding skills a afraid to start. Full stack developers excellent in a particular workflow such as Angular may cringe at the idea of working with Vue or React.

**Want/Need**: tool as are hackable by people with all manner of skill sets and at all levels of skill mastery.

**Solution**: Spider is designed to be easy for beginners to hack using the Windows Notepad or MacOS TextEdit or the GitHub online editor and easy for full stack developers to port into complex, existing workflows.

* [Hackability - What it means, why it’s important]( https://www.slideshare.net/nitot/hackability-what-it-means-why-its-important/ )




### Testability

Degree of effectiveness and efficiency with which test criteria can be established for a system, product or component and tests can be performed to determine whether those criteria have been met.




## Portability

Degree of effectiveness and efficiency with which a system, product or component can be transferred from one hardware, software or other operational or usage environment to another

hardware /software

### Device independence

**Problem:** You have a thing you are interested in but you are traveling, at home, have lost you computer, without power or whatever, but that does not stop the problem from being interesting and you want to find a solution.

**Want/Need**: handling problems is not an issue. You can access your data on any device, anywhere, any time. Today's mantra is "Mobile first!"

**Solution**: Spider runs from a server or runs locally, online or off line, standalone or embedded in an iframe. Spiders run on a desktop, laptop, tablet or smartphone. If you have access to a browser you can manipulate gbXML.

**Importance**. Unknown. Current building engineering is mostly carried in offices with access high-powered desktops or laptops for big, expensive long-term projects. The
future may bring more light width ad-hoc field engineering where you pull the folding phone out of your cargo-pants and decide the R-value of the gunk inside the 3D building printer for an acoustic shell behind this afternoon's rock concert.




### Adaptability

Degree to which a product or system can effectively and efficiently be adapted for different or evolving hardware, software or other operational or usage environments.



#### Robust / Forgiving /

**Problem**: You want to access data in the office and on building sites without issues. In other words under a variety of environmental conditions, a range of devices and a variety of human focus or training on the task hand

**Want/Need**: The software is able to operate under stress or tolerate unpredictable or invalid input. For example, it can be designed with resilience to low memory conditions.

/// A file reader that is forgiving, makes the date understandable, works fast and is fun to play with

**Solution**: Billions of dollars and zillions of hours have been spent making your browser work always and anywhere. Spider harnesses that power.

**Importance**: Decreasing. Because of industries such as gaming, pornography and advertising, the browser is rendering faster and more safely than we can think.


**Links of interest**:

* https://en.wikipedia.org/wiki/Robustness_testing

	robustness as the degree to which a system or component can function correctly in the presence of invalid inputs or stressful environmental conditions

* http://www.performance-workshop.org/documents/Verifying_Software_Robustness_Final_Collard.pdf

	 Software is robust if it can tolerate such problems as unanticipated events, invalid inputs, corrupted internally stored data, improper uses by system operators, unavailable databases, stress overloads and so on.
	Systems that include both hardware and software are robust if they can tolerate physical problems such as equipment damage loss of power software crashes and equipment damage, loss of power, software crashes and so on.



### Installability

Degree of effectiveness and efficiency with which a product or system can be successfully installed and/or un-installed in a specified environment.

### Replaceability

Degree to which a product can replace another specified software product for the same purpose in the same environment.




## More

* Licensing
* Pricing

Note that when you do a critical review on ISO20510 you will find that missing in ISO25010 is:

Functional requirements
Compliance (e.g. with laws, standards) requirements
Documentation, Support and Training requirements and of course:
Project Timing requirements
Project Budget requirements