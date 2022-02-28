// components/Header.tsx

import HeaderButton from "./HeaderButton";

import { useUser } from "../lib/hooks";

import styles from "../styles/Header.module.scss";

type HeaderProps = {
  appTitle: string;
  headerButtons: HeaderButton[];
};

const Header = (props: HeaderProps) => {
  const user = useUser();
  return (
    <div className={styles.Header}>
      <div className={styles.title}>{props.appTitle}</div>
      <div className="search"></div>
      {user ? (
        <>
          (
          {props.headerButtons.map((button) => (
            <HeaderButton path={button.path} label={button.label} />
          ))}
          ){" "}
        </>
      ) : (
        <>
          (
          {props.headerButtons.map((button) => (
            <HeaderButton path={button.path} label={button.label} />
          ))}
          ){" "}
        </>
      )}
    </div>
  );
};

export default Header;

// components/NavBar.tsx
