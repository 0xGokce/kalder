import Link from "next/link";

import styles from "../styles/HeaderButton.module.scss";

type HeaderButton = {
    path: string; 
    label: string; 
  }

type HeaderButtonProps = {
    path: string,
    label: string,
}

const HeaderButton = (props:HeaderButtonProps) => (
  <Link href={props.path}>
    <div className={styles.HeaderButton}>
      <span className="Label">{props.label}</span>
    </div>
  </Link>
);

export default HeaderButton;