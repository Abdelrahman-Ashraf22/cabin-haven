import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCurrentUser } from "../../services/apiAuth";

import toast from "react-hot-toast";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }) => {
      // update the data manually in the cache using queryclient instead of invalidate
      queryClient.setQueryData(["user"], user);
      // queryClient.invalidateQueries({ queryKey: ["user"], });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { updateUser, isUpdating };
}
