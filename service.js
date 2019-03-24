export const login = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve('logged');
  }, 1000);
});

export const loginThatFail = () => new Promise((_, reject) => {
  setTimeout(() => {
    reject();
  }, 1000);
});

