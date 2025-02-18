import { useNavigate } from "react-router-dom";

// Redirecting to the previous page
export function useMoveBack() {
  const navigate = useNavigate();
  return () => navigate(-1);
}
