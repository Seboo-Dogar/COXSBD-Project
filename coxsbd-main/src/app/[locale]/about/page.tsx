import Image from "next/image";
import {
  Award,
  Calendar,
  Globe,
  Heart,
  MapPin,
  MessageSquareQuote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-red-600 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          {/* About Hero Image */}
          <div className="relative w-full h-80 md:h-150">
            <a href="/images/about-image.png" download>
              <Image
                src="/images/about-image.png"
                alt="Team collaboration"
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
              />
            </a>
          </div>
        </div>
        <div className="container mx-auto px-4 py-24 relative z-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">About Our Company</h1>
            <p className="text-xl mb-8">
              Were on a mission to simplify business licensing and help
              entrepreneurs succeed in their ventures. With over a decade of
              experience, we become the trusted partner for businesses across
              the country.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-black text-lg font-medium hover:text-red-600 hover:bg-white cursor-pointer"
              >
                Our Services
              </Button>
              <Button
                size="lg"
                className="bg-white text-black text-lg font-medium hover:text-red-600 hover:bg-white cursor-pointer"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-4">
              Our Journey
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Our Story & Mission
            </h2>
            <p className="text-slate-700 mb-4">
              Founded in 2010, our agency began with a simple goal: to help
              entrepreneurs navigate the complex world of business licensing.
              What started as a small team of three has grown into a
              comprehensive agency serving thousands of clients nationwide.
            </p>
            <p className="text-slate-700 mb-6">
              Our mission is to empower businesses by simplifying regulatory
              compliance, allowing entrepreneurs to focus on what they do best -
              running their businesses. We believe that administrative hurdles
              shouldnt stand in the way of innovation and growth.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Our Values</h3>
                  <p className="text-sm text-slate-600">
                    Integrity, Excellence, Innovation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Globe className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Our Vision</h3>
                  <p className="text-sm text-slate-600">
                    A world where business compliance is effortless
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://t4.ftcdn.net/jpg/04/43/96/87/360_F_443968747_udcdhnwG9QDIDbfptJPJYtqcItot7Sql.jpg"
              alt="Our office"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-red-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-4">
              Our Impact
            </Badge>
            <h2 className="text-3xl font-bold text-slate-800">
              Our Growth in Numbers
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">10+</div>
              <p className="text-slate-700">Years of Experience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">5,000+</div>
              <p className="text-slate-700">Licenses Processed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">85</div>
              <p className="text-slate-700">Team Members</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">98%</div>
              <p className="text-slate-700">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Photos Carousel */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-4">
            Our Events
          </Badge>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Memorable Moments
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Take a glimpse into our company culture and the events that bring
            our team together.
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {[
              {
                title: "Annual Conference 2023",
                location: "Grand Hotel",
                date: "November 2023",
              },
              {
                title: "Team Building Retreat",
                location: "Mountain Resort",
                date: "July 2023",
              },
              {
                title: "Client Appreciation Gala",
                location: "City Convention Center",
                date: "March 2023",
              },
              {
                title: "Industry Summit",
                location: "Business Tower",
                date: "September 2023",
              },
              {
                title: "Charity Fundraiser",
                location: "Community Center",
                date: "May 2023",
              },
            ].map((event, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <Card className="overflow-hidden">
                    <div className="relative h-64">
                      <Image
                        src={`https://wallpapers.com/images/featured/corporate-event-g6myc8i808y8llhh.jpg`}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-800">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-4">
            <CarouselPrevious className="static transform-none bg-red-600 text-white hover:bg-red-700 hover:text-white" />
            <CarouselNext className="static transform-none bg-red-600 text-white hover:bg-red-700 hover:text-white" />
          </div>
        </Carousel>
      </section>

      {/* Awards Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-4">
              Recognition
            </Badge>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Awards & Achievements
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our commitment to excellence has been recognized by industry
              leaders and organizations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                year: "2023",
                award: "Business Excellence Award",
                org: "Chamber of Commerce",
              },
              {
                year: "2022",
                award: "Best Customer Service",
                org: "Business Association",
              },
              {
                year: "2021",
                award: "Innovation in Compliance",
                org: "Industry Council",
              },
              {
                year: "2020",
                award: "Top 50 Growing Companies",
                org: "Business Magazine",
              },
              {
                year: "2019",
                award: "Entrepreneur Support Award",
                org: "Economic Development Board",
              },
              {
                year: "2018",
                award: "Quality Service Provider",
                org: "National Business Awards",
              },
            ].map((item, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-red-600 mb-1">
                      {item.year}
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">
                      {item.award}
                    </h3>
                    <p className="text-sm text-slate-600">{item.org}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CEO Message */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2">
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFuJTIwaW4lMjBzdWl0fGVufDB8fDB8fHww"
                alt="CEO Portrait"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-4">
              Leadership
            </Badge>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              A Message from Our CEO
            </h2>
            <div className="relative">
              <MessageSquareQuote className="absolute -left-10 -top-6 h-8 w-8 text-red-200" />
              <p className="text-slate-700 mb-4 italic">
                When I founded this agency, I envisioned creating a service that
                would truly make a difference in entrepreneurs lives. The
                regulatory landscape can be overwhelming, and our goal has
                always been to be the trusted guide that helps businesses
                navigate these complexities with confidence and ease.
              </p>
              <p className="text-slate-700 mb-6 italic">
                Today, Im proud of the team weve built and the thousands of
                businesses weve helped launch and grow. Our commitment remains
                unwavering: to provide exceptional service, expert guidance, and
                innovative solutions that empower entrepreneurs to achieve their
                dreams.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-800">Sarah Johnson</h3>
                <p className="text-slate-600">Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-red-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-4">
              Our People
            </Badge>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our diverse team of experts is dedicated to providing the best
              service and guidance to our clients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Michael Chen",
                role: "Chief Operations Officer",
                bio: "15+ years in business operations",
              },
              {
                name: "Priya Sharma",
                role: "Head of Legal",
                bio: "Former government advisor",
              },
              {
                name: "David Wilson",
                role: "Client Success Director",
                bio: "Customer experience specialist",
              },
              {
                name: "Aisha Johnson",
                role: "Technology Director",
                bio: "Digital transformation expert",
              },
            ].map((person, index) => (
              <Card
                key={index}
                className="overflow-hidden border-none shadow-md"
              >
                <div className="relative h-64">
                  <Image
                    src={`https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFuJTIwaW4lMjBzdWl0fGVufDB8fDB8fHww`}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-800">
                    {person.name}
                  </h3>
                  <p className="text-red-600 text-sm mb-2">{person.role}</p>
                  <p className="text-sm text-slate-600">{person.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-700 mb-6">
              Our full team consists of 85 dedicated professionals across legal,
              operations, customer service, and technology departments.
            </p>
            <Button className="bg-red-600 hover:bg-red-700">
              Join Our Team
            </Button>
          </div>
        </div>
      </section>

      {/* Affiliated Brands */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-red-100 text-red-600 hover:bg-red-100 mb-4">
            Our Partners
          </Badge>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Trusted By Leading Brands
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Were proud to work with some of the most respected organizations and
            brands across industries.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex justify-center">
              <div className="bg-white p-4 rounded-lg shadow-sm w-full h-24 flex items-center justify-center">
                <Image
                  src={`https://cdn.freebiesupply.com/images/large/2x/asus-logo-black-transparent.png`}
                  alt={`Partner brand ${index + 1}`}
                  width={120}
                  height={80}
                  className="max-h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Business Journey?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Let us handle the licensing process so you can focus on growing your
            business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className=" bg-white 
    text-black 
    hover:text-red-600 
    hover:bg-gray-100 
    font-semibold 
    rounded-lg 
    shadow-md 
    transition 
    duration-300 
    ease-in-out
    px-18 
    py-3
  "
            >
              Buy a License
            </Button>

            <Button
              size="lg"
              className=" bg-white 
    text-black 
    hover:text-red-600 
    hover:bg-gray-100 
    font-semibold 
    rounded-lg 
    shadow-md 
    transition 
    duration-300 
    ease-in-out
    px-18 
    py-3
  "
            >
              Schedule a conversation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
