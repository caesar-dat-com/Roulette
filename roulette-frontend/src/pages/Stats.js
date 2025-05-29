// src/pages/Stats.js

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import axios from 'axios';

const Stats = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [rounds, setRounds]   = useState([]);
  const [log, setLog]         = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const userId = user?.id || user?.id_usuario;

  // Three.js animated spheres background
  useEffect(() => {
    const container = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const SEPARATION = 60, AMOUNTX = 40, AMOUNTY = 40;
    let count = 0;
    const num = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(num * 3);
    const scales    = new Float32Array(num);
    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i]     = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        positions[i + 1] = 0;
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        scales[j]        = 1;
        i += 3; j++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale',    new THREE.BufferAttribute(scales,    1));

    const material = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color('#1e90ff') } },
      vertexShader: `
        attribute float scale;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = scale * (600.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d);
          vec3 col = mix(color, vec3(1.0), 1.0 - alpha);
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let mouseX = 0, mouseY = 0;
    const halfX = window.innerWidth / 2, halfY = window.innerHeight / 2;
    const onMouseMove = e => {
      mouseX = e.clientX - halfX;
      mouseY = e.clientY - halfY;
    };
    document.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      let idx = 0, k = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions[idx + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          scales[k] =
            (Math.sin((ix + count) * 0.3) + 1) * 8 +
            (Math.sin((iy + count) * 0.5) + 1) * 8;
          idx += 3; k++;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.scale.needsUpdate    = true;

      renderer.render(scene, camera);
      count += 0.1;
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousemove', onMouseMove);
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!userId) {
      setLog('⚠️ Usuario no autenticado.');
      return;
    }
    const fetchStats = async () => {
      setLoading(true);
      setLog(`➡ GET /estadisticas (user_id=${userId})`);
      try {
        const res = await axios.get('http://localhost:3005/estadisticas');
        const filtered = res.data.filter(r => r.user_id === userId);
        setRounds(filtered);
        setLog(l => l + `\n✅ ${res.status} resultados: ${filtered.length}`);
      } catch (err) {
        const status = err.response?.status || 'Network Error';
        const data   = err.response?.data   || err.message;
        setLog(l => l + `\n❌ ${status} ${JSON.stringify(data)}`);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [userId]);

  const handleSignOut = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <div ref={canvasRef} className="background-canvas" />

      <div className="stats-container">
        <nav className="dashboard-nav">
          <ul className="nav-list">
            <li><Link to="/"          className="nav-link">🏠 Home</Link></li>
            <li><Link to="/login"     className="nav-link">🔑 Log In</Link></li>
            <li><Link to="/signup"    className="nav-link">✒️ Sign Up</Link></li>
            <li><Link to="/dashboard" className="nav-link">📋 Dashboard</Link></li>
            {userId && <li><Link to="/game" className="nav-link">🎲 Jugar Ruleta</Link></li>}
            <li><Link to="/stats"     className="nav-link">📊 Estadísticas</Link></li>
            <li><button onClick={handleSignOut} className="nav-link">🚪 Sign Out</button></li>
          </ul>
        </nav>

        <h1 className="stats-title">
          <span className="emoji">📊</span> Mis Estadísticas
        </h1>

        <div className="stats-panel">
          {loading && <p className="loading-text">🔄 Cargando…</p>}

          <table className="stats-table">
            <thead>
              <tr>
                <th>🆔 Ronda</th>
                <th>🎯 Número</th>
                <th>🎨 Color</th>
                <th>✅ Ganó</th>
                <th>🎁 Evento</th>
                <th>💎 Bono</th>
                <th>💰 Ganancia</th>
                <th>⏰ Fecha</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map(r => (
                <tr key={r.id}>
                  <td>{r.round_id}</td>
                  <td>{r.winning_number}</td>
                  <td>{r.winning_color}</td>
                  <td>{r.is_win ? 'Sí' : 'No'}</td>
                  <td>{r.event_applied}</td>
                  <td>{r.bonus_applied}</td>
                  <td>{r.winnings_amount}</td>
                  <td>{new Date(r.round_timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <pre className="log-panel">{log}</pre>
        </div>
      </div>

      <style>{`
        :root {
          --bg: transparent;
          --panel-bg: rgba(255,255,255,0.6);
          --text: #242424;
          --accent: #1e90ff;
          --radius: 0.5rem;
          --transition: 0.3s ease;
          --font: 'Inter', sans-serif;
          --mono: 'Fragment Mono', monospace;
          --spacing: 1rem;
        }
        .background-canvas {
          position: fixed; top:0; left:0;
          width:100%; height:100%; z-index:-1;
        }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
          0%,100% { transform:scale(1); }
          50%     { transform:scale(1.1); }
        }
        .stats-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: calc(var(--spacing)*2);
          min-height: 100vh;
          color: var(--text);
          font-family: var(--font);
          animation: fadeInUp 0.6s var(--transition) both;
        }
        .dashboard-nav {
          margin-bottom: calc(var(--spacing)*1.5);
          animation: fadeInUp 0.8s var(--transition) both;
        }
        .nav-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing);
          padding: var(--spacing);
          background: var(--panel-bg);
          border-radius: var(--radius);
          backdrop-filter: blur(6px);
          list-style: none;
          margin: 0;
        }
        .nav-link {
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
          background: transparent;
          color: var(--text);
          text-decoration: none;
          font-weight: 500;
          transition: background var(--transition), color var(--transition);
        }
        .nav-link:hover {
          background: var(--accent);
          color: #fff;
        }
        .stats-title {
          font-size: 2.5rem;
          margin: var(--spacing) 0;
        }
        .stats-title .emoji {
          animation: pulse 1.5s infinite;
        }
        .stats-panel {
          width: 100%;
          max-width: 960px;
          background: var(--panel-bg);
          backdrop-filter: blur(6px);
          padding: calc(var(--spacing)*2);
          border-radius: var(--radius);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          animation: fadeInUp 1s var(--transition) both;
        }
        .loading-text {
          font-style: italic;
          margin-bottom: var(--spacing);
        }
        .stats-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: var(--spacing);
        }
        .stats-table th,
        .stats-table td {
          border: 1px solid #ccc;
          padding: 0.75rem;
          text-align: left;
          font-family: var(--mono);
        }
        .stats-table th {
          background: var(--accent);
          color: #fff;
        }
        .log-panel {
          width: 100%;
          background: var(--panel-bg);
          backdrop-filter: blur(6px);
          padding: var(--spacing);
          border-radius: var(--radius);
          font-family: var(--mono);
          white-space: pre-wrap;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          max-height: 200px;
          overflow-y: auto;
        }
      `}</style>
    </>
  );
};

export default Stats;
