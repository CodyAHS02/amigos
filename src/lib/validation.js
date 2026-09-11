const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROJECT_TYPES = new Set(["Painting", "Plastering", "Renovation", "Property Preservation", "Other"]);

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function cleanText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function result(errors, values) {
  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values
  };
}

export function validateLoginInput(input) {
  const values = {
    email: normalizeEmail(input.email),
    password: String(input.password || "")
  };
  const errors = {};

  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Password is required.";

  return result(errors, values);
}

export function validateRegistrationInput(input) {
  const values = {
    name: cleanText(input.name),
    email: normalizeEmail(input.email),
    password: String(input.password || "")
  };
  const errors = {};

  if (values.name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter a valid email address.";
  if (values.password.length < 8) errors.password = "Password must be at least 8 characters.";
  if (values.password && !/[A-Za-z]/.test(values.password)) errors.password = "Password must include a letter.";
  if (values.password && !/\d/.test(values.password)) errors.password = "Password must include a number.";

  return result(errors, values);
}

export function validateConsultationInput(input) {
  const values = {
    name: cleanText(input.name),
    email: normalizeEmail(input.email),
    projectType: cleanText(input.projectType),
    message: String(input.message || "").trim()
  };
  const errors = {};

  if (values.name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter a valid email address.";
  if (!PROJECT_TYPES.has(values.projectType)) errors.projectType = "Select a valid service.";
  if (values.message.length < 10) errors.message = "Tell us a little more about the project.";
  if (values.message.length > 2000) errors.message = "Message must be 2000 characters or fewer.";

  return result(errors, values);
}
