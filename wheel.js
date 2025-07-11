let segments = [];
let allSegments = [];

const wheelGroup = document.getElementById("wheelGroup");
const defs = document.getElementById("svgDefs");
const result = document.getElementById("result");
const winnerDisplay = document.getElementById("winnerDisplay");
const center = 200;
const radius = 200;
const pointerAngle = 270;
let currentRotation = 0;

const gradient = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "radialGradient"
);
gradient.setAttribute("id", "neonGradient");
gradient.setAttribute("cx", "50%");
gradient.setAttribute("cy", "50%");
gradient.setAttribute("r", "70%");
gradient.innerHTML =
  '<stop offset="0%" stop-color="#964085" /><stop offset="100%" stop-color="#000000" />';
defs.appendChild(gradient);

function drawWheel() {
  wheelGroup.innerHTML = "";
  const angleStep = 360 / segments.length;

  segments.forEach((val, i) => {
    const startAngle = i * angleStep;
    const endAngle = startAngle + angleStep;
    const largeArc = angleStep > 180 ? 1 : 0;
    const x1 = center + radius * Math.cos((Math.PI / 180) * startAngle);
    const y1 = center + radius * Math.sin((Math.PI / 180) * startAngle);
    const x2 = center + radius * Math.cos((Math.PI / 180) * endAngle);
    const y2 = center + radius * Math.sin((Math.PI / 180) * endAngle);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    );
    path.setAttribute("fill", "url(#neonGradient)");
    wheelGroup.appendChild(path);

    const textAngle = startAngle + angleStep / 2;
    const tx = center + radius * 0.72 * Math.cos((Math.PI / 180) * textAngle);
    const ty = center + radius * 0.72 * Math.sin((Math.PI / 180) * textAngle);
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", tx);
    text.setAttribute("y", ty);
    text.setAttribute("fill", "#F1EA53");
    text.setAttribute("font-size", segments.length > 50 ? "9" : "14");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.setAttribute("transform", `rotate(${textAngle}, ${tx}, ${ty})`);
    text.textContent = val;
    wheelGroup.appendChild(text);
  });

  const borderCircle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  borderCircle.setAttribute("cx", center);
  borderCircle.setAttribute("cy", center);
  borderCircle.setAttribute("r", radius - 2);
  borderCircle.setAttribute("fill", "none");
  borderCircle.setAttribute("stroke", "#F1EA53");
  borderCircle.setAttribute("stroke-width", 4);
  wheelGroup.appendChild(borderCircle);
}

function addNames() {
  const input = document.getElementById("namesInput").value;
  const names = input
    .split("\n")
    .map((n) => n.trim())
    .filter((n) => n.length > 0);

  segments = names.slice(0, 100); // max 100
  allSegments = [...segments]; // copie propre
  drawWheel();
}

function startSpin() {
  if (segments.length < 1) return;

  const mode = document.getElementById("modeSelect").value;
  const angleStep = 360 / segments.length;
  const extraSpins = 5;
  const randomDegrees = Math.floor(Math.random() * 360);
  const spin = extraSpins * 360 + randomDegrees;
  currentRotation += spin;

  wheelGroup.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    const normalized = currentRotation % 360;
    const angleAtPointer = (360 + pointerAngle - normalized) % 360;
    const index = Math.floor(angleAtPointer / angleStep);
    const selected = segments[index];

    if (mode === "gagnant") {
      // Affiche simplement le gagnant, ne le retire pas
      winnerDisplay.innerHTML = `
              <img src="${
                document.querySelector("#centerLogo img").src
              }" style="width: 60px; height: 60px; vertical-align: middle; margin-right: 10px;" />
              <span>GAGNANT : ${selected}</span>
              <img src="${
                document.querySelector("#centerLogo img").src
              }" style="width: 60px; height: 60px; vertical-align: middle; margin-left: 10px;" />
            `;
      winnerDisplay.style.display = "flex";
    } else {
      // Éliminatoire : on enlève le joueur
      result.textContent = `${selected} vient de quitter la roue.`;
      segments.splice(index, 1);

      if (segments.length === 1) {
        setTimeout(() => {
          winnerDisplay.innerHTML = `
                      <img src="${
                        document.querySelector("#centerLogo img").src
                      }" style="width: 60px; height: 60px; vertical-align: middle; margin-right: 10px;" />
                      <span>GAGNANT : ${segments[0]}</span>
                      <img src="${
                        document.querySelector("#centerLogo img").src
                      }" style="width: 60px; height: 60px; vertical-align: middle; margin-left: 10px;" />
                    `;
          winnerDisplay.style.display = "flex";
        }, 1500);
      } else {
        drawWheel();
      }
    }
  }, 5000);
}


drawWheel();

function changerLogo() {
  const newUrl = document.getElementById("logoUrlInput").value.trim();
  if (newUrl) {
    document.querySelector("#centerLogo img").src = newUrl;
  }
}

function changerCouleurs() {
  const c1 = document.getElementById("couleur1").value;
  const c2 = document.getElementById("couleur2").value;
  const gradient = document.getElementById("neonGradient");
  gradient.innerHTML = `
<stop offset="0%" stop-color="${c1}" />
<stop offset="100%" stop-color="${c2}" />
`;
  drawWheel();
}
function resetWheel() {
  if (allSegments.length === 0) return; // rien à remettre

  segments = [...allSegments]; // on restaure tous les noms
  currentRotation = 0;
  wheelGroup.style.transform = `rotate(0deg)`;
  result.textContent = "";
  winnerDisplay.style.display = "none";
  drawWheel();
}
