/* eslint-disable react/prop-types */
export const ButtonIcon = ({ onClick, todo, title }) => {
  return (
    <button onClick={() => onClick(todo)}>
      <span className="material-symbols-outlined">{title}</span>
    </button>
  );
};
