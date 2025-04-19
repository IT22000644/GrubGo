import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { FacebookIcon, Instagram, Twitch, Linkedin } from "lucide-react";
import imageAbout from "../../assets/Images/food-4k-m37wpodzrcbv5gvw.jpg";
import googlemap from "../../assets/Images/google-maps.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const faqs = [
    {
      question: "What are your delivery hours?",
      answer:
        "We deliver every day from 10:00 AM to 10:00 PM, including weekends and most holidays.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is confirmed, you'll receive a tracking link via email and SMS to follow your delivery in real-time.",
    },
    {
      question: "What is your delivery radius?",
      answer:
        "We currently deliver within a 10-mile radius of our partner restaurants. Enter your address on our homepage to check if we deliver to your area.",
    },
    {
      question: "How do I become a delivery partner?",
      answer:
        "We're always looking for reliable delivery partners! Please fill out the application form on our Careers page or contact us directly.",
    },
  ];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    console.log("Form submitted:", formData);
    setSubmitted(true);

    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-64 md:h-96 overflow-hidden rounded-r-lg">
        <div className="absolute inset-0">
          <img
            src={imageAbout}
            alt="Food delivery"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-neutral via-neutral/80 to-transparent"></div>

        <div className="container mx-auto px-6 relative z-10 flex items-center h-full">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-text_dark mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-text_dark">
              We'd love to hear from you!
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl font-bold text-text_dark mb-6">
              Get in Touch
            </h2>
            <p className="text-text_gray_600 mb-8">
              Have questions about our service, restaurant partnerships, or
              delivery areas? Our friendly team is here to help you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-amber-100 p-3 rounded-full text-primary_lite mr-4">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text_dark">
                    Phone
                  </h3>
                  <p className="text-text_gray_600">(555) 123-4567</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Monday to Friday, 9am to 6pm
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 p-3 rounded-full text-primary_lite mr-4">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text_dark">
                    Email
                  </h3>
                  <p className="text-text_gray_600">support@grubgo.com</p>
                  <p className="text-sm text-gray-500 mt-1">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 p-3 rounded-full text-primary_lite mr-4">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text_dark">
                    Office
                  </h3>
                  <p className="text-text_gray_600">
                    123 Delivery Street
                    <br />
                    Foodville, CA 90210
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-amber-100 p-3 rounded-full text-primary_lite mr-4">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text_dark">
                    Hours
                  </h3>
                  <div className="text-text_gray_600">
                    <p>Monday - Friday: 9:00 AM - 10:00 PM</p>
                    <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-text_dark mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {[
                  {
                    name: "facebook",
                    icon: FacebookIcon,
                  },
                  { name: "twitter", icon: Twitch },
                  {
                    name: "instagram",
                    icon: Instagram,
                  },
                  {
                    name: "linkedin",
                    icon: Linkedin,
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="bg-amber-100 w-10 h-10 flex items-center justify-center rounded-full text-primary_lite hover:bg-amber-200 transition-colors"
                  >
                    <span className="sr-only">{social.name}</span>
                    <social.icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-neutral p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <MessageSquare className="text-primary_lite mr-2" size={24} />
              <h2 className="text-2xl font-bold text-text_dark">
                Send us a Message
              </h2>
            </div>

            {submitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                <strong className="font-bold">Thank you!</strong>
                <p>
                  Your message has been sent successfully. We'll get back to you
                  soon.
                </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Tell us about your inquiry or feedback..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 text-neutral font-bold py-3 px-6 rounded-lg hover:bg-primary_lite transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="mb-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`text-amber-500 transition-transform duration-300 ${
                      openItems[index] ? "transform rotate-180" : ""
                    }`}
                    size={20}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openItems[index]
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-4 text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2 text-4xl opacity-10 dark:opacity-5">
        🍕
      </div>
      <div className="fixed right-1/4 top-1/3 transform translate-x-1/2 -translate-y-1/2 text-4xl opacity-10 dark:opacity-5">
        🍔
      </div>
      <div className="fixed left-1/3 bottom-1/4 transform -translate-x-1/2 translate-y-1/2 text-4xl opacity-10 dark:opacity-5">
        🌮
      </div>
      <div className="fixed right-1/3 bottom-1/3 transform translate-x-1/2 translate-y-1/2 text-4xl opacity-10 dark:opacity-5">
        🍜
      </div>
    </div>
  );
};

export default Contact;
