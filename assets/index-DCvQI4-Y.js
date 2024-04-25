var I=Object.defineProperty;var N=(e,t,n)=>t in e?I(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var l=(e,t,n)=>(N(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();var q=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) texCoord: vec2f,
  @location(3) radius: f32,
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
        outputVertex[startIndex * 6 + i] = Vertex(newPos, input.velocity, tex[i], input.radius);
    }
}`,D=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) texCoord: vec2f,
  @location(3) radius: f32,
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
  return output;
}`,j=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) texCoord: vec2f,
  @location(3) radius: f32,
};

struct MatrixUniforms {
  view: mat4x4f,
  projection: mat4x4f,
};

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {
  let dist:f32 = length(input.texCoord - vec2f(0.5, 0.5));

  if(dist > 0.5)
  {
      discard;
  }
  
  return vec4f(1.0, 0.0, 0.0, 1.0);
}`,X=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) texCoord: vec2f,
  @location(3) radius: f32,
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
}`,W=`struct VSOutput {
  @builtin(position) position: vec4f,
  @location(1) texCoord: vec2f,
  @location(2) posWorld: vec3f,
};

struct Vertex {
  @location(0) position: vec3f,
  @location(1) velocity: vec3f,
  @location(2) texCoord: vec2f,
  @location(3) radius: f32,
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
}`;class H{constructor(t){l(this,"_canvas");l(this,"_adapter");l(this,"_device");l(this,"_context");l(this,"_encoder");l(this,"_pass");l(this,"_depthTexture");this._canvas=t}get device(){return this._device}async initialize(t,n){var i,r,o;if(this._canvas.style.width=`${t}px`,this._canvas.style.height=`${n}px`,this._canvas.width=t*2,this._canvas.height=n*2,this._adapter=await((i=navigator.gpu)==null?void 0:i.requestAdapter()),this._device=await((r=this._adapter)==null?void 0:r.requestDevice()),!this._device){const s="Your device does not support WebGPU.";console.error(s);const a=document.createElement("p");a.innerHTML=s,(o=document.querySelector("body"))==null||o.prepend(a)}this._context=this._canvas.getContext("webgpu"),this._context.configure({device:this._device,format:navigator.gpu.getPreferredCanvasFormat()})}setEncoder(){if(!this._device){console.error("RenderEnv was not initialized!");return}this._encoder=this._device.createCommandEncoder({label:"encoder"})}get encoder(){return this._encoder}getGraphicsPass(){(!this._context||!this._device)&&console.error("RenderEnv was not initialized!"),this._encoder||console.error("Encoder was not created!");const t=this._context.getCurrentTexture();(!this._depthTexture||this._depthTexture.width!==t.width||this._depthTexture.height!==t.height)&&(this._depthTexture&&this._depthTexture.destroy(),this._depthTexture=this._device.createTexture({size:[t.width,t.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}));const n={label:"render pass",colorAttachments:[{view:t.createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}};return this._pass=this._encoder.beginRenderPass(n),this._pass}getComputePass(){return this._encoder||console.error("Encoder was not created!"),this._encoder.beginComputePass({label:"compute pass"})}finishEncoder(){this._device||console.error("RenderEnv was not initialized!"),this._encoder||console.error("Encoder was not created!");const t=this._encoder.finish();this._device.queue.submit([t])}}class O{constructor({label:t,device:n,vertexShader:i,fragmentShader:r}){l(this,"_label");l(this,"_pipeline");this._label=t,this._pipeline=n.createRenderPipeline({label:`${t} pipeline`,layout:"auto",vertex:{module:n.createShaderModule({label:`${t} vertex shader`,code:i}),buffers:[{arrayStride:12*Float32Array.BYTES_PER_ELEMENT,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:4*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:2,offset:8*Float32Array.BYTES_PER_ELEMENT,format:"float32x2"},{shaderLocation:3,offset:10*Float32Array.BYTES_PER_ELEMENT,format:"float32"}]}]},fragment:{module:n.createShaderModule({label:`${t} fragment shader`,code:r}),targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less-equal",format:"depth24plus"}})}getBindGroupLayout(t){return this._pipeline.getBindGroupLayout(t)}use(t){t||console.error(`GPURenderPassEncoder was not passed to ${this._label} pipeline`),t.setPipeline(this._pipeline)}}const T=1e-6;let b=typeof Float32Array<"u"?Float32Array:Array;const k=Math.PI/180;function V(e){return e*k}function J(){let e=new b(9);return b!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function G(){let e=new b(16);return b!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function K(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Q(e,t,n){let i=Math.sin(n),r=Math.cos(n),o=t[4],s=t[5],a=t[6],c=t[7],v=t[8],f=t[9],d=t[10],h=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=o*r+v*i,e[5]=s*r+f*i,e[6]=a*r+d*i,e[7]=c*r+h*i,e[8]=v*r-o*i,e[9]=f*r-s*i,e[10]=d*r-a*i,e[11]=h*r-c*i,e}function Z(e,t,n){let i=Math.sin(n),r=Math.cos(n),o=t[0],s=t[1],a=t[2],c=t[3],v=t[8],f=t[9],d=t[10],h=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=o*r-v*i,e[1]=s*r-f*i,e[2]=a*r-d*i,e[3]=c*r-h*i,e[8]=o*i+v*r,e[9]=s*i+f*r,e[10]=a*i+d*r,e[11]=c*i+h*r,e}function ee(e,t,n,i,r){const o=1/Math.tan(t/2);if(e[0]=o/n,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,r!=null&&r!==1/0){const s=1/(i-r);e[10]=(r+i)*s,e[14]=2*r*i*s}else e[10]=-1,e[14]=-2*i;return e}const te=ee;function ie(e,t,n,i){let r,o,s,a,c,v,f,d,h,u,y=t[0],x=t[1],_=t[2],M=i[0],E=i[1],U=i[2],w=n[0],g=n[1],P=n[2];return Math.abs(y-w)<T&&Math.abs(x-g)<T&&Math.abs(_-P)<T?K(e):(f=y-w,d=x-g,h=_-P,u=1/Math.sqrt(f*f+d*d+h*h),f*=u,d*=u,h*=u,r=E*h-U*d,o=U*f-M*h,s=M*d-E*f,u=Math.sqrt(r*r+o*o+s*s),u?(u=1/u,r*=u,o*=u,s*=u):(r=0,o=0,s=0),a=d*s-h*o,c=h*r-f*s,v=f*o-d*r,u=Math.sqrt(a*a+c*c+v*v),u?(u=1/u,a*=u,c*=u,v*=u):(a=0,c=0,v=0),e[0]=r,e[1]=a,e[2]=f,e[3]=0,e[4]=o,e[5]=c,e[6]=d,e[7]=0,e[8]=s,e[9]=v,e[10]=h,e[11]=0,e[12]=-(r*y+o*x+s*_),e[13]=-(a*y+c*x+v*_),e[14]=-(f*y+d*x+h*_),e[15]=1,e)}function B(){let e=new b(3);return b!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function ne(e){let t=e[0],n=e[1],i=e[2];return Math.sqrt(t*t+n*n+i*i)}function p(e,t,n){let i=new b(3);return i[0]=e,i[1]=t,i[2]=n,i}function re(e,t){let n=t[0],i=t[1],r=t[2],o=n*n+i*i+r*r;return o>0&&(o=1/Math.sqrt(o)),e[0]=t[0]*o,e[1]=t[1]*o,e[2]=t[2]*o,e}function oe(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function S(e,t,n){let i=t[0],r=t[1],o=t[2],s=n[0],a=n[1],c=n[2];return e[0]=r*c-o*a,e[1]=o*s-i*c,e[2]=i*a-r*s,e}function C(e,t,n){let i=t[0],r=t[1],o=t[2],s=n[3]*i+n[7]*r+n[11]*o+n[15];return s=s||1,e[0]=(n[0]*i+n[4]*r+n[8]*o+n[12])/s,e[1]=(n[1]*i+n[5]*r+n[9]*o+n[13])/s,e[2]=(n[2]*i+n[6]*r+n[10]*o+n[14])/s,e}const se=ne;(function(){let e=B();return function(t,n,i,r,o,s){let a,c;for(n||(n=3),i||(i=0),r?c=Math.min(r*n+i,t.length):c=t.length,a=i;a<c;a+=n)e[0]=t[a],e[1]=t[a+1],e[2]=t[a+2],o(e,e,s),t[a]=e[0],t[a+1]=e[1],t[a+2]=e[2];return t}})();function ae(){let e=new b(4);return b!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function ce(e,t){let n=t[0],i=t[1],r=t[2],o=t[3],s=n*n+i*i+r*r+o*o;return s>0&&(s=1/Math.sqrt(s)),e[0]=n*s,e[1]=i*s,e[2]=r*s,e[3]=o*s,e}(function(){let e=ae();return function(t,n,i,r,o,s){let a,c;for(n||(n=4),i||(i=0),r?c=Math.min(r*n+i,t.length):c=t.length,a=i;a<c;a+=n)e[0]=t[a],e[1]=t[a+1],e[2]=t[a+2],e[3]=t[a+3],o(e,e,s),t[a]=e[0],t[a+1]=e[1],t[a+2]=e[2],t[a+3]=e[3];return t}})();function A(){let e=new b(4);return b!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function le(e,t,n){n=n*.5;let i=Math.sin(n);return e[0]=i*t[0],e[1]=i*t[1],e[2]=i*t[2],e[3]=Math.cos(n),e}function z(e,t,n,i){let r=t[0],o=t[1],s=t[2],a=t[3],c=n[0],v=n[1],f=n[2],d=n[3],h,u,y,x,_;return u=r*c+o*v+s*f+a*d,u<0&&(u=-u,c=-c,v=-v,f=-f,d=-d),1-u>T?(h=Math.acos(u),y=Math.sin(h),x=Math.sin((1-i)*h)/y,_=Math.sin(i*h)/y):(x=1-i,_=i),e[0]=x*r+_*c,e[1]=x*o+_*v,e[2]=x*s+_*f,e[3]=x*a+_*d,e}function ue(e,t){let n=t[0]+t[4]+t[8],i;if(n>0)i=Math.sqrt(n+1),e[3]=.5*i,i=.5/i,e[0]=(t[5]-t[7])*i,e[1]=(t[6]-t[2])*i,e[2]=(t[1]-t[3])*i;else{let r=0;t[4]>t[0]&&(r=1),t[8]>t[r*3+r]&&(r=2);let o=(r+1)%3,s=(r+2)%3;i=Math.sqrt(t[r*3+r]-t[o*3+o]-t[s*3+s]+1),e[r]=.5*i,i=.5/i,e[3]=(t[o*3+s]-t[s*3+o])*i,e[o]=(t[o*3+r]+t[r*3+o])*i,e[s]=(t[s*3+r]+t[r*3+s])*i}return e}const $=ce;(function(){let e=B(),t=p(1,0,0),n=p(0,1,0);return function(i,r,o){let s=oe(r,o);return s<-.999999?(S(e,t,r),se(e)<1e-6&&S(e,n,r),re(e,e),le(i,e,Math.PI),i):s>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(S(e,r,o),i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=1+s,$(i,i))}})();(function(){let e=A(),t=A();return function(n,i,r,o,s,a){return z(e,i,s,a),z(t,r,o,a),z(n,e,t,2*a*(1-a)),n}})();(function(){let e=J();return function(t,n,i,r){return e[0]=i[0],e[3]=i[1],e[6]=i[2],e[1]=r[0],e[4]=r[1],e[7]=r[2],e[2]=-n[0],e[5]=-n[1],e[8]=-n[2],$(t,ue(t,e))}})();function fe(){let e=new b(2);return b!=Float32Array&&(e[0]=0,e[1]=0),e}function m(e,t){let n=new b(2);return n[0]=e,n[1]=t,n}function de(e,t,n){return e[0]=t[0]+n[0],e[1]=t[1]+n[1],e}(function(){let e=fe();return function(t,n,i,r,o,s){let a,c;for(n||(n=2),i||(i=0),r?c=Math.min(r*n+i,t.length):c=t.length,a=i;a<c;a+=n)e[0]=t[a],e[1]=t[a+1],o(e,e,s),t[a]=e[0],t[a+1]=e[1];return t}})();class pe{constructor({position:t,center:n,up:i}){l(this,"_position");l(this,"_center");l(this,"_up");l(this,"_rotate");l(this,"_isMobile");l(this,"_isDragging");l(this,"_initialX");l(this,"_initialY");this._position=t,this._center=n,this._up=i,this._rotate=m(0,0),this._isDragging=!1,this._initialX=0,this._initialY=0,this._isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.initializeEvent()}get position(){const t=this.getViewRotationMatrix(),n=B();return C(n,this._position,t),n}get up(){const t=this.getViewRotationMatrix(),n=B();return C(n,this._up,t),n}getViewMatrix(){const t=G(),n=this.getViewRotationMatrix(),i=B(),r=B(),o=B();return C(i,this._position,n),C(r,this._center,n),C(o,this._up,n),ie(t,i,r,o),t}initializeEvent(){const t=this._isMobile?"touchstart":"mousedown",n=this._isMobile?"touchmove":"mousemove",i=this._isMobile?"touchend":"mouseup";document.addEventListener(t,r=>{this._isDragging=!0,this._initialX=this._isMobile?r.touches[0].clientX:r.clientX,this._initialY=this._isMobile?r.touches[0].clientY:r.clientY}),document.addEventListener(n,r=>{if(this._isDragging){const o=this._isMobile?r.touches[0].clientX:r.clientX,s=this._isMobile?r.touches[0].clientY:r.clientY,a=o-this._initialX,c=s-this._initialY;this._rotate=de(this._rotate,this._rotate,m(c/10,a/10)),this._initialX=o,this._initialY=s,r.preventDefault()}}),document.addEventListener(i,()=>{this._isDragging=!1})}getViewRotationMatrix(){const t=G();return Z(t,t,V(this._rotate[1])),Q(t,t,V(this._rotate[0])),t}}class L{static async loadImageBitmap(t){const i=await(await fetch(t)).blob();return await createImageBitmap(i,{colorSpaceConversion:"none"})}static async generateMips(t,n){let i=t;const r=[i];let o=0;for(;o<n&&(i.width>1||i.height>1);)i=await this.createNextMipLevelRgba8Unorm(i),r.push(i),o++;return r}static async createNextMipLevelRgba8Unorm(t){const n=Math.max(1,t.width/2|0),i=Math.max(1,t.height/2|0),r=document.createElement("canvas");r.width=n,r.height=i;const o=r.getContext("2d");if(!o)throw new Error("Unable to get 2D context");return o.drawImage(t,0,0,n,i),createImageBitmap(r)}}class he{constructor(t){l(this,"_device");l(this,"_texture");this._device=t}get view(){return this._texture||console.error("You need to initialize texture first!"),this._texture.createView({dimension:"cube"})}async initialize(t,n=0){const i=await Promise.all(t.map(L.loadImageBitmap));if(this._texture=this._device.createTexture({label:"yellow F on red",size:[i[0].width,i[0].height,i.length],mipLevelCount:n+1,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),!this._texture){console.error("Failed to load texture");return}for(let r=0;r<6;r++)(await L.generateMips(i[r],n)).forEach((s,a)=>{this._device.queue.copyExternalImageToTexture({source:s,flipY:!1},{texture:this._texture,origin:[0,0,r],mipLevel:a},{width:s.width,height:s.height})})}}class ve{constructor(t,n){l(this,"_label");l(this,"_device");l(this,"_vertices");l(this,"_indices");l(this,"_vertexBuffer");l(this,"_indexBuffer");this._label=n,this._device=t,this._vertices=[],this._indices=[]}initialize(){const t=[];for(let r=0;r<this._vertices.length;r++){const{position:o,velocity:s,texCoord:a,radius:c}=this._vertices[r];t.push(...o,0,...s,0,...a,c,0)}const n=new Float32Array(t);this._vertexBuffer=this._device.createBuffer({label:`${this._label}-vertex-buffer`,size:n.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._vertexBuffer,0,n);const i=new Uint32Array(this._indices);this._indexBuffer=this._device.createBuffer({label:`${this._label}-index-buffer`,size:i.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._indexBuffer,0,i)}draw(t){if(!this._vertexBuffer||!this._indexBuffer){console.error(`${this._label} mesh was not initialized!`);return}if(!t){console.error(`GPURenderPassEncoder was not passed to ${this._label} mesh`);return}t.setVertexBuffer(0,this._vertexBuffer),t.setIndexBuffer(this._indexBuffer,"uint32"),t.drawIndexed(this._indices.length)}}class _e extends ve{constructor(t){super(t,"skybox"),this._vertices.push({position:p(-1,1,-1),velocity:p(0,0,0),texCoord:m(0,0),radius:0}),this._vertices.push({position:p(-1,-1,-1),velocity:p(0,0,0),texCoord:m(0,0),radius:0}),this._vertices.push({position:p(1,1,-1),velocity:p(0,0,0),texCoord:m(0,0),radius:0}),this._vertices.push({position:p(1,-1,-1),velocity:p(0,0,0),texCoord:m(0,0),radius:0}),this._vertices.push({position:p(-1,1,1),velocity:p(0,0,0),texCoord:m(0,0),radius:0}),this._vertices.push({position:p(1,1,1),velocity:p(0,0,0),texCoord:m(0,0),radius:0}),this._vertices.push({position:p(-1,-1,1),velocity:p(0,0,0),texCoord:m(0,0),radius:0}),this._vertices.push({position:p(1,-1,1),velocity:p(0,0,0),texCoord:m(0,0),radius:0}),this._indices.push(0,1,2,2,1,3,2,3,5,5,3,7,5,7,4,4,7,6,4,6,0,0,6,1,4,0,5,5,0,2,1,6,3,3,6,7),this.initialize()}}class ge{constructor(t,n){l(this,"_label");l(this,"_device");l(this,"_pointBuffer");l(this,"_billboardBuffer");this._device=t,this._label=n}async initialize(t){const n=[];for(let r=0;r<t.length;++r){const{position:o,velocity:s,texCoord:a,radius:c}=t[r];n.push(...o,0,...s,0,...a,c,0)}const i=new Float32Array(n);this._pointBuffer=this._device.createBuffer({label:`${this._label} point vertex buffer`,size:i.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._pointBuffer,0,i),this._billboardBuffer=this._device.createBuffer({label:`${this._label} billboard vertex buffer`,size:i.byteLength*6,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}get point(){return this._pointBuffer||console.error(`${this._label} vertex buffers should be initialized first!`),this._pointBuffer}get billboard(){return this._billboardBuffer||console.error(`${this._label} vertex buffers should be initialized first!`),this._billboardBuffer}}class xe{constructor({label:t,device:n,computeShader:i}){l(this,"_label");l(this,"_pipeline");this._label=t,this._pipeline=n.createComputePipeline({label:`${t} compute pipeline`,layout:"auto",compute:{module:n.createShaderModule({label:`${t} compute shader`,code:i})}})}getBindGroupLayout(t){return this._pipeline.getBindGroupLayout(t)}use(t){t||console.error(`GPUComputePassEncoder was not passed to ${this._label} pipeline`),t.setPipeline(this._pipeline)}}const Y=window.innerWidth,F=window.innerHeight;async function be(){const e=new H(document.querySelector("canvas"));if(await e.initialize(Y,F),!e.device)return;const t="",n=new he(e.device);await n.initialize([t+"cubemap/px.jpg",t+"cubemap/nx.jpg",t+"cubemap/py.jpg",t+"cubemap/ny.jpg",t+"cubemap/pz.jpg",t+"cubemap/nz.jpg"]);const i=e.device.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"}),r=new xe({label:"billboard",device:e.device,computeShader:q}),o=new O({label:"main",device:e.device,vertexShader:D,fragmentShader:j}),s=new O({label:"bg",device:e.device,vertexShader:X,fragmentShader:W}),a=new _e(e.device),c=2,v=[];v.push({position:p(-5,0,-7),velocity:p(0,0,0),texCoord:m(0,0),radius:1}),v.push({position:p(5,0,-7),velocity:p(0,0,0),texCoord:m(0,0),radius:1});const f=new ge(e.device,"object");await f.initialize(v);const d=e.device.createBuffer({label:"vertex uniforms",size:32*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),h=e.device.createBuffer({label:"vertex uniforms",size:8*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),u=e.device.createBindGroup({label:"bind group for object",layout:o.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}}]}),y=e.device.createBindGroup({label:"compute billboard bind group",layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f.point}},{binding:1,resource:{buffer:f.billboard}},{binding:2,resource:{buffer:h}}]}),x=e.device.createBindGroup({label:"bind group for object",layout:s.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:i},{binding:2,resource:n.view}]}),_=new pe({position:p(0,0,2.5),center:p(0,0,0),up:p(0,1,0)}),M=G();te(M,V(45),Y/F,.1,100);async function E(){var P,R;const U=_.getViewMatrix();(P=e.device)==null||P.queue.writeBuffer(d,0,new Float32Array([...U,...M])),(R=e.device)==null||R.queue.writeBuffer(h,0,new Float32Array([..._.position,0,..._.up,0])),e.setEncoder();const w=e.getComputePass();r.use(w),w.setBindGroup(0,y),w.dispatchWorkgroups(1,1),w.end();const g=e.getGraphicsPass();s.use(g),g==null||g.setBindGroup(0,x),a.draw(g),o.use(g),g==null||g.setBindGroup(0,u),g.setVertexBuffer(0,f.billboard),g.draw(c*6),g.end(),e.finishEncoder(),requestAnimationFrame(E)}E()}be();
