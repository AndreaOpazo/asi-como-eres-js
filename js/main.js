/** Generacion del menu de navegacion */
const menuPrincipal = [
  new Seccion('Inicio', 'index.html'),
  new Seccion('Mujer', 'mujer.html'),
  new Seccion('Niña', 'ninia.html'),
  new Seccion('Nuevos Lanzamientos', 'nuevos-lanzamientos.html'),
  new Seccion('Rebajas', 'rebajas.html')
];

let navMenu = ``;

menuPrincipal.forEach(menu => {
  navMenu += `
    <li class="nav-item">
      <a class="nav-link" href="${menu.href}">${menu.seccion}</a>
    </li>
  `;
});

$('#menuPrincipal').html(navMenu);

/** Obtener los productos destacados*/
const obtenerProductos = async () => {
  const response = await fetch('data/productos.json');
  return await response.json();
}

/** Generacion de cards de los productos destacados */
let cardsBestProducts = ``;

const obtenerMensajeStockProducto = producto => producto.stock > 0 ? `Unidades disponibles: ${producto.stock}` : 'No hay stock';

const generarCardsProductos = (productos) => {
  productos.forEach((producto, index) => {
    cardsBestProducts += `
      <div class="col-6 col-lg-3 mb-3">
        <div class="card">
          <img src="${producto.img[0].url}" class="card-img-top" alt="${producto.img[0].alt}">
          <div class="card-body" data-bs-toggle="modal" data-bs-target="#staticBackdrop${index}" title="Ver más">
            <h6 class="card-title nombreProducto">${producto.nombre}</h6>
            <p class="card-text text-muted">$${producto.precio}</p>
            <p class="card-text text-muted">${obtenerMensajeStockProducto(producto)}</p>
            <small class="text-muted">&#9733; &#9733; &#9733; &#9733; &#9733;</small>
          </div>
        </div>
      </div>
    `;
  });
  document.querySelector('#productosDestacados').innerHTML = cardsBestProducts;
}

/** Generacion de modales y carouseles de imagenes de los productos destacados */
let modalsBestProducts = ``;

const generarModalesProductos = productos => {
  productos.forEach((producto, index) => {
    modalsBestProducts += `
      <div class="row">
        <div class="col-12">
          <div class="modal fade" id="staticBackdrop${index}" data-bs-backdrop="static">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">${producto.nombre}
                    <br>
                    <span class="fw-bold">$${producto.precio}</span>
                  </h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div id="carousel${index}" class="carousel carousel-dark slide col-12" data-bs-ride="carousel">
                    <ol class="carousel-indicators">
                      <li data-bs-target="#carousel${index}" data-bs-slide-to="0" class="active"></li>
                      <li data-bs-target="#carousel${index}" data-bs-slide-to="1"></li>
                      <li data-bs-target="#carousel${index}" data-bs-slide-to="2"></li>
                    </ol>
                    <div class="carousel-inner">
                      <div class="carousel-item active">
                        <img class="d-block w-100" src="${producto.img[1].url}" alt="${producto.img[1].alt}">
                      </div>
                      <div class="carousel-item">
                        <img class="d-block w-100" src="${producto.img[2].url}" alt="${producto.img[2].alt}">
                      </div>
                      <div class="carousel-item">
                        <img class="d-block w-100" src="${producto.img[3].url}" alt="${producto.img[3].alt}">
                      </div>
                    </div>
                    <a class="carousel-control-prev" href="#carousel${index}" role="button" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#carousel${index}" role="button" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                      <span class="visually-hidden">Next</span>
                    </a>
                  </div>
                </div>
                <div class="modal-footer">
                  <div class="d-grid gap-2 col-6 mx-auto">
                    <div class="text-center">${obtenerMensajeStockProducto(producto)}</div>
                    <input id="cantidad${producto.id}" type="number" placeholder="Cantidad" class="text-center mb-2" min="1" max="50"/>
                    <button id="agregarAlCarrito${producto.id}" class="btn btn-dark" ${producto.stock === 0 ? 'disabled' : ''}>Agregar al carrito</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    `;
  });
  document.querySelector("#modalsAndCarousels").innerHTML = modalsBestProducts;
};

/** Agrego cartel de HOTSALE */
$('header').append(`
  <div class="hotsale">
    <h2 id="titulo">HOT SALE</h2>
    <p id="recargado">RECARGADO</p>
    <div id="myProgress">
      <div id="myBar"></div>
    </div>
  </div>
`);

/** Modifico css de HOTSALE desde jQuery */
$('.hotsale').css({
  'background-color': '#EA5A91',
  'color': 'white',
  'text-align': 'center'
});

$('#titulo').css({
  'padding': '1rem',
  'margin-bottom': '0rem',
});

$('#myProgress').css({
  'display': 'inline-block',
  'border-radius': '25px'
});

/** Funcion para recargar barra de HOTSALE */
const recargarBarra = () => {
    const elem = $('#myBar');
    let width = 1;
    const frame = () => {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++;
        elem.css({
          width: width + '%',
          'border-radius': '25px'
        })
      }
    };
    const id = setInterval(frame, 20);
}

$(document).ready(async () => {
  const productos = await obtenerProductos();
  generarCardsProductos(productos);
  generarModalesProductos(productos);

  /** Para ver mas en detalle el producto, se subraya el nombre. */
  $('.nombreProducto').mouseenter(
    event => $(event.target).css(
      {
        'text-decoration': 'underline',
        'color': '#448AFF'
      })
  );
  $('.nombreProducto').mouseleave(
    event => $(event.target).css(
      {
        'text-decoration': 'none',
        'color': '#000'
      })
  );
  
/** Ejecucion de animaciones y la barra (HOTSALE)*/
  $('#titulo').slideDown(2000)
  $('#recargado').slideDown(2000);
  recargarBarra();
  
  actualizarCarrito();

  /** Para que funcione el click de agregarAlCarrito */
  productos.forEach(producto => $(`#agregarAlCarrito${producto.id}`).click(() => agregarAlCarrito(producto)));
});

/** Acceso directo a la seccion Mujer y Nina desde las imagenes */
let seccionPorGenero = ``;
const imagenesEnlace = [
  {
    url: 'imagenes/mujer.png',
    alt: 'seccion mujer'
  },
  {
    url: 'imagenes/ninia.png',
    alt: 'seccion ninia'
  }
];
const generos = menuPrincipal.slice(1, 3);

generos.forEach((genero, index) => {
  seccionPorGenero += `
    <div class="col-12 col-md-6 mb-5">
      <article class="d-flex justify-content-center animacion">
        <a href="${genero.href}">
          <img class="img-fluid" src="${imagenesEnlace[index].url}" alt="${imagenesEnlace[index].alt}">
        </a>
      </article>
    </div>
  `;
});

document.querySelector("#enlacesGenero").innerHTML = seccionPorGenero;

let importeTotalCarrito = 0;
/** Guardamos los datos del storage */
const valorDelCarritoEnElStorage = localStorage.carrito;
/** Preguntamos si hay productos en el carrito en el storage */
const carrito = valorDelCarritoEnElStorage ? JSON.parse(valorDelCarritoEnElStorage) : [];

/**
 * Determina color de fondo para el aviso al usuario.
 * @param { string } tipo 
 * @returns string
 */
const obtenerColorFondoSnackbar = tipo => {
  switch (tipo) {
    case 'exito':
      return '#66BB6A';
    case 'advertencia':
      return '#D4E157';
    case 'error':
      return '#EF5350';
  };
};

/**
 * Determina color de letra para el aviso al usuario.
 */
const obtenerColorLetraSnackbar = tipo => {
  switch (tipo) {
    case 'exito':
      return '#fff';
    case 'advertencia':
      return '#000';
    case 'error':
      return '#fff';
  };
}

/**
 * Muestra una notificacion al usuario.
 * @param { string } mensajeAMostrar 
 * @param { string } tipo 
 */
const mostrarAviso = (mensajeAMostrar, tipo) => {
  const colorFondoSnackbar = obtenerColorFondoSnackbar(tipo);
  const colorLetraSnackbar = obtenerColorLetraSnackbar(tipo);
  const snackbar = document.querySelector('#snackbar');
  snackbar.style.background = colorFondoSnackbar;
  snackbar.style.color = colorLetraSnackbar;
  snackbar.innerHTML = mensajeAMostrar;
  snackbar.className = 'show';
  setTimeout(() => {
    snackbar.className = snackbar.className.replace('show', '');
  }, 3000);
}

/**
 * Valida si el producto ya existe en el carrito.
 * @param { number } productoId 
 * @returns boolean
 */
const productoYaAgregadoAlCarrito = productoId => carrito.some(producto => producto.id === productoId);

/**
 * Suma la cantidad de un producto determinado.
 * @param { number } cantidadAAgregar 
 * @param { number } productoId 
 */
const sumarCantidadSolicitada = (cantidadAAgregar, productoId) => {
  const producto = carrito.find(producto => producto.id === productoId);
  producto.cantidadSolicitada += cantidadAAgregar;
  localStorage.carrito = JSON.stringify(carrito);
};

/**
 * Función para agregar productos al carrito.
 * @param { number } precio Precio unitario del producto.
 * @param { number } stock Stock actual del producto. 
 */
const agregarAlCarrito = productoAAgregar => {
  const cantidadSolicitada = Number(document.querySelector(`#cantidad${productoAAgregar.id}`).value);    
  const existeStock = validarStockCantidad(cantidadSolicitada, productoAAgregar.stock);
  if (existeStock) {
    if (cantidadSolicitada > 0) {
      if (productoYaAgregadoAlCarrito(productoAAgregar.id)) {
        sumarCantidadSolicitada(cantidadSolicitada, productoAAgregar.id);
      } else {
        carrito.push({...productoAAgregar, cantidadSolicitada});
        localStorage.carrito = JSON.stringify(carrito);
      }
      mostrarAviso('Producto agregado correctamente.', 'exito');
      actualizarCarrito();
    } else if (cantidadSolicitada !== 0) {
      mostrarAviso('Ingrese una cantidad correcta.', 'advertencia');
    }
  } else {
    mostrarAviso('No hay stock disponible!', 'error');
  }
}

/**
 * Función para validar el stock del producto según la cantidad ingresada por el usuario.
 * @param { number } cantidadIngresada Cantidad solicitada del producto por el usuario.
 * @param { number } stock Stock actual del producto.
 * @returns boolean
 */
const validarStockCantidad = (cantidadIngresada, stock) => (stock >= 0) && (cantidadIngresada <= stock);

/** Validacion de email para suscribirse */
let mostrandoError = false;

const suscribirse = () => {
  const emailAVerificar = document.querySelector('#email').value;
  if (emailEsValido(emailAVerificar)) {
    if (mostrandoError) {
      const errorMailSuscripcion = document.querySelector('#errorMailSuscripcion');
      errorMailSuscripcion.parentNode.removeChild(errorMailSuscripcion);
      document.querySelector('#email').value = '';
      mostrandoError = false;
    }
    console.log('Gracias por suscribirte a nuestro newsletter!\n\nPronto recibirás novedades sobre nuestros productos y promociones.');
  } else if (!mostrandoError) {
    const errorMail = document.createElement('p');
    errorMail.innerHTML = 'Ha ocurrido un error. Por favor, ingresar un email.';
    errorMail.id = 'errorMailSuscripcion';
    document.querySelector('#validacion').append(errorMail);
    mostrandoError = true;
  }
}

const emailEsValido = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Actualizar carrito cuando agrego productos
 */
const actualizarCarrito = () => {
  document.querySelector('#notificacionCarrito').innerHTML = carrito.length;
};