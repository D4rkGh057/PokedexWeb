import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./User.css";

export const UserPage = () => {
  const location = useLocation();
  const username = location.state;
  const navigate = useNavigate();

  if (!username) {
    Swal.fire({
      title: "Error!",
      text: "You must be logged in to access this page",
      icon: "error",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });

    return null; // Return null or a loading spinner while waiting for the user to confirm the Swal
  }

  return (
    <div>
      <h1 className="title">Welcome, {username}!</h1>
      <p>This is your user page.</p>
    </div>
  );
};
