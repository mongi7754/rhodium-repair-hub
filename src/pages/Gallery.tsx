import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

import beforeScreen1 from "@/assets/gallery/before-screen-1.jpg";
import afterScreen1 from "@/assets/gallery/after-screen-1.jpg";
import beforeBack1 from "@/assets/gallery/before-back-1.jpg";
import afterBack1 from "@/assets/gallery/after-back-1.jpg";
import beforeWater1 from "@/assets/gallery/before-water-1.jpg";
import afterWater1 from "@/assets/gallery/after-water-1.jpg";
import beforePort1 from "@/assets/gallery/before-port-1.jpg";
import afterPort1 from "@/assets/gallery/after-port-1.jpg";

const Gallery = () => {
  const repairs = [
    {
      title: "iPhone 12 Screen Replacement",
      before: beforeScreen1,
      after: afterScreen1,
      description: "Severe screen damage with multiple cracks and LCD bleeding",
      device: "iPhone 12",
      service: "LCD Screen Replacement",
      duration: "2 hours",
      price: "KSh 22,000",
    },
    {
      title: "Samsung Galaxy Back Glass Repair",
      before: beforeBack1,
      after: afterBack1,
      description: "Shattered back glass panel and damaged camera lens cover",
      device: "Samsung Galaxy S21",
      service: "Back Glass & Camera Lens",
      duration: "3 hours",
      price: "KSh 8,500",
    },
    {
      title: "Water Damage Recovery",
      before: beforeWater1,
      after: afterWater1,
      description: "Complete water damage restoration with motherboard cleaning",
      device: "Tecno Spark 10",
      service: "Water Damage Treatment",
      duration: "1 day",
      price: "KSh 3,500",
    },
    {
      title: "Charging Port Replacement",
      before: beforePort1,
      after: afterPort1,
      description: "Damaged charging port with bent pins and corrosion",
      device: "Infinix Note 12",
      service: "USB-C Port Replacement",
      duration: "1.5 hours",
      price: "KSh 2,200",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ChatWidget />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Our Work
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Before & After Repair Gallery
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            See the quality of our professional phone repair services. Every device is
            restored to like-new condition with premium parts and expert craftsmanship.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-12">
            {repairs.map((repair, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Before Image */}
                    <div className="relative group">
                      <img
                        src={repair.before}
                        alt={`Before ${repair.title}`}
                        className="w-full h-full object-cover aspect-square"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="destructive" className="text-base font-semibold">
                          Before
                        </Badge>
                      </div>
                    </div>

                    {/* After Image */}
                    <div className="relative group">
                      <img
                        src={repair.after}
                        alt={`After ${repair.title}`}
                        className="w-full h-full object-cover aspect-square"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="text-base font-semibold bg-green-600 hover:bg-green-700">
                          After
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 bg-muted/30">
                    <h3 className="text-2xl font-bold mb-3">{repair.title}</h3>
                    <p className="text-muted-foreground mb-4">{repair.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Device</p>
                        <p className="font-semibold">{repair.device}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Service</p>
                        <p className="font-semibold">{repair.service}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 mt-0.5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Duration</p>
                          <p className="font-semibold">{repair.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Price</p>
                          <p className="font-semibold text-primary">{repair.price}</p>
                        </div>
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
            Your Phone Can Look This Good Too
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Book your repair today and get the same professional results with our 90-day warranty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0721993234"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-background text-foreground hover:bg-background/90 font-semibold transition-colors"
            >
              Call: 0721993234
            </a>
            <a
              href="https://wa.me/254721993234"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-accent hover:bg-accent/90 font-semibold transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
