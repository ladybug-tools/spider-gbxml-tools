# Overview of ISO 25010

The quality model is the cornerstone of a product quality evaluation system. The quality model determines which quality characteristics will be taken into account when evaluating the properties of a software product.

The quality of a system is the degree to which the system satisfies the stated and implied needs of its various stakeholders, and thus provides value. Those stakeholders' needs (functionality, performance, security, maintainability, etc.) are precisely what is represented in the quality model, which categorizes the product quality into characteristics and sub-characteristics.

The product quality model defined in ISO/IEC 25010 comprises the eight quality characteristics shown in the following figure:


## Functionality

Functionality: A set of attributes that bear on the existence of a set of functions and their specified properties. The functions are those that satisfy stated or implied needs.

Degree to which a product or system provides functions that meet stated and implied needs when used under specified conditions.

### Functional completeness

Degree to which the set of functions covers all the specified tasks and user objectives.

### Functional correctness

Degree to which a product or system provides the correct results with the needed degree of precision.

### Functional appropriateness

Degree to which the functions facilitate the accomplishment of specified tasks and objectives.




## Performance Efficiency

A set of attributes that bear on the relationship between the level of performance of the software and the amount of resources used, under stated conditions.

### Time behavior

Degree to which the response and processing times and throughput rates of a product or system, when performing its functions, meet requirements.

### Resource utilization

Degree to which the amounts and types of resources used by a product or system, when performing its functions, meet requirements.

## Capacity

Degree to which the maximum limits of a product or system parameter meet requirements.



## Compatibility

Degree to which a product, system or component can exchange information with other products, systems or components, and/or perform its required functions, while sharing the same hardware or software environment.

### Co-existence

Degree to which a product can perform its required functions efficiently while sharing a common environment and resources with other products, without detrimental impact on any other product.

### Interoperability

Degree to which two or more systems, products or components can exchange information and use the information that has been exchanged.



## Usability

Degree to which a product or system can be used by specified users to achieve specified goals with effectiveness, efficiency and satisfaction in a specified context of use.

### Appropriateness recognizability

Degree to which users can recognize whether a product or system is appropriate for their needs.

Note 1 to entry: Appropriateness recognizability will depend on the ability to recognize the appropriateness of the product or system’s functions from initial impressions of the product or system and/or any associated documentation.

Note 2 to entry: The information provided by the product or system can include demonstrations, tutorials, documentation or, for a web site, the information on the home page.

### Learnability

Degree to which a product or system can be used by specified users to achieve specified goals of learning to use the product or system with effectiveness, efficiency, freedom from risk and satisfaction in a specified context of use.

### Operability

Degree to which a product or system has attributes that make it easy to operate and control.

Operability corresponds to controllability, (operator) error tolerance and conformity with user expectations

### User error protection

Degree to which a system protects users against making errors.

### User interface aesthetics

Degree to which a user interface enables pleasing and satisfying interaction for the user.

This refers to properties of the product or system that increase the pleasure and satisfaction of the user, such as the use of colour and the nature of the graphical design.


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

### Modularity

Degree to which a system or computer program is composed of discrete components such that a change to one component has minimal impact on other components.

### Reusability

Degree to which an asset can be used in more than one system, or in building other assets.

### Analysability

Degree of effectiveness and efficiency with which it is possible to assess the impact on a product or system of an intended change to one or more of its parts, or to diagnose a product for deficiencies or causes of failures, or to identify parts to be modified.

### Modifiability

Degree to which a product or system can be effectively and efficiently modified without introducing defects or degrading existing product quality.

### Testability

Degree of effectiveness and efficiency with which test criteria can be established for a system, product or component and tests can be performed to determine whether those criteria have been met.




## Portability

Degree of effectiveness and efficiency with which a system, product or component can be transferred from one hardware, software or other operational or usage environment to another

### Adaptability

Degree to which a product or system can effectively and efficiently be adapted for different or evolving hardware, software or other operational or usage environments.

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