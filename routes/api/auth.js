const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');

// @route       Get api/auth
// @desc        Test route
// @access      Public(No authorization is needed)
router.get('/', auth, async (req, res) => {
  //使用auth，只用把它放在argument里的第二个
  try {
    //这里的req.user.id是在middleware里的设置的，用select去除掉返回的password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// 验证身份+登陆
// @route       POST api/auth
// @desc        Authenticate user & get token
// @access      Public(No authorization is needed)
router.post(
  '/',
  [
    // 与注册不同，不需要名字，不要求输入密码的长度
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    // 验证完user所输入的：
    try {
      let user = await User.findOne({ email }); // 通过email查找用户是否存在
      if (!user) {
        //如果不存在，就不能登录
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      // 邮箱存在了，要验证密码是否匹配(前者是req里的，后者是根据邮箱找到的user的密码)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id, //上面的user会给我一个promise，所以可以获取到它的id
        },
      };
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600 },
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
