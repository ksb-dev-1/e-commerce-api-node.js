const createTokenUser = (user) => {
  return { userId: user._id, name: user.name, email: user.email, role: user.role };
};

export default createTokenUser;
