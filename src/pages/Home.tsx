import Banner from "../Components/Home/Banner";
import HeroBanner from "../Components/Home/HeroBanner";
import ProductCard from "../Components/Home/ProductCard";
import ShopByCategory from "../Components/Home/ShopByCategory";
import StatsBar from "../Components/Home/StatsBar";
import Subscribe from "../Components/Home/Subscribe";
import { SummerSale } from "../Components/Home/SummerSale";
import WhyChooseNovara from "../Components/Home/WhyChooseNovara";
import HomeNotification from "../Notification/HomeNotification";

const Home = () => {
  return (
    <div>
      <HomeNotification />
      <Banner />
      <StatsBar />
      <ShopByCategory />
      <HeroBanner />

      <ProductCard />
      <SummerSale />
      <WhyChooseNovara />
      <Subscribe />
    </div>
  );
};

export default Home;
