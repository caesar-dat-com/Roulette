/// src/pages/RouletteGame.js

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import axios from 'axios';

const RouletteGame = () => {
  const [form, setForm]         = useState({
    user_id: '', apostado_numero: '', apostado_color: '', valor_apuesta: ''
  });
  const [log, setLog]           = useState('');
  const [message, setMessage]   = useState('');
  const [resultado, setResultado] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [cubeColor, setCubeColor] = useState('green');
  const [cubeNum1, setCubeNum1] = useState(0);
  const [cubeNum2, setCubeNum2] = useState(0);
  const [showRules, setShowRules] = useState(false);

  const colorInterval = useRef();
  const num1Interval  = useRef();
  const num2Interval  = useRef();
  const canvasRef     = useRef(null);

  // Three.js background
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
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const SEP = 60, NX = 40, NY = 40;
    let count = 0, i = 0, j = 0;
    const num = NX * NY;
    const pos = new Float32Array(num * 3);
    const scl = new Float32Array(num);
    for (let ix = 0; ix < NX; ix++) {
      for (let iy = 0; iy < NY; iy++) {
        pos[i]     = ix * SEP - (NX * SEP) / 2;
        pos[i + 1] = 0;
        pos[i + 2] = iy * SEP - (NY * SEP) / 2;
        scl[j]     = 1;
        i += 3; j++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('scale',    new THREE.BufferAttribute(scl, 1));

    const mat = new THREE.ShaderMaterial({
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
          gl_FragColor = vec4(color, 1.0 - d);
        }
      `,
      transparent: true
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let mx = 0, my = 0;
    const hx = window.innerWidth  / 2;
    const hy = window.innerHeight / 2;
    const onMove = e => {
      mx = e.clientX - hx;
      my = e.clientY - hy;
    };
    document.addEventListener('mousemove', onMove);

    const animate = () => {
      requestAnimationFrame(animate);
      camera.position.x += (mx - camera.position.x) * 0.05;
      camera.position.y += (-my - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      let idx = 0, k = 0;
      for (let ix = 0; ix < NX; ix++) {
        for (let iy = 0; iy < NY; iy++) {
          pos[idx + 1] = Math.sin((ix + count) * 0.3) * 50
                       + Math.sin((iy + count) * 0.5) * 50;
          scl[k] = (Math.sin((ix + count) * 0.3) + 1) * 8
                 + (Math.sin((iy + count) * 0.5) + 1) * 8;
          idx += 3; k++;
        }
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.scale.needsUpdate    = true;
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
      document.removeEventListener('mousemove', onMove);
      container.removeChild(renderer.domElement);
    };
  }, []);

  // load user_id
  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored) setForm(f => ({ ...f, user_id: JSON.parse(stored).id }));
  }, []);

  const clearIntervals = () => {
    clearInterval(colorInterval.current);
    clearInterval(num1Interval.current);
    clearInterval(num2Interval.current);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(''); setResultado(null); setSpinning(true);

    // cube spin visuals
    const cols = ['red','black','green'];
    colorInterval.current = setInterval(() => {
      setCubeColor(cols[Math.floor(Math.random()*3)]);
    }, 80);
    num1Interval.current = setInterval(() => {
      setCubeNum1(Math.floor(Math.random()*10));
    }, 80);
    num2Interval.current = setInterval(() => {
      setCubeNum2(Math.floor(Math.random()*10));
    }, 80);

    const { user_id, apostado_numero, apostado_color, valor_apuesta } = form;
    if (
      !user_id || !apostado_numero || !apostado_color || !valor_apuesta ||
      isNaN(+apostado_numero) || isNaN(+valor_apuesta) ||
      !['red','black','green'].includes(apostado_color.toLowerCase())
    ) {
      setMessage('❌ Todos los campos son obligatorios y válidos.');
      clearIntervals(); setSpinning(false);
      return;
    }

    setLog(`➡ POST /rondas\n${JSON.stringify(form, null,2)}`);
    try {
      const res = await axios.post('http://localhost:3002/rondas', {
        user_id:+user_id,
        apostado_numero:+apostado_numero,
        apostado_color:apostado_color.toLowerCase(),
        valor_apuesta:+valor_apuesta
      });
      setLog(l => l + `\n✅ ${res.status} ${JSON.stringify(res.data)}`);
      setResultado(res.data.resultado);
      setMessage(res.data.message);

      clearIntervals(); setSpinning(false);
      setCubeColor(res.data.resultado.color);
      const num = res.data.resultado.numero;
      setCubeNum1(Math.floor(num/10));
      setCubeNum2(num % 10);
    } catch (err) {
      const st = err.response?.status || 'Error';
      const dt = err.response?.data   || err.message;
      setLog(l => l + `\n❌ ${st} ${JSON.stringify(dt)}`);
      setMessage('❌ Hubo un error realizando la jugada.');
      clearIntervals(); setSpinning(false);
      setCubeColor('gray');
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
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin3d { to { transform: rotateX(360deg) rotateY(360deg); } }
        @keyframes emojiBounce {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-5px); }
        }

        .game-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
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

        .dashboard-nav {
          margin-bottom: var(--spacing);
          animation: fadeInUp 0.8s var(--transition) both;
        }
        .nav-list {
          display: flex;
          gap: var(--spacing);
          padding: var(--spacing);
          background: var(--panel-bg);
          backdrop-filter: blur(6px);
          border-radius: var(--radius);
          list-style: none;
          margin: 0 0 var(--spacing);
        }
        .nav-link, .signout-button {
          display: flex;
          align-items: center;
          gap: .25rem;
          padding: .5rem 1rem;
          border-radius: var(--radius);
          background: transparent;
          color: var(--text);
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          transition: background var(--transition), color var(--transition);
        }
        .nav-link:hover { background: var(--accent); color:#fff; }
        .signout-button:hover { background: var(--accent2); color:#fff; }
        .nav-link .emoji, .signout-button .emoji {
          animation: emojiBounce 2s infinite;
        }

        .cubes-container {
          display: flex;
          gap: var(--spacing);
          perspective: 600px;
          margin-bottom: calc(var(--spacing)*2);
        }
        .cube {
          width: calc(var(--spacing)*6);
          height: calc(var(--spacing)*6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          border-radius: var(--radius);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          backface-visibility: hidden;
          transform-style: preserve-3d;
          transition: all var(--transition);
        }
        .cube.spin { animation: spin3d .8s linear infinite; }
        .cube-color {
          background: linear-gradient(145deg,#fff,var(--cube-color));
          border:4px solid var(--cube-color);
          color:#fff;
        }
        .cube-num {
          background:#fff;
          border:4px solid var(--cube-color);
          color: var(--cube-color);
        }

        form {
          display: grid;
          gap: var(--spacing);
          width:100%;
          max-width:360px;
          margin-bottom: calc(var(--spacing)*2);
          background: var(--panel-bg);
          padding: var(--spacing);
          border-radius: var(--radius);
          backdrop-filter: blur(6px);
        }
        label {
          display:flex;
          flex-direction:column;
          font-weight:500;
        }
        input, select, button {
          margin-top:.25rem;
          padding:.75rem;
          border-radius:var(--radius);
          border:1px solid #ccc;
        }
        button {
          background: var(--accent);
          color:#fff;
          border:none;
          cursor:pointer;
          transition: background var(--transition), transform var(--transition);
        }
        button:hover { background:#106bb2; transform: translateY(-2px); }

        .message {
          font-weight:600;
          margin-bottom: var(--spacing);
        }
        .log-panel {
          width:100%;
          max-width:500px;
          background: var(--panel-bg);
          padding: var(--spacing);
          border-radius: var(--radius);
          font-family: var(--mono);
          white-space: pre-wrap;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="game-container">
        <div ref={canvasRef} className="background-canvas" />

        <nav className="dashboard-nav">
          <ul className="nav-list">
            <li><Link to="/" className="nav-link"><span className="emoji">🏠</span> Home</Link></li>
            <li><Link to="/login" className="nav-link"><span className="emoji">🔑</span> Log In</Link></li>
            <li><Link to="/signup" className="nav-link"><span className="emoji">✒️</span> Sign Up</Link></li>
            <li><Link to="/dashboard" className="nav-link"><span className="emoji">📋</span> Dashboard</Link></li>
            <li><Link to="/stats" className="nav-link"><span className="emoji">📊</span> Estadísticas</Link></li>
            <li><button className="signout-button"><span className="emoji">🚪</span> Sign Out</button></li>
          </ul>
        </nav>

        <div className="cubes-container">
          <div className={`cube cube-color ${spinning ? 'spin' : ''}`}
               style={{ '--cube-color': cubeColor }} />
          <div className={`cube cube-num ${spinning ? 'spin' : ''}`}
               style={{ '--cube-color': cubeColor }}>{cubeNum1}</div>
          <div className={`cube cube-num ${spinning ? 'spin' : ''}`}
               style={{ '--cube-color': cubeColor }}>{cubeNum2}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Número Apostado (0–36):
            <input name="apostado_numero" value={form.apostado_numero}
                   onChange={handleChange} required type="number" />
          </label>

          <label>
            Color Apostado:
            <select name="apostado_color" value={form.apostado_color}
                    onChange={handleChange} required>
              <option value="">--Selecciona--</option>
              <option value="red">🔴 Red</option>
              <option value="black">⚫ Black</option>
              <option value="green">🟢 Green</option>
            </select>
          </label>

          <label>
            Valor Apuesta:
            <input name="valor_apuesta" value={form.valor_apuesta}
                   onChange={handleChange} required type="number" />
          </label>

          <button type="submit" disabled={spinning}>🌀 Jugar</button>
        </form>

        {message && <div className="message">{message}</div>}

        {resultado && (
          <div style={{ marginBottom: '1rem' }}>
            <strong>Resultado:</strong>
            <pre>{JSON.stringify(resultado, null, 2)}</pre>
          </div>
        )}

        <div className="log-panel">{log}</div>
      </div>
    </>
  );
};

export default RouletteGame;
