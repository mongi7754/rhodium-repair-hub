import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Phone,
  Shield,
  Clock,
  Award,
  Wrench,
  MapPin,
  CheckCircle,
  Smartphone,
  Battery,
  MonitorSmartphone,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ChatWidget />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Fast, Trusted & Professional Phone Repairs in Nairobi
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              We fix all phone models with premium parts, certified technicians, and same-day
              service. Located in Roysambu, next to Shell Petrol Station.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-accent text-lg">
                <a href="tel:0721993234">
                  <Phone className="w-5 h-5 mr-2" />
                  Call: 0721993234
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <a
                  href="https://wa.me/254721993234"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link to="/booking">Book Repair Online</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">90-Day Warranty</h3>
                <p className="text-muted-foreground">
                  All repairs backed by comprehensive warranty
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Same-Day Service</h3>
                <p className="text-muted-foreground">
                  Most repairs completed within hours
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-2">Expert Technicians</h3>
                <p className="text-muted-foreground">
                  Certified professionals with years of experience
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Repair Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive repair solutions for all your mobile device needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MonitorSmartphone,
                title: "Screen Replacement",
                desc: "LCD, OLED, and AMOLED screens for all brands",
                price: "From KSh 1,840",
              },
              {
                icon: Battery,
                title: "Battery Replacement",
                desc: "Original & high-quality replacement batteries",
                price: "From KSh 1,500",
              },
              {
                icon: Smartphone,
                title: "Charging Port Repair",
                desc: "Fix charging issues and port damage",
                price: "From KSh 2,000",
              },
              {
                icon: Phone,
                title: "Camera Repair",
                desc: "Front and back camera replacement",
                price: "From KSh 2,500",
              },
              {
                icon: Wrench,
                title: "Motherboard Repair",
                desc: "Chip-level and IC replacement",
                price: "From KSh 3,000",
              },
              {
                icon: CheckCircle,
                title: "Water Damage Recovery",
                desc: "Professional liquid damage treatment",
                price: "From KSh 2,500",
              },
            ].map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">{service.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{service.desc}</p>
                        <p className="text-sm font-semibold text-primary">{service.price}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline">
              <Link to="/services">View All Services</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="ml-4">
              <Link to="/gallery">View Repair Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <MapPin className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Visit Our Store</h2>
          <p className="text-lg mb-6">
            Roysambu, Nairobi - Next to Shell Petrol Station
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Get Directions</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/booking">Book Appointment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "John Kamau",
                device: "iPhone 12",
                rating: 5,
                review:
                  "Excellent service! My iPhone screen was replaced in just 2 hours. Very professional.",
              },
              {
                name: "Mary Wanjiru",
                device: "Samsung S21",
                rating: 5,
                review:
                  "Best phone repair shop in Nairobi. Fair prices and quality work. Highly recommend!",
              },
              {
                name: "David Omondi",
                device: "Tecno Spark 10",
                rating: 5,
                review:
                  "Fast and reliable. They fixed my charging port issue at an affordable price.",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-primary">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.review}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.device}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
