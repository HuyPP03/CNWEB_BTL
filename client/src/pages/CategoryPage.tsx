import { useParams } from "react-router-dom";
import ProductListing from "../components/ProductListing";

function CategoryPage() {
    const { category } = useParams<{ category: string }>();
    console.log(category);
    return (
        <div>
            <ProductListing />
        </div>
    );
}

export default CategoryPage;
