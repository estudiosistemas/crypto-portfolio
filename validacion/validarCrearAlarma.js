export default function validarCrearMoneda(valores) {
  let errores = {};

  if (!valores.sigla) {
    errores.sigla = "La sigla es obligatorio";
  }

  if (!valores.nombre) {
    errores.nombre = "El Nombre es obligatorio";
  }

  if (!valores.monedapar) {
    errores.monedapar = "Seleccione el par";
  }

  if (valores.precioalarma < 0 || valores.precioalarma == 0) {
    errores.precioalarma = "El precio no puede ser 0 o un número negativo";
  }

  return errores;
}
