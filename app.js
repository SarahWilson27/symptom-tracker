
const form = document.getElementById("entryForm");
const entriesDiv = document.getElementById("entries");
const caffeineEstimateP = document.getElementById("caffeineEstimate");
const caffeineField = document.getElementById("caffeineIntake");

let entries = JSON.parse(localStorage.getItem("entries")) || [];

const caffeineDB = {
  "coffee": 95,
  "tea": 45,
  "coke": 34,
  "energy drink": 80,
  "espresso": 63,
  "decaf coffee": 5,
  "chocolate": 10,
};

caffeineField.addEventListener("input", () => {
  const input = caffeineField.value;
  const reg = /(\d+)x\s*(.*?)\b/gi;
  let total = 0;
  let match;
  while ((match = reg.exec(input)) !== null) {
    let count = parseInt(match[1]);
    let item = match[2].toLowerCase();
    for (let key in caffeineDB) {
      if (item.includes(key)) {
        total += count * caffeineDB[key];
      }
    }
  }
  caffeineEstimateP.innerText = "Estimated Caffeine: " + total + " mg";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const entry = {
    symptomType: document.getElementById("symptomType").value,
    triggers: document.getElementById("triggers").value,
    sleepQuality: document.getElementById("sleepQuality").value,
    sleepHours: document.getElementById("sleepHours").value,
    waterIntake: document.getElementById("waterIntake").value,
    caffeineIntake: document.getElementById("caffeineIntake").value,
    caffeineEstimate: caffeineEstimateP.innerText.split(": ")[1],
    treatments: document.getElementById("treatments").value,
    notes: document.getElementById("notes").value,
  };
  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  renderEntries();
  form.reset();
  caffeineEstimateP.innerText = "Estimated Caffeine: 0 mg";
});

function renderEntries(filter = "") {
  entriesDiv.innerHTML = "";
  entries.filter(e => e.symptomType.toLowerCase().includes(filter.toLowerCase())).forEach((e, i) => {
    entriesDiv.innerHTML += `<div class="entry">
      <strong>${e.symptomType}</strong><br/>
      Triggers: ${e.triggers}<br/>
      Sleep: ${e.sleepQuality}/10${e.sleepHours ? ` for ${e.sleepHours} hrs` : ""}<br/>
      Water: ${e.waterIntake} L<br/>
      Caffeine: ${e.caffeineIntake} (${e.caffeineEstimate})<br/>
      Treatments: ${e.treatments}<br/>
      Notes: ${e.notes}
    </div>`;
  });
}

function applyFilter() {
  const f = document.getElementById("filterInput").value;
  renderEntries(f);
}
function clearFilter() {
  document.getElementById("filterInput").value = "";
  renderEntries("");
}

renderEntries();
