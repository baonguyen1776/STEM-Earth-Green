import{W as Lt,A as K,P as Ct,S as X,a as xt,C as l,F as it,b as Dt,D as st,c as ut,d as St,V as u,M as P,T as S,Q as ot,e as at,f as v,R as Pt,g as Et,h as Tt,i as Rt,j as B,k as z,l as kt,m as At,n as E,o as pt,p as T,N as dt,q as j,B as $,G as q,r as mt,s as R,t as It,u as _t,v as gt,w as Ot,O as zt,E as Nt,x as Ft,y as Ht,I as nt,z as jt}from"./three-BGtu_qmT.js";import{g as G}from"./gsap-DDlvirwQ.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const x={antialias:!0,alpha:!0,powerPreference:"high-performance",maxPixelRatio:2,clearColor:0,clearAlpha:1};class Gt{_renderer;_container;_resizeObserver=null;_resizeHandler=null;_isDisposed=!1;constructor(t={}){this._container=this.resolveContainer(t.container);const e=this.resolveCanvas(t.canvas);this._renderer=new Lt({canvas:e,antialias:t.antialias??x.antialias,alpha:t.alpha??x.alpha,powerPreference:t.powerPreference??x.powerPreference}),this.configure(t),this.setToneMapping(K,1.2),this.setupResizeHandling(),this.updateSize()}get webGLRenderer(){return this._renderer}get domElement(){return this._renderer.domElement}get container(){return this._container}get size(){return{width:this._container.clientWidth,height:this._container.clientHeight}}get aspectRatio(){const{width:t,height:e}=this.size;return e>0?t/e:1}get isDisposed(){return this._isDisposed}render(t,e){if(this._isDisposed){console.warn("Renderer: Attempting to render after disposal");return}this._renderer.render(t,e)}updateSize(){if(this._isDisposed)return;const{width:t,height:e}=this.size;this._renderer.setSize(t,e,!1),window.dispatchEvent(new CustomEvent("renderer:resize",{detail:{width:t,height:e,aspectRatio:this.aspectRatio}}))}setPixelRatio(t){const e=x.maxPixelRatio,i=window.devicePixelRatio??1,s=t??Math.min(i,e);this._renderer.setPixelRatio(s)}setClearColor(t,e=1){this._renderer.setClearColor(t,e)}setShadows(t,e=Ct){this._renderer.shadowMap.enabled=t,this._renderer.shadowMap.type=e}setToneMapping(t=K,e=1){this._renderer.toneMapping=t,this._renderer.toneMappingExposure=e}getInfo(){return this._renderer.info}clear(t=!0,e=!0,i=!0){this._renderer.clear(t,e,i)}dispose(){this._isDisposed||(this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._resizeHandler&&(window.removeEventListener("resize",this._resizeHandler),this._resizeHandler=null),this._renderer.dispose(),this._renderer.domElement.parentNode&&this._renderer.domElement.parentNode.removeChild(this._renderer.domElement),this._isDisposed=!0)}resolveContainer(t){if(!t)return document.body;if(typeof t=="string"){const e=document.querySelector(t);if(!e)throw new Error(`Renderer: Container not found: ${t}`);return e}return t}resolveCanvas(t){if(t){if(typeof t=="string"){const e=document.querySelector(t);if(!e)throw new Error(`Renderer: Canvas not found: ${t}`);return e}return t}}configure(t){const e=x.maxPixelRatio,i=t.pixelRatio??Math.min(window.devicePixelRatio,e);this._renderer.setPixelRatio(i),this._renderer.outputColorSpace=X,this._renderer.toneMapping=K,this._renderer.toneMappingExposure=1;const s=x.clearColor,a=x.clearAlpha;this._renderer.setClearColor(s,a),this._renderer.domElement.parentNode||this._container.appendChild(this._renderer.domElement),this._renderer.domElement.style.display="block"}setupResizeHandling(){typeof ResizeObserver<"u"&&(this._resizeObserver=new ResizeObserver(()=>{this.updateSize()}),this._resizeObserver.observe(this._container)),this._resizeHandler=()=>{this.updateSize()},window.addEventListener("resize",this._resizeHandler)}}const Ut={ambientIntensity:.6,ambientColor:657946,keyLightIntensity:2.5,keyLightColor:16774630,keyLightPosition:{x:6,y:4,z:8},rimLightIntensity:2.8,rimLightColor:62207,rimLightPosition:{x:-3,y:1,z:-8},fillLightIntensity:.8,fillLightColor:4482730,fillLightPosition:{x:-8,y:-2,z:5}};class Vt{_scene;_ambientLight;_keyLight;_rimLight;_fillLight;_objects=new Map;_isDisposed=!1;_originalRimLightColor;_originalKeyLightIntensity;constructor(t={}){this._scene=new xt,t.backgroundColor!==void 0&&(this._scene.background=new l(t.backgroundColor)),t.fog&&(this._scene.fog=new it(t.fog.color,t.fog.near,t.fog.far));const e={...Ut,...t.lights};this._ambientLight=new Dt(e.ambientColor,e.ambientIntensity),this._scene.add(this._ambientLight),this._keyLight=new st(e.keyLightColor,e.keyLightIntensity),this._keyLight.position.set(e.keyLightPosition.x,e.keyLightPosition.y,e.keyLightPosition.z),this._scene.add(this._keyLight),this._rimLight=new ut(e.rimLightColor,e.rimLightIntensity,50,1.5),this._rimLight.position.set(e.rimLightPosition.x,e.rimLightPosition.y,e.rimLightPosition.z),this._scene.add(this._rimLight),this._fillLight=new st(e.fillLightColor,e.fillLightIntensity),this._fillLight.position.set(e.fillLightPosition.x,e.fillLightPosition.y,e.fillLightPosition.z),this._scene.add(this._fillLight),this._originalRimLightColor=new l(e.rimLightColor),this._originalKeyLightIntensity=e.keyLightIntensity}get scene(){return this._scene}get ambientLight(){return this._ambientLight}get keyLight(){return this._keyLight}get directionalLight(){return this._keyLight}get rimLight(){return this._rimLight}get fillLight(){return this._fillLight}get backLight(){return this._fillLight}get objects(){return new Map(this._objects)}get isDisposed(){return this._isDisposed}add(t,e){return this._isDisposed?(console.warn("SceneManager: Cannot add object after disposal"),t):(this._scene.add(t),e&&this._objects.set(e,t),t)}remove(t){if(this._isDisposed)return!1;let e;if(typeof t=="string")e=this._objects.get(t),e&&this._objects.delete(t);else{e=t;for(const[i,s]of this._objects)if(s===e){this._objects.delete(i);break}}return e?(this._scene.remove(e),!0):!1}get(t){return this._objects.get(t)}has(t){return this._objects.has(t)}clearObjects(){for(const[,t]of this._objects)this._scene.remove(t);this._objects.clear()}setAmbientIntensity(t){this._ambientLight.intensity=t}setKeyLightIntensity(t){this._keyLight.intensity=t}setDirectionalIntensity(t){this._keyLight.intensity=t}setRimLightIntensity(t){this._rimLight.intensity=t}setFillLightIntensity(t){this._fillLight.intensity=t}setBackLightIntensity(t){this._fillLight.intensity=t}setLightIntensities(t,e,i,s){this._ambientLight.intensity=t,this._keyLight.intensity=e,this._rimLight.intensity=i,s!==void 0&&(this._fillLight.intensity=s)}setKeyLightPosition(t,e,i){this._keyLight.position.set(t,e,i)}setDirectionalLightPosition(t,e,i){this._keyLight.position.set(t,e,i)}updateLightingForPollution(t){const e=Math.max(0,Math.min(1,t)),i=new l(6710886),s=this._originalRimLightColor.clone();s.lerp(i,e*.7),this._rimLight.color.copy(s),this._rimLight.intensity=1.2*(1-e*.5);const a=1-e*.3;this._keyLight.intensity=this._originalKeyLightIntensity*a;const n=new l(16774630),r=new l(16755302),m=n.clone();m.lerp(r,e*.4),this._keyLight.color.copy(m);const y=new l(657946),L=new l(1709328),w=y.clone();w.lerp(L,e*.5),this._ambientLight.color.copy(w),this._ambientLight.intensity=.15+e*.1}resetLighting(){this._rimLight.color.copy(this._originalRimLightColor),this._rimLight.intensity=1.2,this._keyLight.intensity=this._originalKeyLightIntensity,this._keyLight.color.set(16774630),this._ambientLight.color.set(657946),this._ambientLight.intensity=.15}setBackground(t){t===null?this._scene.background=null:this._scene.background=new l(t)}setFog(t,e,i){this._scene.fog=new it(t,e,i)}clearFog(){this._scene.fog=null}traverse(t){this._scene.traverse(t)}find(t){let e;return this._scene.traverse(i=>{!e&&t(i)&&(e=i)}),e}dispose(){if(!this._isDisposed){for(const[,t]of this._objects)this.disposeObject(t);this._objects.clear(),this._ambientLight.dispose(),this._keyLight.dispose(),this._rimLight.dispose(),this._fillLight.dispose(),this._scene.clear(),this._isDisposed=!0}}disposeObject(t){if("geometry"in t&&t.geometry&&t.geometry.dispose(),"material"in t&&t.material){const e=Array.isArray(t.material)?t.material:[t.material];for(const i of e)i&&typeof i.dispose=="function"&&i.dispose()}for(const e of t.children)this.disposeObject(e)}}const rt={type:"change"},Q={type:"start"},ft={type:"end"},H=new Pt,lt=new Et,Yt=Math.cos(70*Tt.DEG2RAD),p=new u,f=2*Math.PI,h={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Z=1e-6;class Kt extends St{constructor(t,e=null){super(t,e),this.state=h.NONE,this.target=new u,this.cursor=new u,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:P.ROTATE,MIDDLE:P.DOLLY,RIGHT:P.PAN},this.touches={ONE:S.ROTATE,TWO:S.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new u,this._lastQuaternion=new ot,this._lastTargetPosition=new u,this._quat=new ot().setFromUnitVectors(t.up,new u(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new at,this._sphericalDelta=new at,this._scale=1,this._panOffset=new u,this._rotateStart=new v,this._rotateEnd=new v,this._rotateDelta=new v,this._panStart=new v,this._panEnd=new v,this._panDelta=new v,this._dollyStart=new v,this._dollyEnd=new v,this._dollyDelta=new v,this._dollyDirection=new u,this._mouse=new v,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Wt.bind(this),this._onPointerDown=Zt.bind(this),this._onPointerUp=Bt.bind(this),this._onContextMenu=ee.bind(this),this._onMouseWheel=qt.bind(this),this._onKeyDown=Qt.bind(this),this._onTouchStart=Jt.bind(this),this._onTouchMove=te.bind(this),this._onMouseDown=$t.bind(this),this._onMouseMove=Xt.bind(this),this._interceptControlDown=ie.bind(this),this._interceptControlUp=se.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(rt),this.update(),this.state=h.NONE}update(t=null){const e=this.object.position;p.copy(e).sub(this.target),p.applyQuaternion(this._quat),this._spherical.setFromVector3(p),this.autoRotate&&this.state===h.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=f:i>Math.PI&&(i-=f),s<-Math.PI?s+=f:s>Math.PI&&(s-=f),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let a=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const n=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),a=n!=this._spherical.radius}if(p.setFromSpherical(this._spherical),p.applyQuaternion(this._quatInverse),e.copy(this.target).add(p),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let n=null;if(this.object.isPerspectiveCamera){const r=p.length();n=this._clampDistance(r*this._scale);const m=r-n;this.object.position.addScaledVector(this._dollyDirection,m),this.object.updateMatrixWorld(),a=!!m}else if(this.object.isOrthographicCamera){const r=new u(this._mouse.x,this._mouse.y,0);r.unproject(this.object);const m=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),a=m!==this.object.zoom;const y=new u(this._mouse.x,this._mouse.y,0);y.unproject(this.object),this.object.position.sub(y).add(r),this.object.updateMatrixWorld(),n=p.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;n!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(n).add(this.object.position):(H.origin.copy(this.object.position),H.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(H.direction))<Yt?this.object.lookAt(this.target):(lt.setFromNormalAndCoplanarPoint(this.object.up,this.target),H.intersectPlane(lt,this.target))))}else if(this.object.isOrthographicCamera){const n=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),n!==this.object.zoom&&(this.object.updateProjectionMatrix(),a=!0)}return this._scale=1,this._performCursorZoom=!1,a||this._lastPosition.distanceToSquared(this.object.position)>Z||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Z||this._lastTargetPosition.distanceToSquared(this.target)>Z?(this.dispatchEvent(rt),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?f/60*this.autoRotateSpeed*t:f/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){p.setFromMatrixColumn(e,0),p.multiplyScalar(-t),this._panOffset.add(p)}_panUp(t,e){this.screenSpacePanning===!0?p.setFromMatrixColumn(e,1):(p.setFromMatrixColumn(e,0),p.crossVectors(this.object.up,p)),p.multiplyScalar(t),this._panOffset.add(p)}_pan(t,e){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;p.copy(s).sub(this.target);let a=p.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*a/i.clientHeight,this.object.matrix),this._panUp(2*e*a/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=t-i.left,a=e-i.top,n=i.width,r=i.height;this._mouse.x=s/n*2-1,this._mouse.y=-(a/r)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(f*this._rotateDelta.x/e.clientHeight),this._rotateUp(f*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(f*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-f*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(f*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-f*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(i,s)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,a=Math.sqrt(i*i+s*s);this._dollyStart.set(0,a)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),s=.5*(t.pageX+i.x),a=.5*(t.pageY+i.y);this._rotateEnd.set(s,a)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(f*this._rotateDelta.x/e.clientHeight),this._rotateUp(f*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,s=t.pageY-e.y,a=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,a),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const n=(t.pageX+e.x)*.5,r=(t.pageY+e.y)*.5;this._updateZoomParameters(n,r)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new v,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function Zt(o){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(o.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(o)&&(this._addPointer(o),o.pointerType==="touch"?this._onTouchStart(o):this._onMouseDown(o)))}function Wt(o){this.enabled!==!1&&(o.pointerType==="touch"?this._onTouchMove(o):this._onMouseMove(o))}function Bt(o){switch(this._removePointer(o),this._pointers.length){case 0:this.domElement.releasePointerCapture(o.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(ft),this.state=h.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function $t(o){let t;switch(o.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case P.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(o),this.state=h.DOLLY;break;case P.ROTATE:if(o.ctrlKey||o.metaKey||o.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(o),this.state=h.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(o),this.state=h.ROTATE}break;case P.PAN:if(o.ctrlKey||o.metaKey||o.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(o),this.state=h.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(o),this.state=h.PAN}break;default:this.state=h.NONE}this.state!==h.NONE&&this.dispatchEvent(Q)}function Xt(o){switch(this.state){case h.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(o);break;case h.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(o);break;case h.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(o);break}}function qt(o){this.enabled===!1||this.enableZoom===!1||this.state!==h.NONE||(o.preventDefault(),this.dispatchEvent(Q),this._handleMouseWheel(this._customWheelEvent(o)),this.dispatchEvent(ft))}function Qt(o){this.enabled!==!1&&this._handleKeyDown(o)}function Jt(o){switch(this._trackPointer(o),this._pointers.length){case 1:switch(this.touches.ONE){case S.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(o),this.state=h.TOUCH_ROTATE;break;case S.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(o),this.state=h.TOUCH_PAN;break;default:this.state=h.NONE}break;case 2:switch(this.touches.TWO){case S.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(o),this.state=h.TOUCH_DOLLY_PAN;break;case S.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(o),this.state=h.TOUCH_DOLLY_ROTATE;break;default:this.state=h.NONE}break;default:this.state=h.NONE}this.state!==h.NONE&&this.dispatchEvent(Q)}function te(o){switch(this._trackPointer(o),this.state){case h.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(o),this.update();break;case h.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(o),this.update();break;case h.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(o),this.update();break;case h.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(o),this.update();break;default:this.state=h.NONE}}function ee(o){this.enabled!==!1&&o.preventDefault()}function ie(o){o.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function se(o){o.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const W={fov:75,near:.1,far:1e3},O={x:0,y:0,z:10},oe={x:0,y:0,z:50},b={enableDamping:!0,dampingFactor:.05,enableZoom:!0,minDistance:8,maxDistance:25,enableRotate:!0,enablePan:!1,autoRotate:!1,autoRotateSpeed:2,minPolarAngle:0,maxPolarAngle:Math.PI},ae={introDuration:3};class ne{_camera;_controls=null;_resizeHandler=null;_isDisposed=!1;constructor(t={}){const e=t.fov??W.fov,i=t.near??W.near,s=t.far??W.far,a=window.innerWidth/window.innerHeight;this._camera=new Rt(e,a,i,s);const n=t.position??O;this._camera.position.set(n.x,n.y,n.z);const r=t.lookAt??{x:0,y:0,z:0};this._camera.lookAt(r.x,r.y,r.z),t.enableControls!==!1&&t.domElement&&this.setupControls(t.domElement),this.setupResizeHandling()}get camera(){return this._camera}get controls(){return this._controls}get position(){return this._camera.position.clone()}get rotation(){return this._camera.rotation.clone()}get isDisposed(){return this._isDisposed}setPosition(t,e,i){this._camera.position.set(t,e,i),this._controls?.update()}setTarget(t,e,i){this._controls?(this._controls.target.set(t,e,i),this._controls.update()):this._camera.lookAt(t,e,i)}getTarget(){if(this._controls)return this._controls.target.clone();const t=new u;return this._camera.getWorldDirection(t),this._camera.position.clone().add(t.multiplyScalar(10))}setFOV(t){this._camera.fov=t,this._camera.updateProjectionMatrix()}setAspect(t){this._camera.aspect=t,this._camera.updateProjectionMatrix()}updateAspect(t,e){e!==void 0?this._camera.aspect=t/e:this._camera.aspect=t,this._camera.updateProjectionMatrix()}enableControls(){this._controls&&(this._controls.enabled=!0)}disableControls(){this._controls&&(this._controls.enabled=!1)}setControlsEnabled(t){this._controls&&(this._controls.enabled=t)}setAutoRotate(t,e=2){this._controls&&(this._controls.autoRotate=t,this._controls.autoRotateSpeed=e)}setZoomLimits(t,e){this._controls&&(this._controls.minDistance=t,this._controls.maxDistance=e)}setPolarLimits(t,e){this._controls&&(this._controls.minPolarAngle=t,this._controls.maxPolarAngle=e)}reset(){const t=O;this.setPosition(t.x,t.y,t.z),this.setTarget(0,0,0)}get positionTarget(){const t=this._camera;return{get x(){return t.position.x},set x(e){t.position.x=e},get y(){return t.position.y},set y(e){t.position.y=e},get z(){return t.position.z},set z(e){t.position.z=e}}}get positionObject(){const t=this._camera;return{get x(){return t.position.x},set x(e){t.position.x=e},get y(){return t.position.y},set y(e){t.position.y=e},get z(){return t.position.z},set z(e){t.position.z=e}}}getIntroStartPosition(){return{...oe}}getIntroEndPosition(){return{...O}}getIntroDuration(){return ae.introDuration}update(){this._isDisposed||this._controls&&this._controls.update()}dispose(){this._isDisposed||(this._resizeHandler&&(window.removeEventListener("renderer:resize",this._resizeHandler),this._resizeHandler=null),this._controls&&(this._controls.dispose(),this._controls=null),this._isDisposed=!0)}setupControls(t){this._controls=new Kt(this._camera,t),this._controls.target.set(0,0,0),this._controls.enableDamping=b.enableDamping,this._controls.dampingFactor=b.dampingFactor,this._controls.enableZoom=b.enableZoom,this._controls.enablePan=b.enablePan,this._controls.enableRotate=b.enableRotate,this._controls.minDistance=b.minDistance,this._controls.maxDistance=b.maxDistance,this._controls.minPolarAngle=b.minPolarAngle,this._controls.maxPolarAngle=b.maxPolarAngle,this._controls.autoRotate=b.autoRotate,this._controls.autoRotateSpeed=b.autoRotateSpeed,this._controls.update()}setupResizeHandling(){this._resizeHandler=()=>{const t=window.event;t?.detail&&this.updateAspect(t.detail.width,t.detail.height)},window.addEventListener("renderer:resize",this._resizeHandler)}}class re{_callbacks=new Map;_isRunning=!1;_isPaused=!1;_animationFrameId=null;_lastTime=0;_elapsedTime=0;_frame=0;_maxDeltaTime;_targetFPS;_fpsInterval=0;_fpsHistory=[];_fpsHistorySize=60;constructor(t={}){this._maxDeltaTime=t.maxDeltaTime??.1,this._targetFPS=t.targetFPS??0,this._targetFPS>0&&(this._fpsInterval=1e3/this._targetFPS),this.loop=this.loop.bind(this),t.autoStart&&this.start()}get isRunning(){return this._isRunning}get isPaused(){return this._isPaused}get elapsedTime(){return this._elapsedTime}get frame(){return this._frame}get fps(){if(this._fpsHistory.length===0)return 0;const t=this._fpsHistory.reduce((e,i)=>e+i,0);return Math.round(t/this._fpsHistory.length)}get callbackCount(){return this._callbacks.size}add(t,e){return this._callbacks.set(t,e),()=>{this.remove(t)}}remove(t){return this._callbacks.delete(t)}has(t){return this._callbacks.has(t)}clear(){this._callbacks.clear()}start(){this._isRunning||(this._isRunning=!0,this._isPaused=!1,this._lastTime=performance.now(),this._animationFrameId=requestAnimationFrame(this.loop))}stop(){this._isRunning&&(this._isRunning=!1,this._isPaused=!1,this._animationFrameId!==null&&(cancelAnimationFrame(this._animationFrameId),this._animationFrameId=null))}pause(){this._isPaused=!0}resume(){this._isPaused&&(this._isPaused=!1,this._lastTime=performance.now())}togglePause(){return this._isPaused?this.resume():this.pause(),this._isPaused}reset(){this._elapsedTime=0,this._frame=0,this._fpsHistory=[],this._lastTime=performance.now()}tick(t){const e=t??.016666666666666666;this._elapsedTime+=e,this._frame++;for(const i of this._callbacks.values())try{i(e,this._elapsedTime,this._frame)}catch(s){console.error("AnimationLoop callback error:",s)}}dispose(){this.stop(),this.clear()}loop(t){if(!this._isRunning)return;if(this._animationFrameId=requestAnimationFrame(this.loop),this._isPaused){this._lastTime=t;return}let e=(t-this._lastTime)/1e3;if(this._targetFPS>0&&t-this._lastTime<this._fpsInterval)return;e=Math.min(e,this._maxDeltaTime),this._lastTime=t,this._elapsedTime+=e,this._frame++;const i=1/e;this._fpsHistory.push(i),this._fpsHistory.length>this._fpsHistorySize&&this._fpsHistory.shift();for(const s of this._callbacks.values())try{s(e,this._elapsedTime,this._frame)}catch(a){console.error("AnimationLoop callback error:",a)}}}const M={radius:5,widthSegments:64,heightSegments:64},le={rotationSpeed:.1},I={roughness:.6,metalness:0,normalScale:.8},D={dayMap:"/STEM-Earth-Green/textures/2k_earth_day_new.png",nightMap:"/STEM-Earth-Green/textures/2k_earth_nightmap.jpg",normalMap:"/STEM-Earth-Green/textures/2k_earth_normal_map.tif",specularMap:"/STEM-Earth-Green/textures/2k_earth_specular_map.tif",cloudMap:"/STEM-Earth-Green/textures/2k_earth_clouds.jpg",pollutedDayMap:"/STEM-Earth-Green/textures/earth-polluted.jpg",pollutedCloudMap:"/STEM-Earth-Green/textures/clouds-polluted.jpg"},ht={radius:5.05,rotationSpeed:.12},he={clean:"#4a9eff",polluted:"#3d3228"},ce={clean:"#60b6ff",polluted:"#4a4a4a"},ue={smoke:"#808080",smokeDense:"#1a1a1a",plasticTrash:"#ff6b6b",metalTrash:"#a8a8a8"},pe={accent:"#1e90ff",success:"#4caf50",warning:"#ff9800",error:"#f44336"},g={earth:he,atmosphere:ce,effects:ue,ui:pe};function c(o,t,e){return o+(t-o)*e}function _(o,t,e){return t>e?(console.warn(`clamp: min (${t}) is greater than max (${e}). Returning original value (${o}).`),o):Math.max(t,Math.min(e,o))}class J{_material;_pollutionLevel=0;_cleanColor;_pollutedColor;_currentColor;_enableEmissive;_baseEmissiveIntensity=1;_isDisposed=!1;constructor(t={}){this._cleanColor=new l(g.earth.clean),this._pollutedColor=new l(g.earth.polluted),this._currentColor=this._cleanColor.clone(),this._enableEmissive=t.enableEmissive??!0,this._pollutionLevel=t.pollutionLevel??0,this._material=new B({color:16777215,roughness:t.roughness??I.roughness,metalness:t.metalness??I.metalness,normalScale:new v(I.normalScale,I.normalScale)}),t.textures&&this.applyTextures(t.textures),this.setPollutionLevel(this._pollutionLevel)}get material(){return this._material}get pollutionLevel(){return this._pollutionLevel}get currentColor(){return this._currentColor.clone()}get isDisposed(){return this._isDisposed}setPollutionLevel(t){if(this._isDisposed)return;this._pollutionLevel=_(t,0,100);const e=this._pollutionLevel/100,i=Math.max(0,(this._pollutionLevel-80)/20);this._currentColor.lerpColors(this._cleanColor,this._pollutedColor,e);const s=new l,a=new l(9127187),n=new l(2894892);s.lerpColors(a,n,i),this._material.color.lerpColors(new l(16777215),s,e*.6),this._enableEmissive&&this.updateEmissive(e),this.updateMaterialProperties(e,i),this._material.needsUpdate=!0}applyTextures(t){this._isDisposed||(t.dayMap&&(this._material.map=t.dayMap,t.dayMap.colorSpace=X),t.normalMap&&(this._material.normalMap=t.normalMap,this._material.normalScale.set(.8,.8)),t.specularMap&&(this._material.roughnessMap=t.specularMap,this._material.roughness=.5),this._material.needsUpdate=!0)}setEmissive(t,e=1){this._isDisposed||(this._material.emissive=new l(t),this._material.emissiveIntensity=e)}setNightMap(t){this._isDisposed||(this._material.emissiveMap=t,this._material.emissive=new l(16764040),this._material.emissiveIntensity=1,this._material.needsUpdate=!0)}setRoughness(t){this._isDisposed||(this._material.roughness=_(t,0,1))}setMetalness(t){this._isDisposed||(this._material.metalness=_(t,0,1))}getColorHex(){return"#"+this._currentColor.getHexString()}clone(){const t=new J({pollutionLevel:this._pollutionLevel,roughness:this._material.roughness,metalness:this._material.metalness,enableEmissive:this._enableEmissive});return this._material.map&&(t._material.map=this._material.map),this._material.normalMap&&(t._material.normalMap=this._material.normalMap),this._material.emissiveMap&&(t._material.emissiveMap=this._material.emissiveMap),t}dispose(){this._isDisposed||(this._material.dispose(),this._isDisposed=!0)}updateEmissive(t){const e=Math.pow(t,.7),i=c(this._baseEmissiveIntensity,.1,e);this._material.emissiveIntensity=i;const s=new l(16764040),a=new l(5583633),n=new l;n.lerpColors(s,a,t),this._material.emissive=n}updateMaterialProperties(t,e=0){const i=I.roughness;this._material.roughness=c(i,.95,t*.7),this._material.metalness=c(0,.1,e);const s=c(.8,.2,t);this._material.normalScale.set(s,s)}}const de=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,me=`
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D normalMap;
  uniform sampler2D specularMap;
  uniform sampler2D cloudsMap;
  
  // Pollution texture blending
  uniform sampler2D pollutedDayMap;
  
  uniform vec3 lightDirection;
  uniform vec3 lightColor;
  uniform float ambientIntensity;
  uniform float pollutionLevel; // 0-1 (0-100 scaled)
  uniform vec3 pollutionTint;
  uniform float nightLightIntensity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldNormal;
  
  void main() {
    // === TEXTURE SAMPLING ===
    vec4 cleanDayColor = texture2D(dayMap, vUv);
    vec4 nightColor = texture2D(nightMap, vUv);
    vec4 specularSample = texture2D(specularMap, vUv);
    
    // Sample pollution texture (fallback to synthetic if not available)
    vec4 pollutedDayColor = texture2D(pollutedDayMap, vUv);
    if (pollutedDayColor.a < 0.01) {
      vec3 desaturated = vec3(dot(cleanDayColor.rgb, vec3(0.3, 0.59, 0.11)));
      vec3 brownTint = vec3(0.6, 0.5, 0.4);
      pollutedDayColor = vec4(mix(desaturated, brownTint, 0.5), 1.0);
    }
    
    // Blend based on pollution level
    float pollutionFactor = pollutionLevel;
    vec4 blendedDayColor = mix(cleanDayColor, pollutedDayColor, pollutionFactor);
    
    // === CAMERA-FACING LIGHTING ===
    // View direction from camera
    vec3 viewDir = normalize(-vPosition);
    
    // Light intensity based on facing camera (front = bright)
    float lightIntensity = dot(vNormal, viewDir);
    
    // Also consider sun direction for day/night
    float sunIntensity = dot(vWorldNormal, lightDirection);
    
    // Combine: front-facing is always lit, plus sun adds more
    float combinedLight = max(lightIntensity * 0.7, 0.0) + max(sunIntensity * 0.5, 0.0);
    combinedLight = clamp(combinedLight, 0.0, 1.0);
    
    // Day/night based on sun position
    float dayFactor = smoothstep(-0.2, 0.3, sunIntensity);
    
    // === BRIGHT DAYLIGHT SHADING ===
    vec3 dayResult = blendedDayColor.rgb;
    
    // High ambient + strong diffuse for bright appearance
    float brightAmbient = ambientIntensity * 1.8;
    dayResult *= brightAmbient + combinedLight * 2.0;
    
    // === SPECULAR HIGHLIGHTS (Ocean sparkle) ===
    vec3 halfDir = normalize(lightDirection + viewDir);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0);
    
    float isOcean = specularSample.r;
    float specularStrength = isOcean * (1.0 - pollutionFactor * 0.6);
    dayResult += spec * specularStrength * 1.2 * lightColor;
    
    // === NIGHT SIDE ===
    vec3 nightResult = nightColor.rgb;
    float cityBrightness = nightLightIntensity * (1.0 - pollutionFactor * 0.7);
    nightResult *= cityBrightness;
    nightResult += blendedDayColor.rgb * 0.05;
    
    // === BLEND DAY/NIGHT ===
    vec3 finalColor = mix(nightResult, dayResult, dayFactor);
    
    // === RIM LIGHTING ===
    float rimFactor = 1.0 - max(dot(viewDir, vNormal), 0.0);
    rimFactor = pow(rimFactor, 2.5);
    vec3 rimColor = mix(vec3(0.4, 0.6, 1.0), vec3(0.5, 0.4, 0.3), pollutionFactor);
    finalColor += rimColor * rimFactor * 0.25 * dayFactor;
    
    // === POLLUTION TINTING ===
    if (pollutionFactor > 0.3) {
      vec3 smogOverlay = vec3(0.75, 0.6, 0.45);
      float smogIntensity = (pollutionFactor - 0.3) * 0.4;
      finalColor = mix(finalColor, finalColor * smogOverlay, smogIntensity);
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;class _e{_material;_pollutionLevel=0;_lightDirection;_isDisposed=!1;constructor(t={}){this._pollutionLevel=t.pollutionLevel??0,this._lightDirection=t.lightDirection??new u(1,.3,.5).normalize(),this._material=new z({vertexShader:de,fragmentShader:me,uniforms:{dayMap:{value:t.dayMap??null},nightMap:{value:t.nightMap??null},normalMap:{value:t.normalMap??null},specularMap:{value:t.specularMap??null},cloudsMap:{value:t.cloudsMap??null},pollutedDayMap:{value:t.pollutedDayMap??null},lightDirection:{value:this._lightDirection},lightColor:{value:new l(16777215)},ambientIntensity:{value:.5},pollutionLevel:{value:this._pollutionLevel/100},pollutionTint:{value:new l(4864040)},nightLightIntensity:{value:2}},side:kt}),this.setPollutionLevel(this._pollutionLevel)}get material(){return this._material}get pollutionLevel(){return this._pollutionLevel}get isDisposed(){return this._isDisposed}setPollutionLevel(t){if(this._isDisposed)return;this._pollutionLevel=_(t,0,100),this._material.uniforms.pollutionLevel.value=this._pollutionLevel/100;const e=c(1.5,.2,this._pollutionLevel/100);this._material.uniforms.nightLightIntensity.value=e;const i=c(.25,.15,this._pollutionLevel/100);this._material.uniforms.ambientIntensity.value=i}setLightDirection(t){this._isDisposed||(this._lightDirection.copy(t).normalize(),this._material.uniforms.lightDirection.value=this._lightDirection)}setTextures(t){this._isDisposed||(t.dayMap&&(this._material.uniforms.dayMap.value=t.dayMap),t.nightMap&&(this._material.uniforms.nightMap.value=t.nightMap),t.normalMap&&(this._material.uniforms.normalMap.value=t.normalMap),t.specularMap&&(this._material.uniforms.specularMap.value=t.specularMap),t.cloudsMap&&(this._material.uniforms.cloudsMap.value=t.cloudsMap),t.pollutedDayMap&&(this._material.uniforms.pollutedDayMap.value=t.pollutedDayMap))}dispose(){this._isDisposed||(this._material.dispose(),this._isDisposed=!0)}}const ct={dayMap:D.dayMap,nightMap:D.nightMap,cloudsMap:D.cloudMap,normalMap:D.normalMap,specularMap:D.specularMap,pollutedDayMap:D.pollutedDayMap,pollutedCloudMap:D.pollutedCloudMap};class ge{_loader;_textures={dayMap:null,nightMap:null,cloudsMap:null,normalMap:null,specularMap:null,pollutedDayMap:null,pollutedCloudMap:null};_isLoaded=!1;_isLoading=!1;_isDisposed=!1;constructor(){this._loader=new At}get isLoaded(){return this._isLoaded}get isLoading(){return this._isLoading}get isDisposed(){return this._isDisposed}get textures(){return{...this._textures}}get(t){return this._textures[t]}async loadAll(t){if(this._isLoaded)return this._textures;if(this._isLoading)return new Promise(a=>{const n=setInterval(()=>{this._isLoaded&&(clearInterval(n),a(this._textures))},100)});this._isLoading=!0;const e=Object.keys(ct),i=e.length;let s=0;for(const a of e){const n=ct[a];t&&t({loaded:s,total:i,percentage:Math.round(s/i*100),currentTexture:a});try{const r=await this.loadTexture(n);this._textures[a]=r}catch(r){console.warn(`Failed to load texture: ${a}`,r)}s++}return t&&t({loaded:i,total:i,percentage:100,currentTexture:"complete"}),this._isLoaded=!0,this._isLoading=!1,this._textures}loadTexture(t){return new Promise((e,i)=>{this._loader.load(t,s=>{s.colorSpace=X,s.anisotropy=16,e(s)},void 0,s=>{i(s)})})}preload(t){this.loadAll(t).catch(e=>{console.error("Failed to preload textures:",e)})}dispose(){if(!this._isDisposed){for(const t of Object.keys(this._textures)){const e=this._textures[t];e&&(e.dispose(),this._textures[t]=null)}this._isLoaded=!1,this._isDisposed=!0}}}let k=null;function fe(){return k||(k=new ge),k}function ye(){k&&(k.dispose(),k=null)}class ve{_material;_pollutionLevel=0;constructor(t={}){this._pollutionLevel=_(t.pollutionLevel??0,0,100),this._material=new z({uniforms:{cleanCloudMap:{value:t.cleanCloudMap??null},pollutedCloudMap:{value:t.pollutedCloudMap??null},opacity:{value:t.opacity??.6},pollutionLevel:{value:this._pollutionLevel/100},lightDirection:{value:t.lightDirection??new u(8,5,6).normalize()}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D cleanCloudMap;
        uniform sampler2D pollutedCloudMap;
        uniform float opacity;
        uniform float pollutionLevel;
        uniform vec3 lightDirection;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldNormal;
        
        void main() {
          // Sample cloud textures
          vec4 cleanClouds = texture2D(cleanCloudMap, vUv);
          vec4 pollutedClouds = texture2D(pollutedCloudMap, vUv);
          
          // Blend clean and polluted based on pollution level
          vec4 blendedClouds = mix(cleanClouds, pollutedClouds, pollutionLevel);
          
          // === CAMERA-FACING LIGHTING ===
          // Use view-based lighting (from camera direction)
          vec3 viewDir = normalize(-vNormal);
          float lightIntensity = dot(vWorldNormal, lightDirection);
          float dayFactor = smoothstep(-0.1, 0.5, lightIntensity);
          
          // Clouds are brighter overall
          vec3 cloudColor = blendedClouds.rgb;
          
          // Clean clouds: bright white
          // Polluted clouds: slightly dimmer
          vec3 cleanTint = vec3(1.0, 1.0, 1.0);
          vec3 pollutedTint = vec3(0.7, 0.65, 0.6);
          cloudColor *= mix(cleanTint, pollutedTint, pollutionLevel);
          
          // Apply lighting - high base brightness
          cloudColor *= (0.6 + dayFactor * 0.6);
          
          // === OPACITY - CLOUDS FADE WITH POLLUTION ===
          // Base cloud alpha from texture
          float cloudAlpha = blendedClouds.a;
          
          // Boost visibility for clean clouds
          cloudAlpha = pow(cloudAlpha, 0.6);
          
          // === KEY CHANGE: Clouds DISAPPEAR with pollution ===
          // At 0% pollution: full clouds
          // At 100% pollution: no clouds (all burned away/acid rain)
          float pollutionFade = 1.0 - pollutionLevel * 0.9;
          float finalOpacity = opacity * cloudAlpha * pollutionFade;
          
          // Ensure some visibility at low pollution
          finalOpacity = max(finalOpacity, 0.0);
          
          gl_FragColor = vec4(cloudColor, clamp(finalOpacity, 0.0, 0.8));
        }
      `,side:t.side??pt,transparent:!0,depthWrite:!1,blending:dt})}get material(){return this._material}setPollutionLevel(t){this._pollutionLevel=_(t,0,100),this._material.uniforms.pollutionLevel.value=this._pollutionLevel/100}setOpacity(t){this._material.uniforms.opacity.value=t}setTextures(t){t.cleanCloudMap&&(this._material.uniforms.cleanCloudMap.value=t.cleanCloudMap),t.pollutedCloudMap&&(this._material.uniforms.pollutedCloudMap.value=t.pollutedCloudMap)}setLightDirection(t){this._material.uniforms.lightDirection.value=t.normalize()}dispose(){this._material.dispose()}}class be{_mesh;_material;_pollutionLevel=0;_baseOpacity;_rotationSpeed;_isDisposed=!1;constructor(t={}){const e=M.radius,i=t.heightOffset??ht.radius-M.radius,s=e+i,a=M.widthSegments;this._baseOpacity=t.opacity??.4,this._rotationSpeed=ht.rotationSpeed,this._pollutionLevel=t.pollutionLevel??0;const n=new E(s,a,a);this._material=new ve({cleanCloudMap:t.cleanCloudTexture,pollutedCloudMap:t.pollutedCloudTexture,opacity:this._baseOpacity,pollutionLevel:this._pollutionLevel,lightDirection:t.lightDirection,side:pt}),this._mesh=new T(n,this._material.material),this._mesh.name="clouds",this.setPollutionLevel(this._pollutionLevel)}get mesh(){return this._mesh}get material(){return this._material}get opacity(){return this._material.material.uniforms.opacity.value}get pollutionLevel(){return this._pollutionLevel}get isDisposed(){return this._isDisposed}update(t){if(this._isDisposed)return;const e=c(1,.3,this._pollutionLevel/100);this._mesh.rotation.y+=this._rotationSpeed*t*e}setPollutionLevel(t){this._isDisposed||(this._pollutionLevel=_(t,0,100),this._material.setPollutionLevel(this._pollutionLevel))}setTextures(t){this._isDisposed||this._material.setTextures(t)}setLightDirection(t){this._isDisposed||this._material.setLightDirection(t)}setOpacity(t){this._isDisposed||this._material.setOpacity(t)}setRotationSpeed(t){this._rotationSpeed=t}show(){this._mesh.visible=!0}hide(){this._mesh.visible=!1}toggle(){return this._mesh.visible=!this._mesh.visible,this._mesh.visible}dispose(){this._isDisposed||(this._mesh.geometry.dispose(),this._material.dispose(),this._isDisposed=!0)}}const we=`
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  varying float vIntensity;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vPositionNormal = normalize(mvPosition.xyz);
    
    // Pre-calculate fresnel intensity in vertex shader for smooth gradients
    float rawFresnel = 1.0 - abs(dot(vNormal, -vPositionNormal));
    vIntensity = rawFresnel;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`,Me=`
  uniform vec3 glowColor;
  uniform vec3 innerColor;
  uniform float intensity;
  uniform float power;
  uniform float thickness;
  uniform float pollutionLevel;
  
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  varying float vIntensity;
  
  void main() {
    // Multi-power fresnel cho layered glow effect
    float fresnel = pow(vIntensity, power);
    float innerFresnel = pow(vIntensity, power * 0.5);
    
    // Outer glow - main atmosphere color
    vec3 outerGlow = glowColor * fresnel * intensity;
    
    // Inner glow - brighter edge
    vec3 innerGlow = innerColor * innerFresnel * intensity * 0.5;
    
    // Combine layers
    vec3 finalColor = outerGlow + innerGlow;
    
    // Alpha calculation - pollution increases opacity dramatically
    float baseAlpha = fresnel * intensity;
    float pollutionAlpha = pollutionLevel * 0.008; // Extra opacity from pollution
    float thicknessBoost = thickness * 0.3;
    
    // At high pollution, atmosphere becomes thick smog that obscures Earth
    float alpha = clamp(baseAlpha + pollutionAlpha + thicknessBoost, 0.0, 0.95);
    
    // Pollution adds a murky overlay
    if (pollutionLevel > 50.0) {
      float smogFactor = (pollutionLevel - 50.0) / 50.0;
      finalColor = mix(finalColor, glowColor * 0.3, smogFactor * 0.5);
      alpha = mix(alpha, 0.85, smogFactor * 0.6);
    }
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;class Le{_mesh;_material;_pollutionLevel=0;_cleanColor;_pollutedColor;_baseIntensity;_baseThickness;_isDisposed=!1;constructor(t={}){const e=M.radius;this._baseThickness=t.thickness??1.12;const i=e*this._baseThickness,s=M.widthSegments;this._baseIntensity=t.intensity??.8,this._pollutionLevel=t.pollutionLevel??0,this._cleanColor=new l(g.atmosphere.clean),this._pollutedColor=new l(g.atmosphere.polluted);const a=new E(i,s,s);this._material=new z({vertexShader:we,fragmentShader:Me,uniforms:{glowColor:{value:this._cleanColor.clone()},innerColor:{value:new l(8965375)},intensity:{value:this._baseIntensity},power:{value:2.5},thickness:{value:0},pollutionLevel:{value:0}},side:$,transparent:!0,blending:j,depthWrite:!1}),this._mesh=new T(a,this._material),this._mesh.name="atmosphere",this.setPollutionLevel(this._pollutionLevel)}get mesh(){return this._mesh}get material(){return this._material}get pollutionLevel(){return this._pollutionLevel}get isDisposed(){return this._isDisposed}setPollutionLevel(t){if(this._isDisposed)return;this._pollutionLevel=_(t,0,100);const e=this._pollutionLevel/100,i=new l;i.lerpColors(this._cleanColor,this._pollutedColor,e),this._material.uniforms.glowColor.value=i;const s=new l(8965375),a=new l(3815994),n=new l;n.lerpColors(s,a,e),this._material.uniforms.innerColor.value=n;const r=c(this._baseIntensity,this._baseIntensity*1.8,e);this._material.uniforms.intensity.value=r;const m=c(0,1,Math.pow(e,1.5));this._material.uniforms.thickness.value=m;const y=c(2.5,1.5,e);this._material.uniforms.power.value=y,this._material.uniforms.pollutionLevel.value=this._pollutionLevel;const L=c(1,1.15,Math.pow(e,2));this._mesh.scale.setScalar(L),this._material.needsUpdate=!0}setIntensity(t){this._isDisposed||(this._material.uniforms.intensity.value=_(t,0,2))}setPower(t){this._isDisposed||(this._material.uniforms.power.value=_(t,1,10))}setColor(t){this._isDisposed||(this._material.uniforms.glowColor.value=new l(t))}show(){this._mesh.visible=!0}hide(){this._mesh.visible=!1}toggle(){return this._mesh.visible=!this._mesh.visible,this._mesh.visible}dispose(){this._isDisposed||(this._mesh.geometry.dispose(),this._material.dispose(),this._isDisposed=!0)}}class Ce{_group;_mesh;_material=null;_shaderMaterial=null;_useDayNightShader;_clouds=null;_atmosphere=null;_textures;_pollutionLevel=0;_autoRotate;_rotationSpeed;_isDisposed=!1;constructor(t={}){this._pollutionLevel=t.pollutionLevel??0,this._autoRotate=t.autoRotate??!0,this._rotationSpeed=t.rotationSpeed??le.rotationSpeed,this._useDayNightShader=t.useDayNightShader??!0,this._group=new q,this._group.name="earth-system";const e=new E(M.radius,M.widthSegments,M.heightSegments);let i;this._useDayNightShader?(this._shaderMaterial=new _e({pollutionLevel:this._pollutionLevel,dayMap:t.textures?.dayMap??void 0,nightMap:t.textures?.nightMap??void 0,normalMap:t.textures?.normalMap??void 0,specularMap:t.textures?.specularMap??void 0}),i=this._shaderMaterial.material):(this._material=new J({...t.materialOptions,pollutionLevel:this._pollutionLevel,textures:t.textures}),i=this._material.material),this._mesh=new T(e,i),this._mesh.name="earth",this._group.add(this._mesh),t.enableClouds!==!1&&(this._clouds=new be({...t.cloudOptions,pollutionLevel:this._pollutionLevel,cleanCloudTexture:t.textures?.cloudsMap??void 0,pollutedCloudTexture:t.textures?.pollutedCloudMap??void 0}),this._group.add(this._clouds.mesh)),t.enableAtmosphere!==!1&&(this._atmosphere=new Le({...t.atmosphereOptions,pollutionLevel:this._pollutionLevel}),this._group.add(this._atmosphere.mesh)),this._textures=fe()}get group(){return this._group}get mesh(){return this._mesh}get material(){return this._material}get shaderMaterial(){return this._shaderMaterial}get clouds(){return this._clouds}get atmosphere(){return this._atmosphere}get pollutionLevel(){return this._pollutionLevel}get rotation(){return this._mesh.rotation}get isDisposed(){return this._isDisposed}async loadTextures(t){const e=await this._textures.loadAll(t);this.applyTextures(e)}applyTextures(t){this._isDisposed||(this._useDayNightShader&&this._shaderMaterial?this._shaderMaterial.setTextures({dayMap:t.dayMap??void 0,nightMap:t.nightMap??void 0,normalMap:t.normalMap??void 0,specularMap:t.specularMap??void 0,cloudsMap:t.cloudsMap??void 0,pollutedDayMap:t.pollutedDayMap??void 0}):this._material&&(this._material.applyTextures(t),t.nightMap&&this._material.setNightMap(t.nightMap)),this._clouds&&this._clouds.setTextures({cleanCloudMap:t.cloudsMap??void 0,pollutedCloudMap:t.pollutedCloudMap??void 0}))}setPollutionLevel(t){this._isDisposed||(this._pollutionLevel=_(t,0,100),this._shaderMaterial&&this._shaderMaterial.setPollutionLevel(this._pollutionLevel),this._material&&this._material.setPollutionLevel(this._pollutionLevel),this._clouds?.setPollutionLevel(this._pollutionLevel),this._atmosphere?.setPollutionLevel(this._pollutionLevel))}update(t){this._isDisposed||(this._autoRotate&&(this._mesh.rotation.y+=this._rotationSpeed*t),this._clouds?.update(t))}setRotation(t,e,i){this._mesh.rotation.set(t,e,i)}setRotationSpeed(t){this._rotationSpeed=t}setAutoRotate(t){this._autoRotate=t}setCloudsVisible(t){this._clouds&&(t?this._clouds.show():this._clouds.hide())}setAtmosphereVisible(t){this._atmosphere&&(t?this._atmosphere.show():this._atmosphere.hide())}setPosition(t,e,i){this._group.position.set(t,e,i)}setScale(t){this._group.scale.setScalar(t)}dispose(){this._isDisposed||(this._material?.dispose(),this._shaderMaterial?.dispose(),this._clouds?.dispose(),this._atmosphere?.dispose(),this._mesh.geometry.dispose(),this._group.parent&&this._group.parent.remove(this._group),this._isDisposed=!0)}}class xe{_mesh;_geometry;_material;_count;_twinkle;_originalSizes=null;_twinkleSpeed=2;_time=0;_isDisposed=!1;_sunGroup=null;_sunCoreMesh=null;_sunGlowMesh=null;_sunRaysMesh=null;constructor(t={}){this._count=t.count??2500;const e=t.minDistance??50,i=t.maxDistance??300,s=t.size??.8,a=t.color??16777215;this._twinkle=t.twinkle??!1;const n=new Float32Array(this._count*3),r=new Float32Array(this._count),m=new Float32Array(this._count);for(let C=0;C<this._count;C++){const F=Math.random()*Math.PI*2,V=Math.acos(2*Math.random()-1),Y=e+Math.random()*(i-e),bt=Y*Math.sin(V)*Math.cos(F),wt=Y*Math.sin(V)*Math.sin(F),Mt=Y*Math.cos(V);n[C*3]=bt,n[C*3+1]=wt,n[C*3+2]=Mt,r[C]=s*(.4+Math.random()*.6),m[C]=.3+Math.random()*.5}this._geometry=new mt,this._geometry.setAttribute("position",new R(n,3)),this._geometry.setAttribute("size",new R(r,1)),this._geometry.setAttribute("opacity",new R(m,1)),this._twinkle&&(this._originalSizes=new Float32Array(r));const y=document.createElement("canvas");y.width=64,y.height=64;const L=y.getContext("2d"),w=L.createRadialGradient(32,32,0,32,32,32);w.addColorStop(0,"rgba(255, 255, 255, 1)"),w.addColorStop(.5,"rgba(255, 255, 255, 0.8)"),w.addColorStop(1,"rgba(255, 255, 255, 0)"),L.fillStyle=w,L.fillRect(0,0,64,64);const A=new It(y);this._material=new _t({color:new l(a),size:1,sizeAttenuation:!0,map:A,transparent:!0,opacity:1,blending:j,depthWrite:!1}),this._mesh=new gt(this._geometry,this._material),this._mesh.name="starfield",(t.enableSun??!0)&&this._createSunGlow(t.sunPosition??{x:40,y:25,z:60})}_createSunGlow(t){this._sunGroup=new q,this._sunGroup.name="sunGlow";const e=new E(3,32,32),i=new Ot({color:16777181,transparent:!0,opacity:1});this._sunCoreMesh=new T(e,i),this._sunGroup.add(this._sunCoreMesh);const s=new E(6,32,32),a=new z({uniforms:{glowColor:{value:new l(16768358)},intensity:{value:3.5}},vertexShader:`
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        void main() {
          float glow = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(glowColor * intensity, glow * 0.8);
        }
      `,transparent:!0,blending:j,side:$,depthWrite:!1});this._sunGlowMesh=new T(s,a),this._sunGroup.add(this._sunGlowMesh);const n=new E(30,32,32),r=new z({uniforms:{glowColor:{value:new l(16764040)},intensity:{value:3.5}},vertexShader:`
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 glowColor;
        uniform float intensity;
        varying vec3 vNormal;
        void main() {
          float glow = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          gl_FragColor = vec4(glowColor * intensity, glow * 0.4);
        }
      `,transparent:!0,blending:j,side:$,depthWrite:!1});this._sunRaysMesh=new T(n,r),this._sunGroup.add(this._sunRaysMesh),this._sunGroup.position.set(t.x,t.y,t.z-10),this._mesh.add(this._sunGroup)}get mesh(){return this._mesh}get count(){return this._count}get isDisposed(){return this._isDisposed}update(t){if(this._isDisposed||!this._twinkle||!this._originalSizes)return;this._time+=t*this._twinkleSpeed;const e=this._geometry.attributes.size,i=e.array;for(let s=0;s<this._count;s++){const a=s*.01,n=.7+.3*Math.sin(this._time+a);i[s]=this._originalSizes[s]*n}e.needsUpdate=!0}setColor(t){this._isDisposed||(this._material.color=new l(t))}setOpacity(t){this._isDisposed||(this._material.opacity=_(t,0,1))}setSize(t){this._isDisposed||(this._material.size=t)}setTwinkle(t){if(this._twinkle=t,t&&!this._originalSizes){const e=this._geometry.attributes.size;this._originalSizes=new Float32Array(e.array)}}show(){this._mesh.visible=!0}hide(){this._mesh.visible=!1}toggle(){return this._mesh.visible=!this._mesh.visible,this._mesh.visible}dispose(){this._isDisposed||(this._geometry.dispose(),this._material.dispose(),this._sunCoreMesh&&(this._sunCoreMesh.geometry.dispose(),this._sunCoreMesh.material.dispose()),this._sunGlowMesh&&(this._sunGlowMesh.geometry.dispose(),this._sunGlowMesh.material.dispose()),this._sunRaysMesh&&(this._sunRaysMesh.geometry.dispose(),this._sunRaysMesh.material.dispose()),this._isDisposed=!0)}get sunGroup(){return this._sunGroup}}class De{_mesh;_geometry;_material;_particles=[];_maxParticles;_pollutionLevel=0;_earthRadius;_spawnTimer=0;_activeCount=0;_isDisposed=!1;constructor(t={}){this._maxParticles=t.maxParticles??500,this._pollutionLevel=t.pollutionLevel??0,this._earthRadius=t.earthRadius??M.radius;const e=t.color??g.effects.smoke;for(let n=0;n<this._maxParticles;n++)this._particles.push({position:new u,velocity:new u,life:0,maxLife:0,size:0,opacity:0});const i=new Float32Array(this._maxParticles*3),s=new Float32Array(this._maxParticles),a=new Float32Array(this._maxParticles);this._geometry=new mt,this._geometry.setAttribute("position",new R(i,3)),this._geometry.setAttribute("size",new R(s,1)),this._geometry.setAttribute("opacity",new R(a,1)),this._material=new _t({color:new l(e),size:.1,sizeAttenuation:!0,transparent:!0,opacity:.5,blending:dt,depthWrite:!1}),this._mesh=new gt(this._geometry,this._material),this._mesh.name="smoke-system",this._mesh.frustumCulled=!1}get mesh(){return this._mesh}get activeCount(){return this._activeCount}get pollutionLevel(){return this._pollutionLevel}get isDisposed(){return this._isDisposed}update(t){this._isDisposed||(this.spawnParticles(t),this.updateParticles(t),this.updateGeometry())}setPollutionLevel(t){if(this._isDisposed)return;this._pollutionLevel=_(t,0,100);const e=new l(g.effects.smoke),i=new l(g.effects.smokeDense),s=this._pollutionLevel/100;this._material.color.lerpColors(e,i,s);const a=c(.3,.8,s);this._material.opacity=a;const n=Math.max(0,(this._pollutionLevel-80)/20),r=c(.1,.25,n);this._material.size=r}setColor(t){this._isDisposed||(this._material.color=new l(t))}show(){this._mesh.visible=!0}hide(){this._mesh.visible=!1}clear(){for(const t of this._particles)t.life=0;this._activeCount=0,this.updateGeometry()}dispose(){this._isDisposed||(this._geometry.dispose(),this._material.dispose(),this._isDisposed=!0)}spawnParticles(t){if(this._pollutionLevel<30)return;let e;if(this._pollutionLevel<=80){const s=(this._pollutionLevel-30)/50;e=c(5,30,s)}else{const s=(this._pollutionLevel-80)/20;e=30+Math.pow(s,2)*120}this._spawnTimer+=t;const i=1/e;for(;this._spawnTimer>=i;)this._spawnTimer-=i,this.spawnParticle()}spawnParticle(){const t=this._particles.find(r=>r.life<=0);if(!t)return;const e=Math.random()*Math.PI*2,i=Math.acos(2*Math.random()-1),s=this._earthRadius*1.05;t.position.set(s*Math.sin(i)*Math.cos(e),s*Math.sin(i)*Math.sin(e),s*Math.cos(i));const a=t.position.clone().normalize(),n=new u(0,1,0);t.velocity.copy(a).multiplyScalar(.2).add(n.multiplyScalar(.1+Math.random()*.1)),t.velocity.x+=(Math.random()-.5)*.1,t.velocity.y+=(Math.random()-.5)*.1,t.velocity.z+=(Math.random()-.5)*.1,t.maxLife=2+Math.random()*2,t.life=t.maxLife,t.size=.05+Math.random()*.1,t.opacity=.3+Math.random()*.3,this._activeCount++}updateParticles(t){this._activeCount=0;for(const e of this._particles){if(e.life<=0||(e.life-=t,e.life<=0))continue;this._activeCount++,e.position.add(e.velocity.clone().multiplyScalar(t)),e.velocity.multiplyScalar(.99),e.size*=1.01;const i=e.life/e.maxLife;e.opacity=c(0,.5,i)}}updateGeometry(){const t=this._geometry.attributes.position,e=t.array;for(let i=0;i<this._particles.length;i++){const s=this._particles[i];s.life>0?(e[i*3]=s.position.x,e[i*3+1]=s.position.y,e[i*3+2]=s.position.z):(e[i*3]=0,e[i*3+1]=-1e3,e[i*3+2]=0)}t.needsUpdate=!0}}class Se{_group;_meshes;_particles=[];_maxParticles;_pollutionLevel=0;_earthRadius;_orbitHeight;_spawnTimer=0;_activeCount=0;_dummy;_isDisposed=!1;constructor(t={}){this._maxParticles=t.maxParticles??200,this._pollutionLevel=t.pollutionLevel??0,this._earthRadius=t.earthRadius??M.radius,this._orbitHeight=t.orbitHeight??.2,this._group=new q,this._group.name="trash-system",this._dummy=new zt;for(let e=0;e<this._maxParticles;e++)this._particles.push({position:new u,velocity:new u,rotation:new Nt,rotationSpeed:new u,scale:1,active:!1});this._meshes=this.createTrashMeshes(),this.updateGeometry()}get mesh(){return this._group}get activeCount(){return this._activeCount}get pollutionLevel(){return this._pollutionLevel}get isDisposed(){return this._isDisposed}update(t){this._isDisposed||(this.spawnParticles(t),this.updateParticles(t),this.updateGeometry())}setPollutionLevel(t){this._isDisposed||(this._pollutionLevel=_(t,0,100),this._pollutionLevel<60&&this.reduceParticles())}show(){this._group.visible=!0}hide(){this._group.visible=!1}clear(){for(const t of this._particles)t.active=!1;this._activeCount=0,this.updateGeometry()}dispose(){if(!this._isDisposed){for(const t of this._meshes)t.geometry.dispose(),t.material instanceof Ft&&t.material.dispose();this._isDisposed=!0}}createTrashMeshes(){const t=[],e=new Ht(.02,.04,.02),i=new B({color:g.effects.plasticTrash,roughness:.8}),s=new nt(e,i,Math.floor(this._maxParticles/2));s.name="trash-boxes",t.push(s),this._group.add(s);const a=new jt(.015,0),n=new B({color:g.effects.metalTrash,roughness:.6}),r=new nt(a,n,Math.floor(this._maxParticles/2));return r.name="trash-spheres",t.push(r),this._group.add(r),t}spawnParticles(t){if(this._pollutionLevel<40)return;let e;if(this._pollutionLevel<=80){const s=(this._pollutionLevel-40)/40;e=c(2,15,s)}else{const s=(this._pollutionLevel-80)/20;e=15+Math.pow(s,1.8)*45}this._spawnTimer+=t;const i=1/e;for(;this._spawnTimer>=i;)this._spawnTimer-=i,this.spawnParticle()}spawnParticle(){const t=this._particles.find(F=>!F.active);if(!t)return;const e=Math.random()*Math.PI*2,i=Math.acos(2*Math.random()-1),s=Math.max(0,(this._pollutionLevel-80)/20),a=c(.3,.8,s),n=this._earthRadius+this._orbitHeight+Math.random()*a;t.position.set(n*Math.sin(i)*Math.cos(e),n*Math.sin(i)*Math.sin(e),n*Math.cos(i));const r=t.position.clone().normalize(),m=new u().crossVectors(r,new u(0,1,0)).normalize();m.length()<.01&&m.crossVectors(r,new u(1,0,0)).normalize();const L=c(.05,.12,s)+Math.random()*.05;t.velocity.copy(m).multiplyScalar(L);const w=c(.02,.06,s);t.velocity.add(r.multiplyScalar(-w+Math.random()*w*2)),t.rotation.set(Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2);const A=c(2,4,s);t.rotationSpeed.set((Math.random()-.5)*A,(Math.random()-.5)*A,(Math.random()-.5)*A);const et=c(.5,.8,s),C=c(1.5,2.5,s);t.scale=et+Math.random()*C,t.active=!0,this._activeCount++}updateParticles(t){this._activeCount=0;for(const e of this._particles){if(!e.active)continue;this._activeCount++,e.position.add(e.velocity.clone().multiplyScalar(t)),e.rotation.x+=e.rotationSpeed.x*t,e.rotation.y+=e.rotationSpeed.y*t,e.rotation.z+=e.rotationSpeed.z*t;const i=e.position.length();(i>this._earthRadius*2||i<this._earthRadius*.9)&&(e.active=!1)}}reduceParticles(){const t=this._pollutionLevel/60,e=Math.floor(c(0,this._maxParticles*.3,t));let i=this._activeCount-e;for(const s of this._particles){if(i<=0)break;s.active&&(s.active=!1,i--)}}updateGeometry(){const t=Math.floor(this._maxParticles/2);let e=0,i=0;for(let s=0;s<this._particles.length;s++){const a=this._particles[s],n=s<t?0:1,r=this._meshes[n],m=n===0?e++:i++;a.active?(this._dummy.position.copy(a.position),this._dummy.rotation.copy(a.rotation),this._dummy.scale.setScalar(a.scale)):(this._dummy.position.set(0,-1e3,0),this._dummy.scale.setScalar(0)),this._dummy.updateMatrix(),r.setMatrixAt(m,this._dummy.matrix)}for(const s of this._meshes)s.instanceMatrix.needsUpdate=!0}}class Pe{_container;_sliderContainer;_slider;_label=null;_value;_min;_max;_onChange;_labelFormatter;_isDisposed=!1;constructor(t={}){this._container=this.resolveContainer(t.container),this._min=t.min??0,this._max=t.max??100,this._value=t.initialValue??0,this._onChange=t.onChange??null,this._labelFormatter=t.labelFormatter??(e=>`${Math.round(e)}%`),this._sliderContainer=this.createSliderContainer(),this._slider=this.createSlider(t.step??1),t.showLabel!==!1&&(this._label=this.createLabel()),this._sliderContainer.appendChild(this._slider),this._label&&this._sliderContainer.appendChild(this._label),this._container.appendChild(this._sliderContainer),this.setValue(this._value),this.bindEvents()}get value(){return this._value}get element(){return this._sliderContainer}get isDisposed(){return this._isDisposed}setValue(t,e=!0){this._isDisposed||(this._value=_(t,this._min,this._max),this._slider.value=String(this._value),this._label&&(this._label.textContent=this._labelFormatter(this._value)),this.updateSliderGradient(),e&&this._onChange&&this._onChange(this._value))}setOnChange(t){this._onChange=t}enable(){this._isDisposed||(this._slider.disabled=!1,this._sliderContainer.style.opacity="1",this._sliderContainer.style.pointerEvents="auto")}disable(){this._isDisposed||(this._slider.disabled=!0,this._sliderContainer.style.opacity="0.5",this._sliderContainer.style.pointerEvents="none")}show(){this._isDisposed||(this._sliderContainer.style.display="flex")}hide(){this._isDisposed||(this._sliderContainer.style.display="none")}dispose(){this._isDisposed||(this._slider.removeEventListener("input",this.handleInput),this._sliderContainer.parentNode&&this._sliderContainer.parentNode.removeChild(this._sliderContainer),this._isDisposed=!0)}resolveContainer(t){if(!t)return document.body;if(typeof t=="string"){const e=document.querySelector(t);return e||(console.warn(`Container not found: ${t}, using body`),document.body)}return t}createSliderContainer(){const t=document.createElement("div");return t.className="pollution-slider-container",t.style.cssText=`
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 20px 30px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 100;
      font-family: 'Segoe UI', system-ui, sans-serif;
    `,t}createSlider(t){const e=document.createElement("input");return e.type="range",e.min=String(this._min),e.max=String(this._max),e.step=String(t),e.value=String(this._value),e.className="pollution-slider",e.setAttribute("aria-label","Mức độ ô nhiễm"),e.style.cssText=`
      width: 300px;
      height: 8px;
      border-radius: 4px;
      outline: none;
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
    `,this.addSliderStyles(),e}createLabel(){const t=document.createElement("div");t.style.cssText=`
      display: flex;
      justify-content: space-between;
      width: 100%;
      color: white;
      font-size: 14px;
    `;const e=document.createElement("span");e.textContent="Mức ô nhiễm:",e.style.opacity="0.8";const i=document.createElement("span");return i.className="pollution-value",i.textContent=this._labelFormatter(this._value),i.style.fontWeight="bold",t.appendChild(e),t.appendChild(i),t.querySelector(".pollution-value")}addSliderStyles(){const t="pollution-slider-styles";if(document.getElementById(t))return;const e=document.createElement("style");e.id=t,e.textContent=`
      .pollution-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.8);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      
      .pollution-slider::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }
      
      .pollution-slider::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.8);
      }
      
      .pollution-slider::-webkit-slider-runnable-track {
        height: 8px;
        border-radius: 4px;
      }
      
      .pollution-slider::-moz-range-track {
        height: 8px;
        border-radius: 4px;
      }
    `,document.head.appendChild(e)}updateSliderGradient(){const t=(this._value-this._min)/(this._max-this._min)*100,e=g.earth.clean,i=g.earth.polluted;this._slider.style.background=`
      linear-gradient(90deg, 
        ${e} 0%, 
        ${i} 100%
      )
    `,this._slider.style.background=`
      linear-gradient(90deg, 
        ${e} 0%, 
        ${i} ${t}%,
        rgba(255, 255, 255, 0.2) ${t}%,
        rgba(255, 255, 255, 0.2) 100%
      )
    `}bindEvents(){this.handleInput=this.handleInput.bind(this),this._slider.addEventListener("input",this.handleInput)}handleInput=()=>{const t=parseFloat(this._slider.value);this.setValue(t,!0)}}const d={CLEAN:"clean",LIGHT:"light",MODERATE:"moderate",SEVERE:"severe"},U={[d.CLEAN]:{min:0,max:20,label:"clean",description:"Trái Đất trong lành, không khí sạch",color:g.ui.success},[d.LIGHT]:{min:21,max:50,label:"light",description:"Bắt đầu xuất hiện ô nhiễm nhẹ",color:g.ui.accent},[d.MODERATE]:{min:51,max:80,label:"moderate",description:"Ô nhiễm trung bình, cần hành động",color:g.ui.warning},[d.SEVERE]:{min:81,max:100,label:"severe",description:"Ô nhiễm nghiêm trọng, nguy hiểm",color:g.ui.error}},Ee={[d.CLEAN]:{showSmoke:!1,trashDensity:0,oceanOpacity:1,showForests:!0},[d.LIGHT]:{showSmoke:!1,trashDensity:10,oceanOpacity:.9,showForests:!0},[d.MODERATE]:{showSmoke:!0,trashDensity:40,oceanOpacity:.7,showForests:!0},[d.SEVERE]:{showSmoke:!0,trashDensity:80,oceanOpacity:.4,showForests:!1}};function N(o){const t=Math.max(0,Math.min(100,o));for(const[e,i]of Object.entries(U))if(t>=i.min&&t<=i.max)return e;return d.CLEAN}function Te(o){return U[o]}function yt(o){return Math.max(0,Math.min(100,o))/100}function Re(o){const t=N(o);return U[t].description}class ke{_container;_panel;_titleElement=null;_levelElement;_messageElement;_effectsElement;_value=0;_isDisposed=!1;constructor(t={}){this._container=this.resolveContainer(t.container),this._panel=this.createPanel(t.position??"top-right"),t.showTitle!==!1&&(this._titleElement=this.createTitle(),this._panel.appendChild(this._titleElement)),this._levelElement=this.createLevelDisplay(),this._messageElement=this.createMessageDisplay(),this._effectsElement=this.createEffectsDisplay(),this._panel.appendChild(this._levelElement),this._panel.appendChild(this._messageElement),this._panel.appendChild(this._effectsElement),this._container.appendChild(this._panel),this.update(t.initialValue??0)}get element(){return this._panel}get value(){return this._value}get isDisposed(){return this._isDisposed}update(t){if(this._isDisposed)return;this._value=_(t,0,100);const e=this.getPollutionInfo(this._value);this.updateLevelDisplay(e),this.updateMessageDisplay(e),this.updateEffectsDisplay(e),this._panel.style.borderColor=e.color}show(){this._isDisposed||(this._panel.style.opacity="1",this._panel.style.transform="translateY(0)")}hide(){this._isDisposed||(this._panel.style.opacity="0",this._panel.style.transform="translateY(-20px)")}dispose(){this._isDisposed||(this._panel.parentNode&&this._panel.parentNode.removeChild(this._panel),this._isDisposed=!0)}resolveContainer(t){if(!t)return document.body;if(typeof t=="string"){const e=document.querySelector(t);return e||(console.warn(`Container not found: ${t}, using body`),document.body)}return t}createPanel(t){const e=document.createElement("div");e.className="info-panel";let i="";switch(t){case"top-left":i="top: 20px; left: 20px;";break;case"top-right":i="top: 20px; right: 20px;";break;case"bottom-left":i="bottom: 100px; left: 20px;";break;case"bottom-right":i="bottom: 100px; right: 20px;";break}return e.style.cssText=`
      position: fixed;
      ${i}
      min-width: 280px;
      max-width: 320px;
      padding: 20px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      color: white;
      font-family: 'Segoe UI', system-ui, sans-serif;
      z-index: 100;
      transition: all 0.3s ease;
    `,e}createTitle(){const t=document.createElement("h3");return t.textContent="Trạng thái Trái Đất",t.style.cssText=`
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
    `,t}createLevelDisplay(){const t=document.createElement("div");t.className="level-display",t.style.cssText=`
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 12px;
    `;const e=document.createElement("span");e.textContent="Ô nhiễm:",e.style.opacity="0.7";const i=document.createElement("span");i.className="level-value",i.style.cssText=`
      font-size: 32px;
      font-weight: bold;
    `;const s=document.createElement("span");return s.className="level-badge",s.style.cssText=`
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    `,t.appendChild(e),t.appendChild(i),t.appendChild(s),t}createMessageDisplay(){const t=document.createElement("p");return t.className="message-display",t.style.cssText=`
      margin: 0 0 16px 0;
      font-size: 14px;
      line-height: 1.5;
      opacity: 0.9;
    `,t}createEffectsDisplay(){const t=document.createElement("div");t.className="effects-display";const e=document.createElement("h4");e.textContent="Tác động:",e.style.cssText=`
      margin: 0 0 8px 0;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.7;
    `;const i=document.createElement("ul");return i.className="effects-list",i.style.cssText=`
      margin: 0;
      padding-left: 20px;
      font-size: 13px;
      line-height: 1.6;
      opacity: 0.85;
    `,t.appendChild(e),t.appendChild(i),t}getPollutionInfo(t){const e=N(t),i=Re(t),s=this.getEffectsForLevel(e,t),a=this.getColorForLevel(e);return{level:e,percentage:t,message:i,effects:s,color:a}}getEffectsForLevel(t,e){const i=[];switch(t){case d.CLEAN:i.push("Không khí trong lành"),i.push("Hệ sinh thái cân bằng"),i.push("Nước sạch, an toàn");break;case d.LIGHT:i.push("Chất lượng không khí tốt"),i.push("Một số khu vực bắt đầu ô nhiễm nhẹ");break;case d.MODERATE:i.push("Ô nhiễm không khí nhẹ"),i.push("Một số loài bị ảnh hưởng"),i.push("Cần giảm khí thải");break;case d.SEVERE:i.push("⚠️ MỨC NGUY HIỂM"),i.push("Ô nhiễm không khí nghiêm trọng"),i.push("Nhiều loài bị đe dọa"),i.push("Sức khỏe con người bị ảnh hưởng"),i.push("Cần hành động ngay!");break}return e>50&&i.push("🏭 Khói công nghiệp phát sinh"),e>60&&i.push("🗑️ Rác thải tràn ngập"),e>70&&i.push("🌊 Đại dương bị ô nhiễm"),i}getColorForLevel(t){return U[t].color}updateLevelDisplay(t){const e=this._levelElement.querySelector(".level-value"),i=this._levelElement.querySelector(".level-badge");e&&(e.textContent=`${Math.round(t.percentage)}%`,e.style.color=t.color),i&&(i.textContent=this.getLevelText(t.level),i.style.background=t.color,i.style.color=t.level===d.CLEAN||t.level===d.LIGHT?"black":"white")}getLevelText(t){switch(t){case d.CLEAN:return"Trong lành";case d.LIGHT:return"Nhẹ";case d.MODERATE:return"Trung bình";case d.SEVERE:return"Nghiêm trọng";default:return"N/A"}}updateMessageDisplay(t){this._messageElement.textContent=t.message}updateEffectsDisplay(t){const e=this._effectsElement.querySelector(".effects-list");if(e){e.innerHTML="";for(const i of t.effects){const s=document.createElement("li");s.textContent=i,e.appendChild(s)}}}}class Ae{_overlay;_isDisposed=!1;_onStart;constructor(t={}){this._onStart=t.onStart??null,this._overlay=document.createElement("div"),this._overlay.className="simple-overlay",this._overlay.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(ellipse at center bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 60px 20px;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;const e=document.createElement("div");e.style.cssText=`
      text-align: center;
      opacity: 0;
      transform: translateY(-30px);
    `;const i=document.createElement("h1");i.textContent=t.title||"TRÁI ĐẤT XANH",i.style.cssText=`
      font-size: clamp(36px, 10vw, 72px);
      font-weight: 800;
      margin: 0 0 16px 0;
      color: #ffffff;
      letter-spacing: 4px;
      text-transform: uppercase;
      text-shadow: 0 0 40px rgba(0, 200, 255, 0.5), 0 4px 20px rgba(0,0,0,0.5);
    `,e.appendChild(i);const s=document.createElement("p");s.textContent=t.subtitle||"Hai Tương Lai",s.style.cssText=`
      font-size: clamp(16px, 4vw, 28px);
      margin: 0;
      color: #b0e0ff;
      font-weight: 300;
      letter-spacing: 2px;
      font-style: italic;
    `,e.appendChild(s),this._overlay.appendChild(e);const a=document.createElement("div");a.style.flex="1",this._overlay.appendChild(a);const n=document.createElement("div");n.style.cssText=`
      opacity: 0;
      transform: translateY(30px);
    `;const r=document.createElement("button");r.textContent=t.buttonText||"Khám Phá",r.style.cssText=`
      padding: 18px 60px;
      font-size: clamp(16px, 3vw, 20px);
      font-weight: 600;
      border: 2px solid #00c8ff;
      background: rgba(0, 200, 255, 0.15);
      color: #00c8ff;
      border-radius: 50px;
      cursor: pointer;
      letter-spacing: 2px;
      text-transform: uppercase;
      box-shadow: 0 0 30px rgba(0, 200, 255, 0.3);
      transition: all 0.3s ease;
    `,r.addEventListener("mouseenter",()=>{r.style.background="rgba(0, 200, 255, 0.25)",r.style.boxShadow="0 0 50px rgba(0, 200, 255, 0.5)",r.style.transform="scale(1.05)"}),r.addEventListener("mouseleave",()=>{r.style.background="rgba(0, 200, 255, 0.15)",r.style.boxShadow="0 0 30px rgba(0, 200, 255, 0.3)",r.style.transform="scale(1)"}),r.addEventListener("click",()=>this.startExploration()),n.appendChild(r),this._overlay.appendChild(n),document.body.appendChild(this._overlay),G.to(e,{opacity:1,y:0,duration:1.2,ease:"power3.out",delay:.3}),G.to(n,{opacity:1,y:0,duration:1.2,ease:"power3.out",delay:.6})}startExploration(){this._isDisposed||(this._onStart&&this._onStart(),G.to(this._overlay,{opacity:0,duration:1.5,ease:"power2.inOut",onComplete:()=>this.dispose()}))}show(){this._isDisposed||(this._overlay.style.display="flex")}hide(){this._isDisposed||(this._overlay.style.display="none")}dispose(){this._isDisposed||(this._isDisposed=!0,this._overlay.remove())}}class Ie{_cameraManager;_earthGroup;_timeline=null;_duration;_endDistance;_onComplete;_onUpdate;_isPlaying=!1;_isCompleted=!1;_isDisposed=!1;constructor(t){this._cameraManager=t.cameraManager,this._earthGroup=t.earthGroup??null,this._duration=t.duration??3,this._endDistance=t.endDistance??this._cameraManager.position.z,this._onComplete=t.onComplete??null,this._onUpdate=t.onUpdate??null}get isPlaying(){return this._isPlaying}get isCompleted(){return this._isCompleted}get isDisposed(){return this._isDisposed}get progress(){return this._timeline?this._timeline.progress():0}play(){return this._isDisposed||this._isPlaying||this._isCompleted?Promise.resolve():new Promise(t=>{this._isPlaying=!0,this._timeline=G.timeline({onComplete:()=>{this._isPlaying=!1,this._isCompleted=!0,this._cameraManager.setTarget(0,0,0),this._cameraManager.enableControls(),this._onComplete&&this._onComplete(),t()},onUpdate:()=>{this._onUpdate&&this._timeline&&this._onUpdate(this._timeline.progress())}}),this._cameraManager.disableControls();const e=this._cameraManager.camera;this._timeline.to(e.position,{x:0,y:0,z:this._endDistance,duration:this._duration,ease:"power2.inOut"}),this._earthGroup&&this._timeline.to(this._earthGroup.scale,{x:1,y:1,z:1,duration:this._duration,ease:"power2.inOut"},0)})}skip(){this._isDisposed||this._isCompleted||(this._timeline&&(this._timeline.kill(),this._timeline=null),this._cameraManager.setPosition(0,0,this._endDistance),this._cameraManager.enableControls(),this._isPlaying=!1,this._isCompleted=!0,this._onComplete&&this._onComplete())}pause(){this._timeline&&this._isPlaying&&this._timeline.pause()}resume(){this._timeline&&this._isPlaying&&this._timeline.resume()}reset(){this._isDisposed||(this._timeline&&(this._timeline.kill(),this._timeline=null),this._isPlaying=!1,this._isCompleted=!1,this._cameraManager.setPosition(0,-1,4),this._cameraManager.setTarget(0,0,0),this._cameraManager.disableControls())}setOnComplete(t){this._onComplete=t}setOnUpdate(t){this._onUpdate=t}dispose(){this._isDisposed||(this._timeline&&(this._timeline.kill(),this._timeline=null),this._isDisposed=!0)}}function Oe(o){const t=N(o),e=Te(t),i=Ee[t];return{level:t,value:o,normalizedValue:yt(o),label:e.label,description:e.description,range:{min:e.min,max:e.max},effects:{showSmoke:i.showSmoke,trashDensity:i.trashDensity,oceanOpacity:i.oceanOpacity,showForests:i.showForests}}}function ze(o,t){const e=N(o),i=N(t);return e!==i}function Ne(o){return yt(o)}function Fe(o){const t=[];return typeof o!="number"||isNaN(o)?(t.push("Value is not a number"),{valid:!1,value:NaN,errors:t}):(o<0&&t.push("Value is below minimum (0)"),o>100&&t.push("Value exceeds maximum (100)"),isFinite(o)||t.push("Value must be finite"),{valid:t.length===0,value:o,errors:t})}class tt{_pollutionLevel=0;_rotation=0;_scale=1;_listeners=new Set;_pollutionHistory=[];MAX_HISTORY_SIZE=100;constructor(t=0){this.setPollution(t,{silent:!0})}getPollutionLevel(){return this._pollutionLevel}getNormalizedPollution(){return this._pollutionLevel/100}getPollutionSeverity(){return Ne(this._pollutionLevel)}getPollutionInfo(){return Oe(this._pollutionLevel)}getPollutionHistory(){return[...this._pollutionHistory]}setPollution(t,e={}){const{silent:i=!1,skipValidator:s=!1}=e;if(!s){const r=Fe(t);if(!r.valid)throw new Error(`Invalid pollution value: ${r.errors.join(", ")}`)}const a=_(t,0,100);if(a===this._pollutionLevel)return;const n=this.getSnapshot();this._pollutionLevel=a,this._pollutionHistory.push(a),this._pollutionHistory.length>this.MAX_HISTORY_SIZE&&this._pollutionHistory.shift(),i||this.emitChange("pollution_changed",n)}incrementPollution(t){const e=this._pollutionLevel+t;return this.setPollution(e),this._pollutionLevel}resetPollution(){this.setPollution(0)}getRotation(){return this._rotation}setRotation(t,e={}){const{silent:i=!1}=e;if(t===this._rotation)return;const s=this.getSnapshot();this._rotation=t,i||this.emitChange("rotation_changed",s)}incrementRotation(t){return this.setRotation(this._rotation+t),this._rotation}resetRotation(){this.setRotation(0)}getScale(){return this._scale}setScale(t,e={}){const{silent:i=!1}=e;if(t<=0)throw new Error("Scale must be greater than 0");if(t===this._scale)return;const s=this.getSnapshot();this._scale=t,i||this.emitChange("scale_changed",s)}resetScale(){this.setScale(1)}getSnapshot(){return Object.freeze({pollutionLevel:this._pollutionLevel,rotation:this._rotation,scale:this._scale})}restoreSnapshot(t,e={}){const{silent:i=!1}=e,s=this.getSnapshot();this._pollutionLevel=_(t.pollutionLevel,0,100),this._rotation=t.rotation,this._scale=t.scale,i||this.emitChange("state_reset",s)}addListener(t){return this._listeners.add(t),()=>{this._listeners.delete(t)}}removeListener(t){this._listeners.delete(t)}removeAllListeners(){this._listeners.clear()}emitChange(t,e){const i={type:t,oldState:e,newState:this.getSnapshot(),timestamp:Date.now()};this._listeners.forEach(s=>{try{s(i)}catch(a){console.error("Error in state change listener:",a)}})}hasPollutionLevelChanged(){if(this._pollutionHistory.length<2)return!1;const t=this._pollutionHistory[this._pollutionHistory.length-1],e=this._pollutionHistory[this._pollutionHistory.length-2];return ze(e,t)}toJSON(){return JSON.stringify({pollutionLevel:this._pollutionLevel,rotation:this._rotation,scale:this._scale,history:this._pollutionHistory,timestamp:Date.now()})}fromJSON(t,e={}){try{const i=JSON.parse(t);this.restoreSnapshot({pollutionLevel:i.pollutionLevel??0,rotation:i.rotation??0,scale:i.scale??1},e),Array.isArray(i.history)&&(this._pollutionHistory=i.history)}catch(i){throw new Error(`Failed to parse state JSON: ${i}`)}}clone(){const t=new tt(this._pollutionLevel);return t._rotation=this._rotation,t._scale=this._scale,t._pollutionHistory=[...this._pollutionHistory],t}toString(){const t=this.getPollutionInfo();return`EarthState { pollution: ${this._pollutionLevel}% (${t.label}), rotation: ${this._rotation.toFixed(2)}, scale: ${this._scale.toFixed(2)} }`}}class He{renderer;sceneManager;cameraManager;animationLoop;earth;starfield;smokeSystem;trashSystem;slider;infoPanel;introOverlay;introController;earthState;_cameraCentered=!1;async init(){try{this.setupContainer(),this.initCore(),await this.initEarth(),this.initEffects(),this.initState(),this.initUI(),this.setupEventHandlers(),this.animationLoop.start(),console.log("🌍 Trái Đất Xanh initialized successfully!")}catch(t){console.error("Failed to initialize application:",t),this.showError("Không thể khởi tạo ứng dụng. Vui lòng tải lại trang.")}}setupContainer(){const t=document.querySelector("#app");if(!t)throw new Error("App container not found");t.innerHTML="",t.style.cssText=`
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
    `}initCore(){this.renderer=new Gt({container:"#app"}),this.sceneManager=new Vt({backgroundColor:0});const t=new ut(16755268,.4,150);t.position.set(40,25,60),this.sceneManager.scene.add(t),this.cameraManager=new ne({domElement:this.renderer.domElement}),this.animationLoop=new re}async initEarth(){this.earth=new Ce({pollutionLevel:0,enableClouds:!0,enableAtmosphere:!0,autoRotate:!0}),this.sceneManager.add(this.earth.group,"earth"),this.earth.loadTextures(t=>{console.log(`Loading textures: ${t.percentage}%`)}).catch(t=>{console.warn("Some textures failed to load:",t)})}initEffects(){this.starfield=new xe({count:5e3,twinkle:!0}),this.sceneManager.add(this.starfield.mesh,"starfield"),this.smokeSystem=new De({pollutionLevel:0}),this.sceneManager.add(this.smokeSystem.mesh,"smoke"),this.trashSystem=new Se({pollutionLevel:0}),this.sceneManager.add(this.trashSystem.mesh,"trash")}initState(){this.earthState=new tt,this.earthState.addListener(t=>{this.onPollutionChange(t.newState.pollutionLevel)})}initUI(){this.introOverlay=new Ae({title:"TRÁI ĐẤT XANH",subtitle:"Hai Tương Lai",buttonText:"Khám Phá",onStart:()=>this.startExperience()}),this.introController=new Ie({cameraManager:this.cameraManager,earthGroup:this.earth.group,duration:2.5,startDistance:4,endDistance:O.z,onComplete:()=>this.onIntroComplete()}),this.cameraManager.camera.position.set(0,-1,4),this.cameraManager.camera.lookAt(0,0,0),this.earth.group.scale.set(.3,.3,.3),this.slider=new Pe({initialValue:0,onChange:t=>{this.earthState.setPollution(t)}}),this.slider.disable(),this.slider.hide(),this.infoPanel=new ke({position:"top-right",initialValue:0}),this.infoPanel.hide()}setupEventHandlers(){this.animationLoop.add("main",t=>{this._cameraCentered||(this.centerCamera(),this._cameraCentered=!0),this.earth.update(t),this.starfield.update(t),this.smokeSystem.update(t),this.trashSystem.update(t),this.cameraManager.update(),this.renderer.render(this.sceneManager.scene,this.cameraManager.camera)}),window.addEventListener("resize",()=>{this.renderer.updateSize(),this.cameraManager.updateAspect(window.innerWidth/window.innerHeight)}),window.addEventListener("keydown",t=>{t.key==="Escape"&&this.introController.skip()})}centerCamera(){const t=O;this.cameraManager.setPosition(t.x,t.y,t.z),this.cameraManager.setTarget(0,0,0),this.earth.setPosition(0,0,0),console.log("🎥 Camera position:",this.cameraManager.camera.position),console.log("🎯 Camera target:",this.cameraManager.getTarget()),console.log("🌍 Earth position:",this.earth.group.position),console.log("📐 Canvas size:",this.renderer.size),console.log("📏 Aspect ratio:",this.cameraManager.camera.aspect)}startExperience(){this.introController.play()}onIntroComplete(){this.slider.show(),this.slider.enable(),this.infoPanel.show()}onPollutionChange(t){this.earth.setPollutionLevel(t),this.smokeSystem.setPollutionLevel(t),this.trashSystem.setPollutionLevel(t),this.infoPanel.update(t)}showError(t){const e=document.querySelector("#app");e&&(e.innerHTML=`
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #1a1a1a;
          color: white;
          font-family: system-ui, sans-serif;
          text-align: center;
          padding: 20px;
        ">
          <div>
            <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h1 style="margin: 0 0 10px 0;">Đã xảy ra lỗi</h1>
            <p style="opacity: 0.7;">${t}</p>
            <button onclick="location.reload()" style="
              margin-top: 20px;
              padding: 12px 24px;
              background: #4CAF50;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 16px;
            ">Tải lại</button>
          </div>
        </div>
      `)}dispose(){this.animationLoop.stop(),this.earth.dispose(),this.starfield.dispose(),this.smokeSystem.dispose(),this.trashSystem.dispose(),ye(),this.slider.dispose(),this.infoPanel.dispose(),this.introOverlay.dispose(),this.introController.dispose(),this.cameraManager.dispose(),this.sceneManager.dispose(),this.renderer.dispose(),console.log("🌍 Application disposed")}}console.log("🌍 Starting STEM Earth Green application...");const vt=new He;vt.init().catch(o=>{console.error("💥 Failed to initialize app:",o),document.body.innerHTML=`
    <div style="color: white; padding: 20px; background: red;">
      <h1>Error Loading Application</h1>
      <p>${o.message}</p>
      <p>Check console for details</p>
    </div>
  `});window.addEventListener("beforeunload",()=>{vt.dispose()});
