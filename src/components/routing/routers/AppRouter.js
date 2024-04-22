import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { RegisterGuard } from "../routeProtectors/RegisterGuard";
import { GameGuard } from "../routeProtectors/GameGuard";
import { ForgotPasswordGuard } from "../routeProtectors/ForgotPasswordGuard";
import { ProfileGuard } from "../routeProtectors/ProfileGuard";
import Login from "../../views/Login";
import Register from "../../views/Register";
import Profile from "../../views/Profile";
import PasswordForgotten from "../../views/PasswordForgotten";
import Game from "../../views/Game";
import Drawer from "../../ui/Dashboard";
import { DashboardGuard } from "../routeProtectors/DashboardGuard";
import CreateGame from "../../views/CreateGame";
import FriendsList from "../../views/Friends";
import Lobby from "../../views/Lobby";
import GameJoinTestView from "../../views/GameJoinTestView";
import AllPlayers from "../../views/AllPlayers";
import Tutorial from "../../views/Tutorial";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterGuard />}>
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPasswordGuard />}>
          <Route path="/forgot-password" element={<PasswordForgotten />} />
        </Route>

        <Route path="/game/*" element={<GameGuard />}>
          <Route index element={<Game />} />
        </Route>

        <Route path="/dashboard/*" element={<DashboardGuard />}>
          <Route index element={<Drawer />} />
          <Route path="join-game" element={<CreateGame />} />
          <Route path="create-game" element={<CreateGame />} />
          <Route path="users/:userId" element={<Profile />} />
          <Route path="friends" element={<FriendsList />} />
          <Route path="all-players" element={<AllPlayers />} />
          <Route path="lobby/:gameId" element={<Lobby />} />
          <Route path="tutorial" element={<Tutorial />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/gameroom" element={<GameJoinTestView />} />
      </Routes>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
