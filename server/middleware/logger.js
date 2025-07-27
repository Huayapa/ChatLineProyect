//Morgan es un middelware logger (herramienta que guarda trazo de algo) 
// que se usa para mostrar en consola los registros o accesos al servidor
import logger from 'morgan';

export const loggerParser = logger('dev');