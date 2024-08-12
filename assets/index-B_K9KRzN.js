var A=Object.defineProperty;var D=(e,t,i)=>t in e?A(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var c=(e,t,i)=>(D(e,typeof t!="symbol"?t+"":t,i),i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function i(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=i(n);fetch(n.href,o)}})();async function O(e){const i=await(await fetch(e)).blob();return await createImageBitmap(i,{colorSpaceConversion:"none"})}async function R(e,t){let i=e;const r=[i];let n=0;for(;n<t&&(i.width>1||i.height>1);)i=await F(i),r.push(i),n++;return r}async function F(e){const t=Math.max(1,e.width/2|0),i=Math.max(1,e.height/2|0),r=document.createElement("canvas");r.width=t,r.height=i;const n=r.getContext("2d");if(!n)throw new Error("Unable to get 2D context");return n.drawImage(e,0,0,t,i),createImageBitmap(r)}const _=(e,t)=>Math.random()*(t-e)+e,L=Math.PI/180;function U(e){return e*L}var E=1e-6,g=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var e=0,t=arguments.length;t--;)e+=arguments[t]*arguments[t];return Math.sqrt(e)});function P(){var e=new g(16);return g!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function z(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Y(e,t,i){var r=Math.sin(i),n=Math.cos(i),o=t[4],a=t[5],s=t[6],u=t[7],h=t[8],p=t[9],v=t[10],d=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=o*n+h*r,e[5]=a*n+p*r,e[6]=s*n+v*r,e[7]=u*n+d*r,e[8]=h*n-o*r,e[9]=p*n-a*r,e[10]=v*n-s*r,e[11]=d*n-u*r,e}function j(e,t,i){var r=Math.sin(i),n=Math.cos(i),o=t[0],a=t[1],s=t[2],u=t[3],h=t[8],p=t[9],v=t[10],d=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=o*n-h*r,e[1]=a*n-p*r,e[2]=s*n-v*r,e[3]=u*n-d*r,e[8]=o*r+h*n,e[9]=a*r+p*n,e[10]=s*r+v*n,e[11]=u*r+d*n,e}function q(e,t,i,r,n){var o=1/Math.tan(t/2),a;return e[0]=o/i,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,n!=null&&n!==1/0?(a=1/(r-n),e[10]=(n+r)*a,e[14]=2*n*r*a):(e[10]=-1,e[14]=-2*r),e}var k=q;function H(e,t,i,r){var n,o,a,s,u,h,p,v,d,l,b=t[0],y=t[1],w=t[2],T=r[0],M=r[1],C=r[2],S=i[0],V=i[1],G=i[2];return Math.abs(b-S)<E&&Math.abs(y-V)<E&&Math.abs(w-G)<E?z(e):(p=b-S,v=y-V,d=w-G,l=1/Math.hypot(p,v,d),p*=l,v*=l,d*=l,n=M*d-C*v,o=C*p-T*d,a=T*v-M*p,l=Math.hypot(n,o,a),l?(l=1/l,n*=l,o*=l,a*=l):(n=0,o=0,a=0),s=v*a-d*o,u=d*n-p*a,h=p*o-v*n,l=Math.hypot(s,u,h),l?(l=1/l,s*=l,u*=l,h*=l):(s=0,u=0,h=0),e[0]=n,e[1]=s,e[2]=p,e[3]=0,e[4]=o,e[5]=u,e[6]=v,e[7]=0,e[8]=a,e[9]=h,e[10]=d,e[11]=0,e[12]=-(n*b+o*y+a*w),e[13]=-(s*b+u*y+h*w),e[14]=-(p*b+v*y+d*w),e[15]=1,e)}function x(){var e=new g(3);return g!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function f(e,t,i){var r=new g(3);return r[0]=e,r[1]=t,r[2]=i,r}function B(e,t,i){var r=t[0],n=t[1],o=t[2],a=i[3]*r+i[7]*n+i[11]*o+i[15];return a=a||1,e[0]=(i[0]*r+i[4]*n+i[8]*o+i[12])/a,e[1]=(i[1]*r+i[5]*n+i[9]*o+i[13])/a,e[2]=(i[2]*r+i[6]*n+i[10]*o+i[14])/a,e}(function(){var e=x();return function(t,i,r,n,o,a){var s,u;for(i||(i=3),r||(r=0),n?u=Math.min(n*i+r,t.length):u=t.length,s=r;s<u;s+=i)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],o(e,e,a),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2];return t}})();function W(){var e=new g(2);return g!=Float32Array&&(e[0]=0,e[1]=0),e}function m(e,t){var i=new g(2);return i[0]=e,i[1]=t,i}function X(e,t,i){return e[0]=t[0]+i[0],e[1]=t[1]+i[1],e}(function(){var e=W();return function(t,i,r,n,o,a){var s,u;for(i||(i=2),r||(r=0),n?u=Math.min(n*i+r,t.length):u=t.length,s=r;s<u;s+=i)e[0]=t[s],e[1]=t[s+1],o(e,e,a),t[s]=e[0],t[s+1]=e[1];return t}})();function $(){const e=[],t=[];return e.push({position:f(-1,1,-1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(-1,-1,-1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(1,1,-1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(1,-1,-1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(-1,1,1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(1,1,1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(-1,-1,1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(1,-1,1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),t.push(0,1,2,2,1,3,2,3,5,5,3,7,5,7,4,4,7,6,4,6,0,0,6,1,4,0,5,5,0,2,1,6,3,3,6,7),{vertices:e,indices:t}}var J=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) color: vec3f,
  @location(3) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) color: vec3f,
  @location(3) texCoord: vec2f,
  @location(4) radius: f32,
  @location(5) mass: f32,
};

struct MatrixUniforms {
  view: mat4x4f,
  projection: mat4x4f,
};

struct Camera {
  position: vec3f,
  up: vec3f
};

@group(0) @binding(0) var<storage, read_write> inputVertex: array<Vertex>;
@group(0) @binding(1) var<storage, read_write> outputVertex: array<Vertex>;
@group(0) @binding(2) var<uniform> camera: Camera;

@compute @workgroup_size(256)
fn computeSomething(
    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,
) {
    let startIndex = i32(global_invocation_id.x);

    var pos = array<vec2f, 6>(
        vec2(1.0, 1.0),
        vec2(-1.0, 1.0),
        vec2(-1.0, -1.0),
        vec2(1.0, 1.0),
        vec2(-1.0, -1.0),
        vec2(1.0, -1.0),
    );

    var tex = array<vec2f, 6>(
        vec2(1.0, 0.0),
        vec2(0.0, 0.0),
        vec2(0.0, 1.0),
        vec2(1.0, 0.0),
        vec2(0.0, 1.0),
        vec2(1.0, 1.0),
    );

    let input = inputVertex[startIndex];

    let up: vec3f = camera.up; 
    let front: vec3f = normalize(camera.position - input.position);
    let right: vec3f = cross(camera.up, front);

    for (var i = 0; i < 6; i++) {
        let newPos:vec3f = input.position + pos[i].x * right.xyz * input.radius + pos[i].y * up.xyz * input.radius;
        outputVertex[startIndex * 6 + i] = Vertex(newPos, input.velocity, input.color, tex[i], input.radius, input.mass);
    }
}`,K=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) color: vec3f,
  @location(3) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) color: vec3f,
  @location(3) texCoord: vec2f,
  @location(4) radius: f32,
  @location(5) mass: f32,
};

struct MatrixUniforms {
  view: mat4x4f,
  projection: mat4x4f,
};

@group(0) @binding(0) var<storage, read_write> objects: array<Vertex>;
@group(0) @binding(1) var<uniform> numOfObject: u32;
@group(0) @binding(2) var<uniform> delta: f32;

const MIN_DISTANCE: f32 = 0.0001;

@compute @workgroup_size(256) fn computeSomething(
    @builtin(global_invocation_id) global_invocation_id : vec3u,
) {
    let index = global_invocation_id.x;
    var body : Vertex = objects[index];
    var acceleration = vec3f(0.0, 0.0, 0.0);

    for (var i = 0u; i < numOfObject; i++) {
        if (i != index) {
            let other : Vertex = objects[i];
            let distance_vec = other.position - body.position;
            var distance = length(distance_vec);
            if (distance < MIN_DISTANCE) {
                distance = MIN_DISTANCE;
            }
            let force = (0.0006673 * body.mass * other.mass) / distance * distance;
            var direction = vec3(0.0, 0.0, 0.0);
            if (distance > MIN_DISTANCE) {
                direction = normalize(distance_vec);
            }
            acceleration += vec3(direction * force / body.mass);
        }
    }

    body.velocity += acceleration;
    body.position += body.velocity * delta;
    objects[index] = body;
}`,Q=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) color: vec3f,
  @location(3) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) color: vec3f,
  @location(3) texCoord: vec2f,
  @location(4) radius: f32,
  @location(5) mass: f32,
};

struct MatrixUniforms {
  view: mat4x4f,
  projection: mat4x4f,
};

@group(0) @binding(0) var<uniform> uni: MatrixUniforms;

@vertex fn vs(
  input: Vertex,
) -> VSOutput {

  var output: VSOutput;
  output.position = uni.projection * uni.view * vec4f(input.position, 1.0);
  output.texCoord = input.texCoord;
  output.color = input.color;
  return output;
}`,Z=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) color: vec3f,
  @location(3) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) color: vec3f,
  @location(3) texCoord: vec2f,
  @location(4) radius: f32,
  @location(5) mass: f32,
};

struct MatrixUniforms {
  view: mat4x4f,
  projection: mat4x4f,
};

struct FragUniforms {
  time:f32,
  width:f32,
  height:f32,
};

@group(0) @binding(1) var tex: texture_2d<f32>;
@group(0) @binding(2) var mySampler: sampler;
@group(0) @binding(3) var<uniform> timeUniform: f32;

fn snoise(uvInput:vec3f, res:f32) -> f32 {
	let s = vec3f(1e0, 1e2, 1e4);
	
	let uv:vec3f = uvInput * res;
	
  let uv0:vec3f = floor(uv % res) * s;
	let uv1:vec3f = floor(uv+vec3f(1.) % res)*s;
	
	var f:vec3f = fract(uv);
  f = f*f*(3.0-2.0*f);
	
	let v:vec4f = vec4f(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
		      	  uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);
	
	var r:vec4f = fract(sin(v*1e-3)*1e5);
	r = fract(sin((v + uv1.z - uv0.z)*1e-3)*1e5);
	
  let r0:f32 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	let r1:f32 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
	
	return mix(r0, r1, f.z)*2.-1.;
}

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {
  let freqs:vec4f = vec4f(
    textureSample(tex, mySampler, vec2f( 0.01, 0.25 )).x,
    textureSample(tex, mySampler, vec2f( 0.07, 0.25 )).x,
    textureSample(tex, mySampler, vec2f( 0.15, 0.25 )).x,
    textureSample(tex, mySampler, vec2f( 0.30, 0.25 )).x
  );
  let brightness:f32 = freqs[1] * 0.25 + freqs[2] * 0.25;
	let radius:f32 = 0.24 + brightness * 0.2;
	let invRadius:f32 = 1.0/radius;
	
	let time:f32 = timeUniform * 0.1;
	let uv:vec2f = input.texCoord;
	var p:vec2f = -0.5 + uv;

	let fade:f32 = pow( length( 2.0 * p ), 0.5 );
	var fVal1:f32 = 1.0 - fade;
	var fVal2:f32 = 1.0 - fade;
	
	let angle:f32 = atan2( p.x, p.y )/6.2832;
	let dist:f32 = length(p);
	let coord:vec3f	= vec3f( angle, dist, time * 0.1 );
	
	let newTime1:f32 = abs( snoise( coord + vec3f( 0.0, -time * ( 0.35 + brightness * 0.001 ), time * 0.015 ), 15.0 ) );
	let newTime2:f32 = abs( snoise( coord + vec3f( 0.0, -time * ( 0.15 + brightness * 0.001 ), time * 0.015 ), 45.0 ) );	
	for( var i=1; i<=7; i++ ){
		let power:f32 = pow( 2.0, f32(i + 1) );
		fVal1 += ( 0.5 / power ) * snoise( coord + vec3f( 0.0, -time, time * 0.2 ), ( power * ( 10.0 ) * ( newTime1 + 1.0 ) ) );
		fVal2 += ( 0.5 / power ) * snoise( coord + vec3f( 0.0, -time, time * 0.2 ), ( power * ( 25.0 ) * ( newTime2 + 1.0 ) ) );
	}
	
	var corona:f32 = pow( fVal1 * max( 1.1 - fade, 0.0 ), 2.0 ) * 50.0;
	corona += pow( fVal2 * max( 1.1 - fade, 0.0 ), 2.0 ) * 50.0;
	corona *= 1.2 - newTime1;
	let sphereNormal:vec3f = vec3f( 0.0, 0.0, 1.0 );
	let dir:vec3f = vec3f( 0.0 );
	let center:vec3f = vec3f( 0.5, 0.5, 1.0 );
	var starSphere:vec3f = vec3f( 0.0 );
	
	var sp:vec2f = -1.0 + 2.0 * uv;
	sp *= ( 2.0 - brightness );
  let r:f32 = dot(sp,sp);
	var f:f32 = (1.0-sqrt(abs(1.0-r)))/(r) + brightness * 0.5;
  if( dist >= radius){
    f = 0.0;
  }
	if( dist < radius ){
		corona *= pow( dist * invRadius, 24.0 );
  		var newUv:vec2f;
 		newUv.x = sp.x*f / 2 + 0.5;
  		newUv.y = sp.y*f / 2 + 0.5;

		let texSample:vec3f	= textureSampleLevel(tex, mySampler, newUv, 0).rgb;
		let uOff:f32 = ( texSample.g * brightness * 4.5);
		let starUV:vec2f = newUv + vec2f( uOff, 0.0 );
		starSphere = textureSampleLevel(tex, mySampler, starUV, 0).rgb;
	}
	
  let color = vec3f( f * ( 0.75 + brightness * 0.3 ) * input.color ) + starSphere + corona * input.color;
  if(color.x < 0.1 && color.y < 0.1 && color.z < 0.1) {
    discard;
  }

  return vec4f(color, 1.0);
}`,ee=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) color: vec3f,
  @location(3) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) color: vec3f,
  @location(3) texCoord: vec2f,
  @location(4) radius: f32,
  @location(5) mass: f32,
};

struct MatrixUniforms {
  view: mat4x4f,
  projection: mat4x4f,
};

@group(0) @binding(0) var<uniform> uni: MatrixUniforms;

@vertex fn vs(
  input: Vertex,
) -> VSOutput {
  let rotView: mat4x4<f32> = mat4x4<f32>(
    vec4f(uni.view[0].xyz, 0.0),
    vec4f(uni.view[1].xyz, 0.0), 
    vec4f(uni.view[2].xyz, 0.0),
    vec4f(0.0, 0.0, 0.0, 1.0)
  );
  let clipPos:vec4f = uni.projection * uni.view * vec4f(input.position * 20.0, 1.0);

  var output: VSOutput;
  output.posWorld = input.position;
  output.position = clipPos.xyww;
  return output;
}`,te=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) color: vec3f,
  @location(3) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) color: vec3f,
  @location(3) texCoord: vec2f,
  @location(4) radius: f32,
  @location(5) mass: f32,
};

struct MatrixUniforms {
  view: mat4x4f,
  projection: mat4x4f,
};

@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var envCubemap: texture_cube<f32>;

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {
  let envColor:vec3f = textureSample(envCubemap, mySampler, input.posWorld).rgb;
  
  return vec4f(envColor, 1.0);
}`;class ie{constructor({position:t,center:i,up:r}){c(this,"_position");c(this,"_center");c(this,"_up");c(this,"_rotate");c(this,"_isMobile");c(this,"_isDragging");c(this,"_initialX");c(this,"_initialY");this._position=t,this._center=i,this._up=r,this._rotate=m(0,0),this._isDragging=!1,this._initialX=0,this._initialY=0,this._isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.initializeEvent()}get position(){const t=this.getViewRotationMatrix(),i=x();return B(i,this._position,t),i}get up(){const t=this.getViewRotationMatrix(),i=x();return B(i,this._up,t),i}getViewMatrix(){const t=P(),i=this.getViewRotationMatrix(),r=x(),n=x(),o=x();return B(r,this._position,i),B(n,this._center,i),B(o,this._up,i),H(t,r,n,o),t}initializeEvent(){const t=this._isMobile?"touchstart":"mousedown",i=this._isMobile?"touchmove":"mousemove",r=this._isMobile?"touchend":"mouseup";document.addEventListener(t,n=>{this._isDragging=!0,this._initialX=this._isMobile?n.touches[0].clientX:n.clientX,this._initialY=this._isMobile?n.touches[0].clientY:n.clientY}),document.addEventListener(i,n=>{if(this._isDragging){const o=this._isMobile?n.touches[0].clientX:n.clientX,a=this._isMobile?n.touches[0].clientY:n.clientY,s=o-this._initialX,u=a-this._initialY;this._rotate=X(this._rotate,this._rotate,m(u/10,s/10)),this._initialX=o,this._initialY=a}}),document.addEventListener(r,()=>{this._isDragging=!1})}getViewRotationMatrix(){const t=P();return j(t,t,U(this._rotate[1])),Y(t,t,U(this._rotate[0])),t}}class ne{constructor(){c(this,"_device");c(this,"_canvasContext");c(this,"_mainPipeline");c(this,"_bgPipeline");c(this,"_computeMovementPipeline");c(this,"_computeBillboardPipeline");c(this,"_pointBuffer");c(this,"_billboardBuffer");c(this,"_skyboxVertexBuffer");c(this,"_skyboxIndexBuffer");c(this,"_skyboxIndicesLength");c(this,"_objectNumBuffer");c(this,"_matrixUniformBuffer");c(this,"_timeUniformBuffer");c(this,"_cameraUniformBuffer");c(this,"_deltaUniformBuffer");c(this,"_envCubemap");c(this,"_starTex");c(this,"_sampler");c(this,"_mainBindGroup");c(this,"_computeMovementBindGroup");c(this,"_computeBillboardBindGroup");c(this,"_bgBindGroup");c(this,"_camera");c(this,"_projection");c(this,"_commandEncoder");c(this,"NUM_OF_OBJECT");c(this,"WIDTH");c(this,"HEIGHT");this.NUM_OF_OBJECT=7,this.WIDTH=window.innerWidth,this.HEIGHT=window.innerHeight}async initialize(){await this.requestDevice(),await this.getCanvasContext(),await this.createPipelines(),await this.createVertexBuffers(),await this.createOtherBuffers(),await this.createTextures(),await this.createBindGroups(),await this.setMatrix()}async render(t,i){await this.writeBuffers(t,i),this._commandEncoder=this._device.createCommandEncoder({label:"encoder"}),await this.compute(),await this.draw();const r=this._commandEncoder.finish();this._device.queue.submit([r])}async createPipelines(){const t=[{arrayStride:16*Float32Array.BYTES_PER_ELEMENT,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:4*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:2,offset:8*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:3,offset:12*Float32Array.BYTES_PER_ELEMENT,format:"float32x2"},{shaderLocation:4,offset:14*Float32Array.BYTES_PER_ELEMENT,format:"float32"},{shaderLocation:5,offset:15*Float32Array.BYTES_PER_ELEMENT,format:"float32"}]}];this._mainPipeline=await this.createRenderPipeline({label:"main pipeline",vertexShader:Q,fragmentShader:Z,vertexBufferLayout:t}),this._bgPipeline=await this.createRenderPipeline({label:"bg pipeline",vertexShader:ee,fragmentShader:te,vertexBufferLayout:t}),this._computeMovementPipeline=await this.createComputePipeline({label:"movement compute pipeline",computeShader:K}),this._computeBillboardPipeline=await this.createComputePipeline({label:"billboard compute pipeline",computeShader:J})}async createVertexBuffers(){const t=[];t.push({position:f(0,0,2),velocity:f(0,0,0),color:f(.8,.2,.2),texCoord:m(0,0),radius:.3,mass:.03});for(let a=0;a<this.NUM_OF_OBJECT-1;++a){const s=_(.01,.03);t.push({position:f(_(-5,5),_(-5,5),_(-5,0)),velocity:f(0,0,0),color:f(_(0,1),_(0,1),_(0,1)),texCoord:m(0,0),radius:s*_(9,11),mass:s})}const i=new Float32Array(this.getVerticesData(t));this._pointBuffer=this._device.createBuffer({label:"point vertex buffer",size:i.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._pointBuffer,0,i),this._billboardBuffer=this._device.createBuffer({label:"billboard vertex buffer",size:i.byteLength*6,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});const r=$(),n=new Float32Array(this.getVerticesData(r.vertices));this._skyboxVertexBuffer=this._device.createBuffer({label:"skybox vertex buffer",size:n.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._skyboxVertexBuffer,0,n);const o=new Uint32Array(r.indices);this._skyboxIndicesLength=r.indices.length,this._skyboxIndexBuffer=this._device.createBuffer({label:"skybox index buffer",size:o.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._skyboxIndexBuffer,0,o)}async createOtherBuffers(){var t;this._objectNumBuffer=this._device.createBuffer({label:"frag uniforms",size:1*Uint32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),(t=this._device)==null||t.queue.writeBuffer(this._objectNumBuffer,0,new Uint32Array([this.NUM_OF_OBJECT])),this._matrixUniformBuffer=this._device.createBuffer({label:"matrix uniforms",size:32*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._timeUniformBuffer=this._device.createBuffer({label:"frag uniforms",size:1*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._cameraUniformBuffer=this._device.createBuffer({label:"camera uniforms",size:8*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._deltaUniformBuffer=this._device.createBuffer({label:"time uniform buffer",size:Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}async createTextures(){this._envCubemap=await this.createCubemapTexture(["cubemap/px.jpg","cubemap/nx.jpg","cubemap/py.jpg","cubemap/ny.jpg","cubemap/pz.jpg","cubemap/nz.jpg"]),this._starTex=await this.createTexture("star.png"),this._sampler=this._device.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"})}async createBindGroups(){this._mainBindGroup=this._device.createBindGroup({label:"bind group for object",layout:this._mainPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this._matrixUniformBuffer}},{binding:1,resource:this._starTex.createView()},{binding:2,resource:this._sampler},{binding:3,resource:{buffer:this._timeUniformBuffer}}]}),this._computeMovementBindGroup=this._device.createBindGroup({label:"compute movement bind group",layout:this._computeMovementPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this._pointBuffer}},{binding:1,resource:{buffer:this._objectNumBuffer}},{binding:2,resource:{buffer:this._deltaUniformBuffer}}]}),this._computeBillboardBindGroup=this._device.createBindGroup({label:"compute billboard bind group",layout:this._computeBillboardPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this._pointBuffer}},{binding:1,resource:{buffer:this._billboardBuffer}},{binding:2,resource:{buffer:this._cameraUniformBuffer}}]}),this._bgBindGroup=this._device.createBindGroup({label:"bind group for bg",layout:this._bgPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this._matrixUniformBuffer}},{binding:1,resource:this._sampler},{binding:2,resource:this._envCubemap.createView({dimension:"cube"})}]})}async setMatrix(){this._camera=new ie({position:f(0,0,2.5),center:f(0,0,0),up:f(0,1,0)}),this._projection=P(),k(this._projection,U(90),this.WIDTH/this.HEIGHT,.1,100)}async writeBuffers(t,i){this._device.queue.writeBuffer(this._deltaUniformBuffer,0,new Float32Array([i])),this._device.queue.writeBuffer(this._timeUniformBuffer,0,new Float32Array([t*.001]));const r=this._camera.getViewMatrix();this._device.queue.writeBuffer(this._matrixUniformBuffer,0,new Float32Array([...r,...this._projection])),this._device.queue.writeBuffer(this._cameraUniformBuffer,0,new Float32Array([...this._camera.position,0,...this._camera.up,0]))}async compute(){const t=this._commandEncoder.beginComputePass({label:"compute pass"});t.setPipeline(this._computeMovementPipeline),t.setBindGroup(0,this._computeMovementBindGroup),t.dispatchWorkgroups(1,1),t.setPipeline(this._computeBillboardPipeline),t.setBindGroup(0,this._computeBillboardBindGroup),t.dispatchWorkgroups(1,1),t.end()}async draw(){const t=await this.getRenderPassDesc(),i=this._commandEncoder.beginRenderPass(t);i.setPipeline(this._bgPipeline),i==null||i.setBindGroup(0,this._bgBindGroup),i.setVertexBuffer(0,this._skyboxVertexBuffer),i.setIndexBuffer(this._skyboxIndexBuffer,"uint32"),i.drawIndexed(this._skyboxIndicesLength),i.setPipeline(this._mainPipeline),i==null||i.setBindGroup(0,this._mainBindGroup),i.setVertexBuffer(0,this._billboardBuffer),i.draw(this.NUM_OF_OBJECT*6),i.end()}async requestDevice(){var i;const t=await((i=navigator.gpu)==null?void 0:i.requestAdapter());this._device=await(t==null?void 0:t.requestDevice()),this._device||(console.error("Cannot find a device"),alert("Your device does not support WebGPU"))}async getCanvasContext(){const t=document.querySelector("canvas");t||console.error("Cannot find a canvas"),t.width=this.WIDTH,t.height=this.HEIGHT,this._canvasContext=t.getContext("webgpu"),this._canvasContext||console.error("Cannot find a canvas context");const i={device:this._device,format:navigator.gpu.getPreferredCanvasFormat(),usage:GPUTextureUsage.RENDER_ATTACHMENT,alphaMode:"opaque"};this._canvasContext.configure(i)}async createRenderPipeline({label:t,vertexShader:i,fragmentShader:r,vertexBufferLayout:n,topology:o="triangle-list"}){const a={label:t,layout:"auto",vertex:{module:this._device.createShaderModule({label:`${t} vertex shader`,code:i}),buffers:n},fragment:{module:this._device.createShaderModule({label:`${t} fragment shader`,code:r}),targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:o,cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less-equal",format:"depth24plus"}};return this._device.createRenderPipeline(a)}async createComputePipeline({label:t,computeShader:i}){const r={label:t,layout:"auto",compute:{module:this._device.createShaderModule({label:`${t} compute shader`,code:i})}};return this._device.createComputePipeline(r)}async createCubemapTexture(t,i=0){const r=await Promise.all(t.map(O)),n=this._device.createTexture({label:"yellow F on red",size:[r[0].width,r[0].height,r.length],mipLevelCount:i+1,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});n||console.error("Failed to load cubemap texture");for(let o=0;o<6;o++)(await R(r[o],i)).forEach((s,u)=>{this._device.queue.copyExternalImageToTexture({source:s,flipY:!1},{texture:n,origin:[0,0,o],mipLevel:u},{width:s.width,height:s.height})});return n}async createTexture(t,i=0){const r=await O(t),n=await R(r,i),o=this._device.createTexture({label:"yellow F on red",size:[n[0].width,n[0].height],mipLevelCount:n.length,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});return o||console.error("Failed to load texture"),n.forEach((a,s)=>{this._device.queue.copyExternalImageToTexture({source:a,flipY:!1},{texture:o,mipLevel:s},{width:a.width,height:a.height})}),o}getVerticesData(t){const i=[];for(let r=0;r<t.length;r++){const{position:n,velocity:o,color:a,texCoord:s,radius:u,mass:h}=t[r];i.push(...n,0,...o,0,...a,0,...s,u,h)}return i}async getRenderPassDesc(){const t=this._canvasContext.getCurrentTexture(),i=this._device.createTexture({size:[t.width,t.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),r={view:t.createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},n={view:i.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"};return{label:"render pass",colorAttachments:[r],depthStencilAttachment:n}}}const N=new ne;let I=0;async function re(){await N.initialize();async function e(){const t=performance.now(),i=t-I;I=t,await N.render(t,i),requestAnimationFrame(e)}e()}re();
