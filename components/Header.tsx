// components/Header.tsx

import HeaderButton from "./HeaderButton";
import SessionButton from "./SessionButton";

import styles from "../styles/Header.module.scss";
import Link from "next/link";

type HeaderProps = {
  appTitle: string;
  headerButtons: HeaderButton[];
};

/**
 * NOTE: I delegated the user state down to the SessionButton to keep the Header simple
 * I think Session Header button is more complicated than the others
 * so I split it out into its own type
 */

const Header = (props: HeaderProps) => {
  return (
    <div className={styles.Header}>
      <Link href="/">
        <div className={styles.title}>{props.appTitle}</div>
      </Link>
      <div className="search"></div>
      {props.headerButtons.map((button) => (
        <HeaderButton
          key={button.path}
          path={button.path}
          label={button.label}
        />
      ))}
      <SessionButton />
    </div>
  );
};

export default Header;

// components/NavBar.tsx
