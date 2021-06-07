let mostrandoIgualdad = false;

const validarPassword = () => {
  if (document.querySelector('#inputPassword2').value === document.querySelector('#inputPassword3').value) {
    if (mostrandoIgualdad) {
      $('#errorContrasenia').remove();
      mostrandoIgualdad = false;
    }
  } else if (!mostrandoIgualdad) {
    $('#repeatPassword').append('<p id="errorContrasenia">Las contraseñas no coinciden.</p>');
    mostrandoIgualdad = true;
  }
}

document.querySelector('#inputPassword3').addEventListener('input', validarPassword);

