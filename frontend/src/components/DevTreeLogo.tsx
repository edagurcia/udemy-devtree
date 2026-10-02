import { Link } from "react-router-dom";

export const DevTreeLogo = () => {
  return (
    <Link to={"/"}>
      <img src="/logo.svg" className="w-full block" alt="Logo" />
    </Link>
  );
};
