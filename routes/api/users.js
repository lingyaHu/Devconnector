const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
// @route       POST api/users
// @desc        Register user
// @access      Public(No authorization is needed)
router.post(
  '/',
  [
    // check term + error message
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    // 验证完user所输入的：
    try {
      let user = await User.findOne({ email }); // 通过email查找用户是否存在
      if (user) {
        //如果存在了，那就不能被注册，错误代码跟上面信息误填/没填一样
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // 如果email没有重复，下一步就是根据req得到的信息，新建一个user档案
      // get user's gravatar
      const avatar = gravatar.url(email, {
        s: '200', //picture/string size
        r: 'pg', //picture rating
        d: 'mm', //default avatar
      });
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // encrypt password
      const salt = await bcrypt.genSalt(10); //数字：rounds，越大越安全也越慢
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id, //上面的user会给我一个promise，所以可以获取到它的id
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
