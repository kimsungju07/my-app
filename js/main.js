// 외부 라이브러리 없이 동작하는 프로필 사이트 스크립트
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    }
    [].concat(children).forEach((c) => c && node.append(c));
    return node;
  };

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 데이터 바인딩 ---------- */
  function bindText() {
    $$("[data-bind]").forEach((node) => {
      const key = node.dataset.bind;
      if (PROFILE[key] != null) node.textContent = PROFILE[key];
    });
    $("#year").textContent = new Date().getFullYear();
  }

  function renderAbout() {
    PROFILE.about.forEach((p) => $("#aboutText").append(el("p", { text: p })));
    PROFILE.facts.forEach((f) =>
      $("#aboutFacts").append(
        el("li", {}, [el("span", { text: f.label }), el("strong", { text: f.value })])
      )
    );
  }

  function renderSkills() {
    const grid = $("#skills-grid");
    PROFILE.skills.forEach((s) => {
      const tags = el("ul", { class: "tags" }, s.items.map((i) => el("li", { text: i })));
      grid.append(
        el("article", { class: "card skill reveal" }, [
          el("h3", {}, [el("span", { class: "skill__icon", text: s.icon }), s.group]),
          tags,
        ])
      );
    });
  }

  /* ---------- 프로젝트 + 필터 ---------- */
  function renderProjects() {
    const grid = $("#projects-grid");
    PROFILE.projects.forEach((p) => {
      const links = el("div", { class: "project__links" });
      if (p.github) links.append(el("a", { href: p.github, target: "_blank", rel: "noopener", text: "GitHub ↗" }));
      if (p.demo) links.append(el("a", { href: p.demo, target: "_blank", rel: "noopener", text: "Demo ↗" }));

      grid.append(
        el("article", { class: "card project reveal", "data-category": p.category }, [
          el("span", { class: "project__cat", text: p.category }),
          el("h3", { text: p.title }),
          el("p", { text: p.desc }),
          el("ul", { class: "tags tags--sm" }, p.stack.map((t) => el("li", { text: t }))),
          links,
        ])
      );
    });

    const categories = ["All", ...new Set(PROFILE.projects.map((p) => p.category))];
    const filters = $("#filters");
    categories.forEach((c, i) => {
      filters.append(
        el("button", {
          class: "filter" + (i === 0 ? " is-active" : ""),
          type: "button",
          role: "tab",
          "aria-selected": i === 0 ? "true" : "false",
          "data-filter": c,
          text: c,
        })
      );
    });

    filters.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter");
      if (!btn) return;
      $$(".filter", filters).forEach((b) => {
        const active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active);
      });
      const f = btn.dataset.filter;
      $$(".project", grid).forEach((card) => {
        card.hidden = !(f === "All" || card.dataset.category === f);
      });
    });
  }

  function renderSocials() {
    PROFILE.socials.forEach((s) =>
      $("#socials").append(
        el("li", {}, [el("a", { href: s.url, target: "_blank", rel: "noopener", text: s.label + " ↗" })])
      )
    );
  }

  /* ---------- 타이핑 효과 ---------- */
  function typingEffect() {
    const target = $("#typing");
    const roles = PROFILE.roles;
    if (prefersReducedMotion) {
      target.textContent = roles[0];
      return;
    }
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;

    (function tick() {
      const word = roles[roleIdx];
      charIdx += deleting ? -1 : 1;
      target.textContent = word.slice(0, charIdx);

      let delay = deleting ? 40 : 90;
      if (!deleting && charIdx === word.length) {
        deleting = true;
        delay = 1600;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 300;
      }
      setTimeout(tick, delay);
    })();
  }

  /* ---------- 터미널 애니메이션 ---------- */
  function terminalEffect() {
    const term = $("#terminal");
    const lines = PROFILE.terminal;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const writeLine = (line) => {
      const row = el("div", { class: "t-" + line.type });
      if (line.type === "cmd") row.append(el("span", { class: "t-prompt", text: "❯ " }));
      const text = el("span");
      row.append(text);
      term.append(row);
      return text;
    };

    if (prefersReducedMotion) {
      lines.forEach((l) => (writeLine(l).textContent = l.text));
      return;
    }

    (async function run() {
      for (const line of lines) {
        const node = writeLine(line);
        if (line.type === "cmd") {
          for (const ch of line.text) {
            node.textContent += ch;
            await sleep(55);
          }
          await sleep(350);
        } else {
          node.textContent = line.text;
          await sleep(600);
        }
      }
      term.append(el("span", { class: "caret", text: "▌" }));
    })();
  }

  /* ---------- 테마 ---------- */
  function initTheme() {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    const current = () => root.getAttribute("data-theme") || (systemDark.matches ? "dark" : "light");

    $("#themeToggle").addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ---------- 내비게이션 ---------- */
  function initNav() {
    const header = $("#header");
    const nav = $("#nav");
    const menuBtn = $("#menuToggle");
    const toTop = $("#toTop");

    const closeMenu = () => {
      nav.classList.remove("is-open");
      menuBtn.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    };

    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuBtn.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", (e) => e.target.closest("a") && closeMenu());

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          header.classList.toggle("is-scrolled", y > 10);
          toTop.classList.toggle("is-visible", y > 600);
          ticking = false;
        });
      },
      { passive: true }
    );

    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    // 현재 보고 있는 섹션의 메뉴 강조
    const links = $$(".nav__link");
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    $$("main section[id]").forEach((s) => spy.observe(s));
  }

  /* ---------- 스크롤 등장 애니메이션 ---------- */
  function initReveal() {
    const items = $$(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((i, idx) => {
      i.style.transitionDelay = (idx % 4) * 70 + "ms";
      io.observe(i);
    });
  }

  /* ---------- 토스트 ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2200);
  }

  /* ---------- 연락처 ---------- */
  function initContact() {
    $("#copyEmail").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(PROFILE.email);
        toast("이메일이 복사되었습니다 ✓");
      } catch (e) {
        toast(PROFILE.email);
      }
    });

    const form = $("#contactForm");
    const error = $("#formError");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

      if (!data.name.trim() || !data.message.trim()) {
        error.textContent = "이름과 메시지를 입력해주세요.";
        return;
      }
      if (!emailOk) {
        error.textContent = "올바른 이메일 주소를 입력해주세요.";
        return;
      }
      error.textContent = "";

      // 백엔드 없이 메일 클라이언트로 전달. 서버가 생기면 fetch("/api/contact", ...)로 교체하세요.
      const subject = encodeURIComponent(`[Profile] ${data.name}님의 메시지`);
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
      window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
      toast("메일 앱을 여는 중입니다…");
      form.reset();
    });
  }

  /* ---------- 시작 ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    bindText();
    renderAbout();
    renderSkills();
    renderProjects();
    renderSocials();
    initTheme();
    initNav();
    initReveal();
    initContact();
    typingEffect();
    terminalEffect();
  });
})();
