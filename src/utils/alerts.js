import Swal from "sweetalert2";

export const showAdminRoleAlert = (id) => {
  if (id !== 1 && id !== 2) {
    Swal.fire({
      icon: "error",
      title: "Action Not Allowed",
      text: "You do not have admin permissions to perform this action.",
      confirmButtonText: "OK",
    });
    return false;
  } else {
    return true;
  }
};
