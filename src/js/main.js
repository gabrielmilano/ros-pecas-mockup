/* Rospeças — interações (funciona sem GSAP; motion.js só enfeita) */
(() => {
  const WA = "5548996421611";
  const wa = (txt) => `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.RP = { reduz };

  // Links de WhatsApp com mensagem pronta
  $$("[data-wa]").forEach((a) => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });

  // Relógio da central
  const relogio = $("[data-relogio]");
  const hora = () => { if (relogio) relogio.textContent = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); };
  hora(); setInterval(hora, 30000);

  // Se o GSAP não carregar, nada fica escondido
  setTimeout(() => { if (!window.gsap) document.documentElement.classList.remove("js-motion"); }, 4000);

  /* ---------- Carros atendidos (posts reais do Instagram) ---------- */
  const POSTS = [
    { img: "post-01", marca: "Volkswagen", modelo: "Voyage", servico: "Central Android 9\"", data: "16/10", url: "DekSRr2RbF8" },
    { img: "post-02", marca: "Renault", modelo: "Clio", servico: "Película", data: "16/10", url: "Dej7vaOxKCc" },
    { img: "post-03", marca: "Volkswagen", modelo: "Voyage", servico: "Remoção e aplicação de película", data: "15/10", url: "DehYfwXRdgJ" },
    { img: "post-04", marca: "Honda", modelo: "CR-V", servico: "Central 9\"", data: "14/10", url: "Deff4poRqwR" },
    { img: "post-05", marca: "Nissan", modelo: "Tiida", servico: "Central 7\"", data: "14/10", url: "DeffNl8x5ec" },
    { img: "post-06", marca: "Honda", modelo: "HR-V", servico: "Central multimídia", data: "14/10", url: "DeeugHnu9Ur" },
    { img: "post-07", marca: "Honda", modelo: "HR-V", servico: "Central Android", data: "14/10", url: "DeefsSLu7Q6" },
    { img: "post-08", marca: "Kia", modelo: "Sportage", servico: "Central Android 9\"", data: "13/10", url: "DecvrAoO-sM" },
    { img: "post-09", marca: "Kia", modelo: "Sportage", servico: "Central multimídia", data: "13/10", url: "DecWSNsx6bG" },
    { img: "post-10", marca: "Ford", modelo: "Fiesta", servico: "Farol máscara negra", data: "12/10", url: "DeZWmLkOFmN" },
    { img: "post-11", marca: "Kia", modelo: "Cerato", servico: "Central 9\"", data: "10/10", url: "DeUe4p_uZ3l" },
    { img: "post-12", marca: "Kia", modelo: "Cerato", servico: "Central multimídia", data: "10/10", url: "DeUFtOgxrIl" },
  ];
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
  const lista = $("[data-reels]");
  if (lista) {
    lista.innerHTML = POSTS.map((p) => `
      <li class="reel" data-marca="${p.marca}" data-chave="${norm(p.marca + p.modelo + p.servico)}">
        <a href="https://www.instagram.com/rospecas_criciuma/reel/${p.url}/" target="_blank" rel="noopener" aria-label="${p.servico} — ${p.marca} ${p.modelo} (abre o vídeo no Instagram)">
          <img src="src/img/posts/${p.img}.webp" alt="" width="360" height="640" loading="lazy">
          <span class="reel__carro"><b>${p.marca === "Volkswagen" ? "VW" : p.marca} ${p.modelo}</b><span>${p.data}</span></span>
          <span class="reel__play"></span>
        </a>
      </li>`).join("");
  }
  const vazio = $("[data-vazio]");
  const busca = $("[data-busca]");
  let marcaAtual = "todas";
  function filtrar() {
    const itens = $$(".reel", lista);
    const termo = norm(busca?.value || "");
    const F = window.Flip && !reduz ? window.Flip : null;
    const estado = F ? F.getState(itens) : null;
    let visiveis = 0;
    itens.forEach((li) => {
      const ok = (marcaAtual === "todas" || li.dataset.marca === marcaAtual) && (!termo || li.dataset.chave.includes(termo));
      li.hidden = !ok; if (ok) visiveis++;
    });
    vazio.hidden = visiveis > 0;
    if (!visiveis) $("[data-wa-vazio]").href = wa(`Oi! Vocês já fizeram serviço em ${busca.value || "meu carro"}? Queria um orçamento.`);
    if (F) F.from(estado, { duration: .55, ease: "power2.inOut", scale: true, onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: .85 }, { opacity: 1, scale: 1, duration: .45 }) });
  }
  $$("[data-filtros] button").forEach((b) => b.addEventListener("click", () => {
    marcaAtual = b.dataset.marca;
    $$("[data-filtros] button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    filtrar();
  }));
  let espera; busca?.addEventListener("input", () => { clearTimeout(espera); espera = setTimeout(filtrar, 160); });

  /* ---------- Simulador de película ---------- */
  const faixa = $("[data-faixa]");
  const selo = $("[data-selo]");
  const nomes = { traseiro: "traseiros", dianteiro: "dianteiros", parabrisa: "do para-brisa" };
  let tom = 20;
  function vidroAtual() { return ($("input[name=vidro]:checked") || {}).value || "traseiro"; }
  function setTom(t, deUsuario) {
    tom = Math.round(t);
    const vidro = vidroAtual();
    const escuro = (1 - tom / 100) * .96;
    $$("[data-vidro]").forEach((r) => {
      const alvo = r.dataset.vidro === vidro || (vidro === "parabrisa" && r.dataset.vidro === "dianteiro");
      r.style.opacity = alvo ? escuro : .14;
    });
    const tinta = $("[data-tinta]"); if (tinta) tinta.style.opacity = escuro;
    const nomeVidro = $("[data-vidro-nome]"); if (nomeVidro) nomeVidro.textContent = { traseiro: "vidros traseiros", dianteiro: "vidros dianteiros", parabrisa: "para-brisa" }[vidro];
    if (faixa && deUsuario !== "faixa") faixa.value = tom;
    $$("[data-tom]").forEach((b) => b.setAttribute("aria-checked", String(+b.dataset.tom === tom)));
    $("[data-leitura-g]").textContent = "G" + tom;
    $("[data-leitura-txt]").textContent = `${tom}% da luz passa`;
    const minimo = vidro === "parabrisa" ? 75 : vidro === "dianteiro" ? 70 : 0;
    let estado = "ok", msg;
    if (!minimo) msg = "✓ Tom liberado nos vidros traseiros (com os dois retrovisores externos).";
    else if (tom < minimo) { estado = "fora"; msg = `✕ Escuro demais ${vidro === "parabrisa" ? "para o para-brisa" : "para os vidros da frente"}: o mínimo é ${minimo}%.`; }
    else { estado = "alerta"; msg = `No limite: somando com o vidro original, pode ficar abaixo de ${minimo}%. A gente mede antes de aplicar.`; }
    selo.textContent = msg; selo.dataset.estado = estado;
    $("[data-wa-pelicula]").href = wa(`Oi! Vi o simulador no site e quero orçamento de película G${tom} nos vidros ${nomes[vidro]}. Meu carro é: `);
  }
  window.RP.setTom = setTom;
  window.RP.usouSimulador = false;
  const marcar = () => { window.RP.usouSimulador = true; };
  faixa?.addEventListener("input", () => { marcar(); setTom(+faixa.value, "faixa"); });
  $$("[data-tom]").forEach((b) => b.addEventListener("click", () => { marcar(); setTom(+b.dataset.tom); }));
  $$("input[name=vidro]").forEach((r) => r.addEventListener("change", () => { marcar(); setTom(tom); }));
  $("[data-wa-pelicula]") && ($("[data-wa-pelicula]").target = "_blank");
  if (selo) setTom(20);

  /* ---------- Orçamento em 3 toques ---------- */
  const form = $("[data-form]");
  const previa = $("[data-previa]");
  function mensagem() {
    const fd = new FormData(form);
    const nome = (fd.get("nome") || "").trim();
    const carro = (fd.get("carro") || "").trim();
    const servs = fd.getAll("servico");
    const lista = servs.length ? servs.join(", ").replace(/, ([^,]*)$/, " e $1") : "[escolha o serviço]";
    return `Oi${nome ? ", sou " + nome : ""}! Vim pelo site da Rospeças.\nQueria orçamento de ${lista} para o meu ${carro || "[modelo do carro]"}.`;
  }
  if (form) {
    const atualiza = () => { previa.textContent = mensagem(); };
    form.addEventListener("input", atualiza); atualiza();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.carro.value.trim()) { form.carro.focus(); form.carro.setCustomValidity("Conta pra gente qual é o carro"); form.carro.reportValidity(); return; }
      window.open(wa(mensagem()), "_blank", "noopener");
    });
    form.carro.addEventListener("input", () => form.carro.setCustomValidity(""));
  }

  /* ---------- Botão fixo do WhatsApp some perto do formulário ---------- */
  const fixo = $(".wa-fixo");
  if (fixo && "IntersectionObserver" in window) {
    const vistos = new Set();
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => en.isIntersecting ? vistos.add(en.target) : vistos.delete(en.target));
      vistos.size ? fixo.setAttribute("data-oculto", "") : fixo.removeAttribute("data-oculto");
    }, { threshold: .15 });
    ["#orcamento", ".rodape", ".heroi__acoes"].forEach((s) => $(s) && io.observe($(s)));
  }
})();
