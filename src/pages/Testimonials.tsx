import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

import customer1 from "@/assets/testimonials/customer-1.jpg";
import customer2 from "@/assets/testimonials/customer-2.jpg";
import customer3 from "@/assets/testimonials/customer-3.jpg";
import customer4 from "@/assets/testimonials/customer-4.jpg";
import customer5 from "@/assets/testimonials/customer-5.jpg";
import customer6 from "@/assets/testimonials/customer-6.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "John Kamau",
      photo: customer1,
      location: "Roysambu, Nairobi",
      device: "iPhone 12 Pro",
      service: "Screen Replacement",
      rating: 5,
      date: "2 weeks ago",
      review:
        "Excellent service! My iPhone screen was completely shattered and they replaced it in just 2 hours. The quality is amazing - looks brand new! The technicians were very professional and explained everything clearly. Highly recommend Rhodium Ventures for anyone with phone issues.",
      verified: true,
    },
    {
      id: 2,
      name: "Mary Wanjiru",
      photo: customer2,
      location: "Kahawa West",
      device: "Samsung Galaxy S21",
      service: "Battery Replacement",
      rating: 5,
      date: "1 month ago",
      review:
        "Best phone repair shop in Nairobi! Fair prices and quality work. My phone was draining battery so fast, but after they replaced it, it's like having a new phone again. The warranty gave me peace of mind. Will definitely return for any future repairs.",
      verified: true,
    },
    {
      id: 3,
      name: "David Omondi",
      photo: customer3,
      location: "Zimmerman",
      device: "Tecno Spark 10",
      service: "Charging Port Repair",
      rating: 5,
      date: "3 weeks ago",
      review:
        "Fast and reliable service. They fixed my charging port issue at an affordable price. The technician was honest and didn't try to sell me unnecessary services. Got my phone back the same day. Great customer service!",
      verified: true,
    },
    {
      id: 4,
      name: "Grace Muthoni",
      photo: customer4,
      location: "Kasarani",
      device: "iPhone 11",
      service: "Water Damage Recovery",
      rating: 5,
      date: "1 week ago",
      review:
        "I dropped my iPhone in water and thought it was gone forever. Rhodium Ventures saved it! They dried it out, cleaned the motherboard, and now it works perfectly. I'm so grateful for their expertise. Worth every shilling!",
      verified: true,
    },
    {
      id: 5,
      name: "Peter Otieno",
      photo: customer5,
      location: "Thika Road",
      device: "Infinix Note 12",
      service: "Screen & Back Glass",
      rating: 5,
      date: "2 months ago",
      review:
        "Professional and affordable! I had both my screen and back glass replaced. The quality of parts used is excellent. They finished the job in 3 hours as promised. The shop is easy to find next to Shell. Highly recommended!",
      verified: true,
    },
    {
      id: 6,
      name: "Sarah Njeri",
      photo: customer6,
      location: "Ruaraka",
      device: "Samsung A52",
      service: "Camera Repair",
      rating: 5,
      date: "3 days ago",
      review:
        "My camera was completely blurry and unusable. They diagnosed the issue quickly and replaced the camera module. Now my photos are crystal clear again! Very happy with the service and the 90-day warranty is a great bonus.",
      verified: true,
    },
    {
      id: 7,
      name: "James Kariuki",
      photo: customer1,
      location: "Roysambu",
      device: "Huawei P30",
      service: "Motherboard Repair",
      rating: 5,
      date: "1 month ago",
      review:
        "My phone wasn't turning on at all. The team at Rhodium diagnosed a motherboard issue and fixed it within a day. The price was fair and they kept me updated throughout. Excellent technical skills!",
      verified: true,
    },
    {
      id: 8,
      name: "Lucy Akinyi",
      photo: customer2,
      location: "Kahawa Sukari",
      device: "Xiaomi Redmi Note 10",
      service: "Screen Replacement",
      rating: 5,
      date: "2 weeks ago",
      review:
        "Very impressed with the service! My screen was cracked badly and they replaced it with a high-quality display. Touch response is perfect. The staff was friendly and the shop is very clean. Will recommend to friends and family.",
      verified: true,
    },
    {
      id: 9,
      name: "Michael Kiplagat",
      photo: customer3,
      location: "Garden Estate",
      device: "iPhone 13",
      service: "Back Glass Replacement",
      rating: 5,
      date: "5 days ago",
      review:
        "Professional service from start to finish. I was worried about the cost but they gave me a fair quote and stuck to it. The back glass looks perfect and they even cleaned the whole phone for me. Great experience!",
      verified: true,
    },
    {
      id: 10,
      name: "Faith Wambui",
      photo: customer4,
      location: "Ruai",
      device: "Samsung M31",
      service: "Battery & Charging Port",
      rating: 5,
      date: "1 week ago",
      review:
        "Had both battery and charging issues. They fixed both problems efficiently and at a good price. Phone is working like new. The technician explained what was wrong in simple terms. Very satisfied!",
      verified: true,
    },
    {
      id: 11,
      name: "Daniel Mwangi",
      photo: customer5,
      location: "Kahawa Wendani",
      device: "Oppo A5s",
      service: "Software Issues",
      rating: 5,
      date: "4 days ago",
      review:
        "My phone was stuck on boot loop and I thought I'd lost all my data. They managed to recover everything and fix the software issue. Very skilled technicians. Great service at a reasonable price!",
      verified: true,
    },
    {
      id: 12,
      name: "Rose Chebet",
      photo: customer6,
      location: "Githurai",
      device: "iPhone XR",
      service: "Screen & Battery",
      rating: 5,
      date: "3 weeks ago",
      review:
        "Replaced both my screen and battery in one visit. The work was done professionally and quickly. The new screen quality is excellent and battery life is amazing now. Very happy with Rhodium Ventures!",
      verified: true,
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-primary text-primary" : "text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ChatWidget />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Customer Reviews
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            What Our Customers Say
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Real reviews from real customers. See why hundreds of people trust
            Rhodium Ventures for their phone repairs in Nairobi.
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <span className="text-4xl font-bold text-primary">4.9</span>
                <Star className="w-8 h-8 fill-primary text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-6">
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-primary/20 mb-4" />

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-4">
                    {renderStars(testimonial.rating)}
                    {testimonial.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-muted-foreground mb-6 line-clamp-5">
                    "{testimonial.review}"
                  </p>

                  {/* Customer Info */}
                  <div className="flex items-start gap-3 pt-4 border-t border-border">
                    <img
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.location}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {testimonial.device} • {testimonial.service}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {testimonial.date}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Satisfied Customers
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Experience the same quality service and professionalism. Get your phone
            repaired today with our 90-day warranty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a href="tel:0721993234">Call: 0721993234</a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90"
            >
              <a
                href="https://wa.me/254721993234"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Testimonials;
