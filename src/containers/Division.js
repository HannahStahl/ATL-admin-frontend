import React, { useState } from "react";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";

export default ({ original, save, isLoading }) => {
  const [division, setDivision] = useState(original || {});

  const validateForm = () => division.divisionNumber?.length > 0;

  return (
    <form onSubmit={(e) => save(e, division)}>
      <FormGroup controlId="divisionNumber">
        <ControlLabel>Division Number</ControlLabel>
        <FormControl
          value={division.divisionNumber || ''}
          type="text"
          onChange={e => setDivision({ ...division, divisionNumber: e.target.value })}
        />
      </FormGroup>
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
