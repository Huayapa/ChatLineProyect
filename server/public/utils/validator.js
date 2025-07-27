/**
  * VALIDAR FORMULARIOS
  * @param {object} data
  * @param {HTMLInputElement} data.input - El input HTML.
  * @param {HTMLElement} data.errorElement - Elemento <span> para mostrar el error.
  * @param {string} data.name - Nombre del campo para el mensaje
  * @param {number} data.min - Longitud minima
  * @param {number} data.max- Longitud maxima
  * @param {boolean} data.required - Si el campo es obligatorio o no
  * DEVOLUCION DE LA FUNCION:
  * @returns {boolean} - true si es es valido el campo y false si no
*/
export function validarCampos(data) {
  const {
    input,
    errorElement,
    name,
    min = 1,
    max = 256,
    required = true
  } = data;

  const value = input?.value?.trim() ?? '';

  // VALIDACIONES
  if (required && value === '') {
    errorElement.textContent = `${name} es requerido`;
    return false;
  }

  if (value.length < min) {
    errorElement.textContent = `${name} debe tener al menos ${min} caracteres`;
    return false;
  }

  if (value.length > max) {
    errorElement.textContent = `${name} no debe superar los ${max} caracteres`;
    return false;
  }

  // Limpiar mensaje y retornar true
  errorElement.textContent = '';
  return true;
}