function highlightGender(radio) {
  document.querySelectorAll('input[name="gender"]').forEach(function(r) {
    r.parentElement.classList.remove('selected');
  });
  radio.parentElement.classList.add('selected');
}

function validateForm() {
  let valid = true;

  // Name
  const name = document.getElementById('name').value.trim();
  const nameErr = document.getElementById('nameErr');
  if (name.length < 2) {
    nameErr.style.display = 'block'; valid = false;
  } else { nameErr.style.display = 'none'; }

  // Email
  const email = document.getElementById('email').value.trim();
  const emailErr = document.getElementById('emailErr');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailErr.style.display = 'block'; valid = false;
  } else { emailErr.style.display = 'none'; }

  // Phone — 10 digits
  const phone = document.getElementById('phone').value.trim();
  const phoneErr = document.getElementById('phoneErr');
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    phoneErr.style.display = 'block'; valid = false;
  } else { phoneErr.style.display = 'none'; }

  // Gender
  const gender = document.querySelector('input[name="gender"]:checked');
  const genderErr = document.getElementById('genderErr');
  if (!gender) {
    genderErr.style.display = 'block'; valid = false;
  } else { genderErr.style.display = 'none'; }

  // Age
  const age = parseInt(document.getElementById('age').value);
  const ageErr = document.getElementById('ageErr');
  if (isNaN(age) || age < 1 || age > 120) {
    ageErr.style.display = 'block'; valid = false;
  } else { ageErr.style.display = 'none'; }

  return valid;
}