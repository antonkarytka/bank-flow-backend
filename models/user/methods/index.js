const Promise = require('bluebird');

const models = require('../../index');
const { sequelize } = models;


const fetchById = (id, options = {}) => {
  return sequelize.continueTransaction(options, () => {
    return models.User.findById(id, options)
  })
};


const fetch = (options = {}) => {
  options.where = {...options.where, ...options.params};
  options.limit = Number(options.limit) || 1000;
  options.offset = Number(options.offset) || 0;

  return sequelize.continueTransaction(options, () => {
    return models.User.findAndCountAll(options)
    .then(users => ({data: users.rows, total: users.count}))
  })
};


const updateOne = (where, content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.User.update(content, {where, ...options, individualHooks: true})
    .then(() => models.User.findById(content.id, {transaction}))
  })
};


const logIn = ({email, password}, options = {}) => {
  return sequelize.continueTransaction(options, () => {
    return models.User.find({
      where: {email},
      include: [{
        model: models.Role,
        as: 'role',
        attributes: ['name']
      }],
      ...options
    })
    .then(user => {
      if (!user) return Promise.reject(`Could not find user with email ${email}`);
      user = user.toJSON();

      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) return Promise.reject(`Provided password doesn't match the real one.`);

      return {
        user: {
          ...user,
          isAdmin: user.role.name === ADMIN
        },
        token: generateToken({userId: user.id}),
      }
    })
  })
};


const signUp = (content, options = {}) => {
  return sequelize.continueTransaction(options, () => {
    return models.User.fetchById(content.id, {...options})
    .then(user => {
      if (user) return Promise.reject(`User ${user.firstName} ${user.lastName} already exists.`);
      return models.Role.find({where: {name: USER}, options})
      .then(({id: roleId}) => models.User.create(
        {
          ...content,
          password: bcrypt.hashSync(content.password, 10),
          roleId
        },
        options
      ))
    })
    .then(({email}) => logIn({email, password: content.password}, {...options}))
  })
};


const sendEmails = (content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.User.fetchById(content.sender.id, options)
    .then(adminUser => {
      if (!adminUser) return Promise.reject('User doesn\'t exist.');
      const transporter = nodemailer.createTransport({
        service: mailerConfig.service,
        auth: {
          user: mailerConfig.user,
          pass: mailerConfig.pass
        }
      });

      return Promise.each(content.emails, email => {
        return models.User.fetchById(email.recipient.id, {transaction})
        .then(recipient => {
          if (!recipient) return Promise.resolve();

          const emailContent = parseEmailContent(email.content, recipient);

          const mailOptions = {
            from: mailerConfig.user,
            to: recipient.email,
            subject: email.subject,
            html: emailContent
          };

          return transporter.sendMail(mailOptions, (err, info) => {
            if (err) return console.log(err);
            else console.log(info);
          });
        })
      })
    })
    .then(() => Promise.resolve('Emails sent successfully.'))
  })
};


const deleteOne = (where, content, options = {}) => {
  return sequelize.continueTransaction(options, transaction => {
    return models.User.destroy(
      {where, ...options}
    )
  })
}


function parseEmailContent(content, user) {
  if (!content) return Promise.reject('Email\'s content must be provided.');
  if (!user) return Promise.reject('Recipient user must be provided.');

  return interpolate(content, user.toJSON());
}


module.exports = {
  fetchById,
  fetch,
  updateOne,
  deleteOne,
  logIn,
  signUp,
  sendEmails
};