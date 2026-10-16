/* Rospeças — movimento (GSAP). Com "reduzir movimento": só fades, sem deslocamentos grandes. */
(() => {
  if (!window.gsap) return;
  const { gsap } = window;
  const reduz = window.RP?.reduz;
  gsap.registerPlugin(window.ScrollTrigger, window.Flip);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const mov = (v) => (reduz ? 0 : v);

  /* 1. Entrada: a central liga com a logo e o texto sobe linha a linha */
  $$("[data-titulo] .linha").forEach((l) => { l.innerHTML = `<span class="linha__in">${l.innerHTML}</span>`; });
  const barra = $("[data-barra]");
  const boot = $("[data-boot]");
  const home = $("[data-home]");
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl.from("[data-painel] .painel__corpo", { opacity: 0, y: mov(70), rotateX: mov(16), duration: 1.1 }, 0)
    .from("[data-titulo] .linha__in", { yPercent: mov(110), opacity: reduz ? 0 : 1, duration: .9, stagger: .1 }, .1)
    .from("[data-entra]", { opacity: 0, y: mov(18), duration: .7, stagger: .08 }, .35)
    .from(".logo--boot", { opacity: 0, scale: reduz ? 1 : .86, duration: .6 }, .5)
    .to(barra, { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, .8)
    .to(boot, { opacity: 0, duration: .45 }, 2)
    .set(boot, { display: "none" })
    .from($$(".tela__status, .widget-mapa, .tela__tocando", home), { opacity: 0, y: mov(14), duration: .5, stagger: .08 }, 2.1)
    .from($$("[data-app]", home), { opacity: 0, scale: reduz ? 1 : .5, duration: .5, stagger: .045, ease: "back.out(2)" }, 2.2)
    .from(".painel__legenda", { opacity: 0, duration: .5 }, 2.7);

  // contador
  $$("[data-conta]").forEach((el) => {
    const o = { v: 0 }, fim = +el.dataset.conta;
    gsap.to(o, { v: fim, duration: 1.6, ease: "power2.out", delay: .6, onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString("pt-BR"); } });
  });

  // inclinação do painel acompanhando o mouse
  const corpo = $("[data-painel] .painel__corpo");
  if (!reduz && corpo && matchMedia("(hover:hover) and (min-width:1081px)").matches) {
    const rx = gsap.quickTo(corpo, "rotateX", { duration: .8, ease: "power3" });
    const ry = gsap.quickTo(corpo, "rotateY", { duration: .8, ease: "power3" });
    $(".heroi").addEventListener("pointermove", (e) => {
      const r = corpo.getBoundingClientRect();
      ry(((e.clientX - (r.left + r.width / 2)) / innerWidth) * 10);
      rx(-((e.clientY - (r.top + r.height / 2)) / innerHeight) * 7);
    });
    $(".heroi").addEventListener("pointerleave", () => { rx(0); ry(0); });
  }

  /* 2. Faixa de marcas: corre sozinha e acelera com a rolagem */
  const trilho = $("[data-trilho]");
  if (trilho && !reduz) {
    trilho.innerHTML += trilho.innerHTML;
    const corre = gsap.to(trilho, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
    ScrollTrigger.create({
      onUpdate: (st) => {
        const v = Math.min(Math.abs(st.getVelocity()) / 400, 5);
        gsap.to(corre, { timeScale: (st.direction < 0 ? -1 : 1) * (1 + v), duration: .25, overwrite: true });
        gsap.to(corre, { timeScale: st.direction < 0 ? -1 : 1, duration: 1.2, delay: .25 });
      },
    });
  }

  /* 3. Revelações ao rolar */
  ScrollTrigger.batch("[data-revela]", {
    start: "top 86%",
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: .8, stagger: .12, ease: "power3.out", overwrite: true }),
  });

  // fotos da central com leve parallax dentro do card
  if (!reduz) $$(".servico__fotos img").forEach((img, i) => {
    gsap.fromTo(img, { yPercent: i ? -6 : 6 }, { yPercent: i ? 6 : -6, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* 4. Simulador: ao chegar, o vidro escurece sozinho (G70 → G20) */
  ScrollTrigger.create({
    trigger: "#pelicula", start: "top 55%", once: true,
    onEnter: () => {
      if (window.RP?.usouSimulador || !window.RP?.setTom) return;
      const o = { t: 70 };
      gsap.to(o, { t: 20, duration: 1.8, ease: "power2.inOut", onUpdate: () => { if (!window.RP.usouSimulador) window.RP.setTom(o.t); } });
    },
  });

  /* 5. Fachada: o letreiro "acende" letra por letra */
  const letreiro = $(".fachada__letreiro");
  if (letreiro) {
    $$(".logo__ros, .logo__pecas", letreiro).forEach((p) => { p.innerHTML = [...p.textContent].map((c) => `<span class="letra">${c}</span>`).join(""); });
    gsap.from($$(".letra", letreiro), {
      opacity: .12, duration: .25, stagger: .07, ease: "steps(2)",
      scrollTrigger: { trigger: ".fachada", start: "top 70%", once: true },
    });
    if (!reduz) gsap.fromTo(".fachada__parede", { yPercent: 4 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: ".fachada", start: "top bottom", end: "bottom top", scrub: true } });
  }

  /* 6. Marca gigante do rodapé */
  gsap.from(".rodape__marca", { opacity: 0, y: mov(60), duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".rodape", start: "top 85%", once: true } });
})();
