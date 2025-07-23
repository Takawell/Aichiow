"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useGLTF } from "@react-three/drei";

function LapwingModel() {
  const { scene } = useGLTF("/models/lapwing.glb");
  return <primitive object={scene} scale={2} />;
}

export default function ModelViewer() {
  return (
    <div className="w-full h-64 md:h-96 bg-black rounded-xl overflow-hidden">
      <Canvas camera={{ position: [2, 2, 5], fov: 40 }}>
        <ambientLight intensity={1} />
        <Suspense fallback={<Html center>Loading...</Html>}>
          <LapwingModel />
        </Suspense>
        <Environment preset="sunset" />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
