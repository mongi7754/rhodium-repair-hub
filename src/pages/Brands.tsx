import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Brands = () => {
  const brandCategories = [
    {
      title: "Premium Flagship Brands",
      brands: [
        "Apple iPhone (all models)",
        "Samsung Galaxy S & Note Series",
        "Google Pixel",
        "OnePlus",
        "Sony Xperia",
        "Xiaomi Mi & Redmi",
        "Huawei P & Mate Series",
        "Oppo",
        "Vivo",
        "Realme",
      ],
    },
    {
      title: "Popular in Kenya",
      brands: [
        "Tecno (all models)",
        "Infinix (all models)",
        "itel",
        "Lava",
        "Nokia (HMD Global)",
      ],
    },
    {
      title: "Gaming Phones",
      brands: [
        "Asus ROG Phone",
        "Lenovo Legion",
        "RedMagic",
        "Black Shark",
      ],
    },
    {
      title: "Foldable Devices",
      brands: [
        "Samsung Galaxy Z Fold",
        "Samsung Galaxy Z Flip",
        "Huawei Mate X",
        "Oppo Find N",
      ],
    },
    {
      title: "Tablets",
      brands: [
        "iPad (all models)",
        "Samsung Galaxy Tab",
        "Huawei MatePad",
        "Lenovo Tab",
        "Amazon Fire",
        "Xiaomi Pad",
      ],
    },
    {
      title: "Other Devices",
      brands: [
        "Smart Watches",
        "Wireless Earbuds",
        "POS Machines",
        "Bluetooth Speakers",
        "Power Banks",
      ],
    },
  ];

  const pricingGuide = [
    {
      brand: "Tecno",
      screen: "KSh 1,840 - 7,180",
      battery: "KSh 1,500 - 3,000",
    },
    {
      brand: "Infinix",
      screen: "KSh 3,680 - 4,190",
      battery: "KSh 1,500 - 3,000",
    },
    {
      brand: "itel",
      screen: "KSh 1,130 - 3,470",
      battery: "KSh 1,500+",
    },
    {
      brand: "Samsung A-Series",
      screen: "KSh 4,000 - 5,500",
      battery: "KSh 1,500 - 6,000",
    },
    {
      brand: "Samsung S-Series",
      screen: "KSh 12,000 - 15,000",
      battery: "KSh 3,000 - 6,000+",
    },
    {
      brand: "iPhone SE 2020",
      screen: "KSh 6,000 - 9,000",
      battery: "KSh 1,500 - 6,000",
    },
    {
      brand: "iPhone XR",
      screen: "KSh 10,000 - 12,000",
      battery: "KSh 1,500 - 6,000",
    },
    {
      brand: "iPhone 12",
      screen: "KSh 20,000 - 25,000",
      battery: "KSh 1,500 - 6,000",
    },
    {
      brand: "iPhone 13 Pro Max",
      screen: "KSh 30,000 - 40,000",
      battery: "KSh 1,500 - 6,000",
    },
    {
      brand: "Huawei",
      screen: "KSh 5,930 - 50,130",
      battery: "KSh 1,500 - 6,000",
    },
    {
      brand: "Xiaomi / Redmi",
      screen: "KSh 3,500 - 4,000",
      battery: "KSh 1,500 - 3,500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <ChatWidget />

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Supported Phone Brands</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We repair all phone brands and models. If your device isn't listed, we can still
              diagnose and repair it. Bring it in for free diagnostics!
            </p>
          </div>

          {/* Brand Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {brandCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-xl mb-4 text-primary">{category.title}</h3>
                  <div className="space-y-2">
                    {category.brands.map((brand, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{brand}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing Guide */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Typical Repair Pricing Guide</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold">Phone / Brand</th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Screen Replacement
                        </th>
                        <th className="text-left py-3 px-4 font-semibold">
                          Battery / Other Repairs
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricingGuide.map((item, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 px-4">{item.brand}</td>
                          <td className="py-3 px-4 text-primary font-semibold">
                            {item.screen}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{item.battery}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Factors Affecting Repair Prices:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Phone model & screen type (OLED/AMOLED vs LCD)</li>
                    <li>• Genuine vs third-party parts availability</li>
                    <li>• Repair complexity (screen vs motherboard/IC-level repair)</li>
                    <li>• Warranty coverage & guarantees provided</li>
                    <li>• Parts availability and import costs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Not Listed Section */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-4">Device Not Listed?</h3>
              <p className="mb-6 text-lg">
                Don't worry! We can diagnose and repair most electronic devices. Bring your device
                for FREE diagnostics and get a quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary">
                  <Link to="/booking">Book Free Diagnostics</Link>
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
      </section>

      <Footer />
    </div>
  );
};

export default Brands;
