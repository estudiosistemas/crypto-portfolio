export default function validarCrearOrden(valores) {
  let errores = {};

  if (!valores.sigla) {
    errores.sigla = "La sigla es obligatorio";
  }

  if (!valores.nombre) {
    errores.nombre = "El Nombre es obligatorio";
  }

  if (valores.precio < 0 || valores.precio == 0) {
    errores.precio = "El valor de compra no puede ser 0 o un número negativo";
  }

  return errores;
}
