import { CustomerSignupForm } from "@/components/Customer/CustomerSignupForm";

export default function Signup() {
  return (
    <>
      <div className="min-h-full flex w-3/4 mx-auto">
        <div className="hidden lg:block my-auto mx-auto flex-col w-1/2">
          <h1 className="text-6xl font-['Canela'] mb-4">
            Hey there! Welcome to Kalder!
          </h1>
          <h2 className="text-3xl mt-4">
            We just need a few basic pieces of information to get you started.
          </h2>
        </div>
        <CustomerSignupForm />
      </div>
    </>
  );
}
