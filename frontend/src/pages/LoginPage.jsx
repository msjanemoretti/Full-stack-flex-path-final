import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// parse jwt token
function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (e) {
        return null;
    }
}

export default function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log("Starting login request...");

            // STEP 1: login and get token
            const res = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                console.error("Login failed with status", res.status);
                alert("Login failed");
                return;
            }

            const data = await res.json();
            const token = data.token;
            console.log("Token received:", token);
            const payload = parseJwt(token);
            console.log("Decoded payload:", payload);

            if (!payload || !payload.sub) {
                console.error("Invalid token payload");
                alert("Invalid token");
                return;
            }

            // save token, roles, username
            localStorage.setItem("token", token);
            localStorage.setItem("username", payload.sub);
            localStorage.setItem("roles", JSON.stringify(payload.roles || []));

            // fetch user ID using token and payload.sub
            console.log("Fetching user ID using:", payload.sub);
            const userRes = await fetch(`http://localhost:8080/api/users/username/${payload.sub}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!userRes.ok) {
                console.error("Failed to fetch user ID:", userRes.status);
                alert("Could not get user ID");
                return;
            }

            const userData = await userRes.json();
            console.log("Fetched user data:", userData);

            localStorage.setItem("userId", userData.id);

            alert("Login successful!");
            if (onLogin) onLogin();
            navigate("/books");

        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong");
        }
    };
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

