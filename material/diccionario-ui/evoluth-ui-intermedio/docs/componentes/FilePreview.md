# FilePreview

Ventana de solo lectura para ver archivos de Excel (.xlsx), PDF y Word (.docx) sin salir de la aplicación ni descargarlos.

En React recibe `source`: un archivo del equipo (`{ kind: "file", file }`) o un adjunto guardado en `ui.adjuntos` (`{ kind: "url", url: "/api/adjuntos/:id/contenido", name, size }`), que la API entrega con la sesión de la persona después de comprobar el permiso. También recibe `meta`, `onDownload` y `onClose`. Las librerías de lectura se cargan con `import()` solo al abrir cada tipo.

## Cómo se ve cada tipo

- Excel: barra con la celda seleccionada (A1) y su contenido o fórmula, buscador que resalta coincidencias, encabezados de columna y números de fila fijos al desplazarse, y pestañas de hojas abajo. Las flechas del teclado mueven la celda seleccionada.
- PDF: páginas una debajo de otra, con página anterior y siguiente, campo para saltar a una página, zoom de 50 % a 200 % y "Ajustar al ancho". Re Pág, Av Pág y las flechas izquierda y derecha cambian de página.
- Word: el documento como una sola hoja continua, con el mismo zoom y el número de palabras en el pie.

Mientras el archivo se abre se muestra la red Evoluth de lista o panel con "Abriendo nombre-del-archivo…".

La hoja del documento es blanca en los dos temas, porque representa el papel. Todo lo demás sigue el tema.

## Reglas

- Solo lectura. El pie lo dice siempre, junto con cómo cambiar el archivo.
- Cuando la persona abre un archivo de su equipo, se lee en el navegador y no se sube a ningún servidor; el pie también lo dice.
- Archivos de más de 25 MB piden confirmación antes de abrirse y ofrecen descargar en su lugar.
- PDF: se muestran hasta 30 páginas. Excel: hasta 1 000 filas y 60 columnas por hoja. Si el archivo tiene más, el aviso dice cuánto se muestra.
- Los formatos antiguos .xls y .doc no tienen vista previa; el mensaje lo explica y ofrece descargar.
- Si el archivo está dañado, protegido con contraseña o el lector no carga, se usa Mensaje de error en su variante de página, con "Descargar el archivo" y una referencia.
- Botones de la cabecera: descargar el original, pantalla completa y cerrar. Esc cierra.
- Word: formas, comentarios y control de cambios no se muestran; si el archivo los tiene, el pie lo avisa.

## Librerías

En la aplicación React se instalan con npm y se cargan con `import()`. En las vistas previas de esta página se cargan desde jsDelivr en versión fijada.

| Tipo | Librería | Versión | Licencia |
|---|---|---|---|
| PDF | pdf.js (`pdfjs-dist`) | 4.4.168 en React; 2.16.105 en las vistas previas | Apache 2.0 |
| Word | mammoth | 1.8.0 | BSD 2 cláusulas |
| Excel | ExcelJS | 4.4.0 | MIT |
