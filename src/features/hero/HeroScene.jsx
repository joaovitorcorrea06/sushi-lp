import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Html,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "motion/react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function interpolatePathValue(start, mid, end, progress, midProgress = 0.5) {
  if (mid === undefined) {
    return THREE.MathUtils.lerp(start, end, progress);
  }

  if (progress <= midProgress) {
    const localProgress = THREE.MathUtils.mapLinear(progress, 0, midProgress, 0, 1);
    return THREE.MathUtils.lerp(start, mid, localProgress);
  }

  const localProgress = THREE.MathUtils.mapLinear(progress, midProgress, 1, 0, 1);
  return THREE.MathUtils.lerp(mid, end, localProgress);
}

function normalizeKeyframes(keyframes = []) {
  let previousFrame = {};

  return keyframes.map((frame) => {
    const nextFrame = { ...previousFrame, ...frame };
    previousFrame = nextFrame;
    return nextFrame;
  });
}

function interpolateKeyframes(keyframes, progress) {
  const frames = normalizeKeyframes(keyframes);
  if (!frames.length) {
    return null;
  }

  if (progress <= frames[0].progress) {
    return frames[0];
  }

  for (let index = 0; index < frames.length - 1; index += 1) {
    const currentFrame = frames[index];
    const nextFrame = frames[index + 1];

    if (progress > nextFrame.progress) {
      continue;
    }

    const localProgress = THREE.MathUtils.mapLinear(
      progress,
      currentFrame.progress,
      nextFrame.progress,
      0,
      1,
    );

    return {
      x: THREE.MathUtils.lerp(currentFrame.x, nextFrame.x, localProgress),
      y: THREE.MathUtils.lerp(currentFrame.y, nextFrame.y, localProgress),
      scale: THREE.MathUtils.lerp(currentFrame.scale, nextFrame.scale, localProgress),
      rotationX: THREE.MathUtils.lerp(
        currentFrame.rotationX || 0,
        nextFrame.rotationX || 0,
        localProgress,
      ),
      rotationY: THREE.MathUtils.lerp(
        currentFrame.rotationY || 0,
        nextFrame.rotationY || 0,
        localProgress,
      ),
      rotationZ: THREE.MathUtils.lerp(
        currentFrame.rotationZ || 0,
        nextFrame.rotationZ || 0,
        localProgress,
      ),
    };
  }

  return frames[frames.length - 1];
}

function resolveSceneTarget(config, isMobile, progress, reducedMotion) {
  const profile = isMobile ? config.mobile : config.desktop;
  const cappedProgress =
    typeof config.freezeAtProgress === "number"
      ? Math.min(progress, config.freezeAtProgress)
      : progress;
  const keyframes = profile.keyframes?.length ? normalizeKeyframes(profile.keyframes) : null;

  if (reducedMotion) {
    const fallbackFrame = keyframes?.[0] || {};

    return {
      x: config.reducedMotionPosition.x ?? fallbackFrame.x ?? 0,
      y: config.reducedMotionPosition.y ?? fallbackFrame.y ?? 0,
      scale: config.reducedMotionPosition.scale || fallbackFrame.scale || profile.scale,
      rotationX: fallbackFrame.rotationX ?? profile.startRotationX ?? 0,
      rotationY: fallbackFrame.rotationY ?? profile.startRotationY ?? 0,
      rotationZ: fallbackFrame.rotationZ ?? profile.startRotationZ ?? 0,
    };
  }

  if (keyframes) {
    return interpolateKeyframes(keyframes, cappedProgress);
  }

  const midProgress = profile.midProgress || 0.5;

  return {
    x: interpolatePathValue(profile.startX, profile.midX, profile.endX, cappedProgress, midProgress),
    y: interpolatePathValue(profile.startY, profile.midY, profile.endY, cappedProgress, midProgress),
    scale: interpolatePathValue(
      profile.startScale || profile.scale,
      profile.midScale,
      profile.endScale || profile.scale,
      cappedProgress,
      midProgress,
    ),
    rotationX: interpolatePathValue(
      profile.startRotationX || 0,
      profile.midRotationX,
      profile.endRotationX || 0,
      cappedProgress,
      midProgress,
    ),
    rotationY: interpolatePathValue(
      profile.startRotationY,
      profile.midRotationY,
      profile.endRotationY,
      cappedProgress,
      midProgress,
    ),
    rotationZ: interpolatePathValue(
      profile.startRotationZ,
      profile.midRotationZ,
      profile.endRotationZ,
      cappedProgress,
      midProgress,
    ),
  };
}

function FallbackNigiri({
  progressRef,
  isMobile,
  reducedMotion,
  config,
}) {
  const groupRef = useRef(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const target = resolveSceneTarget(config, isMobile, progressRef.current, reducedMotion);

    group.position.set(target.x, target.y, 0);
    group.scale.set(target.scale, target.scale, target.scale);
    group.rotation.set(target.rotationX, target.rotationY, target.rotationZ);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.2}>
      <group ref={groupRef} scale={isMobile ? config.mobile.scale : config.desktop.scale}>
        <mesh position={[0, -0.18, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.18, 1.35, 0.4, 32]} />
          <meshStandardMaterial color="#f4f0e8" roughness={0.86} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.18, 0.1]} castShadow receiveShadow>
          <capsuleGeometry args={[0.92, 0.88, 12, 24]} />
          <meshStandardMaterial color="#ff7f4d" roughness={0.3} metalness={0.12} />
        </mesh>
        <mesh position={[0.22, 0.28, 0.42]} castShadow>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color="#ffd29c" emissive="#ffb16f" emissiveIntensity={0.36} />
        </mesh>
      </group>
    </Float>
  );
}

function ImportedModel({
  config,
  progressRef,
  isMobile,
  reducedMotion,
}) {
  const groupRef = useRef(null);
  const gltf = useGLTF(config.modelUrl);
  const { scene, scaleFactor } = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if (!child.isMesh) {
        return;
      }
      child.frustumCulled = false;
    });

    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;

    clone.position.x -= center.x;
    clone.position.y -= center.y;
    clone.position.z -= center.z;

    return {
      scene: clone,
      scaleFactor: 2.4 / maxAxis,
    };
  }, [gltf.scene]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const target = resolveSceneTarget(config, isMobile, progressRef.current, reducedMotion);

    group.position.set(target.x, target.y, 0);
    const normalizedScale = target.scale * scaleFactor;
    group.scale.set(normalizedScale, normalizedScale, normalizedScale);
    group.rotation.set(target.rotationX, target.rotationY, target.rotationZ);
  });

  return (
    <group ref={groupRef} scale={(isMobile ? config.mobile.scale : config.desktop.scale) * scaleFactor}>
      <primitive object={scene} />
    </group>
  );
}

function SceneModel({
  config,
  progressRef,
  isMobile,
  reducedMotion,
  modelAvailable,
}) {
  if (modelAvailable && config.modelUrl) {
    return (
      <ImportedModel
        config={config}
        progressRef={progressRef}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
      />
    );
  }

  return (
    <FallbackNigiri
      config={config}
      progressRef={progressRef}
      isMobile={isMobile}
      reducedMotion={reducedMotion}
    />
  );
}

function SceneLoader() {
  return (
    <Html center>
      <div className="rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/70 backdrop-blur-xl">
        Carregando cena
      </div>
    </Html>
  );
}

function SceneRenderBridge({ invalidateRef }) {
  const { invalidate } = useThree();

  useEffect(() => {
    invalidateRef.current = invalidate;
    invalidate();

    return () => {
      invalidateRef.current = null;
    };
  }, [invalidate, invalidateRef]);

  return null;
}

export function HeroScene({ config, pinRef }) {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const invalidateRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [modelAvailable, setModelAvailable] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!config.modelUrl) {
      setModelAvailable(false);
      return;
    }

    let active = true;
    fetch(config.modelUrl, { method: "HEAD" })
      .then((response) => {
        if (active) {
          setModelAvailable(response.ok);
        }
      })
      .catch(() => {
        if (active) {
          setModelAvailable(false);
        }
      });

    return () => {
      active = false;
    };
  }, [config.modelUrl]);

  useEffect(() => {
    if (!modelAvailable) {
      return;
    }
    ScrollTrigger.refresh();
    invalidateRef.current?.();
  }, [modelAvailable]);

  useLayoutEffect(() => {
    if (reducedMotion || !pinRef.current || !canvasRef.current) {
      progressRef.current = reducedMotion ? 0 : progressRef.current;
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: pinRef.current,
      start: "top top",
      end: isMobile ? config.scroll?.mobileEnd || "+=48%" : config.scroll?.desktopEnd || "+=95%",
      scrub: 0.9,
      onUpdate: ({ progress }) => {
        progressRef.current = progress;
        invalidateRef.current?.();
      },
    });

    return () => {
      trigger.kill();
    };
  }, [isMobile, pinRef, reducedMotion]);

  return (
    <motion.div
      ref={canvasRef}
      className="relative h-full min-h-[19rem] w-full overflow-visible"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      <div className="absolute inset-x-[18%] top-[12%] h-24 bg-[radial-gradient(circle_at_center,rgba(255,222,189,0.14),rgba(255,222,189,0.02)_70%,transparent_76%)] blur-3xl" />
      <div className="absolute inset-x-[10%] bottom-[16%] h-24 bg-[radial-gradient(circle_at_center,rgba(244,155,56,0.28),rgba(244,155,56,0.02)_72%,transparent_78%)] blur-3xl" />
      <Canvas
        dpr={[1, 1.2]}
        frameloop="demand"
        gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
        className="relative z-10"
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={<SceneLoader />}>
          <SceneRenderBridge invalidateRef={invalidateRef} />
          <PerspectiveCamera makeDefault position={[0, 0.08, 5.7]} fov={24} />
          <ambientLight intensity={0.92} />
          <directionalLight
            intensity={1.7}
            position={[4.2, 4.8, 4.2]}
            color="#ffe3c1"
          />
          <spotLight
            intensity={9}
            position={[-2.1, 3.8, 3.2]}
            angle={0.38}
            penumbra={0.9}
            color="#ff945c"
          />
          <SceneModel
            config={config}
            progressRef={progressRef}
            isMobile={isMobile}
            reducedMotion={Boolean(reducedMotion)}
            modelAvailable={modelAvailable}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  );
}
