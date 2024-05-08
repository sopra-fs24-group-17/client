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
  Modal, 
  Box, 
  Typography, 
  IconButton
} from "@mui/material";
import Profile from "./Profile";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {getDomain} from '../../helpers/getDomain'
import placeholder from "components/game/profile_image_placeholder.webp";
import avatar1 from 'components/avatars/avatar1.webp'
import avatar2 from 'components/avatars/avatar2.webp'
import avatar3 from 'components/avatars/avatar3.webp'
import avatar4 from 'components/avatars/avatar4.webp'
import avatar5 from 'components/avatars/avatar5.webp'
import avatar6 from 'components/avatars/avatar6.webp'
import avatar7 from 'components/avatars/avatar7.webp'
import avatar8 from 'components/avatars/avatar8.webp'



import Select from "react-select";
import countryList from "react-select-country-list";
import { FlagIcon } from "react-flag-kit";

/*Excluded as these countries do not include a valid svg flag. Let's hope there is no exploding chicken enthusiast in Antarctica, Bonaire or Western Sahara*/
const excludedCountries = ["AQ", "BQ", "EH"];
const generateCountryOptions = () => {
  return countryList()
    .getData()
    .filter((country) => !excludedCountries.includes(country.value))
    .map((country) => ({
      value: country.label,
      label: (
        <>
          <FlagIcon code={country.value} size={16} style={{ marginRight: 8 }} />
          {country.label}
        </>
      ),
    }));
};

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

  const [countryOfOrigin, setCountryOfOrigin] = useState(null);
  const countryOptions = generateCountryOptions();

  const [avatarPlaceholder, setAvatarPlaceholder] = useState(
    placeholder
  );
  const [avatar, setAvatar] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const predefinedAvatars = [
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8
  ]

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
        setAvatar(fetchedUser.avatar);

        const visibility =
          fetchedUser.profilevisibility === "TRUE"
            ? ProfileVisibility.TRUE
            : ProfileVisibility.FALSE;
        setProfileVisibility(visibility);

        const selectedCountry = countryOptions.find(
          (country) => country.value === fetchedUser.countryoforigin
        );
        setCountryOfOrigin(selectedCountry || null);

      } catch (error) {
        console.error(`Failed to fetch user data: ${handleError(error)}`);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleUsernameChange = (event) => setUsername(event.target.value);

  const handleEmailChange = (event) => setEmail(event.target.value);

  const handleCountryChange = (selectedOption) => {
    setCountryOfOrigin(selectedOption);
  };

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

  const handleAvatarChange = (fullPath) => {
    setIsChanging(true);
    const filenameWithExt = fullPath.split('/').pop();
    const baseName = filenameWithExt.split('.')[0];
    import(`../../components/avatars/${baseName}.webp`)
    .then(image => {
      setAvatarPlaceholder(image.default);
      setAvatar(image.default);
      console.log(avatar)
    })
    .catch(e => console.error("Failed to load image:", e));

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

    // Only add fields to the update object if they are not empty
    if (avatar) {
      console.log("yes we have an avatar: ", avatar)
      updateData.avatar = avatar;
    }

    if (username && username.trim() !== "") {
      updateData.username = username;
      localStorage.setItem("username", username);
    }
    if (birthdate) {
      updateData.birthdate = birthdate;
    }
    if (email && email.trim() !== "") {
      updateData.email = email;
    }
    if (countryOfOrigin && countryOfOrigin !== "") {
      updateData.countryoforigin = countryOfOrigin.value;
    }
    updateData.profilevisibility =
      profilevisibility === ProfileVisibility.TRUE
        ? ProfileVisibility.TRUE
        : ProfileVisibility.FALSE;

    try {
      await api.put(
        `dashboard/${userId}/profile`,
        JSON.stringify(updateData),
        {
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
    } catch (error) {
      alert(`Updating profile failed: ${handleError(error)}`);
    }
  };


  if (!isEditing) {
    return <Profile userId={localStorage.getItem("id")} />;
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
            >
              <CardMedia
                sx={{ height: 300, width: 300 }}
                image={
                  isChanging || avatar === null
                    ? avatarPlaceholder
                    : avatar
                }
                title="profile"
                onClick={handleOpenModal}
              />

                <Modal
                  open={openModal}
                  onClose={handleCloseModal}
                  aria-labelledby="avatar-selection-modal"
                  aria-describedby="select-predefined-avatar"
                >
                  <Box sx={{
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    width: { xs: 300, sm: 400, md: 600 }, // Responsive width
                    bgcolor: 'background.paper', 
                    boxShadow: 24, 
                    p: 4
                  }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}> 
                      Select an avatar!
                    </Typography>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', // Creates a responsive grid
                      gap: 2, // Adjusts spacing between avatars
                      padding: 2
                    }}>
                      {predefinedAvatars.map((avatar, index) => (
                        <IconButton 
                          key={index} 
                          onClick={() => { handleAvatarChange(avatar); handleCloseModal(); }}
                          sx={{ p: 1 }}
                        >
                          <img src={avatar} alt={`Avatar ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
                        </IconButton>
                      ))}
                    </Box>
                  </Box>
                </Modal>


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

                {/* Country Selector */}
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs>
                    <Select
                      options={countryOptions}
                      value={countryOfOrigin}
                      onChange={handleCountryChange}
                      placeholder="Select your country"
                      styles={{
                        width: "500px",
                        container: (base) => ({
                          ...base,
                          zIndex: 9999
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999
                        })
                      }}
                    
                    />
                  </Grid>
                </Grid>

                {/* Birthdate Field */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Birthday (YYYY-MM-DD)"
                    format="YYYY-MM-DD"
                    defaultValue={dayjs(user.birthdate)}
                    onChange={handleBirthdateChange}
                    sx={{ width: "500px", marginBottom: "10px", marginTop: "10px" }}
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