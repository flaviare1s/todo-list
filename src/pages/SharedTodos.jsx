// SharedTodos.jsx
import { useState, useEffect } from 'react';
import { getSharedTodo } from '../firebase/share';
import { Loader } from '../components/Loader';

export const SharedTodos = () => {
  const [sharedTodos, setSharedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedTodos = async () => {
      try {
        const todos = await getSharedTodo();
        setSharedTodos(todos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedTodos();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className='px-3'>
      <div className="w-full md:w-[40%] flex flex-col m-auto">
        <h2 className="text-2xl font-bold p-3 text-center">Shared Todos</h2>
        <div className="flex flex-col border-2 border-offwhite rounded mx-auto w-full">
          {sharedTodos.length === 0 ? (
            <p>No todos shared with you.</p>
          ) : (
              <div className="flex flex-col">
              {sharedTodos.map(todo => (
                <p className="p-3 border-b" key={todo.id}>{todo.title}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
