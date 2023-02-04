import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import React, {
    forwardRef, useCallback, useImperativeHandle, useMemo, useState
} from "react";
import FileUpload from "react-material-file-upload";
import { checker, parseCSVFile } from "../utils";
import { ShowErrorAlert } from "./SnackBarAlert";

const UploadFile = forwardRef(({ headers = {} }, ref) => {
    const [importFile, setImportFile] = useState(null);

    const validateFile = useCallback(async (file) => {
        const fileData = await parseCSVFile(file);
        if (fileData.length) {
            const fileHeaders = Object.keys(fileData[0]).filter((header) => header).map((header) => header.toLowerCase());
            const requiredHeaders = Object.keys(headers).map((header) => header.toLowerCase());
            const isAllHeadersPresent = checker(requiredHeaders, fileHeaders);

            if (isAllHeadersPresent) {
                return true;
            }
        }

        ShowErrorAlert("Required headers are not present in the file. Please add and try again", 3000);
        return false;
    }, []);

    const handleOnChange = useCallback(async (files) => {
        if (files[0]) {
            const file = files[0];
            try {
                const isFileValid = await validateFile(file);
                if (isFileValid) {
                    setImportFile(file);
                } else {
                    setImportFile(null);
                }
            } catch {}
        } else {
            setImportFile(null);
        }
    }, []);

    const getFileData = useCallback(async () => {
        if (importFile) {
            let data = await parseCSVFile(importFile);
            data = data.map((row) => Object.keys(row).reduce((obj, key) => {
                if (key) {
                    obj[key.toLowerCase()] = row[key];
                }
                return obj;
            }, {}));
            const keys = Object.keys(headers);
            data = data.map((row) => keys.reduce((obj, key) => {
                obj[headers[key]] = row[key.toLowerCase()];
                return obj;
            }, {}));
            return data;
        }
        return null;
    }, [importFile]);

    useImperativeHandle(
        ref,
        () => ({
            getSelectedFile: () => importFile,
            getFileData
        }),
        [importFile]
    );

    return (
        <>
            <Alert severity="info" sx={{ mb: 2 }}>
                Please make sure the following headers are present in the file:
                <Typography variant="subtitle2">{Object.keys(headers).join(", ")}</Typography>
            </Alert>
            <FileUpload
                value={importFile ? [importFile] : []}
                onChange={handleOnChange}
                title="Drag and Drop the file here (or) select the file"
                buttonText={importFile ? "Change file" : "Select file"}
                typographyProps={{ variant: "subtitle1" }}
                accept=".csv"
            />
        </>
    );
});

export default UploadFile;
