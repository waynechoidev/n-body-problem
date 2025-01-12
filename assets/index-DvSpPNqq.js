var A=Object.defineProperty;var D=(e,t,i)=>t in e?A(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var c=(e,t,i)=>(D(e,typeof t!="symbol"?t+"":t,i),i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function i(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=i(r);fetch(r.href,o)}})();async function O(e){const i=await(await fetch(e)).blob();return await createImageBitmap(i,{colorSpaceConversion:"none"})}async function R(e,t){let i=e;const n=[i];let r=0;for(;r<t&&(i.width>1||i.height>1);)i=await F(i),n.push(i),r++;return n}async function F(e){const t=Math.max(1,e.width/2|0),i=Math.max(1,e.height/2|0),n=document.createElement("canvas");n.width=t,n.height=i;const r=n.getContext("2d");if(!r)throw new Error("Unable to get 2D context");return r.drawImage(e,0,0,t,i),createImageBitmap(n)}const _=(e,t)=>Math.random()*(t-e)+e,z=Math.PI/180;function U(e){return e*z}var E=1e-6,g=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var e=0,t=arguments.length;t--;)e+=arguments[t]*arguments[t];return Math.sqrt(e)});function P(){var e=new g(16);return g!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function L(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Y(e,t,i){var n=Math.sin(i),r=Math.cos(i),o=t[4],a=t[5],s=t[6],u=t[7],h=t[8],p=t[9],v=t[10],d=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=o*r+h*n,e[5]=a*r+p*n,e[6]=s*r+v*n,e[7]=u*r+d*n,e[8]=h*r-o*n,e[9]=p*r-a*n,e[10]=v*r-s*n,e[11]=d*r-u*n,e}function j(e,t,i){var n=Math.sin(i),r=Math.cos(i),o=t[0],a=t[1],s=t[2],u=t[3],h=t[8],p=t[9],v=t[10],d=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=o*r-h*n,e[1]=a*r-p*n,e[2]=s*r-v*n,e[3]=u*r-d*n,e[8]=o*n+h*r,e[9]=a*n+p*r,e[10]=s*n+v*r,e[11]=u*n+d*r,e}function q(e,t,i,n,r){var o=1/Math.tan(t/2),a;return e[0]=o/i,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,r!=null&&r!==1/0?(a=1/(n-r),e[10]=(r+n)*a,e[14]=2*r*n*a):(e[10]=-1,e[14]=-2*n),e}var k=q;function H(e,t,i,n){var r,o,a,s,u,h,p,v,d,l,b=t[0],y=t[1],w=t[2],T=n[0],M=n[1],C=n[2],S=i[0],V=i[1],G=i[2];return Math.abs(b-S)<E&&Math.abs(y-V)<E&&Math.abs(w-G)<E?L(e):(p=b-S,v=y-V,d=w-G,l=1/Math.hypot(p,v,d),p*=l,v*=l,d*=l,r=M*d-C*v,o=C*p-T*d,a=T*v-M*p,l=Math.hypot(r,o,a),l?(l=1/l,r*=l,o*=l,a*=l):(r=0,o=0,a=0),s=v*a-d*o,u=d*r-p*a,h=p*o-v*r,l=Math.hypot(s,u,h),l?(l=1/l,s*=l,u*=l,h*=l):(s=0,u=0,h=0),e[0]=r,e[1]=s,e[2]=p,e[3]=0,e[4]=o,e[5]=u,e[6]=v,e[7]=0,e[8]=a,e[9]=h,e[10]=d,e[11]=0,e[12]=-(r*b+o*y+a*w),e[13]=-(s*b+u*y+h*w),e[14]=-(p*b+v*y+d*w),e[15]=1,e)}function x(){var e=new g(3);return g!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function f(e,t,i){var n=new g(3);return n[0]=e,n[1]=t,n[2]=i,n}function B(e,t,i){var n=t[0],r=t[1],o=t[2],a=i[3]*n+i[7]*r+i[11]*o+i[15];return a=a||1,e[0]=(i[0]*n+i[4]*r+i[8]*o+i[12])/a,e[1]=(i[1]*n+i[5]*r+i[9]*o+i[13])/a,e[2]=(i[2]*n+i[6]*r+i[10]*o+i[14])/a,e}(function(){var e=x();return function(t,i,n,r,o,a){var s,u;for(i||(i=3),n||(n=0),r?u=Math.min(r*i+n,t.length):u=t.length,s=n;s<u;s+=i)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],o(e,e,a),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2];return t}})();function W(){var e=new g(2);return g!=Float32Array&&(e[0]=0,e[1]=0),e}function m(e,t){var i=new g(2);return i[0]=e,i[1]=t,i}function X(e,t,i){return e[0]=t[0]+i[0],e[1]=t[1]+i[1],e}(function(){var e=W();return function(t,i,n,r,o,a){var s,u;for(i||(i=2),n||(n=0),r?u=Math.min(r*i+n,t.length):u=t.length,s=n;s<u;s+=i)e[0]=t[s],e[1]=t[s+1],o(e,e,a),t[s]=e[0],t[s+1]=e[1];return t}})();function $(){const e=[],t=[];return e.push({position:f(-1,1,-1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(-1,-1,-1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(1,1,-1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(1,-1,-1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(-1,1,1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(1,1,1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(-1,-1,1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),e.push({position:f(1,-1,1),velocity:f(0,0,0),color:f(0,0,0),texCoord:m(0,0),radius:0,mass:0}),t.push(0,1,2,2,1,3,2,3,5,5,3,7,5,7,4,4,7,6,4,6,0,0,6,1,4,0,5,5,0,2,1,6,3,3,6,7),{vertices:e,indices:t}}var J=`struct VSOutput {
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

	var newUv:vec2f;
	newUv.x = sp.x*f / 2 + 0.5;
	newUv.y = sp.y*f / 2 + 0.5;
	let texSample:vec3f	= textureSample(tex, mySampler, newUv).rgb;
	let uOff:f32 = ( texSample.g * brightness * 4.5);
	let starUV:vec2f = newUv + vec2f( uOff, 0.0 );
	let tex:vec3f = textureSample(tex, mySampler, starUV).rgb;
	if( dist < radius ){
		corona *= pow( dist * invRadius, 24.0 );
		starSphere = tex;
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
}`;class ie{constructor({position:t,center:i,up:n}){c(this,"_position");c(this,"_center");c(this,"_up");c(this,"_rotate");c(this,"_isMobile");c(this,"_isDragging");c(this,"_initialX");c(this,"_initialY");this._position=t,this._center=i,this._up=n,this._rotate=m(0,0),this._isDragging=!1,this._initialX=0,this._initialY=0,this._isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.initializeEvent()}get position(){const t=this.getViewRotationMatrix(),i=x();return B(i,this._position,t),i}get up(){const t=this.getViewRotationMatrix(),i=x();return B(i,this._up,t),i}getViewMatrix(){const t=P(),i=this.getViewRotationMatrix(),n=x(),r=x(),o=x();return B(n,this._position,i),B(r,this._center,i),B(o,this._up,i),H(t,n,r,o),t}initializeEvent(){const t=this._isMobile?"touchstart":"mousedown",i=this._isMobile?"touchmove":"mousemove",n=this._isMobile?"touchend":"mouseup";document.addEventListener(t,r=>{this._isDragging=!0,this._initialX=this._isMobile?r.touches[0].clientX:r.clientX,this._initialY=this._isMobile?r.touches[0].clientY:r.clientY}),document.addEventListener(i,r=>{if(this._isDragging){const o=this._isMobile?r.touches[0].clientX:r.clientX,a=this._isMobile?r.touches[0].clientY:r.clientY,s=o-this._initialX,u=a-this._initialY;this._rotate=X(this._rotate,this._rotate,m(u/10,s/10)),this._initialX=o,this._initialY=a}}),document.addEventListener(n,()=>{this._isDragging=!1})}getViewRotationMatrix(){const t=P();return j(t,t,U(this._rotate[1])),Y(t,t,U(this._rotate[0])),t}}class ne{constructor(){c(this,"_device");c(this,"_canvasContext");c(this,"WIDTH");c(this,"HEIGHT");this.WIDTH=window.innerWidth,this.HEIGHT=window.innerHeight}async requestDevice(){var i;const t=await((i=navigator.gpu)==null?void 0:i.requestAdapter());this._device=await(t==null?void 0:t.requestDevice()),this._device||(console.error("Cannot find a device"),alert("Your device does not support WebGPU"))}async getCanvasContext(){const t=document.querySelector("canvas");t||console.error("Cannot find a canvas"),t.width=this.WIDTH,t.height=this.HEIGHT,this._canvasContext=t.getContext("webgpu"),this._canvasContext||console.error("Cannot find a canvas context");const i={device:this._device,format:navigator.gpu.getPreferredCanvasFormat(),usage:GPUTextureUsage.RENDER_ATTACHMENT,alphaMode:"opaque"};this._canvasContext.configure(i)}async createRenderPipeline({label:t,vertexShader:i,fragmentShader:n,vertexBufferLayout:r,topology:o="triangle-list"}){const a={label:t,layout:"auto",vertex:{module:this._device.createShaderModule({label:`${t} vertex shader`,code:i}),buffers:r},fragment:{module:this._device.createShaderModule({label:`${t} fragment shader`,code:n}),targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:o,cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less-equal",format:"depth24plus"}};return this._device.createRenderPipeline(a)}async createComputePipeline({label:t,computeShader:i}){const n={label:t,layout:"auto",compute:{module:this._device.createShaderModule({label:`${t} compute shader`,code:i})}};return this._device.createComputePipeline(n)}async createCubemapTexture(t,i=0){const n=await Promise.all(t.map(O)),r=this._device.createTexture({label:"yellow F on red",size:[n[0].width,n[0].height,n.length],mipLevelCount:i+1,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});r||console.error("Failed to load cubemap texture");for(let o=0;o<6;o++)(await R(n[o],i)).forEach((s,u)=>{this._device.queue.copyExternalImageToTexture({source:s,flipY:!1},{texture:r,origin:[0,0,o],mipLevel:u},{width:s.width,height:s.height})});return r}async createTexture(t,i=0){const n=await O(t),r=await R(n,i),o=this._device.createTexture({label:"yellow F on red",size:[r[0].width,r[0].height],mipLevelCount:r.length,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});return o||console.error("Failed to load texture"),r.forEach((a,s)=>{this._device.queue.copyExternalImageToTexture({source:a,flipY:!1},{texture:o,mipLevel:s},{width:a.width,height:a.height})}),o}getVerticesData(t){const i=[];for(let n=0;n<t.length;n++){const{position:r,velocity:o,color:a,texCoord:s,radius:u,mass:h}=t[n];i.push(...r,0,...o,0,...a,0,...s,u,h)}return i}async getRenderPassDesc(){const t=this._canvasContext.getCurrentTexture(),i=this._device.createTexture({size:[t.width,t.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}),n={view:t.createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"},r={view:i.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"};return{label:"render pass",colorAttachments:[n],depthStencilAttachment:r}}}class re extends ne{constructor(){super();c(this,"_mainPipeline");c(this,"_bgPipeline");c(this,"_computeMovementPipeline");c(this,"_computeBillboardPipeline");c(this,"_pointBuffer");c(this,"_billboardBuffer");c(this,"_skyboxVertexBuffer");c(this,"_skyboxIndexBuffer");c(this,"_skyboxIndicesLength");c(this,"_objectNumBuffer");c(this,"_matrixUniformBuffer");c(this,"_timeUniformBuffer");c(this,"_cameraUniformBuffer");c(this,"_deltaUniformBuffer");c(this,"_envCubemap");c(this,"_starTex");c(this,"_sampler");c(this,"_mainBindGroup");c(this,"_computeMovementBindGroup");c(this,"_computeBillboardBindGroup");c(this,"_bgBindGroup");c(this,"_camera");c(this,"_projection");c(this,"_commandEncoder");c(this,"NUM_OF_OBJECT");this.NUM_OF_OBJECT=7}async initialize(){await this.requestDevice(),await this.getCanvasContext(),await this.createPipelines(),await this.createVertexBuffers(),await this.createOtherBuffers(),await this.createTextures(),await this.createBindGroups(),await this.setMatrix()}async run(i,n){await this.writeBuffers(i,n),this._commandEncoder=this._device.createCommandEncoder({label:"encoder"}),await this.compute(),await this.draw();const r=this._commandEncoder.finish();this._device.queue.submit([r])}async createPipelines(){const i=[{arrayStride:16*Float32Array.BYTES_PER_ELEMENT,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:4*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:2,offset:8*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:3,offset:12*Float32Array.BYTES_PER_ELEMENT,format:"float32x2"},{shaderLocation:4,offset:14*Float32Array.BYTES_PER_ELEMENT,format:"float32"},{shaderLocation:5,offset:15*Float32Array.BYTES_PER_ELEMENT,format:"float32"}]}];this._mainPipeline=await this.createRenderPipeline({label:"main pipeline",vertexShader:Q,fragmentShader:Z,vertexBufferLayout:i}),this._bgPipeline=await this.createRenderPipeline({label:"bg pipeline",vertexShader:ee,fragmentShader:te,vertexBufferLayout:i}),this._computeMovementPipeline=await this.createComputePipeline({label:"movement compute pipeline",computeShader:K}),this._computeBillboardPipeline=await this.createComputePipeline({label:"billboard compute pipeline",computeShader:J})}async createVertexBuffers(){const i=[];i.push({position:f(0,0,2),velocity:f(0,0,0),color:f(.8,.2,.2),texCoord:m(0,0),radius:.3,mass:.03});for(let s=0;s<this.NUM_OF_OBJECT-1;++s){const u=_(.01,.03);i.push({position:f(_(-5,5),_(-5,5),_(-5,0)),velocity:f(0,0,0),color:f(_(0,1),_(0,1),_(0,1)),texCoord:m(0,0),radius:u*_(9,11),mass:u})}const n=new Float32Array(this.getVerticesData(i));this._pointBuffer=this._device.createBuffer({label:"point vertex buffer",size:n.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._pointBuffer,0,n),this._billboardBuffer=this._device.createBuffer({label:"billboard vertex buffer",size:n.byteLength*6,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});const r=$(),o=new Float32Array(this.getVerticesData(r.vertices));this._skyboxVertexBuffer=this._device.createBuffer({label:"skybox vertex buffer",size:o.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._skyboxVertexBuffer,0,o);const a=new Uint32Array(r.indices);this._skyboxIndicesLength=r.indices.length,this._skyboxIndexBuffer=this._device.createBuffer({label:"skybox index buffer",size:a.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._skyboxIndexBuffer,0,a)}async createOtherBuffers(){var i;this._objectNumBuffer=this._device.createBuffer({label:"frag uniforms",size:1*Uint32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),(i=this._device)==null||i.queue.writeBuffer(this._objectNumBuffer,0,new Uint32Array([this.NUM_OF_OBJECT])),this._matrixUniformBuffer=this._device.createBuffer({label:"matrix uniforms",size:32*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._timeUniformBuffer=this._device.createBuffer({label:"frag uniforms",size:1*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._cameraUniformBuffer=this._device.createBuffer({label:"camera uniforms",size:8*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this._deltaUniformBuffer=this._device.createBuffer({label:"time uniform buffer",size:Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}async createTextures(){this._envCubemap=await this.createCubemapTexture(["cubemap/px.jpg","cubemap/nx.jpg","cubemap/py.jpg","cubemap/ny.jpg","cubemap/pz.jpg","cubemap/nz.jpg"]),this._starTex=await this.createTexture("star.png"),this._sampler=this._device.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"})}async createBindGroups(){this._mainBindGroup=this._device.createBindGroup({label:"bind group for object",layout:this._mainPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this._matrixUniformBuffer}},{binding:1,resource:this._starTex.createView()},{binding:2,resource:this._sampler},{binding:3,resource:{buffer:this._timeUniformBuffer}}]}),this._computeMovementBindGroup=this._device.createBindGroup({label:"compute movement bind group",layout:this._computeMovementPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this._pointBuffer}},{binding:1,resource:{buffer:this._objectNumBuffer}},{binding:2,resource:{buffer:this._deltaUniformBuffer}}]}),this._computeBillboardBindGroup=this._device.createBindGroup({label:"compute billboard bind group",layout:this._computeBillboardPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this._pointBuffer}},{binding:1,resource:{buffer:this._billboardBuffer}},{binding:2,resource:{buffer:this._cameraUniformBuffer}}]}),this._bgBindGroup=this._device.createBindGroup({label:"bind group for bg",layout:this._bgPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this._matrixUniformBuffer}},{binding:1,resource:this._sampler},{binding:2,resource:this._envCubemap.createView({dimension:"cube"})}]})}async setMatrix(){this._camera=new ie({position:f(0,0,2.5),center:f(0,0,0),up:f(0,1,0)}),this._projection=P(),k(this._projection,U(90),this.WIDTH/this.HEIGHT,.1,100)}async writeBuffers(i,n){this._device.queue.writeBuffer(this._deltaUniformBuffer,0,new Float32Array([n])),this._device.queue.writeBuffer(this._timeUniformBuffer,0,new Float32Array([i*.001]));const r=this._camera.getViewMatrix();this._device.queue.writeBuffer(this._matrixUniformBuffer,0,new Float32Array([...r,...this._projection])),this._device.queue.writeBuffer(this._cameraUniformBuffer,0,new Float32Array([...this._camera.position,0,...this._camera.up,0]))}async compute(){const i=this._commandEncoder.beginComputePass({label:"compute pass"});i.setPipeline(this._computeMovementPipeline),i.setBindGroup(0,this._computeMovementBindGroup),i.dispatchWorkgroups(1,1),i.setPipeline(this._computeBillboardPipeline),i.setBindGroup(0,this._computeBillboardBindGroup),i.dispatchWorkgroups(1,1),i.end()}async draw(){const i=await this.getRenderPassDesc(),n=this._commandEncoder.beginRenderPass(i);n.setPipeline(this._bgPipeline),n==null||n.setBindGroup(0,this._bgBindGroup),n.setVertexBuffer(0,this._skyboxVertexBuffer),n.setIndexBuffer(this._skyboxIndexBuffer,"uint32"),n.drawIndexed(this._skyboxIndicesLength),n.setPipeline(this._mainPipeline),n==null||n.setBindGroup(0,this._mainBindGroup),n.setVertexBuffer(0,this._billboardBuffer),n.draw(this.NUM_OF_OBJECT*6),n.end()}}const N=new re;let I=0;async function oe(){await N.initialize();async function e(){const t=performance.now(),i=t-I;I=t,await N.run(t,i),requestAnimationFrame(e)}e()}oe();
