# Reorganizar proyectos: split Diseño/Construcción + quitar proyectos de Legal

Este prompt reemplaza/extiende las instrucciones anteriores sobre los proyectos reales. Ya no
van los 4 proyectos repetidos en Diseño, Construcción y Legal — ahora:
- **Legal:** sin sección de proyectos.
- **Diseño:** 2 proyectos (Vivienda Unifamiliar, Espacio Barbacoa).
- **Construcción:** 2 proyectos (Mansión Blanca, Mansión La Pradera).

El split 2/2 es arbitrario (el PDF no distingue qué proyecto fue diseño vs. construcción) —
avisame si lo querés repartido distinto, es un cambio rápido de mover los objetos entre archivos.

---

## 1. Quitar la sección de proyectos en Legal

**`src/app/pages/legal/legal.html`** — quitar la línea:
```html
<app-legal-cases></app-legal-cases>
```

**`src/app/pages/legal/legal.ts`** — quitar el import de `LegalCases` y sacarlo del array
`imports: [...]` del `@Component`.

**`src/app/components/legal/legal-hero/legal-hero.html`** — el botón "Ver proyectos" apunta a
`href="#legal-casos"`, que ya no va a existir. Quitar ese botón y dejar solo "Ver servicios"
(el que apunta a `#legal-proceso`).

**Limpieza:** borrar la carpeta `src/app/components/legal/legal-cases/` completa (ya no se usa
en ningún lado, no tiene sentido dejar código muerto).

---

## 2. Diseño — 2 proyectos

**`src/app/components/diseno/diseno-gallery/diseno-gallery.ts`**

Interface `Project`: usar `client`, `challenge`, `result`, `metrics` → reemplazar por
`description: string` (igual que se pidió antes). Array final con solo estos 2 proyectos:

```ts
{
  id: '01',
  title: 'Vivienda Unifamiliar',
  subtitle: 'Cuenca, sector Indurama',
  category: 'Residencial',
  location: 'Cuenca',
  image: 'assets/proyectos/...', // mantener la imagen que ya está asignada
  year: '',
  description: 'Esta vivienda representa una arquitectura moderna con ventanales grandes, cubiertas perdidas y acabados altos, posee dos cuartos, un baño completo compartido, su respectiva sala, comedor y desayunador con cocina. Con espacios integrados en una sola planta, concebida de tal manera que se maneja volúmenes dando un espacio de doble altura, que reflejan la función de descanso abierta y privada.'
},
{
  id: '02',
  title: 'Espacio Barbacoa',
  subtitle: 'Control Sur',
  category: 'Residencial',
  location: 'Control Sur',
  image: 'assets/proyectos/...',
  year: '',
  description: 'Esta vivienda está diseñada con una estructura de dos niveles, es una casa estilo mansión que cuenta con la característica de contar con techos en varias aguas debido a su ubicación geográfica.'
}
```

**`diseno-gallery.html`** — reemplazar el bloque de `project-info` (Cliente/Desafío/Resultado) y
`project-metrics` por:
```html
<p class="project-description">{{ project.description }}</p>
```
Sacar también `<p class="project-subtitle">{{ project.subtitle }}</p>` si queda redundante con
la ubicación de arriba.

**`diseno-gallery.css`** — agregar:
```css
.project-description {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  font-weight: 300;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

## 3. Construcción — 2 proyectos

**`src/app/components/construccion/construccion-cases/construccion-cases.ts`**

Interface `Project`: sacar `area`, `duration` → agregar `description: string`. Array final con
solo estos 2 proyectos:

```ts
{
  id: '01',
  title: 'Mansión Blanca',
  subtitle: 'Challuabamba',
  category: 'Residencial',
  location: 'Challuabamba',
  image: 'assets/proyectos/...', // mantener la imagen ya asignada
  year: '',
  description: 'Esta vivienda está diseñada con una estructura de dos niveles, esta casa tipo mansión tiene la característica de contar con techo en varias aguas, debido a la ubicación geográfica y las inclemencias del tiempo de la región.'
},
{
  id: '02',
  title: 'Mansión La Pradera',
  subtitle: 'Challuabamba',
  category: 'Residencial',
  location: 'Challuabamba',
  image: 'assets/proyectos/...',
  year: '',
  description: 'Esta vivienda se caracteriza por estar diseñada con materiales modernos extraídos del entorno, como lo es la madera. Un aspecto de suma importancia de este estilo de casa es que están construidas en terrenos de grandes extensiones con amplios patios y hermosos paisajes, con acabados de lujo dando como resultado un acabado agradable.'
}
```

**`construccion-cases.html`** — reemplazar el bloque `project-info` (Area/Duración) por:
```html
<p class="project-description">{{ project.description }}</p>
```

**`construccion-cases.css`** — agregar el mismo `.project-description` de arriba (copiarlo,
mismo estilo en los dos componentes).

---

## Checklist
- [ ] La página `/legal` ya no muestra ninguna sección de proyectos/casos, y no quedó ningún
      botón roto apuntando a `#legal-casos`.
- [ ] `/diseno` muestra solo 2 proyectos: Vivienda Unifamiliar y Espacio Barbacoa, con su
      descripción real visible (no campos vacíos).
- [ ] `/construccion` muestra solo 2 proyectos: Mansión Blanca y Mansión La Pradera, con su
      descripción real visible.
- [ ] Ningún proyecto aparece repetido entre las dos páginas.
- [ ] `ng build` corre sin errores (cuidado con imports/tipos rotos al borrar `legal-cases`).
