import { magicConnector } from "@/lib/magicConnector";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import { useCallback } from "react";

export const useLogin = () => {
  const router = useRouter();
  return {
    loginWithMagic: useCallback(async (email: string) => {
      const magic = magicConnector(email);
      await magic.activate();
      const didToken = await magic.magic.user.getIdToken();

      if (!didToken) {
        throw new Error("Error logging in");
      }

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify({
          email,
        }),
      });
      if (res.status === 200) {
        router.push("/");
      } else {
        throw new Error(await res.text());
      }
    }, []),
  };
};
