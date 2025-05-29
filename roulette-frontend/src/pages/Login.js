// src/pages/Login.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as THREE from 'three';
import usersApi from '../services/usersApi';

const Login = () => {
  const [form, setForm]       = useState({ alias: '', password: '' });
  const [message, setMessage] = useState('');
  const [log, setLog]         = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

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

  // Handle form updates
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setLog(`➡ GET /users/validate?alias=${encodeURIComponent(form.alias)}&password=${encodeURIComponent(form.password)}`);

    try {
      const res = await usersApi.get('/users/validate', { params: form });
      setLog(prev => prev + `\n✅ ${res.status} ${JSON.stringify(res.data)}`);
      setMessage(`🎉 Welcome, ${res.data.user.name}! 🎉`);
      sessionStorage.setItem('user', JSON.stringify({
        id: res.data.user.id || res.data.user.id_usuario,
        name: res.data.user.name,
        alias: res.data.user.alias
      }));
      setLoading(false);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      const status = err.response?.status || 'Network Error';
      const data   = err.response?.data   || err.message;
      setLog(prev => prev + `\n❌ ${status} ${JSON.stringify(data)}`);
      setMessage('❌ Alias or password invalid ❌');
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --bg: transparent;
          --panel-bg: rgba(255,255,255,0.6);
          --text: #242424;
          --accent: #1e90ff;
          --accent2: #ff6347;
          --radius: 0.5rem;
          --transition: 0.3s ease;
          --font: 'Inter', sans-serif;
          --mono: 'Fragment Mono', monospace;
          --spacing: 1rem;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.1); }
        }

        .auth-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: calc(var(--spacing)*2);
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--font);
          animation: fadeInUp 0.6s var(--transition) both;
        }
        .background-canvas {
          position: fixed;
          top:0; left:0;
          width:100%; height:100%;
          z-index:-1;
        }

        .auth-title {
          font-size: 2.5rem;
          margin-bottom: var(--spacing);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .auth-title .emoji {
          animation: pulse 1.5s infinite;
        }

        .dashboard-nav {
          margin-bottom: calc(var(--spacing)*1.5);
          animation: fadeInUp 0.8s var(--transition) both;
        }
        .nav-list {
          display: flex;
          gap: var(--spacing);
          padding: var(--spacing);
          background: var(--panel-bg);
          border-radius: var(--radius);
          backdrop-filter: blur(6px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          list-style: none;
          margin: 0 0 var(--spacing);
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.25rem;
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

        .auth-form {
          width: 100%;
          max-width: 400px;
          display: grid;
          gap: var(--spacing);
          padding: calc(var(--spacing)*2);
          background: var(--panel-bg);
          border-radius: var(--radius);
          backdrop-filter: blur(6px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          animation: fadeInUp 1s var(--transition) both;
        }
        .auth-label {
          display: flex;
          flex-direction: column;
          font-weight: 500;
        }
        .label-icon {
          margin-right: 0.5rem;
          animation: pulse 2s infinite;
        }
        .auth-input {
          margin-top: 0.25rem;
          padding: 0.75rem 1rem;
          border: 1px solid #ccc;
          border-radius: var(--radius);
          transition: border-color var(--transition), box-shadow var(--transition);
        }
        .auth-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(30,144,255,0.2);
        }
        .auth-button {
          padding: 0.75rem;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: var(--radius);
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background var(--transition), transform var(--transition);
        }
        .auth-button:hover:not(:disabled) {
          background: #106bb2;
          transform: translateY(-2px);
        }
        .auth-button:disabled {
          background: #82bfff;
          cursor: not-allowed;
        }

        .auth-footer {
          margin-top: var(--spacing);
          text-align: center;
        }
        .auth-link {
          color: var(--accent);
          font-weight: 600;
          text-decoration: none;
          transition: opacity var(--transition);
        }
        .auth-link:hover {
          opacity: 0.7;
        }

        .message {
          margin-top: var(--spacing);
          font-weight: 500;
        }
        .message .emoji {
          animation: pulse 1s infinite;
        }

        .log-panel {
          margin-top: var(--spacing);
          width: 100%;
          max-width: 400px;
          padding: var(--spacing);
          background: var(--panel-bg);
          border-radius: var(--radius);
          backdrop-filter: blur(6px);
          font-family: var(--mono);
          white-space: pre-wrap;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          animation: fadeInUp 1s var(--transition) both;
        }
      `}</style>

      <div className="auth-container">
        <div ref={canvasRef} className="background-canvas" />

        <h1 className="auth-title">
          <span className="emoji">🔑</span> Log In <span className="emoji">🚀</span>
        </h1>

        <nav className="dashboard-nav">
          <ul className="nav-list">
            <li><Link to="/" className="nav-link">🏠 Home</Link></li>
            <li><Link to="/signup" className="nav-link">✒️ Sign Up</Link></li>
            <li><Link to="/dashboard" className="nav-link">📋 Dashboard</Link></li>
          </ul>
        </nav>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            <span className="label-icon">📛</span> Alias
            <input
              className="auth-input"
              type="text"
              name="alias"
              value={form.alias}
              onChange={handleChange}
              required
            />
          </label>

          <label className="auth-label">
            <span className="label-icon">🔒</span> Password
            <input
              className="auth-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading
              ? <>⏳ Signing In…</>
              : <>✅ Log In</>
            }
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/signup" className="auth-link">Sign Up ✨</Link>
        </p>

        {message && <p className="message">{message}</p>}
        <div className="log-panel">{log}</div>
      </div>
    </>
  );
};

export default Login;
