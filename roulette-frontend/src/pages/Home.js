// src/pages/Home.js

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

const Home = () => {
  const canvasContainer = useRef(null);

  useEffect(() => {
    const container = canvasContainer.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const SEPARATION = 60, AMOUNTX = 40, AMOUNTY = 40;
    let count = 0;
    const num = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(num*3), scales = new Float32Array(num);
    let i=0, j=0;
    for (let x=0; x<AMOUNTX; x++) {
      for (let y=0; y<AMOUNTY; y++) {
        positions[i]   = x*SEPARATION - (AMOUNTX*SEPARATION)/2;
        positions[i+1] = 0;
        positions[i+2] = y*SEPARATION - (AMOUNTY*SEPARATION)/2;
        scales[j]      = 1;
        i+=3; j++;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions,3));
    geom.setAttribute('scale',    new THREE.BufferAttribute(scales,1));

    const mat = new THREE.ShaderMaterial({
      uniforms:{ color:{ value:new THREE.Color('#1e90ff') } },
      vertexShader: `
        attribute float scale;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          gl_PointSize = scale*(600./-mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main(){
          float d = length(gl_PointCoord-vec2(0.5));
          if(d>0.5) discard;
          float alpha = smoothstep(0.5,0.0,d);
          vec3 col = mix(color,vec3(1.0),1.-alpha);
          gl_FragColor = vec4(col,alpha);
        }
      `,
      transparent:true
    });
    const points = new THREE.Points(geom,mat);
    scene.add(points);

    let mx=0,my=0;
    const halfX=window.innerWidth/2, halfY=window.innerHeight/2;
    const onMouse = e=>{ mx=e.clientX-halfX; my=e.clientY-halfY; };
    document.addEventListener('mousemove', onMouse);

    const animate = ()=>{
      requestAnimationFrame(animate);
      camera.position.x += (mx-camera.position.x)*0.05;
      camera.position.y += (-my-camera.position.y)*0.05;
      camera.lookAt(scene.position);

      let idx=0,k2=0;
      for(let x=0;x<AMOUNTX;x++) for(let y=0;y<AMOUNTY;y++){
        positions[idx+1] = Math.sin((x+count)*0.3)*50 + Math.sin((y+count)*0.5)*50;
        scales[k2]       = (Math.sin((x+count)*0.3)+1)*8 + (Math.sin((y+count)*0.5)+1)*8;
        idx+=3; k2++;
      }
      geom.attributes.position.needsUpdate = true;
      geom.attributes.scale.needsUpdate    = true;

      renderer.render(scene,camera);
      count += 0.1;
    };
    animate();

    const onResize = ()=>{
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth,window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return ()=>{
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouse);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --bg: transparent;
          --panel-bg: rgba(255,255,255,0.6);
          --text: #242424;
          --accent: #1e90ff;
          --radius: 0.5rem;
          --transition: 0.3s ease;
          --font: 'Inter', sans-serif;
          --spacing: 1rem;
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes emojiBounce {
          0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-5px); }
        }
        @keyframes textRotateIn {
          from{ opacity:0; transform:rotateX(-90deg); }
          to  { opacity:1; transform:rotateX(0); }
        }

        body, .home-container {
          margin:0; padding:0;
          background: var(--bg);
          font-family: var(--font);
          color: var(--text);
          min-height:100vh;
          display:flex; flex-direction:column; align-items:center;
        }
        .background-canvas {
          position:fixed; top:0; left:0;
          width:100%; height:100%; z-index:-1;
        }

        .home-title {
          font-size:2.5rem;
          margin: calc(var(--spacing)*2) 0 var(--spacing);
          animation: fadeInUp 0.6s var(--transition) both;
        }
        .home-title span {
          display:inline-block;
          animation: textRotateIn 0.5s ease both;
        }
        .home-title .emoji {
          animation: emojiBounce 1.5s infinite;
        }

        .dashboard-nav {
          margin-bottom: calc(var(--spacing)*1.5);
          animation: fadeInUp 0.8s var(--transition) both;
        }
        .nav-list {
          display:flex; gap:var(--spacing);
          padding: var(--spacing);
          background: var(--panel-bg);
          border-radius:var(--radius);
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          backdrop-filter: blur(6px);
        }
        .nav-link {
          display:flex; align-items:center; gap:0.25rem;
          padding:0.5rem 1rem; border-radius:var(--radius);
          color: var(--text); font-weight:500;
          text-decoration:none;
          transition: background var(--transition), color var(--transition);
        }
        .nav-link:hover {
          background: var(--accent); color:#fff;
        }

        .cards {
          display:grid;
          grid-template-columns: repeat(auto-fit,minmax(240px,1fr));
          gap:var(--spacing);
          width:100%; max-width:1000px;
          padding-bottom: calc(var(--spacing)*2);
          animation: fadeInUp 1.2s var(--transition) both;
        }
        .card {
          background: var(--panel-bg);
          border-radius:var(--radius);
          padding:var(--spacing);
          box-shadow:0 4px 8px rgba(0,0,0,0.1);
          transition: transform var(--transition), background var(--transition);
          backdrop-filter: blur(6px);
        }
        .card:hover {
          transform: translateY(-8px);
          background: rgba(255,255,255,0.9);
        }
        .card h3 {
          margin-top:0;
          color: var(--accent);
          display:flex; align-items:center; gap:0.5rem;
          animation: emojiBounce 2s infinite;
        }
        .card p, .card ul {
          margin:0.5rem 0; font-size:0.9rem;
        }
        .card ul { padding-left:1.25rem; }
      `}</style>

      <div className="home-container">
        <div ref={canvasContainer} className="background-canvas" />

        <h1 className="home-title">
          {"🎰Roulette Virtual Casino".split("").map((c,i)=>(
            <span key={i}>{c}</span>
          ))}
        </h1>

        <nav className="dashboard-nav">
          <ul className="nav-list">
            <li><Link to="/"          className="nav-link">🏠 Home</Link></li>
            <li><Link to="/login"     className="nav-link">🔑 Log In</Link></li>
            <li><Link to="/signup"    className="nav-link">✒️ Sign Up</Link></li>
            <li><Link to="/dashboard" className="nav-link">📋 Dashboard</Link></li>
            <li><Link to="/game"      className="nav-link">🎲 Jugar Ruleta</Link></li>
            <li><Link to="/stats"     className="nav-link">📊 Estadísticas</Link></li>
          </ul>
        </nav>

        <div className="cards">
          <div className="card">
            <h3>👀 Overview</h3>
            <p>Microservicios desacoplados: usuarios, apuestas, bonificaciones, eventos, estadísticas.</p>
          </div>
          <div className="card">
            <h3>🎯 Objetivo</h3>
            <ul>
              <li>Arquitectura modular y escalable</li>
              <li>REST entre servicios</li>
              <li>React + Three.js + CSS dinámico</li>
            </ul>
          </div>
          <div className="card">
            <h3>🧠 Problema</h3>
            <p>Monolitos difíciles de escalar, medir o personalizar sin riesgo.</p>
          </div>
          <div className="card">
            <h3>🧩 Necesidades</h3>
            <ul>
              <li>Apuestas sin dinero real</li>
              <li>Roles Jugador/Admin</li>
              <li>Métricas en tiempo real</li>
            </ul>
          </div>
          <div className="card">
            <h3>🛠️ Características</h3>
            <ul>
              <li>Usuarios (3001)</li>
              <li>Ruleta (3002)</li>
              <li>Bonos (3003), Transacc. (3004)</li>
              <li>Estadíst. (3005), Eventos (3006)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
