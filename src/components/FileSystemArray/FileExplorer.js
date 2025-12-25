import React, { useState } from "react";
import "./fileExplorer.css";

// ========== INITIAL DATA ==========
// Flat array structure - each item knows its parent via parentId
// This is easier to update than nested tree structure
const initialData = [
  { id: 1, name: "root", type: "folder", parentId: null },
  { id: 2, name: "Documents", type: "folder", parentId: 1 },
  { id: 3, name: "readme.txt", type: "file", parentId: 2 },
];

let nextId = 4; // Simple ID counter

function FileExplorer() {
  const [items, setItems] = useState(initialData);
  const [expanded, setExpanded] = useState([1]); // Track which folders are open

  // ========== TOGGLE FOLDER ==========
  const toggleFolder = (id) => {
    setExpanded((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id) // Close: remove from array
        : [...prev, id] // Open: add to array
    );
  };

  // ========== ADD ITEM ==========
  const addItem = (parentId, type) => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    const newItem = { id: nextId++, name, type, parentId };
    setItems((prev) => [...prev, newItem]);

    // Auto-expand parent folder
    if (!expanded.includes(parentId)) {
      setExpanded((prev) => [...prev, parentId]);
    }
  };

  // ========== DELETE ITEM ==========
  // Must also delete all children recursively
  const deleteItem = (id) => {
    const idsToDelete = [id];
    const queue = [id];

    // BFS to find all descendants
    while (queue.length > 0) {
      const currentId = queue.pop();
      const children = items.filter((item) => item.parentId === currentId);
      children.forEach((child) => {
        idsToDelete.push(child.id);
        queue.push(child.id);
      });
    }

    setItems((prev) => prev.filter((item) => !idsToDelete.includes(item.id)));
  };

  // ========== RENDER TREE RECURSIVELY ==========
  const renderTree = (parentId, depth = 0) => {
    // Get all children of current parent
    const children = items.filter((item) => item.parentId === parentId);

    return children.map((item) => (
      <div key={item.id} className="item" style={{ paddingLeft: depth * 20 }}>
        {/* Icon - clickable for folders */}
        <span
          className="icon"
          onClick={() => item.type === "folder" && toggleFolder(item.id)}
        >
          {item.type === "folder" ? "📁" : "📄"}
        </span>

        {/* Name */}
        <span className="name">{item.name}</span>

        {/* Action Buttons */}
        <div className="actions">
          {item.type === "folder" && (
            <>
              <button onClick={() => addItem(item.id, "folder")}>+Folder</button>
              <button onClick={() => addItem(item.id, "file")}>+File</button>
            </>
          )}
          {item.parentId !== null && (
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          )}
        </div>

        {/* Render children if folder is expanded */}
        {item.type === "folder" &&
          expanded.includes(item.id) &&
          renderTree(item.id, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="file-explorer">
      <h3>File Explorer</h3>
      {renderTree(null)}
    </div>
  );
}

export default FileExplorer;
