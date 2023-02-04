import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonPinIcon from "@mui/icons-material/PersonPin";

export const DrawerWidth = 300;

export const Menus = [
    {
        id: "students",
        name: "Students",
        Icon: PeopleAltIcon
    },
    {
        id: "hospitals",
        name: "Hospitals",
        Icon: LocalHospitalIcon
    },
    {
        id: "schools",
        name: "Schools",
        Icon: SchoolIcon
    },
    {
        id: "instructors",
        name: "Instructors",
        Icon: PersonIcon
    },
    {
        id: "placement-locations",
        name: "Placement Locations",
        Icon: LocationOnIcon
    },
    {
        id: "placements",
        name: "Placements",
        Icon: PersonPinIcon
    }
];
