
document.getElementById('tracker-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const symptoms = document.getElementById('symptoms').value.trim();
  const water = document.getElementById('water').value;
  const caffeine = document.getElementById('caffeine').value.trim();
  const treatments = document.getElementById('treatments').value.trim();
  const sleep = document.getElementById('sleep').value;

  // Caffeine estimation logic
  let estimate = 0;
  if (/coffee/i.test(caffeine)) estimate += 95;
  if (/coke/i.test(caffeine)) estimate += 34;
  if (/tea/i.test(caffeine)) estimate += 47;
  if (/energy/i.test(caffeine)) estimate += 80;
  document.getElementById('caffeine-estimate').textContent = estimate + ' mg';

  const entry = `
    <div class="entry">
      <strong>Symptoms:</strong> ${symptoms}<br/>
      <strong>Water:</strong> ${water} L<br/>
      <strong>Caffeine:</strong> ${caffeine} (${estimate} mg)<br/>
      <strong>Treatments:</strong> ${treatments}<br/>
      <strong>Sleep:</strong> ${sleep || 'Not entered'} hours
    </div>
    <hr/>
  `;

  document.getElementById('log').innerHTML += entry;

  // Clear form fields after saving
  document.getElementById('tracker-form').reset();
  document.getElementById('caffeine-estimate').textContent = '0 mg';
});
