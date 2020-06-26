import React, { useState } from "react";
import { API } from "aws-amplify";
import { PageHeader, Table, Modal } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import "./Divisions.css";
import Division from "./Division";
import LoaderButton from "../components/LoaderButton";

export default function Roster() {
  const { divisions, setDivisions } = useAppContext();
  const [divisionSelected, setDivisionSelected] = useState(undefined);
  const [newDivisionSelected, setNewDivisionSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [divisionSelectedForRemoval, setDivisionSelectedForRemoval] = useState(undefined);
  const [removing, setRemoving] = useState(false);

  const columns = {
    divisionNumber: "Division Number",
  };

  const addDivision = async (event, newDivision) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.post("atl-backend", "create/division", { body: newDivision });
    divisions.push(result);
    setDivisions([...divisions]);
    setIsLoading(false);
    setNewDivisionSelected(false);
  };

  const editDivision = async (event, updatedDivision) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.put("atl-backend", `update/division/${updatedDivision.divisionId}`, { body: updatedDivision });
    const index = divisions.findIndex((divisionInList) => divisionInList.divisionId === updatedDivision.divisionId);
    divisions[index] = result;
    setDivisions([...divisions]);
    setIsLoading(false);
    setDivisionSelected(undefined);
  };

  const removeDivision = async () => {
    setRemoving(true);
    const { divisionId } = divisionSelectedForRemoval;
    await API.del("atl-backend", `delete/division/${divisionId}`);
    const index = divisions.findIndex((divisionInList) => divisionInList.divisionId === divisionId);
    divisions.splice(index, 1);
    setDivisions([...divisions]);
    setRemoving(false);
    setDivisionSelectedForRemoval(undefined);
  };

  return (
    <div>
      <PageHeader>Divisions</PageHeader>
      <div className="Divisions">
        <Table bordered hover>
          <thead>
            <tr>
              {Object.keys(columns).map((key) => <th key={key}>{columns[key]}</th>)}
              <th />
            </tr>
          </thead>
          <tbody>
            {divisions.map((division) => (
              <tr
                key={division.divisionId}
                onClick={(e) => {
                  if (!e.target.className.includes("fas")) setDivisionSelected(division);
                }}
              >
                {Object.keys(columns).map((key) => <td key={key}>{division[key]}</td>)}
                <td>
                  <i className="fas fa-times-circle" onClick={() => setDivisionSelectedForRemoval(division)} />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={Object.keys(columns).length + 1} onClick={() => setNewDivisionSelected(true)}>
                + Add new division
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Modal show={divisionSelected !== undefined} onHide={() => setDivisionSelected(undefined)}>
        <Modal.Header closeButton><Modal.Title>Edit Division Details</Modal.Title></Modal.Header>
        <Modal.Body>
          <Division originalDivision={divisionSelected} saveDivision={editDivision} isLoading={isLoading} />
        </Modal.Body>
      </Modal>
      <Modal show={newDivisionSelected} onHide={() => setNewDivisionSelected(false)}>
        <Modal.Header closeButton><Modal.Title>Add New Division</Modal.Title></Modal.Header>
        <Modal.Body><Division saveDivision={addDivision} isLoading={isLoading} /></Modal.Body>
      </Modal>
      <Modal show={divisionSelectedForRemoval !== undefined} onHide={() => setDivisionSelectedForRemoval(undefined)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Division</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {divisionSelectedForRemoval && (
            <>
              <p>{`Are you sure you want to remove division #${divisionSelectedForRemoval.divisionNumber}?`}</p>
              <LoaderButton
                block
                bsSize="large"
                bsStyle="primary"
                isLoading={removing}
                onClick={removeDivision}
              >
                Yes, remove
              </LoaderButton>
              <LoaderButton
                block
                bsSize="large"
                onClick={() => setDivisionSelectedForRemoval(undefined)}
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
