// src/pages/Dashboard.js

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import usersApi from '../services/usersApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers]           = useState([]);
  const [log, setLog]               = useState('');
  const [loading, setLoading]       = useState(false);
  const [editingUserId, setEditing] = useState(null);
  const [editForm, setEditForm]     = useState({});
  const canvasRef = useRef(null);

  // Three.js animated background
  useEffect(() => {
    const container = canvasRef.current;
    const scene     = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0xffffff, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const SEPARATION = 60, AMOUNTX = 40, AMOUNTY = 40;
    let count = 0;
    const numParticles = AMOUNTX * AMOUNTY;
    const positions    = new Float32Array(numParticles * 3);
    const scales       = new Float32Array(numParticles);
    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i]     = ix * SEPARATION - (AMOUNTX * SEPARATION)/2;
        positions[i + 1] = 0;
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION)/2;
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
    const halfX = window.innerWidth/2, halfY = window.innerHeight/2;
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
          positions[idx + 1] = Math.sin((ix + count)*0.3)*50 + Math.sin((iy + count)*0.5)*50;
          scales[k] = (Math.sin((ix+count)*0.3)+1)*8 + (Math.sin((iy+count)*0.5)+1)*8;
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
      camera.aspect = window.innerWidth/window.innerHeight;
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

  // Load users
  useEffect(() => { fetchUsers() }, []);
  const fetchUsers = async () => {
    setLoading(true);
    setLog('➡ GET /users');
    try {
      const res = await usersApi.get('/users');
      setLog(l => l + `\n✅ ${res.status}`);
      setUsers(res.data);
    } catch (err) {
      const st = err.response?.status||'Error';
      const dt = err.response?.data||err.message;
      setLog(l => l + `\n❌ ${st} ${JSON.stringify(dt)}`);
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const onEditClick = user => {
    setEditing(user.id);
    setEditForm({
      name:     user.name,
      email:    user.email,
      alias:    user.alias,
      password: '',         // blank for new
      balance:  user.balance ?? 0
    });
  };

  // Handle edit form field change
  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Save updated
  const saveEdit = async id => {
    setLoading(true);
    setLog(l => l + `\n➡ PUT /users/${id}\n   ${JSON.stringify(editForm)}`);
    try {
      const res = await usersApi.put(`/users/${id}`, editForm);
      setLog(l => l + `\n✅ ${res.status}`);
      setUsers(users.map(u => u.id === id ? res.data : u));
      setEditing(null);
    } catch (err) {
      const st = err.response?.status||'Error';
      const dt = err.response?.data||err.message;
      setLog(l => l + `\n❌ ${st} ${JSON.stringify(dt)}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => setEditing(null);

  const handleSignOut = () => navigate('/login');

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
        @keyframes emojiBounce {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.05); }
        }

        .dashboard-container {
          position: relative;
          display: flex; flex-direction: column; align-items: center;
          padding: calc(var(--spacing)*2);
          min-height: 100vh; background: var(--bg); color: var(--text);
          font-family: var(--font);
          animation: fadeInUp 0.6s var(--transition) both;
        }
        .background-canvas {
          position: fixed; top:0; left:0; width:100%; height:100%; z-index:-1;
        }

        .dashboard-title {
          font-size: 2.5rem; margin-bottom: var(--spacing);
          display: flex; align-items: center; gap: .5rem;
        }
        .emoji { animation: emojiBounce 1.5s infinite; }

        .dashboard-nav {
          margin-bottom: calc(var(--spacing)*1.5);
          animation: fadeInUp 0.8s var(--transition) both;
        }
        .nav-list {
          display: flex; gap: var(--spacing);
          padding: var(--spacing);
          background: var(--panel-bg);
          border-radius: var(--radius);
          backdrop-filter: blur(6px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          list-style: none; margin:0;
        }
        .nav-link, .signout-button {
          display:flex; align-items:center; gap:.25rem;
          padding:.5rem 1rem; border-radius:var(--radius);
          background:transparent; color:var(--text);
          font-weight:500; cursor:pointer;
          transition:background var(--transition), color var(--transition);
        }
        .nav-link:hover { background: var(--accent); color:#fff }
        .signout-button:hover { background: var(--accent2); color:#fff }

        .section-title {
          font-size:1.75rem; margin:var(--spacing) 0;
          animation: fadeInUp 1s var(--transition) both;
        }
        .loading-text {
          font-style:italic; color:var(--accent);
          margin-bottom:var(--spacing);
        }

        .user-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
          gap:var(--spacing);
          width:100%; max-width:1000px;
          animation: fadeInUp 1.2s var(--transition) both;
        }
        .user-card {
          background:var(--panel-bg);
          border-radius:var(--radius);
          padding:var(--spacing);
          box-shadow:0 4px 8px rgba(0,0,0,0.1);
          transition: transform var(--transition), background var(--transition);
          backdrop-filter: blur(6px);
        }
        .user-card:hover {
          transform: translateY(-8px);
          background: rgba(255,255,255,0.9);
        }
        .user-card h3 {
          display:flex; align-items:center; gap:.5rem;
          margin:0 0 calc(var(--spacing)/2);
        }
        .user-card p { margin:.25rem 0; font-size:.9rem; }

        .action-button {
          margin-top:var(--spacing);
          padding:.5rem .75rem;
          background:var(--text); color:#fff;
          border:none; border-radius:var(--radius);
          display:flex; align-items:center; gap:.25rem;
          cursor:pointer; transition:background var(--transition), transform var(--transition);
        }
        .action-button:hover:not(:disabled) {
          background: var(--accent); transform: translateY(-3px);
        }
        .action-button:disabled { opacity:.6; cursor:not-allowed; }

        .edit-form {
          display:flex; flex-direction: column; gap:.75rem;
          margin-top:var(--spacing);
        }
        .edit-form input {
          padding:.5rem; border-radius:var(--radius);
          border:1px solid #ccc; font-size:1rem;
        }
        .edit-buttons {
          display:flex; gap:.5rem; margin-top:.5rem;
        }
        .edit-buttons button {
          flex:1; padding:.5rem; border:none;
          border-radius:var(--radius); cursor:pointer;
          font-weight:500;
          transition:background var(--transition), transform var(--transition);
        }
        .save-btn { background:var(--accent); color:#fff }
        .save-btn:hover { background:#106bb2; }
        .cancel-btn { background:var(--accent2); color:#fff }
        .cancel-btn:hover { background:#c94e3d; }

        .log-panel {
          margin-top:var(--spacing);
          width:100%; max-width:1000px;
          background:var(--panel-bg);
          padding:var(--spacing);
          border-radius:var(--radius);
          font-family:var(--mono);
          white-space:pre-wrap;
          overflow-y:auto;
          box-shadow:0 4px 8px rgba(0,0,0,0.1);
          transition:background var(--transition);
          backdrop-filter: blur(6px);
        }
        .log-panel:hover { background: rgba(255,255,255,0.9); }
      `}</style>

      <div className="dashboard-container">
        <div ref={canvasRef} className="background-canvas" />

        <h1 className="dashboard-title">
          <span className="emoji">🖥️</span> Dashboard del Usuario <span className="emoji">🚀</span>
        </h1>

        <nav className="dashboard-nav">
          <ul className="nav-list">
            <li><Link to="/" className="nav-link"><span className="emoji">🏠</span> Home</Link></li>
            <li><Link to="/login" className="nav-link"><span className="emoji">🔑</span> Log In</Link></li>
            <li><Link to="/signup" className="nav-link"><span className="emoji">✒️</span> Sign Up</Link></li>
            <li><Link to="/game" className="nav-link"><span className="emoji">🎰</span> Jugar Ruleta</Link></li>
            <li><Link to="/stats" className="nav-link"><span className="emoji">📊</span> Estadísticas</Link></li>
            <li><button onClick={handleSignOut} className="signout-button"><span className="emoji">🚪</span> Sign Out</button></li>
          </ul>
        </nav>

        <h2 className="section-title">All Users</h2>
        {loading && <p className="loading-text"><span className="emoji">⏳</span> Loading…</p>}

        <div className="user-grid">
          {users.map(u => (
            <div key={u.id} className="user-card">
              {/* Display mode */}
              {editingUserId !== u.id ? (
                <>
                  <h3><span className="emoji">👤</span> {u.name}</h3>
                  <p><span className="emoji">🆔</span> ID: {u.id}</p>
                  <p><span className="emoji">📧</span> {u.email}</p>
                  <p><span className="emoji">🔖</span> Alias: {u.alias}</p>
                  <p><span className="emoji">💳</span> Balance: {u.balance}</p>
                  <button disabled={loading} className="action-button" onClick={() => onEditClick(u)}>
                    <span className="emoji">✏️</span> Update
                  </button>
                </>
              ) : (
                /* Edit form mode */
                <>
                  <h3>Edit User #{u.id}</h3>
                  <div className="edit-form">
                    <input name="name"     value={editForm.name}     placeholder="Name"     onChange={handleEditChange} />
                    <input name="email"    value={editForm.email}    placeholder="Email"    onChange={handleEditChange} />
                    <input name="alias"    value={editForm.alias}    placeholder="Alias"    onChange={handleEditChange} />
                    <input name="password" value={editForm.password} placeholder="Password" onChange={handleEditChange} />
                    <input name="balance"  value={editForm.balance}  placeholder="Balance"  onChange={handleEditChange} />
                  </div>
                  <div className="edit-buttons">
                    <button className="save-btn"   disabled={loading} onClick={() => saveEdit(u.id)}>💾 Save</button>
                    <button className="cancel-btn" disabled={loading} onClick={cancelEdit}>✖ Cancel</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="log-panel">{log}</div>
      </div>
    </>
  );
};

export default Dashboard;
