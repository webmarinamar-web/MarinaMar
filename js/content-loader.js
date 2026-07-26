(function () {
  function aplicarTextos(textos) {
    if (!textos) return;
    document.querySelectorAll('[data-cms-text]').forEach(function (el) {
      var clave = el.dataset.cmsText;
      var valor = textos[clave];
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
  }

  function aplicarEnlaces(enlaces) {
    if (!enlaces) return;
    document.querySelectorAll('[data-cms-href]').forEach(function (el) {
      var clave = el.dataset.cmsHref;
      var valor = enlaces[clave];
      if (!valor) return;
      el.setAttribute('href', valor);
    });
  }

  function aplicarFotos(fotos) {
    if (!fotos) return;
    document.querySelectorAll('[data-cms-foto]').forEach(function (el) {
      var clave = el.dataset.cmsFoto;
      var ruta = fotos[clave];
      if (!ruta) return; // sin foto real todavía: se queda el marcador de diseño
      el.style.backgroundImage = "url('" + ruta + "')";
      el.classList.add('foto--real');
    });
  }

  fetch('content/datos.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (datos) {
      if (!datos) return;
      aplicarTextos(datos.textos);
      aplicarEnlaces(datos.enlaces);
    })
    .catch(function () { /* si falla, se quedan los textos de la maqueta */ });

  fetch('content/fotos.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (fotos) { aplicarFotos(fotos); })
    .catch(function () { /* si falla, se quedan los marcadores de foto */ });
})();
