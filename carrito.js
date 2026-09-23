/* =========================================================
   VallenatoStore – Carrito de compras y checkout estilo tienda
   ========================================================= */

(function () {
    'use strict';

    var PRODUCTOS_CARRITO = {
        '30 Mejores': { campo: 'binomio-cd', precio: 55000, formato: 'CD' },
        '30 Grandes Éxitos': { campo: 'diomedes-cd', precio: 48000, formato: 'CD' },
        'Experiencias Vividas': { campo: 'diomedes-vinilo', precio: 92000, formato: 'Vinilo 180g' },
        'Un Canto Celestial': { campo: 'canto-cd', precio: 46000, formato: 'CD' },
        'Título de Amor': { campo: 'amor-vinilo', precio: 95000, formato: 'Vinilo 180g' },
        'Celedón Sin Fronteras': { campo: 'celedon-cd', precio: 50000, formato: 'CD' },
        'Llévame en Tus Sueños': { campo: 'suenos-cd', precio: 47000, formato: 'CD' },
        'Los 30 Vallenatos de la Historia': { campo: 'antologia-vinilo', precio: 110000, formato: 'Vinilo 180g' },
        'La Hora de la Verdad': { campo: 'hora-cd', precio: 45000, formato: 'CD' },
        'Imparables': { campo: 'imparables-cd', precio: 48000, formato: 'CD' },
        'A Mi Manera': { campo: 'manera-cd', precio: 44000, formato: 'CD' },
        '10 Años de Historia': { campo: 'diablitos-cd', precio: 43000, formato: 'CD' },
        'Poncho Zuleta 45 Años': { campo: 'poncho-vinilo', precio: 96000, formato: 'Vinilo 180g' },
        'La 9ª Batalla (En Vivo)': { campo: 'batalla-vinilo', precio: 99000, formato: 'Vinilo 180g' },
        'Colección Top 50': { campo: 'oniate-vinilo', precio: 94000, formato: 'Vinilo 180g' }
    };

    var ENVIO_GRATIS_DESDE = 150000;
    var COSTO_ENVIO = 12900;

    var carrito = [];

    var listaCarrito = document.getElementById('listaCarrito');
    var listaResumen = document.getElementById('listaResumen');
    var badge = document.getElementById('carritoBadge');
    var subtotalEl = document.getElementById('carritoSubtotal');
    var envioEl = document.getElementById('carritoEnvio');
    var totalEl = document.getElementById('carritoTotal');
    var envioRow = document.getElementById('carritoEnvioRow');
    var resSubtotalEl = document.getElementById('resumenSubtotal');
    var resEnvioEl = document.getElementById('resumenEnvio');
    var resTotalEl = document.getElementById('resumenTotal');
    var formProducto = document.getElementById('producto');
    var formCantidad = document.getElementById('cantidad');

    function formatear(n) {
        return '$' + n.toLocaleString('es-CO');
    }

    function encontrado(titulo) {
        for (var i = 0; i < carrito.length; i++) {
            if (carrito[i].titulo === titulo) { return i; }
        }
        return -1;
    }

    function subtotal() {
        return carrito.reduce(function (acc, item) { return acc + item.precio * item.cantidad; }, 0);
    }

    function envio() {
        return (carrito.length === 0 || subtotal() >= ENVIO_GRATIS_DESDE) ? 0 : COSTO_ENVIO;
    }

    function totalItems() {
        return carrito.reduce(function (acc, item) { return acc + item.cantidad; }, 0);
    }

    /* Refleja el primer producto del carrito en el formulario */
    function sincronizarFormSimple() {
        if (!formProducto || !formCantidad || carrito.length === 0) { return; }
        formProducto.value = carrito[0].campo;
        formCantidad.value = carrito[0].cantidad;
    }

    function listarEn(contenedor, conControles) {
        if (!contenedor) { return; }
        if (carrito.length === 0) {
            contenedor.innerHTML =
                '<div class="carrito-vacio">' +
                '<i class="bi bi-cart-x"></i>' +
                '<strong>Tu carrito está vacío</strong>' +
                '<p class="mb-0 small">Agrega discos desde el catálogo y regresa aquí para pagar.</p>' +
                '</div>';
            return;
        }

        contenedor.innerHTML = carrito.map(function (item) {
            var pie;
            if (conControles) {
                pie =
                    '<div class="carrito-item-pie">' +
                    '<span class="cantidad-control">' +
                    '<button type="button" data-accion="restar" data-titulo="' + item.titulo + '" aria-label="Restar uno">\u2212</button>' +
                    '<span>' + item.cantidad + '</span>' +
                    '<button type="button" data-accion="sumar" data-titulo="' + item.titulo + '" aria-label="Sumar uno">+</button>' +
                    '</span>' +
                    '<span class="carrito-item-precio">' + formatear(item.precio * item.cantidad) + '</span>' +
                    '<button type="button" class="carrito-quitar" data-accion="quitar" data-titulo="' + item.titulo + '" aria-label="Quitar del carrito"><i class="bi bi-trash3"></i></button>' +
                    '</div>';
            } else {
                pie =
                    '<div class="carrito-item-pie">' +
                    '<span class="text-muted small">× ' + item.cantidad + '</span>' +
                    '<span class="carrito-item-precio">' + formatear(item.precio * item.cantidad) + '</span>' +
                    '</div>';
            }

            return '<div class="carrito-item">' +
                '<img src="' + item.img + '" alt="Portada de ' + item.titulo + '" loading="lazy">' +
                '<div class="carrito-item-info">' +
                '<h6>' + item.titulo + '</h6>' +
                '<p>' + item.artista + ' · ' + item.formato + '</p>' +
                pie +
                '</div></div>';
        }).join('');
    }

    function dibujar() {
        var sub = subtotal();
        var env = envio();
        var tot = sub + env;
        var cuenta = totalItems();

        badge.classList.toggle('visible', cuenta > 0);
        badge.textContent = cuenta;

        subtotalEl.textContent = formatear(sub);
        envioEl.textContent = env === 0 ? 'Gratis' : formatear(env);
        envioRow.classList.toggle('envio-gratis', env === 0 && carrito.length > 0);
        totalEl.textContent = formatear(tot);

        resSubtotalEl.textContent = formatear(sub);
        resEnvioEl.textContent = carrito.length === 0 ? '—' : (env === 0 ? 'Gratis' : formatear(env));
        resTotalEl.textContent = formatear(tot);

        listarEn(listaCarrito, true);
        listarEn(listaResumen, false);

        document.querySelectorAll('.btn-carrito').forEach(function (btn) {
            var enCarrito = encontrado(btn.dataset.titulo) !== -1;
            btn.classList.toggle('agregado', enCarrito);
            btn.innerHTML = '<i class="bi ' + (enCarrito ? 'bi-check2-circle' : 'bi-cart-plus-fill') + ' me-1"></i> ' +
                (enCarrito ? 'En el carrito' : 'Agregar al carrito');
        });

        sincronizarFormSimple();
    }

    function abrir() {
        document.getElementById('panelCarrito').classList.add('abierto');
        document.getElementById('carritoOverlay').classList.add('abierto');
        document.getElementById('panelCarrito').setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function cerrar() {
        document.getElementById('panelCarrito').classList.remove('abierto');
        document.getElementById('carritoOverlay').classList.remove('abierto');
        document.getElementById('panelCarrito').setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function agregarDesdeTarjeta(card) {
        var tituloEl = card.querySelector('.card-title');
        var titulo = tituloEl ? tituloEl.textContent.trim() : '';
        var dato = PRODUCTOS_CARRITO[titulo];
        if (!dato) { return; }

        var idx = encontrado(titulo);
        if (idx === -1) {
            var imgEl = card.querySelector('.producto-cover');
            var artistaEl = card.querySelector('.card-artista');
            carrito.push({
                titulo: titulo,
                artista: artistaEl ? artistaEl.textContent.trim() : 'Varios artistas',
                precio: dato.precio,
                formato: dato.formato,
                img: imgEl ? imgEl.src : '',
                cantidad: 1
            });
        } else {
            carrito[idx].cantidad += 1;
        }

        dibujar();
        abrir();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var btnAbrir = document.getElementById('btnAbrirCarrito');
        var btnCerrar = document.getElementById('carritoCerrar');
        var overlay = document.getElementById('carritoOverlay');
        var btnPagar = document.getElementById('btnPagar');

        document.querySelectorAll('.producto').forEach(function (card) {
            var tituloEl = card.querySelector('.card-title');
            var titulo = tituloEl ? tituloEl.textContent.trim() : '';
            if (!titulo || !PRODUCTOS_CARRITO[titulo]) { return; }

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'btn btn-carrito';
            btn.dataset.titulo = titulo;
            btn.innerHTML = '<i class="bi bi-cart-plus-fill me-1"></i> Agregar al carrito';
            btn.setAttribute('aria-label', 'Agregar ' + titulo + ' al carrito');
            btn.addEventListener('click', function () { agregarDesdeTarjeta(card); });
            card.appendChild(btn);
        });

        btnAbrir.addEventListener('click', abrir);
        btnCerrar.addEventListener('click', cerrar);
        overlay.addEventListener('click', cerrar);

        document.addEventListener('click', function (e) {
            var btnAccion = e.target.closest('[data-accion]');
            if (!btnAccion) { return; }
            var titulo = btnAccion.dataset.titulo;
            var accion = btnAccion.dataset.accion;
            var idx = encontrado(titulo);
            if (idx === -1) { return; }
            if (accion === 'sumar') {
                carrito[idx].cantidad += 1;
            } else if (accion === 'restar') {
                carrito[idx].cantidad -= 1;
                if (carrito[idx].cantidad <= 0) { carrito.splice(idx, 1); }
            } else if (accion === 'quitar') {
                carrito.splice(idx, 1);
            }
            dibujar();
        });

        btnPagar.addEventListener('click', function () {
            cerrar();
            if (carrito.length === 0) { return; }
            sincronizarFormSimple();
            if (window.VSVista) {
                window.VSVista('pedido');
            } else {
                document.getElementById('pedido').scrollIntoView({ behavior: 'smooth' });
            }
        });

        /* Gancho para que la validación del formulario vacíe el carrito */
        window.VSCarrito = {
            vaciar: function () { carrito = []; dibujar(); },
            contar: function () { return carrito.length; }
        };

        dibujar();
    });
})();