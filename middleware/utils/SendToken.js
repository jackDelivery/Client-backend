const sendToken = (res, user, statusCode, message) => {
    const token = user.getJWTToken();

    // const options = {
    //   httpOnly: true,
    //   expires: new Date(
    //     Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    //   ),
    // };

    const userData = {
        _id: user._id,
        email: user.email,
        password: user.password,
        gender: user.gender,
        age: user.age,
        token: token
    };

    res
        .status(statusCode)
        .json({ success: true, message, user: userData });
};


module.exports = { sendToken }