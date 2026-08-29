import { Mesh, Program, Renderer, Triangle, Vec2, Vec3 } from "ogl";
import { useEffect, useRef } from "react";

import "./galaxy.css";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;
uniform float uLightMode;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);

      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(
        tris(seed * 34.0 + uTime * uSpeed / 10.0),
        tris(seed * 38.0 + uTime * uSpeed / 30.0)
      ) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      col += star * size * base * twinkle;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    float centerDist = length(uv);
    vec2 repulsion = normalize(uv) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    uv += mouseNorm * 0.1 * uMouseActiveFactor;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uLightMode > 0.5) {
    float energy = max(max(col.r, col.g), col.b);
    float coverage = clamp(smoothstep(0.0, 0.42, energy) * 0.92, 0.0, 0.92);
    vec3 ink = clamp(col * 0.48, 0.0, 0.82);
    gl_FragColor = vec4(mix(vec3(1.0), ink, coverage), 1.0);
  } else if (uTransparent) {
    float alpha = smoothstep(0.0, 0.3, length(col));
    gl_FragColor = vec4(col, min(alpha, 1.0));
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

export default function Galaxy({
  className = "",
  focal = [0.64, 0.54],
  rotation = [0.96, 0.08],
  starSpeed = 0.42,
  density = 1.15,
  hueShift = 16,
  disableAnimation = false,
  speed = 0.5,
  mouseInteraction = false,
  glowIntensity = 0.48,
  saturation = 0.4,
  mouseRepulsion = false,
  repulsionStrength = 2,
  twinkleIntensity = 0.16,
  rotationSpeed = 0.04,
  autoCenterRepulsion = 0,
  transparent = true,
  lightMode = false,
  ...rest
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;
    const renderer = new Renderer({ alpha: transparent, premultipliedAlpha: false });
    const gl = renderer.gl;
    const geometry = new Triangle(gl);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    if (lightMode) {
      gl.clearColor(1, 1, 1, 1);
    } else if (transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new Vec3(1, 1, 1) },
      uFocal: { value: new Vec2(focal[0], focal[1]) },
      uRotation: { value: new Vec2(rotation[0], rotation[1]) },
      uStarSpeed: { value: starSpeed },
      uDensity: { value: density },
      uHueShift: { value: hueShift },
      uSpeed: { value: speed },
      uMouse: { value: new Vec2(0.5, 0.5) },
      uGlowIntensity: { value: glowIntensity },
      uSaturation: { value: saturation },
      uMouseRepulsion: { value: mouseRepulsion },
      uTwinkleIntensity: { value: twinkleIntensity },
      uRotationSpeed: { value: rotationSpeed },
      uRepulsionStrength: { value: repulsionStrength },
      uMouseActiveFactor: { value: 0 },
      uAutoCenterRepulsion: { value: autoCenterRepulsion },
      uTransparent: { value: transparent },
      uLightMode: { value: lightMode ? 1 : 0 },
    };

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms,
    });

    const mesh = new Mesh(gl, { geometry, program });
    let animationFrame = 0;
    let isVisible = true;
    let isRunning = !disableAnimation;

    const resize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      renderer.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = `${width}px`;
      gl.canvas.style.height = `${height}px`;
      uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
      renderer.render({ scene: mesh });
    };

    const syncVisibility = () => {
      isRunning = !disableAnimation && !document.hidden && isVisible;
      if (!isRunning) {
        renderer.render({ scene: mesh });
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = Boolean(entry?.isIntersecting);
      syncVisibility();
    });

    const handleVisibilityChange = () => syncVisibility();
    const handleMouseMove = (event) => {
      if (!mouseInteraction) {
        return;
      }
      const rect = container.getBoundingClientRect();
      uniforms.uMouse.value.set(
        (event.clientX - rect.left) / rect.width,
        1 - (event.clientY - rect.top) / rect.height,
      );
      uniforms.uMouseActiveFactor.value = 1;
    };
    const handleMouseLeave = () => {
      uniforms.uMouseActiveFactor.value = 0;
    };

    const renderFrame = (time) => {
      animationFrame = window.requestAnimationFrame(renderFrame);
      if (!isRunning) {
        return;
      }
      uniforms.uTime.value = time * 0.001;
      uniforms.uStarSpeed.value = (time * 0.001 * starSpeed) / 10;
      renderer.render({ scene: mesh });
    };

    resize();
    observer.observe(container);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", resize);

    if (mouseInteraction) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    container.appendChild(gl.canvas);
    syncVisibility();
    animationFrame = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", resize);
      if (mouseInteraction) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    autoCenterRepulsion,
    density,
    disableAnimation,
    focal,
    glowIntensity,
    hueShift,
    lightMode,
    mouseInteraction,
    mouseRepulsion,
    repulsionStrength,
    rotation,
    rotationSpeed,
    saturation,
    speed,
    starSpeed,
    transparent,
    twinkleIntensity,
  ]);

  return <div ref={containerRef} className={`galaxy-container ${className}`.trim()} {...rest} />;
}
