var k=Object.defineProperty;var J=(e,t,n)=>t in e?k(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var u=(e,t,n)=>(J(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();var K=`struct VSOutput {
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

@group(0) @binding(0) var<storage, read_write> objects: array<Vertex>;
@group(0) @binding(1) var<uniform> delta: f32;

@compute @workgroup_size(256) fn computeSomething(
    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,
) {
    let numBodies:u32 = 3;
    let index = global_invocation_id.x;
    var body : Vertex = objects[index];
    var acceleration = vec3<f32>(0.0, 0.0, 0.0);

    for (var i = 0u; i < numBodies; i++) {
        if (i != index) {
            let other : Vertex = objects[i];
            let distance_vec = other.position - body.position;
            let distance = length(distance_vec);
            let force = (0.0000067 * body.mass * other.mass) / distance * distance;
            let direction = normalize(distance_vec);
            acceleration += direction * force / body.mass;
        }
    }

    body.velocity += acceleration * delta;
    body.position += body.velocity * delta;
    objects[index] = body;
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

@group(0) @binding(0) var<uniform> uni: MatrixUniforms;

@vertex fn vs(
  input: Vertex,
) -> VSOutput {

  var output: VSOutput;
  output.position = uni.projection * uni.view * vec4f(input.position, 1.0);
  output.texCoord = input.texCoord;
  output.color = input.color;
  return output;
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

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {

  let dist:f32 = length(input.texCoord - vec2f(0.5, 0.5));

  if(dist > 0.5)
  {
      discard;
  }
  
  return vec4f(input.color, 1.0);
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

@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var envCubemap: texture_cube<f32>;

@fragment fn fs(input: VSOutput) -> @location(0) vec4f {
  let envColor:vec3f = textureSample(envCubemap, mySampler, input.posWorld).rgb;
  
  return vec4f(envColor, 1.0);
}`;class ne{constructor(t){u(this,"_canvas");u(this,"_adapter");u(this,"_device");u(this,"_context");u(this,"_encoder");u(this,"_pass");u(this,"_depthTexture");this._canvas=t}get device(){return this._device}async initialize(t,n){var i,r,o;if(this._canvas.style.width=`${t}px`,this._canvas.style.height=`${n}px`,this._canvas.width=t*2,this._canvas.height=n*2,this._adapter=await((i=navigator.gpu)==null?void 0:i.requestAdapter()),this._device=await((r=this._adapter)==null?void 0:r.requestDevice()),!this._device){const s="Your device does not support WebGPU.";console.error(s);const c=document.createElement("p");c.innerHTML=s,(o=document.querySelector("body"))==null||o.prepend(c)}this._context=this._canvas.getContext("webgpu"),this._context.configure({device:this._device,format:navigator.gpu.getPreferredCanvasFormat()})}setEncoder(){if(!this._device){console.error("RenderEnv was not initialized!");return}this._encoder=this._device.createCommandEncoder({label:"encoder"})}get encoder(){return this._encoder}getGraphicsPass(){(!this._context||!this._device)&&console.error("RenderEnv was not initialized!"),this._encoder||console.error("Encoder was not created!");const t=this._context.getCurrentTexture();(!this._depthTexture||this._depthTexture.width!==t.width||this._depthTexture.height!==t.height)&&(this._depthTexture&&this._depthTexture.destroy(),this._depthTexture=this._device.createTexture({size:[t.width,t.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT}));const n={label:"render pass",colorAttachments:[{view:t.createView(),clearValue:[0,0,0,1],loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:this._depthTexture.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}};return this._pass=this._encoder.beginRenderPass(n),this._pass}getComputePass(){return this._encoder||console.error("Encoder was not created!"),this._encoder.beginComputePass({label:"compute pass"})}finishEncoder(){this._device||console.error("RenderEnv was not initialized!"),this._encoder||console.error("Encoder was not created!");const t=this._encoder.finish();this._device.queue.submit([t])}}class N{constructor({label:t,device:n,vertexShader:i,fragmentShader:r}){u(this,"_label");u(this,"_pipeline");this._label=t,this._pipeline=n.createRenderPipeline({label:`${t} pipeline`,layout:"auto",vertex:{module:n.createShaderModule({label:`${t} vertex shader`,code:i}),buffers:[{arrayStride:16*Float32Array.BYTES_PER_ELEMENT,attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:4*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:2,offset:8*Float32Array.BYTES_PER_ELEMENT,format:"float32x3"},{shaderLocation:3,offset:12*Float32Array.BYTES_PER_ELEMENT,format:"float32x2"},{shaderLocation:4,offset:14*Float32Array.BYTES_PER_ELEMENT,format:"float32"},{shaderLocation:5,offset:15*Float32Array.BYTES_PER_ELEMENT,format:"float32"}]}]},fragment:{module:n.createShaderModule({label:`${t} fragment shader`,code:r}),targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"back"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less-equal",format:"depth24plus"}})}getBindGroupLayout(t){return this._pipeline.getBindGroupLayout(t)}use(t){t||console.error(`GPURenderPassEncoder was not passed to ${this._label} pipeline`),t.setPipeline(this._pipeline)}}const V=1e-6;let m=typeof Float32Array<"u"?Float32Array:Array;const re=Math.PI/180;function R(e){return e*re}function oe(){let e=new m(9);return m!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function O(){let e=new m(16);return m!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function se(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function ce(e,t,n){let i=Math.sin(n),r=Math.cos(n),o=t[4],s=t[5],c=t[6],a=t[7],v=t[8],f=t[9],p=t[10],h=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=o*r+v*i,e[5]=s*r+f*i,e[6]=c*r+p*i,e[7]=a*r+h*i,e[8]=v*r-o*i,e[9]=f*r-s*i,e[10]=p*r-c*i,e[11]=h*r-a*i,e}function ae(e,t,n){let i=Math.sin(n),r=Math.cos(n),o=t[0],s=t[1],c=t[2],a=t[3],v=t[8],f=t[9],p=t[10],h=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=o*r-v*i,e[1]=s*r-f*i,e[2]=c*r-p*i,e[3]=a*r-h*i,e[8]=o*i+v*r,e[9]=s*i+f*r,e[10]=c*i+p*r,e[11]=a*i+h*r,e}function le(e,t,n,i,r){const o=1/Math.tan(t/2);if(e[0]=o/n,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,r!=null&&r!==1/0){const s=1/(i-r);e[10]=(r+i)*s,e[14]=2*r*i*s}else e[10]=-1,e[14]=-2*i;return e}const ue=le;function fe(e,t,n,i){let r,o,s,c,a,v,f,p,h,d,b=t[0],_=t[1],g=t[2],T=i[0],S=i[1],E=i[2],M=n[0],P=n[1],U=n[2];return Math.abs(b-M)<V&&Math.abs(_-P)<V&&Math.abs(g-U)<V?se(e):(f=b-M,p=_-P,h=g-U,d=1/Math.sqrt(f*f+p*p+h*h),f*=d,p*=d,h*=d,r=S*h-E*p,o=E*f-T*h,s=T*p-S*f,d=Math.sqrt(r*r+o*o+s*s),d?(d=1/d,r*=d,o*=d,s*=d):(r=0,o=0,s=0),c=p*s-h*o,a=h*r-f*s,v=f*o-p*r,d=Math.sqrt(c*c+a*a+v*v),d?(d=1/d,c*=d,a*=d,v*=d):(c=0,a=0,v=0),e[0]=r,e[1]=c,e[2]=f,e[3]=0,e[4]=o,e[5]=a,e[6]=p,e[7]=0,e[8]=s,e[9]=v,e[10]=h,e[11]=0,e[12]=-(r*b+o*_+s*g),e[13]=-(c*b+a*_+v*g),e[14]=-(f*b+p*_+h*g),e[15]=1,e)}function B(){let e=new m(3);return m!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function de(e){let t=e[0],n=e[1],i=e[2];return Math.sqrt(t*t+n*n+i*i)}function l(e,t,n){let i=new m(3);return i[0]=e,i[1]=t,i[2]=n,i}function pe(e,t){let n=t[0],i=t[1],r=t[2],o=n*n+i*i+r*r;return o>0&&(o=1/Math.sqrt(o)),e[0]=t[0]*o,e[1]=t[1]*o,e[2]=t[2]*o,e}function he(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function z(e,t,n){let i=t[0],r=t[1],o=t[2],s=n[0],c=n[1],a=n[2];return e[0]=r*a-o*c,e[1]=o*s-i*a,e[2]=i*c-r*s,e}function C(e,t,n){let i=t[0],r=t[1],o=t[2],s=n[3]*i+n[7]*r+n[11]*o+n[15];return s=s||1,e[0]=(n[0]*i+n[4]*r+n[8]*o+n[12])/s,e[1]=(n[1]*i+n[5]*r+n[9]*o+n[13])/s,e[2]=(n[2]*i+n[6]*r+n[10]*o+n[14])/s,e}const ve=de;(function(){let e=B();return function(t,n,i,r,o,s){let c,a;for(n||(n=3),i||(i=0),r?a=Math.min(r*n+i,t.length):a=t.length,c=i;c<a;c+=n)e[0]=t[c],e[1]=t[c+1],e[2]=t[c+2],o(e,e,s),t[c]=e[0],t[c+1]=e[1],t[c+2]=e[2];return t}})();function _e(){let e=new m(4);return m!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function ge(e,t){let n=t[0],i=t[1],r=t[2],o=t[3],s=n*n+i*i+r*r+o*o;return s>0&&(s=1/Math.sqrt(s)),e[0]=n*s,e[1]=i*s,e[2]=r*s,e[3]=o*s,e}(function(){let e=_e();return function(t,n,i,r,o,s){let c,a;for(n||(n=4),i||(i=0),r?a=Math.min(r*n+i,t.length):a=t.length,c=i;c<a;c+=n)e[0]=t[c],e[1]=t[c+1],e[2]=t[c+2],e[3]=t[c+3],o(e,e,s),t[c]=e[0],t[c+1]=e[1],t[c+2]=e[2],t[c+3]=e[3];return t}})();function I(){let e=new m(4);return m!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function me(e,t,n){n=n*.5;let i=Math.sin(n);return e[0]=i*t[0],e[1]=i*t[1],e[2]=i*t[2],e[3]=Math.cos(n),e}function G(e,t,n,i){let r=t[0],o=t[1],s=t[2],c=t[3],a=n[0],v=n[1],f=n[2],p=n[3],h,d,b,_,g;return d=r*a+o*v+s*f+c*p,d<0&&(d=-d,a=-a,v=-v,f=-f,p=-p),1-d>V?(h=Math.acos(d),b=Math.sin(h),_=Math.sin((1-i)*h)/b,g=Math.sin(i*h)/b):(_=1-i,g=i),e[0]=_*r+g*a,e[1]=_*o+g*v,e[2]=_*s+g*f,e[3]=_*c+g*p,e}function xe(e,t){let n=t[0]+t[4]+t[8],i;if(n>0)i=Math.sqrt(n+1),e[3]=.5*i,i=.5/i,e[0]=(t[5]-t[7])*i,e[1]=(t[6]-t[2])*i,e[2]=(t[1]-t[3])*i;else{let r=0;t[4]>t[0]&&(r=1),t[8]>t[r*3+r]&&(r=2);let o=(r+1)%3,s=(r+2)%3;i=Math.sqrt(t[r*3+r]-t[o*3+o]-t[s*3+s]+1),e[r]=.5*i,i=.5/i,e[3]=(t[o*3+s]-t[s*3+o])*i,e[o]=(t[o*3+r]+t[r*3+o])*i,e[s]=(t[s*3+r]+t[r*3+s])*i}return e}const W=ge;(function(){let e=B(),t=l(1,0,0),n=l(0,1,0);return function(i,r,o){let s=he(r,o);return s<-.999999?(z(e,t,r),ve(e)<1e-6&&z(e,n,r),pe(e,e),me(i,e,Math.PI),i):s>.999999?(i[0]=0,i[1]=0,i[2]=0,i[3]=1,i):(z(e,r,o),i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=1+s,W(i,i))}})();(function(){let e=I(),t=I();return function(n,i,r,o,s,c){return G(e,i,s,c),G(t,r,o,c),G(n,e,t,2*c*(1-c)),n}})();(function(){let e=oe();return function(t,n,i,r){return e[0]=i[0],e[3]=i[1],e[6]=i[2],e[1]=r[0],e[4]=r[1],e[7]=r[2],e[2]=-n[0],e[5]=-n[1],e[8]=-n[2],W(t,xe(t,e))}})();function be(){let e=new m(2);return m!=Float32Array&&(e[0]=0,e[1]=0),e}function x(e,t){let n=new m(2);return n[0]=e,n[1]=t,n}function ye(e,t,n){return e[0]=t[0]+n[0],e[1]=t[1]+n[1],e}(function(){let e=be();return function(t,n,i,r,o,s){let c,a;for(n||(n=2),i||(i=0),r?a=Math.min(r*n+i,t.length):a=t.length,c=i;c<a;c+=n)e[0]=t[c],e[1]=t[c+1],o(e,e,s),t[c]=e[0],t[c+1]=e[1];return t}})();class we{constructor({position:t,center:n,up:i}){u(this,"_position");u(this,"_center");u(this,"_up");u(this,"_rotate");u(this,"_isMobile");u(this,"_isDragging");u(this,"_initialX");u(this,"_initialY");this._position=t,this._center=n,this._up=i,this._rotate=x(0,0),this._isDragging=!1,this._initialX=0,this._initialY=0,this._isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),this.initializeEvent()}get position(){const t=this.getViewRotationMatrix(),n=B();return C(n,this._position,t),n}get up(){const t=this.getViewRotationMatrix(),n=B();return C(n,this._up,t),n}getViewMatrix(){const t=O(),n=this.getViewRotationMatrix(),i=B(),r=B(),o=B();return C(i,this._position,n),C(r,this._center,n),C(o,this._up,n),fe(t,i,r,o),t}initializeEvent(){const t=this._isMobile?"touchstart":"mousedown",n=this._isMobile?"touchmove":"mousemove",i=this._isMobile?"touchend":"mouseup";document.addEventListener(t,r=>{this._isDragging=!0,this._initialX=this._isMobile?r.touches[0].clientX:r.clientX,this._initialY=this._isMobile?r.touches[0].clientY:r.clientY}),document.addEventListener(n,r=>{if(this._isDragging){const o=this._isMobile?r.touches[0].clientX:r.clientX,s=this._isMobile?r.touches[0].clientY:r.clientY,c=o-this._initialX,a=s-this._initialY;this._rotate=ye(this._rotate,this._rotate,x(a/10,c/10)),this._initialX=o,this._initialY=s}}),document.addEventListener(i,()=>{this._isDragging=!1})}getViewRotationMatrix(){const t=O();return ae(t,t,R(this._rotate[1])),ce(t,t,R(this._rotate[0])),t}}class ${static async loadImageBitmap(t){const i=await(await fetch(t)).blob();return await createImageBitmap(i,{colorSpaceConversion:"none"})}static async generateMips(t,n){let i=t;const r=[i];let o=0;for(;o<n&&(i.width>1||i.height>1);)i=await this.createNextMipLevelRgba8Unorm(i),r.push(i),o++;return r}static async createNextMipLevelRgba8Unorm(t){const n=Math.max(1,t.width/2|0),i=Math.max(1,t.height/2|0),r=document.createElement("canvas");r.width=n,r.height=i;const o=r.getContext("2d");if(!o)throw new Error("Unable to get 2D context");return o.drawImage(t,0,0,n,i),createImageBitmap(r)}}class Be{constructor(t){u(this,"_device");u(this,"_texture");this._device=t}get view(){return this._texture||console.error("You need to initialize texture first!"),this._texture.createView({dimension:"cube"})}async initialize(t,n=0){const i=await Promise.all(t.map($.loadImageBitmap));if(this._texture=this._device.createTexture({label:"yellow F on red",size:[i[0].width,i[0].height,i.length],mipLevelCount:n+1,format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),!this._texture){console.error("Failed to load texture");return}for(let r=0;r<6;r++)(await $.generateMips(i[r],n)).forEach((s,c)=>{this._device.queue.copyExternalImageToTexture({source:s,flipY:!1},{texture:this._texture,origin:[0,0,r],mipLevel:c},{width:s.width,height:s.height})})}}class Ee{constructor(t,n){u(this,"_label");u(this,"_device");u(this,"_vertices");u(this,"_indices");u(this,"_vertexBuffer");u(this,"_indexBuffer");this._label=n,this._device=t,this._vertices=[],this._indices=[]}initialize(){const t=[];for(let r=0;r<this._vertices.length;r++){const{position:o,velocity:s,color:c,texCoord:a,radius:v,mass:f}=this._vertices[r];t.push(...o,0,...s,0,...c,0,...a,v,f)}const n=new Float32Array(t);this._vertexBuffer=this._device.createBuffer({label:`${this._label}-vertex-buffer`,size:n.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._vertexBuffer,0,n);const i=new Uint32Array(this._indices);this._indexBuffer=this._device.createBuffer({label:`${this._label}-index-buffer`,size:i.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._indexBuffer,0,i)}draw(t){if(!this._vertexBuffer||!this._indexBuffer){console.error(`${this._label} mesh was not initialized!`);return}if(!t){console.error(`GPURenderPassEncoder was not passed to ${this._label} mesh`);return}t.setVertexBuffer(0,this._vertexBuffer),t.setIndexBuffer(this._indexBuffer,"uint32"),t.drawIndexed(this._indices.length)}}class Me extends Ee{constructor(t){super(t,"skybox"),this._vertices.push({position:l(-1,1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(-1,-1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,-1,-1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(-1,1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(-1,-1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._vertices.push({position:l(1,-1,1),velocity:l(0,0,0),color:l(0,0,0),texCoord:x(0,0),radius:0,mass:0}),this._indices.push(0,1,2,2,1,3,2,3,5,5,3,7,5,7,4,4,7,6,4,6,0,0,6,1,4,0,5,5,0,2,1,6,3,3,6,7),this.initialize()}}class Pe{constructor(t,n){u(this,"_label");u(this,"_device");u(this,"_pointBuffer");u(this,"_billboardBuffer");this._device=t,this._label=n}async initialize(t){const n=[];for(let r=0;r<t.length;++r){const{position:o,velocity:s,color:c,texCoord:a,radius:v,mass:f}=t[r];n.push(...o,0,...s,0,...c,0,...a,v,f)}const i=new Float32Array(n);this._pointBuffer=this._device.createBuffer({label:`${this._label} point vertex buffer`,size:i.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),this._device.queue.writeBuffer(this._pointBuffer,0,i),this._billboardBuffer=this._device.createBuffer({label:`${this._label} billboard vertex buffer`,size:i.byteLength*6,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST})}get point(){return this._pointBuffer||console.error(`${this._label} vertex buffers should be initialized first!`),this._pointBuffer}get billboard(){return this._billboardBuffer||console.error(`${this._label} vertex buffers should be initialized first!`),this._billboardBuffer}}class j{constructor({label:t,device:n,computeShader:i}){u(this,"_label");u(this,"_pipeline");this._label=t,this._pipeline=n.createComputePipeline({label:`${t} compute pipeline`,layout:"auto",compute:{module:n.createShaderModule({label:`${t} compute shader`,code:i})}})}getBindGroupLayout(t){return this._pipeline.getBindGroupLayout(t)}use(t){t||console.error(`GPUComputePassEncoder was not passed to ${this._label} pipeline`),t.setPipeline(this._pipeline)}}const q=window.innerWidth,D=window.innerHeight;async function Ue(){const e=new ne(document.querySelector("canvas"));if(await e.initialize(q,D),!e.device)return;const t="",n=new Be(e.device);await n.initialize([t+"cubemap/px.jpg",t+"cubemap/nx.jpg",t+"cubemap/py.jpg",t+"cubemap/ny.jpg",t+"cubemap/pz.jpg",t+"cubemap/nz.jpg"]);const i=e.device.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear"}),r=new j({label:"movement",device:e.device,computeShader:Q}),o=new j({label:"billboard",device:e.device,computeShader:K}),s=new N({label:"main",device:e.device,vertexShader:Z,fragmentShader:ee}),c=new N({label:"bg",device:e.device,vertexShader:te,fragmentShader:ie}),a=new Me(e.device),v=3,f=[];f.push({position:l(0,0,0),velocity:l(0,0,0),color:l(.8,.2,.2),texCoord:x(0,0),radius:.2,mass:.05}),f.push({position:l(4,-1,-2),velocity:l(0,0,0),color:l(.2,.8,.8),texCoord:x(0,0),radius:.1,mass:.02}),f.push({position:l(-2,4,-4),velocity:l(0,0,0),color:l(.8,.8,.2),texCoord:x(0,0),radius:.3,mass:.03});const p=new Pe(e.device,"object");await p.initialize(f);const h=e.device.createBuffer({label:"matrix uniforms",size:32*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=e.device.createBuffer({label:"camera uniforms",size:8*Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),b=e.device.createBuffer({label:"time uniform buffer",size:Float32Array.BYTES_PER_ELEMENT,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=e.device.createBindGroup({label:"bind group for object",layout:s.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:h}}]}),g=e.device.createBindGroup({label:"compute movement bind group",layout:r.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p.point}},{binding:1,resource:{buffer:b}}]}),T=e.device.createBindGroup({label:"compute billboard bind group",layout:o.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:p.point}},{binding:1,resource:{buffer:p.billboard}},{binding:2,resource:{buffer:d}}]}),S=e.device.createBindGroup({label:"bind group for object",layout:c.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:i},{binding:2,resource:n.view}]}),E=new we({position:l(0,0,2.5),center:l(0,0,0),up:l(0,1,0)}),M=O();ue(M,R(45),q/D,.1,100);let P=0;async function U(){var L,F,Y;const A=performance.now(),X=A-P;P=A,(L=e.device)==null||L.queue.writeBuffer(b,0,new Float32Array([X]));const H=E.getViewMatrix();(F=e.device)==null||F.queue.writeBuffer(h,0,new Float32Array([...H,...M])),(Y=e.device)==null||Y.queue.writeBuffer(d,0,new Float32Array([...E.position,0,...E.up,0])),e.setEncoder();const w=e.getComputePass();r.use(w),w.setBindGroup(0,g),w.dispatchWorkgroups(1,1),o.use(w),w.setBindGroup(0,T),w.dispatchWorkgroups(1,1),w.end();const y=e.getGraphicsPass();c.use(y),y==null||y.setBindGroup(0,S),a.draw(y),s.use(y),y==null||y.setBindGroup(0,_),y.setVertexBuffer(0,p.billboard),y.draw(v*6),y.end(),e.finishEncoder(),requestAnimationFrame(U)}U()}Ue();
