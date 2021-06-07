const calcularImporte = (precio, cantidadSolicitada) => precio * cantidadSolicitada;

const mostrarBotonVaciarCarrito = (mostrar) => {
  if (mostrar) {
    $('#vaciarCarrito').css(
      {
        'display': 'inline-block'
      }
    );
  } else {
    $('#vaciarCarrito').css(
      {
        'display': 'none'
      }
    );
  }
}

const eliminarTotalCarrito = () => document.querySelector('#totalCarrito').innerHTML = '';

const eliminarProducto = productoId => {
  const valorCarrito = localStorage.carrito;
  const carrito = valorCarrito ? JSON.parse(valorCarrito) : [];
  const carritoFiltrado = carrito.filter(producto => producto.id !== productoId);
  localStorage.carrito = JSON.stringify(carritoFiltrado);
  actualizarCarrito();
  if (carritoFiltrado.length) {
    generarListado();
    calcularPrecioTotal();
  } else {
    mostrarLeyendaCarritoVacio();
    mostrarBotonVaciarCarrito(false);
    eliminarTotalCarrito();
  }  
};

const actualizarCarrito = () => {
  const valorCarrito = localStorage.carrito;
  const carrito = valorCarrito ? JSON.parse(valorCarrito) : [];
  document.querySelector('#notificacionCarrito').innerHTML = carrito.length; 
}

const generarListado = () => {
  const valorCarrito = localStorage.carrito;
  const carrito = valorCarrito ? JSON.parse(valorCarrito) : [];
  let listado = `<ul class="list-group list-group-flush">`;
  carrito.forEach(producto => {
    listado += `
      <li class="list-group-item d-flex justify-content-evenly bd-highlight">
        <i class="far fa-trash-alt" onclick="eliminarProducto(${producto.id})"></i>
        ${producto.nombre}
        <span class="badge bg-primary rounded-pill">${producto.cantidadSolicitada}</span>
        <b>$${calcularImporte(producto.precio, producto.cantidadSolicitada)}</b>
      </li>
    `;
  });
  listado += `</ul>`;
  document.querySelector("#listaProductos").innerHTML = listado;
}

const mostrarLeyendaCarritoVacio = () => document.querySelector('#listaProductos').innerHTML = `<p>Tu carrito esta vacio</p>`;  

const vaciarCarrito = () => {
  const valorCarrito = localStorage.carrito;
  const carrito = valorCarrito ? JSON.parse(valorCarrito) : [];
  if (carrito.length) {
    carrito.length = 0;
  }
  localStorage.carrito = JSON.stringify(carrito);
  mostrarLeyendaCarritoVacio();
  actualizarCarrito();
  mostrarBotonVaciarCarrito(false);
  eliminarTotalCarrito();
}

const btnVaciarCarrito = document.querySelector('#vaciarCarrito');

btnVaciarCarrito.addEventListener('click', () => vaciarCarrito());

const calcularPrecioTotal = () => {
  const valorCarrito = localStorage.carrito;
  const carrito = valorCarrito ? JSON.parse(valorCarrito) : [];
  const totalCarrito = carrito.reduce(
    (acumuladorPrecio, productoActual) => (productoActual.precio * productoActual.cantidadSolicitada) + acumuladorPrecio,
    0
  );
  document.querySelector('#totalCarrito').innerHTML = `Total: $${totalCarrito}`;
};

$(document).ready(() => {
  const valorCarrito = localStorage.carrito;
  const carrito = valorCarrito ? JSON.parse(valorCarrito) : [];
  actualizarCarrito();
  if (carrito.length) {
    generarListado();
    mostrarBotonVaciarCarrito(true);
    calcularPrecioTotal();
  } else {
    mostrarLeyendaCarritoVacio();
  }
});