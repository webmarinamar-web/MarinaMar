(function () {
  function esc(s){
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  function aplicarTextos(textos) {
    if (!textos) return;
    document.querySelectorAll('[data-cms-text]').forEach(function (el) {
      var valor = textos[el.dataset.cmsText];
      if (!valor) return;
      el.textContent = valor;
      if (el.tagName === 'A') {
        if (el.getAttribute('href').indexOf('tel:') === 0) {
          el.setAttribute('href', 'tel:' + valor.replace(/\s+/g, ''));
        } else if (el.getAttribute('href').indexOf('mailto:') === 0) {
          el.setAttribute('href', 'mailto:' + valor);
        }
      }
    });
    document.querySelectorAll('[data-cms-html]').forEach(function (el) {
      var valor = textos[el.dataset.cmsHtml];
      if (!valor) return;
      el.innerHTML = esc(valor).replace(/\n/g, '<br>');
    });
  }

  function aplicarEnlaces(enlaces) {
    if (!enlaces) return;
    document.querySelectorAll('[data-cms-href]').forEach(function (el) {
      var valor = enlaces[el.dataset.cmsHref];
      if (!valor) return;
      el.setAttribute('href', valor);
    });
  }

  function aplicarFotos(fotos) {
    if (!fotos) return;
    document.querySelectorAll('[data-cms-foto]').forEach(function (el) {
      var ruta = fotos[el.dataset.cmsFoto];
      if (!ruta) return;
      el.style.backgroundImage = "url('" + ruta + "')";
      el.classList.add('foto--real');
    });
    if (fotos.logo) {
      var img = document.getElementById('logoImg');
      var texto = document.getElementById('logoTexto');
      if (img) { img.src = fotos.logo; img.style.display = 'block'; }
      if (texto) { texto.style.display = 'none'; }
    }
  }

  function fotoDiv(ruta, alt, clase) {
    var div = document.createElement('div');
    div.className = clase || 'foto foto--43';
    div.setAttribute('data-foto', alt || '');
    if (ruta) {
      div.style.backgroundImage = "url('" + ruta + "')";
      div.classList.add('foto--real');
    }
    return div;
  }

  function renderTarjetas(contenedor, items) {
    if (!contenedor || !Array.isArray(items)) return;
    contenedor.innerHTML = '';
    items.forEach(function (it) {
      var fig = document.createElement('figure');
      fig.className = 'tarjeta';
      fig.appendChild(fotoDiv(it.foto, it.titulo));
      var cap = document.createElement('figcaption');
      var h3 = document.createElement('h3'); h3.textContent = it.titulo || '';
      var p = document.createElement('p'); p.textContent = it.descripcion || '';
      cap.appendChild(h3); cap.appendChild(p);
      fig.appendChild(cap);
      contenedor.appendChild(fig);
    });
  }

  function renderListaSimple(contenedor, items) {
    if (!contenedor || !Array.isArray(items)) return;
    contenedor.innerHTML = '';
    items.forEach(function (texto) {
      var li = document.createElement('li');
      li.textContent = texto;
      contenedor.appendChild(li);
    });
  }

  function renderFaq(contenedor, items) {
    if (!contenedor || !Array.isArray(items)) return;
    contenedor.innerHTML = '';
    items.forEach(function (it) {
      var det = document.createElement('details');
      var sum = document.createElement('summary');
      sum.textContent = it.pregunta || '';
      var p = document.createElement('p');
      p.textContent = it.respuesta || '';
      det.appendChild(sum);
      det.appendChild(p);
      contenedor.appendChild(det);
    });
  }

  function renderActividades(contenedor, items) {
    if (!contenedor || !Array.isArray(items)) return;
    contenedor.innerHTML = '';
    items.forEach(function (it) {
      var art = document.createElement('article');
      var eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.textContent = it.eyebrow || '';
      var h2 = document.createElement('h2');
      h2.textContent = it.titulo || '';
      var p = document.createElement('p');
      p.textContent = it.texto || '';
      art.appendChild(eyebrow);
      art.appendChild(h2);
      art.appendChild(p);
      if (it.enlace_url) {
        var pEnlace = document.createElement('p');
        var a = document.createElement('a');
        a.href = it.enlace_url;
        a.rel = 'noopener';
        a.textContent = it.enlace_texto || it.enlace_url;
        pEnlace.appendChild(a);
        if (it.enlace2_url) {
          pEnlace.appendChild(document.createElement('br'));
          var a2 = document.createElement('a');
          a2.href = it.enlace2_url;
          a2.rel = 'noopener';
          a2.textContent = it.enlace2_texto || it.enlace2_url;
          pEnlace.appendChild(a2);
        }
        art.appendChild(pEnlace);
      }
      contenedor.appendChild(art);
    });
  }

  function aplicarListas(listas) {
    if (!listas) return;
    renderTarjetas(document.getElementById('lista-inicio-destacados'), listas.inicio_destacados);
    renderTarjetas(document.getElementById('lista-habitaciones'), listas.habitaciones);
    renderListaSimple(document.getElementById('lista-distribucion'), listas.distribucion);
    renderListaSimple(document.getElementById('lista-servicios'), listas.servicios);
    renderListaSimple(document.getElementById('lista-condiciones'), listas.condiciones);
    renderListaSimple(document.getElementById('lista-lo-basico'), listas.lo_basico);
    renderFaq(document.getElementById('lista-faq'), listas.faq);
    renderActividades(document.getElementById('lista-actividades'), listas.actividades);
  }

  fetch('content/datos.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (datos) {
      if (!datos) return;
      aplicarTextos(datos.textos);
      aplicarEnlaces(datos.enlaces);
    })
    .catch(function () {});

  fetch('content/fotos.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (fotos) { aplicarFotos(fotos); })
    .catch(function () {});

  fetch('content/listas.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (listas) { aplicarListas(listas); })
    .catch(function () {});
})();
