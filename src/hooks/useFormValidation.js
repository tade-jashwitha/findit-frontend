// src/hooks/useFormValidation.js
// A generic form validation hook.
//
// Usage:
//   const { values, errors, handleChange, validate, setValues } = useFormValidation(
//     { email: '', password: '' },   // initial values
//     {                              // rules
//       email:    { required: true, isEmail: true },
//       password: { required: true, minLength: 6  },
//     }
//   );

import { useState } from 'react';

const VALIDATORS = {
  required:  (v)   => (!v || !String(v).trim()) ? 'This field is required' : null,
  isEmail:   (v)   => (!/\S+@\S+\.\S+/.test(v)) ? 'Enter a valid email address' : null,
  minLength: (v, n) => (String(v).length < n)    ? `Minimum ${n} characters`   : null,
  maxLength: (v, n) => (String(v).length > n)    ? `Maximum ${n} characters`   : null,
};

export function useFormValidation(initialValues = {}, rules = {}) {
  const [values, setValues]   = useState(initialValues);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleBlur = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    // Validate single field on blur
    const fieldError = runFieldValidation(key, values[key]);
    if (fieldError) setErrors((prev) => ({ ...prev, [key]: fieldError }));
  };

  const runFieldValidation = (key, value) => {
    const fieldRules = rules[key];
    if (!fieldRules) return null;

    for (const [rule, param] of Object.entries(fieldRules)) {
      if (rule === 'match') {
        // Special case: match another field
        if (value !== values[param]) return `Does not match ${param}`;
        continue;
      }
      const validator = VALIDATORS[rule];
      if (validator) {
        const error = validator(value, param);
        if (error) return error;
      }
    }
    return null;
  };

  const validate = () => {
    const newErrors = {};
    for (const key of Object.keys(rules)) {
      const error = runFieldValidation(key, values[key]);
      if (error) newErrors[key] = error;
    }
    setErrors(newErrors);
    setTouched(Object.fromEntries(Object.keys(rules).map((k) => [k, true])));
    return Object.keys(newErrors).length === 0; // returns true if valid
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return { values, errors, touched, handleChange, handleBlur, validate, setValues, reset };
}