/* This example requires Tailwind CSS v2.0+ */
import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useUser } from "hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useMemo } from "react";
import { classNames } from "utils/classNames";

export default function Header() {
  const router = useRouter();
  const path = router.asPath;
  const user = useUser();

  const routes = useMemo(() => {
    if (user) {
      return [
        {
          name: "About",
          route: "/about",
        },
        {
          name: "Account",
          route: "/account",
        },
      ];
    } else {
      return [
        {
          name: "About",
          route: "/about",
        },
        {
          name: "Log In",
          route: "/login",
        },
        {
          name: "Sign Up",
          route: "/signup",
        },
      ];
    }
  }, [user, path]);
  return (
    <Popover className="relative bg-white">
      <div className="flex justify-between items-center px-4 py-6 sm:px-6 md:justify-start md:space-x-10">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <Link href="/">
            <p className="font-['FreightBigPro'] text-3xl cursor-pointer">
              Kalder
            </p>
          </Link>
        </div>
        <div className="-mr-2 -my-2 md:hidden">
          <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
            <span className="sr-only">Open menu</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
          {routes.map(({ route, name }) => (
            <Link href={route} passHref key={route}>
              <a
                className={classNames(
                  "m-4 font-bold whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-sm shadow-sm",
                  route.includes("/about")
                    ? ""
                    : router.asPath.includes(route) // active route
                    ? "text-white bg-primary hover:bg-hover"
                    : "text-primary hover:text-gray-900 border-primary"
                )}
              >
                {name}
              </a>
            </Link>
          ))}
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
        >
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <Link href="/">
                  <p className="font-['FreightBigPro'] text-3xl cursor-pointer">
                    Kalder
                  </p>
                </Link>
                <div className="-mr-2">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                    <span className="sr-only">Close menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
            </div>
            <div className="py-6 px-5">
              <div className="mt-6">
                <Link href="/about" passHref>
                  <a className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium">
                    About
                  </a>
                </Link>
                <Link href="/signup" passHref>
                  <a className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary">
                    Sign up
                  </a>
                </Link>
                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  Existing customer?{" "}
                  <Link href="/login" passHref>
                    <a className="text-primary hover:text-primary">Sign in</a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
