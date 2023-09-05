import Swal from "sweetalert2";

export const showAdminRoleAlert = () => {
  Swal.fire({
    icon: "error",
    title: "Action Not Allowed",
    text: "You do not have admin permissions to perform this action.",
    confirmButtonText: "OK",
  });
};
