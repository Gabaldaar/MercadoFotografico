document.addEventListener("DOMContentLoaded", function () {

    const productos = JSON.parse(sessionStorage.getItem('productos')) || [];
    const total = sessionStorage.getItem('total') || 0;
    const totalNumerico = parseFloat(total) || 0;
    const totalFormateado = totalNumerico.toFixed(3);

    const resumenDiv = document.getElementById("detalle");

    /* let resumenTextoHTML = "<h3 style=color:black>Resumen de tu Compra:</h3><br>";

    for (let i = 0; i < productos.length; i++) {
        const productoActual = productos[i]; 
        resumenTextoHTML += `${productoActual.nombre}: $${parseFloat(productoActual.precio).toFixed(3)} x${productoActual.cantidad}<br>`;
    }

    resumenTextoHTML += `<br><strong>Total a pagar: $${totalFormateado}</strong>`;
    resumenDiv.innerHTML = resumenTextoHTML; */

    //Tabla de productos
let resumenTablaHTML = `
  <h3 style="color:black">Resumen de tu Compra:</h3>
  <table style="width:100%; border-collapse: collapse; margin-top:10px;">
    <thead style="background-color:#f2f2f2;">
      <tr>
        <th style="text-align:left; padding:8px; border-bottom:1px solid #ccc;">Producto</th>
        <th style="text-align:right; padding:8px; border-bottom:1px solid #ccc;">Precio</th>
        <th style="text-align:right; padding:8px; border-bottom:1px solid #ccc;">Cantidad</th>
      </tr>
    </thead>
    <tbody>
`;

for (let i = 0; i < productos.length; i++) {
  const producto = productos[i];
  resumenTablaHTML += `
    <tr>
      <td style="padding:8px; border-bottom:1px solid #eee;">${producto.nombre}</td>
      <td style="text-align:right; padding:8px; border-bottom:1px solid #eee;">${formatoPesos(producto.precio)}</td>
      <td style="text-align:right; padding:8px; border-bottom:1px solid #eee;">${producto.cantidad}</td>
    </tr>
  `;
}

resumenTablaHTML += `
    </tbody>
    <tfoot>
      <tr style="background-color:#eafaf1; font-weight:bold;">
        <td colspan="2" style="text-align:right; padding:10px; border-top:2px solid #2ecc71;">Total a pagar:</td>
        <td style="text-align:right; padding:10px; border-top:2px solid #2ecc71;">${formatoPesos(total)}
</td>
      </tr>
    </tfoot>
  </table>
`;
resumenDiv.innerHTML = resumenTablaHTML;

   //Fin Tabla 

    function enviarFormulario(event) {
        event.preventDefault();

        const nombreContacto = document.getElementById('nombre').value.trim();
        const emailContacto = document.getElementById('contactoEmail').value.trim();
        const telefonoContacto = document.getElementById('telefono').value.trim();

        if (!nombreContacto || !emailContacto || !telefonoContacto) {
            alert("Por favor, completa todos los campos de contacto antes de enviar.");
            return; // Detenemos la función si falta algún campo.
        }

        let detallesCarritoParaEnvio = '';
        for (let i = 0; i < productos.length; i++) {
            const productoActual = productos[i];
            //detallesCarritoParaEnvio += `${productoActual.nombre} - $${parseFloat(productoActual.precio).toFixed(3)}\n`;
            detallesCarritoParaEnvio += `${productoActual.nombre} - $${parseFloat(productoActual.precio).toFixed(3)} x${productoActual.cantidad}\n`;

        }

        document.getElementById('carritoData').value = detallesCarritoParaEnvio;
        document.getElementById('totalCarrito').value = `$${totalFormateado}`;
        document.getElementById('formulario').submit();
    }

    const botonEnviar = document.getElementById('botonEnviar');
   
    if (botonEnviar) {
        botonEnviar.addEventListener('click', enviarFormulario);
    } else {
        console.warn("ADVERTENCIA: No se encontró el botón con ID 'botonEnviar'.");
    }
}); 

function formatoPesos(numero) {
  const valor = parseFloat(numero);
  if (isNaN(valor)) return "$0,00";
  return "$" + valor.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}