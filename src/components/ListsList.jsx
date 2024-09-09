/* eslint-disable react/prop-types */
export const ListsList = ({ sharedTodos }) => {
  return (
    <section className="flex flex-col border-2 border-very_light_gray rounded mx-auto sm:w-[60%] md:w-[50%] xl:w-[40%]">
      {sharedTodos.map((todo) => (
        <div
          className="flex flex-col p-3 border-b border-very_light_gray"
          key={todo.id}
        >
          <p className="text-very_light_gray cursor-default">{todo.title}</p>
          <small className="text-very_light_gray text-right cursor-default">
            Shared by: {todo.sharedBy || "Unknown"}
          </small>
        </div>
      ))}
    </section>
  );
};
