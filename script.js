// Función para abrir la invitación (sobre) y reproducir la música
function abrirInvitacion() {
    // Obtener el sobre y la invitación
    const envelope = document.getElementById('envelope');
    const invitacion = document.getElementById('invitacion');
    
    // Añadir clase para animar la apertura del sobre
    envelope.classList.add('open');

    // Mostrar la invitación después de la animación
    setTimeout(() => {
        envelope.style.display = 'none';
        invitacion.style.display = 'block';

    }, 1000); // Ajustar tiempo para esperar la animación de apertura del sobre
}

// Asignar el evento de clic al sello para abrir el sobre
document.addEventListener('DOMContentLoaded', function() {
    const seal = document.getElementById('seal');
    if (seal) {
        seal.addEventListener('click', abrirInvitacion);
    }

    // Iniciar el contador y cargar los datos del invitado al cargar la página
    iniciarContador();
    cargarDatosInvitado();
});

// Función para obtener datos de invitados (sin inputs)
// Carga datos de invitado desde invitados.json según ?id=123
async function cargarDatosInvitado() {
    const params = new URLSearchParams(window.location.search);
    const invitadoId = params.get('id');
    if (!invitadoId) {
      console.warn('ID de invitado no encontrado en el enlace.');
      return;
    }
  
    try {
      // Ajusta la ruta si tu index no está en la raíz
      const res = await fetch('invitados.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
  
      const invitados = await res.json();
      const invitado = invitados[invitadoId] || null;
  
      const nombreEl = document.getElementById('nombreInvitado');
      const pasesEl  = document.getElementById('cantidadPases');
  
      // Nombre (ocultar si no hay)
      if (invitado?.nombre && invitado.nombre.toLowerCase() !== 'sin nombre') {
        nombreEl.innerText = invitado.nombre;
        nombreEl.style.display = '';
      } else {
        nombreEl.style.display = 'none';
      }
  
      // Pases (ocultar si no hay número)
      if (Number.isFinite(invitado?.pases)) {
        pasesEl.innerText = `Pases: ${invitado.pases}`;
        pasesEl.style.display = '';
      } else {
        pasesEl.style.display = 'none';
      }
  
      // Guarda en memoria por si lo necesitas en otras funciones
      window.__invitadoActual = invitado;
    } catch (e) {
      console.error('No se pudo cargar invitados.json', e);
    }
  }
  

// Función para iniciar el contador de la fecha del evento
function iniciarContador() {
    const eventoFecha = new Date("October 04, 2025 20:00:00").getTime();

    setInterval(() => {
        const ahora = new Date().getTime();
        const diferencia = eventoFecha - ahora;

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        document.getElementById("dias").innerText = dias;
        document.getElementById("horas").innerText = horas;
        document.getElementById("minutos").innerText = minutos;
        document.getElementById("segundos").innerText = segundos;
    }, 1000);
}

// Función para abrir el lightbox solo al hacer clic en una imagen de la galería
function changePhoto(element) {
    const mainPhotoModal = document.getElementById('main-photo-modal');

    // Establecer la imagen del modal como la imagen seleccionada
    mainPhotoModal.src = element.src;

    // Mostrar el modal
    openModal();
}

// Función para mostrar el modal
function openModal() {
    const modal = document.getElementById('photo-modal');
    modal.style.display = 'flex'; // Usar 'flex' para centrar la imagen en pantalla
}

// Función para cerrar el modal
function closeModal(event) {
    // Cerrar el modal solo si el clic no fue en la imagen
    if (event.target.id === 'photo-modal' || event.target.className === 'close') {
        const modal = document.getElementById('photo-modal');
        modal.style.display = 'none';
    }
}

    // Fade-in effect cuando los elementos se hacen visibles al hacer scroll
    document.addEventListener("DOMContentLoaded", function() {
        const elementsToFade = document.querySelectorAll('.fade-in-element');

        const observerOptions = {
            threshold: 0.5, // El porcentaje del elemento que debe ser visible antes de activar la animación
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Deja de observar una vez que la animación se activa
                }
            });
        }, observerOptions);

        elementsToFade.forEach(element => {
            observer.observe(element);
        });
    });

// Función para confirmar la asistencia (maneja singular/plural)
// Configuración del Google Form
const GF_BASE = "https://docs.google.com/forms/d/e/1FAIpQLScIbR_LCyOTg7IMdhJ58GGWXbSAxlLcgHcCzpGb-DyQGxttSg/viewform";
const GF_FIELD_NOMBRE = "entry.1297710131";   // <-- tu campo "Nombre"
const GF_FIELD_PASES  = "entry.1099367965";   // <-- tu campo "Pases"

// Obtiene nombre y pases del invitado
function obtenerDatosInvitado() {
  const nombreDOM = document.getElementById('nombreInvitado')?.innerText?.trim();
  const pasesText = document.getElementById('cantidadPases')?.innerText || '';
  const match = pasesText.match(/(\d+)/);
  let pases = match ? parseInt(match[1], 10) : undefined;

  const invitado = window.__invitadoActual || {};
  const nombre = nombreDOM || invitado.nombre || 'Invitado';
  if (!Number.isFinite(pases)) pases = Number.isFinite(invitado.pases) ? invitado.pases : 1;

  return { nombre, pases };
}

// Construye la URL prellenada
function construirURLPrefill({ nombre, pases }) {
  const params = new URLSearchParams({
    usp: "pp_url",
    [GF_FIELD_NOMBRE]: nombre,
    [GF_FIELD_PASES]: String(pases)
  });
  return `${GF_BASE}?${params.toString()}`;
}

// Redirige al form en nueva pestaña
function confirmarAsistencia() {
  const { nombre, pases } = obtenerDatosInvitado();
  const url = construirURLPrefill({ nombre, pases });
  window.open(url, '_blank');
}

  
      
//Funcion para abrir waze o maps
//iglesia
function elegirAplicacion() {
    const enlaceGoogleMaps = 'https://maps.app.goo.gl/PdugPMHiWNougzhN7';
    const enlaceWaze = 'https://ul.waze.com/ul?venue_id=176619666.1766196661.2132634&overview=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location';

    // Intentar abrir Google Maps primero
    window.open(enlaceGoogleMaps, '_blank');
    
    // Intentar abrir Waze (en caso de que Google Maps no esté disponible)
    setTimeout(() => {
        window.open(enlaceWaze, '_blank');
    }, 1000); // Retraso para permitir que el primer enlace se abra si está disponible
}
//fiesta
function elegirAplicacionOtraDireccion() {
    const enlaceGoogleMaps = 'https://maps.app.goo.gl/c8jAAN9pL88YQffe9';
    const enlaceWaze = 'https://ul.waze.com/ul?venue_id=176619666.1766065588.26091657&overview=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location';

    // Intentar abrir Google Maps primero
    window.open(enlaceGoogleMaps, '_blank');

    // Intentar abrir Waze (en caso de que Google Maps no esté disponible)
    setTimeout(() => {
        window.open(enlaceWaze, '_blank');
    }, 1000); // Retraso para permitir que el primer enlace se abra si está disponible
}
function mostrarCuenta() {
    const info = document.getElementById("info-cuenta");
    if (info.style.display === "none") {
        info.style.display = "block";
    } else {
        info.style.display = "none";
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Mostrar/Ocultar buenos deseos
    document.getElementById('show-wishes').addEventListener('click', function () {
      window.toggleWishes();
    });
  
    // Mostrar formulario de envío
    document.getElementById('send-wish').addEventListener('click', function () {
      const form = document.getElementById('wish-form');
      form.classList.toggle('hidden');
    });
  
    // Enviar mensaje
    document.getElementById('submit-wish').addEventListener('click', function () {
      const nombre = document.getElementById('wish-name').value.trim();
      const mensaje = document.getElementById('wish-message').value.trim();
  
      if (!nombre || !mensaje) {
        alert('Por favor, completa ambos campos.');
        return;
      }
  
      window.guardarDeseo(nombre, mensaje)
        .then(() => {
          alert('¡Gracias por tus buenos deseos!');
          document.getElementById('wish-name').value = '';
          document.getElementById('wish-message').value = '';
          document.getElementById('wish-form').classList.add('hidden');
          document.getElementById('wishes-container').dataset.loaded = 'false';
        })
        .catch((error) => {
          console.error('Error al guardar el deseo:', error);
          alert('Hubo un problema al enviar tu mensaje.');
        });
    });
  });
  
