// based on https://www.shadertoy.com/view/4dXGR4
#include "common.wgsl"

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
}