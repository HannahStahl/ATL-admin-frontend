import React from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import Division from "./Division";
import Table from "../components/Table";

export default function Roster() {
  const { divisions, setDivisions } = useAppContext();

  const columns = {
    divisionNumber: "Number",
  };

  return (
    <div>
      <PageHeader>Divisions</PageHeader>
      <Table columns={columns} rows={divisions} setRows={setDivisions} itemType="division" EditForm={Division} />
    </div>
  );
}
