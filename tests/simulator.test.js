import test from "node:test";
import vm from "node:vm";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { CoulombPhysics } from "../Assets/Js/Physics.js";

const html = readFileSync(new URL("../Index.html", import.meta.url), "utf8");

test("Coulomb: ejemplo, repulsión, carga cero y relaciones físicas", () => {
  const p = new CoulombPhysics("2e-6", "-3e-6", ".5");
  assert.equal(p.FuerzaBase.Magnitud, 0.2157);
  assert.equal(p.FuerzaBase.Tipo, "Atraccion.");
  for (const property of [
    "CumpleCuartaParte",
    "CumpleDobleFuerza",
    "CumpleInvertirFuerza",
    "CumpleAmbasCargas",
  ])
    assert.equal(p[property], true);
  assert.equal(
    new CoulombPhysics(2e-6, 3e-6, 0.5).FuerzaBase.Tipo,
    "Repulsion.",
  );
  assert.equal(new CoulombPhysics(0, 3, 1).FuerzaBase.Tipo, "Nula.");
  p.actualizarValores(1e-6, 1e-6, 1);
  assert.ok(Math.abs(p.FuerzaBase.Magnitud - 0.0089875) < 1e-15);
});

test("rechaza entradas ausentes, parciales, no finitas y distancias inválidas", () => {
  for (const value of [
    "",
    "  ",
    "abc",
    "2abc",
    NaN,
    Infinity,
    -Infinity,
    null,
    false,
  ]) {
    assert.throws(() => new CoulombPhysics(value, 1, 1));
    assert.throws(() => new CoulombPhysics(1, value, 1));
    assert.throws(() => new CoulombPhysics(1, 1, value));
  }
  for (const value of [0, -1])
    assert.throws(() => new CoulombPhysics(1, 1, value));
  for (const args of [
    [1e308, 1, 1],
    [1, 1, 1e-200],
    [1e-200, 1e-200, 1e-150],
  ])
    assert.throws(() => new CoulombPhysics(...args), /rango numérico/);
});

test("todos los recursos locales del HTML están disponibles", () => {
  for (const [, path] of html.matchAll(/(?:src|href)="(Assets\/[^"?#]+)"/g))
    assert.ok(existsSync(new URL("../" + path, import.meta.url)), path);
});

test("formulario real: resultados, indicadores, errores, recuperación y animaciones", async () => {
  const elements = new Map(
    [...html.matchAll(/<[a-z0-9]+\b[^>]*\bid="([^"]+)"[^>]*>/gi)].map((m) => [
      m[1],
      {
        value: m[0].match(/\bvalue="([^"]*)"/)?.[1],
        textContent: "",
        className: m[0].match(/\bclass="([^"]*)"/)?.[1] ?? "",
        style: {},
        hidden: true,
        children: [],
        append(...children) {
          this.children.push(...children);
        },
        appendChild(child) {
          this.children.push(child);
          return child;
        },
        replaceChildren(...children) {
          this.children = children;
        },
        setAttribute(name, value) {
          this[name] = value;
        },
        classList: {
          add(...classes) {
            const current = new Set(
              this.element.className.split(/\s+/).filter(Boolean),
            );
            for (const name of classes) current.add(name);
            this.element.className = [...current].join(" ");
          },
          remove(...classes) {
            const removed = new Set(classes);
            this.element.className = this.element.className
              .split(/\s+/)
              .filter((name) => name && !removed.has(name))
              .join(" ");
          },
          element: null,
        },
        addEventListener(event, fn) {
          this[event] = fn;
        },
      },
    ]),
  );
  for (const element of elements.values()) element.classList.element = element;
  const calls = [];
  let reversiones = 0;
  const anime = {
    animate(target, options) {
      calls.push({ target, ...options });
      return {
        revert() {
          reversiones++;
        },
      };
    },
  };
  globalThis.anime = anime;
  globalThis.document = {
    getElementById(id) {
      assert.ok(elements.has(id), `ID inexistente: ${id}`);
      return elements.get(id);
    },
    createElement(tagName) {
      return {
        tagName,
        textContent: "",
        className: "",
        children: [],
        append(...children) {
          this.children.push(...children);
        },
        appendChild(child) {
          this.children.push(child);
          return child;
        },
        setAttribute(name, value) {
          this[name] = value;
        },
      };
    },
    addEventListener(event, fn) {
      assert.equal(event, "DOMContentLoaded");
      fn();
    },
  };
  try {
    await import("../Assets/Js/UI.js");
    const el = (id) => elements.get(id);
    const submit = () => {
      let prevented = false;
      el("formSimulador").submit({
        preventDefault() {
          prevented = true;
        },
      });
      assert.ok(prevented);
    };
    submit();
    assert.equal(el("forceResult").textContent, "0.2157 N.");
    assert.equal(el("txtTipoInteraccion").textContent, "Atraccion.");
    assert.equal(el("resultadoCuartaParte").textContent, "0.0539 N.");
    assert.equal(el("resultadoDobleCarga").textContent, "0.4314 N.");
    assert.equal(el("resultadoInvertirSigno").textContent, "Repulsion.");
    assert.equal(el("resultadoAccionReaccion").textContent, "0.2157 N.");
    assert.equal(el("btnHistorial").textContent.trim(), "");
    assert.equal(el("listaHistorial").children.length, 1);
    const textoNodo = (nodo) =>
      nodo.textContent + nodo.children.map(textoNodo).join(" ");
    const primerRegistro = el("listaHistorial").children[0];
    const tablaHistorial = primerRegistro.children[0];
    assert.equal(tablaHistorial.tagName, "table");
    const filasHistorial = tablaHistorial.children[0].children;
    assert.equal(filasHistorial.length, 2);
    assert.equal(filasHistorial[0].children.length, 2);
    assert.equal(filasHistorial[1].children.length, 2);
    assert.match(
      textoNodo(primerRegistro),
      /q₁.*2\.00e-6 C.*q₂.*-3\.00e-6 C.*Distancia.*5\.00e-1 m.*Fuerza.*2\.16e-1 N/,
    );
    assert.ok(primerRegistro.className.includes("bg-white"));
    el("btnAyuda").click();
    assert.equal(el("panelAyuda").hidden, false);
    assert.equal(el("btnAyuda")["aria-expanded"], "true");
    el("btnHistorial").click();
    assert.equal(el("panelAyuda").hidden, true);
    assert.equal(el("panelHistorial").hidden, false);
    el("btnHistorial").click();
    assert.equal(el("panelHistorial").hidden, true);
    assert.equal(el("btnAyuda")["aria-label"], "Mostrar ayuda");
    el("btnHistorial").click();
    assert.equal(el("panelHistorial").hidden, false);
    assert.equal(el("btnHistorial")["aria-expanded"], "true");
    assert.equal(el("btnHistorial")["aria-label"], "Ocultar historial");
    el("btnHistorial").click();
    assert.equal(el("panelHistorial").hidden, true);
    assert.equal(el("btnHistorial")["aria-label"], "Mostrar historial");
    assert.ok(el("particula1").className.includes("bg-primary"));
    assert.ok(el("particula2").className.includes("bg-danger"));
    for (const id of [
      "chkCuartaParte",
      "chkDobleCarga",
      "chkInvertirSigno",
      "chkAccionReaccion",
    ])
      assert.equal(el(id).textContent, "Cumple ✓");
    assert.deepEqual(
      calls.splice(0).map((c) => c.translateX),
      [
        [0, 20],
        [0, -20],
      ],
    );
    el("carga2").value = "3e-6";
    submit();
    assert.equal(el("txtTipo").textContent, "Repulsion.");
    assert.equal(el("resultadoInvertirSigno").textContent, "Atraccion.");
    assert.ok(el("listaHistorial").children[0].className.includes("bg-white"));
    assert.ok(el("listaHistorial").children[1].className.includes("bg-light"));
    assert.ok(el("particula1").className.includes("bg-primary"));
    assert.ok(el("particula2").className.includes("bg-primary"));
    assert.deepEqual(
      calls.splice(0).map((c) => c.translateX),
      [
        [0, -30],
        [0, 30],
      ],
    );
    el("carga1").value = "-2e-6";
    submit();
    assert.ok(el("particula1").className.includes("bg-danger"));
    assert.ok(el("particula2").className.includes("bg-primary"));
    calls.splice(0);
    el("carga1").value = "0";
    submit();
    assert.equal(el("forceResult").textContent, "0 N.");
    for (const id of [
      "resultadoCuartaParte",
      "resultadoDobleCarga",
      "resultadoAccionReaccion",
    ])
      assert.equal(el(id).textContent, "0 N.");
    assert.equal(el("resultadoInvertirSigno").textContent, "Nula.");
    assert.ok(el("particula1").className.includes("bg-secondary"));
    assert.ok(el("particula2").className.includes("bg-primary"));
    assert.equal(el("chkInvertirSigno").textContent, "No aplica (carga cero)");
    assert.equal(calls.length, 0);
    assert.equal(reversiones, 6);
    assert.equal(el("particula1").style.transform, "translateX(0px)");
    for (const [id, value] of [
      ["carga1", ""],
      ["distancia", "0"],
      ["distancia", "-1"],
      ["distancia", ""],
      ["carga1", "1e308"],
    ]) {
      el("carga1").value = "2e-6";
      el("carga2").value = "1";
      el("distancia").value = "1";
      el(id).value = value;
      submit();
      assert.equal(el("errorSimulacion").hidden, false);
      assert.ok(el("errorSimulacion").textContent);
      assert.equal(el("forceResult").textContent, "—");
      for (const id of [
        "resultadoCuartaParte",
        "resultadoDobleCarga",
        "resultadoInvertirSigno",
        "resultadoAccionReaccion",
      ])
        assert.equal(el(id).textContent, "—");
      assert.equal(el("chkCuartaParte").textContent, "Pendiente");
      assert.ok(el("particula1").className.includes("bg-secondary"));
      assert.ok(el("particula2").className.includes("bg-secondary"));
    }
    el("carga1").value = "2e-6";
    el("carga2").value = "-3e-6";
    el("distancia").value = ".5";
    submit();
    assert.equal(el("errorSimulacion").hidden, true);
    assert.equal(el("forceResult").textContent, "0.2157 N.");
    for (let distancia = 1; distancia <= 11; distancia++) {
      el("distancia").value = String(distancia);
      submit();
    }
    assert.equal(el("listaHistorial").children.length, 10);
    assert.match(
      textoNodo(el("listaHistorial").children[0]),
      /Distancia.*1\.10e\+1 m/,
    );
    assert.match(
      textoNodo(el("listaHistorial").children[9]),
      /Distancia.*2\.00e\+0 m/,
    );
    assert.equal(el("btnHistorial").textContent.trim(), "");
  } finally {
    delete globalThis.document;
    delete globalThis.anime;
  }
});

test("Anime.js incluido: API v4, ida/vuelta y restauración", () => {
  const context = vm.createContext({
    setImmediate,
    clearImmediate,
    setTimeout,
    clearTimeout,
    performance,
  });
  vm.runInContext(
    readFileSync(
      new URL("../Assets/Js/anime.umd.min.js", import.meta.url),
      "utf8",
    ),
    context,
  );
  assert.equal(typeof context.anime.animate, "function");
  const target = { translateX: 0 };
  const animation = context.anime.animate(target, {
    translateX: [0, 20],
    alternate: true,
    loop: 1,
    duration: 600,
    autoplay: false,
  });
  try {
    animation.seek(600);
    assert.equal(target.translateX, 20);
    animation.seek(1200);
    assert.equal(target.translateX, 0);
    animation.seek(300);
    assert.notEqual(target.translateX, 0);
  } finally {
    animation.revert();
  }
  assert.equal(target.translateX, 0);
});
