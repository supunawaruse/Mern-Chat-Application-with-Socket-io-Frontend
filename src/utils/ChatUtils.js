export const findSender = (users, loggedInUser) => {
  if (users[0]._id === loggedInUser._id) {
    return users[1];
  } else {
    return users[0];
  }
}

export const isSameSender = (messages, m, i) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined)
  );
};

export const isLastMessage = (messages, i) => {
  return (
    i === messages.length - 1
  );
};
