import { Loader } from "../components/Loader"
import { useForm } from "react-hook-form"
import { addTodo, deleteTodo, getTodos } from "../firebase/todo"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"

export const Todos = () => {
  const { register, handleSubmit, reset } = useForm()
  const [todos, setTodos] = useState(null)

  function createTodo(data) {
    const todoData = {
      ...data,
      status: 'active'
    }
    setTodos((prevTodos) => [...prevTodos, { ...todoData, id: Date.now().toString() }])
    addTodo(todoData).then(() => {
      toast.success('Todo created!')
    }).catch(() => {
      toast.error('Something went wrong!')
    })
    reset()
  }

  function listTodos() {
    getTodos().then((res) => {
      setTodos(res)
    })
  }

  function removeTodo(id) {
    const del = confirm('Are you sure you want to delete this todo?')
    if (del) {
      deleteTodo(id).then(() => {
        toast.success('Todo deleted!')
        listTodos()
      })
    }
  }

  useEffect(() => {
    listTodos()
  }, [])

  return (
    <>
      <form className="flex flex-col justify-center items-center m-auto p-3" onSubmit={handleSubmit(createTodo)}>
        <h1 className="text-4xl font-bold p-3">TODO</h1>
        <input type="text" id="title" placeholder="Click to create a new todo" className="p-3 rounded-sm bg-inherit w-full placeholder:text-center"
        {...register('title', { required: true })} />
      </form>
      <section className="px-3">
        {todos ?
          <div className="flex flex-col border-2 border-[#f5f5f5] rounded mx-auto md:w-[40%]">
            {todos.map((todo) => (
              <div className="flex justify-between p-3 border-b" key={todo.id}>
                <p className="text-left cursor-pointer">{todo.title}</p>
                <div className="flex gap-2">
                  <button>
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => removeTodo(todo.id)}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
            ))} 
          </div>  
          : <Loader />
      }
      </section>
    </>
  )
}
