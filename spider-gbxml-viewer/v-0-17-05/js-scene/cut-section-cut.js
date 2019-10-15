// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, */
/* jshint esversion: 6 */

const CUT = {};

//CUT.colorButtonToggle = 'pink';


// move into own related functions?
CUT.localClipX1= new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), 0 );
CUT.localClipX2= new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 );

CUT.localClipY1= new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0 );
CUT.localClipY2= new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 );

CUT.localClipZ1= new THREE.Plane( new THREE.Vector3( -0, 0, -1 ), 0 );
CUT.localClipZ2= new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 );


CUT.getDetSectionViews = function() {

	const bb = new THREE.Box3().setFromObject( THR.scene );
	//console.log( 'bbox', bbox );

	//const bb = THRU.boundingBox;


	const htm =

	`
		<small><i>
			<p>
				Click 'Toggle section view' button to start.
				Click the buttons twice to reset. Rotate sections around Z-axis coming next.
			</p>
			<p>
				Issue: not always adjusting range as expected when opening new model.
			</p>
		</i></small>

		<p>
			<button id=butSectionView onclick=CUT.toggleSectionViewX(); >Toggle section view</button>
		</p>

		<div>
			clipping plane front: <output id=outClipX1 >${ THRU.radius.toFixed() }</output><br>
			<input type=range id=inpClipX1 max=${ THRU.radius } min=${ -THRU.radius } step=1 value=${ THRU.radius }
			oninput=outClipX1.value=Number(inpClipX1.value).toFixed();CUT.updateCLipX(); title="-50 to 50: OK" >
		</div>

		<div>
			clipping plane back: <output id=outClipX2 >${ -THRU.radius.toFixed() }</output><br>
			<input type=range id=inpClipX2 max=${ THRU.radius } min=${ -THRU.radius } step=1 value=${ -THRU.radius }
			oninput=outClipX2.value=Number(inpClipX2.value).toFixed();CUT.updateCLipX(); title="-50 to 50: OK" >
		</div>

		<br>


		<div>
			Clipping plane right: <output id=outClipY1 >${ THRU.radius.toFixed() }</output><br>
			<input type=range id=inpClipY1 max=${ THRU.radius } min=${ -THRU.radius } step=1 value=${ THRU.radius }
			oninput=outClipY1.value=Number(inpClipY1.value).toFixed();CUT.updateCLipY(); title="-50 to 50: OK" >
		</div>

		<div>
			Clipping plane left: <output id=outClipY2 >${ -THRU.radius.toFixed() }</output><br>
			<input type=range id=inpClipY2 max=${ THRU.radius } min=${ -THRU.radius } step=1 value=${ -THRU.radius }
			oninput=outClipY2.value=Number(inpClipY2.value).toFixed();CUT.updateCLipY(); title="-50 to 50: OK" >
		</div>

		<br>

		<div>
			Clipping plane top: <output id=outClipZ1 >${ THRU.radius.toFixed() }</output><br>
			<input type=range id=inpClipZ1 max=${ THRU.radius } min=${ -THRU.radius } step=1 value=${ THRU.radius }
			oninput=outClipZ1.value=Number(inpClipZ1.value).toFixed();CUT.updateCLipZ(); title="-50 to 50: OK" >
		</div>

		<div>
			Clipping plane bottom: <output id=outClipZ2 >${ -THRU.radius.toFixed() }</output><br>
			<input type=range id=inpClipZ2 max=${ THRU.radius } min=${ -THRU.radius } step=1 value=${ -THRU.radius }
			oninput=outClipZ2.value=Number(inpClipZ2.value).toFixed();CUT.updateCLipZ(); title="-50 to 50: OK" >
		</div>

		<!--
		<div> // To be made to work
			rotate section on Z-axis: <output id=outRotate >0</output><br>
			<input type=range id=inpRotate max=180 min=-180 step=1 value=1
			oninput=outRotate.value=inpRotate.valueAsNumber;CUT.updateClipAngle(); title="-180 to 180: OK" >
			</div>
		</div>
		-->

	`;

	return htm;

};



// to be fixed
CUT.updateClipAngle = function() {

	const angle = inpRotate.valueAsNumber * Math.PI / 180;

	CUT.localClipX1.normal = new THREE.Vector3( Math.cos( angle ), Math.sin( angle ), THR.axesHelper.position.x ).normalize();
	//CUT.localClip2.normal = new THREE.Vector3( Math.cos( angle + Math.PI ), Math.sin( angle + Math.PI ), THR.axesHelper.position.x );
	CUT.localClipX2.normal = new THREE.Vector3( Math.cos( angle ), Math.sin( angle ), THR.axesHelper.position.x ).normalize();

};



CUT.toggleSectionViewX = function() {

	butSectionView.classList.toggle( "active" );

	if ( butSectionView.classList.contains( "active" ) ) {

		THR.renderer.localClippingEnabled = true;

		THR.scene.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				//console.log( '', child );

				child.material.clippingPlanes = [ CUT.localClipX1, CUT.localClipX2, CUT.localClipY1, CUT.localClipY2, CUT.localClipZ1, CUT.localClipZ2  ];
				child.material.clipShadows = true;
				child.material.needsUpdate = true;

			}

		} );

		CUT.updateCLipX();
		CUT.updateCLipY();
		CUT.updateCLipZ();

	} else {

		THR.renderer.localClippingEnabled = false;

	}

};



CUT.updateCLipX = function() {

	const orig = THRU.axesHelper.position.x;

	CUT.localClipX1.constant = orig + parseInt( inpClipX1.value, 10 );

	CUT.localClipX2.constant = - orig + - parseInt( inpClipX2.value, 10 );
	//console.log( '', CUT.localClipX1.constant );

};



CUT.updateCLipY = function() {

	const origin = THRU.axesHelper.position.y;

	CUT.localClipY1.constant = origin + parseInt( inpClipY1.value, 10 );

	CUT.localClipY2.constant = - origin + - parseInt( inpClipY2.value, 10 );
	//console.log( '', CUT.localClip2.constant );

};



CUT.updateCLipZ = function() {

	const origin = THRU.axesHelper.position.z;

	CUT.localClipZ1.constant = origin + parseInt( inpClipZ1.value, 10 );

	CUT.localClipZ2.constant = - origin + - parseInt( inpClipZ2.value, 10 );
	//console.log( '', CUT.localClip2.constant );

};