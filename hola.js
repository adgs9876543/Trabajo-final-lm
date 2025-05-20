const inputNombre = document.getElementById('nombre');
const listaUl = document.getElementById('lista-participantes');
const ganadorEl = document.getElementById('ganador');
const alertas = document.getElementById('alertas');

let participantes = [];

document.getElementById('btn-agregar').addEventListener('click', agregarParticipante);
document.getElementById('btn-sortear').addEventListener('click', sortearGanador);
document.getElementById('btn-limpiar').addEventListener('click', limpiarParticipantes);
document.getElementById('btn-exportar').addEventListener('click', exportarJSON);

function agregarParticipante() {
    const nombre = inputNombre.value.trim();
    if (nombre === "") return mostrarAlerta('⚠️ Ingresa un nombre', 'warning');

    participantes.push(nombre);
    inputNombre.value = "";
    renderLista();
    mostrarAlerta(`✅ Participante "${nombre}" agregado`, 'success');
}

function renderLista() {
    listaUl.innerHTML = '';
    participantes.forEach((nombre, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `${nombre} <span class="badge bg-danger rounded-pill" style="cursor:pointer;">Eliminar</span>`;

        li.querySelector('span').addEventListener('click', () => {
            if (confirm(`¿Eliminar a "${nombre}"?`)) {
                participantes.splice(index, 1);
                renderLista();
                mostrarAlerta(`❌ Participante "${nombre}" eliminado`, 'danger');
            }
        });

        listaUl.appendChild(li);
    });
}

function sortearGanador() {
    if (participantes.length < 2) {
        return mostrarAlerta('❗ Se necesitan al menos 2 participantes', 'danger');
    }

    let contador = 0;
    const interval = setInterval(() => {
        const aleatorio = participantes[Math.floor(Math.random() * participantes.length)];
        ganadorEl.textContent = aleatorio;
        ganadorEl.style.transform = 'scale(1.3)';
        setTimeout(() => ganadorEl.style.transform = 'scale(1)', 150);
        contador++;

        if (contador > 20) {
            clearInterval(interval);
            mostrarAlerta(`🎊 Ganador: ${ganadorEl.textContent}`, 'success');
        }
    }, 100);
}

function limpiarParticipantes() {
    if (participantes.length === 0) return;

    if (confirm('¿Seguro que quieres eliminar todos los participantes?')) {
        participantes = [];
        renderLista();
        ganadorEl.textContent = '';
        mostrarAlerta('🗑️ Lista limpiada', 'info');
    }
}

function exportarJSON() {
    const data = JSON.stringify(participantes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'participantes.json';
    a.click();

    URL.revokeObjectURL(url);
}

function mostrarAlerta(mensaje, tipo = 'info') {
    const div = document.createElement('div');
    div.className = `alert alert-${tipo}`;
    div.textContent = mensaje;
    alertas.innerHTML = '';
    alertas.appendChild(div);

    setTimeout(() => div.remove(), 4000);
}

