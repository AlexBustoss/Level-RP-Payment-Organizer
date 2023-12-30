// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM que usaremos
  const rpForm = document.getElementById('rp-form');
  const rpNameInput = document.getElementById('rp-name');
  const rpTablesInput = document.getElementById('rp-tables');
  const rpTableBody = document.getElementById('rps-table').getElementsByTagName('tbody')[0];

  // Cargar datos desde el almacenamiento local al iniciar
  cargarDatosLocales();

  // Función para cargar datos desde el almacenamiento local
  function cargarDatosLocales() {
      const datosLocales = JSON.parse(localStorage.getItem('misDatos')) || [];
      datosLocales.forEach(dato => {
          insertarFilaEnTabla(dato.rpName, dato.tables, dato.payment);
      });
  }

  // Función para insertar o actualizar una fila en la tabla
  function insertarFilaEnTabla(rpName, tables, payment) {
      let row = document.querySelector(`tr[data-rp-name="${rpName}"]`);
      if (!row) {
          row = rpTableBody.insertRow();
          row.setAttribute('data-rp-name', rpName);
          row.insertCell(0).textContent = rpName;
          row.insertCell(1).textContent = tables;
          row.insertCell(2).textContent = payment;
          row.insertCell(3).innerHTML = '<button class="action-button edit">Editar</button>' +
                                         '<button class="action-button delete">Eliminar</button>';
      } else {
          row.cells[1].textContent = tables;
          row.cells[2].textContent = payment;
      }

      // Agregar eventos a los botones de acción
      row.querySelector('.edit').onclick = () => editRp(rpName);
      row.querySelector('.delete').onclick = () => deleteRp(row);
  }

  // Función para agregar o actualizar un RP
  function addOrUpdateRp(event) {
      event.preventDefault();

      // Obtenemos los valores ingresados
      const rpName = rpNameInput.value.trim();
      const tables = parseInt(rpTablesInput.value, 10);

      if (!rpName || isNaN(tables)) {
          alert('Por favor, ingresa un nombre y el número de mesas.');
          return;
      }

      // Calculamos el pago
      const payment = tables * 200; // 200 es el precio por mesa

      // Insertamos o actualizamos la fila en la tabla
      insertarFilaEnTabla(rpName, tables, `$${payment}`);

      // Guardamos los datos en el almacenamiento local
      guardarDatosLocales();

      // Resetear el formulario
      rpForm.reset();

      // Ordenamos la tabla
      sortTable();
  }

  // Función para editar un RP
  function editRp(rpName) {
      // Encontramos la fila correspondiente y llenamos el formulario para edición
      const row = document.querySelector(`tr[data-rp-name="${rpName}"]`);
      rpNameInput.value = rpName;
      rpTablesInput.value = row.cells[1].textContent;
  }

  // Función para eliminar un RP
  function deleteRp(row) {
      if (confirm('¿Estás seguro de que quieres eliminar este RP?')) {
          rpTableBody.removeChild(row);
          guardarDatosLocales(); // Actualizar los datos en el almacenamiento local después de la eliminación
      }
  }

  // Evento de envío del formulario
  rpForm.addEventListener('submit', addOrUpdateRp);

  // Función para guardar datos en el almacenamiento local
  function guardarDatosLocales() {
      const datosParaGuardar = [];
      const filas = rpTableBody.querySelectorAll('tr');
      filas.forEach(fila => {
          const celdas = fila.querySelectorAll('td');
          if (celdas.length > 0) {
              datosParaGuardar.push({
                  rpName: celdas[0].textContent,
                  tables: parseInt(celdas[1].textContent, 10),
                  payment: celdas[2].textContent
              });
          }
      });
      localStorage.setItem('misDatos', JSON.stringify(datosParaGuardar));
  }

  // Función para ordenar la tabla de RP
  function sortTable() {
      let rows, switching, i, x, y, shouldSwitch;
      switching = true;
      while (switching) {
          switching = false;
          rows = rpTableBody.rows;
          for (i = 0; i < (rows.length - 1); i++) {
              shouldSwitch = false;
              x = rows[i].getElementsByTagName("TD")[2];
              y = rows[i + 1].getElementsByTagName("TD")[2];
              if (Number(x.textContent.replace('$', '')) < Number(y.textContent.replace('$', ''))) {
                  shouldSwitch = true;
                  break;
              }
          }
          if (shouldSwitch) {
              rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
              switching = true;
          }
      }
  }

  // Registro del Service Worker para hacer la app funcional offline
  if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
          navigator.serviceWorker.register('/Level-RP-Payment-Organizer/js/serviceWorker.js').then(function(registration) {
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function(err) {
              console.log('ServiceWorker registration failed: ', err);
          });
      });
  }
});
