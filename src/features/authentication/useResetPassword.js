import { useMutation } from "@tanstack/react-query";
import { resetPassword as resetPasswordApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useResetPassword() {
  const { mutate: resetPassword, isLoading } = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success("Check your email for the reset link");
    },
  });
  return { resetPassword, isLoading };
}
