#!/usr/bin/env python3
"""
run_project.py

Orquesta el lanzamiento de los microservicios y frontend de "Roulette".
- No reinstala deps de los microservicios (suponemos ya están instaladas).
- Instala deps del frontend solo si falta react-scripts.
- Lanza cada uno en su propia ventana de terminal.
"""
import os
import subprocess
import platform
import shutil
import sys
import time

# Detectar sistema operativo
IS_WINDOWS  = platform.system() == "Windows"
NODE_CMD    = "node.exe" if IS_WINDOWS else "node"
NPM_CMD     = "npm.cmd"  if IS_WINDOWS else "npm"

# Rutas base
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
SERVICES_DIR= os.path.join(BASE_DIR, "Services")
FRONTEND_DIR= os.path.join(BASE_DIR, "roulette-frontend")

# Verificar herramientas disponibles
def check_tool(cmd):
    if not (shutil.which(cmd) or (os.path.isabs(cmd) and os.path.isfile(cmd))):
        print(f"❌ No se encontró: {cmd}")
        sys.exit(1)
for t in (NODE_CMD, NPM_CMD):
    check_tool(t)

# Descubre carpetas de servicios que tengan index.js
def discover_services():
    return [
        d for d in os.listdir(SERVICES_DIR)
        if os.path.isdir(os.path.join(SERVICES_DIR, d))
        and os.path.isfile(os.path.join(SERVICES_DIR, d, "index.js"))
    ]

# Lanza un comando en nueva ventana/terminal
def launch_console(cmd, cwd, title):
    if IS_WINDOWS:
        # 'start "" cmd /k "cd /d C:\ruta && cmd..."'
        cmd_str = f'start "" cmd /k "cd /d {cwd} && {cmd}"'
        return subprocess.Popen(cmd_str, shell=True)
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

# Inicia microservicios sin reinstalar deps
def start_services():
    svcs = discover_services()
    if not svcs:
        print("❌ No se encontraron servicios en Services/.")
        sys.exit(1)
    procs = []
    for s in svcs:
        path = os.path.join(SERVICES_DIR, s)
        print(f"🚀 Lanzando servicio '{s}' …")
        procs.append(launch_console(f"{NODE_CMD} index.js", path, title=s))
    return procs

# Inicia el frontend, instala si falta react-scripts
def start_frontend():
    # Comprueba si react-scripts está disponible
    bin_name = "react-scripts.cmd" if IS_WINDOWS else "react-scripts"
    bin_path = os.path.join(FRONTEND_DIR, "node_modules", ".bin", bin_name)
    if not os.path.isfile(bin_path):
        print("🔧 Instalando dependencias del frontend…")
        subprocess.run([NPM_CMD, "install"], cwd=FRONTEND_DIR, check=True)
    print("🚀 Lanzando frontend React…")
    return launch_console(f"{NPM_CMD} start", FRONTEND_DIR, title="frontend")

def main():
    service_procs = start_services()
    frontend_proc = start_frontend()
    print("\n🎉 Todos los servicios y el frontend están corriendo en ventanas separadas.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Orquestador detenido. Cierra las ventanas manualmente si lo deseas.")

if __name__ == "__main__":
    main()
