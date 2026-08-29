import { useState } from "react";
import Pagination from "../Components/Pagination";


const Shop = () => {
       const [currentPage, setCurrentPage] = useState(1);

const totalPages = 10

  return (
    <div>

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>;
    </div>
  );
};

export default Shop;