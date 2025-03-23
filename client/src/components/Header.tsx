import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav>
        <h1>My App</h1>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
