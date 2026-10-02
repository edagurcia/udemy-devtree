import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { DevTreeLogo } from "../components/DevTreeLogo";

const AuthLayout = () => {
  return (
    <>
      <div className="bg-slate-800 min-h-screen">
        <div className="max-w-lg mx-auto pt-10 px-5">
          <DevTreeLogo />
        </div>

        <div className="py-10 px-5">
          <Outlet />
        </div>
      </div>

      <Toaster position="top-right" expand={true} richColors={true} />
    </>
  );
};

export default AuthLayout;
