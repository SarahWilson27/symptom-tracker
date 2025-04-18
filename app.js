
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded. Attempting to load saved entries...");
  displayEntries();

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
    console.log("Saved entry:", entry);

    displayEntries();
    document.querySelector('form').reset();
  });

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
});

function displayEntries() {
  const entries = JSON.parse(localStorage.getItem('entries') || '[]');
  console.log("Displaying entries:", entries);

  const tbody = document.querySelector("#log-table tbody");
  if (!tbody) {
    console.error("Table body #log-table tbody not found!");
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
