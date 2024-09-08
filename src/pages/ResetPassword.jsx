import { useForm } from "react-hook-form";
import { resetPassword } from "../firebase/auth";
import { Link } from "react-router-dom";

export const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    resetPassword(data.email);
  };

  return (
    <main className="mt-3 mb-5 flex flex-col justify-center items-center m-auto p-3">
      <form className="w-full md:w-[40%] sm:w-[60%]" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl mb-2">Reset Password</h1>
        <hr />
        <div className="my-2 flex flex-col">
          <label htmlFor="email">E-mail</label>
          <input
            className="p-2 rounded bg-inherit text-offwhite border border-offwhite"
            type="email"
            placeholder="E-mail"
            {...register("email", { required: "E-mail required" })}
          />
          {errors.email && (
            <small className="text-red-500">{errors.email.message}</small>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="mt-1 w-100 p-2 rounded bg-dark_gray text-offwhite hover:bg-inherit hover:text-offwhite hover:border-2" 
          >
            Recuperar Senha
          </button>
          <Link to="/login" className="text-yellow-500 hover:text-opacity-50">
            <small className="text-very_light_gray hover:text-offwhite">Login</small>
          </Link>
        </div>
      </form>
    </main>
  );
};
