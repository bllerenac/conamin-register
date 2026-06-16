import React, { useState } from 'react';

export default function RegistrationForm({ onAddUser }) {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    correo: '',
    telefono: '',
    empresa: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Simple validation rules
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre y apellidos son requeridos';
        } else if (value.trim().length < 3) {
          error = 'Debe ingresar al menos 3 caracteres';
        }
        break;
      case 'dni':
        const cleanDni = value.trim();
        if (!cleanDni) {
          error = 'El DNI es requerido';
        } else if (!/^[a-zA-Z0-9]{6,12}$/.test(cleanDni)) {
          // Flexible validation for DNI (between 6 and 12 characters, letters and numbers)
          error = 'El DNI debe tener entre 6 y 12 caracteres alfanuméricos';
        }
        break;
      case 'correo':
        if (!value.trim()) {
          error = 'El correo electrónico es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Ingrese un formato de correo electrónico válido';
        }
        break;
      case 'telefono':
        if (!value.trim()) {
          error = 'El número de teléfono es requerido';
        } else if (!/^\+?[0-9\s-]{7,15}$/.test(value.trim())) {
          error = 'Ingrese un número de teléfono válido (mínimo 7 dígitos, solo números, espacios y \'-\')';
        }
        break;
      case 'empresa':
        if (!value.trim()) {
          error = 'La empresa es requerida';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const allTouched = {};
    
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setTouched(allTouched);
    setErrors(newErrors);

    // If there are no errors, submit
    if (Object.keys(newErrors).length === 0) {
      const newUser = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        nombre: formData.nombre.trim(),
        dni: formData.dni.trim().toUpperCase(),
        correo: formData.correo.trim(),
        telefono: formData.telefono.trim(),
        empresa: formData.empresa.trim(),
        fecha: new Date().toLocaleString('es-ES')
      };

      onAddUser(newUser);
      setSubmittedData(newUser);
      setIsSubmittedSuccessfully(true);
      
      // Reset form
      setFormData({
        nombre: '',
        dni: '',
        correo: '',
        telefono: '',
        empresa: ''
      });
      setTouched({});
      setErrors({});
    }
  };

  const handleReset = () => {
    setIsSubmittedSuccessfully(false);
    setSubmittedData(null);
  };

  if (isSubmittedSuccessfully && submittedData) {
    return (
      <div className="success-container">
        <div className="success-icon-wrap">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 className="success-title">¡Registro Completado!</h2>
        <p className="success-desc">Tus datos han sido procesados y guardados correctamente.</p>
        
        <div className="summary-card">
          <div className="summary-item">
            <span className="summary-label">Nombre y Apellidos:</span>
            <span className="summary-value">{submittedData.nombre}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">DNI / Documento:</span>
            <span className="summary-value">{submittedData.dni}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Correo:</span>
            <span className="summary-value">{submittedData.correo}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Teléfono:</span>
            <span className="summary-value">{submittedData.telefono}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Empresa:</span>
            <span className="summary-value">{submittedData.empresa}</span>
          </div>
        </div>

        <button onClick={handleReset} className="btn-primary">
          Registrar otro usuario
        </button>
      </div>
    );
  }

  const getInputClassName = (fieldName) => {
    if (!touched[fieldName]) return 'form-input';
    return errors[fieldName] 
      ? 'form-input has-error' 
      : 'form-input has-success';
  };

  return (
    <div>
      <h1 className="form-title">Registra tus datos</h1>
      <p className="form-subtitle">Completa el formulario para participar en nuestro sorteo premium.</p>
      
      <form onSubmit={handleSubmit} className="form-grid" noValidate>
        <div className="form-group">
          <input
            id="form-nombre"
            type="text"
            name="nombre"
            className={getInputClassName('nombre')}
            placeholder=" "
            value={formData.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <label htmlFor="form-nombre" className="form-label">Nombre y Apellidos</label>
          {touched.nombre && errors.nombre && (
            <div className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.nombre}
            </div>
          )}
        </div>

        <div className="form-group">
          <input
            id="form-dni"
            type="text"
            name="dni"
            className={getInputClassName('dni')}
            placeholder=" "
            value={formData.dni}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <label htmlFor="form-dni" className="form-label">DNI</label>
          {touched.dni && errors.dni && (
            <div className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.dni}
            </div>
          )}
        </div>

        <div className="form-group">
          <input
            id="form-correo"
            type="email"
            name="correo"
            className={getInputClassName('correo')}
            placeholder=" "
            value={formData.correo}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <label htmlFor="form-correo" className="form-label">Correo Electrónico</label>
          {touched.correo && errors.correo && (
            <div className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.correo}
            </div>
          )}
        </div>

        <div className="form-group">
          <input
            id="form-telefono"
            type="tel"
            name="telefono"
            className={getInputClassName('telefono')}
            placeholder=" "
            value={formData.telefono}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <label htmlFor="form-telefono" className="form-label">Número de Teléfono</label>
          {touched.telefono && errors.telefono && (
            <div className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.telefono}
            </div>
          )}
        </div>

        <div className="form-group">
          <input
            id="form-empresa"
            type="text"
            name="empresa"
            className={getInputClassName('empresa')}
            placeholder=" "
            value={formData.empresa}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <label htmlFor="form-empresa" className="form-label">Empresa</label>
          {touched.empresa && errors.empresa && (
            <div className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.empresa}
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Registrar Datos
        </button>
      </form>
    </div>
  );
}
