/* eslint-disable react/prop-types */
export const ListsHeader = ({ tiltle, delList }) => {
  return (
    <header>
      <div className="flex justify-between m-auto sm:w-[60%] md:w-[50%] xl:w-[40%]">
        <h2 className="text-2xl font-bold p-3 text-center mt-3 text-offwhite cursor-default">
          {tiltle}
        </h2>
        <div className="flex flex-col justify-center items-center p-3">
          <button onClick={delList}>
            <div className="flex gap-2">
              <span className="text-offwhite hover:text-very_light_gray">
                Delete List
              </span>
              <span className="material-symbols-outlined hover:text-very_light_gray">
                close
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
