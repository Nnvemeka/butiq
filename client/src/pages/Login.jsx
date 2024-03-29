import styled from "styled-components";
import { mobile } from "../responsive";
import { useState } from "react";
import { login } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../redux/userRedux";

const Container = styled.div`
	width: 100vw;
	height: 100vh;
	background-color: #f0fafd;
	display: flex;
	align-items: center;
	justify-content: center;
	${mobile({ paddingTop: "120px", alignItems: "start" })}
`;

const Logo = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	text-transform: uppercase;
	transform: translate(50%, 70%);
	font-size: 30px;
	cursor: pointer;
`;

const Wrapper = styled.div`
	padding: 20px;
	width: 30%;
	background-color: #f0fafd;
	${mobile({ width: "80%" })}
`;

const Title = styled.h1`
	font-size: 24px;
	font-weight: 300;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
`;

const Input = styled.input`
	flex: 1;
	min-width: 40%;
	margin: 10px 0px;
	padding: 10px;
`;

const Button = styled.button`
	width: 100%;
	border: none;
	padding: 15px 20px;
	background-color: black;
	color: white;
	cursor: pointer;
	&:disabled {
		color: black;
		cursor: not-allowed;
	}
`;
const LinkContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;
const Links = styled.a`
	margin: 5px 0px;
	font-size: 12px;
	cursor: pointer;
`;

const Error = styled.span`
	color: red;
`;

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const currentUser = useSelector(selectCurrentUser);

	const handleClick = (e) => {
		e.preventDefault();
		login(dispatch, { username, password });
	};
	return (
		<Container>
			<Link style={{ color: "black" }} to={"/"}>
				<Logo>Butiq.</Logo>
			</Link>
			<Wrapper>
				<Title>SIGN IN</Title>
				<Form>
					<Input
						placeholder="username"
						onChange={(e) => setUsername(e.target.value)}
					/>
					<Input
						placeholder="password"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button onClick={handleClick} disabled={currentUser?.isFetching}>
						LOGIN
					</Button>
					{currentUser?.error && (
						<Error>Error logging in! Enter correct credentials.</Error>
					)}
					<LinkContainer>
						<Links>FORGOT PASSWORD?</Links>
						<Link
							to="/register"
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<Links>SIGN UP</Links>
						</Link>
					</LinkContainer>
				</Form>
			</Wrapper>
		</Container>
	);
};

export default Login;
