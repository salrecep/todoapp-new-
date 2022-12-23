import React, { useState, useEffect } from "react";
import axios from "axios";

/* 
HTTP Methods - axios
- get (veri isteme)
- post (veri ekleme)
- put/patch (veri güncelleme)
- delete (veri silme)
*/

const TodoApp = () => {
  const [todos, setTodos] = useState(null);
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [success, setSuccess] = useState(true);
  const [edit, setEdit] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  console.log("1. sırada Constructor Çalıştı");

  const deletetodo = (id) => {
    axios
      .delete(`http://localhost:3004/todos/${id}`)
      .then((response) => {
        setResult(true);
        setSuccess(true);
        setResultMessage("Registered successfully deleted");
      })
      .catch((error) => {
        setResult(true);
        setSuccess(false);
        setResultMessage("Registered failed deleted");
      });
  };

  function changeTodoCompleted(todo) {
    const updateTodo = {
      ...todo,
      completed: !todo.completed,
    };
    axios
      .put(`http://localhost:3004/todos/${todo.id}`, updateTodo)
      .then((response) => {
        setResult(true);
        setSuccess(true);
        setResultMessage("Update successful");
      })
      .catch(() => {
        setResult(true);
        setSuccess(false);
        setResultMessage("Update failed");
      });
  }

  useEffect(() => {
    axios
      .get("http://localhost:3004/todos")
      .then((response) => {
        console.log("useEffect ile Veri Çekildi...");
        console.log(response.data);

        setTodos(response.data);
        console.log(
          "useState Güncellendiği İçin Construcktor yeniden çalışıyor..."
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [result]);

  const formuDenetle = (event) => {
    event.preventDefault();
    //validation
    if (title === "") {
      alert("This field cannot be left blank...");
      return;
    }
    //create and save todo
    const newTodo = {
      id: String(new Date().getTime()),
      title: title,
      date: new Date(),
      completed: false,
    };

    axios
      .post("http://localhost:3004/todos", newTodo)
      .then((response) => {
        setTitle("");
        setResult(true);
        setSuccess(true);
        setResultMessage("Registration successful...");
      })
      .catch((erros) => {
        setResult(true);
        setSuccess(false);
        setResultMessage("Registration failed...");
        console.log(erros);
      });
  };

  function todoUpdate(event) {
    event.preventDefault();

    if (editTitle === "") {
      alert("This field cannot be left blank...");
      return;
    }
    //update todo and send server
    const updatedTodo = {
      ...editTodo,
      title: editTitle,
    };
    axios
      .put(`http://localhost:3004/todos/${updatedTodo.id}`, updatedTodo)
      .then((response) => {
        setResult(true);
        setSuccess(true);
        setResultMessage("Updated successful...");
        setEdit(false);
      })
      .catch((error) => {
        setResult(true);
        setSuccess(false);
        setResultMessage("Updated failed...");
      });
  }

  if (todos === null) {
    return console.log("Veri olmadığı Render Çalışmadı İf Bloğu çalıştı");
  }

  return (
    <div
      style={{
        border: "1px solid gray",
        display: "flex",
        width: "100%",
        height: "100%",
        padding: "20px",
        boxShadow: "2px 2px 2px 2px",
        borderRadius: "10px",
        flexDirection: "column",
        marginTop: "60px",
        backgroundColor: "#03d3",
      }}
      className="container">
      {result === true && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}>
          <div
            className={`${
              success ? "alert alert-success" : "alert alert-danger"
            }`}
            role="alert">
            <p>{resultMessage}</p>
            <div className="d-flex justify-content-center">
              <button
                onClick={() => setResult(false)}
                className={
                  success
                    ? "btn btn-sm btn-outline-success"
                    : "btn btn-sm btn-outline-danger"
                }>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {console.log("Veri Çekildikten Sonra Render Çalıştı")}
      <div className="row my-1">
        <form onSubmit={formuDenetle}>
          <div className="input-group mb-5">
            <input
              type="text"
              className="form-control"
              placeholder="Enter the to-do..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button className="btn btn-success" type="submit">
              ADD
            </button>
          </div>
        </form>
      </div>

      {edit === true && (
        <div className="row my-1">
          <form onSubmit={todoUpdate}>
            <div className="input-group mb-5">
              <input
                type="text"
                className="form-control"
                placeholder="Enter the to-do..."
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
              />
              <button
                onClick={() => {
                  setEdit(false);
                }}
                className="btn btn-danger"
                type="submit">
                Cancel
              </button>
              <button className="btn btn-success" type="submit">
                Update
              </button>
            </div>
          </form>
        </div>
      )}

      {todos.map((todo) => (
        <div
          key={todo.id}
          className="alert alert-warning d-flex justify-content-between align-items-center"
          role="alert">
          <div>
            <h1
              style={{
                textDecoration:
                  todo.completed === true ? "line-through" : "none",
                color: todo.completed === true ? "red" : "black",
              }}>
              {todo.title}
            </h1>
            <p>{new Date(todo.date).toLocaleString()}</p>
          </div>
          <div>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                onClick={() => {
                  setEdit(true);
                  setEditTodo(todo);
                  setEditTitle(todo.title);
                }}
                type="button"
                className="btn btn-sm btn-warning">
                Edit
              </button>
              <button
                onClick={() => deletetodo(todo.id)}
                type="button"
                className="btn btn-sm btn-danger">
                Delete
              </button>
              <button
                onClick={() => changeTodoCompleted(todo)}
                type="button"
                className="btn btn-sm btn-primary">
                {todo.completed === true ? "Undone" : "Done"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoApp;
