import notFound from "../assets/error404.webp";

export const NotFound = () => {
  return (
    <section className="flex flex-col items-center justify-center m-auto h-screen">
      <h1 className="text-2xl md:text-5xl">Page Not Found!!!</h1>
      <img className="w-[150px] mt-5" src={notFound} alt="Not Found" />
    </section>
  );
};
