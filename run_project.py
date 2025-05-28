
#!/usr/bin/env python3
"""
run_project.py

Orquesta el lanzamiento de los microservicios, el frontend y Prometheus,
y siembra datos de prueba (usuarios) para que puedas comprobarlo de inmediato.
"""
import os, subprocess, platform, shutil, sys, time, webbrowser, requests

IS_WINDOWS  = platform.system() == "Windows"
NODE_CMD    = "node.exe" if IS_WINDOWS else "node"
NPM_CMD     = "npm.cmd"  if IS_WINDOWS else "npm"
DOCKER_COMPOSE = "docker-compose"

BASE_DIR     = os.path.dirname(os.path.abspath(__file__))
SERVICES_DIR = os.path.join(BASE_DIR, "Services")
FRONTEND_DIR = os.path.join(BASE_DIR, "roulette-frontend")
COMPOSE_FILE = os.path.join(BASE_DIR, "docker-compose.yml")

def check_tool(cmd):
    if not (shutil.which(cmd) or os.path.isfile(cmd)):
        print(f"❌ No se encontró: {cmd}"); sys.exit(1)
for t in (NODE_CMD, NPM_CMD, DOCKER_COMPOSE): check_tool(t)

def discover_services():
    return [
        d for d in os.listdir(SERVICES_DIR)
        if os.path.isdir(os.path.join(SERVICES_DIR, d))
        and os.path.isfile(os.path.join(SERVICES_DIR, d, "index.js"))
    ]

def launch_console(cmd, cwd, title):
    if IS_WINDOWS:
        s = f'start "" cmd /k "cd /d {cwd} && {cmd}"'
        return subprocess.Popen(s, shell=True)
    else:
        term = shutil.which("gnome-terminal") or shutil.which("xterm")
        if term and "gnome-terminal" in term:
            return subprocess.Popen([
                "gnome-terminal", "--title", title,
                "--", "bash", "-c", f'cd "{cwd}" && {cmd}; exec bash'
            ])
        else:
            return subprocess.Popen([
                "xterm", "-T", title,
                "-e", f'cd "{cwd}" && {cmd}; bash'
            ])

def start_services():
    svcs = discover_services()
    if not svcs:
        print("❌ No se encontraron servicios en Services/."); sys.exit(1)
    procs = []
    for s in svcs:
        path = os.path.join(SERVICES_DIR, s)
        print(f"🚀 Lanzando servicio '{s}' …")
        procs.append(launch_console(f"{NODE_CMD} index.js", path, title=s))
    return procs

def start_frontend():
    bin_name = "react-scripts.cmd" if IS_WINDOWS else "react-scripts"
    bin_path = os.path.join(FRONTEND_DIR, "node_modules", ".bin", bin_name)
    if not os.path.isfile(bin_path):
        print("🔧 Instalando dependencias del frontend…")
        subprocess.run([NPM_CMD, "install"], cwd=FRONTEND_DIR, check=True)
    print("🚀 Lanzando frontend React…")
    return launch_console(f"{NPM_CMD} start", FRONTEND_DIR, title="frontend")

def start_docker_services():
    print("🐳 Levantando Postgres y Prometheus con Docker Compose…")
    subprocess.run(
        [DOCKER_COMPOSE, "-f", COMPOSE_FILE,
         "up", "-d", "postgres-users", "prometheus"],
        cwd=BASE_DIR, check=True)

def seed_example_users():
    print("🌱 Creando usuarios de ejemplo en Users…")
    ejemplo = [
        {"name":"Alice","email":"alice@mail.com","alias":"AliceA","password":"pass1"},
        {"name":"Bob","email":"bob@mail.com","alias":"BobB","password":"pass2"},
        {"name":"Carol","email":"carol@mail.com","alias":"CarolC","password":"pass3"}
    ]
    url = "http://localhost:3001/users"
    headers = {"Content-Type":"application/json"}
    for u in ejemplo:
        try:
            r = requests.post(url, json=u, headers=headers, timeout=5)
            if r.status_code == 201:
                print(f"   ✓ Usuario '{u['alias']}' creado")
            else:
                print(f"   ⚠️ No se creó '{u['alias']}': {r.status_code}")
        except Exception as e:
            print(f"   ❌ Error al crear '{u['alias']}': {e}")

def main():
    service_procs = start_services()
    frontend_proc = start_frontend()
    start_docker_services()

    webbrowser.open('http://localhost:3000/login')
    print("⏳ Esperando a que Users responda en http://localhost:3001/health…")
    for _ in range(15):
        try:
            if requests.get("http://localhost:3001/health", timeout=2).status_code == 200:
                break
        except:
            time.sleep(1)
    else:
        print("❌ Users no respondió a tiempo. Abortando seed."); return

    seed_example_users()
    print("\n🎉 ¡Todo está corriendo y los datos de ejemplo están creados!")
    print("   - Frontend:  http://localhost:3000")
    print("   - Prometheus: http://localhost:9090")
    print("   - API Users: http://localhost:3001/users")

    try:
        while True: time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Orquestador detenido.")

if __name__ == "__main__":
    main()
