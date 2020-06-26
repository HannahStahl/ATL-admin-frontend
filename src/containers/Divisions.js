import React from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import Table from "../components/Table";

export default () => {
  const { divisions, setDivisions } = useAppContext();
  const columns = {
    divisionNumber: {
      label: "Number"
    },
  };
  const fields = [
    {
      key: "divisionNumber",
      label: "Number",
      type: "text",
      required: true,
    }
  ];

  return (
    <div>
      <PageHeader>Divisions</PageHeader>
      <Table columns={columns} rows={divisions} setRows={setDivisions} itemType="division" fields={fields} />
    </div>
  );
}
