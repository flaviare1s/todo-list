import { Loader } from "../components/Loader"
import { useForm } from "react-hook-form"
import { addTodo, getTodos } from "../firebase/todo"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"

export const Todos = () => {
  const { register, handleSubmit } = useForm()
  const [todos, setTodos] = useState(null)

  function createTodo(data) {
    const todoData = {
      ...data,
      status: 'active'
    }
    addTodo(todoData).then(() => {
      toast.success('Todo created!')
    }).catch(() => {
      toast.error('Something went wrong!')
    })
  }

  function listTodos() {
    getTodos().then((res) => {
      setTodos(res)
    })
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
          <div className="flex flex-col border-2 border-[#f5f5f5] rounded-sm mx-auto md:w-[40%]">
            {todos.map((todo) => (
              <div key={todo.id}>
                <p className="text-left p-2 cursor-pointer">{todo.title}</p>
              </div>
            ))} 
          </div>  
          : <Loader />
      }
      </section>
    </>
  )
}
