import React from "react";
import { Box, Typography, Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  previewTextUnread: {
    color: "#000000",
    fontWeight: "bold",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, numOfUnreadMessages } = props;
  const { latestMessageText, otherUser } = conversation;

  return (
    <Box className={classes.root}>
      <Badge badgeContent={numOfUnreadMessages}
          color="primary"
          className={classes.root}
          anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
      }} >
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={`${classes.previewText} ${numOfUnreadMessages && classes.previewTextUnread}`}>
          {latestMessageText}
        </Typography>
      </Box>
      </Badge>
    </Box>
  );
};

export default ChatContent;
