export const ShareListComponent = ({ openShareModal }) => {
  return (
    <div className="w-full sm:w-[60%] md:w-[50%] xl:w-[40%] flex flex-col m-auto">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold p-3 text-center">My Todos</h2>
        <button
          onClick={openShareModal}
          className="py-3 px-2 flex items-center justify-center gap-2"
        >
          <span>Share List</span>
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  )
}
