// Lista en memoria con los nombres de los participantes
let amigos = [];

// Tomamos referencias a los elementos que ya están en el HTML
const $input = document.getElementById('amigo');
const $lista = document.getElementById('listaAmigos');
const $resultado = document.getElementById('resultado');
const $btnReiniciar = document.getElementById('reiniciar');

/*
 * Recibe un string y lo "arregla":
 * - quita espacios al principio/fin
 * - colapsa espacios múltiples
 * - elimina caracteres que no sean letras/espacios
 * - capitaliza: "ana MARÍA" -> "Ana maría"
 */
function normalizaNombre(raw) {
  const limpio = raw.trim()
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '') // solo letras y espacios
    .replace(/\s+/g, ' ');                     // espacios múltiples a uno

  if (!limpio) return '';

  // Capitaliza primera letra; el resto en minúsculas
  return limpio.charAt(0).toUpperCase() + limpio.slice(1).toLowerCase();
}

/*
 * Agrega un amigo a la lista (si el nombre es válido y no está repetido).
 */
function agregarAmigo() {
  const nombreFormateado = normalizaNombre($input.value);

  if (!nombreFormateado) {
    alert('Por favor, inserta un nombre.');
    return;
  }

  // Evita duplicados exactos (ya formateados)
  if (amigos.includes(nombreFormateado)) {
    alert('Este amigo ya está en la lista');
    return;
  }

  amigos.push(nombreFormateado);
  renderLista();          // refresca la lista en pantalla
  $input.value = '';      // limpia el campo
  $input.focus();         // UX: vuelve a enfocar para seguir agregando
  actualizarEstadoBotones();
}

/*
 * Realiza el sorteo de un nombre al azar y lo muestra.
 */
function sortearAmigo() {
  if (amigos.length === 0) {
    alert('No hay amigos en la lista. Agrega algunos primero.');
    return;
  }

  // Índice aleatorio entre 0 y amigos.length - 1
  const idx = Math.floor(Math.random() * amigos.length);
  const ganador = amigos[idx];

  // Limpia el área de resultado y muestra al ganador
  $resultado.innerHTML = '';
  const li = document.createElement('li');
  // Aquí uso innerHTML porque controlo el contenido (ganador ya está normalizado)
  li.innerHTML = '¡El amigo secreto sorteado es: <strong>' + ganador + '</strong>!';
  $resultado.appendChild(li);

  // Habilita el botón de reinicio tras el sorteo
  $btnReiniciar.removeAttribute('disabled');
}

/*
 * Limpia todo para comenzar de cero.
 */
function reiniciarJuego() {
  amigos = [];
  $lista.innerHTML = '';
  $resultado.innerHTML = '';
  $btnReiniciar.setAttribute('disabled', 'true');
  $input.value = '';
  $input.focus();
}

/*
 * Habilita/Deshabilita controles según el estado de la lista.
 * (Aquí es mínimo, pero sirve si luego agregas más botones/acciones).
 */
function actualizarEstadoBotones() {
  if (amigos.length === 0) {
    $btnReiniciar.setAttribute('disabled', 'true');
  }
}

/*
 * Pinta la lista de amigos en el <ul> correspondiente.
 * - Ordena alfabéticamente (locale es-ES para tildes/ñ).
 * - Usa createElement/textContent para evitar HTML accidental.
 */
function renderLista() {
  const ordenados = [...amigos].sort((a, b) =>
    a.localeCompare(b, 'es', { sensitivity: 'base' })
  );

  // Vacía el contenedor y vuelve a pintarlo
  $lista.innerHTML = '';
  for (const nombre of ordenados) {
    const li = document.createElement('li');
    li.textContent = nombre;
    $lista.appendChild(li);
  }
}

/*
 * Permite agregar con Enter desde el input.
 * (keydown es preferible a keypress, que está deprecado).
 */
$input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') agregarAmigo();
});

