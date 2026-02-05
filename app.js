const TASKS = [
  { name: "Hacer la cama y recoger el cuarto", points: 10 },
  { name: "Mochilas al cuarto", points: 5 },
  { name: "Lavarse los dientes", points: 5 },
  { name: "Ducharse y recoger el cuarto de baño", points: 10 },
  { name: "Poner la mesa", points: 5 },
  { name: "Recoger la mesa", points: 5 },
  { name: "Recoger cocina", points: 10 },
  { name: "Poner mesa cena y quitarla", points: 10 },
  { name: "Estudiar", points: 15 }
];

const LONG_REWARDS = [
  { name: "Elegir dónde comer", points: 100 },
  { name: "Ir al cine", points: 150 },
  { name: "Actividad especial", points: 250 }
];

let state = JSON.parse(localStorage.getItem("familyApp")) || {
  lastReset: new Date().toDateString(),
  children: [
    { name: "Zaira", dailyPoints: 0, totalPoints: 0 },
    { name: "Clara", dailyPoints: 0, totalPoints: 0 }
  ],
  pending: []
};

function save() {
  localStorage.setItem("familyApp", JSON.stringify(state));
}

function resetDailyIfNeeded() {
  const today = new Date().toDateString();
  if (state.lastReset !== today) {
    state.children.forEach(c => c.dailyPoints = 0);
    state.lastReset = today;
    save();
  }
}

function getLevel(points) {
  if (points >= 500) return "Oro";
  if (points >= 200) return "Plata";
  return "Bronce";
}

function renderChildren() {
  const container = document.getElementById("children-container");
  container.innerHTML = "";

  state.children.forEach((child, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${child.name}</h3>
      <p>Puntos hoy: ${child.dailyPoints}</p>
      <p>Puntos totales: ${child.totalPoints}</p>
      <p class="level">Nivel: ${getLevel(child.totalPoints)}</p>
    `;
    container.appendChild(div);
  });
}

function renderTasks() {
  const container = document.getElementById("tasks-container");
  container.innerHTML = "";

  TASKS.forEach(task => {
    state.children.forEach((child, index) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <strong>${task.name}</strong> (${task.points} pts)
        <br>
        <button onclick="approveTask(${index}, '${task.name}', ${task.points})">
          Aprobar para ${child.name}
        </button>
      `;
      container.appendChild(div);
    });
  });
}

function approveTask(childIndex, taskName, points) {
  state.children[childIndex].dailyPoints += points;
  state.children[childIndex].totalPoints += points;
  save();
  renderAll();
}

function renderDailyReward() {
  const container = document.getElementById("daily-reward");
  container.innerHTML = "";
  state.children.forEach(child => {
    const minutes = child.dailyPoints; // 1 punto = 1 minuto
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>${child.name}</strong><br>
      Minutos hoy: ${minutes}
    `;
    container.appendChild(div);
  });
}

function renderLongRewards() {
  const container = document.getElementById("long-rewards");
  container.innerHTML = "";

  LONG_REWARDS.forEach(reward => {
    state.children.forEach((child, index) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        ${reward.name} (${reward.points} pts)
        <br>
        <button onclick="redeem(${index}, ${reward.points})">
          Canjear para ${child.name}
        </button>
      `;
      container.appendChild(div);
    });
  });
}

function redeem(childIndex, points) {
  if (state.children[childIndex].totalPoints >= points) {
    state.children[childIndex].totalPoints -= points;
    alert("Premio canjeado 🎉");
    save();
    renderAll();
  } else {
    alert("No tiene suficientes puntos");
  }
}

function renderAll() {
  renderChildren();
  renderTasks();
  renderDailyReward();
  renderLongRewards();
}

resetDailyIfNeeded();
renderAll();

