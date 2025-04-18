
document.getElementById('tracker-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const date = document.getElementById('date').value;
  const checkedSymptoms = Array.from(document.querySelectorAll('#symptom-options input:checked'))
                                .map(el => el.value)
                                .join(', ');
  const water = document.getElementById('water').value;
  const caffeine = document.getElementById('caffeine').value.trim();
  const treatments = document.getElementById('treatments').value.trim();
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
    <td>${sleep || 'Not entered'} hrs</td>
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
