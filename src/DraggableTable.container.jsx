import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Input, Button, Typography } from "antd";
import { Table } from "./Table";
import { v4 as uuid } from "uuid";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeftLong,
  faRightLong,
  faTrashCan,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

const Styles = styled.div`
  padding: 1rem;
  width: 80vw;

  button {
    width: 80vw;
    margin-top: 1rem;
  }

  table {
    border-spacing: 0;

    tr {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid grey;

      :last-child {
        td {
          width: 100%;
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      display: flex;
      flex-direction: row;
      align-items: left;

      :first-child {
        width: 17vw;
      }

      :last-child {
        width: 100%;
        border-right: 0;
      }
    }
  }
`;

const HeaderElement = ({ header, subHeader }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }}
  >
    <Typography.Title level={4}>{header}</Typography.Title>
    <Typography.Text style={{ textAlign: "left" }}>{subHeader}</Typography.Text>
  </div>
);

function App() {
  const [data, setData] = useState([]);
  const handleChange = useCallback(
    (row) => (e) => {
      setData((prevData) => {
        const updatedData = prevData.map((item) => {
          if (item.id === row.original.id) {
            return {
              ...item,
              text: e.target.value,
            };
          }
          return item;
        });
        return updatedData;
      });
    },
    []
  );

  const handleIndent = useCallback((row, amount) => {
    setData((prevData) => {
      return prevData.map((item, index) => {
        if (item.id === row.original.id) {
          const indentLevel = getIndentLevel(item.indentLevel, amount);
          return {
            ...item,
            indentLevel,
          };
        }
        return item;
      });
    });
  }, []);

  const handleAddRow = useCallback(() => {
    setData((prevData) => {
      return [
        ...prevData,
        {
          id: uuid(),
          text: "",
          indentLevel:
            prevData.length === 0
              ? 0
              : prevData[prevData.length - 1].indentLevel,
        },
      ];
    });
  }, []);

  const handleDeleteRowAndItsChildren = useCallback(({ original }) => {
    setData((prevData) => {
      const indexToBeDeleted = _.findIndex(
        prevData,
        (item) => item.id === original.id
      );
      let indexesToBeDeleted = [original.id];
      for (let i = indexToBeDeleted + 1; i < prevData.length; i++) {
        if (prevData[i].indentLevel > original.indentLevel)
          indexesToBeDeleted.push(prevData[i].id);
        else break;
      }
      const updatedData = _.filter(
        prevData,
        (item) => !_.includes(indexesToBeDeleted, item.id)
      );
      return updatedData;
    });
  }, []);

  const getInputStyles = useCallback(({ original }) => {
    const { indentLevel } = original;
    const opacity = Math.min(1, Math.max(0.4, 1 - 0.1 * indentLevel));
    return {
      opacity: indentLevel === 1 ? 1 : opacity,
    };
  }, []);

  const getIndentLevel = useCallback((indentLevel, amount) => {
    return indentLevel + amount < 0 ? 0 : indentLevel + amount;
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: (
          <HeaderElement
            header="Actions"
            subHeader="Move, Indent, Outdent, Delete"
          />
        ),
        accessor: "text-1",
        width: "180px",
        height: "30px",
        Cell: ({ row }) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                height: "4vh",
              }}
            >
              <FontAwesomeIcon
                icon={faLeftLong}
                size="sm"
                className="icon"
                onClick={() => handleIndent(row, -1)}
              />
              <FontAwesomeIcon
                icon={faRightLong}
                size="sm"
                onClick={() => handleIndent(row, 1)}
                className="icon"
              />
              <FontAwesomeIcon
                icon={faTrashCan}
                size="sm"
                onClick={() => handleDeleteRowAndItsChildren(row)}
                className="icon"
              />
            </div>
          );
        },
      },
      {
        Header: (
          <HeaderElement
            header="Standard"
            subHeader="The text of the standard"
          />
        ),
        accessor: "text",
        height: "30px",
        Cell: ({ row }) => {
          return (
            <div
              style={{
                marginLeft: `${row.original.indentLevel * 20}px`,
                width: "16vw",
                padding: "0px",
              }}
            >
              <Input
                addonBefore={
                  <div
                    style={{
                      width: "2rem",
                      height: "100%",
                      backgroundColor: "grey",
                    }}
                  />
                }
                type="text"
                value={row.original.text}
                onChange={handleChange(row)}
                style={getInputStyles(row)}
              />
            </div>
          );
        },
      },
    ],
    [handleIndent, handleDeleteRowAndItsChildren, handleChange, getInputStyles]
  );

  function saveDataToLocalStorage() {
    localStorage.setItem('curriculumData', JSON.stringify(data));
  }
  
  function loadDataFromLocalStorage() {
    const data = localStorage.getItem('curriculumData');
    if (data !== null) setData(JSON.parse(data))
  }

  return (
    <div style={{ width: "100%", justifyContent: "center" }}>
      <Styles>
        <Typography.Title level={2}>Mathematics</Typography.Title>
        <hr />
        <Table columns={columns} data={data} setData={setData} />

        <Button
          type="primary"
          className="button"
          onClick={handleAddRow}
          icon={<FontAwesomeIcon icon={faCirclePlus} />}
        >
          Add a standard
        </Button>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '12px'}}>
        <Button
          type="primary"
          onClick={() => loadDataFromLocalStorage()}
        >
          Load
        </Button>
        <Button
          type="primary"
          onClick={() => saveDataToLocalStorage()}
        >
          Save
        </Button>
        </div>
      </Styles>
    </div>
  );
}

export default App;
