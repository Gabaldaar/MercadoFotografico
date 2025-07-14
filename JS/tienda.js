// Asigna evento clic a todos los botones con la clase "comprar" del HTML
let botonesComprar = document.getElementsByClassName('comprar');
   for (let i = 0; i < botonesComprar.length; i++) {
     botonesComprar[i].addEventListener('click', agregarProducto);
   }

let botonesEliminar = document.getElementsByClassName('eliminar');
   for (let i = 0; i < botonesEliminar.length; i++) {
     botonesEliminar[i].addEventListener('click', eliminarProducto);
   }

const contador = document.getElementById('contador-carrito');
contador.textContent = carrito.length === 0
  ? "🛒 Tu carrito está vacío"
  : `${carrito.length} ${carrito.length === 1 ? 'producto' : 'productos'}`;

// Cambia el estilo si está vacío
contador.classList.toggle('vacio', carrito.length === 0);


// Vacía carrito
document.getElementById('vaciar-carrito').addEventListener('click', function() {
    localStorage.removeItem('carrito');

    // Animar el contador a cero
    const totalCarrito = document.getElementById('total-carrito');
    animarContador(totalCarrito, 0);

    // Mostrar mensaje flotante
    mostrarMensaje("Carrito vaciado");

    // Recargar vista con fade en ítems (opcional)
    const lista = document.getElementById('lista-carrito');
    lista.querySelectorAll('li').forEach(li => li.classList.add('fade-out'));

    setTimeout(() => cargarCarrito(), 400); // espera a que fade-out termine
});


// Agrega productos al carrito
function agregarProducto(event) {
    const id = event.target.getAttribute('data-id');
    const nombre = event.target.getAttribute('data-nombre');
    const precio = event.target.getAttribute('data-precio');

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Buscar si el producto ya existe
    const existente = carrito.find(item => item.id === id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        const producto = {
            id,
            nombre,
            precio,
            cantidad: 1
        };
        carrito.push(producto);
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito();
}


function eliminarProducto(event) {
    const idProducto = event.target.getAttribute('data-id');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Buscar el producto
    let producto = carrito.find(item => item.id === idProducto);

    if (producto) {
        if (producto.cantidad > 1) {
            producto.cantidad -= 1;
            mostrarMensaje(`Se eliminó una unidad de ${producto.nombre}`);
        } else {
            carrito = carrito.filter(item => item.id !== idProducto);
            mostrarMensaje(`${producto.nombre} eliminado del carrito`);
        }
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Animación de salida (suave) antes de recargar vista
    const li = event.target.closest('li');
    if (li) {
        li.classList.add('fade-out');
        setTimeout(() => cargarCarrito(), 400);
    } else {
        cargarCarrito();
    }
}

function formatoPesos(numero) {

  const valor = parseFloat(numero);
  if (isNaN(valor)) return "$0,00";
  return "$" + valor.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function cargarCarrito() {
    let listaCarrito = document.getElementById('lista-carrito');
    let totalCarrito = document.getElementById('total-carrito');
    listaCarrito.innerHTML = '';
    totalCarrito.textContent = '0';

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let total = 0;
   
    for (let i = 0; i < carrito.length; i++) {
        let producto = carrito[i];   
        // Crear item del carrito
        let li = document.createElement('li');
        //li.textContent = producto.nombre + ' - $' + producto.precio;
        //li.textContent = `${producto.nombre} - $${producto.precio} x${producto.cantidad}`;
        li.textContent = `${producto.nombre} - ${formatoPesos(producto.precio)} x${producto.cantidad}`;


        // Crear botón de eliminar
        let btnEliminar = document.createElement('button');
        btnEliminar.textContent = '❌ Eliminar';
        btnEliminar.className = 'eliminar';
        btnEliminar.setAttribute('data-id', producto.id);
        btnEliminar.style.marginLeft = '10px';

        // Asignar evento al botón de eliminar
        btnEliminar.addEventListener('click', eliminarProducto);

        // Agregar botón al item
        li.appendChild(btnEliminar);
        listaCarrito.appendChild(li);
        //total += parseFloat(producto.precio) || 0;
        total += parseFloat(producto.precio) * producto.cantidad;

  
    }
    // Mostrar el total redondeado a 3 decimales
    //totalCarrito.textContent = total.toFixed(3);
    animarContador(totalCarrito, total);
        //document.getElementById('contador-carrito').textContent =
         //`${carrito.length} ${carrito.length === 1 ? 'producto' : 'productos'}`;

    // 🔁 Calcular unidades reales
    let unidadesTotales = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);

    const contadorCarrito = document.getElementById('contador-carrito');

    contadorCarrito.textContent = unidadesTotales === 0
  ? "🛒 Tu carrito está vacío"
  : `${carrito.length} ${carrito.length === 1 ? "producto" : "productos"}`;

// 🎨 Aplicar estilo visual para estado vacío
contadorCarrito.classList.toggle("vacio", unidadesTotales === 0);

         document.getElementById('contador-carrito').textContent =
  carrito.length === 0 
    ? "🛒 Tu carrito está vacío"
    : `${carrito.length} ${carrito.length === 1 ? 'producto' : 'productos'}`;


    
}

function pagar() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

  let total = 0;
for (let i = 0; i < carrito.length; i++) {
    total += parseFloat(carrito[i].precio) * carrito[i].cantidad || 0;
}

    // Guardar datos en sessionStorage
    sessionStorage.setItem('productos', JSON.stringify(carrito));
    //sessionStorage.setItem('total', total.toFixed(3));
    sessionStorage.setItem('total', total);

    //alert(`Total a pagar: $${total.toFixed(3)}`);
    //alert(`Total a pagar: ${formatoPesos(total)}`);
    window.location.href = "compra.html";
}

// Asignar el evento al botón (cuando el DOM esté listo)
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btnPagar').addEventListener('click', pagar);
    cargarCarrito(); 
});

function mostrarMensaje(texto) {
    const mensajeDiv = document.getElementById('mensaje-carrito');
    mensajeDiv.textContent = texto;
    mensajeDiv.style.display = 'block';
    mensajeDiv.style.opacity = '1';

    setTimeout(() => {
        mensajeDiv.style.opacity = '0';
    }, 1500);

    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 2000);
}

function animarContador(elemento, valorFinal) {
    let valorActual = parseFloat(elemento.textContent) || 0;
    

    let incremento = (valorFinal - valorActual) / 30;
    let contador = 0;

    const animacion = setInterval(() => {
        contador++;
        valorActual += incremento;

        // Frenar cuando se llega al paso final
        if (contador >= 30) {
            //elemento.textContent = valorFinal.toFixed(3);
            elemento.textContent = formatoPesos(valorFinal);
            clearInterval(animacion);
        } else {
            //elemento.textContent = valorActual.toFixed(3);
            // Formatear el valor actual como pesos con dos decimales
            elemento.textContent = formatoPesos(valorActual);
            
        }
    }, 15); // velocidad de animación (ms por paso)
}

document.querySelectorAll('.ver-caracteristicas').forEach(elemento => {
  elemento.addEventListener('click', function () {
    const id = this.dataset.id;
    const panel = document.getElementById('carac-' + id);
    if (panel) {
      panel.classList.toggle('activa');
      // 🔁 Cambiar el texto según estado
      this.textContent = panel.classList.contains('activa') ? '− info...' : '+ info...';
    }
  });
});
