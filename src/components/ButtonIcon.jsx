/* eslint-disable react/prop-types */
export const ButtonIcon = ({ onClick, todo, title }) => {
  return (
    <button onClick={() => onClick(todo)} className="hover:text-[rgb(128,255,255)] transition-colors">
      <span className="material-symbols-outlined">{title}</span>
    </button>
  );
};
