import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";

import { ChevronRightIcon } from "lucide-react";

import { site } from "@/configs/site";

// const team = [
//   { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
//   { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
//   { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
//   { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
//   { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
//   { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
//   { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
// ];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary/5">
        <div className="bg-grid-white/10 dark:bg-grid-black/10 absolute inset-0 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="container relative grid gap-8 py-16 md:grid-cols-[3fr,2fr] md:py-20 lg:py-24">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-lg bg-background/95 px-3 py-1 text-sm font-medium">
              🎯 Our Mission
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
              Crafting Excellence in Every Stitch
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              From humble beginnings to industry leadership, our journey is
              defined by quality, innovation, and customer satisfaction.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="font-medium transition hover:text-primary"
              >
                Home
              </Link>
              <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-primary">About</span>
            </div>
          </div>

          <div className="flex gap-6 md:gap-8 md:justify-self-end lg:gap-12">
            <div className="flex flex-col justify-center gap-2">
              <div className="text-4xl font-bold lg:text-6xl">108+</div>
              <div className="font-medium text-muted-foreground">Designs</div>
            </div>
            <div className="flex flex-col justify-center gap-2">
              <div className="text-4xl font-bold lg:text-6xl">20+</div>
              <div className="font-medium text-muted-foreground">
                Years Experience
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="h-72 bg-[url('/about-bags.jpg')] bg-cover bg-center bg-no-repeat md:h-80 lg:h-96"></div>
        <div className="bottom-0 left-0 right-0 top-0 z-10 h-full lg:container lg:absolute">
          <div className="bg-primary py-6 text-primary-foreground md:p-8 lg:absolute lg:right-0 lg:top-1/2 lg:max-w-[600px] lg:rounded-3xl lg:px-6">
            <div className="container space-y-2">
              <h2 className="text-xl font-semibold md:text-2xl lg:text-3xl">
                Why {site.name}?
              </h2>
              <p>
                NBU Bags is designed for those who value both style and
                functionality in their everyday carry. Our bags are crafted with
                premium materials, ensuring durability without compromising on
                elegance. Whether you&apos;re heading to work, traveling, or
                just stepping out, NBU Bags offers the perfect blend of fashion
                and practicality. Each design is thoughtfully created to provide
                ample storage, smart compartments, and a comfortable carry
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary/10">
        <div className="container grid items-center gap-8 py-16 md:gap-10 md:py-20 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div className="relative">
            <Image
              className="w-full rounded-3xl"
              src="/kishan.jpg"
              alt="Founder"
              height={400}
              width={400}
            />
          </div>
          <div className="space-y-6 lg:space-y-8">
            <h2 className="max-w-[20ch] text-balance text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
              Elevate Your Journey: Discover Exceptional Bags
            </h2>

            <p className="max-w-[56ch] text-balance">
              Since 2002, we&apos;ve grown from a humble beginning with just 5
              machines to a state-of-the-art production line with 108 machines.
              Our mission has always been simple: to craft the perfect backpack,
              backed by a 1-year warranty for your peace of mind.
            </p>
            <p className="max-w-[56ch] text-balance">
              The early days in the wholesale market were challenging, but our
              commitment to quality and customer satisfaction pushed us forward.
              Now, we&apos;re excited to bring our exceptional bags directly to
              you, reaching customers worldwide through our digital platforms.
            </p>
            <p className="max-w-[50ch]">
              Join us on this journey—because every adventure deserves the
              perfect bag.
            </p>

            <div className="flex items-center gap-4">
              <Image
                className="h-16 w-16 rounded-full object-cover"
                src="/kishan.jpg"
                alt="Founder"
                height={20}
                width={20}
              />
              <div>
                <strong className="text-lg">Kisan prasad Timalsina</strong>
                <p>CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container grid items-center gap-8 py-16 md:gap-10 md:py-20 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div className="space-y-6 lg:space-y-8">
            <h2 className="max-w-[20ch] text-balance text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
              Elevate Your Journey: Discover Exceptional Bags
            </h2>

            <p className="max-w-[56ch] text-balance">
              As the son of the founder and Managing Director of our company,
              I’ve had the privilege of witnessing our journey from the very
              beginning. Born in 2004, I grew up watching our company flourish
              in the wholesale market. At the time of my birth, we operated with
              just 10 to 15 machines. Today, I’m proud to say we’ve expanded to
              over 108 machines, a testament to our hard work and dedication.
            </p>
            <p className="max-w-[56ch] text-balance">
              Our main goal has always been—and continues to be—building trust
              and fostering strong, comfortable relationships with our loyal
              customers. Quality has been at the heart of everything we do, and
              we are committed to delivering the perfect backpack, backed by a
              1-year warranty.
            </p>
            <p className="max-w-[50ch]">
              Now, I am proud to lead our Nepali bag brand into the digital
              world. We are excited to offer our exceptional products to
              customers across the globe, making it easier than ever to connect
              with our brand and share in our journey.
            </p>
            <p className="max-w-[50ch] text-balance">
              The future is bright, and we’re moving forward with the same
              passion and commitment that started it all. Thank you for being a
              part of our story—because every adventure deserves the perfect
              bag.
            </p>

            <div className="flex items-center gap-4">
              <Image
                className="h-16 w-16 rounded-full object-cover"
                src="/kushal.jpg"
                alt="Kushal Timalsina "
                height={20}
                width={20}
              />
              <div>
                <strong className="text-lg">Kushal Timalsina</strong>
                <p>Managing Director</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              className="w-full rounded-3xl"
              src="/kushal.jpg"
              alt="Kushal Timalsina"
              height={400}
              width={400}
            />
          </div>
        </div>
      </section>

      <section className="bg-primary/10">
        <div className="container grid items-center gap-8 py-16 md:gap-10 md:py-20 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div className="relative">
            <Image
              className="w-full rounded-3xl"
              src="/anil.jpg"
              alt="Anil Sapkota"
              height={400}
              width={400}
            />
          </div>
          <div className="space-y-6 lg:space-y-8">
            <h2 className="max-w-[20ch] text-balance text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
              Elevate Your Journey: Discover Exceptional Bags
            </h2>

            <p className="max-w-[56ch] text-balance">
              It’s been 8 incredible years being part of the NBU Bags family. I
              started my journey in the bag packing department, learning the
              ropes from the ground up. After 5 years of dedication and growth,
              I was proud to be promoted to the accounts section. Today, I’m
              honored to serve as an all-rounder manager, overseeing all
              departments and contributing to the continued success of our
              company.
            </p>
            <p className="max-w-[56ch] text-balance">
              When I first joined, we had around 50 machines running. Now, we’ve
              more than doubled that, with over 108 machines producing
              high-quality backpacks, each backed by a 1-year warranty. Our
              growth has been fueled by a commitment to trust, quality, and
              building strong relationships with our loyal customers.
            </p>
            <p className="max-w-[56ch] text-balance">
              Now, it’s time to take the next big step—hello, digital world!
              We’re excited to bring our exceptional Nepali bag brand to
              customers worldwide through our digital platforms. I feel truly
              blessed to be part of the NBU Bags family and to witness this
              amazing journey firsthand.
            </p>
            <p className="max-w-[50ch]">
              Thank you for being part of our story—because every adventure
              deserves the perfect bag.
            </p>

            <div className="flex items-center gap-4">
              <Image
                className="h-16 w-16 rounded-full object-cover"
                src="/anil.jpg"
                alt="Founder"
                height={20}
                width={20}
              />
              <div>
                <strong className="text-lg">Anil Sapkota</strong>
                <p>All Rounder Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-10 text-secondary-foreground">
        <div className="container flex items-center justify-between gap-2">
          <h2 className="text-xl font-medium md:text-2xl">
            Questions? Our experts will help find proper bag for you
          </h2>
          <Button variant="outline" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>

      {/* <section className="container py-16 md:py-20 lg:py-24">
        <Carousel
          opts={{ align: "start", slidesToScroll: 1, loop: true }}
          className="grid items-center gap-8 md:grid-cols-[1fr,2fr] md:gap-10"
        >
          <div className="space-y-8 md:space-y-14">
            <div className="space-y-4">
              <h2 className="max-w-[20ch] text-balance text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
                Meet Our Team of Creators
              </h2>
              <p className="text-balance">
                Our team is passionate about design, quality, and innovation,
                ensuring every NBU Bag meets the highest standards. With
                expertise and dedication, we create bags that blend style and
                functionality seamlessly.
              </p>
            </div>
            <div className="flex gap-2">
              <CarouselPrevious className="static h-10 w-10" />
              <CarouselNext className="static h-10 w-10" />
            </div>
          </div>
          <div>
            <CarouselContent className="-ml-8 max-w-[100vw] md:max-w-[60vw]">
              {team.map((person, index) => (
                <CarouselItem
                  key={index}
                  className="basis-[100%] select-none space-y-4 pl-8 sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
                >
                  <Image
                    src={person.photo}
                    width={400}
                    height={400}
                    alt={person.name}
                    className="w-full rounded-md"
                  />
                  <div className="text-center">
                    <strong className="text-lg">{person.name}</strong>
                    <div className="text-sm text-muted-foreground">
                      {person.role}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>
      </section> */}
    </>
  );
}
