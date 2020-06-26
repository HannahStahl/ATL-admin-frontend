import React, { useState } from "react";
import { API } from "aws-amplify";
import { PageHeader, Table, Modal } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import "./Locations.css";
import Location from "./Location";
import LoaderButton from "../components/LoaderButton";

export default function Roster() {
  const { locations, setLocations } = useAppContext();
  const [locationSelected, setLocationSelected] = useState(undefined);
  const [newLocationSelected, setNewLocationSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locationSelectedForRemoval, setLocationSelectedForRemoval] = useState(undefined);
  const [removing, setRemoving] = useState(false);

  const columns = {
    locationName: "Name",
    // TODO add other fields
  };

  const addLocation = async (event, newLocation) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.post("atl-backend", "create/location", { body: newLocation });
    locations.push(result);
    setLocations([...locations]);
    setIsLoading(false);
    setNewLocationSelected(false);
  };

  const editLocation = async (event, updatedLocation) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.put("atl-backend", `update/location/${updatedLocation.locationId}`, { body: updatedLocation });
    const index = locations.findIndex((locationInList) => locationInList.locationId === updatedLocation.locationId);
    locations[index] = result;
    setLocations([...locations]);
    setIsLoading(false);
    setLocationSelected(undefined);
  };

  const removeLocation = async () => {
    setRemoving(true);
    const { locationId } = locationSelectedForRemoval;
    await API.del("atl-backend", `delete/location/${locationId}`);
    const index = locations.findIndex((locationInList) => locationInList.locationId === locationId);
    locations.splice(index, 1);
    setLocations([...locations]);
    setRemoving(false);
    setLocationSelectedForRemoval(undefined);
  };

  return (
    <div>
      <PageHeader>Court Locations</PageHeader>
      <div className="Locations">
        <Table bordered hover>
          <thead>
            <tr>
              {Object.keys(columns).map((key) => <th key={key}>{columns[key]}</th>)}
              <th />
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr
                key={location.locationId}
                onClick={(e) => {
                  if (!e.target.className.includes("fas")) setLocationSelected(location);
                }}
              >
                {Object.keys(columns).map((key) => <td key={key}>{location[key]}</td>)}
                <td>
                  <i className="fas fa-times-circle" onClick={() => setLocationSelectedForRemoval(location)} />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={Object.keys(columns).length + 1} onClick={() => setNewLocationSelected(true)}>
                + Add new location
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Modal show={locationSelected !== undefined} onHide={() => setLocationSelected(undefined)}>
        <Modal.Header closeButton><Modal.Title>Edit Location Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <Location originalLocation={locationSelected} saveLocation={editLocation} isLoading={isLoading} />
        </Modal.Body>
      </Modal>
      <Modal show={newLocationSelected} onHide={() => setNewLocationSelected(false)}>
        <Modal.Header closeButton><Modal.Title>Add New Location</Modal.Title></Modal.Header>
        <Modal.Body><Location saveLocation={addLocation} isLoading={isLoading} /></Modal.Body>
      </Modal>
      <Modal show={locationSelectedForRemoval !== undefined} onHide={() => setLocationSelectedForRemoval(undefined)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {locationSelectedForRemoval && (
            <>
              <p>{`Are you sure you want to remove ${locationSelectedForRemoval.locationName}?`}</p>
              <LoaderButton
                block
                bsSize="large"
                bsStyle="primary"
                isLoading={removing}
                onClick={removeLocation}
              >
                Yes, remove
              </LoaderButton>
              <LoaderButton
                block
                bsSize="large"
                onClick={() => setLocationSelectedForRemoval(undefined)}
              >
                Cancel
              </LoaderButton>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
