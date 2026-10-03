// The margins in the scans were not trimmed.
document.documentElement.dataset.ready = "true";
console.info("nothing is hidden.");

const turnStage = document.querySelector(".turn-stage");
if (turnStage) {
  const sheet = turnStage.querySelector(".turn-sheet");
  const faces = [...turnStage.querySelectorAll(".turn-face")];
  let flipped = false;
  let typed = "";

  const turnPage = () => {
    flipped = !flipped;
    sheet.classList.toggle("is-flipped", flipped);
    faces[0].setAttribute("aria-hidden", String(flipped));
    faces[1].setAttribute("aria-hidden", String(!flipped));
    faces.forEach((face, index) => {
      const control = face.querySelector(".turn-control");
      control.setAttribute("aria-expanded", String(index === 0 ? flipped : !flipped));
      control.tabIndex = (index === 0) === !flipped ? 0 : -1;
    });
    faces[flipped ? 1 : 0].querySelector(".turn-control").focus({ preventScroll: true });
  };

  turnStage.querySelectorAll(".turn-control").forEach(control => control.addEventListener("click", turnPage));

  // The paper responds to the same verb as its corner mark.
  document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length !== 1) {
      typed = "";
      return;
    }
    typed = (typed + event.key.toLowerCase()).slice(-4);
    if (typed === "turn") {
      turnPage();
      typed = "";
    }
  });
}

const proceed = document.querySelector(".void-proceed");
if (proceed) {
  const codeForm = document.querySelector(".void-code-form");
  const codeField = document.querySelector(".void-code");
  const logLink = document.querySelector(".void-log-link");
  proceed.addEventListener("click", () => {
    proceed.hidden = true;
    codeForm.hidden = false;
    logLink.hidden = false;
    proceed.setAttribute("aria-expanded", "true");
    codeField.focus();
  });

  codeForm.addEventListener("submit", event => {
    event.preventDefault();
    const code = codeField.value.trim().toLowerCase();
    if (!/^[a-z0-9-]{1,16}$/.test(code)) return;
    window.location.href = `../codes/${encodeURIComponent(code)}.html`;
  });
}

document.querySelectorAll(".book[data-page]").forEach(book => {
  book.addEventListener("click", () => {
    const selected = book.dataset.page;
    document.querySelectorAll(".book[data-page]").forEach(other => {
      const active = other === book;
      other.setAttribute("aria-pressed", String(active));
      other.classList.toggle("is-selected", active);
    });
    document.querySelectorAll(".book-page").forEach(page => {
      page.hidden = page.id !== selected;
    });
  });
});

// Reference numbers open separately filed sheets. The site only routes the text entered.
document.querySelectorAll("[data-document-code-form]").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();
    const code = new FormData(form).get("code").toString().trim().toLowerCase();
    if (!/^[a-z0-9-]{1,16}$/.test(code)) return;
    window.location.href = `../records/${encodeURIComponent(code)}.html`;
  });
});
