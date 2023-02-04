import React, { useContext } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/system/Box";
import { useLocation, useNavigate } from "react-router-dom";
import { DrawerWidth, Menus } from "./utils";
import { UserContext } from "../../services";
import LeftMenuHeader from "./header";

export default function LeftMenu() {
    const location = useLocation();
    const navigate = useNavigate();

    const { userData } = useContext(UserContext);

    if (!userData.user) {
        return "";
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DrawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": { width: DrawerWidth, boxSizing: "border-box" }
            }}
        >
            <LeftMenuHeader />
            <Box sx={{ overflow: "auto" }}>
                <List>
                    {Menus.map((menu) => {
                        const selected = location.pathname.startsWith(`/${menu.id}`);
                        const { Icon } = menu;
                        return (
                            <ListItem
                                key={menu.id}
                                disablePadding
                                selected={selected}
                                onClick={() => navigate(`/${menu.id}`)}
                            >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Icon color={selected ? "primary" : ""} />
                                    </ListItemIcon>
                                    <ListItemText primary={menu.name} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    );
}
