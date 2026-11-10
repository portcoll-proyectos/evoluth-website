# Loader

Animaciones de carga inspiradas en el icono 3D de Evoluth (`assets/Icono-3D`): nodos hexagonales y esféricos con volumen, enlaces que se dibujan y una red que gira en tres dimensiones. Usan los tokens `loader-light`, `loader-mid`, `loader-deep`, `loader-halo`, `loader` y `loader-track`.

Se obtienen con `Evoluth.loader(tipo, { label, value, detail, size, hideLabel, rows })`. `label` es lo que se lee; `value` (0 a 100) es el avance cuando se conoce.

## Cuál usar

| Animación | Tipo | Cuándo |
|---|---|---|
| Rueda de nodos | `nodos` | Acciones cortas dentro de un botón o junto a un campo. De 400 ms a 3 s. Solo en tamaño pequeño: 16 px dentro del botón (`<Button loading>`) y 20 a 24 px junto a un campo |
| Red Evoluth, lista o panel | `red-lista` | Carga de una lista o un panel. La misma red del inicio, de 96 px y un 30 % más lenta |
| Red Evoluth, inicio | `red-inicio` | Inicio de la aplicación y cambio de empresa. Los enlaces se dibujan como en el logotipo y después un impulso recorre la red |
| Barra de progreso | `progreso` | Procesos con porcentaje conocido: importar, exportar, sincronizar. Muestra porcentaje y detalle ("822 de 1 284 activos") |
| Barra de progreso superior | `barra-superior` | Procesos largos con porcentaje, en la parte superior de una tabla o ventana. El contenedor lleva `position: relative` |
| Esqueleto | `esqueleto` | Primera carga de una tabla o lista: muestra la forma del contenido que viene |

## Cómo se ven

- Rueda de nodos: ocho hexágonos pequeños sobre un anillo que gira; cada nodo se enciende y se apaga en ronda. Dentro de un botón toma el color del texto. No se usa en tamaños grandes: para cargas más largas está la red Evoluth.
- Red Evoluth: doce nodos hexagonales y esféricos con cara iluminada (`loader-light`), tono medio y cara en sombra (`loader-deep`), y un brillo arriba a la izquierda, que giran en 3D. Primero los enlaces se dibujan en orden, como en el logotipo. Después un impulso viaja por los enlaces: el tramo se enciende de forma progresiva desde un nodo hasta el siguiente, el nodo de llegada se enciende con un halo (`loader-halo`) y luego se apaga poco a poco, y los tramos recorridos dejan una estela que se desvanece. La versión de lista o panel es la misma red, más pequeña y un 30 % más lenta (cada salto dura 485 ms en lugar de 340 ms).
- Barra de progreso: relleno sólido en `loader` sobre `loader-track`, con un nodo hexagonal en la punta, sin brillo ni degradado.
- Barra superior: una línea de 3 px pegada al borde superior, en relleno sólido.
- Esqueleto: bloques en `loader-track` con un brillo que pasa; el avatar es un hexágono.

## Reglas

- Antes de 400 ms no se muestra nada. Después, la animación aparece donde estará el resultado, nunca en un velo sobre toda la pantalla, salvo la red de inicio.
- Siempre con texto que dice qué se carga: "Cargando activos…", no "Cargando…". Si el texto no se ve, `hideLabel` lo deja para el lector de pantalla.
- Con avance conocido se usa `value` y el porcentaje se anuncia (`role="progressbar"`). Sin avance, `role="status"`.
- Al terminar, el resultado reemplaza a la animación; si fue una acción, un aviso lo confirma ("Importación terminada").
- Las redes se dibujan con un solo `requestAnimationFrame` compartido y se detienen cuando salen de la pantalla.
- Con `prefers-reduced-motion`, las redes quedan quietas en un cuadro con el impulso a mitad de camino, la rueda deja de girar y el esqueleto deja de brillar.
