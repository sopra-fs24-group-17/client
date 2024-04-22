import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate } from "react-router-dom";
import User from "models/User";
import Layout from "../ui/LayoutLoginRegister";
import { TextField, Button, Typography, Container } from "@mui/material";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeToChannel,
} from "./WebsocketConnection";

const Tutorial = () => {
  


    return (
        <h1>Tutorial</h1>
    );
};

export default Tutorial;
