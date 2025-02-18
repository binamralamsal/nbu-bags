"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  ChevronRightIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";

import { ContactForm } from "@/features/contact-entries/components/contact-form";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-primary/5">
        <div className="bg-grid-white/10 dark:bg-grid-black/10 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="container relative grid gap-4 py-16 md:grid-cols-[3fr,2fr] md:py-20 lg:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-lg bg-background/95 px-3 py-1 text-sm font-medium">
              🤝 Let&apos;s Connect
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
              Get in Touch with Our Team
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Have questions or want to discuss a project? We&apos;re here to
              help you succeed.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="font-medium transition hover:text-primary"
              >
                Home
              </Link>
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-primary">Contact</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-8 py-16 md:grid-cols-2 md:gap-12 md:py-24">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Let&apos;s Start a Conversation
          </h2>
          <p className="text-lg text-muted-foreground">
            Fill out the form and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex h-full flex-col justify-center gap-4 rounded-md border bg-primary/10 p-6 shadow-sm lg:p-8">
              <MapPinIcon className="text-primary" />
              <h3 className="text-lg font-bold">Office Address</h3>
              <div>
                1421 Coburn Hollow Road Metamora, Near Center Point, IL 61548.
              </div>
            </div>
            <div className="flex h-full flex-col justify-center gap-4 rounded-md border bg-primary/10 p-6 shadow-sm lg:p-8">
              <PhoneIcon className="text-primary" />
              <h3 className="text-lg font-bold">Call us</h3>
              <div>
                Let&apos;s work together towards a common goal - get in touch!
              </div>
              <Button variant="link" className="inline-block p-0" asChild>
                <Link
                  href="https://api.whatsapp.com/send?phone=9779818385342"
                  target="_blank"
                >
                  +977 981-8385342{" "}
                </Link>
              </Button>
            </div>
            <div className="flex h-full flex-col justify-center gap-4 rounded-md border bg-primary/10 p-6 shadow-sm lg:col-span-2 lg:p-8">
              <MailIcon className="text-primary" />
              <h3 className="text-lg font-bold">Email us</h3>
              <div>
                We&apos;re on top of things and aim to respond to all inquiries
                within 24 hours.
              </div>
              <Button variant="link" className="inline-block p-0" asChild>
                <Link href="mailto:info@nexorith.com">info@nexorith.com</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="self-center rounded-xl border bg-card p-6 shadow-sm md:p-8">
          <ContactForm />
        </div>
      </section>

      <section className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1838367786397!2d-73.96519668459418!3d40.75889797932764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258f07d5da561%3A0x61f6aa300ba8339d!2sGrand%20Central%20Terminal!5e0!3m2!1sen!2sus!4v1645564756670!5w=100%25"
          className="h-[400px] w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location"
        />
      </section>
    </main>
  );
}
