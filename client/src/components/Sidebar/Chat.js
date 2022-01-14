import React from 'react'
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

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, user, activeConversation } = props;
  const { otherUser } = conversation;

  const numOfUnreadMessages = React.useMemo(() => calcUnreadMessages(conversation, user.id, activeConversation, props.patchMessageAsRead), [conversation, user.id, activeConversation, props.patchMessageAsRead]);

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
    if (numOfUnreadMessages) {
      const reqBody = {
        conversationId: conversation.id,
      };
      props.patchMessageAsRead(reqBody);
    }
    
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
      { numOfUnreadMessages && <Chip label={numOfUnreadMessages}  color="primary"/> }
    </Box>
  );
};

const calcUnreadMessages = (conversation, userID, activeConversation, patchMessageAsRead) => {
  let numOfUnreadMessages = 0;
  for (let message of conversation.messages) {
    if (!message.readYN && message.senderId !==userID) {
      numOfUnreadMessages++;
    }
  }
  if (numOfUnreadMessages === 0) {
    return null;
  }
  if (activeConversation && conversation.otherUser.username === activeConversation) {
    const reqBody = {
      conversationId: conversation.id,
    };
    patchMessageAsRead(reqBody);
    return null;
  }
  return numOfUnreadMessages;
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    patchMessageAsRead: (reqBody) => {
      dispatch(patchMessageAsRead(reqBody));
    }
  };
};

export default connect(null, mapDispatchToProps)(Chat);
