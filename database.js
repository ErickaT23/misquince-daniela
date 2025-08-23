import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getDatabase, ref, push, onValue } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyAdTZKUgNePKOddfuS1ahydna7CB8u7hic",
  authDomain: "basededatos-walfrenyrode.firebaseapp.com",
  databaseURL: "https://basededatos-walfrenyrode-default-rtdb.firebaseio.com",
  projectId: "basededatos-walfrenyrode",
  storageBucket: "basededatos-walfrenyrode.firebasestorage.app",
  messagingSenderId: "671163373823",
  appId: "1:671163373823:web:e2f87aa292ac1cec9b14ca"
};
// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Definir funciones globales
window.guardarDeseo = function(nombre, mensaje) {
  return push(ref(db, 'buenos-deseos/'), {
    nombre,
    mensaje,
    timestamp: new Date().toISOString()
  });
};

window.toggleWishes = function() {
  const wishesDiv = document.getElementById('wishes-container');

  if (wishesDiv.classList.contains('visible')) {
    wishesDiv.classList.remove('visible');
    wishesDiv.classList.add('hidden');
    return;
  }

  if (wishesDiv.dataset.loaded === 'true') {
    wishesDiv.classList.remove('hidden');
    wishesDiv.classList.add('visible');
    return;
  }

  onValue(ref(db, 'buenos-deseos/'), (snapshot) => {
    requestIdleCallback(() => {
      wishesDiv.innerHTML = '';

      snapshot.forEach((childSnapshot) => {
        const wish = childSnapshot.val();
        const wishElement = document.createElement('p');
        wishElement.innerHTML = `<strong>${wish.nombre}:</strong> ${wish.mensaje}`;
        wishesDiv.appendChild(wishElement);
      });

      wishesDiv.dataset.loaded = 'true';
      wishesDiv.classList.remove('hidden');
      wishesDiv.classList.add('visible');
    });
  });
};
