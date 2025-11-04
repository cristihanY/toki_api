const {Strategy} = require('passport-local');
const { verifyBasicPassword } = require('../../../utils/passHashUtil');
const userRepo = require('../../../repository/userRepository');

const LocalStrategy = new Strategy( async (username, password, done) => {
    try {
      const user = await userRepo.findByUserName(username);
       if (!user) {
            return done(null, false, { message: "User not found" });
        }

       const isValid = await verifyBasicPassword(password, user.password_hash);
        if (!isValid) {
            return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);

    } catch (error) {
        done(error, false);
    }
});

module.exports = LocalStrategy;