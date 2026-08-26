import Banner from "../Components/Home/Banner";
import HeroBanner from "../Components/Home/HeroBanner";
import ProductCard from "../Components/Home/ProductCard";
import StatsBar from "../Components/Home/StatsBar";
import Subscribe from "../Components/Home/Subscribe";


const Home = () => {
  return (
    <div>
       <Banner/>
       <StatsBar/>
       <HeroBanner/>
       <ProductCard/>
       <Subscribe/>
    </div>
  );
};

export default Home;