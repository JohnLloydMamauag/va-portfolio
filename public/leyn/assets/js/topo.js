/* =========================================================
   Topographic contour background (WebGL)

   Ported from the TopoField effect (MengTo/threeui, MIT) into plain JS -
   no React/iframe needed since this site has no build step.

   Two changes from the original:
     1. The 48px grid is removed, contour ("squiggly") lines only.
     2. It draws ink lines on a transparent canvas instead of white-on-black,
        so it composites over the cream page and stays subtle.
   ========================================================= */
(function () {
  'use strict';

  var canvas = document.getElementById('topoCanvas');
  if (!canvas) return;

  var gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, premultipliedAlpha: true })
        || canvas.getContext('experimental-webgl', { alpha: true, antialias: false, depth: false });
  if (!gl) return;

  /* --- tuning knobs (raise STRENGTH if you want the lines more visible) --- */
  var STRENGTH = 1.00;   // line alpha; final visibility is set by .topo-bg opacity (25%) in CSS
  var SPEED    = 0.55;   // drift speed multiplier
  var LENGTH   = 1.0;    // stretches the noise field
  var DENSITY  = 0.85;   // number of contour bands
  var INK      = [0.431, 0.357, 0.620]; // #6E5B9E plum, so lines read on the light page

  var vsSource =
    'attribute vec2 a_position;' +
    'void main() { gl_Position = vec4(a_position, 0.0, 1.0); }';

  var fsSource = [
    'precision highp float;',
    'uniform vec2 u_resolution;',
    'uniform float u_time;',
    'uniform float u_strength;',
    'uniform float u_length;',
    'uniform float u_density;',
    'uniform vec3 u_ink;',

    'vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }',
    'float snoise(vec2 v){',
    '  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);',
    '  vec2 i  = floor(v + dot(v, C.yy) );',
    '  vec2 x0 = v -   i + dot(i, C.xx);',
    '  vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
    '  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;',
    '  i = mod(i, 289.0);',
    '  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));',
    '  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);',
    '  m = m*m; m = m*m;',
    '  vec3 x = 2.0 * fract(p * C.www) - 1.0;',
    '  vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5);',
    '  vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );',
    '  vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
    '  return 130.0 * dot(m, g);',
    '}',

    'void main() {',
    '  vec2 st = gl_FragCoord.xy / u_resolution.xy;',
    '  st.x *= u_resolution.x / u_resolution.y;',

    // contour lines only, the original grid pass is gone
    '  float noiseScale = 1.4 * u_length;',
    '  vec2 noisePos = st * noiseScale + vec2(u_time * 0.015, u_time * 0.025);',
    '  float n = snoise(noisePos) * 0.5 + 0.5;',
    '  float numBands = 10.0 * u_density;',
    '  float triangleWave = abs(fract(n * numBands) - 0.5) * 2.0;',
    '  float lines = smoothstep(0.030, 0.004, triangleWave);',

    '  float a = lines * u_strength;',
    '  gl_FragColor = vec4(u_ink * a, a);', // premultiplied
    '}'
  ].join('\n');

  function createShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vs = createShader(gl.VERTEX_SHADER, vsSource);
  var fs = createShader(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return;

  var program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  var positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  var uResolution = gl.getUniformLocation(program, 'u_resolution');
  var uTime = gl.getUniformLocation(program, 'u_time');

  gl.uniform1f(gl.getUniformLocation(program, 'u_strength'), STRENGTH);
  gl.uniform1f(gl.getUniformLocation(program, 'u_length'), LENGTH);
  gl.uniform1f(gl.getUniformLocation(program, 'u_density'), DENSITY);
  gl.uniform3f(gl.getUniformLocation(program, 'u_ink'), INK[0], INK[1], INK[2]);

  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  function resize() {
    // Capped DPR, the lines are soft, so 2x is plenty and keeps it cheap.
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.floor(window.innerWidth * dpr);
    var h = Math.floor(window.innerHeight * dpr);
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uResolution, w, h);
  }

  window.addEventListener('resize', resize);
  resize();

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var start = performance.now();

  function draw(elapsed) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, elapsed);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  if (reduceMotion) {
    draw(0); // one static frame
  } else {
    (function render(time) {
      draw((time - start) * 0.001 * SPEED);
      requestAnimationFrame(render);
    })(start);
  }
})();
