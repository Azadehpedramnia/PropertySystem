"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

interface Props {
  modelPath: string;
}

function Model({ modelPath }: Props) {
  const gltf = useGLTF(modelPath);
  return <primitive object={gltf.scene} />;
}

//only one times need to register
useGLTF.preload("/models/PropertyA.glb"); // in futyre i have to use another things it is only for first image

const BuildingModelViewer: React.FC<Props> = ({ modelPath }) => {
  return (
    <div style={{ width: "50%", height: "500px" }}>
      <Canvas camera={{ position: [3, 3, 3] }} shadows>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} />
        <Suspense fallback={null}> {/* span باعث خطا می‌شد */}
          <Model modelPath={modelPath} />
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minPolarAngle={Math.PI / 8}    // حدود 90 درجه (پایین‌ترین)
            maxPolarAngle={Math.PI / 2}    // 90 درجه (رو به جلو)
            minAzimuthAngle={-Math.PI}     // آزاد در Y
            maxAzimuthAngle={Math.PI}
            />

        </Suspense>
      </Canvas>
    </div>
  );
};

export default BuildingModelViewer;
