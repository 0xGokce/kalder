// components/NavBar.tsx

import styles from '../styles/NavBar.module.scss';

import NavButton from "./NavButton";

import navButtons from '../config/navButtons';

type NavButton = {
  path: string; 
  label: string; 
}

type NavBarProps = {
    navButtons: NavButton[];
}

const NavBar = (props:NavBarProps) => (
  <div className={styles.NavBar}>
    {props.navButtons.map(button => (
      <NavButton 
        key={button.path}
        path={button.path}
        label={button.label}
      />
    ))}
  </div>
);

export default NavBar;