import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function Hero() {
  return (
    <div className="relative h-[60vh] bg-gradient-to-r from-rose-500 to-pink-400 flex items-center justify-center text-white">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-4xl md:text-6xl font-bold">
          Find your perfect Stay
        </h1>

        <p className="text-xl md:text-2xl max-w-2xl mx-auto">
          Discover unique accommodations around the world, from cozy apartments
          to luxury villas
        </p>

        <Button size={"lg"} variant={"secondary"} asChild>
          <Link to={"#search"}>Start Exploring</Link>
        </Button>
      </div>
    </div>
  );
}

export default Hero;
