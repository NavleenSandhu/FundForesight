// get user id from cookies
const getUserId = async (token) => {
  const res = await fetch(`${process.env.AUTH_URL}/getUserId`, {
    headers: {
      auth_token: token,
    },
  });
  const data = await res.json();

  if (res.ok) {
    return data.user_id;
  } else {
    throw new Error(data.error);
  }
};

const getLoginToken = async (email, password) => {
  const res = await fetch(`${process.env.AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    return data.token;
  } else {
    throw new Error(data.error);
  }
};

const getRegisterToken = async (email, username, password) => {
  console.log(process.env.AUTH_URL);

  const res = await fetch(`${process.env.AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  if (res.ok) {
    const data = await res.json();
    return data.token;
  } else {
    throw new Error(await res.text());
  }
};

module.exports = {
  getUserId,
  getLoginToken,
  getRegisterToken,
};
