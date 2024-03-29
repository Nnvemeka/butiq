import { useEffect, useState } from "react";
import styled from "styled-components";
import ProductItem from "./ProductItem";
import axios from "axios";

const Container = styled.div`
	padding: 20px;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
`;

const Products = ({ category, filters, sort }) => {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);

	useEffect(() => {
		const getProducts = async () => {
			try {
				const res = await axios.get(
					category
						? `https://butiq.onrender.com/api/item?category=${category}`
						: "https://butiq.onrender.com/api/item"
				);
				setProducts(res.data.data);
			} catch (e) {}
		};
		getProducts();
	}, [category]);

	useEffect(() => {
		category &&
			setFilteredProducts(
				products.filter((item) =>
					Object.entries(filters).every(([key, value]) =>
						item[key].includes(value)
					)
				)
			);
	}, [products, category, filters]);

	useEffect(() => {
		if (sort === "newest") {
			setFilteredProducts((prev) =>
				[...prev].sort((a, b) => a.createdAt - b.createdAt)
			);
		} else if (sort === "asc") {
			setFilteredProducts((prev) =>
				[...prev].sort((a, b) => a.price - b.price)
			);
		} else {
			setFilteredProducts((prev) =>
				[...prev].sort((a, b) => b.price - a.price)
			);
		}
	}, [sort]);

	return (
		<Container>
			{category
				? filteredProducts.map((product) => (
						<ProductItem product={product} key={product._id} />
				  ))
				: products
						.slice(0, 8)
						.map((product) => (
							<ProductItem product={product} key={product._id} />
						))}
		</Container>
	);
};

export default Products;
