import EditDeleteActions from "./EditDeleteActions";
import { formatEntryDate } from "../utils/date";

const SavedEntries = ({ entries, onEdit, onDelete }) => {
  if (entries.length === 0) return null;
  return <div className="entry-card table-card">
    <h2>Saved Entries</h2>
    <div className="table-container"><table>
      <thead><tr><th>#</th><th>Date</th><th>Cash</th><th>Commission</th><th>Receipt</th><th>Received Payment</th><th>Difference</th><th>Action</th></tr></thead>
      <tbody>{entries.map((entry, index) => <tr key={entry.id}>
        <td>{index + 1}</td><td>{formatEntryDate(entry.date)}{" "}</td><td>{entry.cash}</td><td>{entry.commission}</td><td>{entry.receipt}</td><td>{entry.receivedPayment}</td><td>{entry.difference}</td>
        <td><EditDeleteActions entry={entry} onEdit={onEdit} onDelete={onDelete} /></td>
      </tr>)}</tbody>
    </table></div>
  </div>;
};

export default SavedEntries;