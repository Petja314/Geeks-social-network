import React from 'react';
import "../../css/login/login.css"
import {TypingEffects} from "../openAi/typing-effect";

// PLEASE MAKE SURE THAT YOU LOGIN WITH A RIGHT CREDENTIALS PROVIDED BELOW
// email : .....
// password : ....
const LoginReadMe = () => {
    return (
        <div className="container_brief">
            <h1  className="brief_title" > <TypingEffects text={"Welcome back to Geeks Network!"} speed={60}/></h1>

            <div className="login_details">
                <p>Login to your demo account with credentials : </p>
                <p>email :  free@samuraijs.com</p>
                <p>password : free</p>
            </div>

            <div className="network_brief">
                <h2 className="network_brief_title">Brief about geeks network</h2>
                <ul className="components_list">
                    <li>  <span>ASK AI</span>  - Swift Answers to Queries, Unleash the Power of Intelligent Conversations.</li>
                    <li> <span>FLOOD CHAT</span> - Live Developer Discussions, Elevate Coding Experience with Dynamic Real-Time Conversations.</li>
                    <li> <span>NEWS</span> - Tech Trends at Your Fingertips, Stay Informed, Inspired, and Connected to Evolving Technology.</li>
                    <li> <span>MESSENGER</span> - Seamless Communication, Anytime, Anywhere. Collaborate Effortlessly within the Developer Community.</li>
                    <li> <span>FRIENDS</span> - Expand Your Network, Build Community. Connect with Like-Minded Individuals, Foster Lasting Connections.</li>
                    <li> <span>USERS</span> - Join Thriving Developer Community. Connect, Exchange Ideas, and Collaborate on Exciting Projects.</li>
                    <li> <span>PROFILE</span> - Showcase Identity, Explore Others. Share Skills, Experiences, and Discover the Richness of Developer Ecosystem.</li>
                </ul>
            </div>

        </div>
    );
};

export default LoginReadMe;