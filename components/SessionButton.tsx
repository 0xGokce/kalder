import { useUser } from "../lib/useUser";
import HeaderButton from "./HeaderButton";

/**
 * TODO: actually implement the useUser, fix the data type
 * TODO: Add dropdown of menu options for signed-in user (including log-out, edit profile etc)
 */

export default function SessionButton() {
  const user = useUser();
  if (user) {
    return (
      <div>
        <p>{user.publicAddress}</p>
      </div>
    );
  } else {
    return <HeaderButton path="/login" label="Log In"></HeaderButton>;
  }
}
