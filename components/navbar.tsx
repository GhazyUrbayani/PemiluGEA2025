"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";

function Navbar() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin"; // Assuming role is stored in session

  if (status === "loading") {
    return (
      <header>
        <nav className="flex w-full items-center justify-between gap-12 border-b border-metallic-gray bg-vader-black px-8 py-4 md:px-24">
          <Skeleton className="h-16 w-24 bg-metallic-gray" />
          <Skeleton className="h-6 w-full max-w-lg rounded-full bg-metallic-gray" />
        </nav>
      </header>
    );
  }

  return (
    <header>
      <nav className="flex w-full items-center justify-between border-b border-metallic-gray bg-vader-black px-8 py-4 shadow-lg md:px-24">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logos/pemilu logo fix.jpg"
            alt="PEMILU GEA 2025"
            width={60}
            height={60}
            className="h-16 w-auto rounded-md border border-sand-gold"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <span className="hidden font-death-star text-xl text-lightsaber-yellow md:block">
            PEMILU GEA 2025
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 text-base font-bold lg:flex">
          <li>
            <Link
              href="/"
              className="font-trade-gothic text-neutral-cream transition-colors hover:text-cyan-saber"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/kandidat"
              className="font-trade-gothic text-neutral-cream transition-colors hover:text-lightsaber-yellow"
            >
              Kandidat
            </Link>
          </li>
          
          {/* Show Vote link only if user is logged in */}
          {session && (
            <li>
              <Link
                href="/vote"
                className="font-trade-gothic text-yoda-green transition-colors hover:text-lightsaber-yellow"
              >
                Vote
              </Link>
            </li>
          )}
          
          <li>
            <Link
              href="/hasil"
              className="font-trade-gothic text-neutral-cream transition-colors hover:text-r2d2-blue"
            >
              Hasil
            </Link>
          </li>

          {/* Admin Dashboard - only for admins */}
          {isAdmin && (
            <li>
              <Link
                href="/admin/dashboard"
                className="font-trade-gothic text-mace-purple transition-colors hover:text-lightsaber-yellow"
              >
                Admin
              </Link>
            </li>
          )}

          {/* Auth Buttons */}
          {session ? (
            <li className="flex items-center gap-4">
              <span className="font-trade-gothic text-sm text-sand-gold">
                {session.user?.email}
              </span>
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                variant="outline"
                size="sm"
                className="border-sith-red bg-transparent font-trade-gothic text-sith-red hover:bg-sith-red hover:text-neutral-cream"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </li>
          ) : (
            <li>
              <Link href="/auth/sign-in">
                <Button
                  variant="default"
                  className="border border-cyan-saber bg-space-dark font-trade-gothic text-cyan-saber hover:bg-cyan-saber hover:text-vader-black"
                >
                  Login
                </Button>
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger className="flex lg:hidden">
            <Menu className="size-8 text-lightsaber-yellow" />
          </SheetTrigger>
          <SheetContent className="border-metallic-gray bg-vader-black py-16">
            <ul className="flex flex-col items-center gap-6 text-center text-lg font-bold">
              <li>
                <Link
                  href="/"
                  className="font-trade-gothic text-neutral-cream transition-colors hover:text-cyan-saber"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/kandidat"
                  className="font-trade-gothic text-neutral-cream transition-colors hover:text-lightsaber-yellow"
                >
                  Kandidat
                </Link>
              </li>
              
              {session && (
                <li>
                  <Link
                    href="/vote"
                    className="font-trade-gothic text-yoda-green transition-colors hover:text-lightsaber-yellow"
                  >
                    Vote
                  </Link>
                </li>
              )}
              
              <li>
                <Link
                  href="/hasil"
                  className="font-trade-gothic text-neutral-cream transition-colors hover:text-r2d2-blue"
                >
                  Hasil
                </Link>
              </li>

              {isAdmin && (
                <li>
                  <Link
                    href="/admin/dashboard"
                    className="font-trade-gothic text-mace-purple transition-colors hover:text-lightsaber-yellow"
                  >
                    Admin
                  </Link>
                </li>
              )}

              {session ? (
                <li className="mt-4 flex flex-col items-center gap-2">
                  <span className="font-trade-gothic text-sm text-sand-gold">
                    {session.user?.email}
                  </span>
                  <Button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    variant="outline"
                    size="sm"
                    className="border-sith-red bg-transparent font-trade-gothic text-sith-red hover:bg-sith-red hover:text-neutral-cream"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </li>
              ) : (
                <li className="mt-4">
                  <Link href="/auth/sign-in">
                    <Button
                      variant="default"
                      className="border border-cyan-saber bg-space-dark font-trade-gothic text-cyan-saber hover:bg-cyan-saber hover:text-vader-black"
                    >
                      Login
                    </Button>
                  </Link>
                </li>
              )}
            </ul>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

export default Navbar;
