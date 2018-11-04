// Copyright 2018 Ladybug Tools authors. MIT License
/* globals THR, GBX, */
/* jshint esversion: 6 */

const CUT = {};

CUT.colorButtonToggle = 'pink';


// move into own related functions?
CUT.localClipX1= new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), 0 );
CUT.localClipX2= new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 0 );

CUT.localClipY1= new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), 0 );
CUT.localClipY2= new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), 0 );

CUT.localClipZ1= new THREE.Plane( new THREE.Vector3( -0, 0, -1 ), 0 );
CUT.localClipZ2= new THREE.Plane( new THREE.Vector3( 0, 0, 1 ), 0 );


CUT.getDetSectionViews = function() {

	const htm =

	`
		<p><small><i>Click 'Toggle section view' button to start. Click the buttons twice to reset. Multiple sections coming next.</i></small></p>

		<p>
			<button id=butSectionView onclick=CUT.toggleSectionViewX(); >Toggle section view</button>
		</p>

		<div>
			clipping plane front: <output id=outClipX1 >50</output><br>
			<input type=range id=inpClipX1 max=50 min=-50 step=1 value=50
			oninput=outClipX1.value=inpClipX1.value;CUT.updateCLipX(); title="-50 to 50: OK" >
		</div>

		<div>
			clipping plane back: <output id=outClipX2 >-50</output><br>
			<input type=range id=inpClipX2 max=50 min=-50 step=1 value=-50
			oninput=outClipX2.value=inpClipX2.value;CUT.updateCLipX(); title="-50 to 50: OK" >
		</div>

		<br>


		<div>
			Clipping plane right: <output id=outClipY1 >50</output><br>
			<input type=range id=inpClipY1 max=50 min=-50 step=1 value=50
			oninput=outClipY1.value=inpClipY1.value;CUT.updateCLipY(); title="-50 to 50: OK" >
		</div>

		<div>
			Clipping plane left: <output id=outClipY2 >-50</output><br>
			<input type=range id=inpClipY2 max=50 min=-50 step=1 value=-50
			oninput=outClipY2.value=inpClipY2.value;CUT.updateCLipY(); title="-50 to 50: OK" >
		</div>

		<br>

		<div>
			Clipping plane top: <output id=outClipZ1 >50</output><br>
			<input type=range id=inpClipZ1 max=50 min=-50 step=1 value=50
			oninput=outClipZ1.value=inpClipZ1.value;CUT.updateCLipZ(); title="-50 to 50: OK" >
		</div>

		<div>
			Clipping plane bottom: <output id=outClipZ2 >-50</output><br>
			<input type=range id=inpClipZ2 max=50 min=-50 step=1 value=-50
			oninput=outClipZ2.value=inpClipZ2.value;CUT.updateCLipZ(); title="-50 to 50: OK" >
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



CUT.updateCLipX = function() {

	const orig= THRU.axesHelper.position.x;

	CUT.localClipX1.constant = orig + parseInt( inpClipX1.value, 10 );

	CUT.localClipX2.constant = - orig + - parseInt( inpClipX2.value, 10 );
	//console.log( '', CUT.localClipX2.constant );

};



CUT.toggleSectionViewX = function() {

	if ( butSectionView.style.fontStyle !== 'italic' ) {

		THR.scene.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material.clippingPlanes = [ CUT.localClipX1, CUT.localClipX2, CUT.localClipY1, CUT.localClipY2, CUT.localClipZ1, CUT.localClipZ2  ];
				child.material.clipShadows = true;
				child.material.needsUpdate = true;

			}

		} );

		THR.renderer.localClippingEnabled = true;

		butSectionView.style.cssText = 'background-color: ' + CUT.colorButtonToggle + ' !important; font-style: italic; font-weight: bold';
		//butSectionViewY.style.cssText = '';
		//butSectionViewZ.style.cssText = '';

		CUT.updateCLipX();
		CUT.updateCLipY();
		CUT.updateCLipZ();

	} else {

		THR.renderer.localClippingEnabled = false;

		butSectionView.style.cssText = '';
		//butSectionViewY.style.cssText = '';
		//butSectionViewZ.style.cssText = '';

	}

};



CUT.updateCLipY = function() {

	const origin = THRU.axesHelper.position.y;

	CUT.localClipY1.constant = origin + parseInt( inpClipY1.value, 10 );

	CUT.localClipY2.constant = - origin + - parseInt( inpClipY2.value, 10 );
	//console.log( '', CUT.localClip2.constant );

};



CUT.toggleSectionViewY = function() {

	if ( butSectionViewY.style.fontStyle !== 'italic' ) {

		THR.scene.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material.clippingPlanes = [ CUT.localClipY1, CUT.localClipY2 ];
				child.material.clipShadows = true;
				child.material.needsUpdate = true;

			}

		} );

		THR.renderer.localClippingEnabled = true;

		butSectionViewY.style.cssText = 'background-color: ' + CUT.colorButtonToggle + ' !important; font-style: italic; font-weight: bold';
		//butSectionView.style.cssText = '';
		//butSectionViewZ.style.cssText = '';

		CUT.updateCLipY();

	} else {

		THR.renderer.localClippingEnabled = false;

		butSectionView.style.cssText = '';
		//butSectionViewY.style.cssText = '';
		//butSectionViewZ.style.cssText = '';

	}

};



CUT.updateCLipZ = function() {

	const origin = THRU.axesHelper.position.z;

	CUT.localClipZ1.constant = origin + parseInt( inpClipZ1.value, 10 );

	CUT.localClipZ2.constant = - origin + - parseInt( inpClipZ2.value, 10 );
	//console.log( '', CUT.localClip2.constant );

};



CUT.toggleSectionViewZ = function() {

	console.log( 'butSectionViewZ.style.backgroundColor', butSectionViewZ.style.backgroundColor );

	if ( butSectionViewZ.style.fontStyle !== 'italic' ) {

		THR.scene.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material.clippingPlanes = [ CUT.localClipZ1, CUT.localClipZ2 ];
				child.material.clipShadows = true;
				child.material.needsUpdate = true;

			}

		} );

		THR.renderer.localClippingEnabled = true;

		//butSectionViewZ.style.cssText = 'background-color: ' + CUT.colorButtonToggle + ' !important; font-style: italic; font-weight: bold';
		butSectionView.style.cssText = '';
		//butSectionViewY.style.cssText = '';

		CUT.updateCLipZ();

	} else {

		THR.renderer.localClippingEnabled = false;

		butSectionView.style.cssText = '';
		butSectionViewY.style.cssText = '';
		butSectionViewZ.style.cssText = '';

		//butSectionViewZ.style.backgroundColor = '';
		//butSectionViewZ.style.fontStyle = '';
		//butSectionViewZ.style.fontWeight = '';
	}

};
