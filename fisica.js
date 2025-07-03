const sustancias = [
  { nombre: "Agua", ce: 4190, ceCal: "1.000", pf: 273.15, cf: 334, pe: 373.15, cv: 2256 },
  { nombre: "Aluminio", ce: 910, ceCal: 0.217, pf: 933.15, cf: "322 - 394", pe: 2673.15, cv: 9220 },
  { nombre: "Cobre", ce: 390, ceCal: 0.093, pf: 1356, cf: 134, pe: 1460, cv: 5069 },
  { nombre: "Etanol", ce: 2428, ceCal: "0.580", pf: 159, cf: 104.2, pe: 351, cv: 854 },
  { nombre: "Hielo", ce: 2000, ceCal: 0.477, pf: 0, cf: 334, pe: "---", cv: "---" },
  { nombre: "Hierro", ce: 470, ceCal: 0.112, pf: 1083.15, cf: 293, pe: 3323.15, cv: 6300 },
  { nombre: "Plomo", ce: 130, ceCal: 0.031, pf: 600.5, cf: 24.3, pe: 2023, cv: 871 },
  { nombre: "Mercurio", ce: 138, ceCal: 0.033, pf: 234, cf: 11.8, pe: 630, cv: 272 },
  { nombre: "Plata", ce: 234, ceCal: 0.055, pf: 1233.95, cf: 88.3, pe: 2466, cv: 2336 },
  { nombre: "Vapor(agua)", ce: 1963, ceCal: 0.468, pf: "---", cf: "---", pe: 373.15, cv: 2256 }
];

window.onload = function () {
  const tbody = document.getElementById("tabla-sustancias");
  const select = document.getElementById("sustancia");

  sustancias.forEach((s, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${s.nombre}</td><td>${s.ce}</td><td>${s.ceCal}</td><td>${s.pf}</td><td>${s.cf}</td><td>${s.pe}</td><td>${s.cv}</td>`;
    tbody.appendChild(tr);

    const option = document.createElement("option");
    option.value = idx;
    option.textContent = s.nombre;
    select.appendChild(option);
  });
};

function simular() {
  const sust = sustancias[document.getElementById("sustancia").value];
  const masa = parseFloat(document.getElementById("masa").value);
  const temp = parseFloat(document.getElementById("temperatura").value);
  let resultado = "";

  if (isNaN(masa) || isNaN(temp) || masa <= 0) {
    document.getElementById("resultado").textContent = "Por favor, ingresa valores válidos.";
    return;
  }

  let fase = "";
  if (sust.pf !== "---" && temp < sust.pf) {
    fase = "Sólido";
    resultado = `La sustancia está en estado <b>SÓLIDO</b>.`;
  } else if (sust.pe !== "---" && temp > sust.pe) {
    fase = "Gas";
    resultado = `La sustancia está en estado <b>GASEOSO</b>.`;
  } else if (sust.pf !== "---" && sust.pe !== "---" && temp >= sust.pf && temp <= sust.pe) {
    fase = "Líquido";
    resultado = `La sustancia está en estado <b>LÍQUIDO</b>.`;
  } else {
    fase = "Desconocido";
    resultado = "No se puede determinar la fase con los datos actuales.";
  }

  document.getElementById("resultado").innerHTML = resultado;
  animarFase(fase);
  cambiarColorVideo(fase);
}

function cambiarColorVideo(fase) {
  const videoFondo = document.getElementById("video-fondo");
  if (fase === "Sólido") {
    videoFondo.style.filter = "hue-rotate(190deg) saturate(1.2)";
  } else if (fase === "Líquido") {
    videoFondo.style.filter = "hue-rotate(90deg) saturate(1.6)";
  } else if (fase === "Gas") {
    videoFondo.style.filter = "hue-rotate(40deg) saturate(1.9)";
  } else {
    videoFondo.style.filter = "grayscale(1)";
  }
}

function animarFase(fase) {
  const canvas = document.getElementById("animacion");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let color, speed, count, radius;
  if (fase === "Sólido") {
    color = "#90caf9"; speed = 0.2; count = 12; radius = 6;
  } else if (fase === "Líquido") {
    color = "#81c784"; speed = 1.2; count = 18; radius = 7;
  } else if (fase === "Gas") {
    color = "#ffb74d"; speed = 3; count = 22; radius = 8;
  } else {
    color = "#bdbdbd"; speed = 0; count = 0; radius = 0;
  }

  let particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * speed,
    dy: (Math.random() - 0.5) * speed,
    r: radius + Math.random() * 2
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      const grad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.r);
      grad.addColorStop(0, "white");
      grad.addColorStop(1, color);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < p.r || p.x > canvas.width - p.r) p.dx *= -1;
      if (p.y < p.r || p.y > canvas.height - p.r) p.dy *= -1;
    });
    if (count > 0) requestAnimationFrame(draw);
  }

  draw();
  
}