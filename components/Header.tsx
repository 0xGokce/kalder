// components/Header.js

import HeaderButton from "./HeaderButton";

import styles from "../styles/Header.module.scss";
  
  type HeaderProps = {
    appTitle: string;
    headerButtons: HeaderButton[];
  };

  const Header = (props: HeaderProps) => (
    <div className={styles.Header}>
      <div className={styles.title}>{props.appTitle}</div>
      <div className="search"></div>
      {props.headerButtons.map(button => (
      <HeaderButton 
        key={button.path}
        path={button.path}
        label={button.label}
      />
    ))}<div className={styles.join}>Join</div>
    </div>
  );
  
  export default Header;

  // components/NavBar.tsx

