var X=Object.defineProperty;var W=(e,t,n)=>t in e?X(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var u=(e,t,n)=>(W(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();var H=`struct VSOutput {
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
}`,k=`struct VSOutput {
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
}`,J=`struct VSOutput {
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

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {

  let dist:f32 = length(input.texCoord - vec2f(0.5, 0.5));

  if(dist > 0.5)
  {
      discard;
  }
  
  return vec4f(input.color, 1.0);
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

@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var envCubemap: texture_cube<f32>;

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {
  let envColor:vec3f = textureSample(envCubemap, mySampler, input.posWorld).rgb;
  
  return vec4f(envColor, 1.0);
}`;class Z{constructor(t){u(this,"_canvas");u(this,"_adapter");u(this,"_device");u(this,"_context");u(this,"_encoder");u(this,"_pass");u(this,"_depthTexture");this._canvas=t}get device(){return this._device}async initialize(t,n){var i,r,o;if(this._canvas.style.width=`${t}px`,this._canvas.style.height=`${n}px`,this._canvas.width=t*2,this._canvas.height=n*2,this._adapter=await((i=navigator.gpu)==null?void 0:i.requestAdapter()),this._device=await((r=this._adapter)==null?void 0:r.requestDevice()),!this._device){const s="Your device does not support WebGPU.";console.error(s);const a=document.createElement("p");a.innerHTML=s,(o=document.querySelector("body"))==null||o.prepend(a)}this._context=this._canvas.getContext("webgpu"),this._context.configure({device:this._device,format:navigator.gpu.getPreferredCanvasFormat()})}setEncoder(){if(!this._device){console.error("RenderEnv was not initialized!");return}this._encoder=this._device.createCommandEncoder({label:"encoder"})}get encoder(){return this._encoder}getGraphicsPass(){(!this._context||!this._device)&&console.error("RenderEnv was not initialized!"),this._encoder||console.error("Encoder was not created!");const t=this._context.getCurrentTexture();(!this._depthTexture||this._depthTexture.width!==t.width||this._depthTexture.height!==t.height)&&(this._depthTexture&&this._depthTexture.destroy(),this._depthTexture=this._device.createTexture({size:[t.width,t.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}));const n={label:"render pass",colorAttachments:[{view:t.createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}};return this._pass=this._encoder.beginRenderPass(n),this._pass}getComputePass(){return this._encoder||console.error("Encoder was not created!"),this._encoder.beginComputePass({label:"compute pass"})}finishEncoder(){this._device||console.error("RenderEnv was not initialized!"),this._encoder||console.error("Encoder was not created!");const t=this._encoder.finish();this._device.queue.submit([t])}}class Y{constructor({label:t,device:n,vertexShader:i,fragmentShader:r}){u(this,"_label");u(this,"_pipeline");this._label=t,this._pipeline=n.createRenderPipeline({label:`${t} pipeline`,layout:"auto",vertex:{module:n.createShaderModule({label:`${t} vertex shader`,code:i}),buffers:[{arrayStride:16*Float32Array.BYTES_PER_ELEMENT,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:4*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:2,offset:8*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:3,offset:12*Float32Array.BYTES_PER_ELEMENT,format:"float32x2"},{shaderLocation:4,offset:14*Float32Array.BYTES_PER_ELEMENT,format:"float32"},{shaderLocation:5,offset:15*Float32Array.BYTES_PER_ELEMENT,format:"float32"}]}]},fragment:{module:n.createShaderModule({label:`${t} fragment shader`,code:r}),targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less-equal",format:"depth24plus"}})}getBindGroupLayout(t){return this._pipeline.getBindGroupLayout(t)}use(t){t||console.error(`GPURenderPassEncoder was not passed to ${this._label} pipeline`),t.setPipeline(this._pipeline)}}const z=1e-6;let x=typeof Float32Array<"u"?Float32Array:Array;const ee=Math.PI/180;function R(e){return e*ee}function te(){let e=new x(9);return x!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function A(){let e=new x(16);return x!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function ie(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function ne(e,t,n){let i=Math.sin(n),r=Math.cos(n),o=t[4],s=t[5],a=t[6],c=t[7],d=t[8],f=t[9],h=t[10],v=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=o*r+d*i,e[5]=s*r+f*i,e[6]=a*r+h*i,e[7]=c*r+v*i,e[8]=d*r-o*i,e[9]=f*r-s*i,e[10]=h*r-a*i,e[11]=v*r-c*i,e}function re(e,t,n){let i=Math.sin(n),r=Math.cos(n),o=t[0],s=t[1],a=t[2],c=t[3],d=t[8],f=t[9],h=t[10],v=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=o*r-d*i,e[1]=s*r-f*i,e[2]=a*r-h*i,e[3]=c*r-v*i,e[8]=o*i+d*r,e[9]=s*i+f*r,e[10]=a*i+h*r,e[11]=c*i+v*r,e}function oe(e,t,n,i,r){const o=1/Math.tan(t/2);if(e[0]=o/n,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,r!=null&&r!==1/0){const s=1/(i-r);e[10]=(r+i)*s,e[14]=2*r*i*s}else e[10]=-1,e[14]=-2*i;return e}const se=oe;function ae(e,t,n,i){let r,o,s,a,c,d,f,h,v,p,y=t[0],_=t[1],g=t[2],E=i[0],B=i[1],M=i[2],P=n[0],U=n[1],T=n[2];return Math.abs(y-P)<z&&Math.abs(_-U)<z&&Math.abs(g-T)<z?ie(e):(f=y-P,h=_-U,v=g-T,p=1/Math.sqrt(f*f+h*h+v*v),f*=p,h*=p,v*=p,r=B*v-M*h,o=M*f-E*v,s=E*h-B*f,p=Math.sqrt(r*r+o*o+s*s),p?(p=1/p,r*=p,o*=p,s*=p):(r=0,o=0,s=0),a=h*s-v*o,c=v*r-f*s,d=f*o-h*r,p=Math.sqrt(a*a+c*c+d*d),p?(p=1/p,a*=p,c*=p,d*=p):(a=0,c=0,d=0),e[0]=r,e[1]=a,e[2]=f,e[3]=0,e[4]=o,e[5]=c,e[6]=h,e[7]=0,e[8]=s,e[9]=d,e[10]=v,e[11]=0,e[12]=-(r*y+o*_+s*g),e[13]=-(a*y+c*_+d*g),e[14]=-(f*y+h*_+v*g),e[15]=1,e)}function w(){let e=new x(3);return x!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function ce(e){let t=e[0],n=e[1],i=e[2];return Math.sqrt(t*t+n*n+i*i)}function l(e,t,n){let i=new x(3);return i[0]=e,i[1]=t,i[2]=n,i}function le(e,t){let n=t[0],i=t[1],r=t[2],o=n*n+i*i+r*r;return o>0&&(o=1/Math.sqrt(o)),e[0]=t[0]*o,e[1]=t[1]*o,e[2]=t[2]*o,e}function ue(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function V(e,t,n){let i=t[0],r=t[1],o=t[2],s=n[0],a=n[1],c=n[2];return e[0]=r*c-o*a,e[1]=o*s-i*c,e[2]=i*a-r*s,e}function C(e,t,n){let i=t[0],r=t[1],o=t[2],s=n[3]*i+n[7]*r+n[11]*o+n[15];return s=s||1,e[0]=(n[0]*i+n[4]*r+n[8]*o+n[12])/s,e[1]=(n[1]*i+n[5]*r+n[9]*o+n[13])/s,e[2]=(n[2]*i+n[6]*r+n[10]*o+n[14])/s,e}const fe=ce;(function(){let e=w();return function(t,n,i,r,o,s){let a,c;for(n||(n=3),i||(i=0),r?c=Math.min(r*n+i,t.length):c=t.length,a=i;a<c;a+=n)e[0]=t[a],e[1]=t[a+1],e[2]=t[a+2],o(e,e,s),t[a]=e[0],t[a+1]=e[1],t[a+2]=e[2];return t}})();function de(){let e=new x(4);return x!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function pe(e,t){let n=t[0],i=t[1],r=t[2],o=t[3],s=n*n+i*i+r*r+o*o;return s>0&&(s=1/Math.sqrt(s)),e[0]=n*s,e[1]=i*s,e[2]=r*s,e[3]=o*s,e}(function(){let e=de();return function(t,n,i,r,o,s){let a,c;for(n||(n=4),i||(i=0),r?c=Math.min(r*n+i,t.length):c=t.length,a=i;a<c;a+=n)e[0]=t[a],e[1]=t[a+1],e[2]=t[a+2],e[3]=t[a+3],o(e,e,s),t[a]=e[0],t[a+1]=e[1],t[a+2]=e[2],t[a+3]=e[3];return t}})();function N(){let e=new x(4);return x!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function he(e,t,n){n=n*.5;let i=Math.sin(n);return e[0]=i*t[0],e[1]=i*t[1],e[2]=i*t[2],e[3]=Math.cos(n),e}function G(e,t,n,i){let r=t[0],o=t[1],s=t[2],a=t[3],c=n[0],d=n[1],f=n[2],h=n[3],v,p,y,_,g;return p=r*c+o*d+s*f+a*h,p<0&&(p=-p,c=-c,d=-d,f=-f,h=-h),1-p>z?(v=Math.acos(p),y=Math.sin(v),_=Math.sin((1-i)*v)/y,g=Math.sin(i*v)/y):(_=1-i,g=i),e[0]=_*r+g*c,e[1]=_*o+g*d,e[2]=_*s+g*f,e[3]=_*a+g*h,e}function ve(e,t){let n=t[0]+t[4]+t[8],i;if(n>0)i=Math.sqrt(n+1),e[3]=.5*i,i=.5/i,e[0]=(t[5]-t[7])*i,e[1]=(t[6]-t[2])*i,e[2]=(t[1]-t[3])*i;else{let r=0;t[4]>t[0]&&(r=1),t[8]>t[r*3+r]&&(r=2);let o=(r+1)%3,s=(r+2)%3;i=Math.sqrt(t[r*3+r]-t[o*3+o]-t[s*3+s]+1),e[r]=.5*i,i=.5/i,e[3]=(t[o*3+s]-t[s*3+o])*i,e[o]=(t[o*3+r]+t[r*3+o])*i,e[s]=(t[s*3+r]+t[r*3+s])*i}return e}const D=pe;(function(){let e=w(),t=l(1,0,0),n=l(0,1,0);return function(i,r,o){let s=ue(r,o);return s<-.999999?(V(e,t,r),fe(e)<1e-6&&V(e,n,r),le(e,e),he(i,e,Math.PI),i):s>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(V(e,r,o),i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=1+s,D(i,i))}})();(function(){let e=N(),t=N();return function(n,i,r,o,s,a){return G(e,i,s,a),G(t,r,o,a),G(n,e,t,2*a*(1-a)),n}})();(function(){let e=te();return function(t,n,i,r){return e[0]=i[0],e[3]=i[1],e[6]=i[2],e[1]=r[0],e[4]=r[1],e[7]=r[2],e[2]=-n[0],e[5]=-n[1],e[8]=-n[2],D(t,ve(t,e))}})();function _e(){let e=new x(2);return x!=Float32Array&&(e[0]=0,e[1]=0),e}function m(e,t){let n=new x(2);return n[0]=e,n[1]=t,n}function ge(e,t,n){return e[0]=t[0]+n[0],e[1]=t[1]+n[1],e}(function(){let e=_e();return function(t,n,i,r,o,s){let a,c;for(n||(n=2),i||(i=0),r?c=Math.min(r*n+i,t.length):c=t.length,a=i;a<c;a+=n)e[0]=t[a],e[1]=t[a+1],o(e,e,s),t[a]=e[0],t[a+1]=e[1];return t}})();class xe{constructor({position:t,center:n,up:i}){u(this,"_position");u(this,"_center");u(this,"_up");u(this,"_rotate");u(this,"_isMobile");u(this,"_isDragging");u(this,"_initialX");u(this,"_initialY");this._position=t,this._center=n,this._up=i,this._rotate=m(0,0),this._isDragging=!1,this._initialX=0,this._initialY=0,this._isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.initializeEvent()}get position(){const t=this.getViewRotationMatrix(),n=w();return C(n,this._position,t),n}get up(){const t=this.getViewRotationMatrix(),n=w();return C(n,this._up,t),n}getViewMatrix(){const t=A(),n=this.getViewRotationMatrix(),i=w(),r=w(),o=w();return C(i,this._position,n),C(r,this._center,n),C(o,this._up,n),ae(t,i,r,o),t}initializeEvent(){const t=this._isMobile?"touchstart":"mousedown",n=this._isMobile?"touchmove":"mousemove",i=this._isMobile?"touchend":"mouseup";document.addEventListener(t,r=>{this._isDragging=!0,this._initialX=this._isMobile?r.touches[0].clientX:r.clientX,this._initialY=this._isMobile?r.touches[0].clientY:r.clientY}),document.addEventListener(n,r=>{if(this._isDragging){const o=this._isMobile?r.touches[0].clientX:r.clientX,s=this._isMobile?r.touches[0].clientY:r.clientY,a=o-this._initialX,c=s-this._initialY;this._rotate=ge(this._rotate,this._rotate,m(c/10,a/10)),this._initialX=o,this._initialY=s}}),document.addEventListener(i,()=>{this._isDragging=!1})}getViewRotationMatrix(){const t=A();return re(t,t,R(this._rotate[1])),ne(t,t,R(this._rotate[0])),t}}class I{static async loadImageBitmap(t){const i=await(await fetch(t)).blob();return await createImageBitmap(i,{colorSpaceConversion:"none"})}static async generateMips(t,n){let i=t;const r=[i];let o=0;for(;o<n&&(i.width>1||i.height>1);)i=await this.createNextMipLevelRgba8Unorm(i),r.push(i),o++;return r}static async createNextMipLevelRgba8Unorm(t){const n=Math.max(1,t.width/2|0),i=Math.max(1,t.height/2|0),r=document.createElement("canvas");r.width=n,r.height=i;const o=r.getContext("2d");if(!o)throw new Error("Unable to get 2D context");return o.drawImage(t,0,0,n,i),createImageBitmap(r)}}class me{constructor(t){u(this,"_device");u(this,"_texture");this._device=t}get view(){return this._texture||console.error("You need to initialize texture first!"),this._texture.createView({dimension:"cube"})}async initialize(t,n=0){const i=await Promise.all(t.map(I.loadImageBitmap));if(this._texture=this._device.createTexture({label:"yellow F on red",size:[i[0].width,i[0].height,i.length],mipLevelCount:n+1,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),!this._texture){console.error("Failed to load texture");return}for(let r=0;r<6;r++)(await I.generateMips(i[r],n)).forEach((s,a)=>{this._device.queue.copyExternalImageToTexture({source:s,flipY:!1},{texture:this._texture,origin:[0,0,r],mipLevel:a},{width:s.width,height:s.height})})}}class be{constructor(t,n){u(this,"_label");u(this,"_device");u(this,"_vertices");u(this,"_indices");u(this,"_vertexBuffer");u(this,"_indexBuffer");this._label=n,this._device=t,this._vertices=[],this._indices=[]}initialize(){const t=[];for(let r=0;r<this._vertices.length;r++){const{position:o,velocity:s,color:a,texCoord:c,radius:d,mass:f}=this._vertices[r];t.push(...o,0,...s,0,...a,0,...c,d,f)}const n=new Float32Array(t);this._vertexBuffer=this._device.createBuffer({label:`${this._label}-vertex-buffer`,size:n.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._vertexBuffer,0,n);const i=new Uint32Array(this._indices);this._indexBuffer=this._device.createBuffer({label:`${this._label}-index-buffer`,size:i.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._indexBuffer,0,i)}draw(t){if(!this._vertexBuffer||!this._indexBuffer){console.error(`${this._label} mesh was not initialized!`);return}if(!t){console.error(`GPURenderPassEncoder was not passed to ${this._label} mesh`);return}t.setVertexBuffer(0,this._vertexBuffer),t.setIndexBuffer(this._indexBuffer,"uint32"),t.drawIndexed(this._indices.length)}}class ye extends be{constructor(t){super(t,"skybox"),this._vertices.push({position:l(-1,1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:m(0,0),radius:0,mass:0}),this._vertices.push({position:l(-1,-1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:m(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:m(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,-1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:m(0,0),radius:0,mass:0}),this._vertices.push({position:l(-1,1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:m(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:m(0,0),radius:0,mass:0}),this._vertices.push({position:l(-1,-1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:m(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,-1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:m(0,0),radius:0,mass:0}),this._indices.push(0,1,2,2,1,3,2,3,5,5,3,7,5,7,4,4,7,6,4,6,0,0,6,1,4,0,5,5,0,2,1,6,3,3,6,7),this.initialize()}}class we{constructor(t,n){u(this,"_label");u(this,"_device");u(this,"_pointBuffer");u(this,"_billboardBuffer");this._device=t,this._label=n}async initialize(t){const n=[];for(let r=0;r<t.length;++r){const{position:o,velocity:s,color:a,texCoord:c,radius:d,mass:f}=t[r];n.push(...o,0,...s,0,...a,0,...c,d,f)}const i=new Float32Array(n);this._pointBuffer=this._device.createBuffer({label:`${this._label} point vertex buffer`,size:i.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._pointBuffer,0,i),this._billboardBuffer=this._device.createBuffer({label:`${this._label} billboard vertex buffer`,size:i.byteLength*6,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}get point(){return this._pointBuffer||console.error(`${this._label} vertex buffers should be initialized first!`),this._pointBuffer}get billboard(){return this._billboardBuffer||console.error(`${this._label} vertex buffers should be initialized first!`),this._billboardBuffer}}class Ee{constructor({label:t,device:n,computeShader:i}){u(this,"_label");u(this,"_pipeline");this._label=t,this._pipeline=n.createComputePipeline({label:`${t} compute pipeline`,layout:"auto",compute:{module:n.createShaderModule({label:`${t} compute shader`,code:i})}})}getBindGroupLayout(t){return this._pipeline.getBindGroupLayout(t)}use(t){t||console.error(`GPUComputePassEncoder was not passed to ${this._label} pipeline`),t.setPipeline(this._pipeline)}}const $=window.innerWidth,q=window.innerHeight;async function Be(){const e=new Z(document.querySelector("canvas"));if(await e.initialize($,q),!e.device)return;const t="",n=new me(e.device);await n.initialize([t+"cubemap/px.jpg",t+"cubemap/nx.jpg",t+"cubemap/py.jpg",t+"cubemap/ny.jpg",t+"cubemap/pz.jpg",t+"cubemap/nz.jpg"]);const i=e.device.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"}),r=new Ee({label:"billboard",device:e.device,computeShader:H}),o=new Y({label:"main",device:e.device,vertexShader:k,fragmentShader:J}),s=new Y({label:"bg",device:e.device,vertexShader:K,fragmentShader:Q}),a=new ye(e.device),c=3,d=[];d.push({position:l(0,0,0),velocity:l(0,0,0),color:l(.8,.2,.2),texCoord:m(0,0),radius:.2,mass:.05}),d.push({position:l(4,-1,-2),velocity:l(0,0,0),color:l(.2,.8,.8),texCoord:m(0,0),radius:.1,mass:.02}),d.push({position:l(-2,4,-4),velocity:l(0,0,0),color:l(.8,.8,.2),texCoord:m(0,0),radius:.3,mass:.03});const f=new we(e.device,"object");await f.initialize(d);const h=e.device.createBuffer({label:"matrix uniforms",size:32*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),v=e.device.createBuffer({label:"camera uniforms",size:8*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),p=e.device.createBuffer({label:"time uniform buffer",size:Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),y=e.device.createBindGroup({label:"bind group for object",layout:o.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:h}}]}),_=e.device.createBindGroup({label:"compute billboard bind group",layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:f.point}},{binding:1,resource:{buffer:f.billboard}},{binding:2,resource:{buffer:v}}]}),g=e.device.createBindGroup({label:"bind group for object",layout:s.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:i},{binding:2,resource:n.view}]}),E=new xe({position:l(0,0,2.5),center:l(0,0,0),up:l(0,1,0)}),B=A();se(B,R(45),$/q,.1,100);let M=0;async function P(){var O,L,F;const U=performance.now(),T=U-M;M=U,(O=e.device)==null||O.queue.writeBuffer(p,0,new Float32Array([T]));const j=E.getViewMatrix();(L=e.device)==null||L.queue.writeBuffer(h,0,new Float32Array([...j,...B])),(F=e.device)==null||F.queue.writeBuffer(v,0,new Float32Array([...E.position,0,...E.up,0])),e.setEncoder();const S=e.getComputePass();r.use(S),S.setBindGroup(0,_),S.dispatchWorkgroups(1,1),S.end();const b=e.getGraphicsPass();s.use(b),b==null||b.setBindGroup(0,g),a.draw(b),o.use(b),b==null||b.setBindGroup(0,y),b.setVertexBuffer(0,f.billboard),b.draw(c*6),b.end(),e.finishEncoder(),requestAnimationFrame(P)}P()}Be();
