import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUserHandle } from "../api/DevTreeAPI";
import { HandleInfo } from "../components/HandleInfo";

export const HandleView = () => {
  const params = useParams();
  const handle = params.handle!;

  const { data, error, isLoading } = useQuery({
    queryFn: () => getUserHandle(handle),
    queryKey: ["handle", handle],
    retry: 1,
  });

  if (isLoading) return "Cargando...";

  if (error) return <Navigate to={"/404"} />;

  if (data) return <HandleInfo data={data} />;
};
