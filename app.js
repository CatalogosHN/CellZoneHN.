/* ===========================
   CellZoneHN - Prototype UI
   Home + Product Detail (SPA)
   =========================== */

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const state = {
  tab: "favoritos", // favoritos | nuevos | vistos
  query: "",
  cartCount: 1,
  lastViewed: [],
  favorites: new Set([1,2])
};

const products = [
  {
    id: 1,
    badge: "Nuevo",
    name: "Honor Magic8 Lite / 8GB RAM / 256GB / Reddish Brown",
    brand: "HONOR",
    category: "Celulares y Accesorios",
    sku: "HONOR-MAGIC8LITE-BROWN256GB",
    price: 11995,
    gift: "Smartwatch Honor Choice Watch 2i/ 42 mm/ Negro",
    specs: {
      "Almacenamiento": { "Almacenamiento": "256GB", "Memoria Externa": "No" },
      "Rendimiento": { "Memoria RAM": "8GB", "Procesador": "Snapdragon 6 Gen 4", "Sistema Operativo": "MagicOS 9.0" },
      "Potencia": { "Capacidad de Batería": "8300 mAh", "Watts": "67 W" }
    },
    shipping: [
      "Envíos a todo Honduras.",
      "Tiempo estimado: 24–72 horas (según zona).",
      "Pago contra entrega disponible en ciudades principales (según cobertura)."
    ],
    rating: 0
  },
  {
    id: 2,
    badge: "-15%",
    name: "Estufa de Gas Samsung / 30” / Gris",
    brand: "Samsung",
    category: "Línea blanca",
    sku: "SS-COOK-30-GR",
    price: 10995,
    oldPrice: 12995,
    gift: "Instalación básica (según cobertura)",
    specs: {
      "Almacenamiento": { "Almacenamiento": "N/A", "Memoria Externa": "N/A" },
      "Rendimiento": { "Tipo": "Gas", "Tamaño": "30 pulgadas", "Acabado": "Gris" },
      "Potencia": { "Quemadores": "4", "Encendido": "Eléctrico" }
    },
    shipping: [
      "Entrega a domicilio según cobertura.",
      "Recomendación: verificar medidas de ingreso/puertas antes de comprar.",
      "Garantía según condiciones del fabricante."
    ],
    rating: 4
  },
  {
    id: 3,
    badge: "Nuevo",
    name: "Laptop Pro 15 / i7 / 16GB / 512GB SSD",
    brand: "Tech",
    category: "Computadoras y Laptops",
    sku: "LTP-15-I7-16-512",
    price: 24995,
    gift: "Mouse inalámbrico + funda",
    specs: {
      "Almacenamiento": { "Almacenamiento": "512GB SSD", "Memoria Externa": "Sí (según modelo)" },
      "Rendimiento": { "Memoria RAM": "16GB", "Procesador": "Intel Core i7", "Sistema Operativo": "Windows 11" },
      "Potencia": { "Batería": "Hasta 8 horas (uso mixto)", "Cargador": "65W" }
    },
    shipping: [
      "Envío asegurado.",
      "Entrega 24–72 horas.",
      "Soporte por WhatsApp para garantía."
    ],
    rating: 5
  },
  {
    id: 4,
    badge: "",
    name: "TV 55” 4K UHD Smart",
    brand: "Hisense",
    category: "TVs y entretenimiento",
    sku: "TV-55-4K-SMART",
    price: 17995,
    gift: "Soporte de pared (promoción)",
    specs: {
      "Almacenamiento": { "Apps": "Sí", "Bluetooth": "Sí" },
      "Rendimiento": { "Resolución": "4K UHD", "Sistema": "Smart TV", "Panel": "LED" },
      "Potencia": { "Audio": "Dolby", "HDMI": "3" }
    },
    shipping: [
      "Entrega con cuidado especial.",
      "Se recomienda inspección al recibir.",
      "Garantía por fabricante."
    ],
    rating: 4
  }
];

function money(n){
  const s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `L${s}.00`;
}

function setWhatsAppLink(){
  const phone = "50400000000"; // <-- cambialo a tu número real
  const msg = encodeURIComponent("Hola, quiero información de un producto en CellZoneHN.");
  const url = `https://api.whatsapp.com/send/?phone=${phone}&text=${msg}`;
  $("#waFloat").href = url;
  $("#waBadge").textContent = String(state.cartCount);
}

/* -------- Router -------- */
function navigate(){
  const hash = location.hash || "#/";
  const app = $("#app");

  if(hash.startsWith("#/product/")){
    const id = parseInt(hash.split("/")[2], 10);
    const p = products.find(x => x.id === id);
    if(!p){
      app.innerHTML = notFound();
      return;
    }
    // track viewed
    if(!state.lastViewed.includes(id)){
      state.lastViewed.unshift(id);
      state.lastViewed = state.lastViewed.slice(0,8);
    }
    app.innerHTML = productPage(p);
    bindProductPage(p);
    return;
  }

  // Home
  app.innerHTML = homePage();
  bindHome();
}

/* -------- Views -------- */
function homePage(){
  const activeTab = state.tab;

  return `
    <section class="section">
      ${heroBlock()}
    </section>

    <section class="section">
      <div class="section__title">Tus Categorías<br/>Favoritas</div>

      <div class="categories">
        ${catCard("TRANSFORMA TU ENTRETENIMIENTO","cat", "#/")}
        ${catCard("TECNOLOGÍA QUE CONECTA TU VIDA","cat", "#/")}
        ${catCard("TECNOLOGÍA QUE TRANSFORMA TU HOGAR","cat cat--home", "#/")}
        ${catCard("LAPTOPS QUE VAN A TU RITMO","cat cat--laptops", "#/")}
      </div>
    </section>

    <section class="section">
      <div class="tabs" role="tablist" aria-label="Productos">
        <button class="tab ${activeTab==="favoritos"?"is-active":""}" data-tab="favoritos">Favoritos CellZoneHN</button>
        <button class="tab ${activeTab==="nuevos"?"is-active":""}" data-tab="nuevos">Nuevos Productos</button>
        <button class="tab ${activeTab==="vistos"?"is-active":""}" data-tab="vistos">Vistos Recientemente</button>
      </div>

      <div class="grid" id="productGrid">
        ${renderProductsForTab(activeTab)}
      </div>
    </section>

    <section class="section">
      ${newsletterBlock()}
    </section>

    <section class="section footer">
      ${footerBlock()}
    </section>
  `;
}

function heroBlock(){
  // tomo el producto 1 como destacado
  const p = products[0];

  return `
    <div class="hero">
      <div class="hero__inner">
        <div class="hero__badge">NUEVO</div>

        <div class="hero__grid">
          <div class="hero__card">
            <div class="hero__media">
              <div class="mock-phone"></div>
              <div class="mock-bubble">
                <div class="line"></div>
                <div class="line b"></div>
                <div class="line c"></div>
              </div>
            </div>

            <div class="hero__content">
              <div class="hero__h1">${escapeHtml(p.brand)} ${escapeHtml(p.name.split("/")[0])}</div>

              <div class="hero__price">
                <div>
                  <div class="p">Precio</div>
                  <div class="v">${money(p.price)}</div>
                </div>
                <div style="text-align:right">
                  <div class="p">Cuota</div>
                  <div class="v" style="color:var(--primary)">${"L869"}</div>
                </div>
              </div>

              <div class="hero__cta">
                <a class="btn btn--primary" href="#/product/${p.id}">
                  Ver más
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <path d="M9 18 15 12 9 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </a>
                <button class="btn btn--ghost" id="btnQuickAdd" data-id="${p.id}">
                  Agregar
                </button>
              </div>
            </div>
          </div>

          <div class="hero__card">
            <div class="hero__content">
              <div style="font-weight:900; font-size:14px; color:#334155; text-transform:uppercase; letter-spacing:.35px;">
                Ofertas destacadas
              </div>
              <div style="margin-top:10px; color:#64748b; line-height:1.35;">
                Diseño profesional tipo tienda grande, listo para que luego lo adaptemos a tu catálogo real, carrito y pagos.
              </div>

              <div style="margin-top:12px; display:grid; gap:10px;">
                <div style="border:1px solid rgba(2,6,23,.10); border-radius:16px; padding:12px; background:#fff;">
                  <div style="font-weight:900;">Envíos a todo Honduras</div>
                  <div style="color:#64748b; font-weight:700; font-size:13px; margin-top:4px;">
                    WhatsApp integrado + UI tipo Jetstereo
                  </div>
                </div>
                <div style="border:1px solid rgba(2,6,23,.10); border-radius:16px; padding:12px; background:#fff;">
                  <div style="font-weight:900;">Soporte y garantía</div>
                  <div style="color:#64748b; font-weight:700; font-size:13px; margin-top:4px;">
                    Sección de características + envío + evaluaciones
                  </div>
                </div>
              </div>

              <div style="margin-top:12px;">
                <a class="btn btn--primary" href="#/product/${p.id}" style="width:100%; border-radius:14px;">Ir al producto</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

function catCard(text, cls, href){
  return `
    <a class="${cls}" href="${href}">
      <div class="cat__label">${escapeHtml(text)}</div>
      <div class="cat__img"></div>
    </a>
  `;
}

function renderProductsForTab(tab){
  let list = [];

  if(tab === "favoritos"){
    list = products.filter(p => state.favorites.has(p.id));
  } else if(tab === "nuevos"){
    list = products.filter(p => (p.badge||"").toLowerCase().includes("nuevo"));
  } else if(tab === "vistos"){
    list = state.lastViewed.map(id => products.find(p => p.id === id)).filter(Boolean);
    if(list.length === 0) list = products.slice(0,2);
  }

  // aplicar búsqueda
  if(state.query.trim()){
    const q = state.query.trim().toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  return list.map(productCard).join("") || emptyState();
}

function productCard(p){
  const isNew = (p.badge||"").toLowerCase().includes("nuevo");
  const badge = p.badge ? `<div class="pill">${escapeHtml(p.badge)}</div>` : "";
  const imgClass = p.category.toLowerCase().includes("línea") ? "card__img alt" : "card__img";

  return `
    <article class="card" data-open="${p.id}">
      <div class="card__media">
        ${badge}
        <div class="${imgClass}"></div>
      </div>
      <div class="card__body">
        <div class="card__name">${escapeHtml(p.name)}</div>
        <div class="card__meta">${escapeHtml(p.category)}</div>
        <div class="card__price">${money(p.price)}</div>
        <div class="card__row">
          <span class="badge ${state.favorites.has(p.id) ? "badge--fav":""}">
            ${state.favorites.has(p.id) ? "Favoritos" : "Guardar"}
          </span>
          <span class="badge">${isNew ? "Nuevo" : "Ver"}</span>
        </div>
      </div>
    </article>
  `;
}

function emptyState(){
  return `
    <div style="grid-column:1/-1; padding:18px; text-align:center; color:#64748b; font-weight:800;">
      No hay resultados con ese filtro.
    </div>
  `;
}

function newsletterBlock(){
  return `
    <div class="newsletter">
      <h3>Suscríbete a nuestro boletín</h3>
      <p>
        Sé el primero en enterarte de las ofertas y descuentos que CellZoneHN tiene para ti.
      </p>
      <div class="nl__row">
        <input type="email" placeholder="Correo Electrónico" />
        <button>Suscribirme</button>
      </div>
      <small>
        Nos preocupamos por la protección de tus datos. Lee nuestra <a href="#/">Política de Privacidad</a>.
      </small>
    </div>
  `;
}

function footerBlock(){
  return `
    <div class="footer__grid">
      <div class="footer__box">
        <div class="footer__h">Síguenos</div>
        <div class="social">
          <a href="#/" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="currentColor" stroke-width="2"/>
              <path d="M17.5 6.5h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </a>
          <a href="#/" aria-label="TikTok">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M14 3v10.2a3.8 3.8 0 1 1-3-3.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M14 6c1.1 1.7 2.7 2.6 5 2.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </a>
          <a href="#/" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M14 9h3V6h-3c-2 0-3 1-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9c0-.7.3-1 1-1z" fill="currentColor"/>
            </svg>
          </a>
          <a href="#/" aria-label="X">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M7 17 17 7M7 7l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </a>
          <a href="#/" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M21 12s0-4-1-5-5-1-8-1-7 0-8 1-1 5-1 5 0 4 1 5 5 1 8 1 7 0 8-1 1-5 1-5z" stroke="currentColor" stroke-width="2"/>
              <path d="M10 9v6l6-3-6-3z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="footer__box">
        <div class="footer__h">Contáctanos</div>
        <p class="footer__p">
          Puedes contactarnos para consultas de servicio al cliente y asesoría llamando o escribiendo al:
        </p>
        <a class="footer__link" href="tel:+50400000000">PBX: +(504) 0000-0000</a>
        <br/>
        <a class="footer__link" href="#/">Formulario de Contacto</a>
        <br/>
        <a class="footer__link" href="#/" id="waFooterLink">WhatsApp</a>
      </div>

      <div class="footer__box">
        <div class="footer__h">CellZoneHN</div>
        <p class="footer__p">
          Tecnología y accesorios con estilo premium. Envíos a todo Honduras.
        </p>
        <a class="footer__link" href="#/">Términos y Condiciones</a>
        <br/>
        <a class="footer__link" href="#/">Política de Privacidad</a>
      </div>
    </div>

    <div class="copyright">
      Derechos Reservados © | <b>CellZoneHN</b> ${new Date().getFullYear()}
    </div>
  `;
}

function productPage(p){
  return `
    <section class="section">
      <a href="#/" class="btn btn--ghost" style="border-radius:14px;">
        ← Volver
      </a>
    </section>

    <section class="section pdp">
      <div class="pdp__gallery">
        <div class="pdp__heroimg">
          <div class="pdp__phone" id="pdpPhone"></div>
        </div>

        <div class="pdp__thumbs" id="pdpThumbs">
          ${[0,1,2,3].map((i)=>`
            <div class="thumb ${i===0?"is-active":""}" data-thumb="${i}"></div>
          `).join("")}
        </div>
      </div>

      <div class="pdp__info">
        <h1 class="pdp__title">${escapeHtml(p.name)}</h1>
        <a class="pdp__link" href="#/">Ver más productos ${escapeHtml(p.brand)}</a>
        <div class="pdp__sku">SKU: ${escapeHtml(p.sku)}</div>

        <div class="pdp__price">${money(p.price)}</div>

        <div class="pdp__actions">
          <button class="squarebtn" id="shareBtn" title="Compartir">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M12 16V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 7l5-4 5 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 13v7h14v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <button class="squarebtn" id="favBtn" title="Favorito">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path d="M12 21s-7-4.6-9.4-8.1C.8 9.8 2.4 6.5 5.9 5.7c1.6-.4 3.3.1 4.4 1.3 1.1-1.2 2.8-1.7 4.4-1.3 3.5.8 5.1 4.1 3.3 7.2C19 16.4 12 21 12 21z"
                    stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="gift">
          <div class="gift__side">REGALO</div>
          <div class="gift__body">
            <p class="gift__h">RECIBE GRATIS</p>
            <p class="gift__p">${escapeHtml(p.gift || "Regalo promocional")}</p>
          </div>
        </div>

        <div class="addcart">
          <button class="btn btn--primary" id="addToCartBtn">
            🛒 Agregar a carrito
          </button>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="pdpTabs">
        <button class="pdpTab is-active" data-pdptab="car">Características</button>
        <button class="pdpTab" data-pdptab="env">Información de Envío</button>
        <button class="pdpTab" data-pdptab="eva">Evaluaciones</button>
      </div>

      <div id="pdpTabContent">
        ${pdpCharacteristics(p)}
      </div>
    </section>
  `;
}

function pdpCharacteristics(p){
  const blocks = Object.entries(p.specs || {});
  return `
    <div class="specs">
      ${blocks.map(([title, rows]) => {
        const entries = Object.entries(rows);
        return `
          <div class="specs__block">
            <div class="specs__h">${escapeHtml(title)}</div>
            <table class="table">
              <tbody>
                ${entries.map(([k,v]) => `
                  <tr>
                    <th>${escapeHtml(k)}</th>
                    <td>${escapeHtml(v)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function pdpShipping(p){
  const items = p.shipping || [];
  return `
    <div class="specs">
      <div class="specs__block">
        <div class="specs__h">Información de envío</div>
        <div style="color:#334155; font-weight:700; line-height:1.5;">
          ${items.map(x => `• ${escapeHtml(x)}`).join("<br/>")}
        </div>
      </div>
    </div>
  `;
}

function pdpReviews(p){
  const stars = "★★★★★".slice(0, Math.max(0, Math.min(5, p.rating||0)));
  const empty = "☆☆☆☆☆".slice(0, 5 - Math.max(0, Math.min(5, p.rating||0)));
  return `
    <div class="specs">
      <div class="specs__block">
        <div class="specs__h">Evaluaciones</div>
        <div style="font-size:20px; color:#0f172a; font-weight:900;">
          ${stars}<span style="color:#cbd5e1">${empty}</span>
        </div>
        <div style="margin-top:8px; color:#64748b; font-weight:700;">
          (Demo) Luego conectamos esto a reseñas reales.
        </div>
      </div>
    </div>
  `;
}

function notFound(){
  return `
    <section class="section">
      <div class="hero" style="padding:16px;">
        <div class="section__title" style="margin:12px 0;">Página no encontrada</div>
        <div class="section__subtitle">Lo sentimos, la página que buscas no existe.</div>
        <a class="btn btn--primary" href="#/" style="width:100%; border-radius:14px;">Volver al inicio</a>
      </div>
    </section>
  `;
}

/* -------- Bindings -------- */
function bindHome(){
  // tabs
  $$(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.tab = btn.dataset.tab;
      navigate();
    });
  });

  // open product
  $$(".card").forEach(c=>{
    c.addEventListener("click", ()=>{
      const id = c.dataset.open;
      location.hash = `#/product/${id}`;
    });
  });

  // quick add from hero
  const qa = $("#btnQuickAdd");
  if(qa){
    qa.addEventListener("click", ()=>{
      state.cartCount++;
      setWhatsAppLink();
      toast("Agregado al carrito (demo).");
    });
  }

  // search binding
  const input = $("#searchInput");
  if(input){
    input.value = state.query;
    input.addEventListener("input", ()=>{
      state.query = input.value;
      // re-render grid only
      const grid = $("#productGrid");
      if(grid) grid.innerHTML = renderProductsForTab(state.tab);
      $$(".card").forEach(c=>{
        c.addEventListener("click", ()=> location.hash = `#/product/${c.dataset.open}`);
      });
    });
  }

  // footer whatsapp
  const waFooter = $("#waFooterLink");
  if(waFooter) waFooter.href = $("#waFloat").href;
}

function bindProductPage(p){
  // thumbs (solo efecto visual)
  $$(".thumb").forEach(t=>{
    t.addEventListener("click", ()=>{
      $$(".thumb").forEach(x=>x.classList.remove("is-active"));
      t.classList.add("is-active");
      // cambiar ligero mock color
      const phone = $("#pdpPhone");
      if(phone){
        const i = parseInt(t.dataset.thumb, 10);
        const gradients = [
          "linear-gradient(180deg,#111827,#0b1220)",
          "linear-gradient(180deg,#7c2d12,#3b0a00)",
          "linear-gradient(180deg,#334155,#0f172a)",
          "linear-gradient(180deg,#0f172a,#020617)"
        ];
        phone.style.background = gradients[i % gradients.length];
      }
    });
  });

  // fav toggle
  const favBtn = $("#favBtn");
  if(favBtn){
    favBtn.addEventListener("click", ()=>{
      if(state.favorites.has(p.id)) state.favorites.delete(p.id);
      else state.favorites.add(p.id);
      toast(state.favorites.has(p.id) ? "Guardado en favoritos." : "Quitado de favoritos.");
    });
  }

  // share
  const shareBtn = $("#shareBtn");
  if(shareBtn){
    shareBtn.addEventListener("click", async ()=>{
      const url = location.href;
      try{
        if(navigator.share){
          await navigator.share({ title: "CellZoneHN", text: p.name, url });
        } else {
          await navigator.clipboard.writeText(url);
          toast("Link copiado.");
        }
      }catch(e){
        // ignore
      }
    });
  }

  // add to cart
  const add = $("#addToCartBtn");
  if(add){
    add.addEventListener("click", ()=>{
      state.cartCount++;
      setWhatsAppLink();
      toast("Agregado al carrito (demo).");
    });
  }

  // pdp tabs
  $$(".pdpTab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".pdpTab").forEach(x=>x.classList.remove("is-active"));
      btn.classList.add("is-active");
      const key = btn.dataset.pdptab;
      const cont = $("#pdpTabContent");
      if(!cont) return;
      if(key === "car") cont.innerHTML = pdpCharacteristics(p);
      if(key === "env") cont.innerHTML = pdpShipping(p);
      if(key === "eva") cont.innerHTML = pdpReviews(p);
    });
  });
}

/* -------- Menu / Drawer -------- */
function bindDrawer(){
  const drawer = $("#drawer");
  const open = ()=> drawer.classList.add("is-open");
  const close = ()=> drawer.classList.remove("is-open");

  $("#btnMenu").addEventListener("click", open);
  $("#btnCloseDrawer").addEventListener("click", close);
  $("#drawerBackdrop").addEventListener("click", close);

  // close on link click
  $$(".drawer__link").forEach(a => a.addEventListener("click", close));
}

/* -------- Helpers -------- */
function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

let toastTimer;
function toast(msg){
  clearTimeout(toastTimer);
  let el = $("#toast");
  if(!el){
    el = document.createElement("div");
    el.id = "toast";
    el.style.position = "fixed";
    el.style.left = "50%";
    el.style.bottom = "calc(92px + env(safe-area-inset-bottom))";
    el.style.transform = "translateX(-50%)";
    el.style.padding = "12px 14px";
    el.style.borderRadius = "14px";
    el.style.background = "rgba(15,23,42,.92)";
    el.style.color = "#fff";
    el.style.fontWeight = "800";
    el.style.fontSize = "13px";
    el.style.boxShadow = "0 16px 30px rgba(2,6,23,.25)";
    el.style.zIndex = "120";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = "1";
  toastTimer = setTimeout(()=>{ el.style.opacity="0"; }, 1700);
}

/* -------- Global bindings -------- */
function bindSearchButton(){
  $("#btnSearch").addEventListener("click", ()=>{
    toast("Buscando... (demo)");
  });
}

function init(){
  setWhatsAppLink();
  bindDrawer();
  bindSearchButton();
  window.addEventListener("hashchange", navigate);

  // keep query synced even on product page
  $("#searchInput").addEventListener("input", (e)=>{
    state.query = e.target.value;
  });

  navigate();
}

init();
