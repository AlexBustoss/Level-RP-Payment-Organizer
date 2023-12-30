// Esperamos a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM que usaremos
    const rpForm = document.getElementById('rp-form');
    const rpNameInput = document.getElementById('rp-name');
    const rpTablesInput = document.getElementById('rp-tables');
    const rpTableBody = document.getElementById('rps-table').getElementsByTagName('tbody')[0];
  
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
  
      // Creamos o actualizamos la fila en la tabla
      let row = document.querySelector(`tr[data-rp-name="${rpName}"]`);
      if (!row) {
        row = rpTableBody.insertRow();
        row.setAttribute('data-rp-name', rpName);
        row.insertCell(0).textContent = rpName;
        row.insertCell(1).textContent = tables;
        row.insertCell(2).textContent = `$${payment}`;
        row.insertCell(3).innerHTML = '<button class="action-button edit">Editar</button>' +
                                       '<button class="action-button delete">Eliminar</button>';
      } else {
        row.cells[1].textContent = tables;
        row.cells[2].textContent = `$${payment}`;
      }
  
      // Agregar eventos a los botones de acción
      row.querySelector('.edit').onclick = () => editRp(rpName);
      row.querySelector('.delete').onclick = () => deleteRp(row);
  
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
      }
    }
  
    // Evento de envío del formulario
    rpForm.addEventListener('submit', addOrUpdateRp);
  
    // Función para ordenar la tabla de RP
    function sortTable() {
      let rows, switching, i, x, y, shouldSwitch;
      switching = true;
      // Continuar mientras haya 'switching' (cambios)
      while (switching) {
        switching = false;
        rows = rpTableBody.rows;
        // Recorrer todas las filas de la tabla (excepto la primera que son los títulos)
        for (i = 0; i < (rows.length - 1); i++) {
          shouldSwitch = false;
          // Obtener los elementos que queremos comparar, uno de la fila actual y otro de la siguiente
          x = rows[i].getElementsByTagName("TD")[2]; // La columna del pago
          y = rows[i + 1].getElementsByTagName("TD")[2];
          // Comprobar si las dos filas deben cambiar de lugar
          if (Number(x.textContent.replace('$', '')) < Number(y.textContent.replace('$', ''))) {
            // Si es así, marcar como 'switch' y romper el bucle
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          // Si se marcó como 'switch', cambiar de lugar y marcar que el cambio ha sido hecho
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
    }
  
    // Registro del Service Worker para hacer la app funcional offline
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/serviceWorker.js').then(function(registration) {
          // Registro exitoso
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          // Registro fallido
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  });
  