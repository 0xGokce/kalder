import { LoginForm } from "@/components/LoginForm";
import { magicConnector } from "@/lib/magicConnector";
import Router from "next/router";
import { FormEvent, useCallback, useState } from "react";
import { useUser } from "../lib/hooks";

export default function Login() {
  const user = useUser({ redirectTo: "/", redirectIfFound: true });

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errorMsg) setErrorMsg("");

    const body = {
      email: e.currentTarget.email.value,
    };

    try {
      const [connector] = magicConnector;
      const didToken = await connector.activate({
        email: body.email,
        showUI: true,
      });

      if (!didToken) {
        throw new Error("Error logging in");
      }

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify(body),
      });
      if (res.status === 200) {
        Router.push("/");
      } else {
        throw new Error(await res.text());
      }
    } catch (error) {
      console.error("An unexpected error happened occurred:", error);
      setErrorMsg((error as any).message);
    }
  }, []);

  return (
    <div>
      <div className="login">
        <LoginForm errorMessage={errorMsg} onSubmit={handleSubmit} />
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
