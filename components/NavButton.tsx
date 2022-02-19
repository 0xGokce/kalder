import Link from "next/link";

import styles from "../styles/NavButton.module.scss";

type NavButtonProps = {
    path: string,
    label: string,
}

const NavButton = (props:NavButtonProps) => (
  <Link href={props.path}>
    <div className={styles.NavButton}>
      <span className="Label">{props.label}</span>
    </div>
  </Link>
);

export default NavButton;