

f32 freqs[4];

void mainImage( out vec4f fragColor, in vec2f fragCoord )
{
	freqs[0] = texture( iChannel1, vec2f( 0.01, 0.25 ) ).x;
	freqs[1] = texture( iChannel1, vec2f( 0.07, 0.25 ) ).x;
	freqs[2] = texture( iChannel1, vec2f( 0.15, 0.25 ) ).x;
	freqs[3] = texture( iChannel1, vec2f( 0.30, 0.25 ) ).x;

	f32 brightness	= freqs[1] * 0.25 + freqs[2] * 0.25;
	f32 radius		= 0.24 + brightness * 0.2;
	f32 invRadius 	= 1.0/radius;
	
	vec3f orange			= vec3f( 0.8, 0.0, 0.0 );
	vec3f orangeRed		= vec3f( 0.8, 0.0, 0.0 );
	f32 time		= iTime * 0.1;
	f32 aspect	= iResolution.x/iResolution.y;
	vec2f uv			= fragCoord.xy / iResolution.xy;
	vec2f p 			= -0.5 + uv;
	p.x *= aspect;

	f32 fade		= pow( length( 2.0 * p ), 0.5 );
	f32 fVal1		= 1.0 - fade;
	f32 fVal2		= 1.0 - fade;
	
	f32 angle		= atan( p.x, p.y )/6.2832;
	f32 dist		= length(p);
	vec3f coord		= vec3f( angle, dist, time * 0.1 );
	
	f32 newTime1	= abs( snoise( coord + vec3f( 0.0, -time * ( 0.35 + brightness * 0.001 ), time * 0.015 ), 15.0 ) );
	f32 newTime2	= abs( snoise( coord + vec3f( 0.0, -time * ( 0.15 + brightness * 0.001 ), time * 0.015 ), 45.0 ) );	
	for( int i=1; i<=7; i++ ){
		f32 power = pow( 2.0, f32(i + 1) );
		fVal1 += ( 0.5 / power ) * snoise( coord + vec3f( 0.0, -time, time * 0.2 ), ( power * ( 10.0 ) * ( newTime1 + 1.0 ) ) );
		fVal2 += ( 0.5 / power ) * snoise( coord + vec3f( 0.0, -time, time * 0.2 ), ( power * ( 25.0 ) * ( newTime2 + 1.0 ) ) );
	}
	
	f32 corona		= pow( fVal1 * max( 1.1 - fade, 0.0 ), 2.0 ) * 50.0;
	corona				+= pow( fVal2 * max( 1.1 - fade, 0.0 ), 2.0 ) * 50.0;
	corona				*= 1.2 - newTime1;
	vec3f sphereNormal 	= vec3f( 0.0, 0.0, 1.0 );
	vec3f dir 			= vec3f( 0.0 );
	vec3f center			= vec3f( 0.5, 0.5, 1.0 );
	vec3f starSphere		= vec3f( 0.0 );
	
	vec2f sp = -1.0 + 2.0 * uv;
	sp.x *= aspect;
	sp *= ( 2.0 - brightness );
  	f32 r = dot(sp,sp);
	f32 f = (1.0-sqrt(abs(1.0-r)))/(r) + brightness * 0.5;
	if( dist < radius ){
		corona			*= pow( dist * invRadius, 24.0 );
  		vec2f newUv;
 		newUv.x = sp.x*f;
  		newUv.y = sp.y*f;
		newUv += vec2f( time, 0.0 );
		
		vec3f texSample 	= texture( iChannel0, newUv ).rgb;
		f32 uOff		= ( texSample.g * brightness * 4.5 + time );
		vec2f starUV		= newUv + vec2f( uOff, 0.0 );
		starSphere		= texture( iChannel0, starUV ).rgb;
	}
	
	f32 starGlow	= min( max( 1.0 - dist * ( 1.0 - brightness ), 0.0 ), 1.0 );
	//fragColor.rgb	= vec3f( r );
	fragColor.rgb	= vec3f( f * ( 0.75 + brightness * 0.3 ) * orange ) + starSphere + corona * orange + starGlow * orangeRed;
	fragColor.a		= 1.0;
}

