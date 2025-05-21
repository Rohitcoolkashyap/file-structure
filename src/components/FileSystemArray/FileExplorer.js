import React, { useState } from "react";

let idCounter = 5;

const initialItems = [
  { id: 1, name: "root", type: "folder", parentId: null },
  { id: 2, name: "Documents", type: "folder", parentId: 1 },
  { id: 3, name: "todo.txt", type: "file", parentId: 2 },
  { id: 4, name: "Photos", type: "folder", parentId: 1 },
];

function FileExplorer() {
  const [items, setItems] = useState(initialItems);
  const [expanded, setExpanded] = useState([1]);
  const [editing, setEditing] = useState(null);
  const [newName, setNewName] = useState("");

  const toggle = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const add = (parentId, type) => {
    const name = prompt(`Enter ${type} name`);
    if (name) {
      setItems((prev) => [...prev, { id: idCounter++, name, type, parentId }]);
      setExpanded((prev) => [...new Set([...prev, parentId])]);
    }
  };

  const remove = (id) => {
    const toDelete = [id];
    let queue = [id];
    while (queue.length) {
      const current = queue.pop();
      const children = items.filter((i) => i.parentId === current);
      children.forEach((child) => {
        toDelete.push(child.id);
        queue.push(child.id);
      });
    }
    setItems((prev) => prev.filter((i) => !toDelete.includes(i.id)));
  };

  const rename = (id) => {
    const item = items.find((i) => i.id === id);
    setEditing(id);
    setNewName(item.name);
  };

  const save = (id) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, name: newName } : i))
    );
    setEditing(null);
    setNewName("");
  };

  const renderItems = (parentId, level = 0) => {
    return items
      .filter((i) => i.parentId === parentId)
      .map((item) => (
        <div key={item.id} style={{ marginLeft: level * 15 }}>
          {/* collapse */}
          <span
            onClick={() => item.type === "folder" && toggle(item.id)}
            style={{ cursor: "pointer" }}
          >
            {item.type === "folder" ? "📁 " : "📄 "}
          </span>
          {/* <span
            onClick={() => item.type === "folder" && toggle(item.id)}
            style={{ cursor: "pointer" }}
          >
            {item.type === "folder"
              ? expanded.includes(item.id)
                ? "📂 "
                : "📁 "
              : "📄 "}
          </span> */}
          {editing === item.id ? (
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => save(item.id)}
              autoFocus
            />
          ) : (
            <span style={{ marginRight: "4px" }}>
              {item.type == "folder" ? "F" : "f"} {item.name}
            </span>
          )}

          <button
            style={{ marginRight: "4px" }}
            onClick={() => add(item.id, "folder")}
          >
            +Folder
          </button>
          <button
            style={{ marginRight: "4px" }}
            onClick={() => add(item.id, "file")}
          >
            +File
          </button>
          <button
            style={{ marginRight: "4px" }}
            onClick={() => rename(item.id)}
          >
            Edit
          </button>
          {item.id !== 1 && (
            <button onClick={() => remove(item.id)}>Delete</button>
          )}

          {item.type === "folder" &&
            expanded.includes(item.id) &&
            renderItems(item.id, level + 1)}
        </div>
      ));
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h3>Simple File Explorer</h3>
      {renderItems(null)}
    </div>
  );
}

export default FileExplorer;
