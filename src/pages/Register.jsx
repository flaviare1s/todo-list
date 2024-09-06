import { useForm } from "react-hook-form";
import { loginGoogle, registerUser } from "../firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logoGoogle from "../assets/logoGoogle.png";

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  function reg(data) {
    registerUser(data.name, data.email, data.password)
      .then(() => {
        toast.success("Welcome!");
        navigate("/todos");
      })
      .catch((error) => {
        toast.error(`Error: ${error.code}`);
      });
  }

  function handleEntrarGoogle() {
    loginGoogle().then(() => {
      toast.success("Welcome!");
      navigate("/todos");
    });
  }

  return (
    <main className="mt-3 mb-5 flex flex-col justify-center items-center m-auto p-3">
      <form className="w-full md:w-[40%]" onSubmit={handleSubmit(reg)}>
        <h1 className="text-3xl mb-2">Register</h1>
        <hr />
        <div className="my-2 flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            className="p-2 rounded bg-offwhite text-black"
            type="text"
            id="name"
            {...register("name", {
              required: "Name required",
            })}
          />
          {errors.email && (
            <small className="text-red-500">{errors.name.message}</small>
          )}
        </div>
        <div className="my-2 flex flex-col">
          <label htmlFor="email">E-mail</label>
          <input
            className="p-2 rounded bg-offwhite text-black"
            type="email"
            id="email"
            {...register("email", {
              required: "E-mail required",
              pattern: {
                value: /[\w.-]+@[\w-]+\.[\w-.]+/gi,
                message: "Invalid e-mail",
              },
            })}
          />
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}
        </div>
        <div className="mb-2 flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            className="p-2 rounded bg-offwhite text-black"
            type="password"
            id="password"
            {...register("password", {
              required: "Password required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <small className="text-red-500">{errors.password.message}</small>
          )}
        </div>
        <div>
          <button
            className="mt-1 w-full border-2 p-2 rounded hover:bg-white hover:text-black"
            type="submit"
          >
            Register
          </button>
          <button
            onClick={handleEntrarGoogle}
            className="mt-1 w-full flex justify-center gap-2 items-center border-2 p-2 rounded bg-white text-black"
            type="button"
          >
            <img className="w-6" src={logoGoogle} alt="Imagem do Google" />
            Login with Google
          </button>
        </div>
        <div className="d-flex flex-col gap-2 justify-content-between mt-2">
          <small className="text-yellow-500 hover:text-opacity-50">
            Do you have an account? <Link to="/login">Login</Link>
          </small>
          <small className="text-yellow-500 hover:text-opacity-50">
            Forgot your password? <Link to="/reset-password">Click here</Link>
          </small>
        </div>
      </form>
    </main>
  );
};
