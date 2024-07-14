import { CoffeeIcon, HeartIcon } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-4 px-4 my-4 mx-0 w-full text-sm sm:flex-row sm:justify-between sm:items-center sm:px-6 sm:my-12 sm:mx-auto sm:max-w-3xl sm:h-5">
      <div className="flex gap-2 justify-end">
        <img
          className="size-5"
          src="/logo.png"
          alt="Auth.js Logo"
        />
          Made on 
          <CoffeeIcon fill="#422006" className="text-yellow-950" />
          {/* <HeartIcon fill="#dc2626" className={"text-red-600"} />  */}
          by <Link href="https://github.com/basil08">@basil08</Link>
      </div>
    </footer>
  )
}
