/**
 * Se obtiene lo que contenga el carrito
 * @returns array
 */
const obtenerValorCarrito = () => {
  const valorCarrito = localStorage.carrito;
  return valorCarrito ? JSON.parse(valorCarrito) : [];
};

/**
 * Elimina HTML del Total del Carrito
 * @returns string
 */
const eliminarTotalCarrito = () =>
  (document.querySelector('#totalCarrito').innerHTML = '');

/**
 *Elimina un producto determinado
 * @param {number} productoId
 */
const eliminarProducto = (productoId) => {
  const carrito = obtenerValorCarrito();
  const carritoFiltrado = carrito.filter(
    (producto) => producto.id !== productoId
  );
  localStorage.carrito = JSON.stringify(carritoFiltrado);
  actualizarCarrito();
  if (carritoFiltrado.length) {
    generarListado();
    actualizarSubtotal();
    obtenerTotal();
  } else {
    mostrarLeyendaCarritoVacio();
    eliminarTotalCarrito();
  }
};

/** se actualiza el subtotal de la compra a realizar*/
const actualizarSubtotal = () =>
  (document.querySelector('#subtotal').innerHTML = `${calcularTotalYEnvio()}`);

/** actualiza la cantidad de productos agregados al carrito en la notificacion */
const actualizarCarrito = () => {
  const carrito = obtenerValorCarrito();
  document.querySelector('#notificacionCarrito').innerHTML = carrito.length;
};

/** Se incorpora al dom, el html del total del carrito */
const generarHTMLTotalCarrito = () => {
  const cartTotal = `
    <div class='row my-2'>
      <div class='col'>
        <h3>TOTAL DEL CARRITO</h3>
        <table class='table'>
          <tbody>
            <tr>
              <th scope='row'>Subtotal</th>
              <td id='subtotal'>$${calcularTotalYEnvio()}</td>
            </tr>
            <tr>
              <th scope='row'>Envio</th>
              <td>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="shipping" id="freeShipping" checked>
                  <label class="form-check-label" for="shipping">
                    No quiero envio (Nosotros nos ponemos en contacto con vos)
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="shipping" id="shipping">
                  <label class="form-check-label" for="shipping">
                    Quiero que me lo envien: $300
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <th scope='row'>Total</th>
              <td>
                <p id="precioTotal">$</p>
              </td>
            </tr>
            <tr>
              <td colspan=2>
                <button class='btn btn-sm btn-dark'>
                  <a href='checkout.html' class='text-white'>Finalizar compra</a>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.querySelector('#totalCarrito').innerHTML = cartTotal;
  document
    .querySelectorAll('input[type=radio][name=shipping]')
    .forEach((input) => input.addEventListener('change', obtenerTotal));
};

/** Se incorpora al dom, el html del listado de productos que fueron agregados al carrito */
const generarListado = () => {
  const carrito = obtenerValorCarrito();
  let listado = `
    <div class='row my-2'>
      <div class='col'>
        <table class="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col" class='text-muted'>Producto</th>
              <th scope="col" class='text-muted'>Unidad</th>
              <th scope="col" class='text-muted text-center'>Cantidad</th>
              <th scope="col" class='text-muted'>Subtotal</th>
              <th scope="col" class='text-center'>
                <button class='btn btn-sm btn-outline-primary' id='vaciarCarrito'>Vaciar carrito</button>
              </th>
            </tr>
          </thead>
          <tbody>
  `;
  carrito.forEach((producto) => {
    listado += `
      <tr>
        <td scope='row'>
          <img src='${producto.img[0].url}' class='sizeProducto' alt='${
      producto.img[0].alt
    }' />
        </td>
        <td class='align-middle'>
          <p>${producto.nombre}</p>
        </td>
        <td class='align-middle'>
          <p>$${producto.precio}</p>
        </td>
        <td class='align-middle text-center'>
          <span class="badge bg-primary rounded-pill">${
            producto.cantidadSolicitada
          }</span>
        </td>
        <td class='align-middle'>
          <b>$${producto.precio * producto.cantidadSolicitada}</b>
        </td>
        <td class='align-middle text-center'>
          <i class="far fa-trash-alt" onclick="eliminarProducto(${
            producto.id
          })"></i>
        </td>
      </tr>
    `;
  });

  listado += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.querySelector('#listaProductos').innerHTML = listado;
};

/**
 * Se incorpora al dom, la alerta html cuando esta vacio el carrito
 * @returns string
 */
const mostrarLeyendaCarritoVacio = () =>
  (document.querySelector('#listaProductos').innerHTML = `
    <div class="alert alert-info" role="alert">
      Tu carrito está vacío.
    </div>
  `);

/** vacia el carrito */
const vaciarCarrito = () => {
  localStorage.carrito = [];
  mostrarLeyendaCarritoVacio();
  actualizarCarrito();
  eliminarTotalCarrito();
};

/**
 * Calcula total de la compra a realizar
 * @param {bool} conEnvio
 * @returns number
 */
const calcularTotalYEnvio = (conEnvio) => {
  const carrito = obtenerValorCarrito();
  const subtotal = carrito.reduce(
    (acumuladorPrecio, productoActual) =>
      productoActual.precio * productoActual.cantidadSolicitada +
      acumuladorPrecio,
    0
  );
  return conEnvio ? subtotal + 300 : subtotal;
};

/**se incorpora el total de la compra, en el html */
const obtenerTotal = () => {
  const quieroEnvio = document.querySelector('#shipping').checked;
  localStorage.quieroEnvio = quieroEnvio;
  const total = calcularTotalYEnvio(quieroEnvio);
  document.querySelector('#precioTotal').innerHTML = `$${total}`;
};

$(document).ready(() => {
  const carrito = obtenerValorCarrito();
  actualizarCarrito();
  if (carrito.length) {
    generarListado();
    generarHTMLTotalCarrito();
    obtenerTotal();
    document
      .querySelector('#vaciarCarrito')
      .addEventListener('click', vaciarCarrito);
  } else {
    mostrarLeyendaCarritoVacio();
  }
});