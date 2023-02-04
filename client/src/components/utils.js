import { green, blue } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import Papa from "papaparse";
import React from "react";

export const FETCH_LIMIT = 50;

const EmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isValidEmailAddress = (email) => EmailRegex.test(String(email).toLowerCase());

export const getYearsList = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => `${currentYear - i}`);
};

export const TermsList = ["Fall", "Winter", "Inter Summer"];

export const parseCSVFile = (file) => new Promise((resolve, reject) => {
    Papa.parse(file, {
        header: true,
        // transformHeader: (header) => header.toLowerCase(),
        complete(results) {
            resolve(results.data);
        },
        error(err) {
            reject(err);
        }
    });
});

export const checker = (arr, target) => arr.every((value) => target.includes(value.toLowerCase()));

export const HOSPITAL_IMPORT_REQUIRED_HEADERS = {
    Name: "name",
    Campus: "campus",
    Address: "address"
};

export const SCHOOL_IMPORT_REQUIRED_HEADERS = {
    Name: "name",
    Campus: "campus"
};

export const INSTRUCTOR_IMPORT_REQUIRED_HEADERS = {
    "First Name": "fname",
    "Last Name": "lname",
    "Email Address": "email",
    Comments: "comments"
};

export const STUDENT_IMPORT_REQUIRED_HEADERS = {
    "First Name": "fname",
    "Last Name": "lname",
    "Student ID": "studentId",
    Email: "email",
    // "Phone Number": "phoneNumber",
    // "School Name": "schoolName",
    // "School Campus": "schoolCampus",
    Year: "year",
    Term: "term",
    Notes: "notes"
};

export const PLACEMENT_LOCATIONS_REQUIRED_HEADERS = {
    Campus: "campus",
    Instructor: "instructor",
    Unit: "unit",
    Section: "section",
    Day: "day",
    Shift: "shift",
    Seats: "seats"
};

export const getStatusText = (status = "created", props = {}) => {
    switch (status) {
        case "confirmed":
            return <Typography {...props} color={green[500]}>CONFIRMED</Typography>;
        default:
            return <Typography {...props} color={blue[500]}>YET TO CONFIRM</Typography>;
    }
};

export const toDefaultDateFormat = (date, includeTime = false) => {
    // convert to "mm/dd/yy" format
    const dateMonth = date.getMonth() + 1; // 10
    const dateDay = date.getDate(); // 30
    const dateYear = date.getFullYear();

    return `${dateMonth}/${dateDay}/${dateYear}`;
};
