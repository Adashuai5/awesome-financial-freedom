/**
 * Form Components - FIRE Financial Freedom Assessment Forms
 * Handles form validation, rendering, and data collection
 */

/**
 * FormValidator - Validates form data according to schema rules
 */
class FormValidator {
  constructor(validationRules) {
    this.rules = validationRules;
  }

  validate(formName, formData) {
    const rules = this.rules[formName] || [];
    const errors = [];

    rules.forEach(({ rule, message }) => {
      if (!this.evaluateRule(rule, formData)) {
        errors.push(message);
      }
    });

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  evaluateRule(rule, data) {
    // Simple rule evaluator - in production use a proper expression evaluator
    // Example rules: "total_assets >= total_liabilities", "annual_savings >= 0"
    
    try {
      // Replace field references with values
      let expression = rule;
      Object.entries(data).forEach(([key, value]) => {
        expression = expression.replace(new RegExp(`\\b${key}\\b`, 'g'), value);
      });

      // Evaluate the expression
      return eval(expression);
    } catch (error) {
      console.error(`Rule evaluation error: ${error.message}`);
      return false;
    }
  }
}

/**
 * FormRenderer - Renders form fields dynamically from schema
 */
class FormRenderer {
  constructor(formSchema, fieldTypes) {
    this.schema = formSchema;
    this.fieldTypes = fieldTypes;
  }

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    const formHTML = this.generateFormHTML();
    container.innerHTML = formHTML;
  }

  generateFormHTML() {
    const { title, description, sections } = this.schema;

    let html = `
      <div class="fire-form">
        <h1 class="form-title">${title}</h1>
        <p class="form-description">${description}</p>
    `;

    sections.forEach((section) => {
      html += this.renderSection(section);
    });

    html += `
        <div class="form-actions">
          <button class="btn-primary" type="submit">获取 FIRE 评估</button>
          <button class="btn-secondary" type="reset">重置表单</button>
        </div>
      </div>
    `;

    return html;
  }

  renderSection(section) {
    let html = `
      <fieldset class="form-section">
        <legend class="section-title">${section.title}</legend>
        <div class="section-fields">
    `;

    section.fields.forEach((field) => {
      html += this.renderField(field);
    });

    html += `
        </div>
      </fieldset>
    `;

    return html;
  }

  renderField(field) {
    const { id, label, type, required, tooltip, placeholder, options } = field;
    const requiredMark = required ? '<span class="required">*</span>' : '';

    let html = `
      <div class="form-group">
        <label for="${id}" class="field-label">
          ${label}
          ${requiredMark}
        </label>
    `;

    if (tooltip) {
      html += `<span class="tooltip-icon" title="${tooltip}">?</span>`;
    }

    switch (type) {
      case 'currency':
        html += this.renderCurrencyField(field);
        break;
      case 'percentage':
        html += this.renderPercentageField(field);
        break;
      case 'number':
        html += this.renderNumberField(field);
        break;
      case 'text':
        html += this.renderTextField(field);
        break;
      case 'select':
        html += this.renderSelectField(field);
        break;
      default:
        html += this.renderTextField(field);
    }

    html += `
      </div>
    `;

    return html;
  }

  renderCurrencyField(field) {
    const { id, placeholder, required } = field;
    return `
      <div class="input-group">
        <span class="input-prefix">¥</span>
        <input
          type="number"
          id="${id}"
          name="${id}"
          placeholder="${placeholder || '0'}"
          ${required ? 'required' : ''}
          step="100"
          min="0"
          class="form-control currency-input"
        />
      </div>
    `;
  }

  renderPercentageField(field) {
    const { id, placeholder, required, validation } = field;
    return `
      <div class="input-group">
        <input
          type="number"
          id="${id}"
          name="${id}"
          placeholder="${placeholder || '0'}"
          ${required ? 'required' : ''}
          step="0.1"
          min="${validation?.min || 0}"
          max="${validation?.max || 100}"
          class="form-control percentage-input"
        />
        <span class="input-suffix">%</span>
      </div>
    `;
  }

  renderNumberField(field) {
    const { id, placeholder, required, validation } = field;
    return `
      <input
        type="number"
        id="${id}"
        name="${id}"
        placeholder="${placeholder || '0'}"
        ${required ? 'required' : ''}
        min="${validation?.min || 0}"
        max="${validation?.max || ''}"
        class="form-control"
      />
    `;
  }

  renderTextField(field) {
    const { id, placeholder, required } = field;
    return `
      <input
        type="text"
        id="${id}"
        name="${id}"
        placeholder="${placeholder || ''}"
        ${required ? 'required' : ''}
        class="form-control"
      />
    `;
  }

  renderSelectField(field) {
    const { id, required, options } = field;
    let html = `
      <select
        id="${id}"
        name="${id}"
        ${required ? 'required' : ''}
        class="form-control"
      >
        <option value="">-- 请选择 --</option>
    `;

    options.forEach(({ value, label }) => {
      html += `<option value="${value}">${label}</option>`;
    });

    html += `</select>`;

    return html;
  }
}

/**
 * FormDataCollector - Collects and formats form data
 */
class FormDataCollector {
  static collect(formId) {
    const form = document.getElementById(formId);
    if (!form) {
      throw new Error(`Form with id "${formId}" not found`);
    }

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      // Convert to appropriate type
      if (value === '' || value === null) {
        data[key] = null;
      } else if (!isNaN(value) && value !== '') {
        data[key] = parseFloat(value);
      } else {
        data[key] = value;
      }
    });

    return data;
  }

  static format(rawData) {
    // Format raw form data for API submission
    return {
      total_assets: rawData.total_assets,
      total_liabilities: rawData.total_liabilities,
      primary_residence_value: rawData.primary_residence_value || 0,
      annual_fixed_expenses: rawData.annual_fixed_expenses,
      annual_savings: rawData.annual_savings,
      monthly_passive_income: rawData.monthly_passive_income || 0,
      mortgage_balance: rawData.mortgage_balance || 0,
      monthly_mortgage_payment: rawData.monthly_mortgage_payment || 0,
      mortgage_rate: (rawData.mortgage_rate || 0) / 100,
      other_liabilities: rawData.other_liabilities || 0,
      family_status: rawData.family_status,
      dependents_count: rawData.dependents_count || 0,
      risk_tolerance: rawData.risk_tolerance,
      expected_return_rate: (rawData.expected_return_rate || 7) / 100,
      current_allocation: rawData.current_allocation || '',
    };
  }
}

/**
 * FormManager - Orchestrates form rendering, validation, and submission
 */
class FormManager {
  constructor(formSchema, validationRules, fieldTypes) {
    this.renderer = new FormRenderer(formSchema, fieldTypes);
    this.validator = new FormValidator(validationRules);
    this.formSchema = formSchema;
  }

  initialize(containerId, formName, onSubmit) {
    this.renderer.render(containerId);
    this.attachEventListeners(formName, onSubmit);
  }

  attachEventListeners(formName, onSubmit) {
    const form = document.querySelector('.fire-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const rawData = FormDataCollector.collect('fire-form');
      const validation = this.validator.validate(formName, rawData);

      if (!validation.valid) {
        this.showErrors(validation.errors);
        return;
      }

      const formattedData = FormDataCollector.format(rawData);
      if (onSubmit) {
        onSubmit(formattedData);
      }
    });
  }

  showErrors(errors) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-alert';
    errorContainer.innerHTML = `
      <h3>表单验证失败：</h3>
      <ul>
        ${errors.map((error) => `<li>${error}</li>`).join('')}
      </ul>
    `;

    const form = document.querySelector('.fire-form');
    if (form) {
      form.insertBefore(errorContainer, form.firstChild);
      setTimeout(() => errorContainer.remove(), 5000);
    }
  }
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FormValidator,
    FormRenderer,
    FormDataCollector,
    FormManager,
  };
}

// ESM exports
export {
  FormValidator,
  FormRenderer,
  FormDataCollector,
  FormManager,
};
