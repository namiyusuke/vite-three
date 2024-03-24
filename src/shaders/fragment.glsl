  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uTextureAspect;
  uniform float uScreenAspect;
  uniform float uValue;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uVelo;
  uniform vec2 resolution;

// float random (vec2 p) {
//     return fract(sin(dot(p.xy, vec2(12.9898,78.233)))* 43758.5453123);
// }

  	float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
		uv -= disc_center;
		uv*=resolution;
		float dist = sqrt(dot(uv, uv));
		return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
	}
  void main() {
  vec4 color = vec4(1.,0.,0.,1.);
  vec2 ratio = vec2(
    min(uScreenAspect / uTextureAspect, 1.0),
    min(uTextureAspect / uScreenAspect, 1.0)
  );
  // vec2 newUV = vUv;
  // 中央に配置するための計算
  vec2 textureUv = vec2(
    (vUv.x - 0.5) * ratio.x + 0.5,
    (vUv.y - 0.5) * ratio.y + 0.5
  );

    float c = circle(vUv, uMouse, 0.0, 0.27);
    float r = texture2D(uTexture, textureUv.xy += c * (uVelo * 1.9)).x;
		float g = texture2D(uTexture,textureUv.xy += c * (uVelo * 1.925)).y;
		float b = texture2D(uTexture,textureUv.xy += c * (uVelo * 1.95)).z;

    color = vec4(r, g, b, 1.);

  gl_FragColor = color ;
  }

  // // Calculate the animation offset based on time
  // float offset = sin(uTime) * 0.1; // Adjust the amplitude and speed as needed

  // // Apply the offset to the texture coordinates
  // vec2 animatedUv = newUv + vec2(offset, offset);

  // // Sample the texture using the animated coordinates
  // vec4 color = texture2D(uTexture, animatedUv);

  // // Set the fragment color
  // gl_FragColor = color;
