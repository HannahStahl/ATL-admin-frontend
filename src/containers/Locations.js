import React from "react";
import { PageHeader } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import Location from "./Location";
import Table from "../components/Table";

export default function Roster() {
  const { locations, setLocations } = useAppContext();

  const columns = {
    locationName: "Name",
    // TODO add other fields
  };

  return (
    <div>
      <PageHeader>Court Locations</PageHeader>
      <Table columns={columns} rows={locations} setRows={setLocations} itemType="location" EditForm={Location} />
    </div>
  );
}
