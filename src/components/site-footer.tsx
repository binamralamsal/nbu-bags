import Link from "next/link";

import { Button } from "./ui/button";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-secondary pt-16 text-secondary-foreground md:pt-20 lg:pt-24">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[2fr,1fr,1fr,1fr]">
        <div className="space-y-4 md:max-w-[30ch] lg:space-y-6">
          <h2 className="text-3xl font-bold">NBU Bags</h2>
          <p className="text-secondary-foreground/80">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore,
            maiores?
          </p>
        </div>
        <div className="space-y-4 lg:space-y-6">
          <h2 className="text-xl font-bold">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="#"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/#"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Career
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Become a Partner
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4 lg:space-y-6">
          <h2 className="text-xl font-bold">Community</h2>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Career
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="font-medium text-secondary-foreground/80 transition hover:text-secondary-foreground"
              >
                Become a Partner
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4 lg:space-y-6">
          <h2 className="text-xl font-bold">Follow us on</h2>
          <ul className="flex flex-wrap gap-1">
            <li>
              <Button
                variant="secondary"
                size="icon"
                className="brightness-125 transition hover:brightness-200"
              >
                <FacebookIcon className="h-4 w-4 fill-secondary-foreground" />
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                size="icon"
                className="brightness-125 transition hover:brightness-200"
              >
                <InstagramIcon className="h-4 w-4" />
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                size="icon"
                className="brightness-125 transition hover:brightness-200"
              >
                <TwitterIcon className="h-4 w-4 fill-secondary-foreground" />
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                size="icon"
                className="brightness-125 transition hover:brightness-200"
              >
                <LinkedinIcon className="h-4 w-4 fill-secondary-foreground" />
              </Button>
            </li>
          </ul>
        </div>
      </div>

      <hr className="container my-8 border-secondary-foreground/10" />

      <div className="container pb-8 text-secondary-foreground/90">
        Copyrights © {new Date().getFullYear()} NBU
      </div>
    </footer>
  );
}
