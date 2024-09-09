// eslint-disable-next-line react/prop-types
export const NoTodos = ({ title }) => (
  <div className="flex flex-col justify-center items-center text-very_light_gray cursor-default">
    <span className="material-symbols-outlined">receipt_long</span>
    <p>{ title }</p>
  </div>
);
