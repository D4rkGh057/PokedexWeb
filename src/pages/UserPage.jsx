import { useLocation } from "react-router-dom";

export const UserPage = () => {
    const location = useLocation();
    const username = location.state;

    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <p>This is your user page.</p>
        </div>
    );
}