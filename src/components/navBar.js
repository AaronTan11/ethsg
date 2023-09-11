import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  connect,
  listenForAccountChanges,
} from "@/metamaskSDK/metamaskFunctions";
function NavBar() {
  const [navbar, setNavbar] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const requestAccountAccess = async () => {
    const account = await connect();
    setCurrentAccount(account);
  };

  useEffect(() => {
    // Retrieve from localStorage on component mount
    const storedAccount = localStorage.getItem("currentAccount");
    if (storedAccount) {
      setCurrentAccount(storedAccount);
    }

    // Listen for account changes
    const updateCurrentAccount = (newAccount) => {
      setCurrentAccount(newAccount);
    };

    listenForAccountChanges(updateCurrentAccount);

    // Optionally: Unsubscribe logic if needed
    return () => {
      // Your unsubscribe logic here
    };
  }, []);

  useEffect(() => {
    // Store to localStorage on state change
    if (currentAccount) {
      localStorage.setItem("currentAccount", currentAccount);
    }
  }, [currentAccount]);

  const isConnected = Boolean(currentAccount);
  const address = currentAccount;

  return (
    <div>
      <nav className="w-full ">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8 border-b-0.5 border-slate-200">
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
              {/* LOGO */}
              <Link href="/">
                <h2 className="text-2xl text-black-600 font-[Ultra] ">
                  CLownz
                </h2>
              </Link>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? "p-12 md:p-0 block" : "hidden"
                }`}
            >
              <ul className="h-screen md:h-auto items-center justify-center md:flex ">
                <li className="font-mono text-black py-2 md:px-6 text-center border-b-2 md:border-b-0  border-purple-900  md:hover:font-bold rounded-lg">
                  <Link
                    href="/home"
                    onClick={() => setNavbar(!navbar)}
                  >
                    Home
                  </Link>
                </li>
                <li className="font-mono text-black py-2 md:px-6 text-center border-b-2 md:border-b-0  border-purple-900  md:hover:font-bold rounded-lg">
                  <Link
                    href="/wallet"
                    onClick={() => setNavbar(!navbar)}
                  >
                    My Wallet
                  </Link>
                </li>
                <li className="font-mono text-black py-2 md:px-6 text-center border-b-2 md:border-b-0  border-purple-900  md:hover:font-bold rounded-lg">
                  <Link
                    href="/portfolio"
                    onClick={() => setNavbar(!navbar)}
                  >
                    Portfolio
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <Button
              className="connectButton"
              onClick={requestAccountAccess}
            >
              {isConnected
                ? address.slice(0, 4) +
                "..." +
                address.slice(38)
                : "Connect"}
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
