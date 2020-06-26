import React from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import Table from "../components/Table";

export default function Roster() {
  const { locations, setLocations } = useAppContext();
  // TODO add other columns/fields
  const columns = {
    locationName: "Name",
  };
  const fields = [
    {
      key: "locationName",
      label: "Name",
      type: "text",
      required: true,
    }
  ];

  return (
    <div>
      <PageHeader>Court Locations</PageHeader>
      <Table columns={columns} rows={locations} setRows={setLocations} itemType="location" fields={fields} />
    </div>
  );
}
