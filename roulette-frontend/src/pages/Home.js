// roulette-frontend/src/pages/Home.js

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

const Home = () => {
  const canvasContainer = useRef(null);

  useEffect(() => {
    const container = canvasContainer.current;
    
    // Escena con fondo rgb(0, 0, 0)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('rgb(0, 0, 0)');

    // Cámara
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 1000;

    // Renderizador con antialias y clearColor
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor('rgb(0, 0, 0)', 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Parámetros de la cuadrícula de partículas
    const SEPARATION = 60;
    const AMOUNTX = 40;
    const AMOUNTY = 40;
    let count = 0;

    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0;
    let j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        // Posiciona cada partícula en una cuadrícula
        positions[i]     = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        positions[i + 1] = 0;
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        scales[j]        = 1;
        i += 3;
        j++;
      }
    }

    // BufferGeometry y atributos
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Material con shaders para dibujar puntos como esferas
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color('#ff3270') } // Color de las esferas
      },
      vertexShader: `
        attribute float scale;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = scale * (600.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    // Creación de la malla de partículas
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Control de movimiento del ratón
    let mouseX = 0;
    let mouseY = 0;
    const halfX = window.innerWidth / 2;
    const halfY = window.innerHeight / 2;

    const onMouseMove = (event) => {
      mouseX = event.clientX - halfX;
      mouseY = event.clientY - halfY;
    };
    document.addEventListener('mousemove', onMouseMove, false);

    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);

      // Desplaza la cámara en función del ratón
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Actualiza posiciones y escalas para la animación de "olas"
      let i = 0;
      let j = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[i + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          scales[j] =
            (Math.sin((ix + count) * 0.3) + 1) * 8 +
            (Math.sin((iy + count) * 0.5) + 1) * 8;
          i += 3;
          j++;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.scale.needsUpdate = true;

      // Renderiza la escena
      renderer.render(scene, camera);
      count += 0.1;
    };
    animate();

    // Redimensionar la escena al cambiar el tamaño de la ventana
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('resize', onWindowResize, false);
      document.removeEventListener('mousemove', onMouseMove, false);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Montserrat", "Lato", sans-serif',
        color: '#ff3270',
        minHeight: '100vh'
      }}
    >
      {/* Canvas de Three.js */}
      <div
        ref={canvasContainer}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />

      {/* Contenido principal */}
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Bienvenido a Roulette Virtual Casino</h1>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '1rem' }}>
            <li>
              <Link to="/login" style={{ color: '#ff3270', textDecoration: 'none' }}>
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/signup" style={{ color: '#ff3270', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/dashboard" style={{ color: '#ff3270', textDecoration: 'none' }}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/game" style={{ color: '#ff3270', textDecoration: 'none' }}>
                Jugar a la Ruleta
              </Link>
            </li>
            <li>
              <Link to="/stats" style={{ color: '#ff3270', textDecoration: 'none' }}>
                Ver Estadísticas
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Home;
