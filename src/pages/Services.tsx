import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Smartphone,
  Battery,
  MonitorSmartphone,
  Camera,
  Zap,
  Volume2,
  Fingerprint,
  Wifi,
  Droplet,
  HardDrive,
  Wrench,
  Shield,
  Clock,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: MonitorSmartphone,
      title: "Screen Replacement",
      description:
        "Complete LCD, OLED, and AMOLED screen replacement for all phone brands. We use premium quality displays with perfect color accuracy and touch sensitivity.",
      symptoms: ["Cracked screen", "Black spots", "Touch not working", "Lines on display"],
      repairTime: "1-2 hours",
      priceRange: "KSh 1,840 - 40,000",
      warranty: "90 days",
      technical:
        "We replace digitizers, LCD panels, and frame assemblies. All screens are tested for touch responsiveness and color accuracy before delivery.",
    },
    {
      icon: Battery,
      title: "Battery Replacement",
      description:
        "Replace worn-out batteries with original or high-quality aftermarket batteries. Restore your phone's battery life and performance.",
      symptoms: [
        "Fast battery drain",
        "Phone shutting down",
        "Swollen battery",
        "Won't hold charge",
      ],
      repairTime: "30 minutes - 1 hour",
      priceRange: "KSh 1,500 - 6,000",
      warranty: "90 days",
      technical:
        "We use batteries with proper mAh ratings matching original specifications. Includes battery health calibration.",
    },
    {
      icon: Zap,
      title: "Charging Port Repair",
      description:
        "Fix charging port issues including loose connections, damaged pins, and port replacement for all phone models.",
      symptoms: [
        "Won't charge",
        "Loose cable connection",
        "Slow charging",
        "Charging intermittently",
      ],
      repairTime: "1-2 hours",
      priceRange: "KSh 2,000 - 5,000",
      warranty: "60 days",
      technical:
        "Includes USB-C, Lightning, and Micro-USB port replacements. We clean debris and repair broken solder connections.",
    },
    {
      icon: Camera,
      title: "Camera Repair",
      description:
        "Front and rear camera replacement and repair. Restore camera quality and fix focusing issues.",
      symptoms: ["Blurry photos", "Black screen", "Camera won't open", "Cracked lens"],
      repairTime: "1-3 hours",
      priceRange: "KSh 2,500 - 8,000",
      warranty: "90 days",
      technical:
        "Includes camera module replacement, lens glass replacement, and focus calibration. Compatible with dual and triple camera systems.",
    },
    {
      icon: Volume2,
      title: "Speaker & Microphone Repair",
      description:
        "Fix audio issues including earpiece, loudspeaker, and microphone problems for clear communication.",
      symptoms: [
        "No sound",
        "Distorted audio",
        "Others can't hear you",
        "Low volume",
      ],
      repairTime: "1-2 hours",
      priceRange: "KSh 1,500 - 4,000",
      warranty: "60 days",
      technical:
        "We replace speaker assemblies, clean mesh grilles, and repair microphone flex cables.",
    },
    {
      icon: Fingerprint,
      title: "Fingerprint & Face ID Repair",
      description:
        "Restore biometric authentication features. Fix fingerprint sensors and Face ID systems.",
      symptoms: [
        "Fingerprint not recognized",
        "Face ID not working",
        "Sensor unresponsive",
      ],
      repairTime: "2-4 hours",
      priceRange: "KSh 3,000 - 10,000",
      warranty: "90 days",
      technical:
        "Includes sensor replacement and software recalibration. Note: iPhone Face ID requires original parts to maintain functionality.",
    },
    {
      icon: Wifi,
      title: "Network & Signal Repair",
      description:
        "Fix network connectivity issues, weak signal problems, and antenna repairs.",
      symptoms: ["No signal", "Weak reception", "WiFi won't connect", "Bluetooth issues"],
      repairTime: "2-4 hours",
      priceRange: "KSh 2,500 - 8,000",
      warranty: "60 days",
      technical:
        "We repair antenna flex cables, replace RF chips, and fix baseband issues. Includes IMEI verification.",
    },
    {
      icon: Wrench,
      title: "Motherboard Repair",
      description:
        "Advanced chip-level motherboard repair including IC replacement, CPU/GPU reballing, and micro-soldering services.",
      symptoms: [
        "Phone won't turn on",
        "Boot loop",
        "Random restarts",
        "Overheating",
      ],
      repairTime: "4-24 hours",
      priceRange: "KSh 3,000 - 15,000",
      warranty: "30-90 days",
      technical:
        "We perform Power IC, Audio IC, and Network IC replacements. CPU/GPU reballing for overheating issues. Advanced diagnostics included.",
    },
    {
      icon: Droplet,
      title: "Water Damage Recovery",
      description:
        "Professional liquid damage treatment and data recovery services. Quick response prevents permanent damage.",
      symptoms: [
        "Dropped in water",
        "Won't turn on after wet",
        "Screen flickering",
        "Corrosion visible",
      ],
      repairTime: "24-48 hours",
      priceRange: "KSh 2,500 - 12,000",
      warranty: "30 days",
      technical:
        "Ultrasonic cleaning, component replacement, corrosion removal, and full functionality testing. Time-sensitive service.",
    },
    {
      icon: HardDrive,
      title: "Data Recovery",
      description:
        "Recover photos, contacts, messages, and files from damaged or non-functional phones.",
      symptoms: [
        "Phone won't turn on",
        "Deleted files",
        "Water damaged phone",
        "Broken screen",
      ],
      repairTime: "1-3 days",
      priceRange: "KSh 3,000 - 10,000",
      warranty: "N/A",
      technical:
        "We use specialized tools for chip-off data extraction, JTAG recovery, and software-based recovery methods.",
    },
    {
      icon: Smartphone,
      title: "Software Issues & Flashing",
      description:
        "Fix software problems, OS reinstallation, FRP bypass, unlock services, and firmware updates.",
      symptoms: [
        "Stuck on logo",
        "Software glitches",
        "Forgot password",
        "Phone locked",
      ],
      repairTime: "1-3 hours",
      priceRange: "KSh 1,500 - 5,000",
      warranty: "7 days",
      technical:
        "Includes OS flashing, factory reset, FRP/Google lock removal, and custom ROM installation. Data backup recommended.",
    },
    {
      icon: Shield,
      title: "Back Glass Replacement",
      description:
        "Replace cracked or shattered back glass panels. Available for all glass-back smartphones.",
      symptoms: ["Cracked back", "Shattered glass", "Loose back panel"],
      repairTime: "2-4 hours",
      priceRange: "KSh 2,000 - 8,000",
      warranty: "60 days",
      technical:
        "Includes adhesive replacement and wireless charging coil protection. Color-matched glass panels available.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ChatWidget />

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Repair Services</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive phone repair solutions with certified technicians and premium quality
              parts. All repairs come with warranty and free diagnostics.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">90-Day Warranty</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Same-Day Service</p>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6 text-center">
                <Wrench className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold">Free Diagnostics</p>
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2">{service.title}</h3>
                        <p className="text-muted-foreground text-sm">{service.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold mb-1">Common Symptoms:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.symptoms.map((symptom, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-muted-foreground">Repair Time:</p>
                          <p className="font-semibold">{service.repairTime}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Price Range:</p>
                          <p className="font-semibold text-primary">{service.priceRange}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Warranty: {service.warranty}</p>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground italic">{service.technical}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Your Phone Fixed?</h3>
                <p className="mb-6">
                  Book an appointment online or visit our store for free diagnostics
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary">
                    <Link to="/booking">Book Repair Now</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    <a href="tel:0721993234">Call: 0721993234</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
