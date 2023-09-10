import { useState } from 'react';
import Link from 'next/link';

function NavBar() {
  const [navbar, setNavbar] = useState(false);
  return (
    <div>
      <nav className="w-full bg-slate-200 fixed top-0 left-0 right-0 z-10">
        <div className="justify-between bg-slate-200 px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-3 md:py-5 md:block">
              {/* LOGO */}
              <Link href="/">
                <h2 className="text-2xl text-black-600 font-bold ">LOGO</h2>
              </Link>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? 'p-12 md:p-0 block' : 'hidden'
                }`}
            >
              <ul className="h-screen md:h-auto items-center justify-center md:flex ">
                <li className=" text-xl text-black py-2 md:px-6 text-center border-b-2 md:border-b-0  hover:bg-purple-900  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent">
                  <Link href="/" onClick={() => setNavbar(!navbar)}>
                    Wallet
                  </Link>
                </li>
                <li className=" text-xl text-black py-2 px-6 text-center  border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent">
                  <Link href="/" onClick={() => setNavbar(!navbar)}>
                    Portfolio
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            Metamask wallet
            {/* <div className='connectButton' onClick={connect}>{isConnected ? (address.slice(0, 4) + "..." + address.slice(38)) : "Connect"}</div> */}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;