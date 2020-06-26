import React, { useState } from "react";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";

export default ({ fields, original, save, isLoading }) => {
  const [updated, setUpdated] = useState(original || {});

  const validateForm = () => {
    let valid = true;
    fields.forEach((field) => {
      if (field.required && (!updated[field.key] || updated[field.key].length === 0)) {
        valid = false;
      }
    });
    return valid;
  };

  return (
    <form onSubmit={(e) => save(e, updated)}>
      {fields.map((field) => (
        <FormGroup key={field.key} controlId={field.key}>
          <ControlLabel>{field.label}</ControlLabel>
          {field.type === "text" && (
            <FormControl
              value={updated[field.key] || ''}
              type="text"
              onChange={e => setUpdated({ ...updated, [field.key]: e.target.value })}
            />
          )}
        </FormGroup>
      ))}
      <LoaderButton
        block
        type="submit"
        bsSize="large"
        bsStyle="primary"
        isLoading={isLoading}
        disabled={!validateForm()}
      >
        Save
      </LoaderButton>
    </form>
  );
};
