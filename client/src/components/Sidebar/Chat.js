import React from "react";
import { Box, Chip } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { patchMessageAsRead } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  }
}));

  const calcUnreadMessages = (conversation) => {
    let numOfUnreadMessages = 0;
    for (let message of conversation.messages) {
      if (!message.readYN) {
        numOfUnreadMessages++;
      }
    }
    if (numOfUnreadMessages === 0) {
      return null;
    }
    return numOfUnreadMessages;
  };
  

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;
  console.log('check here:', calcUnreadMessages(conversation))
  const handleClick = async (conversation) => {
    console.log('CP: handleClick', conversation)
    await props.setActiveChat(conversation.otherUser.username);
    const reqBody = {
      conversationId: conversation.id,
    };
    //I think this is where to set the new action
    await patchMessageAsRead(reqBody);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
      {
      calcUnreadMessages(conversation) &&
      <Chip label={calcUnreadMessages(conversation)}  color="primary"/>
      }
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    }
  };
};

export default connect(null, mapDispatchToProps)(Chat);
