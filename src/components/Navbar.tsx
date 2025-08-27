import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header>
            <Link to={'/home'}>Home</Link>
            <Link to={'/todo'}>To-Do</Link>
            <button type="button">Sign Out</button>
        </header>
    );
}