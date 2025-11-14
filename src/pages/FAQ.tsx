import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const FAQ = () => {
  const faqs = [
    {
      question: "How long does a typical phone repair take?",
      answer:
        "Most common repairs like screen replacement, battery replacement, and charging port repairs are completed within 1-3 hours. More complex repairs such as motherboard issues or water damage recovery may take 24-48 hours. We always provide an estimated time when you bring in your device.",
    },
    {
      question: "Is my data safe during the repair?",
      answer:
        "Yes, your data is completely safe. We do not access, modify, or delete any personal data during repairs. However, we always recommend backing up important data before any repair as a precaution. For software-related repairs, we'll inform you if a factory reset is necessary.",
    },
    {
      question: "Do you use genuine or original parts?",
      answer:
        "We offer both options depending on your preference and budget. For premium devices like iPhones and high-end Samsung phones, we recommend and stock genuine OEM parts. We also have high-quality aftermarket parts that are tested and come with warranty. We'll always explain your options and pricing upfront.",
    },
    {
      question: "Do you provide warranty on repairs?",
      answer:
        "Yes! All our repairs come with warranty coverage. Screen replacements and major component replacements have a 90-day warranty. Battery replacements have 90-day warranty. Motherboard repairs typically have 30-60 day warranty depending on the complexity. Software repairs have 7-day warranty.",
    },
    {
      question: "What if my device has motherboard damage?",
      answer:
        "We specialize in chip-level motherboard repairs including IC replacement, CPU/GPU reballing, and micro-soldering. We'll perform free diagnostics to identify the exact issue and provide you with a quote. If the repair isn't economically viable, we'll be honest and help you explore other options.",
    },
    {
      question: "How much will my repair cost?",
      answer:
        "Repair costs vary based on your device model and the type of repair needed. Common repairs: Screen replacement (KSh 1,840-40,000), Battery (KSh 1,500-6,000), Charging port (KSh 2,000-5,000). We provide FREE diagnostics and give you an exact quote before starting any work. Check our Brands page for detailed pricing.",
    },
    {
      question: "Can you repair water-damaged phones?",
      answer:
        "Yes, we have professional equipment for water damage recovery including ultrasonic cleaners. The success rate depends on how quickly you bring the device in and the extent of damage. Important: Turn off your phone immediately and don't try to charge it. Bring it to us as soon as possible for best recovery chances.",
    },
    {
      question: "Do you offer same-day repair service?",
      answer:
        "Yes! Most common repairs like screen replacement, battery replacement, and charging port repairs are completed the same day, often within 1-3 hours. Walk-ins are welcome, but booking an appointment online ensures faster service.",
    },
    {
      question: "Can you recover data from a broken phone?",
      answer:
        "Yes, we offer professional data recovery services for photos, contacts, messages, and files. We can recover data even if your phone won't turn on, has a broken screen, or water damage. The process takes 1-3 days depending on the damage severity. Pricing starts from KSh 3,000.",
    },
    {
      question: "What phone brands do you repair?",
      answer:
        "We repair ALL phone brands including Apple iPhone, Samsung, Tecno, Infinix, itel, Xiaomi, Huawei, Oppo, Vivo, OnePlus, and many more. We also repair tablets, smart watches, and other small electronics. If your device isn't listed on our Brands page, bring it in for free diagnostics - we can usually still help!",
    },
    {
      question: "Do I need an appointment?",
      answer:
        "No appointment is necessary! Walk-ins are always welcome for free diagnostics. However, booking an appointment online (via our Booking page) or WhatsApp ensures priority service and shorter wait times, especially during busy periods.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept multiple payment methods including M-Pesa, cash, bank transfer, and debit/credit cards. Payment is required after repair completion. We provide detailed receipts for all transactions.",
    },
    {
      question: "Can you unlock my phone or bypass Google lock (FRP)?",
      answer:
        "Yes, we offer software services including FRP bypass, pattern unlock, and phone unlocking services. However, we require proof of ownership (purchase receipt, ID) for security and legal purposes. Pricing starts from KSh 1,500 depending on the device and complexity.",
    },
    {
      question: "What should I do if my phone got wet?",
      answer:
        "Immediate steps: (1) Turn off the phone immediately, (2) DO NOT try to charge it, (3) Remove SIM card and SD card, (4) Dry the exterior gently, (5) Bring it to us ASAP - time is critical! Do not use rice or heat sources. We have professional equipment to properly dry and clean your device.",
    },
    {
      question: "Do you repair phones with cracked back glass?",
      answer:
        "Yes, we replace back glass panels for all glass-back smartphones. The repair includes removing the damaged glass, cleaning adhesive, and installing new color-matched glass with proper adhesive. Wireless charging functionality is preserved. Repair takes 2-4 hours and comes with 60-day warranty.",
    },
    {
      question: "Can you fix Face ID or fingerprint sensor issues?",
      answer:
        "Yes, we can repair or replace fingerprint sensors and Face ID systems. Note: For iPhones, Face ID repair is complex and may require original parts to maintain full functionality. Fingerprint sensor repairs are generally more straightforward. We'll assess your specific device and provide options.",
    },
    {
      question: "What if you can't fix my phone?",
      answer:
        "If we determine that your phone cannot be economically repaired or the damage is beyond repair, we'll be completely honest with you. You only pay for diagnostics if work cannot be completed. We may also help with data recovery or guide you on trade-in or upgrade options.",
    },
    {
      question: "Do you offer any discounts?",
      answer:
        "Yes! We offer discounts for students (with valid ID), bulk repairs for businesses/organizations, and returning customers. We also run periodic promotions on social media. Follow us or ask about current offers when you visit.",
    },
    {
      question: "Can I watch while you repair my phone?",
      answer:
        "While we maintain a professional workspace, you're welcome to wait in our customer area. For security and technical reasons, we don't allow customers in the repair area. However, we can show you the problem and explain the repair process before we start.",
    },
    {
      question: "Do you sell phone accessories?",
      answer:
        "Yes! We stock a range of phone accessories including screen protectors (tempered glass), phone cases, chargers, charging cables, power banks, earphones, and more. We carry accessories for most popular phone brands at competitive prices.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about our phone repair services
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
                <p className="mb-6 text-lg">
                  Our team is here to help! Contact us via phone, WhatsApp, or visit our store
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:0721993234"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-background text-primary font-semibold hover:bg-background/90 transition-colors"
                  >
                    Call: 0721993234
                  </a>
                  <a
                    href="https://wa.me/254721993234"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-transparent border-2 border-primary-foreground text-primary-foreground font-semibold hover:bg-primary-foreground hover:text-primary transition-colors"
                  >
                    WhatsApp Us
                  </a>
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

export default FAQ;
