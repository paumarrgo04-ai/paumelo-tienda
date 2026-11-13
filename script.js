// ==========================================
// 1. VARIABLES GLOBALES
// ==========================================
let personajesFrente = [];
let personajesEspalda = [];
let personajesLlaveroFrente = [];
let personajesLlaveroEspalda = [];
let caraActivaLlavero = 'frente';
let caraActiva = "frente";
let colorActualNombre = "Rosado";
let nombreArchivoBolsoActual = "Bolso_Rosado.png";
let nombreArchivoLlaveroBase = "LlaveroFieltroRosado.png";
let usuarioRegistrado = false;
let tipoProductoActual = "tote";
let pedidoStockActual = null;

const banners = [
    "Imagenes/Banners/Banner_Totebag.png",
    "Imagenes/Banners/Banner_Llaveros.png",
    "Imagenes/Banners/Banner_Kitdeentretenimiento.png",
    "Imagenes/Banners/Banner_Camisetas.png"
];
let indiceBannerActual = 0;

// Base de datos de Stock de Llaveros Fieltro (One Piece - 6.000 COP)
const stockLlaverosFieltro = [
    { id: 'op1', nombre: 'Luffy · One Piece', precio: 6000, imagen: 'Imagenes/StockLlaverosFieltro/LlaveroFieltroLuffy1.png', imagenEspalda: 'Imagenes/StockLlaverosFieltro/LlaveroFieltroLuffy2.png', cantidadDisponible: 20 },
    { id: 'op2', nombre: 'Nika · One Piece', precio: 6000, imagen: 'Imagenes/StockLlaverosFieltro/LlaveroFieltroNiko1.png', imagenEspalda: 'Imagenes/StockLlaverosFieltro/LlaveroFieltroNiko2.png', cantidadDisponible: 18 },
    { id: 'op3', nombre: 'Shanks · One Piece', precio: 6000, imagen: 'Imagenes/StockLlaverosFieltro/LlaveroFieltroShanks1.png', imagenEspalda: 'Imagenes/StockLlaverosFieltro/LlaveroFieltroShanks2.png', cantidadDisponible: 10 },
    { id: 'op4', nombre: 'Zoro · One Piece', precio: 6000, imagen: 'Imagenes/StockLlaverosFieltro/LlaveroFieltroZoro1.png', imagenEspalda: 'Imagenes/StockLlaverosFieltro/LlaveroFieltroZoro2.png', cantidadDisponible: 25 }
];

// Base de datos de Stock de Llaveros Peluche (My Little Pony - 8.000 COP)
const stockLlaverosPeluche = [
    { id: 'mlp1', nombre: 'Llavero Peluche Fluttershy (Pony Amarillo)', precio: 8000, imagen: 'Imagenes/StockLlaverosPeluche/LlaveroPelucheAmarillo.png', cantidadDisponible: 20 },
    { id: 'mlp2', nombre: 'Llavero Peluche Twilight Sparkle (Pony Azul)', precio: 8000, imagen: 'Imagenes/StockLlaverosPeluche/LlaveroPelucheAzul.png', cantidadDisponible: 15 },
    { id: 'mlp3', nombre: 'Llavero Peluche Rarity (Pony Blanco)', precio: 8000, imagen: 'Imagenes/StockLlaverosPeluche/LlaveroPelucheBlanco.png', cantidadDisponible: 18 },
    { id: 'mlp4', nombre: 'Llavero Peluche Applejack (Pony Naranja)', precio: 8000, imagen: 'Imagenes/StockLlaverosPeluche/LlaveroPelucheNaranja.png', cantidadDisponible: 12 },
    { id: 'mlp5', nombre: 'Llavero Peluche Pinkie Pie (Pony Rosado)', precio: 8000, imagen: 'Imagenes/StockLlaverosPeluche/LlaveroPelucheRosado.png', cantidadDisponible: 22 },
    { id: 'mlp6', nombre: 'Llavero Peluche Rainbow Dash (Pony Morado)', precio: 8000, imagen: 'Imagenes/StockLlaverosPeluche/LlaveroPelucheMorado.png', cantidadDisponible: 16 }
];


// ==========================================
// 2. CONTROL DEL CARRUSEL DE BANNERS
// ==========================================
function cambiarBanner(dir) {
    indiceBannerActual = (indiceBannerActual + dir + banners.length) % banners.length;
    actualizarBannerVisual();
}

function irABanner(idx) {
    indiceBannerActual = idx;
    actualizarBannerVisual();
}

function actualizarBannerVisual() {
    const img = document.getElementById('imagen-banner');
    if (img) img.src = banners[indiceBannerActual];
    
    document.querySelectorAll('.flor-indicador').forEach((flor, i) => {
        flor.classList.toggle('activa', i === indiceBannerActual);
    });
}


// ==========================================
// 3. CAMBIO DE VISTAS
// ==========================================
function mostrarVista(vista, guardarHistorial = true) {
    // Acepta tanto nombres cortos (onclick) como IDs reales de las secciones.
    const rutas = {
        inicio: 'vista-inicio',
        stock: 'vista-stock',
        personalizador: 'vista-personalizador',
        'personalizador-tote': 'vista-personalizador-tote',
        'personalizador-llaveros': 'vista-personalizador-llaveros',
    };
    const idVista = rutas[vista] || (vista.startsWith('vista-') ? vista : null);
    const idsVistas = [...new Set([...Object.values(rutas), 'vista-personalizador-tote'])];

    if (!idVista || !document.getElementById(idVista)) {
        console.warn(`No existe la vista solicitada: ${vista}`);
        return;
    }

    idsVistas.forEach(id => {
        const seccion = document.getElementById(id);
        if (seccion) seccion.style.display = id === idVista ? 'block' : 'none';
    });

    if (guardarHistorial) history.pushState({ vista: idVista }, '', `#${idVista}`);

    if (idVista === 'vista-personalizador-tote') {
        cargarCatalogoPersonajesTote(document.getElementById('buscador-personajes-tote')?.value || '');
        actualizarContadorLimiteTote();
    } else if (idVista === 'vista-personalizador-llaveros') {
        cargarCatalogoLlaveros(document.getElementById('buscador-personajes-llavero')?.value || '');
        actualizarContadorLimiteLlavero();
    } else if (idVista === 'vista-stock') {
        renderizarStockLlaverosFieltro(stockLlaverosFieltro);
        renderizarStockPeluches(stockLlaverosPeluche);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('popstate', event => {
    const id = event.state?.vista || location.hash.slice(1) || 'vista-inicio';
    mostrarVista(id, false);
});

// ==========================================
// 4. GESTIÓN DE STOCK (LLAVEROS Y PELUCHES)
// ==========================================
function renderizarStockLlaverosFieltro(lista) {
    const grid = document.getElementById('grid-stock-llaveros-fieltro');
    if (!grid) return;
    grid.innerHTML = lista.map(item => `
        <article class="card-producto-ref producto-stock">
            <div class="producto-visual visual-onepiece" onclick="this.classList.toggle('girada')" role="button" tabindex="0" aria-label="Cambiar entre frente y reverso">
                <div class="producto-imagen-doble">
                    <img class="cara-producto cara-frente" src="${item.imagen}" alt="${item.nombre}, frente">
                    <img class="cara-producto cara-reverso" src="${item.imagenEspalda}" alt="${item.nombre}, reverso">
                </div>
            </div>
            <div class="card-info">
                <h3>${item.nombre}</h3>
                <p class="card-precio">COP ${item.precio.toLocaleString()}</p>
                <p class="card-sub">Stock disponible: ${item.cantidadDisponible} un.</p>
                <label for="cant-${item.id}">Cantidad:</label>
                <input type="number" id="cant-${item.id}" value="1" min="1" max="${item.cantidadDisponible}">
                <button class="btn-accion-card" onclick="comprarStock('${item.id}', 'fieltro')">COMPRAR</button>
            </div>
        </article>
    `).join('');
}

function filtrarStockLlaverosFieltro(filtro) {
    const termino = filtro.trim().toLocaleLowerCase();
    renderizarStockLlaverosFieltro(stockLlaverosFieltro.filter(item =>
        item.nombre.toLocaleLowerCase().includes(termino)
    ));
}

function renderizarStockPeluches(lista) {
    const grid = document.getElementById('grid-stock-llaveros-peluche');
    if (!grid) return;
    const tonos = {
        Amarillo: 'pony-amarillo', Azul: 'pony-azul', Blanco: 'pony-blanco',
        Naranja: 'pony-naranja', Rosado: 'pony-rosado', Morado: 'pony-morado'
    };
    grid.innerHTML = lista.map(item => {
        const color = Object.keys(tonos).find(nombre => item.imagen.includes(nombre)) || 'Rosado';
        return `
            <article class="card-producto-ref producto-stock">
                <div class="producto-visual ${tonos[color]}">
                    <img class="imagen-producto-hover" src="${item.imagen}" alt="${item.nombre}">
                </div>
                <div class="card-info">
                    <h3>${item.nombre}</h3>
                    <p class="card-precio">COP ${item.precio.toLocaleString()}</p>
                    <p class="card-sub">Stock disponible: ${item.cantidadDisponible} un.</p>
                    <label for="cant-${item.id}">Cantidad:</label>
                    <input type="number" id="cant-${item.id}" value="1" min="1" max="${item.cantidadDisponible}">
                    <button class="btn-accion-card" onclick="comprarStock('${item.id}', 'peluche')">COMPRAR</button>
                </div>
            </article>`;
    }).join('');
}

function filtrarStockPeluches(filtro) {
    const termino = filtro.trim().toLocaleLowerCase();
    renderizarStockPeluches(stockLlaverosPeluche.filter(item =>
        item.nombre.toLocaleLowerCase().includes(termino)
    ));
}

function comprarStockTote(diseno = 1) {
    const input = document.getElementById(diseno === 2 ? 'cant-stock-tote-2' : 'cant-stock-tote');
    const cantidad = Math.max(1, Math.min(20, parseInt(input?.value, 10) || 1));
    pedidoStockActual = {
        nombre: diseno === 2 ? 'Tote Bag Kitty · Diseño 2' : 'Tote Bag Kitty',
        precioUnitario: 30000,
        cantidad,
        imagen: diseno === 2 ? 'Imagenes/StockTotebag/StockToteBagKitty2.png' : 'Imagenes/StockTotebag/StockToteBagKitty1.png',
        esStock: true
    };
    tipoProductoActual = 'stock';
    if (!usuarioRegistrado) abrirRegistro();
    else abrirFactura();
}

function comprarStock(id, tipo) {
    const lista = tipo === 'fieltro' ? stockLlaverosFieltro : stockLlaverosPeluche;
    const producto = lista.find(p => p.id === id);
    const inputCant = document.getElementById(`cant-${id}`);
    const cantidad = Math.max(1, Math.min(producto?.cantidadDisponible || 1, parseInt(inputCant ? inputCant.value : 1) || 1));

    pedidoStockActual = {
        nombre: producto.nombre,
        precioUnitario: producto.precio,
        cantidad: cantidad,
        imagen: producto.imagen,
        esStock: true
    };

    tipoProductoActual = 'stock';
    if (!usuarioRegistrado) abrirRegistro();
    else abrirFactura();
}


// ==========================================
// 5. GESTIÓN DEL CATÁLOGO TOTE BAG
// ==========================================
function cargarCatalogoPersonajesTote(filtro = "") {
    const grid = document.getElementById('grid-personajes-tote');
    if (!grid) return;
    
    grid.innerHTML = "";
    const filtrados = catalogoPersonajes.filter(item => 
        item.keywords.toLowerCase().includes(filtro.toLowerCase()) || 
        item.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    if (filtrados.length === 0) {
        grid.innerHTML = `<p style="font-size: 11px; color: #888; text-align: center; grid-column: span 2;">No se encontraron diseños 😢</p>`;
        return;
    }

    filtrados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-personaje';
        div.onclick = () => agregarPersonajeATote(item.imagen.split('/').pop());
        div.innerHTML = `<img src="${item.imagen}" alt="${item.nombre}" title="${item.nombre}">`;
        grid.appendChild(div);
    });
}

const inputBusquedaTote = document.getElementById('buscador-personajes-tote');
if (inputBusquedaTote) {
    inputBusquedaTote.addEventListener('input', e => cargarCatalogoPersonajesTote(e.target.value));
}


// ==========================================
// 6. GESTIÓN DEL CATÁLOGO LLAVERO DE FIELTRO (PERSONALIZADOR)
// ==========================================
function cargarCatalogoLlaveros(filtro = "") {
    const grid = document.getElementById('grid-personajes-llavero');
    if (!grid) return;
    
    grid.innerHTML = "";
    const fuenteLlaveros = typeof catalogoLlaverosFieltro !== 'undefined' ? catalogoLlaverosFieltro : catalogoPersonajes;
    
    const filtrados = fuenteLlaveros.filter(item => 
        item.keywords.toLowerCase().includes(filtro.toLowerCase()) || 
        item.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    if (filtrados.length === 0) {
        grid.innerHTML = `<p style="font-size: 11px; color: #888; text-align: center; grid-column: span 2;">No se encontraron diseños 😢</p>`;
        return;
    }

    filtrados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item-personaje';
        div.onclick = () => agregarPersonajeALlavero(item.imagen.split('/').pop());
        div.innerHTML = `<img src="${item.imagen}" alt="${item.nombre}" title="${item.nombre}">`;
        grid.appendChild(div);
    });
}

const inputBusquedaLlavero = document.getElementById('buscador-personajes-llavero');
if (inputBusquedaLlavero) {
    inputBusquedaLlavero.addEventListener('input', e => cargarCatalogoLlaveros(e.target.value));
}


// ==========================================
// 7. GESTIÓN DE CARAS Y DISEÑO TOTE BAG
// ==========================================
function cambiarCaraBolso(cara) {
    caraActiva = cara;
    document.getElementById('btn-cara-frente')?.classList.toggle('activa', cara === 'frente');
    document.getElementById('btn-cara-espalda')?.classList.toggle('activa', cara === 'espalda');
    document.getElementById('wrapper-frente')?.classList.toggle('activo', cara === 'frente');
    document.getElementById('wrapper-espalda')?.classList.toggle('activo', cara === 'espalda');
    actualizarContadorLimiteTote();
}

function siguienteCara() {
    cambiarCaraBolso(caraActiva === 'frente' ? 'espalda' : 'frente');
}

function actualizarContadorLimiteTote() {
    const el = document.getElementById('contador-limite-tote');
    if (!el) return;
    const cant = caraActiva === 'frente' ? personajesFrente.length : personajesEspalda.length;
    el.innerText = `Diseños en esta cara: ${cant} / 3`;
}

function agregarPersonajeATote(imagenSrc) {
    const lista = caraActiva === 'frente' ? personajesFrente : personajesEspalda;
    if (lista.length >= 3) {
        alert("¡Solo puedes agregar un máximo de 3 diseños por cada cara del bolso! 💖");
        return;
    }
    lista.push({ id: Date.now(), imagen: imagenSrc, x: 50, y: 40 });
    renderizarPersonajesTote();
    actualizarContadorLimiteTote();
}

function eliminarPersonajeTote(id) {
    if (caraActiva === 'frente') {
        personajesFrente = personajesFrente.filter(p => p.id !== id);
    } else {
        personajesEspalda = personajesEspalda.filter(p => p.id !== id);
    }
    renderizarPersonajesTote();
    actualizarContadorLimiteTote();
}

function renderizarPersonajesTote() {
    const slotFrente = document.getElementById('slot-personajes-frente');
    const slotEspalda = document.getElementById('slot-personajes-espalda');

    if (slotFrente) {
        slotFrente.innerHTML = "";
        personajesFrente.forEach(p => slotFrente.appendChild(crearElementoArrastrable(p, eliminarPersonajeTote)));
    }
    if (slotEspalda) {
        slotEspalda.innerHTML = "";
        personajesEspalda.forEach(p => slotEspalda.appendChild(crearElementoArrastrable(p, eliminarPersonajeTote)));
    }
}


// ==========================================
// 8. GESTIÓN DE DISEÑO LLAVERO DE FIELTRO PERSONALIZADO
// ==========================================
function cambiarCaraLlavero(cara) {
    caraActivaLlavero = cara;
    document.querySelectorAll('.llavero-caras-editor .bolso-preview-wrapper').forEach((panel, i) => {
        panel.classList.toggle('activo', (i === 0 ? 'frente' : 'espalda') === cara);
    });
    actualizarContadorLimiteLlavero();
}

function actualizarContadorLimiteLlavero() {
    const frente = document.getElementById('contador-limite-llavero');
    const actual = caraActivaLlavero === 'frente' ? personajesLlaveroFrente : personajesLlaveroEspalda;
    if (frente) frente.innerText = `Cara ${caraActivaLlavero === 'frente' ? 'frontal' : 'trasera'}: ${actual.length} / 2 diseños`;
}

function agregarPersonajeALlavero(imagenSrc) {
    const lista = caraActivaLlavero === 'frente' ? personajesLlaveroFrente : personajesLlaveroEspalda;
    if (lista.length >= 2) {
        alert('¡Puedes agregar hasta 2 accesorios en cada cara del llavero! 💖');
        return;
    }
    lista.push({ id: Date.now(), imagen: imagenSrc, x: 50, y: 50 });
    renderizarPersonajesLlavero();
    actualizarContadorLimiteLlavero();
}

function eliminarPersonajeLlavero(id) {
    const lista = caraActivaLlavero === 'frente' ? personajesLlaveroFrente : personajesLlaveroEspalda;
    if (caraActivaLlavero === 'frente') personajesLlaveroFrente = lista.filter(p => p.id !== id);
    else personajesLlaveroEspalda = lista.filter(p => p.id !== id);
    renderizarPersonajesLlavero();
    actualizarContadorLimiteLlavero();
}

function renderizarPersonajesLlavero() {
    const frente = document.getElementById('slot-personajes-llavero-frente');
    const espalda = document.getElementById('slot-personajes-llavero-espalda');
    if (frente) {
        frente.innerHTML = '';
        personajesLlaveroFrente.forEach(p => frente.appendChild(crearElementoArrastrable(p, id => {
            personajesLlaveroFrente = personajesLlaveroFrente.filter(item => item.id !== id);
            renderizarPersonajesLlavero();
            actualizarContadorLimiteLlavero();
        })));
    }
    if (espalda) {
        espalda.innerHTML = '';
        personajesLlaveroEspalda.forEach(p => espalda.appendChild(crearElementoArrastrable(p, id => {
            personajesLlaveroEspalda = personajesLlaveroEspalda.filter(item => item.id !== id);
            renderizarPersonajesLlavero();
            actualizarContadorLimiteLlavero();
        })));
    }
}

function cambiarColorLlavero(archivo, nombre) {
    nombreArchivoLlaveroBase = archivo;
    document.querySelectorAll('.imagen-llavero-dinamica').forEach(img => {
        img.src = `Imagenes/PersonalizadorLLaveros/${archivo}`;
    });
}

// ==========================================
// 9. ELEMENTOS ARRASTRABLES (STICKERS)
// ==========================================
function crearElementoArrastrable(obj, funcionEliminar) {
    const contenedor = document.createElement('div');
    contenedor.className = 'sticker-movible';
    contenedor.style.left = obj.x + '%';
    contenedor.style.top = obj.y + '%';

    contenedor.innerHTML = `
        <img src="Imagenes/PersoanlizadorCatologoPersonajes/${obj.imagen}" alt="Diseño">
        <button class="btn-eliminar-sticker" title="Eliminar">&times;</button>
    `;

    contenedor.querySelector('.btn-eliminar-sticker').onclick = (e) => {
        e.stopPropagation();
        funcionEliminar(obj.id);
    };

    let isDragging = false, startX, startY;

    const iniciar = (x, y) => { isDragging = true; startX = x; startY = y; };
    const mover = (x, y) => {
        if (!isDragging) return;
        obj.x = Math.max(15, Math.min(85, obj.x + (x - startX) / 1.4));
        obj.y = Math.max(15, Math.min(85, obj.y + (y - startY) / 1.4));
        startX = x; startY = y;
        contenedor.style.left = obj.x + '%';
        contenedor.style.top = obj.y + '%';
    };
    const detener = () => isDragging = false;

    contenedor.addEventListener('mousedown', e => { iniciar(e.clientX, e.clientY); e.stopPropagation(); });
    document.addEventListener('mousemove', e => mover(e.clientX, e.clientY));
    document.addEventListener('mouseup', detener);

    contenedor.addEventListener('touchstart', e => { iniciar(e.touches[0].clientX, e.touches[0].clientY); e.stopPropagation(); });
    document.addEventListener('touchmove', e => mover(e.touches[0].clientX, e.touches[0].clientY));
    document.addEventListener('touchend', detener);

    return contenedor;
}

function cambiarColorBolso(archivo, nombre) {
    nombreArchivoBolsoActual = archivo;
    colorActualNombre = nombre;
    document.querySelectorAll('.imagen-bolso-dinamica').forEach(img => {
        img.src = `Imagenes/PersonalizadorColorBolsos/${archivo}`;
    });
}


// ==========================================
// 10. ASISTENTE VIRTUAL PIOLA
// ==========================================
function responderPiola(tipo, opcion) {
    const idCont = tipo === 'tote' ? 'piola-respuesta-tote' : 'piola-respuesta-llavero';
    const cont = document.getElementById(idCont);
    if (!cont) return;
    
    let textos = {};
    if (tipo === 'tote') {
        textos = {
            1: "¡Haz clic en los círculos de colores para cambiar el tono del bolso al instante! 🎨✨",
            2: "¡Usa el botón rosa o haz clic en los bolsos para pasar de cara! 🎒✨",
            3: "Tienes un límite de hasta 3 diseños por cada cara del bolso. 💖",
            4: "¡Tus productos personalizados tardan de 3 a 5 días hábiles en estar listos! 📦✨"
        };
    } else {
        textos = {
            1: "¡Elige el color y decora por separado el frente y el reverso de tu llavero! 🔑✨",
            2: "Puedes agregar hasta 2 accesorios en cada cara del llavero. 💖",
            3: "Nuestros llaveros están confeccionados con fieltro suave y resistente. ✨",
            4: "¡Los pedidos personalizados se despachan en 2 a 3 días hábiles! 🚚"
        };
    }
    cont.innerHTML = `<p><strong>Piola:</strong> ${textos[opcion]}</p>`;
}


// ==========================================
// 11. MODALES DE CONTACTO, REGISTRO Y CARRITO (CON DESCUENTO OCULTO 12+ UNIDADES)
// ==========================================
function abrirContacto() {
    document.getElementById('modal-contacto').style.display = 'block';
}

function cerrarContacto() {
    document.getElementById('modal-contacto').style.display = 'none';
}

function finalizarPedido(tipo) {
    tipoProductoActual = tipo;
    if (tipo === 'tote' && personajesFrente.length === 0 && personajesEspalda.length === 0) {
        alert("¡Por favor agrega al menos un diseño en alguna de las caras del bolso!");
        return;
    }
    if (tipo === 'llavero-personalizado' && personajesLlaveroFrente.length === 0 && personajesLlaveroEspalda.length === 0) {
        alert("¡Agrega al menos un diseño en el frente o reverso de tu llavero!");
        return;
    }
    if (!usuarioRegistrado) abrirRegistro();
    else abrirFactura();
}

function abrirRegistro() { document.getElementById('modal-registro').style.display = 'block'; }
function cerrarModalRegistro() { document.getElementById('modal-registro').style.display = 'none'; }

function procesarRegistro(e) {
    e.preventDefault();
    usuarioRegistrado = true;
    cerrarModalRegistro();
    alert("¡Registro exitoso! Tu perfil ha sido guardado.");
    document.getElementById('contador-carrito').innerText = "🛒 1";
    abrirFactura();
}

function irAlCarrito() {
    if (!usuarioRegistrado) abrirRegistro();
    else abrirFactura();
}

function abrirFactura() {
    document.getElementById('factura-fecha').innerText = new Date().toLocaleDateString();
    const detalleEl = document.getElementById('detalle-factura');
    const precioTotalEl = document.getElementById('factura-precio-total');
    const avisoDescEl = document.getElementById('aviso-descuento-oculto');
    
    if (detalleEl && precioTotalEl) {
        let html = "";
        let total = 0;
        let aplicaDescuento = false;

        if (tipoProductoActual === 'tote') {
            total = 30000;
            precioTotalEl.innerText = `COP ${total.toLocaleString()}`;
            if (avisoDescEl) avisoDescEl.style.display = 'none';

            html = `<p style="text-align: center; margin-bottom: 8px;"><strong>1x Bolso ${colorActualNombre} Personalizado (Dos Caras)</strong></p>`;
            html += `<div class="factura-bolsos-container">`;
            ['frente', 'espalda'].forEach(cara => {
                const list = cara === 'frente' ? personajesFrente : personajesEspalda;
                html += `
                    <div class="factura-bolso-wrapper">
                        <span style="font-size: 11px; font-weight: bold; color: #d87093; display: block; margin-bottom: 4px;">Cara ${cara === 'frente' ? 'Frontal' : 'Trasera'}</span>
                        <div class="factura-bolso-preview">
                            <img src="Imagenes/PersonalizadorColorBolsos/${nombreArchivoBolsoActual}" class="factura-img-bolso">
                            ${list.map(p => `<img src="Imagenes/PersoanlizadorCatologoPersonajes/${p.imagen}" class="factura-sticker-movible" style="left: ${p.x}%; top: ${p.y}%;">`).join('')}
                        </div>
                    </div>
                `;
            });
            html += `</div>`;

        } else if (tipoProductoActual === 'llavero-personalizado') {
            total = 12000;
            precioTotalEl.innerText = `COP ${total.toLocaleString()}`;
            if (avisoDescEl) avisoDescEl.style.display = 'none';

            html = `<p style="text-align: center; margin-bottom: 8px;"><strong>1x Llavero de Fieltro Personalizado</strong></p>`;
            html += `<div style="display: flex; justify-content: center; margin: 8px 0;">`;
            html += `<div class="factura-bolsos-container">`;
            [['Frontal', personajesLlaveroFrente], ['Trasera', personajesLlaveroEspalda]].forEach(([cara, lista]) => {
                html += `<div class="factura-bolso-wrapper"><span>${cara}</span><div class="factura-bolso-preview" style="width:110px;height:130px;"><img src="Imagenes/PersonalizadorLLaveros/${nombreArchivoLlaveroBase}" class="factura-img-bolso">${lista.map(p => `<img src="Imagenes/PersoanlizadorCatologoPersonajes/${p.imagen}" class="factura-sticker-movible" style="left:${p.x}%;top:${p.y}%;">`).join('')}</div></div>`;
            });
            html += `</div>`;
            html += `</div>`;

        } else if (tipoProductoActual === 'stock' && pedidoStockActual) {
            let subtotal = pedidoStockActual.precioUnitario * pedidoStockActual.cantidad;
            
            // APLICA DESCUENTO OCULTO DEL 20% SI LLEVA 12 O MÁS UNIDADES
            if (pedidoStockActual.cantidad >= 12) {
                total = subtotal * 0.8;
                aplicaDescuento = true;
            } else {
                total = subtotal;
            }

            precioTotalEl.innerText = `COP ${total.toLocaleString()}`;
            if (avisoDescEl) avisoDescEl.style.display = aplicaDescuento ? 'block' : 'none';

            html = `
                <p style="text-align: center; margin-bottom: 4px;"><strong>${pedidoStockActual.cantidad}x ${pedidoStockActual.nombre}</strong></p>
                <p style="text-align: center; font-size: 11px; color: #666; margin-bottom: 8px;">Precio unitario: COP ${pedidoStockActual.precioUnitario.toLocaleString()}</p>
                <div style="display: flex; justify-content: center; margin: 8px 0;">
                    <div class="factura-bolso-preview" style="width: 120px; height: 140px;">
                        <img src="${pedidoStockActual.imagen}" class="factura-img-bolso">
                    </div>
                </div>
            `;
        }
        detalleEl.innerHTML = html;
    }
    document.getElementById('modal-factura').style.display = 'block';
}

function cerrarFactura() { document.getElementById('modal-factura').style.display = 'none'; }

function borrarFactura() {
    alert("Factura eliminada del carrito.");
    document.getElementById('contador-carrito').innerText = "🛒 0";
    personajesFrente = [];
    personajesEspalda = [];
    personajesLlaveroFrente = [];
    personajesLlaveroEspalda = [];
    pedidoStockActual = null;
    renderizarPersonajesTote();
    renderizarPersonajesLlavero();
    actualizarContadorLimiteTote();
    actualizarContadorLimiteLlavero();
    cerrarFactura();
}

function archivarFactura() { 
    alert("Factura archivada con éxito."); 
    cerrarFactura(); 
}


// ==========================================
// 12. INICIALIZACIÓN
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    cargarCatalogoPersonajesTote();
    cargarCatalogoLlaveros();
    const vistaInicial = location.hash.slice(1);
    if (vistaInicial) mostrarVista(vistaInicial, false);
    else mostrarVista('inicio', false);
});