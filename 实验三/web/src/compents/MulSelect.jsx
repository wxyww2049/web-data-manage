import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const names = [
//   "Oliver Hansen",
//   "Van Henry",
//   "April Tucker",
//   "Ralph Hubbard",
//   "Omar Alexander",
//   "Carlos Abbott",
//   "Miriam Wagner",
//   "Bradley Wilkerson",
//   "Virginia Andrews",
//   "Kelly Snyder",
// ];

export default function MulSelect(props) {
  const { names, val, setVal, title } = props;

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    if (value.length == 0) {
      return;
    }
    setVal(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">{title}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={val}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
          size="small"
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={val.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
