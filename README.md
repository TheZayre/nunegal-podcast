# Aplicación para la reproducción de podcasts

Aplicación cuyo objetivo es la reproducción de distintos episodios que disponga un podcast.

## Requisitos y pasos previos

A fin de ejecutar la aplicación, es necesario instalar las dependencias correspondientes. Para ello, es importante disponer de un gestor de dependencias, como puede ser [npm][npm].

También, la aplicación hace uso de recursos externos que no proveen cabeceras CORS. Es por ello, que se ha utilizado un proxy para poder obtener los recursos deseados. Deberemos acceder a https://cors-anywhere.herokuapp.com/ y solicitar acceso de manera temporal al servidor.

## Clonar el repositorio

Clonaremos el repositorio con el siguiente comando:

```
git clone https://github.com/TheZayre/nunegal-podcast.git
```

### Instalación de las dependencias

Una vez ya disponemos del código, nos situamos en la carpeta donde que se encuentre el  `package.json` y ejecutamos lo siguiente:

```
npm install
```

## Ejecución de la aplicación

La aplicación dispone de dos modos de ejecución, siendo estos un modo de desarrollo y otro de producción.

### Modo desarrollo

Para ejecutar la aplicación en modo desarrollo deberemos de estar situados en carpeta raíz del proyecto y ejecutar:

```
npm start
```

El comando `npm start` inicia un servidor local que permite ejecutar tu aplicación en un entorno de desarrollo. Además, mientras iniciemos la aplicación en este modo cuando se detectan cambios en los archivos de código fuente se recargará la aplicación automaticamente reflejando dichos cambios.

Una vez ejecutado el comando anterior, al insertar la url http://localhost:3000 en el navegador tendremos la aplicación en ejecución.

### Modo producción

Para ejecutar la aplicación en modo producción deberemos de estar situados en carpeta raíz del proyecto y ejecutar:

```
npm run build
```

El comando anterior se utiliza para construir y preparar una aplicación para su despliegue en un entorno de producción. Durante este proceso, se realizan tareas como compilación, optimización, minificación y generación de archivos finales optimizados para su implementación, los cuales se encontrarán dentro de la carpeta `build`.

Una vez tenemos generados los archivos dentro de la carpeta `build` podemos ejecutarlo con [serve][serve].

Si no tenemos instalado en nuestro ordenador `serve`, lo podemos hacer gracias al siguiente comando:
```
npm install --global serve
```

Ejecutamos lo siguiente, donde `build` es la carpeta que contiene los archivos generados:

```
serve -s build
```

Una vez ejecutado el comando anterior, al insertar la url http://localhost:3000 en el navegador tendremos la aplicación en ejecución.

[serve]: https://www.npmjs.com/package/serve
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/lang/en/