var ee=Object.defineProperty;var te=(e,t,r)=>t in e?ee(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var f=(e,t,r)=>(te(e,typeof t!="symbol"?t+"":t,r),r);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function r(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=r(i);fetch(i.href,o)}})();var ne=`struct VSOutput {
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
}`,ie=`struct VSOutput {
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
@group(0) @binding(1) var<uniform> delta: f32;

const MIN_DISTANCE: f32 = 0.001; 

@compute @workgroup_size(256) fn computeSomething(
    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,
) {
    let numBodies:u32 = 3;
    let index = global_invocation_id.x;
    var body : Vertex = objects[index];
    var acceleration = vec3(0.0, 0.0, 0.0);

    for (var i = 0u; i < numBodies; i++) {
        if (i != index) {
            let other : Vertex = objects[i];
            let distance_vec = other.position - body.position;
            var distance = length(distance_vec);
            if(distance < MIN_DISTANCE){
                distance = MIN_DISTANCE;
            }
            let force = (0.067 * body.mass * other.mass) / distance * distance;
            let direction = normalize(distance_vec);
            acceleration += vec3(direction * force);
        }
    }

    let deltaa = delta;

    body.velocity += acceleration;
    body.position += body.velocity * delta;
    objects[index] = body;
}`,re=`struct VSOutput {
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
}`,oe=`struct VSOutput {
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
}`,se=`struct VSOutput {
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
}`,ae=`struct VSOutput {
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
}`;class ce{constructor(t){f(this,"_canvas");f(this,"_adapter");f(this,"_device");f(this,"_context");f(this,"_encoder");f(this,"_pass");f(this,"_depthTexture");this._canvas=t}get device(){return this._device}async initialize(t,r){var n,i,o;if(this._canvas.style.width=`${t}px`,this._canvas.style.height=`${r}px`,this._canvas.width=t*2,this._canvas.height=r*2,this._adapter=await((n=navigator.gpu)==null?void 0:n.requestAdapter()),this._device=await((i=this._adapter)==null?void 0:i.requestDevice()),!this._device){const s="Your device does not support WebGPU.";console.error(s);const a=document.createElement("p");a.innerHTML=s,(o=document.querySelector("body"))==null||o.prepend(a)}this._context=this._canvas.getContext("webgpu"),this._context.configure({device:this._device,format:navigator.gpu.getPreferredCanvasFormat()})}setEncoder(){if(!this._device){console.error("RenderEnv was not initialized!");return}this._encoder=this._device.createCommandEncoder({label:"encoder"})}get encoder(){return this._encoder}getGraphicsPass(){(!this._context||!this._device)&&console.error("RenderEnv was not initialized!"),this._encoder||console.error("Encoder was not created!");const t=this._context.getCurrentTexture();(!this._depthTexture||this._depthTexture.width!==t.width||this._depthTexture.height!==t.height)&&(this._depthTexture&&this._depthTexture.destroy(),this._depthTexture=this._device.createTexture({size:[t.width,t.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}));const r={label:"render pass",colorAttachments:[{view:t.createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}};return this._pass=this._encoder.beginRenderPass(r),this._pass}getComputePass(){return this._encoder||console.error("Encoder was not created!"),this._encoder.beginComputePass({label:"compute pass"})}finishEncoder(){this._device||console.error("RenderEnv was not initialized!"),this._encoder||console.error("Encoder was not created!");const t=this._encoder.finish();this._device.queue.submit([t])}}class j{constructor({label:t,device:r,vertexShader:n,fragmentShader:i}){f(this,"_label");f(this,"_pipeline");this._label=t,this._pipeline=r.createRenderPipeline({label:`${t} pipeline`,layout:"auto",vertex:{module:r.createShaderModule({label:`${t} vertex shader`,code:n}),buffers:[{arrayStride:16*Float32Array.BYTES_PER_ELEMENT,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:4*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:2,offset:8*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:3,offset:12*Float32Array.BYTES_PER_ELEMENT,format:"float32x2"},{shaderLocation:4,offset:14*Float32Array.BYTES_PER_ELEMENT,format:"float32"},{shaderLocation:5,offset:15*Float32Array.BYTES_PER_ELEMENT,format:"float32"}]}]},fragment:{module:r.createShaderModule({label:`${t} fragment shader`,code:i}),targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less-equal",format:"depth24plus"}})}getBindGroupLayout(t){return this._pipeline.getBindGroupLayout(t)}use(t){t||console.error(`GPURenderPassEncoder was not passed to ${this._label} pipeline`),t.setPipeline(this._pipeline)}}const V=1e-6;let g=typeof Float32Array<"u"?Float32Array:Array;const le=Math.PI/180;function L(e){return e*le}function fe(){let e=new g(9);return g!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function F(){let e=new g(16);return g!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function ue(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function de(e,t,r){let n=Math.sin(r),i=Math.cos(r),o=t[4],s=t[5],a=t[6],c=t[7],h=t[8],p=t[9],v=t[10],d=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=o*i+h*n,e[5]=s*i+p*n,e[6]=a*i+v*n,e[7]=c*i+d*n,e[8]=h*i-o*n,e[9]=p*i-s*n,e[10]=v*i-a*n,e[11]=d*i-c*n,e}function pe(e,t,r){let n=Math.sin(r),i=Math.cos(r),o=t[0],s=t[1],a=t[2],c=t[3],h=t[8],p=t[9],v=t[10],d=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=o*i-h*n,e[1]=s*i-p*n,e[2]=a*i-v*n,e[3]=c*i-d*n,e[8]=o*n+h*i,e[9]=s*n+p*i,e[10]=a*n+v*i,e[11]=c*n+d*i,e}function ve(e,t,r,n,i){const o=1/Math.tan(t/2);if(e[0]=o/r,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,i!=null&&i!==1/0){const s=1/(n-i);e[10]=(i+n)*s,e[14]=2*i*n*s}else e[10]=-1,e[14]=-2*n;return e}const he=ve;function me(e,t,r,n){let i,o,s,a,c,h,p,v,d,u,b=t[0],m=t[1],_=t[2],T=n[0],S=n[1],C=n[2],z=r[0],B=r[1],M=r[2];return Math.abs(b-z)<V&&Math.abs(m-B)<V&&Math.abs(_-M)<V?ue(e):(p=b-z,v=m-B,d=_-M,u=1/Math.sqrt(p*p+v*v+d*d),p*=u,v*=u,d*=u,i=S*d-C*v,o=C*p-T*d,s=T*v-S*p,u=Math.sqrt(i*i+o*o+s*s),u?(u=1/u,i*=u,o*=u,s*=u):(i=0,o=0,s=0),a=v*s-d*o,c=d*i-p*s,h=p*o-v*i,u=Math.sqrt(a*a+c*c+h*h),u?(u=1/u,a*=u,c*=u,h*=u):(a=0,c=0,h=0),e[0]=i,e[1]=a,e[2]=p,e[3]=0,e[4]=o,e[5]=c,e[6]=v,e[7]=0,e[8]=s,e[9]=h,e[10]=d,e[11]=0,e[12]=-(i*b+o*m+s*_),e[13]=-(a*b+c*m+h*_),e[14]=-(p*b+v*m+d*_),e[15]=1,e)}function E(){let e=new g(3);return g!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function _e(e){let t=e[0],r=e[1],n=e[2];return Math.sqrt(t*t+r*r+n*n)}function l(e,t,r){let n=new g(3);return n[0]=e,n[1]=t,n[2]=r,n}function ge(e,t){let r=t[0],n=t[1],i=t[2],o=r*r+n*n+i*i;return o>0&&(o=1/Math.sqrt(o)),e[0]=t[0]*o,e[1]=t[1]*o,e[2]=t[2]*o,e}function xe(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function A(e,t,r){let n=t[0],i=t[1],o=t[2],s=r[0],a=r[1],c=r[2];return e[0]=i*c-o*a,e[1]=o*s-n*c,e[2]=n*a-i*s,e}function P(e,t,r){let n=t[0],i=t[1],o=t[2],s=r[3]*n+r[7]*i+r[11]*o+r[15];return s=s||1,e[0]=(r[0]*n+r[4]*i+r[8]*o+r[12])/s,e[1]=(r[1]*n+r[5]*i+r[9]*o+r[13])/s,e[2]=(r[2]*n+r[6]*i+r[10]*o+r[14])/s,e}const be=_e;(function(){let e=E();return function(t,r,n,i,o,s){let a,c;for(r||(r=3),n||(n=0),i?c=Math.min(i*r+n,t.length):c=t.length,a=n;a<c;a+=r)e[0]=t[a],e[1]=t[a+1],e[2]=t[a+2],o(e,e,s),t[a]=e[0],t[a+1]=e[1],t[a+2]=e[2];return t}})();function ye(){let e=new g(4);return g!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function we(e,t){let r=t[0],n=t[1],i=t[2],o=t[3],s=r*r+n*n+i*i+o*o;return s>0&&(s=1/Math.sqrt(s)),e[0]=r*s,e[1]=n*s,e[2]=i*s,e[3]=o*s,e}(function(){let e=ye();return function(t,r,n,i,o,s){let a,c;for(r||(r=4),n||(n=0),i?c=Math.min(i*r+n,t.length):c=t.length,a=n;a<c;a+=r)e[0]=t[a],e[1]=t[a+1],e[2]=t[a+2],e[3]=t[a+3],o(e,e,s),t[a]=e[0],t[a+1]=e[1],t[a+2]=e[2],t[a+3]=e[3];return t}})();function X(){let e=new g(4);return g!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function Ee(e,t,r){r=r*.5;let n=Math.sin(r);return e[0]=n*t[0],e[1]=n*t[1],e[2]=n*t[2],e[3]=Math.cos(r),e}function O(e,t,r,n){let i=t[0],o=t[1],s=t[2],a=t[3],c=r[0],h=r[1],p=r[2],v=r[3],d,u,b,m,_;return u=i*c+o*h+s*p+a*v,u<0&&(u=-u,c=-c,h=-h,p=-p,v=-v),1-u>V?(d=Math.acos(u),b=Math.sin(d),m=Math.sin((1-n)*d)/b,_=Math.sin(n*d)/b):(m=1-n,_=n),e[0]=m*i+_*c,e[1]=m*o+_*h,e[2]=m*s+_*p,e[3]=m*a+_*v,e}function Be(e,t){let r=t[0]+t[4]+t[8],n;if(r>0)n=Math.sqrt(r+1),e[3]=.5*n,n=.5/n,e[0]=(t[5]-t[7])*n,e[1]=(t[6]-t[2])*n,e[2]=(t[1]-t[3])*n;else{let i=0;t[4]>t[0]&&(i=1),t[8]>t[i*3+i]&&(i=2);let o=(i+1)%3,s=(i+2)%3;n=Math.sqrt(t[i*3+i]-t[o*3+o]-t[s*3+s]+1),e[i]=.5*n,n=.5/n,e[3]=(t[o*3+s]-t[s*3+o])*n,e[o]=(t[o*3+i]+t[i*3+o])*n,e[s]=(t[s*3+i]+t[i*3+s])*n}return e}const J=we;(function(){let e=E(),t=l(1,0,0),r=l(0,1,0);return function(n,i,o){let s=xe(i,o);return s<-.999999?(A(e,t,i),be(e)<1e-6&&A(e,r,i),ge(e,e),Ee(n,e,Math.PI),n):s>.999999?(n[0]=0,n[1]=0,n[2]=0,n[3]=1,n):(A(e,i,o),n[0]=e[0],n[1]=e[1],n[2]=e[2],n[3]=1+s,J(n,n))}})();(function(){let e=X(),t=X();return function(r,n,i,o,s,a){return O(e,n,s,a),O(t,i,o,a),O(r,e,t,2*a*(1-a)),r}})();(function(){let e=fe();return function(t,r,n,i){return e[0]=n[0],e[3]=n[1],e[6]=n[2],e[1]=i[0],e[4]=i[1],e[7]=i[2],e[2]=-r[0],e[5]=-r[1],e[8]=-r[2],J(t,Be(t,e))}})();function Me(){let e=new g(2);return g!=Float32Array&&(e[0]=0,e[1]=0),e}function x(e,t){let r=new g(2);return r[0]=e,r[1]=t,r}function Ue(e,t,r){return e[0]=t[0]+r[0],e[1]=t[1]+r[1],e}(function(){let e=Me();return function(t,r,n,i,o,s){let a,c;for(r||(r=2),n||(n=0),i?c=Math.min(i*r+n,t.length):c=t.length,a=n;a<c;a+=r)e[0]=t[a],e[1]=t[a+1],o(e,e,s),t[a]=e[0],t[a+1]=e[1];return t}})();class Pe{constructor({position:t,center:r,up:n}){f(this,"_position");f(this,"_center");f(this,"_up");f(this,"_rotate");f(this,"_isMobile");f(this,"_isDragging");f(this,"_initialX");f(this,"_initialY");this._position=t,this._center=r,this._up=n,this._rotate=x(0,0),this._isDragging=!1,this._initialX=0,this._initialY=0,this._isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.initializeEvent()}get position(){const t=this.getViewRotationMatrix(),r=E();return P(r,this._position,t),r}get up(){const t=this.getViewRotationMatrix(),r=E();return P(r,this._up,t),r}getViewMatrix(){const t=F(),r=this.getViewRotationMatrix(),n=E(),i=E(),o=E();return P(n,this._position,r),P(i,this._center,r),P(o,this._up,r),me(t,n,i,o),t}initializeEvent(){const t=this._isMobile?"touchstart":"mousedown",r=this._isMobile?"touchmove":"mousemove",n=this._isMobile?"touchend":"mouseup";document.addEventListener(t,i=>{this._isDragging=!0,this._initialX=this._isMobile?i.touches[0].clientX:i.clientX,this._initialY=this._isMobile?i.touches[0].clientY:i.clientY}),document.addEventListener(r,i=>{if(this._isDragging){const o=this._isMobile?i.touches[0].clientX:i.clientX,s=this._isMobile?i.touches[0].clientY:i.clientY,a=o-this._initialX,c=s-this._initialY;this._rotate=Ue(this._rotate,this._rotate,x(c/10,a/10)),this._initialX=o,this._initialY=s}}),document.addEventListener(n,()=>{this._isDragging=!1})}getViewRotationMatrix(){const t=F();return pe(t,t,L(this._rotate[1])),de(t,t,L(this._rotate[0])),t}}class G{static async loadImageBitmap(t){const n=await(await fetch(t)).blob();return await createImageBitmap(n,{colorSpaceConversion:"none"})}static async generateMips(t,r){let n=t;const i=[n];let o=0;for(;o<r&&(n.width>1||n.height>1);)n=await this.createNextMipLevelRgba8Unorm(n),i.push(n),o++;return i}static async createNextMipLevelRgba8Unorm(t){const r=Math.max(1,t.width/2|0),n=Math.max(1,t.height/2|0),i=document.createElement("canvas");i.width=r,i.height=n;const o=i.getContext("2d");if(!o)throw new Error("Unable to get 2D context");return o.drawImage(t,0,0,r,n),createImageBitmap(i)}}class Te{constructor(t){f(this,"_device");f(this,"_texture");this._device=t}get view(){return this._texture||console.error("You need to initialize texture first!"),this._texture.createView({dimension:"cube"})}async initialize(t,r=0){const n=await Promise.all(t.map(G.loadImageBitmap));if(this._texture=this._device.createTexture({label:"yellow F on red",size:[n[0].width,n[0].height,n.length],mipLevelCount:r+1,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),!this._texture){console.error("Failed to load texture");return}for(let i=0;i<6;i++)(await G.generateMips(n[i],r)).forEach((s,a)=>{this._device.queue.copyExternalImageToTexture({source:s,flipY:!1},{texture:this._texture,origin:[0,0,i],mipLevel:a},{width:s.width,height:s.height})})}}class Se{constructor(t,r){f(this,"_label");f(this,"_device");f(this,"_vertices");f(this,"_indices");f(this,"_vertexBuffer");f(this,"_indexBuffer");this._label=r,this._device=t,this._vertices=[],this._indices=[]}initialize(){const t=[];for(let i=0;i<this._vertices.length;i++){const{position:o,velocity:s,color:a,texCoord:c,radius:h,mass:p}=this._vertices[i];t.push(...o,0,...s,0,...a,0,...c,h,p)}const r=new Float32Array(t);this._vertexBuffer=this._device.createBuffer({label:`${this._label}-vertex-buffer`,size:r.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._vertexBuffer,0,r);const n=new Uint32Array(this._indices);this._indexBuffer=this._device.createBuffer({label:`${this._label}-index-buffer`,size:n.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._indexBuffer,0,n)}draw(t){if(!this._vertexBuffer||!this._indexBuffer){console.error(`${this._label} mesh was not initialized!`);return}if(!t){console.error(`GPURenderPassEncoder was not passed to ${this._label} mesh`);return}t.setVertexBuffer(0,this._vertexBuffer),t.setIndexBuffer(this._indexBuffer,"uint32"),t.drawIndexed(this._indices.length)}}class Ce extends Se{constructor(t){super(t,"skybox"),this._vertices.push({position:l(-1,1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(-1,-1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,-1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(-1,1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(-1,-1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,-1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._indices.push(0,1,2,2,1,3,2,3,5,5,3,7,5,7,4,4,7,6,4,6,0,0,6,1,4,0,5,5,0,2,1,6,3,3,6,7),this.initialize()}}class ze{constructor(t,r){f(this,"_label");f(this,"_device");f(this,"_pointBuffer");f(this,"_billboardBuffer");this._device=t,this._label=r}async initialize(t){const r=[];for(let i=0;i<t.length;++i){const{position:o,velocity:s,color:a,texCoord:c,radius:h,mass:p}=t[i];r.push(...o,0,...s,0,...a,0,...c,h,p)}const n=new Float32Array(r);this._pointBuffer=this._device.createBuffer({label:`${this._label} point vertex buffer`,size:n.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._pointBuffer,0,n),this._billboardBuffer=this._device.createBuffer({label:`${this._label} billboard vertex buffer`,size:n.byteLength*6,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}get point(){return this._pointBuffer||console.error(`${this._label} vertex buffers should be initialized first!`),this._pointBuffer}get billboard(){return this._billboardBuffer||console.error(`${this._label} vertex buffers should be initialized first!`),this._billboardBuffer}}class W{constructor({label:t,device:r,computeShader:n}){f(this,"_label");f(this,"_pipeline");this._label=t,this._pipeline=r.createComputePipeline({label:`${t} compute pipeline`,layout:"auto",compute:{module:r.createShaderModule({label:`${t} compute shader`,code:n})}})}getBindGroupLayout(t){return this._pipeline.getBindGroupLayout(t)}use(t){t||console.error(`GPUComputePassEncoder was not passed to ${this._label} pipeline`),t.setPipeline(this._pipeline)}}class Ve{constructor(t){f(this,"_device");f(this,"_texture");this._device=t}get view(){return this._texture||console.error("You need to initialize texture first!"),this._texture.createView()}async initialize(t,r=0){const n=await G.loadImageBitmap(t),i=await G.generateMips(n,r);if(this._texture=this._device.createTexture({label:"yellow F on red",size:[i[0].width,i[0].height],mipLevelCount:i.length,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),!this._texture){console.error("Failed to load texture");return}i.forEach((o,s)=>{this._device.queue.copyExternalImageToTexture({source:o,flipY:!1},{texture:this._texture,mipLevel:s},{width:o.width,height:o.height})})}}const H=window.innerWidth,k=window.innerHeight;async function Ge(){const e=new ce(document.querySelector("canvas"));if(await e.initialize(H,k),!e.device)return;const t="",r=new Te(e.device);await r.initialize([t+"cubemap/px.jpg",t+"cubemap/nx.jpg",t+"cubemap/py.jpg",t+"cubemap/ny.jpg",t+"cubemap/pz.jpg",t+"cubemap/nz.jpg"]);const n=new Ve(e.device);await n.initialize(t+"star.png");const i=e.device.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"}),o=new W({label:"movement",device:e.device,computeShader:ie}),s=new W({label:"billboard",device:e.device,computeShader:ne}),a=new j({label:"main",device:e.device,vertexShader:re,fragmentShader:oe}),c=new j({label:"bg",device:e.device,vertexShader:se,fragmentShader:ae}),h=new Ce(e.device),p=3,v=[];v.push({position:l(0,0,0),velocity:l(0,0,0),color:l(.8,.2,.2),texCoord:x(0,0),radius:.5,mass:.05}),v.push({position:l(4,-1,-2),velocity:l(0,0,0),color:l(.2,.8,.8),texCoord:x(0,0),radius:.2,mass:.02}),v.push({position:l(-2,4,-4),velocity:l(0,0,0),color:l(.8,.8,.2),texCoord:x(0,0),radius:.3,mass:.03});const d=new ze(e.device,"object");await d.initialize(v);const u=e.device.createBuffer({label:"matrix uniforms",size:32*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=e.device.createBuffer({label:"frag uniforms",size:1*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),m=e.device.createBuffer({label:"camera uniforms",size:8*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=e.device.createBuffer({label:"time uniform buffer",size:Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),T=e.device.createBindGroup({label:"bind group for object",layout:a.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:n.view},{binding:2,resource:i},{binding:3,resource:{buffer:b}}]}),S=e.device.createBindGroup({label:"compute movement bind group",layout:o.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d.point}},{binding:1,resource:{buffer:_}}]}),C=e.device.createBindGroup({label:"compute billboard bind group",layout:s.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d.point}},{binding:1,resource:{buffer:d.billboard}},{binding:2,resource:{buffer:m}}]}),z=e.device.createBindGroup({label:"bind group for object",layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:u}},{binding:1,resource:i},{binding:2,resource:r.view}]}),B=new Pe({position:l(0,0,2.5),center:l(0,0,0),up:l(0,1,0)}),M=F();he(M,L(90),H/k,.1,100);let Y=0;const U=e.device.createBuffer({label:"result buffer",size:16*3*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST});async function N(){var I,D,q,$;const R=performance.now(),K=R-Y;Y=R,(I=e.device)==null||I.queue.writeBuffer(_,0,new Float32Array([K])),(D=e.device)==null||D.queue.writeBuffer(b,0,new Float32Array([R*.001]));const Q=B.getViewMatrix();(q=e.device)==null||q.queue.writeBuffer(u,0,new Float32Array([...Q,...M])),($=e.device)==null||$.queue.writeBuffer(m,0,new Float32Array([...B.position,0,...B.up,0])),e.setEncoder();const w=e.getComputePass();o.use(w),w.setBindGroup(0,S),w.dispatchWorkgroups(1,1),s.use(w),w.setBindGroup(0,C),w.dispatchWorkgroups(1,1),w.end();const y=e.getGraphicsPass();c.use(y),y==null||y.setBindGroup(0,z),h.draw(y),a.use(y),y==null||y.setBindGroup(0,T),y.setVertexBuffer(0,d.billboard),y.draw(p*6),y.end(),e.encoder.copyBufferToBuffer(d.point,0,U,0,U.size),e.finishEncoder(),await U.mapAsync(GPUMapMode.READ);const Z=new Float32Array(U.getMappedRange().slice(0));U.unmap(),console.log(Z),requestAnimationFrame(N)}N()}Ge();
