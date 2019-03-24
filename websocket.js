export const onNewMessage = (callback) => {
  setInterval(() => {
    callback('new message');
  }, 1000);
};
