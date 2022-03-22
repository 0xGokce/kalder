import { getLoginSession } from "@/lib/auth";
import { useUser } from "hooks/useUser";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";

export default function Account() {
  const user = useUser();

  const router = useRouter();
  const handleSignout = useCallback(async () => {
    fetch("/api/logout").then((res) => {
      router.push("/");
      router.reload();
    });
  }, [user, router]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button className="bg-primary text-white p-4" onClick={handleSignout}>
          Sign out
        </button>
      </div>
    </div>
  );
}

/**
 * @description If there is no user present then this will redirect to home
 */

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  params,
}) => {
  const user = await getLoginSession(req);
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
};
