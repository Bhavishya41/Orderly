export default function OrderFilterBar({ filterStatus, setFilterStatus, filterUser, setFilterUser, filterDate, setFilterDate, onClear }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
      <select
        value={filterStatus}
        onChange={e => setFilterStatus(e.target.value)}
        className="bg-gray-800 text-gray-100 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input
        type="text"
        placeholder="Search User"
        value={filterUser}
        onChange={e => setFilterUser(e.target.value)}
        className="bg-gray-800 text-gray-100 border border-gray-700 rounded px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        type="date"
        value={filterDate}
        onChange={e => setFilterDate(e.target.value)}
        className="bg-gray-800 text-gray-100 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onClick={onClear}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow transition hover:from-purple-700 hover:to-rose-600"
      >
        Clear
      </button>
    </div>
  );
}
