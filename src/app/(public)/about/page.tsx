import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ChevronRightIcon } from "lucide-react";

import { site } from "@/configs/site";

const team = [
  { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
  { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
  { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
  { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
  { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
  { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
  { name: "Emma Watson", role: "Founder", photo: "/founder.jpg" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-secondary/10">
        <div className="container grid gap-4 py-10 md:grid-cols-[3fr,2fr] md:py-14 lg:py-16">
          <div className="space-y-4">
            <h2 className="text-balance text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl">
              Your Style, Your Statement Discover Premium Bags at {site.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="font-semibold transition hover:text-primary"
              >
                Home
              </Link>
              <ChevronRightIcon className="h-5 w-5" />
              <Link
                href="/about"
                className="font-semibold transition hover:text-primary"
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex gap-4 md:gap-6 md:justify-self-end lg:gap-8">
            <div className="flex flex-col justify-center gap-1">
              <div className="text-4xl font-bold lg:text-6xl">50+</div>
              <div className="font-semibold">Items Sale</div>
            </div>
            <div className="flex flex-col justify-center gap-1">
              <div className="text-4xl font-bold lg:text-6xl">400%</div>
              <div className="font-semibold">Return on investment</div>
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

      <section className="bg-secondary/10">
        <div className="container grid items-center gap-8 py-16 md:gap-10 md:py-20 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div className="relative">
            <Image
              className="w-full rounded-3xl"
              src="/founder.jpg"
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
              At NBU Bags, we are dedicated to crafting stylish, high-quality,
              and functional bags for every occasion. Our collection combines
              timeless elegance with modern trends, ensuring a perfect match for
              your lifestyle.
            </p>
            <p className="max-w-[56ch] text-balance">
              We also prioritize a seamless shopping experience with secure
              transactions, easy navigation, and responsive customer support. At
              NBU Bags, every bag is more than an accessory—it’s a statement of
              style and confidence.
            </p>

            <div className="flex items-center gap-4">
              <Image
                className="h-16 w-16 rounded-full object-cover"
                src="/founder.jpg"
                alt="Founder"
                height={20}
                width={20}
              />
              <div>
                <strong className="text-lg">Kushal Timilsina</strong>
                <p>CEO and Founder</p>
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

      <section className="container py-16 md:py-20 lg:py-24">
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
      </section>
    </>
  );
}
