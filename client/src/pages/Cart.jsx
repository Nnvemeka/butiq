import styled from "styled-components";
import Announcement from "../components/Announcement";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faMinus } from "@fortawesome/free-solid-svg-icons";
import { mobile } from "../responsive";
import { useSelector } from "react-redux";
import StripeCheckout from "react-stripe-checkout";
import { useState, useEffect } from "react";
import { userRequest } from "../requestMethods";
import { Redirect, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getTotals, removeProduct } from "../redux/cartRedux";
import { createOrder } from "../redux/apiCalls";
import { selectCurrentUser } from "../redux/userRedux";

const KEY = process.env.REACT_APP_STRIPE_KEY;

const Container = styled.div``;

const Wrapper = styled.div`
	padding: 20px;
	${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
	font-weight: 300;
	text-align: center;
`;

const Top = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20px;
`;

const TopButton = styled.button`
	padding: 10px;
	font-weight: 600;
	cursor: pointer;
	border: ${(props) => props.type === "filled" && "none"};
	background-color: ${(props) =>
		props.type === "filled" ? "black" : "transparent"};
	color: ${(props) => props.type === "filled" && "white"};
`;
const TopTexts = styled.div`
	${mobile({ display: "none" })}
`;

const TopText = styled.span`
	cursor: pointer;
	text-decoration: underline;
	margin: 0px 10px;
`;

const Button = styled.div`
	display: flex;
	justify-content: space-between;
	${mobile({ flexDirection: "column" })}
`;

const ButtonX = styled.div`
	padding: 10px;
	color: black;
	font-weight: 600;
	cursor: pointer;
`;

const Info = styled.div`
	flex: 3;
`;

const Product = styled.div`
	display: flex;
	justify-content: space-between;
	${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
	flex: 2;
	display: flex;
`;

const Image = styled.img`
	width: 200px;
`;

const Details = styled.div`
	padding: 20px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

const ProductAmountcontainer = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 20px;
`;

const ProductAmount = styled.div`
	font-size: 24px;
	margin: 5px;
	${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
	font-size: 30px;
	font-weight: 200;
	${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
	background-color: #eee;
	border: none;
	height: 1px;
`;

const Summary = styled.div`
	flex: 1;
	border: 0.5px solid lightgray;
	border-radius: 10px;
	padding: 20px;
	height: 50vh;
`;
const SummaryTitle = styled.h1`
	font-weight: 200;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const SummaryItem = styled.div`
	margin: 30px 0px;
	display: flex;
	justify-content: space-between;
	font-weight: ${(props) => props.type === "total" && "500"};
	font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const SummaryButton = styled.button`
	width: 100%;
	padding: 10px;
	background-color: black;
	color: white;
	font-weight: 600;
	cursor: pointer;
`;

const Cart = () => {
	const currentUser = useSelector(selectCurrentUser);
	const cart = useSelector((state) => state.cart);
	const [stripeToken, setStripeToken] = useState(null);
	const history = useHistory();
	const dispatch = useDispatch();

	const onToken = (token) => {
		setStripeToken(token);
	};

	useEffect(() => {
		dispatch(getTotals());
	}, [cart, dispatch]);

	useEffect(() => {
		const order = {
			user: currentUser?.currentUser?.uid,
			items: [
				{
					itemId: cart.products[0]?._id,
					quantity: cart.products[0]?.quantity,
				},
			],
			amount: cart.products[0]?.price,
		};
		const makeRequest = async () => {
			try {
				const res = await userRequest.post("/checkout/payment", {
					tokenId: stripeToken.id,
					amount: cart.total * 100,
				});
				createOrder(dispatch, order);
				history.push("/success", { data: res.data });
			} catch (err) {}
		};
		stripeToken && makeRequest();
	}, [
		stripeToken,
		cart.total,
		history,
		currentUser?.currentUser?.uid,
		cart.products,
		dispatch,
	]);

	const handleRemove = (id) => {
		dispatch(removeProduct({ id }));
	};

	return (
		<Container>
			<Navbar />
			<Announcement />
			<Wrapper>
				<Title>YOUR CART</Title>
				<Top>
					<TopButton>CONTINUE SHOPPING</TopButton>
					<TopTexts>
						<TopText>Shopping Bag(2)</TopText>
						<TopText>Your Wishlist(0)</TopText>
					</TopTexts>
					<TopButton type="filled">CHECKOUT NOW</TopButton>
				</Top>
				<Button>
					<Info>
						{cart.products.map((product) => (
							<Product key={product.title}>
								<ProductDetail>
									<Image src={product.image} />
									<Details>
										<ProductName>
											<b>Product:</b> {product.title}
										</ProductName>
										<ProductId>
											<b>ID:</b> {product._id}
										</ProductId>
										<ProductColor color={product.color} />
										<ProductSize>
											<b>Size:</b> {product.size}
										</ProductSize>
									</Details>
								</ProductDetail>
								<PriceDetail>
									<ProductAmountcontainer>
										<FontAwesomeIcon icon={faMinus} />
										<ProductAmount>{product.quantity}</ProductAmount>
										<FontAwesomeIcon icon={faAdd} />
									</ProductAmountcontainer>
									<ProductPrice>
										$ {product.price * product.quantity}
									</ProductPrice>
									<ButtonX onClick={() => handleRemove(product._id)}>
										remove
									</ButtonX>
								</PriceDetail>
							</Product>
						))}
						<Hr />
					</Info>
					<Summary>
						<SummaryTitle>ORDER SUMMARY</SummaryTitle>
						<SummaryItem>
							<SummaryItemText>Subtotal</SummaryItemText>
							<SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
						</SummaryItem>
						<SummaryItem>
							<SummaryItemText>Estimated Shipping</SummaryItemText>
							<SummaryItemPrice>$ 7.50</SummaryItemPrice>
						</SummaryItem>
						<SummaryItem>
							<SummaryItemText>Shipping Discount</SummaryItemText>
							<SummaryItemPrice>$ -7.50</SummaryItemPrice>
						</SummaryItem>
						<SummaryItem type="total">
							<SummaryItemText>Total</SummaryItemText>
							<SummaryItemPrice>$ {cart.total}</SummaryItemPrice>
						</SummaryItem>

						<StripeCheckout
							name="BUTIQ."
							billingAddress
							shippingAddress
							description={`Your total is $${cart.total}`}
							amount={cart.total * 100}
							token={onToken}
							stripeKey={KEY}
						>
							{!!currentUser ? (
								<SummaryButton>CHECKOUT NOW</SummaryButton>
							) : (
								<Redirect to="/login" />
							)}
						</StripeCheckout>
					</Summary>
				</Button>
			</Wrapper>
			<Footer />
		</Container>
	);
};

export default Cart;
