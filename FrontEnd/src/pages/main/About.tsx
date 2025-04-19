import { ChefHat, Clock, Award, Truck } from "lucide-react";
import image from "../../assets/Images/6399f785bf3ea32a196ccad5_market-house_Website-Header-1-scaled.webp";
import imageAbout from "../../assets/Images/ai-generated-8520992_960_720.png";
import chefImage from "../../assets/Images/OIP (1).jpeg";
import ownerImage from "../../assets/Images/R (1).jpeg";
import vitorImage from "../../assets/Images/R.jpeg";

const About = () => {
  return (
    <div className="min-h-screen ">
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
              About Us
            </h1>
            <p className="text-xl text-text_dark">
              Bringing delicious meals right to your doorstep
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-text_dark mb-6">
              Our Story
            </h2>
            <p className="text-text_gray_600 mb-4">
              Founded in 2020, we started with a simple mission: to connect
              people with their favorite restaurants and deliver exceptional
              food experiences right to their homes.
            </p>
            <p className="text-text_gray_600 mb-4">
              What began as a small team of food enthusiasts has grown into a
              dedicated network of delivery professionals, customer service
              experts, and tech innovators all working together to transform how
              people enjoy their favorite meals.
            </p>
            <p className="text-text_gray_600">
              Today, we partner with hundreds of restaurants across the city,
              ensuring that quality food is just a few clicks away from your
              doorstep.
            </p>
          </div>

          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <div className="h-64 bg-amber-100 flex items-center justify-center">
              <img
                src={image}
                alt="Our Story"
                className="object-cover h-full w-full"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary_lite/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-text_white font-bold">
              Delivering happiness since 2020
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-text_dark mb-8 text-center">
            What Sets Us Apart
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ChefHat size={24} />,
                title: "Restaurant Selection",
                description:
                  "We partner with only the best restaurants that meet our high quality standards.",
              },
              {
                icon: <Clock size={24} />,
                title: "Fast Delivery",
                description:
                  "Our drivers ensure your food arrives hot and fresh in record time.",
              },
              {
                icon: <Award size={24} />,
                title: "Quality Guarantee",
                description:
                  "Not satisfied? We'll make it right with our 100% satisfaction guarantee.",
              },
              {
                icon: <Truck size={24} />,
                title: "Wide Coverage",
                description:
                  "We deliver to more neighborhoods than any other service in the area.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="inline-block p-3 bg-amber-100 rounded-full text-primary mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text_dark">
                  {item.title}
                </h3>
                <p className="text-text_gray_600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-text_dark mb-8 text-center">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Founder & CEO",
                bio: "Food enthusiast with 15+ years in the restaurant industry",
                image: ownerImage,
              },
              {
                name: "Sarah Chen",
                role: "Head of Operations",
                bio: "Logistics expert ensuring your deliveries arrive on time",
                image: vitorImage,
              },
              {
                name: "Miguel Rodriguez",
                role: "Executive Chef Consultant",
                bio: "Curates our restaurant partnerships for the best selection",
                image: chefImage,
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-4 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1 text-text_dark">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-text_gray_600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-primary_lite py-16 mt-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-text_white mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl text-text_white mb-8">
            Discover the best restaurants in your area and enjoy delicious meals
            delivered to your door.
          </p>
          <button className="bg-white text-primary font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
            Order Now
          </button>
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

export default About;
