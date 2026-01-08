/* eslint-disable react/prop-types */
export const TodoFilter = ({ filter, setFilter }) => {
  const filters = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "shared", label: "Shared" },
    { value: "read", label: "Read Only" },
    { value: "write", label: "Write" },
  ];

  return (
    <div className="flex justify-center my-4">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="px-4 py-2 rounded bg-[hsl(0,0%,12%)] text-[hsl(210,18%,96%)] border border-[hsl(210,14%,72%)] focus:border-[rgb(128,255,255)] focus:outline-none cursor-pointer w-full sm:w-[60%] md:w-[50%] xl:w-[40%]"
      >
        {filters.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
};
