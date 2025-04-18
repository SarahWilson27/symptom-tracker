
document.getElementById('tracker-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const checkedSymptoms = Array.from(document.querySelectorAll('#symptom-options input:checked'))
                                .map(el => el.value)
                                .join(', ');
  const water = document.getElementById('water').value;
  const caffeine = document.getElementById('caffeine').value.trim();
  const treatments = document.getElementById('treatments').value.trim();
  const treatmentEffect = document.getElementById('treatmentEffect').value;
  const notes = document.getElementById('notes').value;
  const sleep = document.getElementById('sleep').value;

  let estimate = 0;
  if (/coffee/i.test(caffeine)) estimate += 95;
  if (/coke/i.test(caffeine)) estimate += 34;
  if (/tea/i.test(caffeine)) estimate += 47;
  if (/energy/i.test(caffeine)) estimate += 80;
  document.getElementById('caffeine-estimate').textContent = estimate + ' mg';

  const table = document.getElementById('log-table');
  const row = table.insertRow();
  row.innerHTML = `
    <td>${date}</td>
    <td>${checkedSymptoms}</td>
    <td>${water} L</td>
    <td>${caffeine} (${estimate} mg)</td>
    <td>${treatments}</td>
    <td>${sleep || 'Not entered'} hrs</td><td>${treatmentEffect}</td><td>${notes}</td>
  `;

  document.getElementById('tracker-form').reset();
  document.getElementById('caffeine-estimate').textContent = '0 mg';
});

function toggleColumn(index) {
  const table = document.getElementById('log-table');
  for (let row of table.rows) {
    if (row.cells[index]) {
      row.cells[index].style.display =
        row.cells[index].style.display === 'none' ? '' : 'none';
    }
  }
}

const toggleControls = document.createElement('div');
toggleControls.innerHTML = `
  <label>Show/Hide Columns:</label><br />
  <label><input type="checkbox" checked onchange="toggleColumn(0)"> Date</label>
  <label><input type="checkbox" checked onchange="toggleColumn(1)"> Symptoms</label>
  <label><input type="checkbox" checked onchange="toggleColumn(2)"> Water</label>
  <label><input type="checkbox" checked onchange="toggleColumn(3)"> Caffeine</label>
  <label><input type="checkbox" checked onchange="toggleColumn(4)"> Treatments</label>
  <label><input type="checkbox" checked onchange="toggleColumn(5)"> Sleep</label>
  <label><input type="checkbox" checked onchange="toggleColumn(6)"> Notes</label>
`;
document.body.insertBefore(toggleControls, document.getElementById('log-table'));

// Allow editing on click
document.getElementById('log-table').addEventListener('click', function(e) {
  const cell = e.target;
  if (cell.tagName === 'TD') {
    const original = cell.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = original;
    input.style.width = '100%';
    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
    input.onblur = () => {
      cell.textContent = input.value;
    };
  }
});

// Add filtering UI
const filterDiv = document.createElement('div');
filterDiv.innerHTML = \`
  <br /><label>Filter by Treatment Helped:</label>
  <select id="filterEffect">
    <option value="">--Show All--</option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
\`;
document.body.insertBefore(filterDiv, document.getElementById('log-table'));

document.getElementById('filterEffect').addEventListener('change', function() {
  const value = this.value;
  const rows = document.querySelectorAll("#log-table tbody tr");
  rows.forEach(row => {
    const effectCell = row.cells[6];
    if (!value || effectCell.textContent === value) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});


const filters = {
  symptoms: document.getElementById('filterSymptoms'),
  water: document.getElementById('filterWater'),
  caffeine: document.getElementById('filterCaffeine'),
  treatment: document.getElementById('filterTreatment'),
  sleep: document.getElementById('filterSleep'),
  notes: document.getElementById('filterNotes'),
  effect: document.getElementById('filterEffect')
};

Object.values(filters).forEach(input => {
  input.addEventListener('input', filterTable);
});
filters.effect.addEventListener('change', filterTable);

function filterTable() {
  const rows = document.querySelectorAll("#log-table tbody tr");
  rows.forEach(row => {
    const [date, symptoms, water, caffeine, treatment, sleep, effect, notes] = Array.from(row.cells).map(cell => cell.textContent.toLowerCase());
    const shouldShow =
      (!filters.symptoms.value || symptoms.includes(filters.symptoms.value.toLowerCase())) &&
      (!filters.water.value || water.includes(filters.water.value.toLowerCase())) &&
      (!filters.caffeine.value || caffeine.includes(filters.caffeine.value.toLowerCase())) &&
      (!filters.treatment.value || treatment.includes(filters.treatment.value.toLowerCase())) &&
      (!filters.sleep.value || sleep.includes(filters.sleep.value.toLowerCase())) &&
      (!filters.notes.value || notes.includes(filters.notes.value.toLowerCase())) &&
      (!filters.effect.value || effect === filters.effect.value.toLowerCase());

    row.style.display = shouldShow ? '' : 'none';
  });
}


// Save entry
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();

  const date = new Date().toLocaleDateString();
  const symptomValues = Array.from(document.querySelectorAll('#symptom-options input:checked')).map(cb => cb.value);
  const water = document.getElementById('water').value;
  const caffeine = document.getElementById('caffeine').value;
  const treatment = document.getElementById('treatment').value;
  const sleep = document.getElementById('sleep').value;
  const treatmentEffect = document.getElementById('treatmentEffect').value;
  const notes = document.getElementById('notes').value;

  const entry = {
    date,
    symptoms: symptomValues.join(', '),
    water,
    caffeine,
    treatment,
    sleep,
    treatmentEffect,
    notes
  };

  let entries = JSON.parse(localStorage.getItem('entries') || '[]');
  entries.push(entry);
  localStorage.setItem('entries', JSON.stringify(entries));

  displayEntries();
  document.querySelector('form').reset();
});

// Display entries in table
function displayEntries() {
  const entries = JSON.parse(localStorage.getItem('entries') || '[]');
  const tbody = document.querySelector("#log-table tbody");
  tbody.innerHTML = '';
  entries.forEach(entry => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.symptoms}</td>
      <td>${entry.water}</td>
      <td>${entry.caffeine}</td>
      <td>${entry.treatment}</td>
      <td>${entry.sleep}</td>
      <td>${entry.treatmentEffect}</td>
      <td>${entry.notes}</td>
    `;
  });
}

// Show existing entries on load

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed.");
  displayEntries();
});

function displayEntries() {
  const entries = JSON.parse(localStorage.getItem('entries') || '[]');
  console.log("Loaded entries:", entries);
  const tbody = document.querySelector("#log-table tbody");
  if (!tbody) {
    console.error("Table body not found!");
    return;
  }
  tbody.innerHTML = '';
  entries.forEach(entry => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.symptoms}</td>
      <td>${entry.water}</td>
      <td>${entry.caffeine}</td>
      <td>${entry.treatment}</td>
      <td>${entry.sleep}</td>
      <td>${entry.treatmentEffect}</td>
      <td>${entry.notes}</td>
    `;
  });
}



document.getElementById('exportCSV').addEventListener('click', () => {
  const entries = JSON.parse(localStorage.getItem('entries') || '[]');
  if (entries.length === 0) {
    alert('No data to export.');
    return;
  }

  const headers = Object.keys(entries[0]);
  const csvRows = [
    headers.join(','),
    ...entries.map(entry => headers.map(h => `"${(entry[h] || '').replace(/"/g, '""')}"`).join(','))
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'symptom_tracker_entries.csv');
  a.click();
});
