import React, { useState } from "react";
import "./FileExplorer.css";

const FileExplorer = () => {
  const [items, setItems] = useState([
    {
      id: "root",
      name: "root",
      type: "folder",
      children: [],
    },
  ]);
  const [showInput, setShowInput] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [currentParent, setCurrentParent] = useState(null);
  const [newItemType, setNewItemType] = useState(null);

  const handleAddClick = (parentId, type) => {
    setCurrentParent(parentId);
    setNewItemType(type);
    setShowInput(true);
    setNewItemName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName.trim(),
      type: newItemType,
      children: newItemType === "folder" ? [] : null,
    };

    const updateTree = (items) => {
      return items.map((item) => {
        if (item.id === currentParent) {
          return {
            ...item,
            children: [...(item.children || []), newItem],
          };
        }
        if (item.children) {
          return {
            ...item,
            children: updateTree(item.children),
          };
        }
        return item;
      });
    };
    const updatedList = updateTree(items);
    setItems(updatedList);

    setShowInput(false);
    setNewItemName("");
    setCurrentParent(null);
    setNewItemType(null);
  };

  const deleteItem = (itemId) => {
    const deleteFromTree = (items) => {
      return items.filter((item) => {
        if (item.id === itemId) {
          return false;
        }
        if (item.children) {
          item.children = deleteFromTree(item.children);
        }
        return true;
      });
    };
    const updatedList = deleteFromTree(items);
    setItems(updatedList);
  };

  const FileItem = ({ item }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
      <div className="file-item">
        <div className="file-row">
          {item.type === "folder" && (
            <span className="expander" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "▼" : "▶"}
            </span>
          )}
          <span className="item-name">
            {item.type === "folder" ? "📁" : "📄"} {item.name}
          </span>
          {item.id !== "root" && (
            <button className="delete-btn" onClick={() => deleteItem(item.id)}>
              Delete
            </button>
          )}
          {item.type === "folder" && (
            <div className="action-buttons">
              <button onClick={() => handleAddClick(item.id, "folder")}>Add Folder</button>
              <button onClick={() => handleAddClick(item.id, "file")}>Add File</button>
            </div>
          )}
        </div>
        {item.type === "folder" && isExpanded && item.children && (
          <div className="children">
            {item.children.map((child) => (
              <FileItem key={child.id} item={child} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer">
      {items.map((item) => (
        <FileItem key={item.id} item={item} />
      ))}

      {showInput && (
        <div className="input-overlay">
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={`Enter ${newItemType} name`}
              autoFocus
            />
            <div className="form-buttons">
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowInput(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
