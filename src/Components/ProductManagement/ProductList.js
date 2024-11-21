import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTable, useFilters } from "react-table";
import "./ProductList.css";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Loader from "../Loader/Loader";
import { product } from "../Store/GenericStore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function ProductList() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const products = useSelector((state) => state?.products?.list || []);

  const [filterInput, setFilterInput] = useState({ name: "" });

  useEffect(() => {
    if (products.length === 0) {
      dispatch(product("api/Products"));
    }
  }, [dispatch, products.length]);

  const columns = React.useMemo(
    () => [
      {
        Header: "SKU",
        accessor: "sku",
      },
      {
        Header: "Name",
        accessor: "name",
        Filter: () => (
          <input
            value={filterInput.name}
            onChange={(e) => {
              setFilterInput({ ...filterInput, name: e.target.value });
            }}
            placeholder="Search by name"
          />
        ),
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="btn btn-edit"
              onClick={() => handleEdit(row.original)} // Call handleEdit with the original product
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-delete"
              onClick={() => handleDelete(row.original.id)}
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [filterInput]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      { columns, data: Array.isArray(products) ? products : [] },
      useFilters
    );

  const handleEdit = (product) => {
    // Navigate to the Add Product page and pass the product data
    console.log(product);
    navigate('/addProduct', { state: { product } });
  };

  const handleDelete = (productId) => {
    console.log("Delete product with ID:", productId);
  };

  return (
    <div className="add-product-container">
      <div className="col-12 row">
        <div className="col-10">
          <h2>Product List</h2>
        </div>
        <div className="col-1 mt-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/addProduct')} // Navigate to Add Product page
          >
            <FaPlus />
            &nbsp;&nbsp;Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="center-loader">
          <Loader />
        </div>
      ) : (
        <table className="product-table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductList;
