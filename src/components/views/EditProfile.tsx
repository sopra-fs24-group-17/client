import React, { useRef, useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Grid,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Button,
  ToggleButton,
  Container,
} from "@mui/material";
import Profile from "./Profile";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { isCallChain } from "typescript";

const EditProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(true);
  const toggleEdit = () => setIsEditing(!isEditing);

  const [username, setUsername] = useState(null);
  const [birthdate, setBirthdate] = useState(null);
  const [email, setEmail] = useState("");
  const [countryoforigin, setCountry] = useState(null);

  const [avatarPlaceholder, setAvatarPlaceholder] = useState("/profile_image_placeholder.webp");
  const [avatarPath, setAvatarPath] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isChanging, setIsChanging] = useState(false);

  const [domain, setDomain] = useState(null);


  enum ProfileVisibility {
    TRUE,
    FALSE,
    // add other states as necessary
  }
  const [profilevisibility, setProfileVisibility] = useState(
    ProfileVisibility.TRUE
  );

  useEffect(() => {
    setDomain(process.env.REACT_APP_API_URL);

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/dashboard/${userId}/profile`, {
          headers: { token: token },
        });
        const fetchedUser = response.data;

        setUser(fetchedUser);
        if (fetchedUser.avatar && fetchedUser.avatar !== "") {
          const path = `/images/avatars/${fetchedUser.avatar.split('/').pop()}`;
          setAvatarPath(path);
        }

        const visibility = fetchedUser.profilevisibility === "TRUE" ? ProfileVisibility.TRUE : ProfileVisibility.FALSE;
        setProfileVisibility(visibility);
      } catch (error) {
        console.error(`Failed to fetch user data: ${handleError(error)}`);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleUsernameChange = (event) => setUsername(event.target.value);

  const handleEmailChange = (event) => setEmail(event.target.value);

  const handleCountryChange = (event) => setCountry(event.target.value);

  const handleBirthdateChange = (newValue) => {
    // Ensure newValue is valid and not null
    if (newValue && dayjs(newValue).isValid()) {
      // Adjust the date to compensate for the timezone offset
      const adjustedDate = dayjs(newValue)
        .add(dayjs(newValue).utcOffset(), "minute")
        .toDate();

      // Format the date as a string in 'YYYY-MM-DD' format if you want to store it as a string
      const formattedDate = dayjs(adjustedDate).format("YYYY-MM-DD");

      // Update the state
      setBirthdate(formattedDate);
    } else {
      // Handle invalid or null newValue as needed
    }
  };

  const handleAvatarChange = async (event) => {
    setIsChanging(true);

    if (event.target.files[0]) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      setAvatarPlaceholder(imageUrl);

      setAvatarFile(event.target.files[0]);
    }
};


  interface UpdateData {
    username?: string;
    birthdate?: string;
    email?: string;
    countryoforigin?: string;
    profilevisibility?: ProfileVisibility;
    avatar?: string;
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const updateData: UpdateData = {};

    if (avatarFile) {
      console.log("file exists")
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      try {
          // Make the API call using FormData
          const response = await api.post(`/dashboard/${userId}/profile/uploadAvatar`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  token: token,
              },
          });
          navigate(`/users/${userId}`);
          updateData.avatar = response.data;
      } catch (error) {
          alert(`Uploading avatar failed: ${error.message || 'Unknown error'}`);
      }
  }

    // Only add fields to the update object if they are not empty
    if (username && username.trim() !== "") {updateData.username = username;}
    if (birthdate) {updateData.birthdate = birthdate;}
    if (email && email.trim() !== "") {updateData.email = email;}
    if (countryoforigin && countryoforigin.trim() !== "") {      
      updateData.countryoforigin = countryoforigin;
    }
    updateData.profilevisibility = profilevisibility === ProfileVisibility.TRUE ? ProfileVisibility.TRUE : ProfileVisibility.FALSE;

    console.log(updateData);
    try {
      const profileResponse = await api.put(`dashboard/${userId}/profile`, JSON.stringify(updateData), {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      navigate(`/users/${userId}`);
    } catch (error) {
      alert(`Updating profile failed: ${handleError(error)}`);
    }
  };

  if (!isEditing) {
    return <Profile />;
  }

  if (user) {
    return (
      <Container maxWidth="xl">
        <Grid
          container
          style={{ minHeight: "100vh" }}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item sx={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                cursor: "pointer",
                marginRight: "20px",
                position: "relative",
              }}
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              <CardMedia
                sx={{ height: 300, width: 300 }}
                image={isChanging || avatarPath === null ? avatarPlaceholder : domain + avatarPath}
                title="profile"
              />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
                ref={fileInputRef}
              />
            </div>
            <Card style={{ width: "100%" }}>
              <CardContent>
                <CardActions sx={{ justifyContent: "center", marginBottom: 2 }}>
                  <ToggleButton
                    value="check"
                    size="small"
                    onChange={() => {
                      if (profilevisibility === ProfileVisibility.TRUE) {
                        setProfileVisibility(ProfileVisibility.FALSE);
                      } else {
                        setProfileVisibility(ProfileVisibility.TRUE);
                      }
                    }}
                    color="error"
                    sx={{
                      borderColor:
                        profilevisibility === ProfileVisibility.TRUE
                          ? "green"
                          : "red",
                      color: "black",
                      backgroundColor:
                        profilevisibility === ProfileVisibility.TRUE
                          ? "#c8e6c9"
                          : "#ffcdd2",
                    }}
                  >
                    {profilevisibility === ProfileVisibility.TRUE
                      ? "public profile"
                      : "friends only"}
                  </ToggleButton>
                </CardActions>

                {/* Username Field */}
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ marginBottom: "10px" }}
                >
                  <Grid item xs>
                    <TextField
                      fullWidth
                      label={"Username"}
                      value={username ? username : user.username}
                      onChange={handleUsernameChange}
                      onFocus={(event) => event.target.select()}
                      sx={{ width: "500px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>

                {/*<LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Birthday"
                                        inputFormat="yyyy-MM-dd"
                                        value={birthdate ? new Date(birthdate) : new Date(user.birthdate)}
                                        onChange={handleBirthdateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                onFocus={(event) => event.target.select()}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{ width: '500px', marginBottom: '10px' }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider> */}

                {/* Birthdate Field */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Birthday (YYYY-MM-DD)"
                    format="YYYY-MM-DD"
                    defaultValue={dayjs(user.birthdate)}
                    onChange={handleBirthdateChange}
                    sx={{ width: "500px", marginBottom: "10px" }}
                  />
                </LocalizationProvider>

                {/* Email Field */}
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  sx={{ marginBottom: "10px" }}
                >
                  <Grid item xs>
                    <TextField
                      fullWidth
                      label="Email"
                      value={email ? email : user.email}
                      onChange={handleEmailChange}
                      onFocus={(event) => event.target.select()}
                      sx={{ width: "500px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Country Field */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <TextField
                      fullWidth
                      label="Country"
                      value={
                        countryoforigin ? countryoforigin : user.countryoforigin
                      }
                      onChange={handleCountryChange}
                      onFocus={(event) => event.target.select()}
                      sx={{ width: "500px" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: "center", marginBottom: 2 }}>
                <Button variant="outlined" size="small" onClick={toggleEdit}>
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(event) => {
                    const doSubmit = async () => {
                      await handleSubmit(event);
                      toggleEdit();
                    };
                    doSubmit();
                  }}
                >
                  Save changes
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }
};

export default EditProfile;
