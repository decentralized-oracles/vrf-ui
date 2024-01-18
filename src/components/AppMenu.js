import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import burger_svg from "../images/burger.svg"

export function AppMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{float:"right"}}
      >
        <img style={{width: "30px", filter: "invert(1)"}} src={burger_svg}/>
      </Button>
      <Menu
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <a href="/vrf"><MenuItem>VRF</MenuItem></a>
        <a href="/price-feed"><MenuItem>Price Feed</MenuItem></a>
        <a href="/graph-api"><MenuItem>Graph API</MenuItem></a>
      </Menu>
    </div>
  );
}