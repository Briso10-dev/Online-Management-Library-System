import {body} from 'express-validator'

//verifying non empty users fields
export const userValidator = [
  body('name', 'Invalid does not Empty').not().isEmpty(),
  body('email','Inavalid does not Empty').not().isEmpty(),
  body('email', 'Invalid email').isEmail(),
  body('password', 'password does not Empty').not().isEmpty(),
  body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
]
// verifying non empty books fields
export const bookValidator = [
  body('title', 'Invalid does not Empty').not().isEmpty(),
  body('author','Inavalid does not Empty').not().isEmpty(),
  body('author','Inavalid should be in uppercase').not().isUppercase(),
  body('publicationYear', 'Year of publication does not Empty').not().isEmpty(),
  body('ISBN','Inavalid does not Empty').not().isEmpty(),
]