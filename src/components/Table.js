import React, { useState } from 'react';
import { API } from 'aws-amplify';
import { Table, Modal } from 'react-bootstrap';
import LoaderButton from './LoaderButton';
import './Table.css';

export default ({ columns, rows, setRows, itemType, EditForm }) => {
  const [rowSelectedForEdit, setRowSelectedForEdit] = useState(undefined);
  const [rowSelectedForRemoval, setRowSelectedForRemoval] = useState(undefined);
  const [addingRow, setAddingRow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addRow = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    const result = await API.post("atl-backend", `create/${itemType}`, { body });
    rows.push(result);
    setRows([...rows]);
    setIsLoading(false);
    setAddingRow(false);
  };

  const editRow = async (event, body) => {
    event.preventDefault();
    setIsLoading(true);
    const rowId = body[`${itemType}Id`];
    const result = await API.put("atl-backend", `update/${itemType}/${rowId}`, { body });
    const index = rows.findIndex((rowInList) => rowInList[`${itemType}Id`] === rowId);
    rows[index] = result;
    setRows([...rows]);
    setIsLoading(false);
    setRowSelectedForEdit(undefined);
  };

  const removeRow = async () => {
    setIsLoading(true);
    const rowId = rowSelectedForRemoval[`${itemType}Id`];
    await API.del("atl-backend", `delete/${itemType}/${rowId}`);
    const index = rows.findIndex((rowInList) => rowInList[`${itemType}Id`] === rowId);
    rows.splice(index, 1);
    setRows([...rows]);
    setIsLoading(false);
    setRowSelectedForRemoval(undefined);
  };

  const capitalizedItemType = itemType.charAt(0).toUpperCase() + itemType.slice(1);

  return (
    <>
      <div className="table-container">
        <Table bordered hover>
          <thead>
            <tr>
              {Object.keys(columns).map((key) => <th key={key}>{columns[key]}</th>)}
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row[`${itemType}Id`]}
                onClick={(e) => {
                  if (!e.target.className.includes("fas")) setRowSelectedForEdit(row);
                }}
              >
                {Object.keys(columns).map((key) => <td key={key}>{row[key]}</td>)}
                <td className="remove-row">
                  <i className="fas fa-times-circle" onClick={() => setRowSelectedForRemoval(row)} />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={Object.keys(columns).length + 1} onClick={() => setAddingRow(true)}>
                {`+ Add new ${itemType}`}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <Modal show={rowSelectedForEdit !== undefined} onHide={() => setRowSelectedForEdit(undefined)}>
        <Modal.Header closeButton>
          <Modal.Title>{`Edit ${capitalizedItemType} Details`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditForm original={rowSelectedForEdit} save={editRow} isLoading={isLoading} />
        </Modal.Body>
      </Modal>
      <Modal show={addingRow} onHide={() => setAddingRow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{`Add New ${capitalizedItemType}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditForm save={addRow} isLoading={isLoading} />
        </Modal.Body>
      </Modal>
      <Modal show={rowSelectedForRemoval !== undefined} onHide={() => setRowSelectedForRemoval(undefined)}>
        <Modal.Header closeButton>
          <Modal.Title>{`Remove ${capitalizedItemType}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {rowSelectedForRemoval && (
            <>
              <p>{`Are you sure you want to remove this ${itemType}?`}</p>
              <LoaderButton
                block
                bsSize="large"
                bsStyle="primary"
                isLoading={isLoading}
                onClick={removeRow}
              >
                Yes, remove
              </LoaderButton>
              <LoaderButton
                block
                bsSize="large"
                onClick={() => setRowSelectedForRemoval(undefined)}
              >
                Cancel
              </LoaderButton>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
