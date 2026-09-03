const EditDeleteActions = ({ entry, onEdit, onDelete }) => <>
  <button onClick={() => onEdit(entry)}>Edit</button>
  <button onClick={() => onDelete(entry.id)} style={{ marginLeft: "6px" }}>Delete</button>
</>;

export default EditDeleteActions;