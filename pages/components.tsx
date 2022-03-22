import { CustomerSignupForm } from "@/components/Customer/CustomerSignupForm";
import { GetServerSideProps } from "next";

export default function Components() {
  return (
    <div>
      <CustomerSignupForm />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  res,
  params,
}) => {
  if (process.env.NODE_ENV === "production") {
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
