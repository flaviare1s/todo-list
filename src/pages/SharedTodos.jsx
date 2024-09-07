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
          {sharedTodos.length !== 0 ? (
          <div className="flex flex-col border-2 border-offwhite rounded mx-auto w-full">
              <div className="flex flex-col">
              {sharedTodos.map(todo => (
                <div key={todo.id} className='p-3 border-b'>
                  <p>{todo.title}</p>
                  <small className='text-gray-500 flex justify-end'>Shared by: {todo.ownerEmail}</small>
                </div>
              ))}
            </div>
          </div>
          ) : (
              <div className="flex flex-col justify-center items-center text-gray-500 cursor-pointer">
                <span className="material-symbols-outlined">receipt_long</span>
                <p>No shared todos</p>
              </div>
          )}
      
      </div>
    </section>
  );
};
