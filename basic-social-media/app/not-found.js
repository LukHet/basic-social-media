"use client";

import Image from "next/image";

export default function ErrorPage() {
  return (
    <div>
      <h1 className="absolute inset-y-1/2 z-50 text-center w-full text-2xl backdrop-opacity-50 font-bold">
        Error 404 - we couldn't find page you requested :(
      </h1>
      <Image className="blur-lg" fill src="/Crying_Cat.png" alt="Crying cat" />
    </div>
  );
}
