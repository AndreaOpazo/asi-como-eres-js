/**
 * Se obtiene lo que contenga el carrito
 * @returns array
 */
const obtenerValorCarrito = () => {
  const valorCarrito = localStorage.carrito;
  return valorCarrito ? JSON.parse(valorCarrito) : [];
};

/** se instancian los inputs para el formulario de contacto */
const formularioDeContacto = [
  new Formulario('Nombre y Apellido', 'text', 'col-12'),
  new Formulario('Email', 'email', 'col-md-6'),
  new Formulario('Telefono', 'number', 'col-md-6'),
  new Formulario('Direccion', 'text', 'col-12'),
  new Formulario('Partido', 'text', 'col-md-4'),
  new Formulario('Ciudad', 'text', 'col-md-6'),
  new Formulario('CP', 'number', 'col-md-2'),
  new Formulario('Comentario', 'text', 'col-12'),
];

/** se genera html del formulario de contacto */
const generarHTMLFormulario = () => {
  let inputs = `<form class="row g-3">`;

  formularioDeContacto.forEach((input) => {
    inputs += `
      <div class="form-floating ${input.width}">
        <input type="${input.type}" class="form-control" placeholder="${input.title}" />
        <label>${input.title}</label>
      </div>
    `;
  });

  inputs += `</form>`;

  document.querySelector('#formularioContacto').innerHTML = inputs;
};

/**se notifica la cantidad de productos que fueron agregados al carrito */
const notificacionCarrito = () => {
  const carrito = obtenerValorCarrito();
  document.querySelector('#notificacionCarrito').innerHTML = carrito.length;
};

/**se genera html del listado del pedido realizado */
const generarListPedido = () => {
  const carrito = obtenerValorCarrito();
  let pedido = '';

  carrito.forEach((producto) => {
    pedido += `
      <div class="card border-white px-auto">
        <div class="row g-1">
          <div class="col-4">
            <img src="${producto.img[0].url}"  class="size" alt="${producto.img[0].alt}">
          </div>
          <div class="col-8">
            <div class="card-body">
              <h6 class="card-title">${producto.nombre}</h6>
              <p class="card-subtitle">${producto.cantidadSolicitada} x $${producto.precio}</p>
            </div>
          </div>
        </div>
      </div>
      <hr>
    `;
  });

  document.querySelector('#tuPedido').innerHTML = pedido;
};

/**
 * Devuelve el importe total de la compra a realizar
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

/**se genera html para subtotal, envio, y total de la compra a realizar */
const mostrarTotal = () => {
  const quieroEnvio = JSON.parse(localStorage.quieroEnvio);
  let envio = `
    <table class='table'>
      <tbody>
        <tr class='table-light'>
          <th scope='row'>Subtotal</th>
          <td>$${calcularTotalYEnvio()}</td>
        </tr>
        <tr class='table-light'>
          <th scope='row'>Envio</th> 
          <td>
            ${quieroEnvio ? '$300' : '$0'}
          </td>
        </tr>
        <tr class='table-light'>
          <th scope='row'>Total</th>
          <td>
            <p><b>$${calcularTotalYEnvio(quieroEnvio)}</b></p>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="alert alert-warning text-center" role="alert">
      <h5>Todavia no se configuro MercadoPago en la tienda.</h5>
    </div>
  `;

  document.querySelector('#datosEnvio').innerHTML = envio;
};

$(document).ready(
  generarHTMLFormulario(),
  notificacionCarrito(),
  generarListPedido(),
  mostrarTotal()
);